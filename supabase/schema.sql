create table if not exists profiles (
  id uuid primary key,
  role text not null check (role in ('student', 'parent', 'tutor', 'admin')),
  full_name text,
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists tutors (
  id uuid primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  subject text not null check (subject in ('English', 'Maths')),
  hourly_rate_aud integer not null,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  grade_level text,
  learning_goals text,
  created_at timestamptz not null default now()
);

create table if not exists lesson_packages (
  id text primary key,
  subject text not null check (subject in ('English', 'Maths')),
  title text not null,
  sessions integer not null,
  price_aud integer not null
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references profiles(id),
  tutor_profile_id uuid references profiles(id),
  parent_profile_id uuid references profiles(id),
  lesson_package_id text not null references lesson_packages(id),
  status text not null default 'pending' check (status in ('pending', 'paid', 'scheduled', 'completed', 'cancelled')),
  scheduled_at timestamptz,
  stripe_checkout_session_id text,
  livekit_room_name text,
  student_name text,
  student_year text,
  parent_name text,
  notes text,
  created_at timestamptz not null default now()
);

alter table bookings add column if not exists parent_profile_id uuid references profiles(id);
alter table bookings add column if not exists student_name text;
alter table bookings add column if not exists student_year text;
alter table bookings add column if not exists parent_name text;

create table if not exists tutor_availability (
  id uuid primary key default gen_random_uuid(),
  tutor_profile_id uuid not null references profiles(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'Australia/Sydney'
);
