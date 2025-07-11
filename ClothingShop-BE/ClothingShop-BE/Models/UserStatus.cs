﻿using System;
using System.Collections.Generic;

namespace ClothingShop_BE.Models;

public partial class UserStatus
{
    public int Id { get; set; }

    public string? StatusName { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
