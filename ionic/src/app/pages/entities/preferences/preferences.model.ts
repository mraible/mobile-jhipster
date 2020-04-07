import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export const enum Units {
  'KG',
  'LB',
}

export class Preferences implements BaseEntity {
  constructor(public id?: number, public weeklyGoal?: number, public weightUnits?: Units, public user?: User) {}
}
