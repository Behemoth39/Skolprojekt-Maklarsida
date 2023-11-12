using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebAPI.Hubs;

[AllowAnonymous]
[Authorize]
public class ChatHub : Hub
{
    private static int brokerCount = 0;
    private static int guestCount = 0;

    public async Task OnMessageReceived(string userId, string username, string message)
    {
        username = string.Concat(username[..1].ToUpper(), username.AsSpan(1));

        if (Context.User?.Identity?.IsAuthenticated ?? false)
        {
            // IS AUTHENTICATED
            await Clients.All.SendAsync("messageReceived", userId, username, message, true);
        }
        else
        {
            // NOT AUTHENTICATED
            await Clients.All.SendAsync("messageReceived", userId, username, message, false);
        }
    }

    public override async Task OnConnectedAsync()
    {
        if (Context.User?.Identity?.IsAuthenticated ?? false)
        {
            brokerCount++;
            await Clients.Others.SendAsync("messageReceived", "0", "Bot", $"En mäklare har anslutit till chatten. Det är nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
            await Clients.Caller.SendAsync("messageReceived", "0", "Bot", $"Välkommen till chatten! Det är just nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
        }
        else
        {
            guestCount++;
            await Clients.Others.SendAsync("messageReceived", "0", "Bot", $"En gäst har anslutit till chatten. Det är nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
            await Clients.Caller.SendAsync("messageReceived", "0", "Bot", $"Välkommen till chatten! Det är just nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
        }

        await Clients.All.SendAsync("brokersOnline", brokerCount);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.User?.Identity?.IsAuthenticated ?? false)
        {
            brokerCount--;
            await Clients.All.SendAsync("messageReceived", "0", "Bot", $"En mäklare har lämnat chatten. Det är nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
            await Clients.All.SendAsync("brokersOnline", brokerCount);
        }
        else
        {
            guestCount--;
            await Clients.All.SendAsync("messageReceived", "0", "Bot", $"En gäst har lämnat chatten. Det är nu {guestCount} {(guestCount == 1 ? "gäst" : "gäster")} och {brokerCount} mäklare anslutna.");
        }

        await base.OnDisconnectedAsync(exception);
    }
}
