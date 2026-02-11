# RLS policy templates

## Default user-scoped table

```sql
alter table if exists public.<TABLE> enable row level security;

create policy "Users can view their own <TABLE>" on public.<TABLE>
  for select using (auth.uid() = user_id);

create policy "Users can insert their own <TABLE>" on public.<TABLE>
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own <TABLE>" on public.<TABLE>
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own <TABLE>" on public.<TABLE>
  for delete using (auth.uid() = user_id);

create index if not exists <TABLE>_user_id_idx on public.<TABLE>(user_id);
```

## Secret-bearing tables

Prefer: deny direct select to clients; expose server endpoints only.
