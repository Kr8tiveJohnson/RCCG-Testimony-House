CREATE TABLE IF NOT EXISTS livestream_settings (
	singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton = TRUE),
	platform TEXT NOT NULL CHECK (platform IN ('youtube', 'facebook')),
	url TEXT NOT NULL CHECK (char_length(url) <= 2048),
	is_live BOOLEAN NOT NULL DEFAULT FALSE,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE livestream_settings ADD COLUMN IF NOT EXISTS is_live BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS website_content (
	singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton = TRUE),
	content JSONB NOT NULL CHECK (jsonb_typeof(content) = 'object'),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_media (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif')),
	image_data BYTEA NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	endpoint TEXT NOT NULL UNIQUE,
	subscription JSONB NOT NULL CHECK (jsonb_typeof(subscription) = 'object'),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_notification_deliveries (
	notification_key TEXT NOT NULL,
	subscription_id UUID NOT NULL REFERENCES push_subscriptions(id) ON DELETE CASCADE,
	sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (notification_key, subscription_id)
);
