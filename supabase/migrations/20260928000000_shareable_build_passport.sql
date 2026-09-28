-- Public sharing is an owner-created, revocable snapshot. Neither the vehicle
-- table nor its photos, documents, VIN, mileage or activity notes become public.
create table public.passport_shares (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  snapshot jsonb not null,
  selected_activity_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index passport_shares_one_active_per_vehicle
  on public.passport_shares(vehicle_id) where revoked_at is null;
create index passport_shares_vehicle_id_idx on public.passport_shares(vehicle_id);

alter table public.passport_shares enable row level security;
revoke all on public.passport_shares from public, anon, authenticated;
grant select on public.passport_shares to authenticated;
create policy "Owners can see their share links" on public.passport_shares
  for select to authenticated using (
    exists (
      select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
      where v.id = passport_shares.vehicle_id and w.owner_id = (select auth.uid())
    )
  );

-- The caller picks installed activity IDs. The database assembles the allowlisted
-- public shape, so a client cannot insert arbitrary private fields in a snapshot.
create function public.publish_passport_share(p_vehicle_id uuid, p_activity_ids uuid[] default '{}')
returns text language plpgsql security definer set search_path = '' as $$
declare
  v public.vehicles%rowtype;
  selected_count integer;
  parts jsonb;
  new_token text;
begin
  select v0.* into v from public.vehicles v0
    join public.workspaces w on w.id = v0.workspace_id
    where v0.id = p_vehicle_id and w.owner_id = (select auth.uid()) and v0.archived_at is null;
  if not found then raise exception 'Vehicle unavailable'; end if;
  if p_activity_ids is null or cardinality(p_activity_ids) > 30 then
    raise exception 'Select at most 30 installed parts';
  end if;
  if cardinality(p_activity_ids) <> (
    select count(distinct id) from unnest(p_activity_ids) as ids(id)
  ) then raise exception 'Duplicate activity selection'; end if;

  select count(*), coalesce(jsonb_agg(jsonb_build_object('title', a.title)
    order by a.activity_date desc, a.id), '[]'::jsonb)
    into selected_count, parts from public.activities a
    where a.id = any(p_activity_ids) and a.vehicle_id = p_vehicle_id
      and a.activity_type = 'Installed Part' and a.archived_at is null;
  if selected_count <> cardinality(p_activity_ids) then
    raise exception 'Invalid installed part selection';
  end if;

  -- Serialize publish/revoke on the vehicle row to preserve one active link.
  perform 1 from public.vehicles where id = p_vehicle_id for update;
  update public.passport_shares set revoked_at = now()
    where vehicle_id = p_vehicle_id and revoked_at is null;
  insert into public.passport_shares(vehicle_id, selected_activity_ids, snapshot)
    values (p_vehicle_id, p_activity_ids, jsonb_build_object(
      'year', v.year, 'make', v.make, 'model', v.model,
      'installedParts', parts
    )) returning token into new_token;
  return new_token;
end;
$$;

create function public.revoke_passport_share(p_vehicle_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
    where v.id = p_vehicle_id and w.owner_id = (select auth.uid()) for update of v;
  if not found then raise exception 'Vehicle unavailable'; end if;
  update public.passport_shares set revoked_at = now()
    where vehicle_id = p_vehicle_id and revoked_at is null;
end;
$$;

-- Token possession authorizes reading the curated snapshot only. Unknown and
-- revoked tokens both yield null, without exposing the owning vehicle ID.
create function public.read_passport_share(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select s.snapshot from public.passport_shares s
    where s.token = p_token and s.revoked_at is null;
$$;

revoke execute on function public.publish_passport_share(uuid, uuid[]) from public, anon;
revoke execute on function public.revoke_passport_share(uuid) from public, anon;
revoke execute on function public.read_passport_share(text) from public;
grant execute on function public.publish_passport_share(uuid, uuid[]) to authenticated;
grant execute on function public.revoke_passport_share(uuid) to authenticated;
grant execute on function public.read_passport_share(text) to anon, authenticated;
