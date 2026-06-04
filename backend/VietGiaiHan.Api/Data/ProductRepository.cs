using Microsoft.Data.SqlClient;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Data;

public class ProductRepository
{
    private readonly string _connectionString;

    public ProductRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Missing DefaultConnection connection string.");
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync()
    {
        const string sql = """
            SELECT
                p.Id, p.Name, p.Slug, p.Description, p.CategoryId, p.Category,
                COALESCE(c.Name, p.Category) AS CategoryName,
                COALESCE(c.Slug, N'') AS CategorySlug,
                p.ImageUrl, p.IsFeatured, p.SortOrder, p.Status, p.CreatedAt
            FROM Products p
            LEFT JOIN ProductCategories c ON p.CategoryId = c.Id
            WHERE p.Status = 'Active'
            ORDER BY p.SortOrder ASC, p.Id ASC;
            """;

        return await QueryProductsAsync(sql);
    }

    public async Task<IReadOnlyList<Product>> GetFeaturedAsync()
    {
        const string sql = """
            SELECT
                p.Id, p.Name, p.Slug, p.Description, p.CategoryId, p.Category,
                COALESCE(c.Name, p.Category) AS CategoryName,
                COALESCE(c.Slug, N'') AS CategorySlug,
                p.ImageUrl, p.IsFeatured, p.SortOrder, p.Status, p.CreatedAt
            FROM Products p
            LEFT JOIN ProductCategories c ON p.CategoryId = c.Id
            WHERE p.Status = 'Active' AND p.IsFeatured = 1
            ORDER BY p.SortOrder ASC, p.Id ASC;
            """;

        return await QueryProductsAsync(sql);
    }

    public async Task<Product?> GetBySlugAsync(string slug)
    {
        const string sql = """
            SELECT
                p.Id, p.Name, p.Slug, p.Description, p.CategoryId, p.Category,
                COALESCE(c.Name, p.Category) AS CategoryName,
                COALESCE(c.Slug, N'') AS CategorySlug,
                p.ImageUrl, p.IsFeatured, p.SortOrder, p.Status, p.CreatedAt
            FROM Products p
            LEFT JOIN ProductCategories c ON p.CategoryId = c.Id
            WHERE p.Status = 'Active' AND p.Slug = @Slug;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Slug", slug);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        return await reader.ReadAsync() ? MapProduct(reader) : null;
    }

    private async Task<IReadOnlyList<Product>> QueryProductsAsync(string sql)
    {
        var products = new List<Product>();

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            products.Add(MapProduct(reader));
        }

        return products;
    }

    private static Product MapProduct(SqlDataReader reader)
    {
        return new Product
        {
            Id = reader.GetInt32(0),
            Name = reader.GetString(1),
            Slug = reader.GetString(2),
            Description = reader.GetString(3),
            CategoryId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
            Category = reader.GetString(5),
            CategoryName = reader.GetString(6),
            CategorySlug = reader.GetString(7),
            ImageUrl = reader.GetString(8),
            IsFeatured = reader.GetBoolean(9),
            SortOrder = reader.GetInt32(10),
            Status = reader.GetString(11),
            CreatedAt = reader.GetDateTime(12)
        };
    }
}
