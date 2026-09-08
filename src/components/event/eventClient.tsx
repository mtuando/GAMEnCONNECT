'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Table, Button, Row, Col, Container } from "react-bootstrap";

export type Event = {
	id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	participants: number;
	maxParticipants: number;
};

export default function EventComponent({ events }: { events?: Event[] }) {
    const { data: session } = useSession();
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

				{events === undefined || events.length === 0 ? (
					nothing()
				) : (
					<div className="grid gap-6 md:grid-cols-2">
						{
                            <Table striped bordered hover responsive className="mt-4 ml-4 shadow-sm">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Participants</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.title}</td>
                                            <td>{event.date}</td>
                                            <td>{event.location}</td>
                                            <td>{event.participants}/{event.maxParticipants}</td>
                                            {session && (
                                                <td><Button>Join</Button></td>
                                                // Future 1: Implement Join and Leave functionality for events.
                                                // Future 2: Implement Waitlists.
                                            )}
                                        </tr>
                                    ))}
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