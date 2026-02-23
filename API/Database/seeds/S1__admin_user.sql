-- Default admin user.
-- IMPORTANT: Change the password before using in production.
-- The API stores passwords in plain text in the current version;
-- update TokenService.cs to use bcrypt/Argon2 before go-live.
INSERT IGNORE INTO `users` (`username`, `password`)
VALUES ('admin', 'changeme');
