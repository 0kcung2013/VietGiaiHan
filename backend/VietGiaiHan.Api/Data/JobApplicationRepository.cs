using Microsoft.Data.SqlClient;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Data;

public class JobApplicationRepository
{
    private readonly string _connectionString;

    public JobApplicationRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection connection string.");
    }

    public async Task<int> CreateAsync(SaveJobApplicationDto dto)
    {
        const string sql = """
            INSERT INTO JobApplications
                (FullName, Phone, Email, Position, CvUrl, CvFileName, Message, Status, CreatedAt)
            VALUES
                (@FullName, @Phone, @Email, @Position, @CvUrl, @CvFileName, @Message, 'new', SYSUTCDATETIME());
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        command.Parameters.AddWithValue("@FullName", dto.FullName);
        command.Parameters.AddWithValue("@Phone", dto.Phone);
        command.Parameters.AddWithValue("@Email", dto.Email);
        command.Parameters.AddWithValue("@Position", dto.Position);
        command.Parameters.AddWithValue("@CvUrl", (object?)dto.CvUrl ?? DBNull.Value);
        command.Parameters.AddWithValue("@CvFileName", (object?)dto.CvFileName ?? DBNull.Value);
        command.Parameters.AddWithValue("@Message", (object?)dto.Message ?? DBNull.Value);

        await connection.OpenAsync();
        var id = await command.ExecuteScalarAsync();

        return Convert.ToInt32(id);
    }

    public async Task<IReadOnlyList<JobApplication>> GetAllAsync()
    {
        const string sql = """
            SELECT Id, FullName, Phone, Email, Position, CvUrl, CvFileName,
                   Message, Status, IsViewed, ViewedAt, CreatedAt, UpdatedAt
            FROM JobApplications
            ORDER BY CreatedAt DESC;
            """;

        return await QueryAsync(sql);
    }

    public async Task<JobApplication?> GetByIdAsync(int id)
    {
        const string sql = """
            SELECT Id, FullName, Phone, Email, Position, CvUrl, CvFileName,
                   Message, Status, IsViewed, ViewedAt, CreatedAt, UpdatedAt
            FROM JobApplications
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        const string sql = """
            UPDATE JobApplications
            SET Status = @Status,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Status", status);

        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();

        return affected > 0;
    }

    public async Task<bool> MarkViewedAsync(int id)
    {
        const string sql = """
            UPDATE JobApplications
            SET IsViewed = 1,
                ViewedAt = COALESCE(ViewedAt, SYSUTCDATETIME()),
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();

        return affected > 0;
    }

    public async Task<int> MarkViewedAsync(IReadOnlyList<int> ids)
    {
        var uniqueIds = ids.Where(id => id > 0).Distinct().ToArray();

        if (uniqueIds.Length == 0)
        {
            return 0;
        }

        var parameterNames = uniqueIds.Select((_, index) => $"@Id{index}").ToArray();
        var sql = $"""
            UPDATE JobApplications
            SET IsViewed = 1,
                ViewedAt = COALESCE(ViewedAt, SYSUTCDATETIME()),
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id IN ({string.Join(", ", parameterNames)});
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        for (var index = 0; index < uniqueIds.Length; index += 1)
        {
            command.Parameters.AddWithValue(parameterNames[index], uniqueIds[index]);
        }

        await connection.OpenAsync();

        return await command.ExecuteNonQueryAsync();
    }

    private async Task<IReadOnlyList<JobApplication>> QueryAsync(string sql)
    {
        var items = new List<JobApplication>();

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            items.Add(Map(reader));
        }

        return items;
    }

    private static JobApplication Map(SqlDataReader reader)
    {
        return new JobApplication
        {
            Id = reader.GetInt32(0),
            FullName = reader.GetString(1),
            Phone = reader.GetString(2),
            Email = reader.GetString(3),
            Position = reader.GetString(4),
            CvUrl = reader.IsDBNull(5) ? null : reader.GetString(5),
            CvFileName = reader.IsDBNull(6) ? null : reader.GetString(6),
            Message = reader.IsDBNull(7) ? null : reader.GetString(7),
            Status = reader.GetString(8),
            IsViewed = reader.GetBoolean(9),
            ViewedAt = reader.IsDBNull(10) ? null : reader.GetDateTime(10),
            CreatedAt = reader.GetDateTime(11),
            UpdatedAt = reader.IsDBNull(12) ? null : reader.GetDateTime(12),
        };
    }
}
