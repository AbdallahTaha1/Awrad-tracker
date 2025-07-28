export interface AuthResult {
  jwtToken: string;
  jwtTokenExpiresOn: Date;
  email: string;
  name: string;
  roles: string[];
  isAuthenticated: boolean;
  message?: string;
}
