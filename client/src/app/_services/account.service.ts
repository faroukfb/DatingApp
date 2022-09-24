import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
BaseUrl=environment.apiUrl;
private currentUserSource=new ReplaySubject<User>(1)
currentUserSource$=this.currentUserSource.asObservable();
  constructor(private http:HttpClient) { }
  login(model:any){
return this.http.post(this.BaseUrl+'Account/login',model).pipe(
  map(
    (response:User)=>{
      const user=response;
      if(user){
        this.setCurrentUser(user);}
     
    })
    );
  }
  
  logout(){
     
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

  }
setCurrentUser(user:User){
  user.roles=[]
  const roles=this.getDecodedToken(user.token).role;
  Array.isArray(roles)?user.roles=roles:user.roles.push(roles)
  localStorage.setItem('user',JSON.stringify(user));
   this.currentUserSource.next(user);
}
register(model:any){
  return this.http.post(this.BaseUrl +'Account/register',model).pipe(
    map(
      (user:User)=>{
       
        if(user){
         
       this.setCurrentUser(user);
        }
       
      })
      );
   

}
getDecodedToken(token){
  
  return JSON.parse(atob(token.split('.')[1]));


}
}
