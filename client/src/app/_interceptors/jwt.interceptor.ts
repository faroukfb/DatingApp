import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private account:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser:User;
    this.account.currentUserSource$.pipe(take(1)).subscribe(user=>{currentUser=user
    console.log(currentUser.token)} );
    if(currentUser){
      request=request.clone({
        setHeaders:{
          Authorization:`Bearer ${currentUser.token}`
        }
      })
    }
    return next.handle(request);
  }
}
