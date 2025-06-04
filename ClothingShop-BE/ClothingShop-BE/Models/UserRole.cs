using System;
using System.Collections.Generic;

namespace ClothingShop_BE.Models;

public partial class UserRole
{
    public int Id { get; set; }

    public Guid? UserId { get; set; }

    public int? RoleId { get; set; }

    public virtual Role? Role { get; set; }

    public virtual User? User { get; set; }
}
