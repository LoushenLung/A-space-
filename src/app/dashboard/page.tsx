import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDateShort, getStatusInfo } from '@/lib/utils';
import Link from 'next/link';
import { CalendarCheck, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';

export default async function MemberDashboard() {
  const session = await auth();
  const memberId = (session?.user as any)?.memberId as string;

  const [member, reservasiList] = await Promise.all([
    prisma.member.findUnique({ where: { id: memberId } }),
    prisma.reservasi.findMany({
      where: { memberId },
      include: { space: { select: { namaSpace: true, tipe: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const statCards = [
    { label: 'Total Reservasi', value: reservasiList.length, icon: CalendarCheck, color: '#6366f1' },
    { label: 'Menunggu Konfirmasi', value: reservasiList.filter(r => r.status === 'belum_dikonfirm').length, icon: Clock, color: '#f59e0b' },
    { label: 'Reservasi Selesai', value: reservasiList.filter(r => r.status === 'selesai').length, icon: CheckCircle2, color: '#10b981' },
    { label: 'Dibatalkan', value: reservasiList.filter(r => r.status === 'dibatalkan').length, icon: XCircle, color: '#ef4444' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>
            Halo, <span className="text-gradient">{member?.namaMember ?? 'Member'}</span> 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Kelola reservasi dan booking space Anda</p>
        </div>
        <Link href="/booking" className="btn btn-primary" style={{ gap: 'var(--spacing-2)', textDecoration: 'none' }}>
          <Plus size={18} /> Booking Space
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel" style={{ padding: 'var(--spacing-5)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>{value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>Riwayat Reservasi</h2>
          <Link href="/dashboard/history" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-primary)' }}>Lihat semua →</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {reservasiList.map((r) => {
            const status = getStatusInfo(r.status);
            return (
              <Link key={r.id} href={`/dashboard/reservasi/${r.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-tertiary)', border: '1px solid var(--glass-border)',
                textDecoration: 'none', transition: 'border-color var(--transition-fast)',
              }}
              onMouseOver={(e: any) => e.currentTarget.style.borderColor = 'var(--color-accent-primary)'}
              onMouseOut={(e: any) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                    {r.space.namaSpace}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {formatDateShort(r.tanggalReservasi)} · {r.jamMulai} – {r.jamSelesai} ({r.durasiJam} jam)
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-secondary)' }}>
                    {r.kodeBooking}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {formatCurrency(Number(r.totalBayar))}
                  </span>
                  <span style={{ padding: '2px var(--spacing-3)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', background: status.bg, color: status.color.replace('text-', '') }}>
                    {status.label}
                  </span>
                </div>
              </Link>
            );
          })}
          {reservasiList.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-secondary)' }}>
              <CalendarCheck size={48} style={{ margin: '0 auto var(--spacing-4)', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>Belum ada reservasi. <Link href="/booking" style={{ color: 'var(--color-accent-primary)' }}>Booking sekarang!</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
