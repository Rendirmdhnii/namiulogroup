import React from 'react';
import { WaterHeaterPayment } from '@/types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Check, Clock, User, ShieldCheck } from 'lucide-react';

interface WaterHeaterModuleProps {
  payments: WaterHeaterPayment[];
  totalCost: number; // 1.100.000
  perPerson: number; // 220.000
  initialPayer: string; // Rendi
  onToggleStatus: (id: string) => void;
}

export const WaterHeaterModule: React.FC<WaterHeaterModuleProps> = ({
  payments,
  totalCost,
  perPerson,
  initialPayer,
  onToggleStatus,
}) => {
  const paidCount = payments.filter((p) => p.status === 'PAID').length;
  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);

  // 4 anak yang berhutang ke Rendi (target 4 x 220k = 880k)
  const reimbursementCollected = payments
    .filter((p) => !p.is_initial_payer && p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);
  const reimbursementTarget = totalCost - perPerson; // 880.000

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Patungan Water Heater
            </h2>
            <Badge variant="accent" size="sm">
              Total {formatRupiah(totalCost)}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
            Total biaya Rp 1.100.000 dibagi rata 5 orang (<strong className="text-zinc-800">{formatRupiah(perPerson)}/orang</strong>).
            Ditalangi awal oleh <strong className="text-zinc-800">{initialPayer}</strong> (otomatis LUNAS).
          </p>
        </div>

        <div className="flex sm:flex-col justify-between sm:text-right items-center sm:items-end bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
            Pengembalian ke {initialPayer}
          </span>
          <span className="text-sm sm:text-base font-bold text-zinc-900">
            {formatRupiah(reimbursementCollected)}{' '}
            <span className="text-xs font-normal text-zinc-400">
              / {formatRupiah(reimbursementTarget)}
            </span>
          </span>
          <span className="text-[11px] text-zinc-500 block">
            {paidCount} dari 5 anak lunas
          </span>
        </div>
      </div>

      {/* MINIMALIST PROGRESS */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-zinc-600">Progres Pelunasan</span>
          <span className="text-zinc-800 font-semibold">
            {((totalPaid / totalCost) * 100).toFixed(0)}% Selesai
          </span>
        </div>
        <ProgressBar
          percentage={(totalPaid / totalCost) * 100}
          heightClass="h-2"
          barColor="bg-emerald-500"
        />
      </div>

      {/* LIST 5 ANAK: MOBILE-FIRST RESPONSIVE (1 KOLOM DI HP, 5 KOLOM DI DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {payments.map((p) => {
          const isPaid = p.status === 'PAID';

          return (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isPaid
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                {/* TOP ROW: NAME & BADGE */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-zinc-700'
                      }`}
                    >
                      {p.name.substring(0, 1)}
                    </div>
                    <span className="font-semibold text-sm text-zinc-900 truncate">
                      {p.name}
                    </span>
                  </div>

                  <div>
                    {isPaid ? (
                      <Badge variant="success" size="sm">
                        <Check className="w-3 h-3" /> LUNAS
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm">
                        <Clock className="w-3 h-3" /> BELUM
                      </Badge>
                    )}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-1 py-1 text-xs">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Kewajiban:</span>
                    <span className="font-medium text-zinc-800">{formatRupiah(p.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Sisa Tagihan:</span>
                    <span className={`font-semibold ${isPaid ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isPaid ? 'Rp 0' : formatRupiah(p.amount)}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-0.5">
                    {p.is_initial_payer
                      ? 'Talangan Awal (Lunas)'
                      : isPaid
                      ? 'Sudah bayar ke Rendi'
                      : 'Hutang ke Rendi'}
                  </div>
                </div>
              </div>

              {/* ACTION: TOMBOL TANDAI LUNAS */}
              <div className="pt-3 mt-2 border-t border-gray-100">
                {p.is_initial_payer ? (
                  <div className="w-full py-2 px-2 text-center text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 rounded-lg">
                    Talangan Awal (Lunas)
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(p.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 active:scale-95 ${
                      isPaid
                        ? 'bg-gray-100 hover:bg-gray-200 text-zinc-700'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm'
                    }`}
                  >
                    {isPaid ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lunas (Ubah)</span>
                      </>
                    ) : (
                      <span>Tandai Lunas</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
