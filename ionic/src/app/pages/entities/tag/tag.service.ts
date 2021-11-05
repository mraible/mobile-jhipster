import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Tag } from './tag.model';

@Injectable({ providedIn: 'root' })
export class TagService {
  private resourceUrl = ApiService.API_URL + '/tags';

  constructor(protected http: HttpClient) {}

  create(tag: Tag): Observable<HttpResponse<Tag>> {
    return this.http.post<Tag>(this.resourceUrl, tag, { observe: 'response' });
  }

  update(tag: Tag): Observable<HttpResponse<Tag>> {
    return this.http.put(`${this.resourceUrl}/${tag.id}`, tag, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Tag>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Tag[]>> {
    const options = createRequestOption(req);
    return this.http.get<Tag[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
