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
                (SELECT COUNT(*) FROM ConsultationRequests WHERE IsViewed = 0) AS UnviewedConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'new') AS NewConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'contacted') AS ContactedConsultationRequests,
                (SELECT COUNT(*) FROM ConsultationRequests WHERE Status = N'completed') AS CompletedConsultationRequests,
                (SELECT COUNT(*) FROM JobApplications) AS TotalJobApplications,
                (SELECT COUNT(*) FROM JobApplications WHERE IsViewed = 0) AS UnviewedJobApplications;
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
            UnviewedConsultationRequests = reader.GetInt32(3),
            NewConsultationRequests = reader.GetInt32(4),
            ContactedConsultationRequests = reader.GetInt32(5),
            CompletedConsultationRequests = reader.GetInt32(6),
            TotalJobApplications = reader.GetInt32(7),
            UnviewedJobApplications = reader.GetInt32(8),
        };
    }

    public async Task<IReadOnlyList<DailyConsultationStatsDto>> GetDailyConsultationStatsAsync(int days = 7)
    {
        var sql = $"""
            WITH DateRange AS (
                SELECT CAST(DATEADD(DAY, -@Days, CAST(GETDATE() AS DATE)) AS DATE) AS [Date]
                UNION ALL
                SELECT DATEADD(DAY, 1, [Date])
                FROM DateRange
                WHERE [Date] < CAST(GETDATE() AS DATE)
            )
            SELECT
                CONVERT(VARCHAR(10), dr.[Date], 120) AS [Date],
                COUNT(cr.Id) AS [Count]
            FROM DateRange dr
            LEFT JOIN ConsultationRequests cr
                ON CAST(cr.CreatedAt AS DATE) = dr.[Date]
            GROUP BY dr.[Date]
            ORDER BY dr.[Date];
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Days", days);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        var items = new List<DailyConsultationStatsDto>();
        while (await reader.ReadAsync())
        {
            items.Add(new DailyConsultationStatsDto
            {
                Date = reader.GetString(0),
                Count = reader.GetInt32(1),
            });
        }

        return items;
    }
}
