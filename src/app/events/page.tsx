import { prisma } from '@/lib/prisma';
import EventComponent, { type Event } from '@/components/event/eventClient';

export default async function EventsPage() {
  let events: Event[] = [];
  
  try {
    events = await prisma.event!.findMany({
      include: {
        participants: true, // Includes the EventParticipant relation array
      },
    }) as Event[];
  } catch (error) {
    // Handle build time and connection errors gracefully
    console.error('Failed to fetch events:', error);
  }

  return <EventComponent events={events} />;
}
