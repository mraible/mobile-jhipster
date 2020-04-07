import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { BloodPressure } from './blood-pressure.model';

@Injectable({ providedIn: 'root' })
export class BloodPressureService {
  private resourceUrl = ApiService.API_URL + '/blood-pressures';

  constructor(protected http: HttpClient) {}

  create(bloodPressure: BloodPressure): Observable<HttpResponse<BloodPressure>> {
    return this.http.post<BloodPressure>(this.resourceUrl, bloodPressure, { observe: 'response' });
  }

  update(bloodPressure: BloodPressure): Observable<HttpResponse<BloodPressure>> {
    return this.http.put(this.resourceUrl, bloodPressure, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<BloodPressure>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<BloodPressure[]>> {
    const options = createRequestOption(req);
    return this.http.get<BloodPressure[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
