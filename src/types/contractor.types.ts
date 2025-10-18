import { Types, Document } from 'mongoose';

interface Contractor {
  firstName: string;
  lastName: string;
  fullName: string; // Virtual field
  companyName: string;
  contractorRole: string;
  licenseNumber: string;
  yearsOfExperience: number;
  pcab: string;
  businessEmail: string;
  phone: string;
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
    createdAt: Date;
    updatedAt: Date;
  };
  isVerified: boolean;
  verificationDocuments: {
    governmentDocument: string;
    licenseDocument: string; // File path/URL
    taxDocument: string;
  };
  emergencyContact: { name: string; phone: string; relationship: string };
  images: string[]; // FileURL for images
  description: string;
  website: string;
}

export interface ContractorDocument extends Document, Contractor {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  findByTrade(tradeName: string): Promise<ContractorDocument[]>;
  findBySpecialty(specialtyName: string): Promise<ContractorDocument[]>;
  findBySubcategory(subcategoryName: string): Promise<ContractorDocument[]>;
}
