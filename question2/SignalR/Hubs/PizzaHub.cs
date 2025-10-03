using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
            // Incrémente le nombre d'utilisateurs
            _pizzaManager.AddUser();

            // Mettre à jour tous les clients connectés
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Décrémente le nombre d'utilisateurs
            _pizzaManager.RemoveUser();

            // Mettre à jour tous les clients connectés
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            // Rejoindre le groupe correspondant au choix de pizza
            string groupName = _pizzaManager.GetGroupName(choice);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Envoyer le prix de la pizza choisie
            await Clients.Caller.SendAsync("UpdatePizzaPrice", _pizzaManager.PIZZA_PRICES[(int)choice]);

            // Mettre à jour le nombre de pizzas et l'argent disponible
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.NbPizzas[(int)choice], _pizzaManager.Money[(int)choice]);

        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            // Quitter le groupe correspondant au choix de pizza
            string groupName = _pizzaManager.GetGroupName(choice);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            // Ajouter de l'argent pour le type de pizza choisi
            _pizzaManager.IncreaseMoney(choice);

            // Modifier le groupe de la mise à jour de l'argent
            string groupName = _pizzaManager.GetGroupName(choice);
            await Clients.Group(groupName).SendAsync("UpdateMoney", _pizzaManager.Money[(int)choice]);
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            // Acheter une pizza
            _pizzaManager.BuyPizza(choice);

            // Mettre à jour le groupe avec le nouveau nombre de pizzas et l'argent restant
            string groupName = _pizzaManager.GetGroupName(choice);

            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.NbPizzas[(int)choice], _pizzaManager.Money[(int)choice]);
        }
    }
}
