import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole:string[]
user:User
  constructor(private viewContainerRef:ViewContainerRef,private templateRef:TemplateRef<any>,private account:AccountService) { 
    this.account.currentUserSource$.pipe(take(1)).subscribe((user)=>{
      this.user=user
    })
   
  }
  ngOnInit(): void {
    if(this.user?.roles.some(r=>
      this.appHasRole.includes(r))){
     console.log(this.user)
     this.viewContainerRef.createEmbeddedView(this.templateRef)
      
     }
   else if(this.user?.roles || this.user == null){
      this.viewContainerRef.clear()
      return; 
    }
     
  
  }

}
