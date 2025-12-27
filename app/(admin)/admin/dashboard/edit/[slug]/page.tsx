"use client";

import { useEffect, useState } from 'react';
import { use } from 'react';
import { toast } from 'sonner';
import EditEventForm from '../../../../../../components/ui/crud-forms/EditEventForm';
import { IEvent } from '../../../../../lib/database';

export default function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${slug}`);
        const result = await response.json();

        if (response.ok) {
          setEvent(result.event);
        } else {
          toast.error(result.message || 'Failed to fetch event');
        }
      } catch (error: any) {
        toast.error(error?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-12 bg-dark-100 border border-dark-200 rounded-[10px] card-shadow">
          <p className="text-light-200 text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full">
        <div className="text-center py-12 bg-dark-100 border border-dark-200 rounded-[10px] card-shadow">
          <p className="text-light-200 text-lg">Event not found</p>
        </div>
      </div>
    );
  }

  return <EditEventForm event={event as IEvent} />;
}

