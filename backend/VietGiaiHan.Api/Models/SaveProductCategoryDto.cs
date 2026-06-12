using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class SaveProductCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active";
}
