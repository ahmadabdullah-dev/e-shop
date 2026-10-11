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

## How to Run

### 1. Configure `appsettings.json`

Update the configuration in your API project's `appsettings.json` file.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "EmailConfiguration": {
    "From": "",
    "SmtpServer": "smtp.gmail.com",
    "Port": 465,
    "UserName": "",
    "Password": "",
    "EnableSsl": true
  },
 "CloudinaryConfigurations": {
   "CloudName": "",
   "ApiKey": "",
   "ApiSecret": ""
 },
  "AllowedHosts": "*"
}
 ```

### 2. Apply Database Migrations

Run the following commands from the **solution root directory**.

**Add a migration** (only if no migrations exist):

```powershell
dotnet ef migrations add Mig_1 --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

**Update the database:**

```powershell
dotnet ef database update --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

### 3. Run the API

Run the API project using Visual Studio or the .NET CLI.

### 4. Install Frontend Dependencies

Navigate to the `WEB` directory and install the dependencies:

```bash
cd WEB
npm install
```

### 5. Run the Frontend

Start the development server:

```bash
npm run dev
```

The frontend will be available at **https://localhost:3000**.

