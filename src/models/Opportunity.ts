import mongoose, { Schema } from 'mongoose';
import { OpportunityDocument } from '../types';

// export interface IUser extends Document {
//   _id: string;
//   firstname: string;
//   lastname: string;
//   userRole: 'client' | 'contractor';
//   email: string;
//   phone?: string;
//   profilePicture?: string;
//   company?: string;
//   rating?: number;
//   isVerified: boolean;
// }

// export interface ITradeProject {
//   trade: string;
//   specialties: string[];
//   subSpecialties?: string[];
// }

// // Opportunity Interface (Extended)
// export interface IOpportunity extends Document {
//   _id: string;

//   // Basic Information
//   projectName: string;
//   description: string;
//   projectType: string;
//   // projectType: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'other';
//   // opportunityType: 'job-posting' | 'service-offering' | 'partnership' | 'subcontract';

//   // Creator Information
//   createdBy: Schema.Types.ObjectId; // Reference to User
//   creatorRole: 'client' | 'contractor';

//   // Location
//   projectLocation: {
//     address: string;
//     city: string;
//     province: string;
//     // coordinates?: {
//     //   latitude: number;
//     //   longitude: number;
//     // };
//   };

//   // Budget Information
//   budget: {
//     // type: 'fixed' | 'hourly' | 'negotiable' | 'per-project' | 'quote-required';
//     amount?: number;
//     minAmount?: number;
//     maxAmount?: number;
//     // currency: string;
//     // includesMaterials: boolean;
//   };

//   // Timeline
//   timeline: {
//     startDate?: Date;
//     endDate?: Date;
//     duration?: string;
//     // isFlexible: boolean;
//     // urgency: 'low' | 'medium' | 'high' | 'urgent';
//   };

//   // Technical Requirements
//   // contractorRole: ('general' | 'specialty')[];
//   tradeProjects: ITradeProject[];
//   // skillLevel: 'entry' | 'intermediate' | 'expert' | 'any';
//   // experienceRequired?: number;

//   // PCAB Classification
//   pcab: 'AAAA' | 'AAA' | 'AA' | 'A' | 'B' | 'C & D' | 'Trade/E';

//   // Requirements
//   // requirements: {
//   //   licenseRequired: boolean;
//   //   insuranceRequired: boolean;
//   //   bondingRequired: boolean;
//   //   certifications?: string[];
//   //   equipment?: string[];
//   //   minimumRating?: number;
//   // };

//   // Status and Visibility
//   // status: 'draft' | 'published' | 'in-bidding' | 'awarded' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
//   status: 'accepting proposals' | 'final bidding' | 'awarded';
//   // visibility: 'public' | 'private' | 'invited-only';
//   // isUrgent: boolean;
//   isFeatured: boolean;

//   // Bidding Information
//   biddingDeadline?: Date;
//   maxBidders?: number;
//   currentBidCount: number;
//   awardedTo?: Schema.Types.ObjectId; // Reference to User
//   awardedBid?: Schema.Types.ObjectId; // Reference to Bid

//   // Additional Information
//   attachments: string[];
//   images: string[];
//   tags: string[];
//   notes?: string;

//   // Metadata
//   viewCount: number;
//   createdAt: Date;
//   updatedAt: Date;
//   publishedAt?: Date;
//   completedAt?: Date;
// }

// / Bid Interface
// export interface IBid extends Document {
//   _id: string;
//   opportunityId: Schema.Types.ObjectId; // Reference to Opportunity
//   bidderId: Schema.Types.ObjectId; // Reference to User (contractor)

//   // Bid Details
//   proposedAmount: number;
//   proposedTimeline: string;
//   proposedStartDate?: Date;
//   proposedEndDate?: Date;

//   // Proposal Information
//   coverLetter?: string;
//   technicalProposal?: string;
//   methodology?: string;
//   teamComposition?: string;

//   // Supporting Documents
//   portfolio: string[];
//   certifications: string[];
//   references: IBidReference[];

//   // Bid Status
//   status: 'submitted' | 'under-review' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
//   isInvited: boolean; // If this bid was from an invitation

//   // Additional Information
//   validityPeriod?: number; // days
//   notes?: string;

//   // Metadata
//   submittedAt: Date;
//   reviewedAt?: Date;
//   responseAt?: Date;
// }

// // Bid Reference Interface
// export interface IBidReference {
//   clientName: string;
//   projectName: string;
//   projectValue: number;
//   completionDate: Date;
//   contactPerson: string;
//   contactPhone: string;
//   contactEmail?: string;
//   description?: string;
// }

// // Invitation Interface
// export interface IInvitation extends Document {
//   _id: string;
//   opportunityId: Schema.Types.ObjectId; // Reference to Opportunity
//   inviterId: Schema.Types.ObjectId; // Reference to User (who sent invitation)
//   inviteeId: Schema.Types.ObjectId; // Reference to User (who received invitation)

//   // Invitation Details
//   message?: string;
//   invitationType: 'bid-invitation' | 'collaboration' | 'subcontract' | 'partnership';

//   // Status
//   status: 'pending' | 'accepted' | 'declined' | 'expired';
//   expiresAt?: Date;

//   // Response
//   response?: string;
//   respondedAt?: Date;

//   // Metadata
//   sentAt: Date;
// }

// // Message Interface (for communication between users)
// export interface IMessage extends Document {
//   _id: string;
//   opportunityId?: Schema.Types.ObjectId; // Reference to Opportunity (optional)
//   bidId?: Schema.Types.ObjectId; // Reference to Bid (optional)
//   invitationId?: Schema.Types.ObjectId; // Reference to Invitation (optional)

//   // Participants
//   senderId: Schema.Types.ObjectId; // Reference to User
//   receiverId: Schema.Types.ObjectId; // Reference to User

//   // Message Content
//   content: string;
//   messageType: 'text' | 'file' | 'image' | 'system';
//   attachments?: string[];

//   // Status
//   isRead: boolean;
//   readAt?: Date;

//   // Metadata
//   sentAt: Date;
// }

// // Conversation Interface (to group messages)
// export interface IConversation extends Document {
//   _id: string;
//   participants: Schema.Types.ObjectId[]; // References to Users
//   opportunityId?: Schema.Types.ObjectId; // Reference to Opportunity
//   bidId?: Schema.Types.ObjectId; // Reference to Bid

//   // Conversation Details
//   title?: string;
//   lastMessage?: Schema.Types.ObjectId; // Reference to Message
//   lastActivity: Date;

//   // Status
//   isActive: boolean;

//   // Metadata
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema = new Schema<IUser>({
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   userRole: { type: String, enum: ['client', 'contractor'], required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String },
//   profilePicture: { type: String },
//   company: { type: String },
//   rating: { type: Number, min: 0, max: 5 },
//   isVerified: { type: Boolean, default: false }
// }, { timestamps: true });

// const OpportunitySchema = new Schema<IOpportunity>({
//   // Basic Information
//   projectName: { type: String, required: true },
//   description: { type: String, required: true },
//   projectType: {
//     type: String,
//     enum: ['residential', 'commercial', 'industrial', 'infrastructure', 'other'],
//     required: true
//   },
//   opportunityType: {
//     type: String,
//     enum: ['job-posting', 'service-offering', 'partnership', 'subcontract'],
//     required: true
//   },

//   // Creator Information
//   createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   creatorRole: { type: String, enum: ['client', 'contractor'], required: true },

//   // Location
//   projectLocation: {
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     province: { type: String, required: true },
//     coordinates: {
//       latitude: { type: Number },
//       longitude: { type: Number }
//     }
//   },

//   // Budget Information
//   budget: {
//     type: {
//       type: String,
//       enum: ['fixed', 'hourly', 'negotiable', 'per-project', 'quote-required'],
//       required: true
//     },
//     amount: { type: Number },
//     minAmount: { type: Number },
//     maxAmount: { type: Number },
//     currency: { type: String, default: 'PHP' },
//     includesMaterials: { type: Boolean, default: false }
//   },

//   // Timeline
//   timeline: {
//     startDate: { type: Date },
//     endDate: { type: Date },
//     duration: { type: String },
//     isFlexible: { type: Boolean, default: true },
//     urgency: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'urgent'],
//       default: 'medium'
//     }
//   },

//   // Technical Requirements
//   contractorRole: [{
//     type: String,
//     enum: ['general', 'specialty']
//   }],
//   tradeProjects: [{
//     trade: { type: String, required: true },
//     specialties: [{ type: String }],
//     subSpecialties: [{ type: String }]
//   }],
//   skillLevel: {
//     type: String,
//     enum: ['entry', 'intermediate', 'expert', 'any'],
//     default: 'any'
//   },
//   experienceRequired: { type: Number },

//   // PCAB Classification
//   classification: {
//     type: String,
//     enum: ['AAAA', 'AAA', 'AA', 'A', 'B', 'C & D', 'Trade/E']
//   },

//   // Requirements
//   requirements: {
//     licenseRequired: { type: Boolean, default: false },
//     insuranceRequired: { type: Boolean, default: false },
//     bondingRequired: { type: Boolean, default: false },
//     certifications: [{ type: String }],
//     equipment: [{ type: String }],
//     minimumRating: { type: Number, min: 0, max: 5 }
//   },

//   // Status and Visibility
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'in-bidding', 'awarded', 'in-progress', 'completed', 'cancelled', 'on-hold'],
//     default: 'draft'
//   },
//   visibility: {
//     type: String,
//     enum: ['public', 'private', 'invited-only'],
//     default: 'public'
//   },
//   isUrgent: { type: Boolean, default: false },
//   isFeatured: { type: Boolean, default: false },

//   // Bidding Information
//   biddingDeadline: { type: Date },
//   maxBidders: { type: Number },
//   currentBidCount: { type: Number, default: 0 },
//   awardedTo: { type: Schema.Types.ObjectId, ref: 'User' },
//   awardedBid: { type: Schema.Types.ObjectId, ref: 'Bid' },

//   // Additional Information
//   attachments: [{ type: String }],
//   images: [{ type: String }],
//   tags: [{ type: String }],
//   notes: { type: String },

//   // Metadata
//   viewCount: { type: Number, default: 0 },
//   publishedAt: { type: Date },
//   completedAt: { type: Date }
// }, { timestamps: true });

// const BidSchema = new Schema<IBid>({
//   opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
//   bidderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

//   // Bid Details
//   proposedAmount: { type: Number, required: true },
//   proposedTimeline: { type: String, required: true },
//   proposedStartDate: { type: Date },
//   proposedEndDate: { type: Date },

//   // Proposal Information
//   coverLetter: { type: String },
//   technicalProposal: { type: String },
//   methodology: { type: String },
//   teamComposition: { type: String },

//   // Supporting Documents
//   portfolio: [{ type: String }],
//   certifications: [{ type: String }],
//   references: [{
//     clientName: { type: String, required: true },
//     projectName: { type: String, required: true },
//     projectValue: { type: Number, required: true },
//     completionDate: { type: Date, required: true },
//     contactPerson: { type: String, required: true },
//     contactPhone: { type: String, required: true },
//     contactEmail: { type: String },
//     description: { type: String }
//   }],

//   // Bid Status
//   status: {
//     type: String,
//     enum: ['submitted', 'under-review', 'shortlisted', 'accepted', 'rejected', 'withdrawn'],
//     default: 'submitted'
//   },
//   isInvited: { type: Boolean, default: false },

//   // Additional Information
//   validityPeriod: { type: Number }, // days
//   notes: { type: String },

//   // Metadata
//   submittedAt: { type: Date, default: Date.now },
//   reviewedAt: { type: Date },
//   responseAt: { type: Date }
// }, { timestamps: true });

// const InvitationSchema = new Schema<IInvitation>({
//   opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
//   inviterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   inviteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

//   // Invitation Details
//   message: { type: String },
//   invitationType: {
//     type: String,
//     enum: ['bid-invitation', 'collaboration', 'subcontract', 'partnership'],
//     required: true
//   },

//   // Status
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'declined', 'expired'],
//     default: 'pending'
//   },
//   expiresAt: { type: Date },

//   // Response
//   response: { type: String },
//   respondedAt: { type: Date },

//   // Metadata
//   sentAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// const MessageSchema = new Schema<IMessage>({
//   opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity' },
//   bidId: { type: Schema.Types.ObjectId, ref: 'Bid' },
//   invitationId: { type: Schema.Types.ObjectId, ref: 'Invitation' },

//   // Participants
//   senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

//   // Message Content
//   content: { type: String, required: true },
//   messageType: {
//     type: String,
//     enum: ['text', 'file', 'image', 'system'],
//     default: 'text'
//   },
//   attachments: [{ type: String }],

//   // Status
//   isRead: { type: Boolean, default: false },
//   readAt: { type: Date },

//   // Metadata
//   sentAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// const ConversationSchema = new Schema<IConversation>({
//   participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
//   opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity' },
//   bidId: { type: Schema.Types.ObjectId, ref: 'Bid' },

//   // Conversation Details
//   title: { type: String },
//   lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
//   lastActivity: { type: Date, default: Date.now },

//   // Status
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// // Indexes for better performance
// OpportunitySchema.index({ createdBy: 1, status: 1 });
// OpportunitySchema.index({ projectLocation: 1, status: 1 });
// OpportunitySchema.index({ 'tradeProjects.trade': 1, status: 1 });
// OpportunitySchema.index({ classification: 1, status: 1 });
// OpportunitySchema.index({ createdAt: -1 });

// BidSchema.index({ opportunityId: 1, bidderId: 1 }, { unique: true });
// BidSchema.index({ bidderId: 1, status: 1 });
// BidSchema.index({ submittedAt: -1 });

// InvitationSchema.index({ inviteeId: 1, status: 1 });
// InvitationSchema.index({ opportunityId: 1 });
// InvitationSchema.index({ sentAt: -1 });

// MessageSchema.index({ senderId: 1, receiverId: 1, sentAt: -1 });
// MessageSchema.index({ opportunityId: 1, sentAt: -1 });
// MessageSchema.index({ bidId: 1, sentAt: -1 });

// ConversationSchema.index({ participants: 1, lastActivity: -1 });
// ConversationSchema.index({ opportunityId: 1 });

// export interface IUser extends Document {
//   firstname: string;
//   lastname: string;
//   userRole: string;
// }

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
