import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Points } from './points.model';

@Injectable({ providedIn: 'root'})
export class PointsService {
    private resourceUrl = ApiService.API_URL + '/points';

    constructor(protected http: HttpClient) { }

    create(points: Points): Observable<HttpResponse<Points>> {
        return this.http.post<Points>(this.resourceUrl, points, { observe: 'response'});
    }

    update(points: Points): Observable<HttpResponse<Points>> {
        return this.http.put(this.resourceUrl, points, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<Points>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<Points[]>> {
        const options = createRequestOption(req);
        return this.http.get<Points[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
}
