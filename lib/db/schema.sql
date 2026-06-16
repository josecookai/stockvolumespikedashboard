CREATE TABLE IF NOT EXISTS volume_snapshots (
  id               SERIAL PRIMARY KEY,
  symbol           TEXT NOT NULL,
  market           TEXT NOT NULL CHECK (market IN ('crypto', 'stock')),
  exchange         TEXT,
  volume_usd       NUMERIC NOT NULL,
  volume_base      NUMERIC,
  price            NUMERIC,
  price_change_pct NUMERIC,
  market_share_pct NUMERIC,
  rel_volume       NUMERIC DEFAULT 1.0,
  snapshot_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_symbol_time ON volume_snapshots (symbol, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_market_time ON volume_snapshots (market, snapshot_at DESC);

CREATE TABLE IF NOT EXISTS daily_volume_summary (
  id               SERIAL PRIMARY KEY,
  symbol           TEXT NOT NULL,
  market           TEXT NOT NULL,
  exchange         TEXT,
  date             DATE NOT NULL,
  volume_usd_total NUMERIC NOT NULL,
  avg_price        NUMERIC,
  market_share_pct NUMERIC,
  UNIQUE (symbol, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_symbol_date ON daily_volume_summary (symbol, date DESC);

CREATE TABLE IF NOT EXISTS alert_rules (
  id            SERIAL PRIMARY KEY,
  symbol        TEXT,
  market        TEXT,
  threshold_x   NUMERIC NOT NULL DEFAULT 3.0,
  telegram_chat TEXT NOT NULL,
  enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_history (
  id           SERIAL PRIMARY KEY,
  symbol       TEXT NOT NULL,
  market       TEXT NOT NULL,
  volume_usd   NUMERIC NOT NULL,
  rel_volume   NUMERIC NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_history_symbol_time ON alert_history (symbol, triggered_at DESC);
