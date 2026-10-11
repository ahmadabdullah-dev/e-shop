export type UserDto = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailConfirmed: boolean;
  role: string;
  imageUrl: string | null;
};
export type RequestUpdateCurrentEmailDto = {
  newEmail: string;
}

export type UpdateCurrentEmailDto = {
  code: string;
}

export type UpdateUserDto = {
  firstName: string | null;
  lastName: string | null;
  image: File | null;
};
export type UpdateCurrentUserNameDto = {
  newUserName: string;
}
