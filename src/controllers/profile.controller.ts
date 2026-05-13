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
      isPcab: isPcabQuery,
      role, // Frontend sends 'role' parameter for contractor role filtering
      serviceType, // Filter by service type (design/build)
      minRating,
      isVerified,
      search, // For company name or description search
      page = '1',
      limit = '10',
    } = req.query;

    // res.locals.isPcab is set by the pcab/non-pcab wrapper controllers
    const isPcab = res.locals.isPcab || isPcabQuery;

    // Build search filters
    const filters: any = {};

    // PCAB classification filter
    // Handles both new data (with isPcab field) and old data (only has pcab string)
    if (isPcab === 'true') {
      // PCAB: explicitly marked OR old data with a pcab category value
      if (!filters.$and) filters.$and = [];
      filters.$and.push({
        $or: [
          { isPcab: true },
          { isPcab: { $exists: false }, pcab: { $exists: true, $nin: [null, ''] } },
        ],
      });
    } else if (isPcab === 'false') {
      // Non-PCAB: not marked as PCAB AND pcab field is empty/missing
      filters.isPcab = { $ne: true };
      filters.pcab = { $in: [null, ''] };
    }

    if (general) {
      const generalProjects = Array.isArray(general) ? general : [general];
      filters.generalProjects = { $all: generalProjects };
      // Auto-filter to contractors with "general" or "both" role when filtering by general projects
      // if (!role) {
      //   filters.contractorRole = { $in: ['general', 'both'] };
      // }
    }

    if (trade) {
      const trades = Array.isArray(trade) ? trade : [trade];
      filters['tradeProjects.trade'] = { $all: trades };
      // Auto-filter to contractors with "trade" or "both" role when filtering by trade projects
      // if (!role && !general) {
      //   filters.contractorRole = { $in: ['trade', 'both'] };
      // }
    }

    if (specialty) {
      const specialties = Array.isArray(specialty) ? specialty : [specialty];
      filters['tradeProjects.specialties.specialty'] = { $all: specialties };
    }

    if (subSpecialty) {
      const subSpecialties = Array.isArray(subSpecialty)
        ? subSpecialty
        : [subSpecialty];
      filters['tradeProjects.specialties.subspecialty'] = {
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
      // Parse roles - frontend sends comma-separated string like "general,trade"
      const rolesString = Array.isArray(role)
        ? role.join(',')
        : role as string;
      const roles = rolesString.split(',').map(r => r.trim());

      const hasGeneralRole = roles.includes('general');
      const hasTradeRole = roles.includes('trade');

      if (hasGeneralRole && hasTradeRole) {
        // Both "general" AND "trade" selected → only show "both" role
        filters.contractorRole = 'both';
      } else if (hasGeneralRole) {
        // Only "general" selected → show "general" and "both"
        filters.contractorRole = { $in: ['general', 'both'] };
      } else if (hasTradeRole) {
        // Only "trade" selected → show "trade" and "both"
        filters.contractorRole = { $in: ['trade', 'both'] };
      }
    }

    if (serviceType) {
      const serviceTypes = Array.isArray(serviceType) ? serviceType : [serviceType];
      filters.serviceType = { $all: serviceTypes };
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
      if (!filters.$and) filters.$and = [];
      filters.$and.push({
        $or: [
          { companyName: new RegExp(search as string, 'i') },
          { description: new RegExp(search as string, 'i') },
          { firstName: new RegExp(search as string, 'i') },
          { lastName: new RegExp(search as string, 'i') },
        ],
      });
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
        serviceType,
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

export const searchPcabContractorsController = async (
  req: AuthRequest,
  res: Response
) => {
  res.locals.isPcab = 'true';
  return searchContractorsController(req, res);
};

export const searchNonPcabContractorsController = async (
  req: AuthRequest,
  res: Response
) => {
  res.locals.isPcab = 'false';
  return searchContractorsController(req, res);
};

export const getFeaturedContractorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const limit = Math.min(10, Math.max(1, parseInt((req.query.limit as string) || '3')));
    const contractors = await Contractor.find({})
      .select('-verificationDocuments -emergencyContact')
      .sort({
        'ratingStats.averageRating': -1,
        'ratingStats.totalRatings': -1,
        createdAt: -1,
      })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      message: 'Featured contractors retrieved successfully',
      data: contractors,
    });
  } catch (error: any) {
    console.error('Get featured contractors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured contractors',
      errors: [error.message || 'Retrieval failed'],
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

// ===== PORTFOLIO CONTROLLERS =====

export const addPortfolioItemController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { title, description, location, completedAt, trade, specialty, images } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const contractor = await Contractor.findOne({ userId });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    (contractor as any).portfolio.push({
      title: title.trim(),
      description,
      location,
      completedAt: completedAt ? new Date(completedAt) : undefined,
      trade,
      specialty,
      images: images || [],
    });

    await contractor.save();
    const added = (contractor as any).portfolio[(contractor as any).portfolio.length - 1];

    return res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: added,
    });
  } catch (error: any) {
    console.error('addPortfolioItem error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to add portfolio item' });
  }
};

export const updatePortfolioItemController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const contractor = await Contractor.findOne({ userId });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    const item = (contractor as any).portfolio.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    const { title, description, location, completedAt, trade, specialty, images } = req.body;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (completedAt !== undefined) item.completedAt = completedAt ? new Date(completedAt) : undefined;
    if (trade !== undefined) item.trade = trade;
    if (specialty !== undefined) item.specialty = specialty;
    if (images !== undefined) item.images = images;

    await contractor.save();

    return res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: item,
    });
  } catch (error: any) {
    console.error('updatePortfolioItem error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update portfolio item' });
  }
};

export const deletePortfolioItemController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const contractor = await Contractor.findOne({ userId });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    const item = (contractor as any).portfolio.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    (contractor as any).portfolio.pull({ _id: itemId });
    await contractor.save();

    return res.json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error: any) {
    console.error('deletePortfolioItem error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to delete portfolio item' });
  }
};
