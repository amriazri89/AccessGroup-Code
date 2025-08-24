using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCreatedByUserIdToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Users_CreatedByUserId1",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CreatedByUserId1",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId1",
                table: "Projects");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                table: "Projects",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CreatedByUserId",
                table: "Projects",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Users_CreatedByUserId",
                table: "Projects",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Users_CreatedByUserId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CreatedByUserId",
                table: "Projects");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedByUserId",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
    }
}
