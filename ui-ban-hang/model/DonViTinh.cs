using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public  class DonViTinh: BaseEntity
    {
        public string TenDonViTinh { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
