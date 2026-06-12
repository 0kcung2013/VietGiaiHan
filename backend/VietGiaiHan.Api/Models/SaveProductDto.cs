using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class SaveProductDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public int? CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public int SortOrder { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active";
}
