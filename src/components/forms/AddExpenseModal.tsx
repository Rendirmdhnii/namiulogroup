import React, { useState } from 'react';
import { ExpenseCategory, Tenant } from '@/types';
import { X, Receipt, Calendar, Tag, CreditCard, User, AlignLeft } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Tenant[];
  onSubmit: (data: {
    title: string;
    category: ExpenseCategory;
    amount: number;
    expense_date: string;
    description?: string;
    recorded_by?: string;
  }) => void;
}

const CATEGORIES: { label: ExpenseCategory; defaultAmount: number }[] = [
  { label: 'Listrik', defaultAmount: 350_000 },
  { label: 'WiFi', defaultAmount: 350_000 },
  { label: 'Sampah/Keamanan', defaultAmount: 50_000 },
  { label: 'Air & Gas', defaultAmount: 85_000 },
  { label: 'Sembako (Beras/Minyak)', defaultAmount: 200_000 },
  { label: 'Kebersihan', defaultAmount: 50_000 },
  { label: 'Lainnya', defaultAmount: 0 },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  tenants,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Listrik');
  const [amount, setAmount] = useState<string>('350000');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [recordedBy, setRecordedBy] = useState<string>('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (cat: ExpenseCategory) => {
    setCategory(cat);
    const found = CATEGORIES.find((c) => c.label === cat);
    if (found && found.defaultAmount > 0 && (!amount || amount === '0')) {
      setAmount(found.defaultAmount.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!title.trim()) {
      setError('Judul pengeluaran wajib diisi.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError('Masukkan nominal pengeluaran yang valid.');
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      amount: numericAmount,
      expense_date: expenseDate,
      description: description.trim() || undefined,
      recorded_by: recordedBy || undefined,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-rose-50/60 to-white dark:from-rose-950/30 dark:to-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Catat Pengeluaran Operasional
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Input pengeluaran riil kebutuhan bersama rumah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* KATEGORI */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Kategori Pengeluaran
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Tag className="w-4 h-4" />
              </div>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* JUDUL PENGELUARAN */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nama Pengeluaran / Item
            </label>
            <input
              type="text"
              placeholder="Contoh: Token Listrik 350k / Beli 2 Galon Aqua"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              required
            />
          </div>

          {/* NOMINAL & TANGGAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Nominal (Rp)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  placeholder="350000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Tanggal Pengeluaran
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* YANG MEMBELI / DITALANGI OLEH */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Dibeli / Ditalangi Oleh (Opsional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <User className="w-4 h-4" />
              </div>
              <select
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              >
                <option value="">Dari Kas Langsung / Tidak Disebutkan</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Deskripsi / Keterangan (Opsional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-zinc-400">
                <AlignLeft className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                placeholder="Misal: Nomor meter PLN 1432..., bayar lewat m-banking Rehan"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-medium text-white shadow-lg shadow-rose-600/25 transition-all"
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
