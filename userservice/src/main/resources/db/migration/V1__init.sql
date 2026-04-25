-- baseline schema (post-Keycloak removal)

CREATE TABLE IF NOT EXISTS users (
    id            VARCHAR(255)                NOT NULL,
    email         VARCHAR(255)                NOT NULL,
    password_hash VARCHAR(255)                NOT NULL,
    first_name    VARCHAR(255),
    last_name     VARCHAR(255),
    role          VARCHAR(255),
    created_at    TIMESTAMP(6),
    updated_at    TIMESTAMP(6),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('USER', 'ADMIN'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          VARCHAR(255)                NOT NULL,
    user_id     VARCHAR(255)                NOT NULL,
    token_hash  VARCHAR(128)                NOT NULL,
    expires_at  TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    revoked     BOOLEAN                     NOT NULL,
    replaced_by VARCHAR(255),
    created_at  TIMESTAMP(6),
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens (user_id);
