import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

registerForm:FormGroup
maxDate:Date
@Output() cancelRegister=new EventEmitter();
validationErrors:string[]=[];
  constructor(private account:AccountService,private toastr:ToastrService, private fb:FormBuilder ,private router:Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18)
  }
  initializeForm(){
    this.registerForm=this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  matchValues(matchTo:string):ValidatorFn{
    return(control:AbstractControl)=>{
      return control?.value === control?.parent?.controls[matchTo].value ? null :{isMatching:true}
    }
  }
register(){
  this.account.register(this.registerForm.value).subscribe({next:(response)=>{
    this.router.navigateByUrl('/members')},
    error:(erreur) =>{this.validationErrors=erreur}
  });
 
}
cancel(){

  this.cancelRegister.emit(false);
}
}
