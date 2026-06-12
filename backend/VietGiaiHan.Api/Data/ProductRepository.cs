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

    public async Task<IReadOnlyList<Product>> GetAllForAdminAsync()
    {
        const string sql = """
            SELECT
                p.Id, p.Name, p.Slug, p.Description, p.CategoryId, p.Category,
                COALESCE(c.Name, p.Category) AS CategoryName,
                COALESCE(c.Slug, N'') AS CategorySlug,
                p.ImageUrl, p.IsFeatured, p.SortOrder, p.Status, p.CreatedAt
            FROM Products p
            LEFT JOIN ProductCategories c ON p.CategoryId = c.Id
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

    public async Task<Product> CreateAsync(SaveProductDto dto)
    {
        const string sql = """
            INSERT INTO Products
                (Name, Slug, Description, CategoryId, Category, ImageUrl, IsFeatured, SortOrder, Status, CreatedAt)
            OUTPUT
                INSERTED.Id, INSERTED.Name, INSERTED.Slug, INSERTED.Description, INSERTED.CategoryId,
                INSERTED.Category, INSERTED.Category, N'', INSERTED.ImageUrl, INSERTED.IsFeatured,
                INSERTED.SortOrder, INSERTED.Status, INSERTED.CreatedAt
            VALUES
                (@Name, @Slug, @Description, @CategoryId, @Category, @ImageUrl, @IsFeatured, @SortOrder, @Status, SYSUTCDATETIME());
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = CreateSaveCommand(sql, dto, connection);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            throw new InvalidOperationException("Failed to create product.");
        }

        return MapProduct(reader);
    }

    public async Task<bool> UpdateAsync(int id, SaveProductDto dto)
    {
        const string sql = """
            UPDATE Products
            SET Name = @Name,
                Slug = @Slug,
                Description = @Description,
                CategoryId = @CategoryId,
                Category = @Category,
                ImageUrl = @ImageUrl,
                IsFeatured = @IsFeatured,
                SortOrder = @SortOrder,
                Status = @Status
            WHERE Id = @Id;
            """;

        await using var connection = new SqlConnection(_connectionString);
        await using var command = CreateSaveCommand(sql, dto, connection);
        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        return await command.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        const string sql = "DELETE FROM Products WHERE Id = @Id;";

        await using var connection = new SqlConnection(_connectionString);
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Id", id);

        await connection.OpenAsync();
        return await command.ExecuteNonQueryAsync() > 0;
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

    private static SqlCommand CreateSaveCommand(string sql, SaveProductDto dto, SqlConnection connection)
    {
        var command = new SqlCommand(sql, connection);
        command.Parameters.AddWithValue("@Name", dto.Name);
        command.Parameters.AddWithValue("@Slug", dto.Slug);
        command.Parameters.AddWithValue("@Description", dto.Description);
        command.Parameters.AddWithValue("@CategoryId", (object?)dto.CategoryId ?? DBNull.Value);
        command.Parameters.AddWithValue("@Category", dto.Category);
        command.Parameters.AddWithValue("@ImageUrl", dto.ImageUrl);
        command.Parameters.AddWithValue("@IsFeatured", dto.IsFeatured);
        command.Parameters.AddWithValue("@SortOrder", dto.SortOrder);
        command.Parameters.AddWithValue("@Status", dto.Status);

        return command;
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
