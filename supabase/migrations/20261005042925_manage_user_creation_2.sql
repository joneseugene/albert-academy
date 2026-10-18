-- ============================================================
-- Automatically create a profile whenever an Auth user is
-- created.
--
-- New users always receive the basic "user" role.
--
-- IMPORTANT:
-- The selected administrative role is assigned separately by
-- the trusted Super Admin server service.
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

    select id
    into default_role_id
    from public.roles
    where name = 'user'
    limit 1;

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