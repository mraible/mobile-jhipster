import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Photo } from './photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private resourceUrl = ApiService.API_URL + '/photos';

  constructor(protected http: HttpClient) {}

  create(photo: Photo): Observable<HttpResponse<Photo>> {
    return this.http.post<Photo>(this.resourceUrl, photo, { observe: 'response' });
  }

  update(photo: Photo): Observable<HttpResponse<Photo>> {
    return this.http.put(`${this.resourceUrl}/${photo.id}`, photo, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Photo>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Photo[]>> {
    const options = createRequestOption(req);
    return this.http.get<Photo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
