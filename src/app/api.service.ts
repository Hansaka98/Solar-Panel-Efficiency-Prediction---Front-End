import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

/**
 * import services
 * */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient) {}

  // Setting Headers for API Request
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }
  private setFormDataHeaders(): HttpHeaders {
    const headersConfig = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }
  formDataPost(path: any, body: any): Observable<any> {
    return this.http.post<any>(`${environment.api_url}${path}`, body).pipe(
      catchError((error) => {
        return throwError(error.error);
      }),
      map((res: Response) => res)
    );
  }
  // Perform a GET Request
  get(path: string, quaryParms?: Map<string, string>): Observable<any> {
    let params = {};
    if (quaryParms) {
      for (let [key, value] of quaryParms) {
        params = new HttpParams().set(key, value);
      }
    }
    console.log(params);
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), params: params }).pipe(
      catchError((error) => {
        return throwError(error.error);
      }),
      map((res: Response) => res)
    );
  }
  // Perform a GET Request
  getFromOtherServer(path: string): Observable<any> {
    return this.http.get(`${path}`, { headers: this.setHeaders() }).pipe(
      catchError((error) => {
        return throwError(error.error);
      }),
      map((res: Response) => res)
    );
  }

  // Perform a PUT Request
  put(path: string, body: any): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(this.filterInputs(body)), {
        headers: this.setHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        }),
        map((res: Response) => res.json())
      );
  }

  // Perform a PATCH Request
  patch(path: string, body: any): Observable<any> {
    return this.http
      .patch(`${environment.api_url}${path}`, JSON.stringify(this.filterInputs(body)), {
        headers: this.setHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        }),
        map((res: Response) => res)
      );
  }

  // Perform POST Request
  post(path: any, body: any): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(this.filterInputs(body)), {
        headers: this.setHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        }),
        map((res: Response) => res)
      );
  }
  // Perform Delete Request
  delete(path: any): Observable<any> {
    return this.http.delete(`${environment.api_url}${path}`, { headers: this.setHeaders() }).pipe(
      catchError((error) => {
        return throwError(error.error);
      }),
      map((res: Response) => res)
    );
  }

  // filter the input values
  filterInputs(input: any) {
    const tempObj = {};
    Object.keys(input).forEach((key) => {
      if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
        tempObj[key] = input[key];
      }
    });

    return tempObj;
  }
}
