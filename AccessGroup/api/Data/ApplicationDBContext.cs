
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Project ↔ Tasks
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId);

            // User ↔ Tasks
            // modelBuilder.Entity<User>()
            //     .HasMany(u => u.Tasks)
            //     .WithOne(t => t.AssignedUser)
            //     .HasForeignKey(t => t.AssignedUserId);

            modelBuilder.Entity<Project>()
        .HasOne(p => p.CreatedByUser)
        .WithMany(u => u.CreatedProjects)
        .HasForeignKey(p => p.CreatedByUserId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Project>()
        .HasOne(p => p.AssignedUser)
        .WithMany(u => u.AssignedProjects)
        .HasForeignKey(p => p.AssignedUserId)
        .OnDelete(DeleteBehavior.Restrict);
        }


    }
}
