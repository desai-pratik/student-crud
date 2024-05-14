import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {};

  private dataUrl = 'http://localhost:3000/posts';

  getapi(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
  addData(data: any):Observable<any> {
    return this.http.post(this.dataUrl, data);
  }
  updateData(id: number, data: any): Observable<any> {
    const updateUrl = `${this.dataUrl}/${id}`;
    return this.http.put(updateUrl, data);
  }
  deletdata(id:number){
    return this.http.delete(`${this.dataUrl}/${id}`);
  }
  getRandomNumbers(): Observable<number> {
    return interval(1000); // Emit a random number every second
  }

  // sign-up
  private userdataUrl = 'http://localhost:3000/user';
  getUserapi(): Observable<any> {
    return this.http.get(this.userdataUrl);
  }
  adduserData(data: any): Observable<any> {
    return this.http.post(this.userdataUrl, data);
  }

  

  updateUserData(id: number, data: any): Observable<any> {
    const updateUserUrl = `${this.userdataUrl}/${id}`;
    return this.http.put(updateUserUrl, data);
  }
}
