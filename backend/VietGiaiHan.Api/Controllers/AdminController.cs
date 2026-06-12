using Microsoft.AspNetCore.Mvc;
using VietGiaiHan.Api.Data;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminSummaryRepository _summaryRepository;
    private readonly ProductRepository _productRepository;
    private readonly ProductCategoryRepository _categoryRepository;

    public AdminController(
        AdminSummaryRepository summaryRepository,
        ProductRepository productRepository,
        ProductCategoryRepository categoryRepository)
    {
        _summaryRepository = summaryRepository;
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AdminSummaryDto>> GetSummary()
    {
        var summary = await _summaryRepository.GetAsync();
        return Ok(summary);
    }

    [HttpGet("products")]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts()
    {
        var products = await _productRepository.GetAllForAdminAsync();
        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] SaveProductDto dto)
    {
        var product = await _productRepository.CreateAsync(dto);
        return Ok(product);
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] SaveProductDto dto)
    {
        var updated = await _productRepository.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var deleted = await _productRepository.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<ProductCategory>>> GetCategories()
    {
        var categories = await _categoryRepository.GetAllForAdminAsync();
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<ProductCategory>> CreateCategory([FromBody] SaveProductCategoryDto dto)
    {
        var category = await _categoryRepository.CreateAsync(dto);
        return Ok(category);
    }

    [HttpPut("categories/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] SaveProductCategoryDto dto)
    {
        var updated = await _categoryRepository.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _categoryRepository.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
