namespace VietGiaiHan.Api.Models;

public class JobApplication
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? CvUrl { get; set; }
    public string? CvFileName { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = "new";
    public bool IsViewed { get; set; }
    public DateTime? ViewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
