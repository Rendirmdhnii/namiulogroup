import React, { useState } from 'react';
import { TenantRentSummary } from '@/types';
import { formatRupiah, formatTanggal } from '@/lib/utils';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Plus, History, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface RentModuleProps {
  tenantSummaries: TenantRentSummary[];
  onOpenAddPayment: (tenantId?: string) => void;
}

export const RentModule: React.FC<RentModuleProps> = ({
  tenantSummaries,
  onOpenAddPayment,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalTarget = 35_000_000;
  const totalPaid = tenantSummaries.reduce((acc, curr) => acc + curr.total_paid, 0);
  const totalRemaining = totalTarget - totalPaid;
  const overallPercentage = (totalPaid / totalTarget) * 100;

  return (
    <section className="space-y-5">
      {/* SECTION HEADER */}
      <div className="bg-white rounded-xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Sewa Kontrakan Tahunan
            </h2>
            <Badge variant="neutral" size="sm">
              Sistem Cicil
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Total biaya sewa rumah <span className="font-semibold text-zinc-800">{formatRupiah(totalTarget)}</span> per tahun.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
              Total Terkumpul
            </span>
            <span className="text-base font-bold text-zinc-900">
              {formatRupiah(totalPaid)}{' '}
              <span className="text-xs font-normal text-zinc-500">
                ({overallPercentage.toFixed(1)}%)
              </span>
            </span>
            <span className="text-xs text-zinc-500 block">
              Sisa yang belum dibayar:{' '}
              <strong className="text-amber-700 font-medium">
                {formatRupiah(totalRemaining)}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddPayment()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Cicilan
          </button>
        </div>
      </div>

      {/* INDIVIDUAL CARDS (TIDAK ADA LABEL TIPE KAMAR, HANYA NAMA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tenantSummaries.map(({ tenant, total_paid, remaining_balance, progress_percentage, history }) => {
          const isLunas = remaining_balance <= 0;
          const isExpanded = expandedId === tenant.id;

          return (
            <div
              key={tenant.id}
              className={`bg-white rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isLunas
                  ? 'border-emerald-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                  : 'border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-zinc-300'
              }`}
            >
              <div>
                {/* CARD HEADER (HANYA NAMA SAJA) */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isLunas
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {tenant.name.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900 tracking-tight">
                        {tenant.name}
                      </h3>
                    </div>
                  </div>

                  <div>
                    {isLunas ? (
                      <Badge variant="success" size="sm">
                        <Check className="w-3 h-3" /> LUNAS
                      </Badge>
                    ) : total_paid > 0 ? (
                      <Badge variant="warning" size="sm">
                        <Clock className="w-3 h-3" /> CICILAN
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        BELUM BAYAR
                      </Badge>
                    )}
                  </div>
                </div>

                {/* TARGET & BALANCE STATS */}
                <div className="py-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Target Kewajiban:</span>
                    <span className="font-medium text-zinc-800">{formatRupiah(tenant.rent_target)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Sudah Dibayar:</span>
                    <span className="font-semibold text-zinc-900">{formatRupiah(total_paid)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Sisa Belum Dibayar:</span>
                    <span
                      className={`font-semibold ${
                        isLunas ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {formatRupiah(remaining_balance)}
                    </span>
                  </div>

                  {/* MINIMALIST PROGRESS BAR */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[11px] text-zinc-500 mb-1">
                      <span>Progres Kelunasan</span>
                      <span className="font-medium text-zinc-700">
                        {progress_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={progress_percentage}
                      heightClass="h-1.5"
                      barColor={
                        isLunas
                          ? 'bg-emerald-500'
                          : progress_percentage > 0
                          ? 'bg-amber-500'
                          : 'bg-zinc-200'
                      }
                    />
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(tenant.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors py-1 px-1.5 rounded hover:bg-zinc-50"
                >
                  <History className="w-3 h-3" />
                  <span>{history.length} Riwayat</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {!isLunas ? (
                  <button
                    type="button"
                    onClick={() => onOpenAddPayment(tenant.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Cicilan</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-medium text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded">
                    Lunas
                  </span>
                )}
              </div>

              {/* EXPANDABLE RIWAYAT PEMBAYARAN */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-zinc-100 text-xs space-y-1.5">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Catatan Pembayaran:
                  </h4>
                  {history.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 italic">Belum ada cicilan tercatat.</p>
                  ) : (
                    history.map((h, i) => (
                      <div
                        key={h.id || i}
                        className="flex justify-between items-center text-[11px] py-1 px-2 bg-zinc-50 rounded"
                      >
                        <div>
                          <span className="font-semibold text-zinc-800">
                            {formatRupiah(h.amount)}
                          </span>
                          {h.notes && (
                            <span className="text-zinc-400 block text-[10px]">
                              {h.notes}
                            </span>
                          )}
                        </div>
                        <span className="text-zinc-400 font-mono text-[10px]">
                          {formatTanggal(h.paid_at || h.payment_date || '')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
