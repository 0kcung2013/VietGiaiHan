using Microsoft.Data.SqlClient;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Data;

public class AdminSummaryRepository
{
    private readonly string _connectionString;

    public AdminSummaryRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection connection string.");
    }

    public async Task<AdminSummaryDto> GetAsync()
    {
        const string sql = """
            SELECT
                (SELECT COUNT(*) FROM Products) AS TotalProducts,
                (SELECT COUNT(*) FROM ProductCategories) AS TotalCategories,
                (SELECT COUNT(*) FROM ConsultationRequests) AS TotalConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'new') AS NewConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'contacted') AS ContactedConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'completed') AS CompletedConsultationRequests;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return new AdminSummaryDto();
        }

        return new AdminSummaryDto
        {
            TotalProducts = reader.GetInt32(0),
            TotalCategories = reader.GetInt32(1),
            TotalConsultationRequests = reader.GetInt32(2),
            NewConsultationRequests = reader.GetInt32(3),
            ContactedConsultationRequests = reader.GetInt32(4),
            CompletedConsultationRequests = reader.GetInt32(5),
        };
    }
}
