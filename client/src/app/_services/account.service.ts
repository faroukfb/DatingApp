import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
BaseUrl="https://localhost:5001/api/";
private currentUserSource=new ReplaySubject<User>(1)
currentUserSource$=this.currentUserSource.asObservable();
  constructor(private http:HttpClient) { }
  login(model:any){
return this.http.post(this.BaseUrl+'Account/login',model).pipe(
  map(
    (response:User)=>{
      const user=response;
      if(user){
        localStorage.setItem('user',JSON.stringify(user));
        this.currentUserSource.next(user);
      }
     
    })
    );
  }
  GetUsers(){
    return this.http.get(this.BaseUrl+'Users');
  }
  logout(){
    
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

  }
setCurrentUser(name:User){

   this.currentUserSource.next(name);
}
register(model:any){
  return this.http.post(this.BaseUrl +'Account/register',model).pipe(
    map(
      (user:User)=>{
       
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
       
      })
      );
   

}
}
