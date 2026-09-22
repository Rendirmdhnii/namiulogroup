import React from 'react';
import { MonthlyKasPayment, FixedCostItem } from '@/types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Check, Clock, CreditCard, ArrowDownRight, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KasModuleProps {
  kasPayments: MonthlyKasPayment[];
  fixedCosts: FixedCostItem[];
  totalOperationalBill: number; // 1.285.000
  monthLabel: string;
  onTogglePayment: (tenantId: string) => void;
  onOpenPayModal: (tenantId?: string) => void;
}

export const KasModule: React.FC<KasModuleProps> = ({
  kasPayments,
  fixedCosts,
  totalOperationalBill,
  monthLabel,
  onTogglePayment,
  onOpenPayModal,
}) => {
  const totalKasCollected = kasPayments
    .filter((p) => p.is_paid || p.status === 'PAID')
    .reduce((acc, p) => acc + (p.amount_paid ?? (p.status === 'PAID' ? p.amount : 0)), 0);

  const kasDifference = totalKasCollected - totalOperationalBill;
  const isDeficit = kasDifference < 0;
  const paidCount = kasPayments.filter((p) => p.is_paid).length;
  const totalTenants = kasPayments.length;
  const collectionPercentage = (totalKasCollected / totalOperationalBill) * 100;

  return (
    <section className="space-y-6">
      {/* 1. RINGKASAN VISUAL ANGKA BESAR YANG ELEGAN */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
                Kas & Operasional Bulanan
              </h2>
              <Badge variant="neutral" size="sm">
                {monthLabel}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-lg">
              Kewajiban kas sebesar <strong className="text-zinc-800 font-semibold">Rp 257.000/orang</strong> untuk menutup total tagihan fix bulanan <strong className="text-zinc-800 font-semibold">{formatRupiah(totalOperationalBill)}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenPayModal()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-sm self-start lg:self-auto"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Bayar Kas Baru
          </button>
        </div>

        {/* 3 KOLOM ANGKA BESAR: TERKUMPUL vs TAGIHAN vs SELISIH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* TOTAL KAS TERKUMPUL */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Kas Terkumpul
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {formatRupiah(totalKasCollected)}
            </div>
            <p className="text-xs text-zinc-500">
              {paidCount} dari {totalTenants} anak telah membayar
            </p>
          </div>

          {/* TOTAL TAGIHAN OPERASIONAL */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Tagihan Fix Cost
            </span>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {formatRupiah(totalOperationalBill)}
            </div>
            <p className="text-xs text-zinc-500">
              Sampah, WiFi, Listrik, Stok Makanan
            </p>
          </div>

          {/* STATUS SALDO / DEFISIT (MERAH JIKA MINUS) */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {isDeficit ? 'Defisit Kekurangan Kas' : 'Surplus Saldo Kas'}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isDeficit ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {kasDifference === 0
                ? 'Rp 0 (Pas)'
                : `${isDeficit ? '-' : '+'}${formatRupiah(Math.abs(kasDifference))}`}
            </div>
            <p className="text-xs text-zinc-500">
              {isDeficit ? (
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline" /> Perlu pelunasan dari {totalTenants - paidCount} anak lagi
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">
                  Semua tagihan operasional tercukupi
                </span>
              )}
            </p>
          </div>
        </div>

        {/* PROGRESS BAR PENGUMPULAN KAS */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-zinc-600">Rasio Pengumpulan Kas Bulan Ini</span>
            <span className={isDeficit ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
              {collectionPercentage.toFixed(1)}% Terpenuhi
            </span>
          </div>
          <ProgressBar
            percentage={collectionPercentage}
            heightClass="h-2"
            barColor={isDeficit ? 'bg-amber-500' : 'bg-emerald-500'}
          />
        </div>
      </div>

      {/* 2. RINCIAN FIX COST BULANAN (Rp 1.285.000) */}
      <div className="bg-white rounded-xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
            Rincian Tagihan Fix Cost Bulanan (Rp 1.285.000)
          </h3>
          <span className="text-xs text-zinc-400">
            Total 4 Pos Pengeluaran
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {fixedCosts.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/50 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                  {item.category}
                </span>
                <span className="font-semibold text-zinc-800 text-sm mt-0.5 block">
                  {item.name}
                </span>
                {item.description && (
                  <p className="text-[11px] text-zinc-400 mt-1">{item.description}</p>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-200/50 flex justify-between items-center">
                <span className="text-zinc-500">Nominal:</span>
                <span className="font-bold text-zinc-900">{formatRupiah(item.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TABEL PEMASUKAN KAS (5 ANAK, TARGET @Rp 257.000) */}
      <div className="bg-white rounded-xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              Status Pembayaran Kas 5 Penghuni
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kewajiban per orang: <strong className="text-zinc-700">Rp 257.000/bulan</strong>
            </p>
          </div>

          <div className="text-xs text-zinc-500">
            Status: <span className="font-semibold text-zinc-800">{paidCount}</span> / {totalTenants} Lunas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-zinc-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-semibold">Nama Penghuni</th>
                <th className="py-3 px-4 font-semibold">Kewajiban Kas</th>
                <th className="py-3 px-4 font-semibold">Jumlah Terbayar</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Tanggal / Catatan</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {kasPayments.map((p) => {
                const isPaid = p.is_paid;

                return (
                  <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                    {/* NAMA (TANPA LABEL KAMAR) */}
                    <td className="py-3.5 px-4 font-medium text-zinc-900">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {p.name.substring(0, 1)}
                        </div>
                        <span className="font-semibold text-zinc-900">{p.name}</span>
                      </div>
                    </td>

                    {/* KEWAJIBAN */}
                    <td className="py-3.5 px-4 font-medium text-zinc-700">
                      {formatRupiah(p.target_amount ?? p.amount ?? 257_000)}
                    </td>

                    {/* JUMLAH TERBAYAR */}
                    <td className="py-3.5 px-4 font-semibold">
                      <span className={isPaid ? 'text-zinc-900' : 'text-zinc-400'}>
                        {formatRupiah(p.amount_paid ?? (p.status === 'PAID' ? p.amount : 0))}
                      </span>
                    </td>

                    {/* STATUS BADGE */}
                    <td className="py-3.5 px-4">
                      {isPaid ? (
                        <Badge variant="success" size="sm">
                          <Check className="w-3 h-3" /> Lunas
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          <Clock className="w-3 h-3" /> Belum Lunas
                        </Badge>
                      )}
                    </td>

                    {/* TANGGAL */}
                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {isPaid && p.paid_at ? (
                        <span>
                          {formatTanggal(p.paid_at)}{' '}
                          {p.payment_method ? `(${p.payment_method})` : ''}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">Menunggu pembayaran</span>
                      )}
                    </td>

                    {/* AKSI TOGGLE CEPAT */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onTogglePayment(p.tenant_id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isPaid
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Batal Lunas</span>
                          </>
                        ) : (
                          <>
                            <span>Tandai Lunas</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
