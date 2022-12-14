using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Extensions;
using API.Entities;
using AutoMapper;
using API.Helpers;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepositry _userRepositry ;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepositry userRepositry , IMessageRepository messageRepository,IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepositry = userRepositry;
        }
    





        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto){
            var username=User.GetUsername();
            if(username==createMessageDto.RecipientUsername.ToLower())
            return BadRequest("you can not send a messages to your self");

            var sender = await _userRepositry.GetUserByUsernameAsync(username);
            var recipient=await _userRepositry.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
            if(recipient==null) return NotFound();
             var message= new Message{
                 Sender=sender,
                 Recipient=recipient,
                 SenderUsername=sender.UserName,
                 RecipientUsername=recipient.UserName,
                 Content=createMessageDto.Content
             };
             _messageRepository.AddMessage(message);

             if(await _messageRepository.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));
             return BadRequest("failed to send msg");
              
        }
             [HttpGet]
     public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams  messageParams )
          { 
                 
             messageParams.Username = User.GetUsername();
             var messages=await _messageRepository.GetMessagesForUser(messageParams);
             Response.AddPaginationHeader(messages.CurrentPage,messages.PageSize,messages.TotalCount,messages.TotalPages);
              
              return messages;
     

            }
        [HttpGet("thread/{username}")]

        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username){
            var currentUsername =User.GetUsername();
            return Ok(await _messageRepository.GetMessageThread(currentUsername,username));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id){
            var username=User.GetUsername();
            var message=await _messageRepository.GetMessage(id);
            if(message.Sender.UserName != username && message.Recipient.UserName !=username){
                return Unauthorized();
            }
            if(message.Sender.UserName==username)
            message.SenderDeleted=true;
            if(message.Recipient.UserName == username)
            message.RecipientDeleted=true;
            if(message.SenderDeleted && message.RecipientDeleted)
            _messageRepository.Deletemessage(message);
            if(await _messageRepository.SaveAllAsync())
            return Ok();
            return BadRequest("Problem deleting message");
        }

    }
   




}
