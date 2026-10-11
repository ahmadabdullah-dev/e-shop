export type LoginDto = {
  email: string;
  password: string;
  rememberMe: boolean;
};
export type RegisterDto = {
  image?: File | null;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
};
export type ResetPasswordDto = {
  email: string;
  code: string;
  newPassword: string;
};