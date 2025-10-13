import mongoose, { model, Schema } from 'mongoose';

import { ClientDocument } from '../types';

const ClientSchema = new mongoose.Schema<ClientDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    // Personal Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Invalid phone number format',
      },
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      province: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, default: 'Philippines' },
    },
    profileImage: { type: String },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email',
    },
    occupation: { type: String },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ClientSchema.index({ userId: 1 }, { unique: true });
ClientSchema.index({ firstName: 1, lastName: 1 });
ClientSchema.index({ 'address.city': 1, 'address.province': 1 });

// Pre-save middleware
ClientSchema.pre('save', function (next) {
  // Check if profile is complete
  this.isProfileComplete = !!(
    this.firstName &&
    this.lastName &&
    this.phone &&
    this.address?.city &&
    this.address?.province
  );

  next();
});

ClientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

export const Client = mongoose.model<ClientDocument>('Client', ClientSchema);
