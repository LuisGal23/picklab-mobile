export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isGuest: boolean;
  };
}
