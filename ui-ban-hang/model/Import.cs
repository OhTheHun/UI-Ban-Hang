using BackendService.Model.Enums;
using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public class Import: BaseEntity
    {
        public string Code { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public ImportEnum Status { get; set; }

        public string? Note { get; set; }
    }
}
