using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByUserToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByUserId",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId1",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CreatedByUserId1",
                table: "Projects",
                column: "CreatedByUserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Users_CreatedByUserId1",
                table: "Projects",
                column: "CreatedByUserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Users_CreatedByUserId1",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CreatedByUserId1",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId1",
                table: "Projects");
        }
    }
}
