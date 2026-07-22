import { Contractor } from '../models/Contractor';

export interface OpportunityMatchInput {
  contractorRole?: 'general' | 'trade' | 'both';
  classification?: string;
  generalProject?: string;
  tradeProjects?: Array<{ trade: string }>;
  serviceType?: string[];
  userId?: string;
}

const PCAB_TIERS = ['AAAA', 'AAA', 'AA', 'A', 'B', 'C & D', 'Trade/E'];

const tierAtLeast = (required: string): string[] => {
  const idx = PCAB_TIERS.indexOf(required);
  if (idx === -1) return [required];
  return PCAB_TIERS.slice(0, idx + 1);
};

export const findMatchingContractors = async (
  opp: OpportunityMatchInput
): Promise<string[]> => {
  const filter: Record<string, unknown> = {};

  if (opp.contractorRole === 'general') {
    filter.contractorRole = { $in: ['general', 'both'] };
  } else if (opp.contractorRole === 'trade') {
    filter.contractorRole = { $in: ['trade', 'both'] };
  }

  if (opp.classification && opp.classification.trim() !== '') {
    filter.isPcab = true;
    filter.pcab = { $in: tierAtLeast(opp.classification) };
  }

  if (
    opp.generalProject &&
    (opp.contractorRole === 'general' || opp.contractorRole === 'both')
  ) {
    filter.generalProjects = opp.generalProject;
  }

  const oppTrades = (opp.tradeProjects ?? [])
    .map((tp) => tp.trade)
    .filter(Boolean);
  if (
    oppTrades.length > 0 &&
    (opp.contractorRole === 'trade' || opp.contractorRole === 'both')
  ) {
    filter['tradeProjects.trade'] = { $in: oppTrades };
  }

  if (opp.serviceType && opp.serviceType.length > 0) {
    filter.serviceType = { $in: opp.serviceType };
  }

  const matches = await Contractor.find(filter, { userId: 1 }).lean();

  const ownerId = opp.userId ? String(opp.userId) : null;
  return matches
    .map((m) => String(m.userId))
    .filter((id) => id && id !== ownerId);
};
