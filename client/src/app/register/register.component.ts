import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model:any={};

@Output() cancelRegister=new EventEmitter();
  constructor(private account:AccountService) { }

  ngOnInit(): void {
  }
register(){
  this.account.register(this.model).subscribe(response=>{
    this.cancel()
  })
}
cancel(){

  this.cancelRegister.emit(false);
}
}
