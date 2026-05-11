using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public class EmployeeProfile: BaseEntity
    {
        public Guid UserId { get; set; }
        public DateOnly Date { get; set; }
        public string Identify { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }
}
