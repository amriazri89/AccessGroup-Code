using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class Project
    {
        public enum ProjectStatus
        {
            Pending,
            Active,
            Completed,
            OnHold
        }

        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? Remark { get; set; }
        public DateTime? DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public string? StatusReason { get; set; }
        // Navigation properties

        [JsonIgnore]
        public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();

        // 🔹 Created By User (FK to ApplicationUser)
        [JsonIgnore]
        public int? CreatedByUserId { get; set; }
        [JsonIgnore]
        public User? CreatedByUser { get; set; }

        // 🔹 Assigned User
        public int? AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        // Computed property: completion rate based on tasks
        public double ProgressRate
        {
            get
            {
                if (!DateCreated.HasValue || !DueDate.HasValue)
                    return 0;

                var start = DateCreated.Value.Date;
                var end = DueDate.Value.Date;

                if (end <= start)
                    return 100; // already due or invalid

                var totalDays = (end - start).TotalDays;
                var passedDays = (DateTime.UtcNow.Date - start).TotalDays;

                if (passedDays <= 0)
                    return 0; // project not started yet

                var percent = (passedDays / totalDays) * 100.0;

                if (percent < 0) percent = 0;
                if (percent > 100) percent = 100;

                return Math.Round(percent, 2);
            }
        }

        public double TasksCompletionRate
        {
            get
            {
                if (Tasks == null || !Tasks.Any()) return 0;
                var totalTasks = Tasks.Count;
                var completedTasks = Tasks.Count(t => t.Status == ProjectTask.ProjectTaskStatus.Completed);
                return totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0;
            }
        }
    }
}
