using System;
using System.Collections.Generic;

namespace ClothingShop_BE.Models;

public partial class ProductVariant
{
    public long Id { get; set; }

    public long? ProductId { get; set; }

    public string? Size { get; set; }

    public int? Quantity { get; set; }

    public virtual Product? Product { get; set; }
}
