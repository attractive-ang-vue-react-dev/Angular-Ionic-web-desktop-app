import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'https://myhome.propify.app';
  
  constructor(public http:HttpClient) { }
  
  userLogin(loginDetails:any) {
     const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Localization': 'de',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'
      })
    };
    
    return this.http.post(this.url+'/api/v1/auth/login', loginDetails, httpOptions);
  }


  syncData(token:any, syncData?) {
    const httpOptions = {
     headers: new HttpHeaders({
       'Content-Type':  'application/json',
       'Accept': 'application/json',
       'Localization': 'de',
       'Access-Control-Allow-Origin' : '*',
       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
       'Authorization': 'Bearer ' + token
     })
   };

   return !syncData ? this.http.get(this.url+'/api/v1/offline-tools/sync', httpOptions) : this.http.put(this.url+'/api/v1/offline-tools/sync', JSON.stringify(syncData), httpOptions);
 }
}
