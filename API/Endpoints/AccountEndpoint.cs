using System;
using API.Common;
using API.DTOs.Request;
using API.DTOs.Response;
using API.Extensions;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace API.Endpoints;

public static class AccountEndpoint
{
    public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
    {
        var group = app.MapGroup("api/account").WithTags("account");
        //register account
        group.MapPost("/register", async (HttpContext context, UserManager<AppUser> userManager, [FromForm] string fullname, [FromForm] string email, [FromForm] string password, [FromForm] string username, [FromForm] IFormFile? profileImage) => {
            var userFromDb = await userManager.FindByEmailAsync(email);
            if(userFromDb is not null){
                return Results.BadRequest(Response<string>.Failure("User is alreay exist."));
            }

            if(profileImage is null){
                return Results.BadRequest(Response<string>.Failure("Profile image is required."));
            }

            var picture = await FileUpload.UpLoad(profileImage);

            picture = $"{context.Request.Scheme}://{context.Request.Host}/uploads/{picture}";

            var user = new AppUser{
                Email = email,
                FullName = fullname,
                UserName = username,
                ProfileImage = picture
            };
            var result = await userManager.CreateAsync(user, password);

            if(!result.Succeeded){
                return Results.BadRequest(Response<string>.Failure(result.Errors.Select(x => x.Description).FirstOrDefault()!));
            }
            return Results.Ok(Response<string>.Success("","User created successfully."));
        }).DisableAntiforgery();
        
        //login account
        group.MapPost("/login", async (UserManager<AppUser> userManager, TokenService tokenService, LoginDto loginDto) => {
            if(loginDto is null){
                return Results.BadRequest(Response<string>.Failure("Invalid login details."));
            }

            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if(user is null){
                return Results.BadRequest(Response<string>.Failure("Usre not found"));
            }

            var result = await userManager.CheckPasswordAsync(user, loginDto.password);
            if(!result){
                return Results.BadRequest(Response<string>.Failure("Invalid password"));
            }

            var token = tokenService.GenerateToken(user.Id, user.UserName!);
            return Results.Ok(Response<string>.Success(token, "Login successfully."));
        });
        
        group.MapGet("/me", async (HttpContext context, UserManager<AppUser> userManager) => {
            var currentLoggedInUserId = context.User.GetUserId();

            var currentLoggedInUser = await userManager.Users.Where(x => x.Id == currentLoggedInUserId.ToString()).Select(u => new UserResponseDto{
                Id = u.Id,
                FullName = u.FullName,
                UserName = u.UserName,
                Email = u.UserName,
                ProfileImage = u.ProfileImage
            }).FirstOrDefaultAsync();
            if(currentLoggedInUser is null){
                return Results.NotFound(Response<string>.Failure("User not found!"));
            }
            return Results.Ok(Response<UserResponseDto>.Success(currentLoggedInUser, "User fetched successfully."));
        }).RequireAuthorization();

        return group;
    }
}
