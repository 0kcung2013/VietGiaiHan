using Microsoft.AspNetCore.Mvc;
using VietGiaiHan.Api.Data;
using VietGiaiHan.Api.Models;

namespace VietGiaiHan.Api.Controllers;

[ApiController]
[Route("api/job-applications")]
public class JobApplicationsController : ControllerBase
{
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "new",
        "reviewed",
        "accepted",
        "rejected",
    };

    private readonly JobApplicationRepository _repository;

    public JobApplicationsController(JobApplicationRepository repository)
    {
        _repository = repository;
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] SaveJobApplicationDto dto)
    {
        var id = await _repository.CreateAsync(dto);

        return Ok(new { success = true, message = "Gửi hồ sơ ứng tuyển thành công.", id });
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<JobApplication>>> GetAll()
    {
        var items = await _repository.GetAllAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplication>> GetById(int id)
    {
        var item = await _repository.GetByIdAsync(id);

        if (item is null)
        {
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateJobApplicationStatusDto dto)
    {
        if (!ValidStatuses.Contains(dto.Status))
        {
            return BadRequest("Invalid job application status.");
        }

        var updated = await _repository.UpdateStatusAsync(id, dto.Status);

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
    public async Task<IActionResult> MarkViewed([FromBody] MarkJobApplicationsViewedDto dto)
    {
        if (dto.Ids.Count == 0)
        {
            return BadRequest("At least one job application id is required.");
        }

        await _repository.MarkViewedAsync(dto.Ids);

        return NoContent();
    }
}
