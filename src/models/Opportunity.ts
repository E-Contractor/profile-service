import mongoose, { Schema } from 'mongoose';
import { OpportunityDocument } from '../types';

const OpportunitySchema = new Schema<OpportunityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    projectName: {
      type: String,

    },
    projectDescription: { type: String },
    price: {
      type: Number,
      required: true,
    },
    classification: {
      type: String,

    },
    projectType: {
      type: String,

    },
    contractorRole: {
      type: [String],
      enum: ['general', 'trade', 'both'],

    },
    generalProjects: { type: [String] },
    tradeProjects: [
      {
        trade: { type: String  },
        specialties: { type: [String], default: [] },
      },
    ],
    status: { type: String },
    duration: { type: String },
    hidePrice: { type: Boolean },
    bidCount: { type: Number },
  },
  { timestamps: true }
);

OpportunitySchema.index({ userId: 1 }, { unique: true });

export const Opportunity = mongoose.model<OpportunityDocument>(
  'Opportunities',
  OpportunitySchema
);
