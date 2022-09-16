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

namespace API.Controllers
{[Authorize]
    public class UsersController:BaseApiController
    {
        private readonly IUserRepositry _userRepositry;
        
        private readonly IMapper _mapper;
     
        public UsersController(IUserRepositry userRepositry,IMapper mapper){
            _mapper = mapper;
            _userRepositry = userRepositry;
          
 
        }
         [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users= await _userRepositry.GetMembersAsync();
         
         
          return Ok( users);
        }
          

        

        [HttpGet("{username}")]
         public async Task<ActionResult<MemberDto>>  GetUser(string username)
        {
           return await _userRepositry.GetMemberAsync(username);
   
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user=await _userRepositry.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto,user);
            _userRepositry.Update(user);
            if(await _userRepositry.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update User");
        }
    }
}

