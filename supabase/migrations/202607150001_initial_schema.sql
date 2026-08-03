create extension if not exists "pgcrypto";

create type public.content_status as enum ('draft', 'published');
create type public.profile_role as enum ('owner');
create type public.inquiry_status as enum ('new', 'read', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.profile_role not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id boolean primary key default true check (id),
  company_name text not null default 'Digital Visions',
  tagline text not null default 'Websites with a clearer point of view.',
  intro text not null default 'Digital Visions designs, rebuilds, and cares for considered websites.',
  location_label text not null default 'Cape Town, serving South Africa',
  contact_email text,
  phone text,
  analytics_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.site_settings (id) values (true);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 100),
  description text not null check (char_length(description) between 10 and 1000),
  deliverables text[] not null default '{}',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table public.pricing_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 100),
  description text not null check (char_length(description) between 10 and 1000),
  starting_price numeric(12, 2) check (starting_price is null or starting_price >= 0),
  currency text not null default 'ZAR' check (char_length(currency) = 3),
  qualifier text not null default 'Starting from',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null check (char_length(summary) between 10 and 1000),
  challenge text,
  approach text,
  outcome text,
  project_url text check (project_url is null or project_url ~ '^https?://'),
  services text[] not null default '{}',
  testimonial_quote text,
  testimonial_author text,
  testimonial_role text,
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  display_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt text not null check (char_length(alt) between 2 and 240),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table public.legal_pages (
  slug text primary key check (slug in ('privacy', 'terms')),
  title text not null,
  content text not null,
  is_published boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  business_name text,
  email text not null check (char_length(email) between 3 and 320),
  phone text,
  project_type text,
  budget text,
  message text not null check (char_length(message) between 10 and 5000),
  status public.inquiry_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_public_idx on public.projects (status, is_featured desc, display_order, published_at desc);
create index project_images_project_idx on public.project_images (project_id, sort_order);
create index contact_submissions_status_idx on public.contact_submissions (status, created_at desc);

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services for each row execute function public.set_updated_at();
create trigger pricing_items_updated_at before update on public.pricing_items for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger contact_submissions_updated_at before update on public.contact_submissions for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.pricing_items enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.legal_pages enable row level security;
alter table public.contact_submissions enable row level security;

create policy "owners manage own profile" on public.profiles for all using (id = auth.uid() and public.is_owner()) with check (id = auth.uid() and public.is_owner());
create policy "public reads site settings" on public.site_settings for select using (true);
create policy "owner manages site settings" on public.site_settings for all using (public.is_owner()) with check (public.is_owner());
create policy "public reads visible services" on public.services for select using (is_visible);
create policy "owner manages services" on public.services for all using (public.is_owner()) with check (public.is_owner());
create policy "public reads visible pricing" on public.pricing_items for select using (is_visible);
create policy "owner manages pricing" on public.pricing_items for all using (public.is_owner()) with check (public.is_owner());
create policy "public reads published projects" on public.projects for select using (status = 'published');
create policy "owner manages projects" on public.projects for all using (public.is_owner()) with check (public.is_owner());
create policy "public reads project images for published projects" on public.project_images for select using (exists (select 1 from public.projects where projects.id = project_images.project_id and projects.status = 'published'));
create policy "owner manages project images" on public.project_images for all using (public.is_owner()) with check (public.is_owner());
create policy "public reads published legal pages" on public.legal_pages for select using (is_published);
create policy "owner manages legal pages" on public.legal_pages for all using (public.is_owner()) with check (public.is_owner());
create policy "owner reads inquiries" on public.contact_submissions for select using (public.is_owner());
create policy "owner updates inquiries" on public.contact_submissions for update using (public.is_owner()) with check (public.is_owner());

insert into storage.buckets (id, name, public) values ('project-media', 'project-media', false)
on conflict (id) do update set public = excluded.public;

create policy "public reads published media" on storage.objects for select using (
  bucket_id = 'project-media'
  and exists (
    select 1
    from public.project_images
    join public.projects on projects.id = project_images.project_id
    where project_images.storage_path = storage.objects.name
      and projects.status = 'published'
  )
);
create policy "owner manages project media" on storage.objects for all using (bucket_id = 'project-media' and public.is_owner()) with check (bucket_id = 'project-media' and public.is_owner());