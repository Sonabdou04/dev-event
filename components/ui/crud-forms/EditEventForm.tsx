"use client";

import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { IEvent } from '../../../app/lib/database';

type FormDataState = {
  title: string;
  description: string;
  overview: string;
  image: File | null;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  organizer: string;
  agenda: string[];
  tags: string[];
};

type ErrorState = {
  title?: string;
  description?: string;
  overview?: string;
  image?: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  mode?: string;
  audience?: string;
  organizer?: string;
  agenda?: string;
  tags?: string;
  general?: string;
};

interface EditEventFormProps {
  event: IEvent;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    overview: '',
    image: null,
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: 'online',
    audience: '',
    organizer: '',
    agenda: [''],
    tags: [''],
  });

  const [error, setError] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      // Format date to YYYY-MM-DD for input[type="date"]
      const eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
      // Format time to HH:MM for input[type="time"]
      const eventTime = event.time || '';

      setFormData({
        title: event.title || '',
        description: event.description || '',
        overview: event.overview || '',
        image: null,
        venue: event.venue || '',
        location: event.location || '',
        date: eventDate,
        time: eventTime,
        mode: (event.mode as 'online' | 'offline' | 'hybrid') || 'online',
        audience: event.audience || '',
        organizer: event.organizer || '',
        agenda: event.agenda && event.agenda.length > 0 ? event.agenda : [''],
        tags: event.tags && event.tags.length > 0 ? event.tags : [''],
      });

      // Set existing image URL for preview
      if (event.image) {
        setExistingImageUrl(event.image);
      }
    }
  }, [event]);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (error[name as keyof ErrorState]) {
      setError((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError((prev) => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError((prev) => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setError((prev) => ({ ...prev, image: undefined }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExistingImageUrl(null); // Clear existing image when new one is selected
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle agenda item changes
  const handleAgendaChange = (index: number, value: string) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData((prev) => ({ ...prev, agenda: newAgenda }));
    if (error.agenda) {
      setError((prev) => ({ ...prev, agenda: undefined }));
    }
  };

  // Add new agenda item
  const addAgendaItem = () => {
    setFormData((prev) => ({ ...prev, agenda: [...prev.agenda, ''] }));
  };

  // Remove agenda item
  const removeAgendaItem = (index: number) => {
    if (formData.agenda.length > 1) {
      const newAgenda = formData.agenda.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, agenda: newAgenda }));
    }
  };

  // Handle tag changes
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: newTags }));
    if (error.tags) {
      setError((prev) => ({ ...prev, tags: undefined }));
    }
  };

  // Add new tag
  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  // Remove tag
  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, tags: newTags }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    try {
      // Prepare FormData
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('description', formData.description.trim());
      fd.append('overview', formData.overview.trim());
      fd.append('venue', formData.venue.trim());
      fd.append('location', formData.location.trim());
      fd.append('date', formData.date);
      fd.append('time', formData.time);
      fd.append('mode', formData.mode);
      fd.append('audience', formData.audience.trim());
      fd.append('organizer', formData.organizer.trim());
      
      // Filter out empty agenda items and tags
      const validAgenda = formData.agenda.filter((item) => item.trim() !== '');
      const validTags = formData.tags.filter((tag) => tag.trim() !== '');
      
      fd.append('agenda', JSON.stringify(validAgenda));
      fd.append('tags', JSON.stringify(validTags));
      
      // Only append image if a new one is selected
      if (formData.image) {
        fd.append('image', formData.image);
      }

      // Submit to API
      const response = await fetch(`/api/events/${event.slug}`, {
        method: 'PUT',
        body: fd,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Event updated successfully');
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        // Handle API errors
        const errorMessage = result.message || 'Failed to update event';
        toast.error(errorMessage);
        
        // Try to parse validation errors from the response
        if (result.errors) {
          const apiErrors: ErrorState = {};
          Object.keys(result.errors).forEach((key) => {
            apiErrors[key as keyof ErrorState] = result.errors[key];
          });
          setError(apiErrors);
        } else {
          setError({ general: errorMessage });
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
      setError({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-dark-100 border border-dark-200 rounded-[10px] card-shadow px-8 py-10">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-semibold text-gradient max-sm:text-2xl">
            Edit Event
          </h1>
          <p className="text-light-100 text-sm">
            Update the event details below.
          </p>
        </div>

        {error.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[6px]">
            <p className="text-sm text-red-500">{error.general}</p>
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm text-light-100">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
            />
            <p className="text-xs text-light-200">
              {formData.title.length}/100 characters
            </p>
            {error.title && <p className="text-sm text-red-500">{error.title}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm text-light-100">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={1000}
            />
            <p className="text-xs text-light-200">
              {formData.description.length}/1000 characters
            </p>
            {error.description && <p className="text-sm text-red-500">{error.description}</p>}
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-2">
            <label htmlFor="overview" className="text-sm text-light-100">
              Overview <span className="text-red-500">*</span>
            </label>
            <textarea
              id="overview"
              name="overview"
              rows={3}
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Enter event overview"
              value={formData.overview}
              onChange={handleInputChange}
              maxLength={500}
            />
            <p className="text-xs text-light-200">
              {formData.overview.length}/500 characters
            </p>
            {error.overview && <p className="text-sm text-red-500">{error.overview}</p>}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="text-sm text-light-100">
              Event Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-[6px] file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90 file:cursor-pointer"
              onChange={handleImageChange}
            />
            <p className="text-xs text-light-200">
              Leave empty to keep the existing image
            </p>
            {(imagePreview || existingImageUrl) && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview || existingImageUrl || ''}
                  alt="Preview"
                  className="max-w-xs h-auto rounded-[6px] object-cover"
                />
              </div>
            )}
            {error.image && <p className="text-sm text-red-500">{error.image}</p>}
          </div>

          {/* Venue and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="venue" className="text-sm text-light-100">
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter venue name"
                value={formData.venue}
                onChange={handleInputChange}
              />
              {error.venue && <p className="text-sm text-red-500">{error.venue}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="location" className="text-sm text-light-100">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleInputChange}
              />
              {error.location && <p className="text-sm text-red-500">{error.location}</p>}
            </div>
          </div>

          {/* Date, Time, and Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm text-light-100">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.date}
                onChange={handleInputChange}
              />
              {error.date && <p className="text-sm text-red-500">{error.date}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="time" className="text-sm text-light-100">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                id="time"
                name="time"
                type="time"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.time}
                onChange={handleInputChange}
              />
              {error.time && <p className="text-sm text-red-500">{error.time}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mode" className="text-sm text-light-100">
                Mode <span className="text-red-500">*</span>
              </label>
              <select
                id="mode"
                name="mode"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.mode}
                onChange={handleInputChange}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {error.mode && <p className="text-sm text-red-500">{error.mode}</p>}
            </div>
          </div>

          {/* Audience and Organizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="audience" className="text-sm text-light-100">
                Audience <span className="text-red-500">*</span>
              </label>
              <input
                id="audience"
                name="audience"
                type="text"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., Developers, Students, Professionals"
                value={formData.audience}
                onChange={handleInputChange}
              />
              {error.audience && <p className="text-sm text-red-500">{error.audience}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="organizer" className="text-sm text-light-100">
                Organizer <span className="text-red-500">*</span>
              </label>
              <input
                id="organizer"
                name="organizer"
                type="text"
                className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter organizer name"
                value={formData.organizer}
                onChange={handleInputChange}
              />
              {error.organizer && <p className="text-sm text-red-500">{error.organizer}</p>}
            </div>
          </div>

          {/* Agenda */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-light-100">
              Agenda <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-3">
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={`Agenda item ${index + 1}`}
                    value={item}
                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-[6px] text-sm font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAgendaItem}
                className="self-start px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-[6px] text-sm font-semibold transition-colors"
              >
                + Add Agenda Item
              </button>
            </div>
            {error.agenda && <p className="text-sm text-red-500">{error.agenda}</p>}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-light-100">
              Tags <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-3">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={`Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-[6px] text-sm font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="self-start px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-[6px] text-sm font-semibold transition-colors"
              >
                + Add Tag
              </button>
            </div>
            {error.tags && <p className="text-sm text-red-500">{error.tags}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 w-full cursor-pointer flex items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating Event...' : 'Update Event'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-dark-200 hover:bg-dark-300 w-full cursor-pointer flex items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-light-100 mt-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
