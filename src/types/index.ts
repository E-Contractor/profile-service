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

export interface ClientDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to User from auth-service

  // Personal Info
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  profileImage?: string;
  bannerImages?: string[];
  preferredContactMethod: 'email' | 'phone' | 'both';
  occupation?: string;
  description?: string;

  // Emergency Contact
  emergencyContact?: EmergencyContact;

  // Profile completion
  isProfileComplete: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Virtual fields
  fullName: string;
}

export interface PortfolioItem {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  completedAt?: Date;
  trade?: string;
  specialty?: string;
  images?: string[];
  createdAt?: Date;
}

export interface ContractorDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to User from auth-service

  // Personal Information
  firstName?: string;
  lastName?: string;

  // Company Information
  companyName: string;
  licenseNumber: string;
  yearsOfExperience: number;
  isPcab?: boolean;
  pcab?: string;

  // Contract Information
  businessEmail?: string;
  phone: string;
  address?: Address;

  // Business Details
  contractorRole: 'general' | 'trade' | 'both';
  serviceType: ('design' | 'build')[];
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
    businessPermit?: string;
    companyProfile?: string;
    sec?: string;
    birCertification?: string;
    orSalesInvoice?: string;
    pcabLicense?: string;
    gis?: string;
  };

  // Profile
  profileImage?: string;
  description?: string;
  portfolio?: PortfolioItem[];
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

interface Subspecialty {
  specialty: string;
  subspecialty: string[];
}

type Specialty = string[] | Subspecialty[];

interface Trade {
  trade: string;
  specialties: Specialty;
}

export interface RegisterUser {
  // userId: string;
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterClientRequest extends RegisterUser {
  userId: string;
}

export interface RegisterContractorRequest extends RegisterUser {
  userId: string;
  companyName: string;
  contractorRole: 'general' | 'trade' | 'both';
  licenserNumber: string;
  yearsOfExperience: number;
  pcab: string;
  phone: string;
  businessEmail: string;
  address: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
    country: string;
  };
  generalProjects: string[];
  tradeProjects: {
    trade: string;
    specialties: {
      specialty: string;
      subspecialty: string[];
    }[];
  }[];
  ratingStats: {
    averageRating: number;
    totalRatings: number;
    lastUpdated: Date;
  };
  isVerified: boolean;
  verificationDocuments: {
    governmentDocument?: string;
    licenseDocument?: string; // File path/URL
    taxDocument?: string;
    businessPermit?: string;
    companyProfile?: string;
    sec?: string;
    birCertification?: string;
    orSalesInvoice?: string;
    pcabLicense?: string;
    gis?: string;
  };
  profileImage: string;
  description: string;
  website: string;
}

export interface OpportunityDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  projectName: string;
  projectDescription: string;
  price: number;
  classification: string;
  projectType: string;
  contractorRole: string[];
  generalProjects: string[];
  tradeProjects: Trade[];
  status: string;
  duration: string;
  hidePrice: boolean;
  bidCount: number;
}