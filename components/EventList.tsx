"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { IEvent } from '../app/lib/database';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

type EventListProps = {
  events: IEvent[];
  onEdit: (event: IEvent) => void;
  onDelete: (slug: string) => void;
  onRefresh: () => void;
};

export default function EventList({ events, onEdit, onDelete, onRefresh }: EventListProps) {
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [openDialogSlug, setOpenDialogSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    setOpenDialogSlug(null);
    
    try {
      const response = await fetch(`/api/events/${slug}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Event deleted successfully');
        onRefresh();
      } else {
        toast.error(result.message || 'Failed to delete event');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeletingSlug(null);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-dark-100 border border-dark-200 rounded-[10px] card-shadow">
        <p className="text-light-200 text-lg">No events found. Create your first event!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event._id.toString()}
          className="bg-dark-100 border border-dark-200 rounded-[10px] card-shadow p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="shrink-0">
              <Image
                src={event.image}
                alt={event.title}
                width={200}
                height={150}
                className="rounded-lg object-cover w-full md:w-[200px] h-[150px]"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-light-200 text-sm line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-light-200">
                    <div className="flex items-center gap-2">
                      <span className="text-light-100 font-medium">Location:</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-light-100 font-medium">Date:</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-light-100 font-medium">Time:</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-light-100 font-medium">Mode:</span>
                      <span className="capitalize">{event.mode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-dark-200 text-light-100 text-xs rounded-[6px] px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-dark-200">
                <Link
                  href={`/events/${event.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-dark-200 hover:bg-dark-200/80 text-light-100 rounded-[6px] px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Eye size={16} />
                  View
                </Link>
                <button
                  onClick={() => onEdit(event)}
                  className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-[6px] px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <AlertDialog open={openDialogSlug === event.slug} onOpenChange={(open) => setOpenDialogSlug(open ? event.slug : null)}>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={deletingSlug === event.slug}
                      className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-[6px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      {deletingSlug === event.slug ? 'Deleting...' : 'Delete'}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone and will permanently delete this event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(event.slug)}
                        disabled={deletingSlug === event.slug}
                      >
                        {deletingSlug === event.slug ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

