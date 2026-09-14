'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Table, Row, Col, Container } from "react-bootstrap";
import JoinButton from "./JoinButton";
import { useRouter } from "next/navigation";

export type Event = {
	id: number;
	title: string;
	date: Date | string;
	location: string;
	maxParticipants: number;
    participants?: EventParticipant[];
};

export type EventParticipant = {
  id: number;
  eventId: number;
  userId: number;
};

export default function EventComponent({ events }: { events?: Event[] }) {
    const { data: session } = useSession();
    const router = useRouter();

    const currentUserId = session?.user?.id ? Number(session.user.id) : undefined;
    const handleJoin = async (eventId: number) => {
        const res = await fetch(`/api/events/${eventId}/join`, { method: 'POST' });
        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Failed to join event');
            return;
        }
        router.refresh();
    };

    const handleLeave = async (eventId: number) => {
        const res = await fetch(`/api/events/${eventId}/leave`, { method: 'DELETE' });
        if (!res.ok) {
            const data = await res.json();
            alert(data.error || 'Failed to leave event');
            return;
        }
        router.refresh();
    };

    return (
		<main className="py-2 mt-4 ms-4 me-4">
			<section>
				<div className="mb-2 flex text-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Upcoming events</h1>
						<p className="mt-2 text-gray-600">
							Find activities, join a team, and play with the community.
						</p>
					</div>
					<Link
						href="/findplayers"
						className="text-sm font-medium text-blue-600 hover:underline"
					>
						Find players instead →
					</Link>
				</div>

				{!events || events.length === 0 ? (
                    nothing()
                ): (
					<div className="grid gap-6 md:grid-cols-2">
						{
                            <Table striped bordered hover responsive className="mt-4 ml-4 shadow-sm">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Participants</th>
                                        {session && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                        {events.map((event) => {
                                            const participantList = Array.isArray(event.participants) ? event.participants : [];
                                            const isJoined = currentUserId
                                                ? participantList.some((p) => p.userId === currentUserId)
                                                : false;

                                            return (
                                                <tr key={event.id}>
                                                <td>{event.title}</td>
                                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                                <td>{event.location}</td>
                                                <td>
                                                    {participantList.length}/{event.maxParticipants}
                                                </td>
                                                    {session && (
                                                        <td>
                                                        <JoinButton
                                                            eventId={event.id}
                                                            isJoined={isJoined}
                                                            onJoin={() => handleJoin(event.id)}
                                                            onLeave={() => handleLeave(event.id)}
                                                        />
                                                    </td>
                                                )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>

                        }
					</div>
				)}
			</section>
		</main>
	);
}

function nothing() {
    return (
        <Container className="py-2 mc-4">
            <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Col xs={4} className="text-center">
                    <h2>No events scheduled.</h2>
                    <p className='fs-6'>Returning to Home</p>
                    <meta httpEquiv="refresh" content="10;url=/"/>
                </Col>
            </Row>
        </Container>
    );
}
