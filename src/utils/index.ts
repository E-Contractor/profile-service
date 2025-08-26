export const calculateCompletionPercentage = (profile: any, role: string): number => {
  const requiredFields =
    role === 'client'
      ? ['firstName', 'lastName', 'phone', 'address.city', 'address.province']
      : [
          'firstName',
          'lastName',
          'companyName',
          'phone',
          'address.city',
          'address.province',
          'contractorRole',
        ];

  const completedFields = requiredFields.filter((field: any) => {
    const value = field.includes('.')
      ? profile[field.split('.')[0]?.[field.split('.')[1]]]
      : profile[field];
    return value && value.trim() !== '';
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export const getMissingFields = (profile: any, role: string): string[] => {
  const requiredFields =
    role === 'client'
      ? ['firstName', 'lastName', 'phone', 'address.city', 'address.province']
      : [
          'firstName',
          'lastName',
          'companyName',
          'phone',
          'address.city',
          'address.province',
          'contractorRole',
        ];

  return requiredFields.filter((field) => {
    const value = field.includes('.')
      ? profile[field.split('.')[0]]?.[field.split('.')[1]]
      : profile[field];
    return !value || value.trim() === '';
  });
};
