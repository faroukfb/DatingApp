import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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


  constructor(public account:AccountService, private router:Router,private toastr:ToastrService) { }

  ngOnInit(): void {
  
  }
login()
{
 this.account.login(this.model).subscribe({next:(response)=>{this.router.navigateByUrl('/members');
this.toastr.success("hello"+this.model.username)
},
error:(erreur) =>{this.toastr.error(erreur.error)
},
});

}
 
  

logout(){
  this.account.logout();
  this.model.password=''
  this.model.username=''
  this.router.navigateByUrl('/');
  
}

}
