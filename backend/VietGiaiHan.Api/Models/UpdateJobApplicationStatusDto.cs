using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class UpdateJobApplicationStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;
}

public class MarkJobApplicationsViewedDto
{
    [Required]
    [MinLength(1)]
    public IReadOnlyList<int> Ids { get; set; } = Array.Empty<int>();
}
