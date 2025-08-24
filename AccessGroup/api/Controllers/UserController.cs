using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for Include
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;
using api.Data;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }



        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            var users = await _context.Users
                .Include(u => u.CreatedProjects)
                .Include(u => u.AssignedProjects)
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _context.Users
                .Include(u => u.CreatedProjects)
                .Include(u => u.AssignedProjects)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(user);
        }


        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> Create([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid user data." });

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                return Conflict(new { message = "Email already exists." });

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User updatedUser)
        {
            if (updatedUser == null)
                return BadRequest(new { message = "Invalid user data." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            //user.Password = updatedUser.Password; // Optional: hash in production
            user.Phone = updatedUser.Phone;
            user.Department = updatedUser.Department;
            user.Position = updatedUser.Position;
            user.Role = updatedUser.Role;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
