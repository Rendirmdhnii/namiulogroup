import React, { useState, useEffect } from 'react';
import { Tenant, TenantRentSummary } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { X, CreditCard, Calendar, Plus } from 'lucide-react';

interface AddRentPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Tenant[];
  tenantSummaries: TenantRentSummary[];
  defaultTenantId?: string;
  onSubmit: (data: { tenant_id: string; amount: number; payment_date: string; notes?: string }) => void;
}

export const AddRentPaymentModal: React.FC<AddRentPaymentModalProps> = ({
  isOpen,
  onClose,
  tenants,
  tenantSummaries,
  defaultTenantId,
  onSubmit,
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (defaultTenantId) {
      setSelectedTenantId(defaultTenantId);
    } else if (tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [defaultTenantId, tenants, isOpen]);

  if (!isOpen) return null;

  const currentSummary = tenantSummaries.find((s) => s.tenant.id === selectedTenantId);
  const remaining = currentSummary ? currentSummary.remaining_balance : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!selectedTenantId) {
      setError('Silakan pilih penghuni.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError('Masukkan nominal cicilan yang valid.');
      return;
    }

    onSubmit({
      tenant_id: selectedTenantId,
      amount: numericAmount,
      payment_date: paymentDate,
      notes: notes || undefined,
    });

    setAmount('');
    setNotes('');
    onClose();
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Tambah Cicilan Sewa
            </h3>
            <p className="text-xs text-zinc-400">
              Catat cicilan uang sewa kontrakan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {/* PILIH PENGHUNI */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Penghuni
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Beban: {formatRupiah(t.rent_target)})
                </option>
              ))}
            </select>

            {currentSummary && (
              <div className="mt-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Sisa Tagihan:</span>
                <span className="font-semibold text-amber-700">
                  {formatRupiah(remaining)}
                </span>
              </div>
            )}
          </div>

          {/* NOMINAL CICILAN */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Nominal Cicilan (Rp)
            </label>
            <input
              type="number"
              placeholder="Contoh: 1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs font-semibold"
              required
            />

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[500_000, 1_000_000, 2_000_000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAmount(val)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                >
                  +{formatRupiah(val)}
                </button>
              ))}
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(remaining)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors border border-emerald-200/60"
                >
                  Lunaskan Sisa ({formatRupiah(remaining)})
                </button>
              )}
            </div>
          </div>

          {/* TANGGAL */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
              required
            />
          </div>

          {/* CATATAN */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Misal: Cicilan ke-2 transfer via BCA"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold shadow-sm transition-all"
            >
              Simpan Cicilan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
