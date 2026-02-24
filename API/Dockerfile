# ── Stage 1: build/publish ─────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Restore dependencies (layer-cached until csproj files change)
COPY ["Api/Api.csproj",                                       "Api/"]
COPY ["Domain/Domain.csproj",                                 "Domain/"]
COPY ["Commerce.Application/Commerce.Application.csproj",     "Commerce.Application/"]
COPY ["Commerce.Infrastructure/Commerce.Infrastructure.csproj","Commerce.Infrastructure/"]

RUN dotnet restore "Api/Api.csproj" --verbosity quiet

# Copy source and publish
COPY . .
RUN dotnet publish "Api/Api.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Stage 2: runtime ───────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

# Non-root user (already exists in aspnet:9.0 base image)
USER app

COPY --from=build /app/publish .

# Port the app listens on (read by Program.cs via ASPNETCORE_URLS)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Api.dll"]
