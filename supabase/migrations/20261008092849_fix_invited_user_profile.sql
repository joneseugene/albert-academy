-- ============================================================
-- Fix new Auth user profile creation
--
-- Invited/new users:
--   - are inactive until email confirmation
--   - receive the requested role when a valid role_id is
--     supplied in raw_user_meta_data
--   - otherwise receive the basic "user" role
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    default_role_id uuid;
    requested_role_id uuid;
    assigned_role_id uuid;
begin

    -- Get the default user role.
    select id
    into default_role_id
    from public.roles
    where name = 'user'
    limit 1;

    if default_role_id is null then
        raise exception 'Default user role does not exist';
    end if;


    -- Read the requested role from Auth metadata.
    begin
        requested_role_id := nullif(
            new.raw_user_meta_data ->> 'role_id',
            ''
        )::uuid;
    exception
        when invalid_text_representation then
            requested_role_id := null;
    end;


    -- Use the requested role only when it exists.
    if requested_role_id is not null
       and exists (
           select 1
           from public.roles
           where id = requested_role_id
       )
    then
        assigned_role_id := requested_role_id;
    else
        assigned_role_id := default_role_id;
    end if;


    -- Create the profile as INACTIVE.
    --
    -- The confirmation trigger will activate the profile
    -- after the user's email has been confirmed.
    insert into public.profiles (
        id,
        role_id,
        first_name,
        last_name,
        email,
        is_active
    )
    values (
        new.id,
        assigned_role_id,
        nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
        new.email,
        false
    );


    return new;
end;
$$;


-- ============================================================
-- Recreate Auth user trigger
-- ============================================================

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ============================================================
-- Function permissions
-- ============================================================

revoke all
on function public.handle_new_user()
from public;

grant execute
on function public.handle_new_user()
to postgres;