namespace VietGiaiHan.Api.Models;

public class AdminSummaryDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalConsultationRequests { get; set; }
    public int NewConsultationRequests { get; set; }
    public int ContactedConsultationRequests { get; set; }
    public int CompletedConsultationRequests { get; set; }
}
