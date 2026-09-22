'use client';

import React, { useState, useMemo } from 'react';
import {
  INITIAL_TENANTS,
  INITIAL_RENT_PAYMENTS,
  INITIAL_WATER_HEATER_PAYMENTS,
  WATER_HEATER_TOTAL,
  WATER_HEATER_PER_PERSON,
  WATER_HEATER_INITIAL_PAYER,
  FIXED_BILL_ESTIMATES,
  TOTAL_FIXED_ESTIMATE,
  KAS_PER_PERSON_TARGET,
  INITIAL_MONTHLY_KAS,
  INITIAL_MONTHLY_EXPENSES,
  MONTH_NAMES,
} from '@/lib/mockData';
import {
  Tenant,
  RentPayment,
  WaterHeaterPayment,
  MonthlyKas,
  MonthlyExpense,
  TenantRentSummary,
} from '@/types';
import { RentModule } from '@/components/dashboard/RentModule';
import { WaterHeaterModule } from '@/components/dashboard/WaterHeaterModule';
import { MonthlyKasOperationalModule } from '@/components/dashboard/MonthlyKasOperationalModule';
import { QrisPaymentCard } from '@/components/dashboard/QrisPaymentCard';
import { AddRentPaymentModal } from '@/components/forms/AddRentPaymentModal';
import { QrisModal } from '@/components/forms/QrisModal';
import {
  Calendar,
  Plus,
  Home,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function NamiulogrupApp() {
  // 1. Master Tenants & Rent State
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>(INITIAL_RENT_PAYMENTS);

  // 2. Water Heater State (5 orang @220k, Rendi talangan awal)
  const [waterHeaterPayments, setWaterHeaterPayments] = useState<WaterHeaterPayment[]>(
    INITIAL_WATER_HEATER_PAYMENTS
  );

  // 3. Global Filter Bulan & Tahun
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // 4. Monthly Kas & Monthly Expenses State
  const [monthlyKasList, setMonthlyKasList] = useState<MonthlyKas[]>(INITIAL_MONTHLY_KAS);
  const [monthlyExpensesList, setMonthlyExpensesList] = useState<MonthlyExpense[]>(
    INITIAL_MONTHLY_EXPENSES
  );

  // Active Tab Filter (ALL, SEWA, WATER_HEATER, KAS_OPERATIONAL, QRIS)
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'SEWA' | 'WATER_HEATER' | 'KAS_OPERATIONAL' | 'QRIS'
  >('ALL');

  // Modals state
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [selectedRentTenantId, setSelectedRentTenantId] = useState<string | undefined>(undefined);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);

  // Calculate Tenant Rent Summaries
  const tenantRentSummaries: TenantRentSummary[] = useMemo(() => {
    return tenants.map((tenant) => {
      const history = rentPayments.filter((rp) => rp.tenant_id === tenant.id);
      const total_paid = history.reduce((acc, curr) => acc + curr.amount, 0);
      const remaining_balance = Math.max(tenant.rent_target - total_paid, 0);
      const progress_percentage = Math.min((total_paid / tenant.rent_target) * 100, 100);

      return {
        tenant,
        total_paid,
        remaining_balance,
        progress_percentage,
        history,
      };
    });
  }, [tenants, rentPayments]);

  // Handlers for Rent
  const handleAddRentPayment = (data: {
    tenant_id: string;
    amount: number;
    payment_date: string;
    notes?: string;
  }) => {
    const newPayment: RentPayment = {
      id: `rp-${Date.now()}`,
      tenant_id: data.tenant_id,
      amount: data.amount,
      paid_at: `${data.payment_date}T10:00:00+07:00`,
      notes: data.notes,
    };
    setRentPayments((prev) => [newPayment, ...prev]);
  };

  // Handlers for Water Heater
  const handleToggleWaterHeater = (paymentId: string) => {
    setWaterHeaterPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const nextStatus = p.status === 'PAID' ? 'UNPAID' : 'PAID';
          return {
            ...p,
            status: nextStatus,
            paid_at: nextStatus === 'PAID' ? new Date().toISOString() : null,
          };
        }
        return p;
      })
    );
  };

  // Handlers for Monthly Kas
  const handleToggleKasStatus = (tenantId: string) => {
    setMonthlyKasList((prev) => {
      const exists = prev.find(
        (k) => k.tenant_id === tenantId && k.month === selectedMonth && k.year === selectedYear
      );

      if (exists) {
        return prev.map((k) => {
          if (k.tenant_id === tenantId && k.month === selectedMonth && k.year === selectedYear) {
            const nextStatus = k.status === 'PAID' ? 'UNPAID' : 'PAID';
            return {
              ...k,
              status: nextStatus,
              paid_at: nextStatus === 'PAID' ? new Date().toISOString() : null,
            };
          }
          return k;
        });
      } else {
        // Create new entry for this month
        const tenant = tenants.find((t) => t.id === tenantId);
        const newKas: MonthlyKas = {
          id: `mk-${Date.now()}`,
          tenant_id: tenantId,
          name: tenant?.name || '',
          month: selectedMonth,
          year: selectedYear,
          amount: KAS_PER_PERSON_TARGET,
          status: 'PAID',
          paid_at: new Date().toISOString(),
        };
        return [...prev, newKas];
      }
    });
  };

  // Handlers for Adding Real Monthly Expense
  const handleAddExpense = (data: { category: string; amount: number; description?: string }) => {
    const newExpense: MonthlyExpense = {
      id: `me-${Date.now()}`,
      category: data.category,
      amount: data.amount,
      month: selectedMonth,
      year: selectedYear,
      description: data.description,
      created_at: new Date().toISOString(),
    };
    setMonthlyExpensesList((prev) => [newExpense, ...prev]);
  };

  const openRentModalForTenant = (tenantId?: string) => {
    setSelectedRentTenantId(tenantId);
    setIsRentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 antialiased font-sans">
      {/* HEADER NAVBAR (TEKS 'Namiulogrup' RESMI) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900">
                  Namiulogrup
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                  5 Penghuni
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pencatatan Keuangan Transparan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* PERIODE AKTIF */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-700">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </span>
            </div>

            {/* SCAN QRIS SHORTCUT */}
            <button
              type="button"
              onClick={() => setIsQrisModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-medium transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-zinc-700" />
              <span>Scan QRIS</span>
            </button>

            {/* CICIL SEWA BUTTON */}
            <button
              type="button"
              onClick={() => openRentModalForTenant()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Cicil Sewa
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* SUBHEADER & TABS */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/70">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Transparansi Finansial Kontrakan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Sewa kontrakan tahunan (Rp 35.000.000), patungan water heater (Rp 1.100.000), dan kas bulanan dengan deteksi Boncos/Surplus.
            </p>
          </div>

          {/* TAB NAVIGATION FILTER */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100 text-xs font-semibold self-start sm:self-auto">
            {[
              { id: 'ALL', label: 'Semua Modul' },
              { id: 'SEWA', label: '1. Sewa (Rp 35 Jt)' },
              { id: 'WATER_HEATER', label: '2. Water Heater' },
              { id: 'KAS_OPERATIONAL', label: '3. Kas & Boncos' },
              { id: 'QRIS', label: '4. Scan QRIS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-zinc-900 shadow-sm font-bold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. MODUL SEWA KONTRAKAN (SISTEM CICIL) */}
        {(activeTab === 'ALL' || activeTab === 'SEWA') && (
          <RentModule
            tenantSummaries={tenantRentSummaries}
            onOpenAddPayment={openRentModalForTenant}
          />
        )}

        {/* 2. MODUL PATUNGAN WATER HEATER (TOTAL Rp 1.100.000 / 5 = @Rp 220.000) */}
        {(activeTab === 'ALL' || activeTab === 'WATER_HEATER') && (
          <WaterHeaterModule
            payments={waterHeaterPayments}
            totalCost={WATER_HEATER_TOTAL}
            perPerson={WATER_HEATER_PER_PERSON}
            initialPayer={WATER_HEATER_INITIAL_PAYER}
            onToggleStatus={handleToggleWaterHeater}
          />
        )}

        {/* 3. MODUL KAS & OPERASIONAL (HISTORI BULANAN & DETEKSI BONCOS) */}
        {(activeTab === 'ALL' || activeTab === 'KAS_OPERATIONAL') && (
          <MonthlyKasOperationalModule
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            monthNames={MONTH_NAMES}
            kasList={monthlyKasList}
            expensesList={monthlyExpensesList}
            fixedEstimates={FIXED_BILL_ESTIMATES}
            totalFixedEstimate={TOTAL_FIXED_ESTIMATE}
            targetPerPerson={KAS_PER_PERSON_TARGET}
            onToggleKasStatus={handleToggleKasStatus}
            onAddExpense={handleAddExpense}
          />
        )}

        {/* 4. MODUL CARA PEMBAYARAN (QRIS INTEGRASI) */}
        {(activeTab === 'ALL' || activeTab === 'QRIS') && (
          <QrisPaymentCard onOpenModal={() => setIsQrisModalOpen(true)} />
        )}
      </main>

      {/* FLOATING ACTION BUTTON DI POJOK KANAN BAWAH */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsQrisModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span>Scan QRIS</span>
        </button>
      </div>

      {/* MODAL FORMS */}
      <AddRentPaymentModal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        tenants={tenants}
        tenantSummaries={tenantRentSummaries}
        defaultTenantId={selectedRentTenantId}
        onSubmit={handleAddRentPayment}
      />

      {/* QRIS POPUP MODAL (DENGAN /WhatsApp Image 2026-09-22 at 21.27.58.jpeg) */}
      <QrisModal
        isOpen={isQrisModalOpen}
        onClose={() => setIsQrisModalOpen(false)}
        title="Scan QRIS Pembayaran"
      />

      {/* FOOTER */}
      <footer className="mt-20 border-t border-zinc-200/80 py-8 text-center text-xs text-zinc-400">
        <p>Namiulogrup &bull; Aplikasi Transparansi Keuangan Kontrakan</p>
      </footer>
    </div>
  );
}
