using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using api.Data;
using Microsoft.AspNetCore.Authorization; // Adjust namespace as needed for ApplicationDbContext

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

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpGet("{id}")]
        public ActionResult<User> Get(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            Console.WriteLine($"Received user: {user.Name}, {user.Email}");
            _context.Users.Add(user);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }


        [HttpPut("{id}")]
        public IActionResult Update(int id, User updatedUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound();

            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            user.Password = updatedUser.Password;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }
    }
}