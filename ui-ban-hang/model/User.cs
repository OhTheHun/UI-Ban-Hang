using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public class User: BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; } 
        public string? FullName { get; set; }
        public string? Address { get; set; } 
        public string? Image { get; set; } 
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
