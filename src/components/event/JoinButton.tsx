'use client';

import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface JoinButtonProps {
  eventId: string | number;
  isJoined: boolean;
  onJoin: (eventId: string | number) => Promise<void>;
  onLeave: (eventId: string | number) => Promise<void>;
}

export default function JoinButton({
  eventId,
  isJoined,
  onJoin,
  onLeave,
}: JoinButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isJoined) {
        await onLeave(eventId);
      } else {
        await onJoin(eventId);
      }
    } catch (error) {
      console.error('Failed to update event status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isJoined ? 'outline-danger' : 'success'}
      onClick={handleClick}
      disabled={loading}
      className="min-w-[80px]"
    >
      {loading ? (
        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
      ) : isJoined ? (
        'Leave'
      ) : (
        'Join'
      )}
    </Button>
  );
}
