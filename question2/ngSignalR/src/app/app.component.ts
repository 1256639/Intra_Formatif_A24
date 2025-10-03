import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor(){
    this.connect();
  }

  connect() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5282/hubs/pizza')
      .build();

    // Config gestionnaires d'événements
    this.hubConnection.on("UpdateNbUsers", (nbUsers: number) => {
      this.nbUsers = nbUsers;
    });

    this.hubConnection.on("UpdateMoney", (money: number) => {
      this.money = money;
    });

    this.hubConnection.on("UpdateNbPizzasAndMoney", (nbPizzas: number, money: number) => {
      this.nbPizzas = nbPizzas;
      this.money = money;
    });

    this.hubConnection.on("UpdatePizzaPrice", (pizzaPrice: number) => {
      this.pizzaPrice = pizzaPrice;
    });
    
    this.hubConnection.start()
      .then(() => {
        this.isConnected = true;
        console.log('Connection started');
      })
      .catch(err => {
        console.log('Error: ' + err);
      });

  }

  selectChoice(selectedChoice:number) {
    this.selectedChoice = selectedChoice;
    this.hubConnection?.invoke("SelectChoice", selectedChoice);
  }

  unselectChoice() {
    if (this.selectedChoice >= 0) {
      this.hubConnection?.invoke("UnselectChoice", this.selectedChoice);
      this.selectedChoice = -1;
    }
  }

  addMoney() {
    this.hubConnection?.invoke("AddMoney", this.selectedChoice);
  }

  buyPizza() {
    this.hubConnection?.invoke("BuyPizza", this.selectedChoice);
  }
}
