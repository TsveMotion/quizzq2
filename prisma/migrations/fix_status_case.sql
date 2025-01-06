-- Fix case of status field
UPDATE User
SET status = 'ACTIVE'
WHERE status = 'active';
