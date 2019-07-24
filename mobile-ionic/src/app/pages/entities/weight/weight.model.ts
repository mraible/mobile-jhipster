import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Weight implements BaseEntity {
    constructor(
        public id?: number,
        public timestamp?: any,
        public weight?: number,
        public user?: User,
    ) {
    }
}
