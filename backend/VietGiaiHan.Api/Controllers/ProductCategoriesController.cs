using Microsoft.AspNetCore.Mvc;
using VietGiaiHan.Api.Data;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Controllers;

[ApiController]
[Route("api/product-categories")]
public class ProductCategoriesController : ControllerBase
{
    private readonly ProductCategoryRepository _repository;

    public ProductCategoriesController(ProductCategoryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductCategory>>> GetCategories()
    {
        var categories = await _repository.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductCategory>> GetCategoryBySlug(string slug)
    {
        var category = await _repository.GetBySlugAsync(slug);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }
}
