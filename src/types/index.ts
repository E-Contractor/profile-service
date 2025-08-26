import { Document, Types } from 'mongoose';

export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
  userRole: string;
};

export interface Address {
  street?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Trade {
  trade: string;
  specialties: string[];
}

export interface ClientDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to User from auth-service

  // Personal Info
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  profileImage?: string;
  preferredContactMethod: 'email' | 'phone' | 'both';
  occupation?: string;

  // Emergency Contact
  emergencyContact?: EmergencyContact;

  // Profile completion
  isProfileComplete: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  fullName: string;
}

export interface ContractorDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to User from auth-service
  accountType: string;

  // Personal Information
  firstName?: string;
  lastName?: string;

  // Company Information
  companyName?: string;
  licenseNumber?: string;
  yearsOfExperience: number;
  pcab?: string;

  // Contract Information
  businessEmail?: string;
  phone: string;
  address?: Address;

  // Business Details
  contractorRole: 'general' | 'trade' | 'both';
  generalProjects: string[];
  tradeProjects: Trade[];

  // Performance Metrics
  ratingStats?: {
    averageRating: number;
    totalRatings: number;
    lastUpdated: Date;
  };

  // Verification & status
  isVerified: boolean;
  verificationDocuments: {
    governmentDocument?: string;
    licenseDocument?: string; // File path/URL
    taxDocument?: string;
  };

  // Profile
  profileImage?: string;
  description?: string;
  website?: string;

  // Profile completion
  isProfileComplete: boolean;

  // Business Operations
  emergencyContact?: EmergencyContact;

  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  fullName: string;

  findByTrade(tradeName: string): Promise<ContractorDocument[]>;
  findBySpecialty(specialtyName: string): Promise<ContractorDocument[]>;
  findBySubcategory(subcategoryName: string): Promise<ContractorDocument[]>;
}
