create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  date_of_birth date,
  gender text,
  emergency_contact text,
  admission_date date not null,
  membership_type text not null,
  membership_amount numeric(10,2) not null default 0,
  payment_date date,
  due_date date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  amount numeric(10,2) not null,
  payment_date date not null default current_date,
  due_date date,
  payment_method text,
  notes text,
  created_at timestamptz default now()
);

create index if not exists members_phone_idx on members(phone);
create index if not exists members_due_date_idx on members(due_date);
create index if not exists payments_member_id_idx on payments(member_id);