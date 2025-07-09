using NHibernate.Cfg;
using System.Text.Json.Serialization;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.Repository.Implemetantions;
using Venda.DOMAIN.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });

var tipo = typeof(ClienteService).Assembly;

var serviceTipo = tipo.GetTypes().Where(x => x.IsClass && !x.IsAbstract && x.Name.EndsWith("Service"));

foreach (var nome in serviceTipo)
{
    builder.Services.AddTransient(nome);

}

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("Default");

builder.Services.AddSingleton(c =>
{
    var config = new Configuration().Configure();
    config.DataBaseIntegration(
        x => x.ConnectionString = connectionString
    );
    return config.BuildSessionFactory();
});
builder.Services.AddTransient<IRepository, RepositoryContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseCors(
//    b => b.AllowAnyHeader()
//        .AllowAnyMethod()
//        .AllowAnyOrigin()
//    );
builder.Services.AddCors(options =>
    options.AddPolicy(name: "allowedOrigins",
        policy =>
        {
            policy.WithOrigins("http://104.131.110.118/")
                .WithMethods("GET", "POST","PUT","DELETE")
                .AllowAnyHeader();
        })
);


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
