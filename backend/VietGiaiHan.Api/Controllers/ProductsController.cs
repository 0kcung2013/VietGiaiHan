using Microsoft.AspNetCore.Mvc;
using VietGiaiHan.Api.Data;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductRepository _repository;

    public ProductsController(ProductRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts()
    {
        var products = await _repository.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetFeaturedProducts()
    {
        var products = await _repository.GetFeaturedAsync();
        return Ok(products);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Product>> GetProductBySlug(string slug)
    {
        var product = await _repository.GetBySlugAsync(slug);

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }
}
