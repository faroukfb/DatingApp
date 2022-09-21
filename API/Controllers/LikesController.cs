using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using API.Helpers;

namespace API.Controllers
{[Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepositry _userRepository;
        private readonly ILikeRepository _likeRepository;

        public LikesController(IUserRepositry userRepository,ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
            _userRepository = userRepository;
            
        }
        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username){
            var sourceUserId =User.GetUserId();
            var likedUser=await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser=await _likeRepository.GetUserWithLikes(sourceUserId);
            if(likedUser == null) return NotFound();
            if(sourceUser.UserName==username) return BadRequest("you cannot like yourself");
            var userLike=await _likeRepository.GetUserLike(sourceUserId,likedUser.Id);
            if(userLike !=null) return BadRequest("you already like this user");
             
             userLike=new UserLike{
               SourceUserId=sourceUser.Id,
               likedUserId=likedUser.Id 
             };
             sourceUser.LikedUsers.Add(userLike);
             if(await _userRepository.SaveAllAsync())
             return Ok();
             return BadRequest("failed to like user");
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]likesParams likesParams) 
        { likesParams.UserId=User.GetUserId();
            var users=await _likeRepository.GetUsersLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);
        return Ok(users);}
    }
}