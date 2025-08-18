export class User {
    id!: string;
    email!: string;
    name!: string;
    lastname!: string;
    phoneNumber!: string;
    role!: 'user' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: User;
}