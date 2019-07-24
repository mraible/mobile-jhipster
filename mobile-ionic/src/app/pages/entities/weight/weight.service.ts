import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Weight } from './weight.model';

@Injectable({ providedIn: 'root'})
export class WeightService {
    private resourceUrl = ApiService.API_URL + '/weights';

    constructor(protected http: HttpClient) { }

    create(weight: Weight): Observable<HttpResponse<Weight>> {
        return this.http.post<Weight>(this.resourceUrl, weight, { observe: 'response'});
    }

    update(weight: Weight): Observable<HttpResponse<Weight>> {
        return this.http.put(this.resourceUrl, weight, { observe: 'response'});
    }

    find(id: number): Observable<HttpResponse<Weight>> {
        return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    query(req?: any): Observable<HttpResponse<Weight[]>> {
        const options = createRequestOption(req);
        return this.http.get<Weight[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
}
