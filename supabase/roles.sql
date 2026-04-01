-- Promote a user to admin
update profiles
set role = 'admin'
where email = 'your-admin@email.com';

-- Promote a user to tutor
update profiles
set role = 'tutor'
where email = 'your-tutor@email.com';
