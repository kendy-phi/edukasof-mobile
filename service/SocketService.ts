import { io, Socket } from 'socket.io-client';

class SocketService{

    private socket: Socket | null = null;

    connect(url: string){
        console.log(`url to connect with socket: ${url}`)
        console.log(this.socket);
        
        if(this.socket?.connected)
            return this.socket;

        this.socket = io(url, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000
        });

        console.log(this.socket)

        this.socket.on('connected', () =>{
            console.log(`[SOCKET] connected: ${this.socket?.id}`);
        });
        
        this.socket.on('disconnected', (reason) =>{
            console.log(`[SOCKET] disconnected: `, reason);
        });

        this.socket.on('connect_error', error =>{
            console.log(`[SOCKET] connection error`, error.message);
        });

        this.socket.onAny((event, ...args) => {
            console.log(
            '[SOCKET EVENT]',
            event,
            args,
            );
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

    off(event: string, callback?: (...args: any[]) => void){
        if(!this.socket) return;
        if(callback){
            this.socket.off(event, callback);
            return;
        }
        this.socket.off(event);
    }
}

export default new SocketService();