import { PrismaClient, Role, PenetrationType, PinStatus, PricingModel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.pinHistory.deleteMany();
  await prisma.pinPhoto.deleteMany();
  await prisma.pin.deleteMany();
  await prisma.drawingPage.deleteMany();
  await prisma.drawing.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.reportFile.deleteMany();
  await prisma.systemCatalogItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const admin = await prisma.user.create({ data: { name: 'Alex Admin', email: 'admin@firepin.local', passwordHash, role: Role.ADMIN } });
  const op1 = await prisma.user.create({ data: { name: 'Owen Operative', email: 'operative1@firepin.local', passwordHash, role: Role.OPERATIVE } });
  const op2 = await prisma.user.create({ data: { name: 'Rita Operative', email: 'operative2@firepin.local', passwordHash, role: Role.OPERATIVE } });

  const project = await prisma.project.create({
    data: {
      name: 'Riverside Apartments Block A',
      clientName: 'Riverside Developments Ltd',
      ukAddress: '12 Albion Street, Manchester, M1 2AB, United Kingdom',
      projectNumber: 'FP-2026-001'
    }
  });

  await prisma.projectMember.createMany({
    data: [
      { userId: admin.id, projectId: project.id, role: Role.ADMIN },
      { userId: op1.id, projectId: project.id, role: Role.OPERATIVE },
      { userId: op2.id, projectId: project.id, role: Role.OPERATIVE }
    ]
  });

  const ground = await prisma.floor.create({ data: { projectId: project.id, name: 'Ground Floor', sortOrder: 1 } });
  const first = await prisma.floor.create({ data: { projectId: project.id, name: 'First Floor', sortOrder: 2 } });
  const z1 = await prisma.zone.create({ data: { floorId: ground.id, name: 'Lobby', sortOrder: 1 } });
  const z2 = await prisma.zone.create({ data: { floorId: ground.id, name: 'Plant Room', sortOrder: 2 } });
  const z3 = await prisma.zone.create({ data: { floorId: first.id, name: 'Corridor East', sortOrder: 1 } });

  const drawing = await prisma.drawing.create({ data: { zoneId: z1.id, title: 'GA-Lobby', pdfPath: '/uploads/demo-lobby.pdf', revision: 'P01' } });
  const page = await prisma.drawingPage.create({ data: { drawingId: drawing.id, pageNumber: 1, pageLabel: 'Sheet 1', width: 2480, height: 3508 } });

  const system = await prisma.systemCatalogItem.create({
    data: {
      manufacturer: 'Hilti',
      systemName: 'CP 644 Pipe Collar',
      referenceCode: 'ETA-22/001',
      penetrationType: PenetrationType.pipe,
      fireRating: 'EI120',
      minDiameterMm: 50,
      maxDiameterMm: 160,
      instructions: 'Install as per manufacturer guidance and torque fixing schedule.',
      pricingModel: PricingModel.flat_per_pin,
      unitPrice: 145.0
    }
  });

  const statuses = [PinStatus.new, PinStatus.in_progress, PinStatus.needs_remedial, PinStatus.approved, PinStatus.new, PinStatus.approved];
  for (let i = 0; i < 6; i++) {
    await prisma.pin.create({
      data: {
        projectId: project.id,
        floorId: i < 3 ? ground.id : first.id,
        zoneId: i % 2 === 0 ? z1.id : z3.id,
        drawingId: drawing.id,
        drawingPageId: page.id,
        pinNumber: `P-${String(i + 1).padStart(3, '0')}`,
        xPercent: 10 + i * 7,
        yPercent: 20 + i * 5,
        penetrationType: PenetrationType.pipe,
        diameterMm: 110,
        selectedSystemId: system.id,
        priceNet: 145,
        priceCalculationJson: { model: 'flat_per_pin', value: 145 },
        assignedOperativeId: i % 2 === 0 ? op1.id : op2.id,
        status: statuses[i],
        createdById: admin.id,
        updatedById: admin.id,
        instructionSnapshot: 'Install as per manufacturer guidance and torque fixing schedule.',
        systemSnapshotJson: { manufacturer: 'Hilti', referenceCode: 'ETA-22/001' }
      }
    });
  }

  console.log('Seed complete.');
}

main().finally(() => prisma.$disconnect());
