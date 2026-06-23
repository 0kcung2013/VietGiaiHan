using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class SaveJobApplicationDto
{
    [Required(ErrorMessage = "Họ và tên là bắt buộc.")]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
    [MaxLength(20)]
    [RegularExpression(@"^[0-9]{9,11}$", ErrorMessage = "Số điện thoại chỉ chứa số, từ 9 đến 11 chữ số.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email là bắt buộc.")]
    [MaxLength(200)]
    [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vị trí ứng tuyển là bắt buộc.")]
    [MaxLength(200)]
    public string Position { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? CvUrl { get; set; }

    [MaxLength(200)]
    public string? CvFileName { get; set; }

    [MaxLength(1000)]
    public string? Message { get; set; }
}
