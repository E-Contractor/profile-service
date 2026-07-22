import { Request, Response } from 'express';
import * as ProfileService from '../service/profile.service';
import { Contractor } from '../models/Contractor';
import { Client } from '../models/Client';
import {
  findMatchingContractors,
  OpportunityMatchInput,
} from '../service/matcher.service';

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

    
    const isPcab = res.locals.isPcab || isPcabQuery;

    
    const filters: any = {};

    
    
    if (isPcab === 'true') {
      
      if (!filters.$and) filters.$and = [];
      filters.$and.push({
        $or: [
          { isPcab: true },
          { isPcab: { $exists: false }, pcab: { $exists: true, $nin: [null, ''] } },
        ],
      });
    } else if (isPcab === 'false') {
      
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

    
    
    
    
    
    

    if (role) {
      
      const rolesString = Array.isArray(role)
        ? role.join(',')
        : role as string;
      const roles = rolesString.split(',').map(r => r.trim());

      const hasGeneralRole = roles.includes('general');
      const hasTradeRole = roles.includes('trade');

      if (hasGeneralRole && hasTradeRole) {
        
        filters.contractorRole = 'both';
      } else if (hasGeneralRole) {
        
        filters.contractorRole = { $in: ['general', 'both'] };
      } else if (hasTradeRole) {
        
        filters.contractorRole = { $in: ['trade', 'both'] };
      }
    }

    if (serviceType) {
      const serviceTypes = Array.isArray(serviceType) ? serviceType : [serviceType];
      filters.serviceType = { $all: serviceTypes };
    }

    
    
    
    
    
    

    
    
    

    
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

    
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string))); 
    const skip = (pageNum - 1) * limitNum;

    
    const [contractors, total] = await Promise.all([
      Contractor.find(filters)
        // .populate('userId', 'email status isEmailVerified')
        .select('-verificationDocuments -emergencyContact') 
        .sort({
          'ratingStats.averageRating': -1,
          'ratingStats.totalRatings': -1,
          
          createdAt: -1,
          companyName: 1,
        })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contractor.countDocuments(filters),
    ]);

    
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
      .select('-verificationDocuments -emergencyContact') 
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





export const getMyPortfolioController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const portfolio = await ProfileService.getPortfolio(userId);
    return res.status(200).json({ success: true, data: portfolio });
  } catch (error: any) {
    return res
      .status(404)
      .json({ success: false, message: error.message || 'Failed to retrieve portfolio' });
  }
};



export const getPortfolioByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const portfolio = await ProfileService.getPortfolio(userId);
    return res.status(200).json({ success: true, data: portfolio });
  } catch (error: any) {
    return res
      .status(404)
      .json({ success: false, message: error.message || 'Failed to retrieve portfolio' });
  }
};

export const addPortfolioItemController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      title,
      description,
      location,
      projectType,
      status,
      completedAt,
      tradeTags,
      trade,
      specialty,
      images,
    } = req.body;
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
      projectType,
      status,
      completedAt: completedAt ? new Date(completedAt) : undefined,
      tradeTags: tradeTags || [],
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

    const {
      title,
      description,
      location,
      projectType,
      status,
      completedAt,
      tradeTags,
      trade,
      specialty,
      images,
    } = req.body;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (projectType !== undefined) item.projectType = projectType;
    if (status !== undefined) item.status = status;
    if (completedAt !== undefined) item.completedAt = completedAt ? new Date(completedAt) : undefined;
    if (tradeTags !== undefined) item.tradeTags = tradeTags;
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



export const getStatsBreakdownController = async (_req: Request, res: Response) => {
  try {
    const [contractorByProvince, clientByProvince, byTradeSpecialty] = await Promise.all([
      Contractor.aggregate([
        { $match: { 'address.province': { $exists: true, $ne: '' } } },
        { $group: { _id: '$address.province', count: { $sum: 1 } } },
      ]),
      Client.aggregate([
        { $match: { 'address.province': { $exists: true, $ne: '' } } },
        { $group: { _id: '$address.province', count: { $sum: 1 } } },
      ]),
      Contractor.aggregate([
        { $unwind: '$tradeProjects' },
        { $unwind: { path: '$tradeProjects.specialties', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: {
              trade: '$tradeProjects.trade',
              specialty: '$tradeProjects.specialties.specialty',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.trade',
            count: { $sum: '$count' },
            specialties: {
              $push: {
                $cond: [
                  { $ifNull: ['$_id.specialty', false] },
                  { specialty: '$_id.specialty', count: '$count' },
                  '$$REMOVE',
                ],
              },
            },
          },
        },
      ]),
    ]);

    const provinceMap = new Map<string, number>();
    for (const row of [...contractorByProvince, ...clientByProvince]) {
      if (!row._id) continue;
      provinceMap.set(row._id, (provinceMap.get(row._id) ?? 0) + row.count);
    }
    const byProvince = Array.from(provinceMap.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => a.province.localeCompare(b.province));

    const byTradeSpecialtyFormatted = byTradeSpecialty
      .filter((t: any) => t._id)
      .map((t: any) => ({
        trade: t._id,
        count: t.count,
        specialties: (t.specialties || []).sort((a: any, b: any) =>
          a.specialty.localeCompare(b.specialty)
        ),
      }));

    return res.status(200).json({
      success: true,
      data: { byProvince, byTradeSpecialty: byTradeSpecialtyFormatted },
    });
  } catch (error: any) {
    console.error('getStatsBreakdown error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to load stats breakdown',
    });
  }
};

export const matchContractorsController = async (req: Request, res: Response) => {
  try {
    const opp = req.body as OpportunityMatchInput;
    const userIds = await findMatchingContractors(opp);
    return res.status(200).json({
      success: true,
      data: { userIds, count: userIds.length },
    });
  } catch (error: any) {
    console.error('matchContractors error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to match contractors',
    });
  }
};
