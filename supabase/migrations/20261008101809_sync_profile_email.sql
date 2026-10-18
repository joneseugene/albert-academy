-- ============================================================
-- Keep profiles.email synchronized with auth.users.email
-- ============================================================

create or replace function public.handle_auth_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if old.email is distinct from new.email then
        update public.profiles
        set
            email = new.email,
            updated_at = now()
        where id = new.id;
    end if;

    return new;
end;
$$;


drop trigger if exists on_auth_user_email_changed
on auth.users;

create trigger on_auth_user_email_changed
after update of email
on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.handle_auth_user_email_change();


revoke all
on function public.handle_auth_user_email_change()
from public;

grant execute
on function public.handle_auth_user_email_change()
to postgres;