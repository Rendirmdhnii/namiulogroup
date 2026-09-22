import React from 'react';
import Image from 'next/image';
import { X, QrCode } from 'lucide-react';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const QrisModal: React.FC<QrisModalProps> = ({
  isOpen,
  onClose,
  title = 'Scan QRIS Pembayaran',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden text-center">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QRIS BODY */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-65 h-87.5 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 shadow-inner flex items-center justify-center">
            <Image
              src="/WhatsApp Image 2026-09-22 at 21.27.58.jpeg"
              alt="QRIS Pembayaran Merchant PAHAMIN DIGITAL"
              fill
              sizes="260px"
              className="object-contain p-1"
              priority
            />
          </div>

          {/* TEKS DI BAWAH GAMBAR */}
          <div className="mt-4 space-y-1">
            <div className="text-xs font-semibold text-zinc-900 tracking-tight">
              Merchant: <span className="font-bold text-zinc-900">PAHAMIN DIGITAL</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              NMID: ID1026506480312
            </p>
            <p className="text-[11px] text-zinc-500 pt-1">
              Bisa di-scan dari GoPay, BCA, Mandiri, BNI, BRI, OVO, DANA, dan seluruh bank.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
