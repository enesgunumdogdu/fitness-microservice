-- Cleanup of legacy columns left behind by the pre-Flyway era when
-- spring.jpa.hibernate.ddl-auto was set to "update" and the User entity
-- still carried Keycloak-related fields.
--
-- On databases that pre-date V1 (created via Hibernate ddl-auto=update
-- before commit d738ea6), V1's CREATE TABLE IF NOT EXISTS was a no-op,
-- so `keycloak_id` and `password` lingered while `password_hash` was
-- never added. This produced a Hibernate validate failure on startup
-- once the entity was rewritten to expect `password_hash`.
--
-- All statements are idempotent (IF EXISTS / IF NOT EXISTS) so a fresh
-- database where V1 already created the correct schema sees this as a
-- no-op.

ALTER TABLE users DROP COLUMN IF EXISTS keycloak_id;
ALTER TABLE users DROP COLUMN IF EXISTS password;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL;
