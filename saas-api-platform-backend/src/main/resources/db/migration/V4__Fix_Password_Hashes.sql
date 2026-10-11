-- Flyway Database Migration V4: Ensure exact BCrypt password hashes for Admin and Developer accounts

UPDATE users 
SET password_hash = '$2a$10$kE4xLp8WzhhD3dUj/Az32.BUOkZnyjYSnRvd455XGkOpGxJW5Zq8y' 
WHERE email = 'dev@saas-platform.com';

UPDATE users 
SET password_hash = '$2a$10$pT3eRzZSX2/G.W.LnLTC/.dJtSZtYM3crwLGcqMx2w30Bl/NUcvoG' 
WHERE email = 'admin@saas-platform.com';
