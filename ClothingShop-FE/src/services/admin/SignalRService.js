import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5078/notificationHub')
            .build();
    }

    async startConnection() {
        try {
            await this.connection.start();
            await this.connection.invoke('JoinAdminGroup');
            console.log('SignalR Connected');
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
        }
    }

    onProductNotification(callback) {
        this.connection.on('ReceiveProductNotification', callback);
    }
}

export default new SignalRService();