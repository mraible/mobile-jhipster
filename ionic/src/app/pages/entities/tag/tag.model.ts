import { BaseEntity } from 'src/model/base-entity';
import { Photo } from '../photo/photo.model';

export class Tag implements BaseEntity {
  constructor(public id?: number, public name?: string, public photos?: Photo[]) {}
}
