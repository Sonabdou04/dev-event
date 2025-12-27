"use client";

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IEvent } from '../../../lib/database';
import EventList from '../../../../components/EventList';

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const result = await response.json();

      if (response.ok) {
        setEvents(result.events || []);
      } else {
        toast.error(result.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: IEvent) => {
    router.push(`/admin/dashboard/edit/${event.slug}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-gradient text-4xl font-semibold mb-2">Events Dashboard</h1>
          <p className="text-light-100 text-sm">
            Manage all events - create, edit, and delete events
          </p>
        </div>
        <Link
          href="/admin/dashboard/add"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black rounded-[6px] px-6 py-3 text-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          Create Event
        </Link>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 bg-dark-100 border border-dark-200 rounded-[10px] card-shadow">
          <p className="text-light-200 text-lg">Loading events...</p>
        </div>
      ) : (
        <EventList
          events={events}
          onEdit={handleEdit}
          onDelete={fetchEvents}
          onRefresh={fetchEvents}
        />
      )}
    </div>
  );
}
