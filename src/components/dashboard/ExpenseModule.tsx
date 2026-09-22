import React, { useState } from 'react';
import { Expense, ExpenseCategory, Tenant } from '@/types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { ESTIMATED_MONTHLY_BUDGET } from '@/lib/mockData';
import {
  Plus,
  Receipt,
  Tag,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface ExpenseModuleProps {
  expenses: Expense[];
  tenants: Tenant[];
  totalKasCollected: number;
  monthLabel: string;
  onAddExpense: (data: {
    title: string;
    category: ExpenseCategory;
    amount: number;
    expense_date: string;
    description?: string;
    recorded_by?: string;
  }) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Listrik',
  'WiFi',
  'Sampah/Keamanan',
  'Air & Gas',
  'Sembako (Beras/Minyak)',
  'Kebersihan',
  'Lainnya',
];

export const ExpenseModule: React.FC<ExpenseModuleProps> = ({
  expenses,
  tenants,
  totalKasCollected,
  monthLabel,
  onAddExpense,
}) => {
  // Inline Minimalist Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Listrik');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBalance = totalKasCollected - totalExpense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!title.trim() || !num || num <= 0) return;

    onAddExpense({
      title: title.trim(),
      category,
      amount: num,
      expense_date: expenseDate,
      description: description.trim() || undefined,
      recorded_by: recordedBy || undefined,
    });

    setTitle('');
    setAmount('');
    setDescription('');
  };

  // Group by category for visual summary chart
  const categorySpending = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section className="space-y-6">
      {/* RINGKASAN SALDO KAS TERSISA */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Kalkulasi Transparansi Kas Periode {monthLabel}
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-sm sm:text-base font-semibold">
            <span className="text-zinc-800">
              Total Kas: <span className="text-emerald-600">{formatRupiah(totalKasCollected)}</span>
            </span>
            <span className="text-zinc-300">−</span>
            <span className="text-zinc-800">
              Total Pengeluaran: <span className="text-rose-500">{formatRupiah(totalExpense)}</span>
            </span>
            <span className="text-zinc-300">=</span>
            <span className="text-emerald-700 font-bold text-lg bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
              Saldo Kas Tersisa: {formatRupiah(remainingBalance)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          {isFormVisible ? 'Sembunyikan Form' : '+ Catat Pengeluaran'}
        </button>
      </div>

      {/* FORM INPUT MINIMALIS */}
      {isFormVisible && (
        <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
            <Receipt className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Form Input Pengeluaran Operasional
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            {/* KATEGORI */}
            <div className="lg:col-span-1">
              <label className="block font-semibold text-zinc-600 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* NAMA PENGELUARAN */}
            <div className="lg:col-span-2">
              <label className="block font-semibold text-zinc-600 mb-1">
                Nama Pengeluaran / Item
              </label>
              <input
                type="text"
                placeholder="Contoh: Beli 2 Galon Aqua & Gas 3kg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
                required
              />
            </div>

            {/* NOMINAL */}
            <div className="lg:col-span-1">
              <label className="block font-semibold text-zinc-600 mb-1">
                Nominal (Rp)
              </label>
              <input
                type="number"
                placeholder="85000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs font-semibold"
                required
              />
            </div>

            {/* CATATAN */}
            <div className="lg:col-span-1">
              <label className="block font-semibold text-zinc-600 mb-1">
                Catatan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Via transfer Rehan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RINGKASAN POS KATEGORI (SIMPLE CHART CARDS) */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          Realisasi Pengeluaran per Kategori
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c !== 'Lainnya').map((cat) => {
            const spent = categorySpending[cat] || 0;
            return (
              <div
                key={cat}
                className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/60 flex flex-col justify-between"
              >
                <span className="text-[11px] font-medium text-zinc-500 truncate">{cat}</span>
                <span className="text-sm font-bold text-zinc-800 mt-2">
                  {formatRupiah(spent)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIWAYAT PENGELUARAN TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            Riwayat Nota Pengeluaran
            <Badge variant="neutral" size="sm">
              {expenses.length} Transaksi
            </Badge>
          </h3>
          <span className="text-xs font-semibold text-zinc-500">
            Total Riil: <span className="text-rose-600 font-bold">{formatRupiah(totalExpense)}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Tanggal</th>
                <th className="py-2.5 px-3 font-semibold">Kategori</th>
                <th className="py-2.5 px-3 font-semibold">Deskripsi Pengeluaran</th>
                <th className="py-2.5 px-3 font-semibold">Catatan</th>
                <th className="py-2.5 px-3 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-400 italic">
                    Belum ada pengeluaran yang dicatat bulan ini.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-zinc-500 text-[11px]">
                      {formatTanggal(exp.expense_date || exp.created_at || '')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-zinc-900">
                      {exp.title}
                    </td>
                    <td className="py-3 px-3 text-zinc-400 text-[11px]">
                      {exp.description || '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-zinc-900">
                      {formatRupiah(exp.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
