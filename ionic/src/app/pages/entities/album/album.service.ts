import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Album } from './album.model';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private resourceUrl = ApiService.API_URL + '/albums';

  constructor(protected http: HttpClient) {}

  create(album: Album): Observable<HttpResponse<Album>> {
    return this.http.post<Album>(this.resourceUrl, album, { observe: 'response' });
  }

  update(album: Album): Observable<HttpResponse<Album>> {
    return this.http.put(`${this.resourceUrl}/${album.id}`, album, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Album>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Album[]>> {
    const options = createRequestOption(req);
    return this.http.get<Album[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
