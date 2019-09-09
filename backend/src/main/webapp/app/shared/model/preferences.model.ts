import { IUser } from 'app/shared/model/user.model';
import { Units } from 'app/shared/model/enumerations/units.model';

export interface IPreferences {
  id?: number;
  weeklyGoal?: number;
  weightUnits?: Units;
  user?: IUser;
}

export const defaultValue: Readonly<IPreferences> = {};
