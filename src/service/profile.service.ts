import { Client } from '../models/Client';
import { Contractor } from '../models/Contractor';
import { ClientDocument, ContractorDocument } from '../types';
import { calculateCompletionPercentage, getMissingFields } from '../utils';

type Role = 'client' | 'contractor';

type UpdateData<T extends Role> = T extends 'client'
  ? Partial<ClientDocument>
  : Partial<ContractorDocument>;

export const createClientProfile = async (data: {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: any;
  occupation?: string;
  preferredContractMethod?: 'email' | 'phone' | 'both';
  emergencyContact?: any;
}) => {
  try {
    const result = await Client.create({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address || {
        street: '',
        city: '',
        province: '',
        zipCode: '',
        country: 'Philippines',
      },
      occupation: data.occupation,
      preferredContractMethod: data.preferredContractMethod || 'email',
      emergencyContact: data.emergencyContact,
    });

    return result;
  } catch (error: any) {
    throw new Error(`Client profile creation failed: ${error.message}`);
  }
};

export const createContractorProfile = async (data: {
  userId: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  contractorRole?: 'general' | 'trade' | 'both';
  phone?: string;
  businessEmail?: string;
  address?: any;
  generalProjects?: string[];
  tradeProjects?: string[];
  description?: string;
  website?: string;
  emergencyContact?: any;
}) => {
  // export const createContractorProfile = async (data: ContractorDocument) => {
  try {
    if (data.licenseNumber) {
      const existingLicense = await Contractor.findOne({
        licenseNumber: data.licenseNumber.trim(),
      });

      if (existingLicense) {
        throw new Error('A contractor with this license number already exists');
      }
    }

    const contractorData = {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      contractorRole: data.contractorRole,
      companyName: data.companyName.trim(),
      licenseNumber: data.licenseNumber?.trim(),
      yearsOfExperience: data.yearsOfExperience || 0,
      phone: data.phone?.trim(),
      businessEmail: data.businessEmail,
      address: data.address || {
        street: '',
        city: '',
        province: '',
        ziPCode: '',
        country: 'Philippines',
      },
      generalProjects: Array.isArray(data.generalProjects)
        ? data.generalProjects
        : [],
      tradeProjects: Array.isArray(data.tradeProjects)
        ? data.tradeProjects
        : [],
      description: data.description,
      website: data.website,
      emergencyContact: data.emergencyContact,
      isVerified: false,
      verificationDocuments: {
        governmentDocument: '',
        licenseDocument: '',
        taxDocument: '',
      },
    };

    console.log('About to create contractor with data:', {
      generalProjects: contractorData.generalProjects,
      tradeProjects: contractorData.tradeProjects,
    });

    const contractor = await Contractor.create(contractorData);

    console.log('Created contractor result:', {
      generalProjects: contractor.generalProjects,
      tradeProjects: contractor.tradeProjects,
      contractorRole: contractor.contractorRole,
    });

    return contractor;
  } catch (error: any) {
    throw new Error(`Contractor profile creation failed: ${error.message}`);
  }
};

export const getProfile = async (userId: string, role?: string) => {
  try {
    let result;

    if (role === 'client') {
      result = await Client.findOne({ userId }).lean();
    } else if (role === 'contractor') {
      result = await Contractor.findOne({ userId }).lean();
    }

    if (!result) {
      throw new Error('Profile not found');
    }

    return result;
  } catch (error: any) {
    throw new Error(`Get profile failed: ${error.message}`);
  }
};

export const updateProfile = async <T extends Role>(
  userId: string,
  role: T,
  updateData: UpdateData<T>
) => {
  try {
    let result;
    if (role === 'client') {
      result = await Client.findOneAndUpdate({ userId }, updateData, {
        new: true,
        runValidators: true,
      });
    } else if (role === 'contractor') {
      result = await Contractor.findOneAndUpdate({ userId }, updateData, {
        new: true,
        runValidators: true,
      });
    }

    if (!result) {
      throw new Error(`${role} profile not found`);
    }

    return result;
  } catch (error: any) {
    throw new Error(`${role} profile update failed: ${error.message}`);
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    await Client.updateOne({ userId }, { $set: { userStatus: status } });
    await Contractor.updateOne({ userId }, { $set: { userStatus: status } });

    return { message: 'User status updated successfully' };
  } catch (error: any) {
    throw new Error(`Update user status failed: ${error.message}`);
  }
};

export const getProfileCompletion = async (userId: string, role: string) => {
  try {
    const profile = await getProfile(userId, role);

    return {
      isComplete: profile.isProfileComplete,
      completionPercentage: calculateCompletionPercentage(profile, role),
      getMissingFields: getMissingFields(profile, role),
    };
  } catch (error: any) {
    throw new Error(`Get profile completion failed: ${error.message}`);
  }
};
