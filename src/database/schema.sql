-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- PRODUCTS
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10,2) not null,
  promotional_price decimal(10,2),
  discount_percent numeric default 0, -- Desconto percentual (0-100)
  image_urls text[], -- Array of URLs
  sizes text[], -- Array de tamanhos disponíveis (ex: ['P', 'M', 'G', 'GG'])
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- RLS POLICIES (Rule-03)
alter table categories enable row level security;
alter table products enable row level security;

-- Public Read Access
create policy "Public can view categories" on categories
  for select using (true);

create policy "Public can view products" on products
  for select using (true);

-- Block Client Writes (Rule-01: Zero Direct Writing)
-- Writes must be done via Service Role in API
-- No policies for INSERT/UPDATE/DELETE implies DENY by default for Anon/Authenticated

-- STORAGE (Task 1)
-- Note: You must create the bucket 'products' in the Supabase Dashboard if this fails.
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects 
  for select using ( bucket_id = 'products' );

-- Only allow authenticated uploads (if we allowed client uploads, but we stick to Server Actions/API)
create policy "Authenticated Export" on storage.objects
  for insert with check ( bucket_id = 'products' and auth.role() = 'authenticated' );
