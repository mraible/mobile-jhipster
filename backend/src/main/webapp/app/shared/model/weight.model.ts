import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IWeight {
  id?: number;
  timestamp?: string;
  weight?: number;
  user?: IUser | null;
}

export const defaultValue: Readonly<IWeight> = {};
