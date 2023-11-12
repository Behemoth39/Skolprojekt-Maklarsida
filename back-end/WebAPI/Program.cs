using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Data;
using WebAPI.Hubs;
using Interfaces;
using Repository;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

#region Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetSection("Redis:Configuration").Value;
    options.InstanceName = builder.Configuration.GetSection("Redis:InstanceName").Value;
});
#endregion

#region Authentication
var JwtSecret = builder.Configuration.GetSection("JwtSettings:JwtSecret").Value;
var JwtIssuer = builder.Configuration.GetSection("JwtSettings:JwtIssuer").Value;
var JwtAudience = builder.Configuration.GetSection("JwtSettings:JwtAudience").Value;
if (JwtSecret is null || JwtIssuer is null || JwtAudience is null) throw new Exception("JwtSettings is not set in appsettings.json.");

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = JwtIssuer,
        ValidateAudience = true,
        ValidAudience = JwtAudience,
        ValidateLifetime = true,

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret)),
    };
    o.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for our hub...
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/hub"))
            {
                // Read the token out of the query string
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
#endregion

#region Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Brokersite REST API",
        Description = "REST API to serve the Brokersite front-end application."
    });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description =
        "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    // Adds the locket icon to the swagger UI
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
#endregion

#region Database
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);
#endregion

#region CORS
builder.Services.AddCors(options => options.AddPolicy("corspolicy", policy =>
{
    var originsString = builder.Configuration.GetSection("Cors:AllowedOrigins") ?? throw new Exception("Cors:AllowedOrigins is not set in appsettings.json.");
    var origins = originsString.Value!.Split(';');
    policy.WithOrigins(origins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
}));
#endregion

#region dependency injection
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<NewsRepository>();
builder.Services.AddScoped<HouseRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
#endregion

var app = builder.Build();



#region SeedDatabase
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DatabaseContext>();
    await context.Database.MigrateAsync();

    await SeedData.Users(context, builder.Configuration);
    await SeedData.Houses(context, builder.Configuration);
    await SeedData.News(context, builder.Configuration);
}
catch (Exception ex)
{
    Console.WriteLine("---------------------");
    Console.WriteLine("Outer Message:");
    Console.WriteLine($"   {ex.Message}");
    Console.WriteLine("Inner Message:");
    Console.WriteLine($"   {ex.InnerException!.Message}");
    Console.WriteLine("---------------------");
    throw;
}
#endregion

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corspolicy");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html"); ;

app.MapHub<ChatHub>("/hub/chat");

app.Run();
