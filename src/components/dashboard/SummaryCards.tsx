import React from 'react';
import { DashboardSummary } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Building2, Wallet, Users, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isDeficit = summary.kas_difference < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* CARD 1: SEWA KONTRAKAN TAHUNAN */}
      <div className="bg-white rounded-xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Sewa Kontrakan
          </span>
          <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
            <Building2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-zinc-900">
            {formatRupiah(summary.total_rent_paid)}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            dari total target <span className="font-medium text-zinc-800">{formatRupiah(summary.total_rent_target)}</span>
          </p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1 font-medium">
            <span className="text-zinc-600">{summary.rent_progress_percentage.toFixed(1)}% Terkumpul</span>
            <span className="text-amber-700 font-semibold">Sisa: {formatRupiah(summary.total_rent_remaining)}</span>
          </div>
          <ProgressBar percentage={summary.rent_progress_percentage} heightClass="h-2" />
        </div>
      </div>

      {/* CARD 2: KAS OPERASIONAL VS TAGIHAN (MERAH JIKA MINUS) */}
      <div
        className={`bg-white rounded-xl p-6 border shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${
          isDeficit ? 'border-rose-200/90' : 'border-zinc-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Kas vs Tagihan Fix Bulanan
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDeficit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-2xl font-bold tracking-tight ${
              isDeficit ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {summary.kas_difference === 0
              ? 'Rp 0 (Pas)'
              : `${isDeficit ? '-' : '+'}${formatRupiah(Math.abs(summary.kas_difference))}`}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Terkumpul {formatRupiah(summary.total_kas_collected)} vs Tagihan {formatRupiah(summary.total_operational_bill)}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1 font-medium">
            <span className="text-zinc-600">Rasio Tagihan Terpenuhi</span>
            <span className={isDeficit ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
              {((summary.total_kas_collected / summary.total_operational_bill) * 100).toFixed(0)}%
            </span>
          </div>
          <ProgressBar
            percentage={(summary.total_kas_collected / summary.total_operational_bill) * 100}
            heightClass="h-2"
            barColor={isDeficit ? 'bg-rose-500' : 'bg-emerald-500'}
          />
        </div>
      </div>

      {/* CARD 3: STATUS IURAN KAS 5 ANAK */}
      <div className="bg-white rounded-xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Iuran Kas Bulan Ini
          </span>
          <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-zinc-900">
            {summary.tenants_kas_paid_count} / {summary.total_tenants_count}{' '}
            <span className="text-sm font-normal text-zinc-500">Anak Lunas</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Kewajiban per anak: <strong className="text-zinc-700">Rp 257.000/bulan</strong>
          </p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-xs mb-1 font-medium">
            <span className="text-zinc-600">Kepatuhan Iuran</span>
            <span className="text-zinc-800 font-semibold">
              {((summary.tenants_kas_paid_count / summary.total_tenants_count) * 100).toFixed(0)}%
            </span>
          </div>
          <ProgressBar
            percentage={(summary.tenants_kas_paid_count / summary.total_tenants_count) * 100}
            heightClass="h-2"
            barColor="bg-zinc-800"
          />
        </div>
      </div>
    </div>
  );
};
