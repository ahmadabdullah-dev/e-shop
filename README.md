# E Shop
E-commerce app with React frontend and ASP.NET Core backend. Users can browse products, manage a basket, place orders, and track status. Admins manage products and orders.

## Tech Stack
- **WEB:** React, TypeScript, TanStack Query, Axios, MUI, React Router
- **API:** ASP.NET Web API, C#
- **Auth:** ASP.NET Identity, Cookie-based Authentication, Role-based Authorization
- **ORM:** Entity Framework, Code First, BaseEntity
## Features
 
### Backend
 
- EmailService
  - SendEmailAsync
  - SendCodeAsync
- DataSeeder
  - Seed
  - SeedRoles
  - SeedUsers
- RateLimiter
  - authLimiter
  - notificationLimiter
- CORS
  - AllowWeb policy
- AuthService
  - LoginAsync
  - RegisterAsync
  - LogoutAsync
  - ConfirmEmailAsync
  - ResendEmailConfirmationCodeAsync
  - ForgetPasswordAsync
  - ResetPasswordAsync
- FileService
  - UploadImage
  - UploadRawFile
  - DeleteFile
- ProductService
  - AddProductAsync
  - GetAllProductsAsync
  - GetProductByIdAsync
  - UpdateProductAsync
  - DeleteProductAsync
  - IsProductExistsByIdAsync
  - GetPricesByIdsAsync
- OrderService
  - CreateOrderAsync
  - GetAllOrdersAsync
  - GetCurrentUserOrdersAsync
  - CancelOrderAsync
  - ShipOrderAsync
  - ProcessOrderAsync
  - DeliverOrderAsync
  - PendingOrderAsync
  - GetOrderDetailsAsync
- UserService
  - GetCurrentUserAsync
  - UpdateCurrentUserAsync
  - RequestUpdateCurrentEmailAsync
  - UpdateCurrentEmailAsync
  - ResendUpdateCurrentEmailConfirmationCodeAsync
  - UpdateCurrentUserNameAsync
  - DeleteCurrentUserAsync
- Repository<T>
  - GetByIdAsync
  - GetAllAsync
  - AddAsync
  - Update
  - Remove
  - SaveChangesAsync
- ProductRepository
  - IsProductExistsByIdAsync
  - GetPricesByIdsAsync
- OrderRepository
  - GetAllAsync
  - GetUserOrdersByUserIdAsync
  - IsOrderExistsByIdAsync
  - GetByIdAsync
- UserRepository
- ASP.NET Identity
  - SignInManager
  - UserManager
  - RoleManager
- ApplicationDbContext
- Scalar API documentation
- Helpers
  - ServiceHelper
  - PagedList
  - PaginationParams
  - Result<T>
- Attributes
  - ConfirmedEmailAttribute
  - SkipConfirmedEmailAttribute
- BaseApiController
  - HandleResult
 
### Frontend
 
- AuthForms
  - LoginForm
  - RegisterForm
  - ForgetPasswordForm
  - ResetPasswordForm
  - ConfirmEmailForm
- Pages
  - LandingPage
  - ProductsDashboard
  - Product
  - MyProfile
  - UserSettings
  - CurrentBasket
  - CreateOrder
  - CurrentUserOrders
  - OrderDetails
  - UpdateProduct
  - AddProductForm
  - AdminDashboard
  - ErrorPage
  - NotFound
- Layout
  - App
  - Header
  - Footer
  - TemporaryDrawer
  - AppLogoWithName
- Guards
  - RequireAuth
  - RequireConfirmedEmail
  - RequireAdminRole
- AuthHooks
  - useLoginUser
  - useRegisterUser
  - useLogout
  - useConfirmEmailAsync
  - useResendEmailConfirmationCodeAsync
  - useForgetPasswordAsync
  - useResetPasswordAsync
- ProductHooks
  - useGetAllProducts
  - useGetProductById
  - useGetProductsByIds
  - useAddProduct
  - useUpdateProduct
  - useDeleteProduct
- OrderHooks
  - useCreateOrder
  - useGetCurrentUserOrders
  - useGetAllOrders
  - useGetOrderById
  - useCancelOrder
  - useShipOrder
  - useProcessOrder
  - useDeliverOrder
  - usePendingOrder
- UserHooks
  - useCurrentUser
  - useUpdateCurrentUser
  - useRequestUpdateCurrentEmail
  - useUpdateCurrentEmail
  - useResendCurrentEmailConfirmationCode
  - useUpdateCurrentUserName
- BasketHook
  - useBasket
  - addToBasket
  - setQuantity
  - removeFromBasket
  - getQuantity
  - clearBasket
- API Layer
  - Axios agent
  - Response interceptor
- Config
  - MUI dark theme
 

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

