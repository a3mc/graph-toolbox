import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ApiClientService {
  public baseUrl = '/';

  constructor(
      private _httpClient: HttpClient
  ) {
  }

  public get( endpoint: string ): any {
    let url = this.baseUrl + endpoint;
    return this._httpClient.get( url );
  }
}
