'use client';

import EventComponent, { Event } from "@/components/event/eventClient";

// TODO (admin): Replace this sample data with events fetched from the database.
// TODO (admin): Create an admin-only form/API for creating, editing, and deleting events.
// TODO (admin): Store the event creator, registration deadline, status, and participant list.
const eventsData: Event[] = [
	{
		id: "community-football",
		title: "Community Football Match",
		description: "A friendly match for players of all skill levels.",
		date: "Saturday, June 15 · 10:00 AM",
		location: "University Sports Field",
		participants: 12,
		maxParticipants: 22,
	},
	{
		id: "beginner-badminton",
		title: "Beginner Badminton Session",
		description: "Learn the basics and meet other badminton players.",
		date: "Sunday, June 23 · 2:00 PM",
		location: "Main Gymnasium",
		participants: 8,
		maxParticipants: 16,
	},
];

export default function EventsPage({ events }: { events?: Event[] } = {}) {
    return (
        <EventComponent events={events || eventsData} />
    );
}
