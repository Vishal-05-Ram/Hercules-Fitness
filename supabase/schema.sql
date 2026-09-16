create table if not exists members (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  phone text not null,

  plan text not null,
  admission_date date not null,
  due_date date not null,

  amount numeric(10,2) not null default 0,

  status text not null default 'Active',

  created_at timestamptz not null default now()
);

create index if not exists members_due_date_idx
on members(due_date);

create index if not exists members_phone_idx
on members(phone);
