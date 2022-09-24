using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTOs;
using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using API.Extensions;
using API.Helpers;

namespace API.Controllers
{
    public class UsersController:BaseApiController
    {
        private readonly IUserRepositry _userRepositry;
        
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
     
        public UsersController(IUserRepositry userRepositry,IMapper mapper,IPhotoService photoService){
            _photoService = photoService;
            _mapper = mapper;
            _userRepositry = userRepositry;
          
 
        }
        [Authorize(Roles = "Admin")]
         [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user=await _userRepositry.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername=user.UserName;
            if(string.IsNullOrEmpty(userParams.Gender))
            userParams.Gender=user.Gender == "male" ? "female" : "male";
            var users= await _userRepositry.GetMembersAsync(userParams);
          Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
         
          return Ok( users);
        }
          

         [Authorize(Roles = "Member")]

        [HttpGet("{username}",Name ="GetUser")]
         public async Task<ActionResult<MemberDto>>  GetUser(string username)
        {
           return await _userRepositry.GetMemberAsync(username);
   
        }
        [Authorize]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username=User.GetUsername();
            var user=await _userRepositry.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto,user);
            _userRepositry.Update(user);
            if(await _userRepositry.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update User");
        }
        [Authorize]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file ) {
            var user = await _userRepositry.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);
            if(result.Error != null) return BadRequest(result.Error.Message);
 var photo=new Photo{
    Url=result.SecureUrl.AbsoluteUri,
    PublicId=result.PublicId,
 };
 if(user.Photos.Count == 0)
 photo.IsMain=true;
 user.Photos.Add(photo);
 if ( await _userRepositry.SaveAllAsync()){
return CreatedAtRoute("GetUser",new {username=user.UserName},_mapper.Map<PhotoDto>(photo));
// return _mapper.Map<PhotoDto>(photo);
 }

 return BadRequest("Problem adding Photo");
        }
        [Authorize]
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> setMainPhoto(int photoId){
            var user = await _userRepositry.GetUserByUsernameAsync(User.GetUsername());
            var photo= user.Photos.FirstOrDefault(x=>x.Id==photoId);
            if(photo.IsMain) return BadRequest("this is already a main photo");
            var currentMain=user.Photos.FirstOrDefault(x=>x.IsMain);
            if(currentMain !=null) currentMain.IsMain=false;
            photo.IsMain=true;
             if ( await _userRepositry.SaveAllAsync()){
                return NoContent();
             }
             return BadRequest("fail to set main photo");
        }
        [Authorize]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> deletePhoto(int photoId){
             var user = await _userRepositry.GetUserByUsernameAsync(User.GetUsername());
              var photo= user.Photos.FirstOrDefault(x=>x.Id==photoId);
              if(photo == null) return NotFound();
              if(photo.IsMain) return BadRequest("you can not delete your main photo");
              if(photo.PublicId !=null ){
                var result=await _photoService.DeletePhotoAsync(photo.PublicId);
                  if(result.Error != null) return BadRequest(result.Error.Message);

              }
              user.Photos.Remove(photo);
              if(await _userRepositry.SaveAllAsync()) return Ok();
              return BadRequest("fail to delete photo");
        }

    }
}

