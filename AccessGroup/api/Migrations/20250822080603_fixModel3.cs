using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class fixModel3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "assignedUserId",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_assignedUserId",
                table: "Projects",
                column: "assignedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Users_assignedUserId",
                table: "Projects",
                column: "assignedUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Users_assignedUserId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_assignedUserId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "assignedUserId",
                table: "Projects");
        }
    }
}
