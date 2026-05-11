using BackendService.Model.Common;
using BackendService.Model.Enums;
using BeeExamPro.BackendService.Model.Common;
namespace BackendService.Model
{
    public class Product: BaseEntity
    {
        public Guid CategoryId { get; set; }
        public Guid SupplierId { get; set; }
        public Guid DonViTinhId { get; set; }
        public string ProductName {  get; set; } = string.Empty;
        public decimal Price { get; set;  }
        public decimal DiscountPrice { get; set; }
        public decimal Cost { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Image_Url { get; set; } = string.Empty;
        public ProductEnum Status { get; set; }
        public DonViTinh? DonViTinh { get; set; }
        public Category? Category { get; set; }
    }
}
