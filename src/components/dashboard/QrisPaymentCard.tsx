import React from 'react';
import Image from 'next/image';
import { QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface QrisPaymentCardProps {
  onOpenModal?: () => void;
}

export const QrisPaymentCard: React.FC<QrisPaymentCardProps> = ({ onOpenModal }) => {
  return (
    <section className="bg-white rounded-xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 tracking-tight">
              Cara Pembayaran (Scan QRIS)
            </h2>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3" /> Auto-Verify
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Gunakan untuk pembayaran cicilan sewa, patungan water heater, atau iuran kas bulanan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">
            GoPay, BCA, Mandiri, BRI, BNI & Seluruh QRIS
          </span>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
        {/* QRIS DISPLAY CONTAINER */}
        <div className="flex flex-col items-center">
          <div className="relative p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow transition-shadow max-w-[320px]">
            <div className="flex items-center justify-between gap-2 mb-3 px-1">
              <span className="text-[11px] font-bold text-zinc-800 tracking-wider">
                QRIS RESMI KONTRAKAN
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
                Aktif
              </span>
            </div>

            {/* GAMBAR QRIS NEXT/IMAGE DENGAN PATH SPESIFIK USER */}
            <div className="relative w-70 h-95 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-inner flex items-center justify-center">
              <Image
                src="/WhatsApp Image 2026-09-22 at 21.27.58.jpeg"
                alt="QRIS Pembayaran Namiulogrup - Merchant: PAHAMIN DIGITAL"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-contain p-1"
                priority
              />
            </div>

            {/* KETERANGAN RESMI */}
            <div className="mt-4 text-center space-y-1">
              <div className="text-xs font-bold text-zinc-900">
                Merchant: <span className="text-indigo-600">PAHAMIN DIGITAL</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                NMID: ID1026506480312
              </p>
            </div>
          </div>
        </div>

        {/* INSTRUCTION GUIDE */}
        <div className="max-w-md space-y-4 text-xs text-zinc-600">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Petunjuk Pembayaran Mudah
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              Scan barcode di samping langsung dari layar handphone menggunakan aplikasi mobile banking atau e-wallet apa saja.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="font-semibold text-zinc-800 block">Buka Aplikasi Bank / e-Wallet</span>
                <span className="text-zinc-500 text-[11px]">
                  Pilih menu &quot;Scan QRIS&quot; dan arahkan kamera ke kode di layar.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-semibold text-zinc-800 block">Periksa Nama Merchant</span>
                <span className="text-zinc-500 text-[11px]">
                  Nama merchant yang tertera harus <strong className="text-zinc-800">PAHAMIN DIGITAL</strong>.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-semibold text-zinc-800 block">Masukkan Nominal Pembayaran</span>
                <span className="text-zinc-500 text-[11px]">
                  Input nominal cicilan sewa, kas Rp 257.000, atau water heater Rp 220.000.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <span className="font-semibold text-zinc-800 block">Konfirmasi di Web</span>
                <span className="text-zinc-500 text-[11px]">
                  Klik tombol <strong className="text-zinc-800">&quot;Tambah Cicilan&quot;</strong> atau <strong className="text-zinc-800">&quot;Tandai Lunas&quot;</strong> di dashboard.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
