import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5078/notificationHub', {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async startConnection() {
        try {
            await this.connection.start();
            await this.connection.invoke('JoinAdminGroup');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('✅ SignalR Connected Successfully');
            
            // Set up connection event handlers
            this.connection.onreconnecting(() => {
                console.log('🔄 SignalR Reconnecting...');
                this.isConnected = false;
            });

            this.connection.onreconnected(() => {
                console.log('✅ SignalR Reconnected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                // Rejoin admin group after reconnection
                this.connection.invoke('JoinAdminGroup');
            });

            this.connection.onclose(() => {
                console.log('❌ SignalR Connection Closed');
                this.isConnected = false;
            });

        } catch (err) {
            console.error('❌ SignalR Connection Error: ', err);
            this.isConnected = false;
            
            // Retry connection
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`🔄 Retrying connection... Attempt ${this.reconnectAttempts}`);
                setTimeout(() => this.startConnection(), 2000);
            }
        }
    }

    async stopConnection() {
        try {
            await this.connection.invoke('LeaveAdminGroup');
            await this.connection.stop();
            this.isConnected = false;
            console.log('🔌 SignalR Connection Stopped');
        } catch (err) {
            console.error('❌ Error stopping SignalR connection: ', err);
        }
    }

    // Product notifications
    onProductNotification(callback) {
        this.connection.on('ReceiveProductNotification', (message) => {
            console.log('📦 Product Notification:', message);
            callback(message);
        });
    }

    // Order notifications
    onOrderNotification(callback) {
        this.connection.on('ReceiveOrderNotification', (message) => {
            console.log('🛒 Order Notification:', message);
            callback(message);
        });
    }

    // General notifications
    onGeneralNotification(callback) {
        this.connection.on('ReceiveGeneralNotification', (message, type) => {
            console.log('📢 General Notification:', message, type);
            callback(message, type);
        });
    }

    // Get connection status
    getConnectionStatus() {
        return this.isConnected;
    }

    // Manual reconnect
    async reconnect() {
        if (!this.isConnected) {
            await this.startConnection();
        }
    }
}

export default new SignalRService();