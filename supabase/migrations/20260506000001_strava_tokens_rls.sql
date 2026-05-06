-- strava_tokens: Enable RLS (tokens never accessible from client — service role only)
alter table public.strava_tokens enable row level security;

-- No client-facing policies: all access via service role key in Edge Functions.
-- Deny all direct client access explicitly.
create policy "st_deny_all_select"
on public.strava_tokens
for select
to authenticated
using (false);

create policy "st_deny_all_insert"
on public.strava_tokens
for insert
to authenticated
with check (false);

create policy "st_deny_all_update"
on public.strava_tokens
for update
to authenticated
using (false)
with check (false);

create policy "st_deny_all_delete"
on public.strava_tokens
for delete
to authenticated
using (false);
