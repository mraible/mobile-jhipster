import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Points implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public exercise?: number,
        public meals?: number,
        public alcohol?: number,
        public notes?: string,
        public user?: User,
    ) {
    }
}
