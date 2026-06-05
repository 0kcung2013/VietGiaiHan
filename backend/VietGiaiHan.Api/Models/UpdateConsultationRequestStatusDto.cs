using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class UpdateConsultationRequestStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? AdminNote { get; set; }
}
