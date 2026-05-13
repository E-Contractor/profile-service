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
      // required: true,
    },
    projectDescription: { type: String },
    price: {
      type: Number,
      required: true,
    },
    classification: {
      type: String,
      // required: true
    },
    projectType: {
      type: String,
      // required: true,
    },
    contractorRole: {
      type: [String],
      enum: ['general', 'trade', 'both'],
      // required: true
    },
    generalProjects: { type: [String] },
    tradeProjects: [
      {
        trade: { type: String /*required: true*/ },
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

// const UserSchema: Schema = new Schema<IUser>({
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   userRole: { type: String, required: true },
// });

// const User = model<IUser>('User', UserSchema);
// const Opportunity = model<IOpportunity>('Opportunities', OpportunitySchema);

// export { User, Opportunity };
