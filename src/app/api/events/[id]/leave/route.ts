import { NextResponse, NextRequest } from 'next/server';
import getServerSession from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id, 10);
  const userId = (session as any)?.user?.id;

  try {
    await prisma.eventParticipant.delete({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to leave event' }, { status: 400 });
  }
}
