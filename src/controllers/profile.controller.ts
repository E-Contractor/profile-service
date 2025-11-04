import { Request, Response } from 'express';
import * as ProfileService from '../service/profile.service';
import { Contractor } from '../models/Contractor';

interface AuthRequest extends Request {
  user?: any;
}

export const createClientProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await ProfileService.createClientProfile(req.body);

    res.status(201).json({
      success: true,
      message: 'Client profile created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: [error.message],
    });
  }
};

export const createContractorProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await ProfileService.createContractorProfile(req.body);

    res.status(201).json({
      success: true,
      message: 'Contractor profile created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Create contractor profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      errors: [error.message],
    });
  }
};

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.params;
    const profile = await ProfileService.getProfile(userId, role);

    res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} profile retrieved successfully`,
      data: profile,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'Failed to retrieve profile',
      errors: ['Failed to retrieve profile'],
    });
  }
};

export const getMeController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    const role = req.user.role;

    const profile = await ProfileService.getProfile(userId, role);

    res.status(200).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} profile retrieved successfully`,
      data: profile,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'Failed to retrieve profile',
      errors: ['Failed to retrieve profile'],
    });
  }
};

export const updateUserStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Status is required',
        errors: ['Status field is required'],
      });
      return;
    }

    const result = await ProfileService.updateUserStatus(userId, status);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user status',
      errors: [error.message || 'Status update failed'],
    });
  }
};

export const updateMeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id || req.user?.sub;
    const role = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    if (!role || !['client', 'contractor'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user role',
        errors: ['User role must be either client or contractor'],
      });
      return;
    }

    // Role-specific validation
    if (role === 'client') {
      const { firstName, lastName } = req.body;
      if (
        (firstName !== undefined && !firstName.trim()) ||
        (lastName !== undefined && !lastName.trim())
      ) {
        res.status(400).json({
          success: false,
          message: 'Invalid input data',
          errors: ['First name and last name cannot be empty'],
        });
        return;
      }
    }

    if (role === 'contractor' && req.body.licenseNumber) {
      const existingLicense = await Contractor.findOne({
        licenseNumber: req.body.licenseNumber,
        userId: { $ne: userId },
      });

      if (existingLicense) {
        res.status(409).json({
          success: false,
          message: 'License number already exists',
          errors: ['A contractor with this license number already exists'],
        });
        return;
      }
    }

    const result = await ProfileService.updateProfile(
      userId,
      role,
      req.body
    );

    res.json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} profile updated successfully`,
      data: result,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile',
      errors: [error.message || 'Profile update failed'],
    });
  }
};

export const updateClientProfileController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id || req.user?.sub || req.params.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    const { firstName, lastName } = req.body;
    if (
      (firstName !== undefined && !firstName.trim()) ||
      (lastName !== undefined && !lastName.trim())
    ) {
      res.status(400).json({
        success: false,
        message: 'Invalid input data',
        errors: ['First name and last name cannot be empty'],
      });
      return;
    }

    const result = await ProfileService.updateProfile(
      userId,
      'client',
      req.body
    );

    res.json({
      success: true,
      message: 'Client profile updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Update client profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update client profile',
      errors: [error.message || 'Profile update failed'],
    });
  }
};

export const updateContractorProfileController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    if (req.body.licenseNumber) {
      const existingLicense = await Contractor.findOne({
        licenseNumber: req.body.licenseNumber,
        userId: { $ne: userId },
      });

      if (existingLicense) {
        res.status(409).json({
          success: false,
          message: 'License number already exists',
          errors: ['A contractor with this license number already exists'],
        });
        return;
      }
    }

    const result = await ProfileService.updateProfile(
      userId,
      'contractor',
      req.body
    );

    res.json({
      success: true,
      message: 'Contractor profile updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Update contractor profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update contractor profile',
      errors: [error.message || 'Profile update failed'],
    });
  }
};

// ===== PROFILE COMPLETION CONTROLLERS =====

export const getClientCompletionController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id || req.user?.sub;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    const completion = await ProfileService.getProfileCompletion(
      userId,
      'client'
    );
    res.json({
      success: true,
      message: 'Client profile completion status retrieved successfully',
      data: completion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get profile completion',
      errors: [error.message || 'Profile completion check failed'],
    });
  }
};

// Get contractor completion (authenticated user)
export const getContractorCompletionController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id || req.user?.sub;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    const completion = await ProfileService.getProfileCompletion(
      userId,
      'contractor'
    );
    res.json({
      success: true,
      message: 'Contractor profile completion status retrieved successfully',
      data: completion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get profile completion',
      errors: [error.message || 'Profile completion check failed'],
    });
  }
};

// Get profile completion status (service-to-service)
export const getCompletionController = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.params;

    if (!userId || !role) {
      res.status(400).json({
        success: false,
        message: 'Missing required parameters',
        errors: ['User ID and role are required'],
      });
      return;
    }

    if (!['client', 'contractor'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role',
        errors: ['Role must be either client or contractor'],
      });
      return;
    }

    const completion = await ProfileService.getProfileCompletion(userId, role);
    res.json({
      success: true,
      message: 'Profile completion status retrieved successfully',
      data: completion,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to get profile completion',
      errors: [error.message || 'Profile completion check failed'],
    });
  }
};

export const searchContractorsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
        errors: ['Authentication required'],
      });
      return;
    }

    const {
      general,
      trade,
      specialty,
      subSpecialty,
      city,
      province,
      pcab,
      // contractorRole,
      role,
      minRating,
      isVerified,
      search, // For company name or description search
      page = '1',
      limit = '10',
    } = req.query;

    // Build search filters
    const filters: any = {};

    if (general) {
      const generalProjects = Array.isArray(general) ? general : [general];
      filters.generalProjects = { $all: generalProjects };
    }

    if (trade) {
      const trades = Array.isArray(trade) ? trade : [trade];
      filters['tradeProjects.trade'] = { $all: trades };
      // filters['tradeProjects.trade'] = trade;
    }

    if (specialty) {
      const specialties = Array.isArray(specialty) ? specialty : [specialty];
      filters['tradeProjects.specialties'] = { $all: specialties };
      // filters['tradeProjects.specialties'] = { $in: [specialty] };
    }

    if (subSpecialty) {
      const subSpecialties = Array.isArray(subSpecialty)
        ? subSpecialty
        : [subSpecialty];
      filters['tradeProjects.specialties.subcategories'] = {
        $all: subSpecialties,
      };
    }

    if (city) {
      filters['address.city'] = new RegExp(city as string, 'i');
    }

    if (province) {
      filters['address.province'] = new RegExp(province as string, 'i');
    }

    if (pcab) {
      const pcabValues = Array.isArray(pcab) ? pcab : [pcab];
      filters.pcab = { $in: pcabValues };
    }

    // if (
    //   contractorRole &&
    //   ['general', 'trade', 'both'].includes(contractorRole as string)
    // ) {
    //   filters.contractorRole = contractorRole;
    // }

    if (role) {
      const roles = Array.isArray(role) ? role : [role];
      const hasTradeFilters = trade || specialty || subSpecialty;
      const hasGeneralFilters = general;
      const roleFilters: any = [];

      roles.forEach((selectedRole) => {
        roleFilters.push(selectedRole);

        if (selectedRole === 'trade' && hasTradeFilters)
          roleFilters.push('both');
        if (selectedRole === 'general' && hasGeneralFilters)
          roleFilters.push('both');
      });

      const uniqueRoleFilters = [...new Set(roleFilters)];
      filters.contractorRole = { $in: uniqueRoleFilters };

      // filter.contractorRole = { $in: roles };
    }

    // if (minRating) {
    //   const rating = parseFloat(minRating as string);
    //   if (!isNaN(rating) && rating >= 0 && rating <= 5) {
    //     filters['ratingStats.averageRating'] = { $gte: rating };
    //   }
    // }

    // if (isVerified !== undefined) {
    //   filters.isVerified = isVerified === 'true';
    // }

    // Text search in company name or description
    if (search) {
      filters.$or = [
        { companyName: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') },
        { firstName: new RegExp(search as string, 'i') },
        { lastName: new RegExp(search as string, 'i') },
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string))); // Max 50 results per page
    const skip = (pageNum - 1) * limitNum;

    // Execute search
    const [contractors, total] = await Promise.all([
      Contractor.find(filters)
        // .populate('userId', 'email status isEmailVerified')
        .select('-verificationDocuments -emergencyContact') // Exclude sensitive data
        .sort({
          'ratingStats.averageRating': -1,
          'ratingStats.totalRatings': -1,
          // isVerified: -1,
          createdAt: -1,
          companyName: 1,
        })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contractor.countDocuments(filters),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Contractors retrieved successfully',
      data: contractors,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalContractors: total,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      filters: {
        general,
        trade,
        specialty,
        subSpecialty,
        city,
        province,
        pcab,
        role,
        // minRating,
        // isVerified,
        search,
      },
    });
  } catch (error: any) {
    console.error('Search contractors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search contractors',
      errors: [error.message || 'Search operation failed'],
    });
  }
};

export const getPublicContractorProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contractorId } = req.params;

    if (!contractorId) {
      return res.status(400).json({
        success: false,
        message: 'Contractor ID is required',
        errors: ['Contractor ID parameter is required'],
      });
    }

    const contractor = await Contractor.findById(contractorId)
      .populate('userId', 'email status isEmailVerified')
      .select('-verificationDocuments -emergencyContact') // Exclude sensitive data
      .lean();

    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: 'Contractor not found',
        errors: ['Contractor profile not found'],
      });
    }

    res.json({
      success: true,
      message: 'Contractor profile retrieved successfully',
      data: contractor,
    });
  } catch (error: any) {
    console.error('Get public contractor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contractor profile',
      errors: [error.message || 'Profile retrieval failed'],
    });
  }
};
