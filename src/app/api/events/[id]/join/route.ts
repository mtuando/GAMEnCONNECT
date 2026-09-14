/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id, 10);
  const userId = Number(session.user.id);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: { select: { participants: true } },
          participants: { where: { userId } },
        },
      });

      if (!event) throw new Error('NOT_FOUND');
      if (event.participants.length > 0) throw new Error('ALREADY_JOINED');
      if (event._count.participants >= event.maxParticipants) throw new Error('EVENT_FULL');

      return await tx.eventParticipant.create({
        data: { eventId, userId },
      });
    });

    return NextResponse.json({ success: true, participant: result });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (error.message === 'ALREADY_JOINED') return NextResponse.json({ error: 'Already joined this event' }, { status: 400 });
    if (error.message === 'EVENT_FULL') return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
