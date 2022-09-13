import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model:any={};

@Output() cancelRegister=new EventEmitter();
  constructor(private account:AccountService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
register(){
  this.account.register(this.model).subscribe({next:(response)=>{
    console.table(response);
    this.cancel();},
    error:(erreur) =>{this.toastr.error(erreur.error);}
  });
}
cancel(){

  this.cancelRegister.emit(false);
}
}
