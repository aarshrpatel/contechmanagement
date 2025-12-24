-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

alter table profiles enable row level security;

create policy "Users can view their own profile." on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- PROJECTS
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null default auth.uid(),
  name text not null,
  location text not null,
  budget numeric not null default 0,
  spent numeric not null default 0,
  phase text not null, -- Acquisition, Entitlement, etc.
  start_date date,
  completion_date date,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table projects enable row level security;

create policy "Users can view their own projects." on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects." on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects." on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects." on projects
  for delete using (auth.uid() = user_id);

-- BUDGET CATEGORIES (e.g., Land Acquisition, Hard Costs)
create table budget_categories (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  allocated numeric not null default 0,
  status text not null default 'on-track', -- on-track, at-risk, over-budget
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table budget_categories enable row level security;

create policy "Users can view categories for their projects." on budget_categories
  for select using (exists (select 1 from projects where id = budget_categories.project_id and user_id = auth.uid()));

create policy "Users can insert categories for their projects." on budget_categories
  for insert with check (exists (select 1 from projects where id = budget_categories.project_id and user_id = auth.uid()));

-- BUDGET ITEMS (e.g., Concrete Foundation)
create table budget_items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references budget_categories(id) on delete cascade not null,
  name text not null,
  vendor text,
  estimated numeric not null default 0,
  actuals numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table budget_items enable row level security;

create policy "Users can view items for their projects." on budget_items
  for select using (exists (
    select 1 from budget_categories 
    join projects on projects.id = budget_categories.project_id 
    where budget_categories.id = budget_items.category_id and projects.user_id = auth.uid()
  ));

create policy "Users can insert items for their projects." on budget_items
  for insert with check (exists (
    select 1 from budget_categories 
    join projects on projects.id = budget_categories.project_id 
    where budget_categories.id = budget_items.category_id and projects.user_id = auth.uid()
  ));

-- INVOICES
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  budget_item_id uuid references budget_items(id) on delete cascade not null,
  description text not null,
  amount numeric not null default 0,
  date date not null,
  status text not null default 'pending', -- paid, pending
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table invoices enable row level security;

create policy "Users can view invoices for their projects." on invoices
  for select using (exists (
    select 1 from budget_items
    join budget_categories on budget_categories.id = budget_items.category_id
    join projects on projects.id = budget_categories.project_id
    where budget_items.id = invoices.budget_item_id and projects.user_id = auth.uid()
  ));

create policy "Users can insert invoices for their projects." on invoices
  for insert with check (exists (
    select 1 from budget_items
    join budget_categories on budget_categories.id = budget_items.category_id
    join projects on projects.id = budget_categories.project_id
    where budget_items.id = invoices.budget_item_id and projects.user_id = auth.uid()
  ));

-- DOCUMENTS
create table documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  type text not null, -- PDF, DWG, etc.
  category text not null, -- Contracts, Permits, etc.
  size text,
  date date,
  step_id text, -- Links to roadmap step
  file_path text not null, -- Supabase Storage path
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table documents enable row level security;

create policy "Users can view documents for their projects." on documents
  for select using (exists (select 1 from projects where id = documents.project_id and user_id = auth.uid()));

create policy "Users can insert documents for their projects." on documents
  for insert with check (exists (select 1 from projects where id = documents.project_id and user_id = auth.uid()));

-- STORAGE BUCKET POLICIES (Handled via SQL for convenience if possible, or manual setup)
-- Note: You usually need to create the bucket 'project-files' in the Supabase Dashboard.
-- But we can try to insert into storage.buckets if the user has permissions, though often this is restricted.
-- We will assume the bucket 'project-files' exists for these policies:

-- Storage policies need to be set on storage.objects
-- create policy "Authenticated users can upload project files" on storage.objects
--   for insert with check ( bucket_id = 'project-files' and auth.role() = 'authenticated' );

-- create policy "Users can view their own project files" on storage.objects
--   for select using ( bucket_id = 'project-files' and auth.uid() = owner );
