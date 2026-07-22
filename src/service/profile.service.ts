import mongoose from 'mongoose';
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


















export const createContractorProfile = async (data: ContractorDocument) => {
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
      serviceType: Array.isArray(data.serviceType) ? data.serviceType : [],
      companyName: data.companyName.trim(),
      licenseNumber: data.licenseNumber?.trim(),
      yearsOfExperience: data.yearsOfExperience || 0,
      isPcab: data.isPcab || false,
      pcab: data.isPcab ? data.pcab : '',
      phone: data.phone?.trim(),
      businessEmail: data.businessEmail,
      address: data.address || {
        street: '',
        city: '',
        province: '',
        zipCode: '',
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
      verificationDocuments: data.verificationDocuments || {},
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
    let result: any;

    if (role === 'client') {
      result = await Client.findOne({ userId }).lean();
    } else if (role === 'contractor') {
      
      
      
      
      result = await Contractor.findOne({ userId }).select('-portfolio').lean();
      if (result) {
        const agg = await Contractor.aggregate([
          { $match: { _id: result._id } },
          { $project: { count: { $size: { $ifNull: ['$portfolio', []] } } } },
        ]);
        result.portfolioCount = agg[0]?.count ?? 0;
      }
    }

    if (!result) {
      throw new Error('Profile not found');
    }

    try {
      const userDoc = await mongoose.connection.db
        ?.collection('users')
        .findOne(
          { _id: new mongoose.Types.ObjectId(userId) },
          { projection: { lastLogin: 1, lastActiveAt: 1 } }
        );
      (result as any).lastLogin = userDoc?.lastLogin ?? null;
      (result as any).lastActiveAt = userDoc?.lastActiveAt ?? null;
    } catch (err) {
      console.warn('[profile.service] failed to attach lastActive', err);
      (result as any).lastLogin = null;
      (result as any).lastActiveAt = null;
    }

    return result;
  } catch (error: any) {
    throw new Error(`Get profile failed: ${error.message}`);
  }
};



export const getPortfolio = async (userId: string) => {
  try {
    const result = await Contractor.findOne({ userId }).select('portfolio').lean();
    if (!result) {
      throw new Error('Contractor profile not found');
    }
    return (result as any).portfolio ?? [];
  } catch (error: any) {
    throw new Error(`Get portfolio failed: ${error.message}`);
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
