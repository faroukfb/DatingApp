using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _context;
        public LikeRepository(DataContext context)
        {
            _context=context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId,likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUsersLikes(likesParams likesParam)
        {
           var users=_context.Users.OrderBy(u=>u.UserName).AsQueryable();
           var likes=_context.Likes.AsQueryable();
           if(likesParam.Predicate=="liked"){
            likes=likes.Where(like=>like.SourceUserId==likesParam.UserId);
            users=likes.Select(like=>like.LikedUser);
           } 
           if(likesParam.Predicate=="likedBy"){
 likes=likes.Where(like=>like.likedUserId==likesParam.UserId);
            users=likes.Select(like=>like.SourceUser);
           }
           var likedUsers= users.Select(user=>new LikeDto 
           {
            Username=user.UserName,
            KnownAs=user.KnownAs,
            Age=user.DateOfBirth.CalculateAge(),
            PhotoUrl=user.Photos.FirstOrDefault(p=>p.IsMain).Url,
            City=user.City,
            Id=user.Id

           });
           return await PagedList<LikeDto>.CreateAsync(likedUsers,likesParam.PageNumber,likesParam.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
            .Include(x=>x.LikedUsers).FirstOrDefaultAsync(x=>x.Id==userId);
        }
    }
}