// src/models/Contractor.ts
import mongoose, { Schema } from 'mongoose';
import { ContractorDocument } from '../types';

const ContractorSchema = new mongoose.Schema<ContractorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    // Personal Info
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },

    // Company Info
    companyName: { type: String, trim: true, maxlength: 50 },
    licenseNumber: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0 },
    pcab: { type: String, trim: true },

    // Contact Info
    businessEmail: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
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

    // Business Details
    contractorRole: {
      type: String,
      required: true,
      enum: ['general', 'trade', 'both'],
    },
    generalProjects: { type: [String] },
    tradeProjects: [
      {
        trade: {
          type: String,
          enum: {
            values: [
              'Civil Works',
              'Surveying',
              'Structural',
              'Architectural',
              'Landscaping',
              'Mechanical',
              'Electrical',
              'Plumbing & Sanitary',
            ],
            message: 'Invalid trade type',
          },
        },
        specialties: [
          {
            type: String,
            validate: {
              validator: function (v: any) {
                if (typeof v === 'string') return true;
                return false;
              },
              message:
                'Specialty must be string with specialty and subcategories properties',
            },
          },
        ],
      },
    ],

    // Performance Metrics
    ratingStats: {
      averageRating: { type: Number, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0, min: 0 },
      lastUpdated: { type: Date },
    },

    // Verification & Status
    isVerified: { type: Boolean, default: false },
    verificationDocuments: {
      governmentDocument: { type: String },
      licenseDocument: { type: String },
      taxDocument: { type: String },
    },

    // Profile
    profileImage: { type: String },
    description: { type: String, maxlength: 1000 },
    website: {
      type: String,
      validator: function (v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL',
    },

    isProfileComplete: { type: Boolean, default: false },

    //Business Operations
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ContractorSchema.index({ userId: 1 }, { unique: true });
ContractorSchema.index({ firstName: 1, lastName: 1 });
ContractorSchema.index({ companyName: 1 });
ContractorSchema.index({ licenseNumber: 1 }, { sparse: true });
ContractorSchema.index({ contractorRole: 1 });
ContractorSchema.index({ 'address.city': 1, 'address.province': 1 });
ContractorSchema.index({ averageRating: -1 });
ContractorSchema.index({ isVerified: 1 });
ContractorSchema.index({ 'tradeProjects.trade': 1 });
ContractorSchema.index({ generalProjects: 1 });
ContractorSchema.index({ tradeProjects: 1 });
ContractorSchema.index({ 'ratingStats.averageRating': -1 });

// Virtuals
ContractorSchema.virtual('fullName').get(function () {
  const firstName = this.firstName || '';
  const lastName = this.lastName || '';
  return `${firstName} ${lastName}`.trim() || this.companyName || 'N/A';
});

// Pre-save middleware
ContractorSchema.pre('save', function (next) {
  // Check if profile is complete
  this.isProfileComplete = !!(
    this.firstName &&
    this.lastName &&
    this.companyName &&
    this.phone &&
    this.address?.city &&
    this.address?.province &&
    this.contractorRole &&
    (this.contractorRole === 'general'
      ? this.generalProjects.length > 0
      : true) &&
    (this.contractorRole === 'trade' ? this.tradeProjects.length > 0 : true)
  );

  next();
});

// Update average rating when ratings change
// ContractorSchema.pre('save', async function (next) {
//   if (
//     this.ratingIds &&
//     this.ratingIds.length > 0 &&
//     this.isModified('ratingIds')
//   ) {
//     const Rating = this.db.model('Rating');
//     const ratings = await Rating.findById({ _id: { $in: this.ratingIds } });

//     if (ratings.length > 0) {
//       const sum = ratings.reduce(
//         (acc: any, rating: any) => acc + rating.rating,
//         0
//       );
//       this.averageRating = Number((sum / ratings.length).toFixed(1));
//     }
//   }
//   next();
// });

// Virtual for contractor's full email (businessEmail or user email)
// ContractorSchema.virtual('email').get(async function () {
//   if (this.businessEmail) return this.businessEmail;

//   const User = this.db.model('User');
//   const user = await User.findById(this.userId);
//   return user?.email;
// });

// Static method to find contractors by trade
ContractorSchema.statics.findByTrade = function (tradeName: string) {
  return this.find({ 'trades.trade': tradeName });
};

ContractorSchema.statics.findBySpecialty = function (specialtyName: string) {
  return this.find({
    $or: [
      { 'trades.specialties': specialtyName },
      { 'trades.specialties.specialty': specialtyName },
    ],
  });
};

ContractorSchema.statics.findBySubcategory = function (
  subcategoryName: string
) {
  return this.find({ 'trades.specialties.subcategories': subcategoryName });
};

export const Contractor = mongoose.model<ContractorDocument>(
  'Contractor',
  ContractorSchema
);
