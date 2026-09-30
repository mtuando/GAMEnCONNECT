'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from 'react-bootstrap';
import { updateEventAction, createEventAction, deleteEventAction } from './actions';
import type { Event } from './ManageClient';

type EventFormProps = {
  show: boolean;
  mode: 'add' | 'edit' | 'delete';
  event: Event | undefined;
  onCancelAction: () => void;
  onSavedAction: () => void;
};

export default function EventForm({
  show,
  mode,
  event,
  onCancelAction,
  onSavedAction,
}: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === 'edit';
  const isDelete = mode === 'delete';
  const isAdd = mode === 'add';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      if (isEdit) {
        await updateEventAction(formData);
      } else if (isAdd) {
        await createEventAction(formData);
      } else {
        await deleteEventAction(formData);
      }

      router.refresh();
      onSavedAction();
    });
  };

  return (
    <Modal show={show} onHide={onCancelAction} centered size="lg">
      <Modal.Header closeButton className="json-modal-header">
        <Modal.Title>{isEdit ? 'Edit Event' : isDelete ? 'Delete Event' : 'Add Event'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {isEdit && event && (
            <input type="hidden" name="id" value={event.id} />
          )}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="event-title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  defaultValue={event?.title ?? ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="event-date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  defaultValue={event?.date ? new Date(event.date).toISOString().split('T')[0] : ''}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="event-max-participants">
                <Form.Label>Max Participants</Form.Label>
                <Form.Control
                  name="max-participants"
                  defaultValue={event?.maxParticipants ?? '-1'}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="event-location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  name="location"
                  defaultValue={event?.location ?? ''}
                  placeholder="Event location"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Stack direction="horizontal" gap={2}>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={onCancelAction}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : isDelete
                    ? 'Delete Event'
                    : 'Add Event'}
            </Button>
          </Stack>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
