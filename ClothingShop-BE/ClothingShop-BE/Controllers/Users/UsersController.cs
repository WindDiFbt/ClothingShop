using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ClothingShopPrn232G5Context _context;

    public UsersController(ClothingShopPrn232G5Context context)
    {
        _context = context;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserAccountDTO>>> GetAllAccounts()
    {
        var users = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Userinfo)
            .Select(u => new UserAccountDTO
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                Status = u.Status,
                UserRoles = u.UserRoles.Select(ur => ur.Role != null ? ur.Role.Id : (int?)null).ToList(), // Explicitly convert to List<int?>
                Userinfo = u.Userinfo == null ? null : new UserinfoDTO
                {
                    Gender = u.Userinfo.Gender,
                    Address = u.Userinfo.Address,
                    AvatarUrl = u.Userinfo.AvatarUrl,
                    DateOfBirth = u.Userinfo.DateOfBirth,
                    FullName = u.Userinfo.FullName,
                    UserinfoId = u.Userinfo.Id,
                    UpdateAt = u.Userinfo.UpdateAt,
                    PhoneNumber = u.Userinfo.PhoneNumber
                }
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/Users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<UserAccountDTO>> GetUserById(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Userinfo)
            .Include(u => u.StatusNavigation)
            .Include(u => u.Orders)
            .Include(u => u.Carts)
            .Include(u => u.Wishlists)
            .Include(u => u.Feedbacks)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserAccountDTO
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            Status = user.Status,
            UserRoles = user.UserRoles.Select(ur => ur.Role != null ? ur.Role.Id : (int?)null).ToList(),
            Userinfo = user.Userinfo == null ? null : new UserinfoDTO
            {
                Gender = user.Userinfo.Gender,
                Address = user.Userinfo.Address,
                AvatarUrl = user.Userinfo.AvatarUrl,
                DateOfBirth = user.Userinfo.DateOfBirth,
                FullName = user.Userinfo.FullName,
                UserinfoId = user.Userinfo.Id,
                UpdateAt = user.Userinfo.UpdateAt,
                PhoneNumber = user.Userinfo.PhoneNumber
            },
        };

        return Ok(userDto);
    }

    // PUT: api/Users/{id}
    [HttpPut("{id}")]
    public async Task<dynamic> UpdateUser(Guid id, UpdateUserDTO updateUserDto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .Include(u => u.Userinfo)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        // Update basic user information
        if (updateUserDto.UserName != null)
            user.UserName = updateUserDto.UserName;
        if (updateUserDto.Email != null)
            user.Email = updateUserDto.Email;
        if (updateUserDto.Status != null)
            user.Status = updateUserDto.Status;

        // Update UserRoles if provided
        if (updateUserDto.UserRoles != null)
        {
            // Remove existing roles
            _context.UserRoles.RemoveRange(user.UserRoles);

            // Add new roles
            user.UserRoles = updateUserDto.UserRoles.Select(roleId => new UserRole
            {
                UserId = user.Id,
                RoleId = roleId
            }).ToList();
        }

        // Update or create Userinfo
        if (updateUserDto.Userinfo != null)
        {
            if (user.Userinfo == null)
            {
                user.Userinfo = new Userinfo
                {
                    Id = user.Id
                };
            }

            if (updateUserDto.Userinfo.Gender != null)
                user.Userinfo.Gender = updateUserDto.Userinfo.Gender;
            if (updateUserDto.Userinfo.Address != null)
                user.Userinfo.Address = updateUserDto.Userinfo.Address;
            if (updateUserDto.Userinfo.AvatarUrl != null)
                user.Userinfo.AvatarUrl = updateUserDto.Userinfo.AvatarUrl;
            if (updateUserDto.Userinfo.DateOfBirth != null)
                user.Userinfo.DateOfBirth = updateUserDto.Userinfo.DateOfBirth;
            if (updateUserDto.Userinfo.FullName != null)
                user.Userinfo.FullName = updateUserDto.Userinfo.FullName;
            if (updateUserDto.Userinfo.PhoneNumber != null)
                user.Userinfo.PhoneNumber = updateUserDto.Userinfo.PhoneNumber;

            user.Userinfo.UpdateAt = DateTime.Now;
        }

        try
        {
            await _context.SaveChangesAsync();

            // Return updated user data
            return await GetUserById(id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await UserExists(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    // PUT: api/Users/{id}/status
    [HttpPut("{id}/status")]
    public async Task<ActionResult<UserAccountDTO>> UpdateUserStatus(Guid id, [FromBody] UpdateUserStatusDTO statusDto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Userinfo)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        user.Status = statusDto.Status;

        try
        {
            await _context.SaveChangesAsync();
            return await GetUserById(id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await UserExists(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    // PUT: api/Users/{id}/role
    [HttpPut("{id}/role")]
    public async Task<ActionResult<UserAccountDTO>> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleDTO roleDto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.Userinfo)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        // Remove existing roles
        _context.UserRoles.RemoveRange(user.UserRoles);

        // Add new role
        user.UserRoles = new List<UserRole>
        {
            new UserRole
            {
                UserId = user.Id,
                RoleId = roleDto.RoleId
            }
        };

        try
        {
            await _context.SaveChangesAsync();
            return await GetUserById(id);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await UserExists(id))
            {
                return NotFound();
            }
            throw;
        }
    }

    private async Task<bool> UserExists(Guid id)
    {
        return await _context.Users.AnyAsync(e => e.Id == id);
    }
}
