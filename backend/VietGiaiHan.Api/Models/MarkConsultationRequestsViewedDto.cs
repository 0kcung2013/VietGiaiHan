using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class MarkConsultationRequestsViewedDto
{
    [Required]
    [MinLength(1)]
    public IReadOnlyList<int> Ids { get; set; } = Array.Empty<int>();
}
