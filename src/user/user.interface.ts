export interface JwtPayload {
  id: number;     
  username: string;
  email?: string;
  gender?: number;
  phonenumber?: string;
  age?: number;
}
