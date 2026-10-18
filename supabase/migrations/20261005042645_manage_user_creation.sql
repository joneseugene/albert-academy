-- ============================================================
-- Automatically create a profile when a new auth user is
-- created.
--
-- The selected role is passed through:
-- raw_user_meta_data -> role_id
--
-- If no role is supplied, the user receives the basic
-- "user" role.
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
begin

    -- Get the basic default role.
    select id
    into default_role_id
    from public.roles
    where name = 'user'
    limit 1;

    if default_role_id is null then
        raise exception 'Default user role does not exist';
    end if;


    -- Try to get the role selected by the creator.
    requested_role_id := nullif(
        new.raw_user_meta_data ->> 'role_id',
        ''
    )::uuid;


    -- Use the selected role if supplied and valid.
    -- Otherwise fall back to the basic user role.
    if requested_role_id is not null
       and exists (
           select 1
           from public.roles
           where id = requested_role_id
       )
    then
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
            requested_role_id,
            nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
            nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
            new.email,
            true
        );
    else
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
            default_role_id,
            nullif(trim(new.raw_user_meta_data ->> 'first_name'), ''),
            nullif(trim(new.raw_user_meta_data ->> 'last_name'), ''),
            new.email,
            true
        );
    end if;


    return new;
end;
$$;


-- ============================================================
-- Recreate Auth trigger
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