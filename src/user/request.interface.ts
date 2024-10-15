import { Request } from 'express';
import { JwtPayload } from './user.interface';

export interface CustomUserRequest extends Request {
  user: JwtPayload;
}
