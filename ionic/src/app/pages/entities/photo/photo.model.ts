import { BaseEntity } from 'src/model/base-entity';
import { Album } from '../album/album.model';
import { Tag } from '../tag/tag.model';

export class Photo implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public description?: any,
    public imageContentType?: string,
    public image?: any,
    public height?: number,
    public width?: number,
    public taken?: any,
    public uploaded?: any,
    public album?: Album,
    public tags?: Tag[]
  ) {}
}
