import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';
import User from './user.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId; // link to user
  createdAt: Date;
  updatedAt: Date;
}


const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        return next(error);
      }
    } catch {
      const validationError = new Error('Invalid events ID format or database error');
      validationError.name = 'ValidationError';
      return next(validationError);
    }
  }

  next();
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (event bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on userId for user booking lookups
BookingSchema.index({ userId: 1 });

// Enforce one booking per event per user
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true, name: 'uniq_event_user' });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;