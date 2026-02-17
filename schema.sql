-- Create the transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  amount numeric not null,
  type text not null,
  category text not null,
  date timestamp with time zone not null
);

-- Enable Row Level Security (RLS)
alter table transactions enable row level security;

-- Create a policy that allows all operations for now (since we don't have auth yet)
-- WARNING: This is for demonstration purposes only. In production with Auth, you should restrict this.
create policy "Enable all access for all users" on transactions
for all using (true) with check (true);
