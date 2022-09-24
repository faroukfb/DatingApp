import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private account:AccountService,private toastr:ToastrService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.account.currentUserSource$.pipe(
      map(user=>{
        if(user.roles.includes('Admin')||user.roles.includes('Moderator')){
          return true
        }
        this.toastr.error('you caan not enter this area');
        return false
      })
    )
  }
  
}
