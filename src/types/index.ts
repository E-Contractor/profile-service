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
  userId: Types.ObjectId;

  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  profileImage?: string;
  bannerImages?: string[];
  preferredContactMethod: 'email' | 'phone' | 'both';
  occupation?: string;
  description?: string;

  emergencyContact?: EmergencyContact;

  isProfileComplete: boolean;

  createdAt: Date;
  updatedAt: Date;

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
  userId: Types.ObjectId;

  firstName?: string;
  lastName?: string;

  companyName: string;
  licenseNumber: string;
  yearsOfExperience: number;
  isPcab?: boolean;
  pcab?: string;

  businessEmail?: string;
  phone: string;
  address?: Address;

  contractorRole: 'general' | 'trade' | 'both';
  serviceType: ('design' | 'build')[];
  generalProjects: string[];
  tradeProjects: Trade[];

  ratingStats?: {
    averageRating: number;
    totalRatings: number;
    lastUpdated: Date;
  };

  isVerified: boolean;
  verificationDocuments: {
    governmentDocument?: string;
    licenseDocument?: string;
    taxDocument?: string;
    businessPermit?: string;
    companyProfile?: string;
    sec?: string;
    birCertification?: string;
    orSalesInvoice?: string;
    pcabLicense?: string;
    gis?: string;
  };

  profileImage?: string;
  description?: string;
  portfolio?: PortfolioItem[];
  website?: string;

  isProfileComplete: boolean;

  emergencyContact?: EmergencyContact;

  createdAt: Date;
  updatedAt: Date;

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
    licenseDocument?: string;
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
