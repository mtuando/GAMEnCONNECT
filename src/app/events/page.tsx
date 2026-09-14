import { prisma } from '@/lib/prisma';
import EventComponent, { type Event } from '@/components/event/eventClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  let events: Event[] = [];
  
  try {
    events = await prisma.event.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        participants: true,
      },
    }) as Event[];
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return <EventComponent events={events} />;
}