
import mongoose, { Schema } from 'mongoose';
import { ContractorDocument } from '../types';

const ContractorSchema = new mongoose.Schema<ContractorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    companyName: { type: String, trim: true, maxlength: 50 },
    licenseNumber: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0 },
    isPcab: { type: Boolean, default: false },
    pcab: { type: String, trim: true },
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
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      province: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, default: 'Philippines' },
    },
    contractorRole: {
      type: String,
      required: true,
      enum: ['general', 'trade', 'both'],
    },
    serviceType: {
      type: [String],
      enum: ['design', 'build'],
      default: [],
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
            specialty: {
              type: String,
              required: true,
            },
            subspecialty: [
              {
                type: String,
              },
            ],
          },
        ],
      },
    ],
    ratingStats: {
      averageRating: { type: Number, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0, min: 0 },
      lastUpdated: { type: Date },
    },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: {
      governmentDocument: { type: String },
      licenseDocument: { type: String },
      taxDocument: { type: String },
      businessPermit: { type: String },
      companyProfile: { type: String },
      sec: { type: String },
      birCertification: { type: String },
      orSalesInvoice: { type: String },
      pcabLicense: { type: String },
      gis: { type: String },
    },
    profileImage: { type: String },
    bannerImage: { type: String },
    bannerImages: { type: [String], default: [] },
    description: { type: String, maxlength: 1500 },
    portfolio: [
      {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, trim: true, maxlength: 2000 },
        location: { type: String, trim: true },
        projectType: { type: String },
        status: {
          type: String,
          enum: ['completed', 'ongoing'],
          default: 'ongoing',
        },
        completedAt: { type: Date },

        tradeTags: [
          {
            trade: { type: String },
            specialty: { type: String },
            image: { type: String },
          },
        ],

        trade: { type: String },
        specialty: { type: String },
        images: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    website: {
      type: String,
      validator: function (v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL',
    },
    isProfileComplete: { type: Boolean, default: false },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, any>) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, any>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

ContractorSchema.index({ userId: 1 }, { unique: true });
ContractorSchema.index({ firstName: 1, lastName: 1 });
ContractorSchema.index({ companyName: 1 });
ContractorSchema.index({ licenseNumber: 1 }, { sparse: true });
ContractorSchema.index({ contractorRole: 1 });
ContractorSchema.index({ serviceType: 1 });
ContractorSchema.index({ 'address.city': 1, 'address.province': 1 });
ContractorSchema.index({ averageRating: -1 });
ContractorSchema.index({ isVerified: 1 });
ContractorSchema.index({ 'tradeProjects.trade': 1 });
ContractorSchema.index({ generalProjects: 1 });
ContractorSchema.index({ tradeProjects: 1 });
ContractorSchema.index({ 'ratingStats.averageRating': -1 });

ContractorSchema.virtual('fullName').get(function () {
  const firstName = this.firstName || '';
  const lastName = this.lastName || '';
  return `${firstName} ${lastName}`.trim() || this.companyName || 'N/A';
});


ContractorSchema.pre('save', function (next) {
  
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
































ContractorSchema.statics.findByTrade = function (tradeName: string) {
  return this.find({ 'tradeProjects.trade': tradeName });
};

ContractorSchema.statics.findBySpecialty = function (specialtyName: string) {
  return this.find({ 'tradeProjects.specialties.specialty': specialtyName });
};

ContractorSchema.statics.findBySubcategory = function (
  subcategoryName: string
) {
  return this.find({ 'tradeProjects.specialties.subspecialty': subcategoryName });
};

export const Contractor = mongoose.model<ContractorDocument>(
  'Contractor',
  ContractorSchema
);
