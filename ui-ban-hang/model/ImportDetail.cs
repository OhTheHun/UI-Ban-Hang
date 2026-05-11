using BeeExamPro.BackendService.Model.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendService.Model
{
    public class ImportDetail: BaseEntity
    {
        public Guid ReceiptId { get; set; }

        public Guid ProductId { get; set; }
        public int Quantity { get; set; }

        public decimal ImportPrice { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
