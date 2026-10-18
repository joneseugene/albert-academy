-- ============================================================
-- Automatically create a profile when a new auth user is
-- created.
--
-- New users receive the basic "user" role by default.
-- Super admins can later change the user's role.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    default_role_id uuid;
begin

    -- Get the default role for newly registered users.
    select id
    into default_role_id
    from public.roles
    where name = 'user'
    limit 1;

    -- Fail explicitly if the default role does not exist.
    if default_role_id is null then
        raise exception 'Default user role does not exist';
    end if;

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

    return new;
end;
$$;


-- ============================================================
-- Recreate the Auth user trigger
-- ============================================================

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ============================================================
-- Allow the trigger function to access the required tables.
-- ============================================================

revoke all
on function public.handle_new_user()
from public;

grant execute
on function public.handle_new_user()
to postgres;