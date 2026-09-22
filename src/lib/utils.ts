export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRupiah(amount: number): string {
  if (amount >= 1_000_000) {
    const formatted = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `Rp ${formatted} Jt`;
  }
  if (amount >= 1_000) {
    const formatted = (amount / 1_000).toFixed(0);
    return `Rp ${formatted} Rb`;
  }
  return formatRupiah(amount);
}

export function formatTanggal(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
