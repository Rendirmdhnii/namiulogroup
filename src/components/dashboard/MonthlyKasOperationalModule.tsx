import React, { useState } from 'react';
import { MonthlyKas, MonthlyExpense, FixedBillEstimate } from '@/types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Calendar,
  Plus,
  Check,
  Clock,
  Receipt,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface MonthlyKasOperationalModuleProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  monthNames: string[];
  kasList: MonthlyKas[];
  expensesList: MonthlyExpense[];
  fixedEstimates: FixedBillEstimate[];
  totalFixedEstimate: number; // 1.285.000
  targetPerPerson: number; // 257.000
  onToggleKasStatus: (tenantId: string) => void;
  onAddExpense: (data: { category: string; amount: number; description?: string }) => void;
}

export const MonthlyKasOperationalModule: React.FC<MonthlyKasOperationalModuleProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  monthNames,
  kasList,
  expensesList,
  fixedEstimates,
  totalFixedEstimate,
  targetPerPerson,
  onToggleKasStatus,
  onAddExpense,
}) => {
  const [category, setCategory] = useState<string>('Listrik');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  // Filter based on selected month & year
  const currentMonthKas = kasList.filter(
    (k) => k.month === selectedMonth && k.year === selectedYear
  );
  const currentMonthExpenses = expensesList.filter(
    (e) => e.month === selectedMonth && e.year === selectedYear
  );

  const totalKasCollected = currentMonthKas
    .filter((k) => k.status === 'PAID')
    .reduce((acc, k) => acc + k.amount, 0);

  const totalExpenses = currentMonthExpenses.reduce((acc, e) => acc + e.amount, 0);

  const netBalance = totalKasCollected - totalExpenses;
  const isBoncos = netBalance < 0;
  const paidCount = currentMonthKas.filter((k) => k.status === 'PAID').length;
  const totalOccupants = currentMonthKas.length || 5;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!num || num <= 0) return;

    onAddExpense({
      category,
      amount: num,
      description: description.trim() || undefined,
    });

    setAmount('');
    setDescription('');
  };

  const monthLabel = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

  return (
    <section className="space-y-5">
      {/* 1. FILTER GLOBAL BULAN & TAHUN (MOBILE-FRIENDLY) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-700" />
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Kas & Operasional Bulanan
            </h2>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isBoncos
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isBoncos ? 'BONCOS' : 'SURPLUS'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pilih bulan untuk melihat histori keuangan & kalkulasi saldo riil.
          </p>
        </div>

        {/* DROPDOWN SELECTORS */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            {[2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. 3 METRIK KOTAK (MOBILE-FIRST: 1 KOLOM DI HP, 3 KOLOM DI DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* KOTAK 1: KAS TERKUMPUL */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Kas Terkumpul (Bulan ini)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mt-1.5">
              {formatRupiah(totalKasCollected)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {paidCount} dari {totalOccupants} anak telah bayar
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center text-[11px] text-zinc-500">
            <span>Target Pemasukan:</span>
            <span className="font-semibold text-zinc-800">{formatRupiah(totalFixedEstimate)}</span>
          </div>
        </div>

        {/* KOTAK 2: PENGELUARAN RIIL */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Pengeluaran Riil (Bulan ini)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mt-1.5">
              {formatRupiah(totalExpenses)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {currentMonthExpenses.length} transaksi nota di {monthLabel}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-between items-center text-[11px] text-zinc-500">
            <span>Estimasi Tagihan:</span>
            <span className="font-semibold text-zinc-800">{formatRupiah(totalFixedEstimate)}</span>
          </div>
        </div>

        {/* KOTAK 3: STATUS SALDO (MERAH JIKA MINUS 'BONCOS', HIJAU JIKA 'SURPLUS') */}
        <div
          className={`bg-white rounded-xl p-5 border shadow-sm flex flex-col justify-between ${
            isBoncos ? 'border-rose-300 bg-rose-50/20' : 'border-emerald-300 bg-emerald-50/20'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Status Saldo
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isBoncos
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isBoncos ? 'BONCOS' : 'SURPLUS'}
              </span>
            </div>

            <div
              className={`text-2xl sm:text-3xl font-black tracking-tight mt-1.5 ${
                isBoncos ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {netBalance === 0
                ? 'Rp 0 (Pas)'
                : `${netBalance < 0 ? '-' : '+'}${formatRupiah(Math.abs(netBalance))}`}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Kas ({formatRupiah(totalKasCollected)}) − Pengeluaran ({formatRupiah(totalExpenses)})
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-zinc-600">Kondisi:</span>
            <span className={`font-bold ${isBoncos ? 'text-rose-600' : 'text-emerald-700'}`}>
              {isBoncos ? 'Pengeluaran > Kas (Defisit)' : 'Kas Masuk Mencukupi'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. ESTIMASI TAGIHAN TETAP (SAMPAH 250K, WIFI 185K, LISTRIK 350K, STOK MAKANAN 500K) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Estimasi Tagihan Tetap Bulanan
            </h3>
            <p className="text-xs text-zinc-400">
              Total estimasi: <strong className="text-zinc-800">{formatRupiah(totalFixedEstimate)}/bulan</strong>
            </p>
          </div>
          <span className="text-xs text-zinc-500">
            Kewajiban per Orang: <span className="font-bold text-zinc-900">{formatRupiah(targetPerPerson)}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {fixedEstimates.map((item) => (
            <div
              key={item.category}
              className="p-3 rounded-lg border border-gray-100 bg-gray-50/50 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-medium text-zinc-500 block truncate">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-zinc-900 mt-1 block">
                  {formatRupiah(item.amount)}
                </span>
              </div>
              {item.note && (
                <span className="text-[10px] text-zinc-400 mt-1.5 block truncate border-t border-gray-200/40 pt-1">
                  {item.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. CHECKLIST STATUS BAYAR KAS PER ANAK (@Rp 257.000) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Checklist Pembayaran Kas ({monthLabel})
            </h3>
            <p className="text-xs text-zinc-400">
              Kewajiban: <strong className="text-zinc-700">{formatRupiah(targetPerPerson)}/anak</strong>
            </p>
          </div>
          <div className="text-xs text-zinc-500">
            Lunas: <strong className="text-zinc-900">{paidCount}</strong> / {totalOccupants}
          </div>
        </div>

        {/* MOBILE RESPONSIVE LIST / TABLE */}
        <div className="divide-y divide-gray-100">
          {currentMonthKas.map((kas) => {
            const isPaid = kas.status === 'PAID';

            return (
              <div
                key={kas.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-zinc-600'
                    }`}
                  >
                    {kas.name.substring(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 text-sm truncate">{kas.name}</p>
                    <p className="text-zinc-400 text-[11px]">{formatRupiah(kas.amount)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPaid ? (
                    <Badge variant="success" size="sm">
                      <Check className="w-3 h-3" /> LUNAS
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      <Clock className="w-3 h-3" /> BELUM
                    </Badge>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleKasStatus(kas.tenant_id)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors active:scale-95 ${
                      isPaid
                        ? 'bg-gray-100 hover:bg-gray-200 text-zinc-700'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm'
                    }`}
                  >
                    {isPaid ? 'Batal' : 'Bayar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FORM INPUT PENGELUARAN RIIL BULANAN */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-zinc-700" />
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Catat Pengeluaran Riil ({monthLabel})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="text-xs text-zinc-500 hover:text-zinc-800 font-medium"
          >
            {isFormVisible ? 'Tutup Form' : '+ Tambah Nota'}
          </button>
        </div>

        {isFormVisible && (
          <form
            onSubmit={handleExpenseSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1"
          >
            <div>
              <label className="block font-semibold text-zinc-600 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-900 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="Listrik">Listrik</option>
                <option value="WiFi">WiFi</option>
                <option value="Sampah">Sampah</option>
                <option value="Stok Makanan">Stok Makanan</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-600 mb-1">
                Nominal (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 350000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-600 mb-1">
                Deskripsi
              </label>
              <input
                type="text"
                placeholder="Keterangan pengeluaran"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-900 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          </form>
        )}

        {/* DAFTAR PENGELUARAN RIIL */}
        <div className="pt-2">
          <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Riwayat Nota ({currentMonthExpenses.length}):
          </h4>
          <div className="divide-y divide-gray-100 text-xs">
            {currentMonthExpenses.length === 0 ? (
              <p className="text-zinc-400 italic text-center py-3">
                Belum ada nota pengeluaran tercatat untuk {monthLabel}.
              </p>
            ) : (
              currentMonthExpenses.map((exp) => (
                <div key={exp.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-zinc-900 block">{exp.description || exp.category}</span>
                    <span className="text-[11px] text-zinc-400">{exp.category}</span>
                  </div>
                  <span className="font-bold text-zinc-900 shrink-0">
                    {formatRupiah(exp.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
