using Microsoft.Data.SqlClient;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Data;

public class ProductCategoryRepository
{
    private readonly string _connectionString;

    public ProductCategoryRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection connection string.");
    }

    public async Task<IReadOnlyList<ProductCategory>> GetAllAsync()
    {
        const string sql = """
            SELECT Id, Name, Slug, Description, SortOrder, Status, CreatedAt
            FROM ProductCategories
            WHERE Status = 'Active'
            ORDER BY SortOrder ASC, Id ASC;
            """;

        return await QueryCategoriesAsync(sql);
    }

    public async Task<ProductCategory?> GetBySlugAsync(string slug)
    {
        const string sql = """
            SELECT Id, Name, Slug, Description, SortOrder, Status, CreatedAt
            FROM ProductCategories
            WHERE Status = 'Active' AND Slug = @Slug;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Slug", slug);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapCategory(reader) : null;
    }

    private async Task<IReadOnlyList<ProductCategory>> QueryCategoriesAsync(string sql)
    {
        var categories = new List<ProductCategory>();

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            categories.Add(MapCategory(reader));
        }

        return categories;
    }

    private static ProductCategory MapCategory(SqlDataReader reader)
    {
        return new ProductCategory
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1),
            Slug = reader.GetString(2),
            Description = reader.GetString(3),
            SortOrder = reader.GetInt32(4),
            Status = reader.GetString(5),
            CreatedAt = reader.GetDateTime(6)
        };
    }
}
