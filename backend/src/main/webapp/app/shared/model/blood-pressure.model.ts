import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IBloodPressure {
  id?: number;
  timestamp?: string;
  systolic?: number;
  diastolic?: number;
  user?: IUser | null;
}

export const defaultValue: Readonly<IBloodPressure> = {};
