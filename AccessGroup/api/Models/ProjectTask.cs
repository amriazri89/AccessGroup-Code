using System.Text.Json.Serialization;

namespace api.Models
{
    public class ProjectTask
    {
        public static class ProjectTaskStatus
        {
            public const string Pending = "Pending";
            public const string Completed = "Completed";
        }

        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = ProjectTaskStatus.Pending;  // default

        // Foreign key to Project
        public int ProjectId { get; set; }

        [JsonIgnore]
        public Project? Project { get; set; }

        // Computed property
        public int? DaysLeft
        {
            get
            {
                if (!DueDate.HasValue) return null;
                return (DueDate.Value.Date - DateTime.UtcNow.Date).Days;
            }
        }

      
    }
}
