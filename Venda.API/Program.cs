using NHibernate.Cfg;
using System.Text.Json.Serialization;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.Repository.Implemetantions;
using Venda.DOMAIN.Services;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// isso é para conseguir utilizar a biblioteca gratuita.
QuestPDF.Settings.License = LicenseType.Community;

// para conseguir puxar um json dentro de uma propriedade lista na classe
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler =  ReferenceHandler.IgnoreCycles;
    });

// AddTransient de todos os serviços que existir nos arquivos que terminam com Service
var tipo = typeof(ClienteService).Assembly;

var serviceTipo = tipo.GetTypes().Where(x => x.IsClass && !x.IsAbstract && x.Name.EndsWith("Service"));

foreach (var nome in serviceTipo)
{
    builder.Services.AddTransient(nome);

}

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

// definir corns
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsDeploy", policy =>
    {
        policy.WithOrigins("https://104.131.110.118")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .AllowAnyHeader();
    });

    options.AddPolicy("CorsLocal", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// isso é pra nao precisar ficar ajsutando o CORS toda hora que subir o repositorio na maquina virtual -> ASPNETCORE_ENVIRONMENT "Production"
// mudar no LanchSettings.json a variavel
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("CorsLocal");
}
else
{
    app.UseCors("CorsDeploy");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
