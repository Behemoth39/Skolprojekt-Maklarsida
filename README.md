# Grupp 3 - Mäklarsida


1. [ 🏡 Projektidé ](#ide)
2. [ 🤼‍♂️ Roller ](#roles)
3. [ ⚙️ Systemet ](#system)
4. [ 🚧 Konfigurera utvecklingsmiljön och köra applikationen ](#config)
5. [ 🐋 Docker ](#docker)
6. [ ☁️ En jämförelse av tre olika "stacks" med molntjänster i Azure ](#drift)
7. [ 🌍 Drifrsätta appen i en Azure Virtual Machine ](#driftsätta)

<br>
<br>

<a name="ide"></a>

## 🏡💵 1. Projektidé

#### Beskrivning

En mäklarsida där man kan se hus till salu, prishistorik och nyheter från firman.

#### Tekniker

- Back-end: **.NET 7 WebAPI**
- Front-end: **React**
- **SQLite** som databas
- **Entity Framework Core** för att prata med databas
- Autentisering med **JWT**
- **Redis** för caching
- **SignalR** för realtidskommunikation

#### Realtidskommunikation

Som en besökare ska man kunna chatta med en mäklare.

#### Resurser

- User
- News
- Houses

<br>
<br>

<a name="roles"></a>

## 🤼‍♂️ 2. Roller

Denna applikation har tre olika typer av användare.

- Gäst
- Användare
- Administratör

#### Gäst

Detta avser en vanlig besökare på sidan som inte har loggat in.  
De kan se hus, nyheter, säljhistorik samt gå med i gruppchatten med egenvalt namn.

#### Användare / Mäklare utan ansvar

En inloggad person som endast har tillgång till chatten som mäklare.

- Chatta med gäster markerad som "Mäklare"

#### Administratör / Mäklare

- Skapa/redigera/radera nyheter.  
- Skapa/redigera/radera sina egna hus objekt.
- Skapa nya användare.
- Chatta med gäster markerad som "Mäklare"

<br>
<br>

<a name="system"></a>

## ⚙️ 3. Systemet

.NET 7 MVC  
https://dotnet.microsoft.com/en-us/download/visual-studio-sdks

    .NET 7.0.11 - September 12, 2023
    Lägsta SDK version: 7.0.401

React 18  
https://react.dev/reference/react

    React 18.2.0

<br>
<br>

<a name="config"></a>

## 🚧 4. Konfigurera utvecklingsmiljön och köra applikationen

#### Back-end

1. Ladda ner och starta en lokal Redis server.  
    Appen är inställd på att lyssna efter Redis på port `5002`. Om du Redis server ligger på en annan port kan du ändra `Redis:Configuration` i `appsettings.Development.json`.  
    ⭐ **Docker** - Kör kommandot `docker run --name my-redis -p 5002:6379 -d redis:7.2`  
    **Windows** - https://redis.io/docs/install/install-redis/install-redis-on-windows/  
    **Mac/Linux** - https://redis.io/download/#redis-downloads  
2. Ladda ner och installera den senaste versionen av **.NET 7** SDK från [länk](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks).  
3. Installera EF Core CLI med: `dotnet tool install --global dotnet-ef`.  
4. Navigera till mappen `back-end/WebAPI` och kör följande kommandon:  
   - `dotnet ef database update`
   - `dotnet run`

För omstarter räcker det med att köra `dotnet run` i `back-end/WebAPI`-mappen.

<hr>

#### Front-end

1. Ladda ner och installera Node.js v20 från [länk](https://nodejs.dev/en/download/).  
2. Navigera till mappen `front-end` och kör kommandot `npm install`.  
3. Fortfarande i samma mapp, kör kommandot `npm run start`.

För omstarter räcker det med att köra `npm run start` i `front-end`-mappen.

<hr>

#### Logga in på sidan

Om du vill testa som <ins>admin</ins> kan du använda:  
- Username: `testadmin`  
- Password: `testadmin`

Om du vill testa som <ins>user</ins> kan du använda:  
- Username: `testuser`  
- Password: `testuser`


<br>
<br>

<a name="docker"></a>

## 🐋 5. Docker

**Kör applikationen i produktionsläge inuti en Docker-container.**
När du kör kommandot nedan i denna mappen så kommer docker först att bygga react appen och placera build filerna i mappen `back-end/WebAPI/wwwroot` så att .NET applikatioen kan serva react filerna tillsammans med sina endpoints.

    docker-compose up

Appen är nu nårbar på port `6020`  
http://localhost:6020

Under utveckling så kan man köra kommandot nedan för att stänga ner och radera container med tillhörande images direkt:

    docker-compose down --rmi all

<br>
<br>

<a name="drift"></a>

## ☁️ 6. En jämförelse av tre olika "stacks" med molntjänster i Azure

En sak som alla "stacks" nedan har gemensamt, men som jag inte har inkluderat i texten, är att Azure också erbjuder en mängd säkerhetsfunktioner som är aktiverade som standard (t.ex. TLS/SSL osv.). Därför är det i slutändan extremt viktigt att din applikation/kod är uppdaterad och är upp-to-date med LTS/STS samt inte innehåller några sårbarheter som kan utnyttjas. Så glöm inte att regelbundet testa din kod.

En annan viktig sak är att hålla din back-end kod 'stateless' så att den kan skalas horisontellt.

<hr>

#### 🖥️ "Azure App Service" stack
- Azure Webb App Service - *(för .net back-end)*
- Azure Static Web App - *(för react front-end)*
- Azure SQL Database
- Azure Cache for Redis
- Azure Key Vault - *(för nycklar ex. "JwtSecret")*

Azure App Service är en fullständigt hanterad tjänst som gör det enkelt att driftsätta och hantera webbapplikationer och API:er. Det ger en rad tjänster som gör att du kan fokusera på att utveckla din kod snarare än att hantera infrastrukturen.

**Fördelar**

- **Enkel integrering:** Alla dessa tjänster är enkla att integrera med varandra och ger en sömlös upplevelse när du bygger och driftsätter din applikation.
- **Minimalt underhåll:** Eftersom de flesta av dessa tjänster är fullständigt hanterade av Azure, minskar behovet av infrastruktur- och underhållsarbete avsevärt.
- **Skalbarhet:** Du kan enkelt skalera resurserna uppåt eller nedåt beroende på trafik och belastning.
- **Inbyggd säkerhet:** Azure-tjänsterna erbjuder inbyggd säkerhet och övervakning för att skydda din applikation.
- **Global distribution:** Med Azure Web App Service och Azure Static Web App kan du distribuera din applikation globalt för att minska latens/fördröjning och förbättra prestanda.

**Nackelar**

- **Kostnader:** Användningen av dessa tjänster kan medföra kostnader, och det är viktigt att övervaka och hantera din användning för att undvika onödiga kostnade
- **Komplexitet:** Kombinationen av flera tjänster kan öka komplexiteten för att administrera och övervaka din applikation, särskilt om den är stor och skalflexibel.

<hr>

#### 🫙 "Azure Container Instance" stack
- Azure Container Registry
- Azure Container Instance

Denna stack fokuserar på containerbaserad driftsättning och hantering med hjälp av Azure Container Registry och Azure Container Instances.

**Fördelar**
- **Serverlös:** Inga virtuella maskiner att hantera; du betalar endast för den tid dina containrar är aktiva.
- **Enkel driftsättning:** Lätt att driftsätta och skala upp containrar.
- **Flexibel och portabel:** Docker-containrar är portabla och kan köras nästan överallt.
- **Skalbarhet:** ACI kan snabbt skalas upp eller ned beroende på arbetsbelastningen.

**Nackelar**
- **Begränsad funktionalitet:** Azure Container Instances är bäst lämpade för enkla applikationer och är mindre lämpliga för mer komplexa arkitekturer.

<hr>

#### 📟 "Azure Virtual Machine"
- Azure Virtual Machine

Azure Virtual Machines ger dig fullständig kontroll över en virtuell maskin som du kan anpassa och konfigurera efter dina behov.

**Fördelar**
- **Fullständig kontroll:** Du kan installera och konfigurera allt du behöver på den virtuella maskinen.
- **Skalbarhet:** Du kan skala upp eller ner efter behov.

**Nackelar**
- **Underhåll:** Du är ansvarig för att underhålla och uppdatera både virtuell maskin och dina applikationer.
- **Säkerhet:** Du måste själv säkerställa att din virtuella maskin är säker och uppdaterad.
- **Kostnader:** Kostnaderna kan variera beroende på maskintyp och användning.


<br>
<br>

<a name="driftsätta"></a>

## 🌍 7. Drifrsätta appen i en Azure Virtual Machine

1. Börja med att skapa ett Microsoft Azure konto på https://azure.microsoft.com/en-gb/

2. Logga sedan in Azure portalen på https://portal.azure.com/

3. Gå sedan till att skapa en resurs och sök efter "Virtual machine"

4. När du skapar resursen så ska du välja `Image: Linux (ubuntu 22.04)` och rekommenderad size: `Standard B1ms (1 vcpu, 2 GiB RAM, 4 GiB Storage)`  
Du bör även välja `Authentication type: Password` så att det är smidigt att logga in på masiknen via SSH.

5. När resursen är skapad så kan du börja med att öppna portar i **Networking** tabben.

        Source: Any
        Source port ranges: *
        Destination: Any
        Services: Custom
        Destination port ranges: 5000-5402
        Protocol: Any
        Action: Allow
        Priority: 360

6. Sedan kan du logga in på den virtuella maskinen via SSH i Powershell och installera Docker.  
Följ denna guiden för att installera docker: https://docs.docker.com/engine/install/ubuntu/

7. Överför sedan filerna till din VM:

        scp -r ./{{FOLDER}}/ username@123.123.123.123:/home/username


8. Sedan via SSH i din terminal så får du navigera till den överförda mappen och köra `docker-compose up -d`  
Nu kommer docker att skapa en image och stara en container för din app.  
Viktigt att porten som Docker exponerar är inkluderad i "port ranges" som du ställde in i steg 5.  
Därefter kan du använda adressen till din VM som står på Azure i resursens översikt och lägga till porten efter adressen 👍
