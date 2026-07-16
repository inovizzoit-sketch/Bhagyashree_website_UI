export interface LoginCredentials {
  username?: string;
  email?: string; // in case email field is used instead of username
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}
