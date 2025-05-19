using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Request;

public class LoginDto
{
    [Required]
    public string Email { get; set; } = string.Empty;     
    [Required]
    public string password { get; set; } = string.Empty;
}
