import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
baseUrl="https://localhost:5001/api/"
validationError:string[]=[];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }
get404Error(){
  this.http.get(this.baseUrl+'Buggy/not-found').subscribe({
    next:(response)=>{console.log(response)},
    error:(error)=>{console.log(error)}
  })
}
  get400Error(){
    this.http.get(this.baseUrl+'Buggy/bad-request').subscribe({
      next:(response)=>{console.log(response)},
      error:(error)=>{console.log(error)}
    })
  }
    get500Error(){
      this.http.get(this.baseUrl+'Buggy/server-error').subscribe({
        next:(response)=>{console.log(response)},
        error:(error)=>{console.log(error)}
      })
    }
      get401Error(){
        this.http.get(this.baseUrl+'Buggy/auth').subscribe({
          next:(response)=>{console.log(response)},
          error:(error)=>{console.log(error)}
        })
        
      }
      get400ValidationError(){
        this.http.post(this.baseUrl+'Account/register',{}).subscribe({
          next:(response)=>{console.log(response)},
          error:(error)=>{console.log(error)
          this.validationError=error}
        })
      }
}

