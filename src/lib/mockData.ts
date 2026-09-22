import {
  Tenant,
  RentPayment,
  WaterHeaterPayment,
  MonthlyKas,
  MonthlyExpense,
  FixedBillEstimate,
} from '@/types';

// 1. DATA 5 PENGHUNI (HANYA NAMA & TARGET SEWA)
export const INITIAL_TENANTS: Tenant[] = [
  { id: 't-1', name: 'Rendi', rent_target: 9_000_000 },
  { id: 't-2', name: 'Rehan', rent_target: 6_500_000 },
  { id: 't-3', name: 'Nizam', rent_target: 6_500_000 },
  { id: 't-4', name: 'Evan', rent_target: 6_500_000 },
  { id: 't-5', name: 'Diego', rent_target: 6_500_000 },
];

export const TOTAL_RENT_TARGET = 35_000_000;

// 2. CICILAN SEWA AWAL
// Rendi: 9.000.000 (LUNAS)
// Rehan: 2.500.000 (Sisa 4.000.000)
// Nizam: 1.500.000 (Sisa 5.000.000)
// Evan: 1.000.000 (Sisa 5.500.000)
// Diego: 0 (Sisa 6.500.000)
export const INITIAL_RENT_PAYMENTS: RentPayment[] = [
  {
    id: 'rp-1',
    tenant_id: 't-1',
    amount: 9_000_000,
    paid_at: '2026-09-01T10:00:00+07:00',
    notes: 'Pelunasan Sewa Kontrakan - Lunas',
  },
  {
    id: 'rp-2',
    tenant_id: 't-2',
    amount: 2_500_000,
    paid_at: '2026-09-02T11:00:00+07:00',
    notes: 'Cicilan Sewa Rehan',
  },
  {
    id: 'rp-3',
    tenant_id: 't-3',
    amount: 1_500_000,
    paid_at: '2026-09-03T14:30:00+07:00',
    notes: 'Cicilan Sewa Nizam',
  },
  {
    id: 'rp-4',
    tenant_id: 't-4',
    amount: 1_000_000,
    paid_at: '2026-09-04T09:15:00+07:00',
    notes: 'Cicilan Sewa Evan',
  },
];

// 3. PATUNGAN WATER HEATER (Total Rp 1.100.000 / 5 = @220.000)
// Rendi adalah pihak yang menalangi awal -> otomatis LUNAS
export const WATER_HEATER_TOTAL = 1_100_000;
export const WATER_HEATER_PER_PERSON = 220_000;
export const WATER_HEATER_INITIAL_PAYER = 'Rendi';

export const INITIAL_WATER_HEATER_PAYMENTS: WaterHeaterPayment[] = [
  {
    id: 'wh-1',
    tenant_id: 't-1',
    name: 'Rendi',
    amount: 220_000,
    status: 'PAID',
    is_initial_payer: true,
    paid_at: '2026-09-01T08:00:00+07:00',
  },
  {
    id: 'wh-2',
    tenant_id: 't-2',
    name: 'Rehan',
    amount: 220_000,
    status: 'UNPAID',
    is_initial_payer: false,
    paid_at: null,
  },
  {
    id: 'wh-3',
    tenant_id: 't-3',
    name: 'Nizam',
    amount: 220_000,
    status: 'UNPAID',
    is_initial_payer: false,
    paid_at: null,
  },
  {
    id: 'wh-4',
    tenant_id: 't-4',
    name: 'Evan',
    amount: 220_000,
    status: 'UNPAID',
    is_initial_payer: false,
    paid_at: null,
  },
  {
    id: 'wh-5',
    tenant_id: 't-5',
    name: 'Diego',
    amount: 220_000,
    status: 'UNPAID',
    is_initial_payer: false,
    paid_at: null,
  },
];

// 4. ESTIMASI TAGIHAN TETAP BULANAN (Total Rp 1.285.000)
export const FIXED_BILL_ESTIMATES: FixedBillEstimate[] = [
  { category: 'Sampah', amount: 250_000, note: 'Iuran RT & Keamanan' },
  { category: 'WiFi', amount: 185_000, note: 'Indihome 50 Mbps' },
  { category: 'Listrik', amount: 350_000, note: 'Token PLN Bersama' },
  { category: 'Stok Makanan', amount: 500_000, note: 'Beras, Minyak, Galon & Gas' },
];

export const TOTAL_FIXED_ESTIMATE = 1_285_000;
export const KAS_PER_PERSON_TARGET = 257_000; // 1.285.000 / 5 orang
export const ESTIMATED_MONTHLY_BUDGET = FIXED_BILL_ESTIMATES;

// 5. HISTORI PEMASUKAN KAS BULANAN
export const INITIAL_MONTHLY_KAS: MonthlyKas[] = [
  // September 2026 (Bulan Berjalan)
  { id: 'mk-1', tenant_id: 't-1', name: 'Rendi', month: 9, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-09-02T10:00:00+07:00' },
  { id: 'mk-2', tenant_id: 't-2', name: 'Rehan', month: 9, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-09-03T11:00:00+07:00' },
  { id: 'mk-3', tenant_id: 't-3', name: 'Nizam', month: 9, year: 2026, amount: 257_000, status: 'UNPAID', paid_at: null },
  { id: 'mk-4', tenant_id: 't-4', name: 'Evan', month: 9, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-09-05T09:30:00+07:00' },
  { id: 'mk-5', tenant_id: 't-5', name: 'Diego', month: 9, year: 2026, amount: 257_000, status: 'UNPAID', paid_at: null },

  // Agustus 2026 (Histori Bulan Lalu - Semua Lunas)
  { id: 'mk-6', tenant_id: 't-1', name: 'Rendi', month: 8, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-08-01T10:00:00+07:00' },
  { id: 'mk-7', tenant_id: 't-2', name: 'Rehan', month: 8, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-08-02T11:00:00+07:00' },
  { id: 'mk-8', tenant_id: 't-3', name: 'Nizam', month: 8, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-08-03T14:00:00+07:00' },
  { id: 'mk-9', tenant_id: 't-4', name: 'Evan', month: 8, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-08-04T09:00:00+07:00' },
  { id: 'mk-10', tenant_id: 't-5', name: 'Diego', month: 8, year: 2026, amount: 257_000, status: 'PAID', paid_at: '2026-08-05T16:00:00+07:00' },
];

// 6. HISTORI PENGELUARAN RIIL BULANAN
export const INITIAL_MONTHLY_EXPENSES: MonthlyExpense[] = [
  // September 2026 (Total: Rp 1.285.000)
  { id: 'me-1', category: 'Sampah', amount: 250_000, month: 9, year: 2026, description: 'Iuran RT September 2026' },
  { id: 'me-2', category: 'WiFi', amount: 185_000, month: 9, year: 2026, description: 'Tagihan Indihome 50 Mbps' },
  { id: 'me-3', category: 'Listrik', amount: 350_000, month: 9, year: 2026, description: 'Token PLN 350rb' },
  { id: 'me-4', category: 'Stok Makanan', amount: 500_000, month: 9, year: 2026, description: 'Beras 10kg, minyak, galon aqua, tabung gas' },

  // Agustus 2026 (Total: Rp 1.150.000 -> Surplus!)
  { id: 'me-5', category: 'Sampah', amount: 250_000, month: 8, year: 2026, description: 'Iuran RT Agustus 2026' },
  { id: 'me-6', category: 'WiFi', amount: 185_000, month: 8, year: 2026, description: 'Tagihan Indihome Agustus' },
  { id: 'me-7', category: 'Listrik', amount: 315_000, month: 8, year: 2026, description: 'Token PLN Agustus' },
  { id: 'me-8', category: 'Stok Makanan', amount: 400_000, month: 8, year: 2026, description: 'Beras & galon aqua' },
];

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
