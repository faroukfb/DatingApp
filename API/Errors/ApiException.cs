using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int stausCode, string message=null, string details=null)
        {
            StausCode = stausCode;
            Message = message;
            Details = details;
        }

        public int StausCode{ get; set; }
        public string Message{ get; set; }
        public string Details { get; set; }
    }
}