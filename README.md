# E Shop

## Tech Stack
- **WEB:** React, TypeScript, TanStack Query, Axios, MUI, React Router
- **API:** ASP.NET Web API, C#
- **Auth:** ASP.NET Identity, Cookie-based Authentication, Role-based Authorization
- **ORM:** Entity Framework, Code First, BaseEntity

## Features 
- EmailService
- DataSeeder
- RateLimiter(Auth)
- Cors
- AuthService (Login, Logout, Register, ConfirmEmail, ResendEmailConfirmationCode, ForgetPassword, UpdatePassword)
- FileService (UploadImage, UploadRawFile, DeleteFile)
- Productervice(AddOroduct, GetAllProducts, GetPRoductById, UpdateProduct)
- UserService(GetCurrentUser, UpdateCurrentUser, RequestUpdateCurrentEmail, UpdateCurrentEmail, ResendUpdateCurrentEmailConfirmationCode, UpdateCurrentUserName, DeleteCurrentUser)
- OrderService
- BaseketService

## Architechure(Layered On API)
- **WEB:** UI Components, Hooks, Routes, Call APIs
- **API:** Controllers, BaseApiController, CORS, UserSecrets, RateLimiter, GlobalUsings, AppCookie Configuration, Policies, DI per layer
- **Application:** Services, Interfaces, Dtos, Result<T> Pattern, Global Usings, IOptions for Configurations, DI per layer, GlobalUsings
- **Infrastructure:** Repositories, Interfaces, BaseRepository, PagedList, DataSeeder, AppDbContext, DI per layer, GlobalUsings
- **Domain:** BaseEntity, Entities, GlobalUsings

## Run Database Migrations

Run these commands from the **solution root**.

**Add a migration:**

```powershell
dotnet ef migrations add Mig_1 --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

**Apply migrations:**

```powershell
dotnet ef database update --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```
