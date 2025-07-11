﻿using System;
using System.Collections.Generic;

namespace ClothingShop_BE.Models;

public partial class OrderDetail
{
    public long Id { get; set; }

    public Guid OrderId { get; set; }

    public long? ProductId { get; set; }

    public int? Quantity { get; set; }

    public int? UnitPrice { get; set; }

    public int? Discount { get; set; }

    public int? TotalPrice { get; set; }

    public int? Status { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product? Product { get; set; }

    public virtual OrderdetailStatus? StatusNavigation { get; set; }
}
