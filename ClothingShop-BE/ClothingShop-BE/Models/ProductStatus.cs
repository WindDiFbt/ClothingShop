﻿using System;
using System.Collections.Generic;

namespace ClothingShop_BE.Models;

public partial class ProductStatus
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
