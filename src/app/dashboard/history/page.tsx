"use client";

import { useState, useEffect, useCallback } from 'react';
import { formatCurrency, formatDateShort, getStatusInfo } from '@/lib/utils';
import { CalendarCheck, Download, Filter } from 'lucide-react';
import Link from 'next/link';

type Reservasi = {
  id: string; kodeBooking: string; tanggalReservasi: string;
  jamMulai: string; jamSelesai: string; durasiJam: number;
  totalBayar: number; status: string;
  space: { namaSpace: string; tipe: string };
};

export default function MemberHistoryPage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [data, setData] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/reservasi?month=${month}&year=${year}`);
    const json = await res.json();
    setData(json.data ?? []);
    setLoading(false);
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: new Date(2024, i).toLocaleString('id-ID', { month: 'long' }) }));

  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>Histori Pemesanan</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>Riwayat semua reservasi Anda berdasarkan bulan</p>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <Filter size={16} style={{ color: 'var(--color-text-secondary)' }} />
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: 'var(--spacing-2) var(--spacing-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: 'var(--spacing-2) var(--spacing-4)', background: 'var(--color-bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{data.length} reservasi ditemukan</span>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        {loading ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>Memuat...</p>
        ) : data.length === 0 ? (
          <div className="glass-panel" style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <CalendarCheck size={48} style={{ margin: '0 auto var(--spacing-4)', opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Tidak ada reservasi di bulan ini</p>
          </div>
        ) : data.map(r => {
          const status = getStatusInfo(r.status);
          const statusColor = r.status === 'belum_dikonfirm' ? '#f59e0b' : r.status === 'disetujui' ? '#6366f1' : r.status === 'aktif' ? '#10b981' : r.status === 'selesai' ? '#a0a0b0' : '#ef4444';
          return (
            <div key={r.id} className="glass-panel" style={{ padding: 'var(--spacing-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <div style={{ fontWeight: 600 }}>{r.space.namaSpace}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {formatDateShort(r.tanggalReservasi)} · {r.jamMulai} – {r.jamSelesai} ({r.durasiJam} jam)
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-secondary)' }}>{r.kodeBooking}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{formatCurrency(Number(r.totalBayar))}</div>
                  <span style={{ padding: '3px var(--spacing-3)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 600, background: `${statusColor}20`, color: statusColor }}>{status.label}</span>
                </div>
                {['disetujui', 'aktif', 'selesai'].includes(r.status) && (
                  <Link href={`/api/reservasi/${r.id}/e-ticket`} target="_blank" title="Download E-Ticket" style={{ padding: 'var(--spacing-2) var(--spacing-3)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                    <Download size={14} /> E-Ticket
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
