using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization; // Adjust namespace as needed for ApplicationDbContext

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ProjectController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/project
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.AssignedUser)
                .ToListAsync();
        }

        // GET: api/project/active/count
        [HttpGet("active/count")]
        public async Task<ActionResult<int>> GetActiveProjectCount()
        {
            var count = await _context.Projects
                .CountAsync(p => p.Status == "Active");

            return Ok(count);
        }

        // GET: api/project/stats/5
        [HttpGet("stats/{projectId}")]
        public async Task<ActionResult<object>> GetProjectStats(int projectId)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return NotFound();

            var totalTasks = project.Tasks?.Count ?? 0;
            var completedTasks = project.Tasks?.Count(t => t.Status == "Completed") ?? 0;
            var overdueTasks = project.Tasks?.Count(t =>
                t.Status != "Completed" && t.DueDate.HasValue && t.DueDate.Value < DateTime.UtcNow
            ) ?? 0;

            var completionRate = totalTasks > 0
                ? (completedTasks * 100.0 / totalTasks)
                : 0;

            var totalActiveProjects = await _context.Projects
                .CountAsync(p => p.Status == "Active");

            return Ok(new
            {
                ProjectId = projectId,
                ProjectTitle = project.Title,
                CompletionRatePercent = completionRate,
                TotalOverdueTasks = overdueTasks,
                TotalTasks = totalTasks,
                TotalActiveProjects = totalActiveProjects
            });
        }

        // GET: api/project/overall-stats
        [HttpGet("overall-stats")]
        public async Task<ActionResult<object>> GetOverallStats()
        {
            var now = DateTime.UtcNow;

            // Total active projects
            var totalActiveProjects = await _context.Projects
                .CountAsync(p => p.Status == "Active");

            // Total overdue projects (projects with due date past or status not completed)
            var totalOverdueProjects = await _context.Projects
                .CountAsync(p =>
                    p.Status != "Completed" &&
                    p.DueDate.HasValue &&
                    p.DueDate.Value < now
                );

            // Fetch all tasks to calculate task stats
            var allTasks = await _context.Tasks.ToListAsync();
            var totalTasks = allTasks.Count;
            var completedTasks = allTasks.Count(t => t.Status == "Completed");
            var overdueTasks = allTasks.Count(t =>
                t.Status != "Completed" &&
                t.DueDate.HasValue &&
                t.DueDate.Value < now
            );

            var completionRate = totalTasks > 0
                ? (completedTasks * 100.0 / totalTasks)
                : 0;

            return Ok(new
            {
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                TotalOverdueTasks = overdueTasks,
                CompletionRatePercent = Math.Round(completionRate, 1),
                TotalActiveProjects = totalActiveProjects,
                TotalOverdueProjects = totalOverdueProjects
            });
        }



        // GET: api/project/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjectsByUser(int userId)
        {
            var projects = await _context.Projects
                .Where(p => p.AssignedUserId == userId)
                .Include(p => p.Tasks)
                .ToListAsync();

            if (projects == null || projects.Count == 0) return NotFound();

            return Ok(projects);
        }


        // GET: api/project/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks).Include(p => p.AssignedUser)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            return project;
        }

        // POST: api/project
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // PUT: api/project/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project updatedProject)
        {
            if (id != updatedProject.Id)
                return BadRequest("Project ID mismatch.");

            // Fetch the existing project
            var existingProject = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProject == null)
                return NotFound("Project not found.");

            // Validate assignedUserId exists if not null
            if (updatedProject.AssignedUserId != null)
            {
                var assignedUserExists = await _context.Users
                    .AnyAsync(u => u.Id == updatedProject.AssignedUserId);
                if (!assignedUserExists)
                    return BadRequest("Assigned user does not exist.");
            }

            // Update only the fields you want
            existingProject.Title = updatedProject.Title;
            existingProject.Remark = updatedProject.Remark;
            existingProject.Status = updatedProject.Status;
            existingProject.DueDate = updatedProject.DueDate;
            existingProject.DateCreated = updatedProject.DateCreated;
            existingProject.AssignedUserId = updatedProject.AssignedUserId; // safe now
            existingProject.StatusReason = updatedProject.StatusReason;
            existingProject.CompleteDate = updatedProject.Status == "Completed" ? DateTime.UtcNow : null;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(p => p.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }


        // DELETE: api/project/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Projects/{id}/tasks
        [HttpGet("{id}/tasks")]
        public async Task<ActionResult<IEnumerable<ProjectTask>>> GetTasksByProjectId(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks) // Load related tasks
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project.Tasks);
        }

        // [HttpGet("by-user/{userId}")]
        // public async Task<ActionResult<IEnumerable<Project>>> GetProjectsByUser(int userId)
        // {
        //     var projects = await _context.Projects
        //         .Where(p => p.CreatedByUserId != null && p.CreatedByUserId == userId)
        //         .Include(p => p.Tasks) // optional: include tasks
        //         .ToListAsync();

        //     if (projects == null || projects.Count == 0)
        //         return NotFound($"No projects found for user with ID {userId}");

        //     return Ok(projects);
        // }


    }


}
