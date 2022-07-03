import { Injectable } from '@angular/core';

// import common service

import { Observable } from 'rxjs';
import { MainService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  constructor(private _apiService: MainService) {}
  loggedUser: string = window.sessionStorage.getItem('userId');

  predictApi(obj: any): Observable<any> {
    return this._apiService.post(`predict_api`, obj);
  }
}
