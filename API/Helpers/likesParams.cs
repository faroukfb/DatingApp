using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class likesParams:PaginationParams
    {
        public int UserId { get; set; }
         public string Predicate { get; set; }
        
    }
}