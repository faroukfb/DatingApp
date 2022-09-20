import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import{Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members:Member[];
pagination:Pagination;
userParams:UserParams;
user:User;
genderList=[{value:'male',display:'Males'},{value:'female' ,display:'Females'}]
constructor(private memberservice:MembersService) {
 this.userParams=this.memberservice.getUserParams();
   }

  ngOnInit(): void {
   this.loadMembers()
  }
loadMembers(){
  this.memberservice.setUserParams(this.userParams)
  this.memberservice.getMembers(this.userParams).subscribe(response=>{
    this.members=response.result;
    this.pagination=response.pagination;
  })
}

resetFilters(){
  this.userParams= this.memberservice.resetUserParams();
  this.loadMembers()
}
pagechanged(event:any){
  this.userParams.pageNumber=event.page;
  this.memberservice.setUserParams(this.userParams)
  this.loadMembers()
} 

}
