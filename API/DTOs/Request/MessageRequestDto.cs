using System;

namespace API.DTOs.Request;

public class MessageRequestDto
{
    public long Id { get; set; } 
    public string? SenderId { get; set; }
    public string? ReceiverId { get; set; } 
    public string? Content { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedDate { get; set; }

}
