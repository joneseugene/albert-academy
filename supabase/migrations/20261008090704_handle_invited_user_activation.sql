-- ============================================================
-- Handle invited user activation
-- ============================================================

-- New profiles should be inactive by default.
alter table public.profiles
  alter column is_active set default false;


-- ============================================================
-- Activate profile when Auth email is confirmed
-- ============================================================

create or replace function public.handle_auth_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only activate the application profile when the user's
  -- email changes from unconfirmed to confirmed.
  if old.email_confirmed_at is null
     and new.email_confirmed_at is not null then

    update public.profiles
    set
      is_active = true,
      updated_at = now()
    where id = new.id;

  end if;

  return new;
end;
$$;


drop trigger if exists on_auth_user_confirmed
on auth.users;


create trigger on_auth_user_confirmed
after update of email_confirmed_at
on auth.users
for each row
execute function public.handle_auth_user_confirmed();


-- ============================================================
-- Remove the incorrect policy from the previous version
-- ============================================================

drop policy if exists "Users can view own active profile"
on public.profiles;

drop policy if exists "Super admins can manage profiles"
on public.profiles;


-- ============================================================
-- Ensure super admins can manage profiles
-- ============================================================

drop policy if exists "super_admin_manage_profiles"
on public.profiles;

create policy "super_admin_manage_profiles"
on public.profiles
for all
to authenticated
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);