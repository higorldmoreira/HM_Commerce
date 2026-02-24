using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using Api.Options;
using Api.Services;
using Api.Services.Reports;
using Commerce.Application.Interfaces;
using Commerce.Infrastructure.Services.Auth;
using Commerce.Infrastructure.Services.Commercial;
using Commerce.Infrastructure.Services.Combo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddScoped<ICommercialService, CommercialService>();
            services.AddScoped<IComboService, ComboService>();
            services.AddScoped<ITokenService, TokenServiceAdapter>();

            // Configuração do Metabase a partir do appsettings.json
            services.Configure<MetabaseOptions>(Configuration.GetSection(MetabaseOptions.SectionName));
            
            // Configurar HttpClient com timeout adequado e retry policy
            services.AddHttpClient<IMetabaseApiService, MetabaseApiService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(60); // Aumentar timeout para 60 segundos
            })
            .ConfigurePrimaryHttpMessageHandler(() =>
            {
                var handler = new HttpClientHandler
                {
                    UseDefaultCredentials = false,
                    AllowAutoRedirect = true,
                    MaxAutomaticRedirections = 5
                };

                // Configurar proxy se necessário
                var useProxy = Configuration.GetValue<bool>("Metabase:UseProxy");
                if (useProxy)
                {
                    var proxyUrl = Configuration.GetValue<string>("Metabase:ProxyUrl");
                    if (!string.IsNullOrEmpty(proxyUrl))
                    {
                        handler.Proxy = new System.Net.WebProxy(proxyUrl);
                        handler.UseProxy = true;
                    }
                }

                return handler;
            });
            
            services.AddScoped<IMetabaseEmbedService, MetabaseEmbedService>();

            // Serviços de Relatórios
            services.AddScoped<IPriceManagementReportService, PriceManagementReportService>();

            services.AddCors(options =>
            {
                options.AddPolicy("DevelopmentCors", builder =>
                {
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });

                options.AddPolicy("DefaultCors", builder =>
                {
                    builder
                        .WithOrigins(
                            "http://localhost:50556",
                            "http://localhost:58557",
                            "http://localhost:57533"
                            // Adicione as origens do ambiente de produção via configuração ou variável de ambiente
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });


            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Commerce API", Version = "v1" });
                c.CustomSchemaIds(x => x.FullName);
                c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "Api.xml"), true);
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, "Domain.xml"), true);
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization header \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                      new OpenApiSecurityScheme
                      {
                        Reference = new OpenApiReference
                        {
                          Type = ReferenceType.SecurityScheme,
                          Id = "Bearer"
                        }
                       },
                       new string[] { }
                    }
                });
            });

            services.AddControllersWithViews();

            services.AddMvc();

            services.AddSingleton(Configuration);

            var key = Encoding.ASCII.GetBytes(Configuration.GetValue<string>("HashCode"));
            IdentityModelEventSource.ShowPII = true;
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Commerce API");
                c.RoutePrefix = string.Empty;
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseRouting();

            // CORS deve vir ANTES de Authentication e Authorization
            app.UseCors(env.IsDevelopment() ? "DevelopmentCors" : "DefaultCors");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }
    }
}
