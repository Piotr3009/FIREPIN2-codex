import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function OperativePinsPage() {
  const session = await requireRole(['OPERATIVE']);
  const pins = await prisma.pin.findMany({
    where: { assignedOperativeId: session.userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, pinNumber: true, status: true }
  });

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">My Assigned Pins</h1>
      {pins.map((pin) => (
        <article key={pin.id} className="rounded bg-white p-3 shadow">
          <p className="font-medium">{pin.pinNumber}</p>
          <p className="text-sm text-slate-600">Status: {pin.status}</p>
        </article>
      ))}
    </div>
  );
}
