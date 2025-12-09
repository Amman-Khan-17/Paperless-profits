-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Books Table
create table public.books (
  id bigint generated always as identity primary key,
  isbn text,
  title text,
  author text,
  publisher text,
  category text,
  price numeric,
  stock integer
);

-- Customers Table
create table public.customers (
  id bigint generated always as identity primary key,
  name text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  total_orders integer default 0
);

-- Suppliers Table
create table public.suppliers (
  id bigint generated always as identity primary key,
  name text,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  total_supplies integer default 0
);

-- Stationary Table
create table public.stationary (
  id bigint generated always as identity primary key,
  name text,
  category text,
  price numeric,
  stock integer,
  supplier text
);

-- Orders Table
create table public.orders (
  id bigint generated always as identity primary key,
  customer_id bigint references public.customers(id),
  customer_name text,
  order_date date default current_date,
  total_amount numeric,
  status text
);

-- Order Items Table
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint references public.orders(id) on delete cascade,
  product_id bigint,
  name text,
  type text, -- 'Book' or 'Stationary'
  price numeric,
  quantity integer,
  subtotal numeric
);

-- Profiles Table (for Users)
-- Links to Supabase Auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  email text,
  role text default 'sales_man', -- 'owner' or 'sales_man'
  status text default 'Active'
);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'username', coalesce(new.raw_user_meta_data->>'role', 'sales_man'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Enable Row Level Security (RLS)
alter table public.books enable row level security;
alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.stationary enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.profiles enable row level security;

-- Policies (Simple public access for this MVP, adjust for production)
create policy "Public Access Books" on public.books for all using (true);
create policy "Public Access Customers" on public.customers for all using (true);
create policy "Public Access Suppliers" on public.suppliers for all using (true);
create policy "Public Access Stationary" on public.stationary for all using (true);
create policy "Public Access Orders" on public.orders for all using (true);
create policy "Public Access Order Items" on public.order_items for all using (true);
create policy "Public Access Profiles" on public.profiles for all using (true);
