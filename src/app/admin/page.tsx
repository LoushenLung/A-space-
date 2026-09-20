import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { CalendarCheck, Users, Building2, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();
  const spaceOwnerId = (session?.user as any)?.spaceOwnerId as string;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const startOfMonth = new Date(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);
  const startOfNextMonth = new Date(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

  const [totalSpaces, totalMembers, pendingReservasi, completedThisMonth] = await Promise.all([
    prisma.space.count({ where: { ownerId: spaceOwnerId, isActive: true } }),
    prisma.member.count(),
    prisma.reservasi.count({ where: { status: 'belum_dikonfirm' } }),
    prisma.reservasi.findMany({
      where: { status: 'selesai', tanggalReservasi: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
  ]);

  const pendapatanBulanIni = completedThisMonth.reduce((acc, r) => acc + Number(r.totalBayar), 0);

  const recentReservasi = await prisma.reservasi.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      member: { select: { namaMember: true } },
      space: { select: { namaSpace: true } },
    },
  });

  const statCards = [
    { label: 'Total Space Aktif', value: totalSpaces, icon: Building2, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Total Member', value: totalMembers, icon: Users, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Menunggu Konfirmasi', value: pendingReservasi, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Pendapatan Bulan Ini', value: formatCurrency(pendapatanBulanIni), icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  const statusColors: Record<string, string> = {
    belum_dikonfirm: '#f59e0b', disetujui: '#6366f1', aktif: '#10b981', selesai: '#a0a0b0', dibatalkan: '#ef4444',
  };
  const statusLabels: Record<string, string> = {
    belum_dikonfirm: 'Menunggu', disetujui: 'Disetujui', aktif: 'Aktif', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2)' }}>Dashboard Admin</h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Selamat datang di panel pengelolaan Ur-Space</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-lg)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{value}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="glass-panel" style={{ padding: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>Reservasi Terbaru</h2>
          <Link href="/admin/reservasi" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-primary)' }}>Lihat semua →</Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Kode Booking', 'Member', 'Space', 'Tanggal', 'Total Bayar', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--glass-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReservasi.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontFamily: 'monospace', color: 'var(--color-accent-primary)' }}>{r.kodeBooking}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{r.member.namaMember}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{r.space.namaSpace}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{new Date(r.tanggalReservasi).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(Number(r.totalBayar))}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <span style={{ display: 'inline-block', padding: '2px var(--spacing-3)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {recentReservasi.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-secondary)' }}>Belum ada reservasi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
