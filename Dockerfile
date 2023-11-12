# Stage 1: Build the React app
FROM node:20 as react-build
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./front-end/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY ./front-end ./

# Build the React app
RUN npm run build



# Stage 2: Build the .NET app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS dotnet-build
WORKDIR /app

# Copy the .NET app source code
COPY ./back-end/ ./

# Move into the WebAPI folder
WORKDIR /app/WebAPI

# Copy the build files from the React app into the wwwroot folder
COPY --from=react-build /app/build ./wwwroot/

# Restore as distinct layers
RUN dotnet restore

# Build the .NET app
RUN dotnet publish -c Release -o /app/publish



# Create a final image without build dependencies
FROM mcr.microsoft.com/dotnet/aspnet:7.0 as final
WORKDIR /app
COPY --from=dotnet-build /app/publish .

# Expose the port your WebAPI will run on
EXPOSE 80

# Start the .NET app
ENTRYPOINT ["dotnet", "WebAPI.dll"]
