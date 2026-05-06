-- Performance indexes for common query patterns

-- activities_history: fetch by user, ordered by import date
create index if not exists idx_activities_history_user_id
  on public.activities_history (user_id, imported_at desc);

-- race_calendar: fetch upcoming races for a user
create index if not exists idx_race_calendar_user_date
  on public.race_calendar (user_id, date asc);

-- strava_tokens: lookup by user (primary key, but explicit for clarity)
create index if not exists idx_strava_tokens_user_id
  on public.strava_tokens (user_id);

-- profiles: already has primary key on id, no extra index needed
