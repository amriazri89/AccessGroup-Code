using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectTaskController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ProjectTaskController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/projecttask/project/9
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetTasksByProjectId(int projectId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Project)
                .ToListAsync();

            if (tasks == null || !tasks.Any())
            {
                return NotFound(new { message = $"No tasks found for Project ID {projectId}" });
            }

            return Ok(tasks);
        }


        // GET: api/projecttask
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetTasks()
        {
            return await _context.Tasks
                .Include(t => t.Project)
                .ToListAsync();
        }

        // GET: api/projecttask/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTask>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return NotFound();

            return task;
        }

        // POST: api/projecttask
        [HttpPost]
        public async Task<ActionResult<ProjectTask>> CreateTask(ProjectTask task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/projecttask/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, ProjectTask task)
        {
            if (id != task.Id)
            {
                return BadRequest("Task ID mismatch.");
            }

            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            // Update fields (only the ones you allow to change)
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Status = task.Status;
            existingTask.DueDate = task.DueDate;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tasks.Any(t => t.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(existingTask); // better than NoContent (so frontend gets updated object)
        }



        // DELETE: api/projecttask/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
