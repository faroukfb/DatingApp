import { Component, OnInit,Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() member:Member;
uploader:FileUploader;
hasBaseDropZoneOver=false;
baseUrl=environment.apiUrl;
user:User;
  constructor(private account :AccountService,private memberserv:MembersService) {
    this.account.currentUserSource$.pipe(take(1)).subscribe(user=>this.user=user)
   }

  ngOnInit(): void {
    this.initializeUploader();
  }
  deletePhoto(photoId:number){
    return this.memberserv.deletePhoto(photoId).subscribe(()=>{
      this.member.photos.filter(x=>x.id!==photoId);
    })
  }
  setMainPhoto(photo:Photo){
this.memberserv.setMainPhoto(photo.id).subscribe(()=>{this.user.photoUrl=photo.url
this.account.setCurrentUser(this.user)
this.member.photoUrl=photo.url
this.member.photos.forEach(p=>{
  if(p.isMain) p.isMain=false
  if(p.id===photo.id) p.isMain=true
})
})
  }
  fileOverBase(e:any){
    this.hasBaseDropZoneOver=e;
  }
initializeUploader(){
  this.uploader=new FileUploader({
    url:this.baseUrl +'Users/add-photo',
    authToken: 'Bearer '+this.user.token,
    isHTML5:true,
    allowedFileType:['image'],
    removeAfterUpload:true,
    autoUpload:false,
    maxFileSize:10*1024*1024

  });
  this.uploader.onAfterAddingFile=(file)=>{
    file.withCredentials=false
  }
  this.uploader.onSuccessItem=(item,response,status,headers)=>{
    if(response){
      const photo=JSON.parse(response);
      this.member.photos.push(photo);
    }
  }
}
}
