using Microsoft.AspNetCore.Mvc;
using VietGiaiHan.Api.Data;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Controllers;

[ApiController]
[Route("api/consultation-requests")]
public class ConsultationRequestsController : ControllerBase
{
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "new",
        "contacted",
        "completed",
        "cancelled",
    };

    private readonly ConsultationRequestRepository _repository;

    public ConsultationRequestsController(ConsultationRequestRepository repository)
    {
        _repository = repository;
    }

    [HttpPost]
    public async Task<ActionResult<ConsultationRequestResponseDto>> Create(
        [FromBody] CreateConsultationRequestDto dto)
    {
        var id = await _repository.CreateAsync(dto);

        return Ok(new ConsultationRequestResponseDto
        {
            Success = true,
            Message = "Gửi yêu cầu tư vấn thành công",
        });
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ConsultationRequest>>> GetAll()
    {
        var items = await _repository.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ConsultationRequest>> GetById(int id)
    {
        var item = await _repository.GetByIdAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateConsultationRequestStatusDto dto)
    {
        if (!ValidStatuses.Contains(dto.Status))
        {
            return BadRequest("Invalid consultation request status.");
        }

        var updated = await _repository.UpdateStatusAsync(id, dto.Status, dto.AdminNote);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:int}/viewed")]
    public async Task<IActionResult> MarkViewed(int id)
    {
        var updated = await _repository.MarkViewedAsync(id);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("mark-viewed")]
    public async Task<IActionResult> MarkViewed([FromBody] MarkConsultationRequestsViewedDto dto)
    {
        if (dto.Ids.Count == 0)
        {
            return BadRequest("At least one consultation request id is required.");
        }

        await _repository.MarkViewedAsync(dto.Ids);

        return NoContent();
    }
}
