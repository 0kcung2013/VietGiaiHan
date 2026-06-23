namespace VietGiaiHan.Api.Models;

public class AdminSummaryDto
{
    public int TotalProducts { get; set; }
    public int TotalCategories { get; set; }
    public int TotalConsultationRequests { get; set; }
    public int UnviewedConsultationRequests { get; set; }
    public int NewConsultationRequests { get; set; }
    public int ContactedConsultationRequests { get; set; }
    public int CompletedConsultationRequests { get; set; }
    public int TotalJobApplications { get; set; }
    public int UnviewedJobApplications { get; set; }
}

public class DailyConsultationStatsDto
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
}
