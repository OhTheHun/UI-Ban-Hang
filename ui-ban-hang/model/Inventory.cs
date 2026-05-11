using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public class Inventory: BaseEntity
    {
        public Guid ProductId { get; set; }
        public int quantity { get; set; }
    }
}
