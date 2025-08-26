export const validatePhoneNumber = (phone: string): boolean => {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const validateUrl = (url: string): boolean => {
  return /^https?:\/\/.+/.test(url);
}