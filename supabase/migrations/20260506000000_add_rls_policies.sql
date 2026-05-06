-- Enable RLS on tables
alter table public.activities_history enable row level security;
alter table public.profiles enable row level security;
alter table public.race_calendar enable row level security;

-- Enforce NOT NULL on user_id columns
alter table public.activities_history
  alter column user_id set not null;

alter table public.race_calendar
  alter column user_id set not null;

-- activities_history policies
create policy "ah_select_own"
on public.activities_history
for select
to authenticated
using (auth.uid() = user_id);

create policy "ah_insert_own"
on public.activities_history
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ah_update_own"
on public.activities_history
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ah_delete_own"
on public.activities_history
for delete
to authenticated
using (auth.uid() = user_id);

-- profiles policies
create policy "p_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "p_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "p_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "p_delete_own"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);

-- race_calendar policies
create policy "rc_select_own"
on public.race_calendar
for select
to authenticated
using (auth.uid() = user_id);

create policy "rc_insert_own"
on public.race_calendar
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "rc_update_own"
on public.race_calendar
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "rc_delete_own"
on public.race_calendar
for delete
to authenticated
using (auth.uid() = user_id);
