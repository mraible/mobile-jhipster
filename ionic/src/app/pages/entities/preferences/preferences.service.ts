import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Preferences } from './preferences.model';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private resourceUrl = ApiService.API_URL + '/preferences';

  constructor(protected http: HttpClient) {}

  create(preferences: Preferences): Observable<HttpResponse<Preferences>> {
    return this.http.post<Preferences>(this.resourceUrl, preferences, { observe: 'response' });
  }

  update(preferences: Preferences): Observable<HttpResponse<Preferences>> {
    return this.http.put(this.resourceUrl, preferences, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Preferences>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Preferences[]>> {
    const options = createRequestOption(req);
    return this.http.get<Preferences[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
