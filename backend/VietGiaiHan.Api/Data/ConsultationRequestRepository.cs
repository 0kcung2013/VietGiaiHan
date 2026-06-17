using Microsoft.Data.SqlClient;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Data;

public class ConsultationRequestRepository
{
    private readonly string _connectionString;

    public ConsultationRequestRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection connection string.");
    }

    public async Task<int> CreateAsync(CreateConsultationRequestDto dto)
    {
        const string sql = """
            INSERT INTO ConsultationRequests
                (FullName, Phone, Message, ProductId, ProductName, ProductSlug, Status, CreatedAt)
            VALUES
                (@FullName, @Phone, @Message, @ProductId, @ProductName, @ProductSlug, 'new', SYSUTCDATETIME());
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        command.Parameters.AddWithValue("@FullName", dto.FullName);
        command.Parameters.AddWithValue("@Phone", dto.Phone);
        command.Parameters.AddWithValue("@Message", (object?)dto.Message ?? DBNull.Value);
        command.Parameters.AddWithValue("@ProductId", (object?)dto.ProductId ?? DBNull.Value);
        command.Parameters.AddWithValue("@ProductName", dto.ProductName);
        command.Parameters.AddWithValue("@ProductSlug", dto.ProductSlug);

        await connection.OpenAsync();
        var id = await command.ExecuteScalarAsync();

        return Convert.ToInt32(id);
    }

    public async Task<IReadOnlyList<ConsultationRequest>> GetAllAsync()
    {
        const string sql = """
            SELECT Id, FullName, Phone, Message, ProductId, ProductName, ProductSlug,
                   Status, AdminNote, IsViewed, ViewedAt, CreatedAt, UpdatedAt
            FROM ConsultationRequests
            ORDER BY CreatedAt DESC;
            """;

        return await QueryAsync(sql);
    }

    public async Task<ConsultationRequest?> GetByIdAsync(int id)
    {
        const string sql = """
            SELECT Id, FullName, Phone, Message, ProductId, ProductName, ProductSlug,
                   Status, AdminNote, IsViewed, ViewedAt, CreatedAt, UpdatedAt
            FROM ConsultationRequests
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<bool> UpdateStatusAsync(int id, string status, string? adminNote)
    {
        const string sql = """
            UPDATE ConsultationRequests
            SET Status = @Status,
                AdminNote = @AdminNote,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Status", status);
        command.Parameters.AddWithValue("@AdminNote", (object?)adminNote ?? DBNull.Value);

        await connection.OpenAsync();
        var affected = await command.ExecuteNonQueryAsync();

        return affected > 0;
    }

    public async Task<bool> MarkViewedAsync(int id)
    {
        const string sql = """
            UPDATE ConsultationRequests
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
            UPDATE ConsultationRequests
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

    private async Task<IReadOnlyList<ConsultationRequest>> QueryAsync(string sql)
    {
        var items = new List<ConsultationRequest>();

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

    private static ConsultationRequest Map(SqlDataReader reader)
    {
        return new ConsultationRequest
        {
            Id = reader.GetInt32(0),
            FullName = reader.GetString(1),
            Phone = reader.GetString(2),
            Message = reader.IsDBNull(3) ? null : reader.GetString(3),
            ProductId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
            ProductName = reader.GetString(5),
            ProductSlug = reader.GetString(6),
            Status = reader.GetString(7),
            AdminNote = reader.IsDBNull(8) ? null : reader.GetString(8),
            IsViewed = reader.GetBoolean(9),
            ViewedAt = reader.IsDBNull(10) ? null : reader.GetDateTime(10),
            CreatedAt = reader.GetDateTime(11),
            UpdatedAt = reader.IsDBNull(12) ? null : reader.GetDateTime(12),
        };
    }
}
