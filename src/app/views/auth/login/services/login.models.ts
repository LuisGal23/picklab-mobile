export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
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
