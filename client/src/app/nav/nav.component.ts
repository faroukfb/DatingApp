import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model:any={};


  constructor(public account:AccountService) { }

  ngOnInit(): void {
  
  }
login()
{
 this.account.login(this.model).subscribe
 (
  response=>
   {
    console.log(response)} 
   
  
 
 
 )
  
  
}
logout(){
  this.account.logout();
  this.model.password=''
  this.model.username=''

  
}

}
