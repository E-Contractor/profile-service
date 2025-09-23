declare global {
  namespace Express {
    export interface Request {
      user?: {
        _id: string;
        userId: string;
        email: string;
        role: string;
        iat?: number;
        exp?: number;
        sub?: string;
      };
    }
  }
}
