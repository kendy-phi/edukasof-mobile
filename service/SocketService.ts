import { io, Socket } from 'socket.io-client';

class SocketService{

    private socket: Socket | null = null;

    connect(url: string){
        if(this.socket?.connected)
            return this.socket;

        this.socket = io(url, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000
        });

        this.socket.on('connected', () =>{
            console.log(`[socket] connected: ${this.socket?.id}`);
        });
        
        this.socket.on('disconnected', (reason) =>{
            console.log(`[socket] disconnected: `, reason);
        });

        this.socket.on('connect_error', error =>{
            console.error(`[SOCKET] connection error`, error.message);
        });

        return this.socket;
    }

    disconnect(){
        if(!this.socket) return;

        this.socket.disconnect();
        this.socket = null;
    }

    getSocket(){
        return this.socket;
    }

    isConnected(){
        return this.socket?.connected ?? false;
    }

    emit(event: string, payload?: any){
        if(!this.socket) return;

        this.socket.emit(event, payload);
        
    }

    on(event: string, callback: (...args: any[]) => void){
        if(!this.socket) return;

        this.socket.on(event, callback);
    }

    off(event: string, callback: (...args: any[]) => void){
        if(!this.socket) return;
        if(callback){
            this.socket.off(event, callback);
            return;
        }
        this.socket.off(event);
    }
}

export default new SocketService();