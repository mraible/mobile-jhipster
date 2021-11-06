import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Album implements BaseEntity {
  constructor(public id?: number, public title?: string, public description?: any, public created?: any, public user?: User) {}
}
