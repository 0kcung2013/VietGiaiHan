namespace VietGiaiHan.Api.Models;

public class ConsultationRequest
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Message { get; set; }
    public int? ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public string? AdminNote { get; set; }
    public bool IsViewed { get; set; }
    public DateTime? ViewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
