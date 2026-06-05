using System.ComponentModel.DataAnnotations;

namespace VietGiaiHan.Api.Models;

public class CreateConsultationRequestDto
{
    [Required(ErrorMessage = "Họ và tên là bắt buộc.")]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
    [MaxLength(20)]
    [RegularExpression(@"^[0-9]{9,11}$", ErrorMessage = "Số điện thoại chỉ chứa số, từ 9 đến 11 chữ số.")]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Message { get; set; }

    public int? ProductId { get; set; }

    [Required(ErrorMessage = "Tên sản phẩm là bắt buộc.")]
    [MaxLength(255)]
    public string ProductName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Slug sản phẩm là bắt buộc.")]
    [MaxLength(255)]
    public string ProductSlug { get; set; } = string.Empty;
}
