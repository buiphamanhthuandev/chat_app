using System;

namespace API.Models;

public class Message
{
    public long Id { get; set; } 
    public string? SenderId { get; set; }
    public string? ReceiverId { get; set; }
    public string? Content { get; set; }
    public int CountLike { get; set; } = 0;
    public DateTime CreatedDate { get; set; }
    public bool IsRead { get; set; }
    public AppUser? Sender { get; set; }
    public AppUser? Receiver {get; set;}
}
