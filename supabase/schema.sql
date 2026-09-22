-- ============================================================================
-- NAMIULOGRUP - SUPABASE POSTGRESQL DDL & SEED DATA
-- Aplikasi Pencatatan Keuangan Transparan 5 Penghuni Kontrakan
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABEL: tenants (Master Data 5 Penghuni)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    rent_target NUMERIC(12, 2) NOT NULL CHECK (rent_target > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TABEL: rent_payments (Cicilan Sewa Kontrakan)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant ON rent_payments(tenant_id);

-- ----------------------------------------------------------------------------
-- 3. TABEL: water_heater_payments (Patungan Water Heater Rp 1.100.000 / 5 = @220.000)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS water_heater_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 220000 CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('PAID', 'UNPAID')),
    paid_at TIMESTAMPTZ NULL,
    notes TEXT NULL,
    CONSTRAINT uq_wh_tenant UNIQUE (tenant_id)
);

-- ----------------------------------------------------------------------------
-- 4. TABEL: monthly_kas (Pemasukan Kas per Bulan: @Rp 257.000/anak)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monthly_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2020),
    amount NUMERIC(12, 2) NOT NULL DEFAULT 257000 CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('PAID', 'UNPAID')),
    paid_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_monthly_kas UNIQUE (tenant_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_monthly_kas_period ON monthly_kas(month, year);

-- ----------------------------------------------------------------------------
-- 5. TABEL: monthly_expenses (Pengeluaran Riil per Bulan)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monthly_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2020),
    description TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monthly_expenses_period ON monthly_expenses(month, year);

-- ----------------------------------------------------------------------------
-- 6. VIEWS UNTUK AGREGASI
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_rent_summary AS
SELECT 
    t.id AS tenant_id,
    t.name,
    t.rent_target,
    COALESCE(SUM(rp.amount), 0) AS total_paid,
    t.rent_target - COALESCE(SUM(rp.amount), 0) AS remaining_balance,
    ROUND((COALESCE(SUM(rp.amount), 0) / t.rent_target) * 100, 2) AS progress_percentage,
    CASE 
        WHEN COALESCE(SUM(rp.amount), 0) >= t.rent_target THEN 'LUNAS'
        ELSE 'MENCICIL'
    END AS status
FROM tenants t
LEFT JOIN rent_payments rp ON t.id = rp.tenant_id
GROUP BY t.id, t.name, t.rent_target;

-- ----------------------------------------------------------------------------
-- 7. SEED DATA AWAL (NAMIULOGRUP)
-- ----------------------------------------------------------------------------

-- Insert 5 Penghuni
INSERT INTO tenants (id, name, rent_target) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Rendi', 9000000),
    ('00000000-0000-0000-0000-000000000002', 'Rehan', 6500000),
    ('00000000-0000-0000-0000-000000000003', 'Nizam', 6500000),
    ('00000000-0000-0000-0000-000000000004', 'Evan', 6500000),
    ('00000000-0000-0000-0000-000000000005', 'Diego', 6500000)
ON CONFLICT (name) DO UPDATE 
SET rent_target = EXCLUDED.rent_target;

-- Data Pembayaran Cicilan Sewa Awal:
-- Rendi: 9.000.000 (LUNAS)
-- Rehan: 2.500.000
-- Nizam: 1.500.000
-- Evan: 1.000.000
-- Diego: 0
INSERT INTO rent_payments (tenant_id, amount, paid_at, notes) VALUES
    ('00000000-0000-0000-0000-000000000001', 9000000, '2026-09-01 10:00:00+07', 'Pelunasan Sewa Kontrakan - Lunas'),
    ('00000000-0000-0000-0000-000000000002', 2500000, '2026-09-02 11:30:00+07', 'Cicilan Sewa Rehan'),
    ('00000000-0000-0000-0000-000000000003', 1500000, '2026-09-03 14:00:00+07', 'Cicilan Sewa Nizam'),
    ('00000000-0000-0000-0000-000000000004', 1000000, '2026-09-04 09:15:00+07', 'Cicilan Sewa Evan');

-- Seed Data Patungan Water Heater:
-- Rendi: LUNAS (Talangan Awal)
-- Rehan, Nizam, Evan, Diego: Masing-masing UNPAID (Berhutang Rp 220.000 ke Rendi)
INSERT INTO water_heater_payments (tenant_id, amount, status, paid_at, notes) VALUES
    ('00000000-0000-0000-0000-000000000001', 220000, 'PAID', '2026-09-01 08:00:00+07', 'Talangan Awal oleh Rendi (Lunas)'),
    ('00000000-0000-0000-0000-000000000002', 220000, 'UNPAID', NULL, 'Hutang patungan ke Rendi'),
    ('00000000-0000-0000-0000-000000000003', 220000, 'UNPAID', NULL, 'Hutang patungan ke Rendi'),
    ('00000000-0000-0000-0000-000000000004', 220000, 'UNPAID', NULL, 'Hutang patungan ke Rendi'),
    ('00000000-0000-0000-0000-000000000005', 220000, 'UNPAID', NULL, 'Hutang patungan ke Rendi')
ON CONFLICT (tenant_id) DO NOTHING;

-- Seed Data Kas Bulanan (September 2026)
INSERT INTO monthly_kas (tenant_id, month, year, amount, status, paid_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 9, 2026, 257000, 'PAID', '2026-09-02 10:00:00+07'),
    ('00000000-0000-0000-0000-000000000002', 9, 2026, 257000, 'PAID', '2026-09-03 15:00:00+07'),
    ('00000000-0000-0000-0000-000000000003', 9, 2026, 257000, 'UNPAID', NULL),
    ('00000000-0000-0000-0000-000000000004', 9, 2026, 257000, 'PAID', '2026-09-05 09:30:00+07'),
    ('00000000-0000-0000-0000-000000000005', 9, 2026, 257000, 'UNPAID', NULL)
ON CONFLICT (tenant_id, month, year) DO NOTHING;

-- Seed Data Pengeluaran Riil (September 2026: Total Rp 1.285.000)
INSERT INTO monthly_expenses (category, amount, month, year, description) VALUES
    ('Sampah', 250000, 9, 2026, 'Iuran Sampah RT September 2026'),
    ('WiFi', 185000, 9, 2026, 'Tagihan WiFi Indihome 50 Mbps'),
    ('Listrik', 350000, 9, 2026, 'Token listrik PLN prabayar bersama'),
    ('Stok Makanan', 500000, 9, 2026, 'Beras, minyak goreng, galon aqua, gas 3kg');
