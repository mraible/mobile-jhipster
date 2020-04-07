import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class BloodPressure implements BaseEntity {
  constructor(public id?: number, public timestamp?: any, public systolic?: number, public diastolic?: number, public user?: User) {}
}
