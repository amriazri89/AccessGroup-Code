using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
namespace api.Models
{
    public class User
    {
        public static class Roles
        {
            public const string Admin = "Admin";
            public const string User = "User";
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }

        public string? Department { get; set; }
        public string? Position { get; set; }

        public string? Password { get; set; }

        public string? Role { get; set; } = Roles.User; // default role

        [JsonIgnore]
        public ICollection<Project> CreatedProjects { get; set; } = new List<Project>();
        [JsonIgnore]
        public ICollection<Project> AssignedProjects { get; set; } = new List<Project>();


    }
}