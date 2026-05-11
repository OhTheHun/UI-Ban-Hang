using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model.Common
{
    public class Category: BaseEntity
    {
        public string TenDanhMuc { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentId { get; set; }

    }
}
