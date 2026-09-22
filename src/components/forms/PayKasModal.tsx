import React, { useState, useEffect } from 'react';
import { Tenant, MonthlyKasPayment } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { X, Check } from 'lucide-react';

interface PayKasModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: Tenant[];
  currentKasPayments: MonthlyKasPayment[];
  defaultTenantId?: string;
  monthLabel: string;
  onSubmit: (data: { tenant_id: string; amount: number; payment_method: string; notes?: string }) => void;
}

export const PayKasModal: React.FC<PayKasModalProps> = ({
  isOpen,
  onClose,
  tenants,
  defaultTenantId,
  monthLabel,
  onSubmit,
}) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [amount, setAmount] = useState<number>(257_000);
  const [paymentMethod, setPaymentMethod] = useState<string>('Transfer');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (defaultTenantId) {
      setSelectedTenantId(defaultTenantId);
      const tenant = tenants.find((t) => t.id === defaultTenantId);
      if (tenant) {
        setAmount(tenant.kas_target || 257_000);
      }
    } else if (tenants.length > 0) {
      setSelectedTenantId(tenants[0].id);
      setAmount(tenants[0].kas_target || 257_000);
    }
  }, [defaultTenantId, tenants, isOpen]);

  if (!isOpen) return null;

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setAmount(tenant.kas_target || 257_000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId) return;

    onSubmit({
      tenant_id: selectedTenantId,
      amount,
      payment_method: paymentMethod,
      notes: notes || undefined,
    });

    onClose();
  };

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Bayar Iuran Kas
            </h3>
            <p className="text-xs text-zinc-400">
              Periode {monthLabel}
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
          {/* PILIH PENGHUNI */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Penghuni
            </label>
            <select
              value={selectedTenantId}
              onChange={(e) => handleTenantChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Beban: {formatRupiah(t.kas_target || 257_000)})
                </option>
              ))}
            </select>
          </div>

          {/* NOMINAL BAYAR */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Nominal Iuran (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 font-bold focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
              required
            />
            <p className="mt-1 text-[11px] text-zinc-400">
              Kewajiban kas bulanan bersama: Rp 257.000 / orang
            </p>
          </div>

          {/* METODE PEMBAYARAN */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Transfer', 'QRIS', 'Tunai'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all ${
                    paymentMethod === m
                      ? 'bg-zinc-900 border-zinc-900 text-white font-semibold'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* CATATAN */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Misal: Sudah ditransfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-xs"
            />
          </div>

          {/* ACTIONS */}
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
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
