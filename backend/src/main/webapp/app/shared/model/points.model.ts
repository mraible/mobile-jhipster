import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IPoints {
  id?: number;
  date?: string;
  exercise?: number | null;
  meals?: number | null;
  alcohol?: number | null;
  notes?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IPoints> = {};
