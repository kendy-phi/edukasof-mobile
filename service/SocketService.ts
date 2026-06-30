import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(url: string) {
    console.log(
      '[SOCKET] connect() called with:',
      url,
    );

    /**
     * Si un socket existe déjà,
     * on le réutilise au lieu d'en créer un autre.
     */
    if (this.socket) {
      console.log(
        '[SOCKET] existing socket found',
        {
          id: this.socket.id,
          connected: this.socket.connected,
        },
      );

      if (!this.socket.connected) {
        console.log(
          '[SOCKET] socket exists but is not connected yet. Calling connect().',
        );
        this.socket.connect();
      }

      return this.socket;
    }

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      path: '/socket.io',
    });

    console.log('[SOCKET] socket instance created');

    /**
     * IMPORTANT:
     * les vrais événements natifs côté client sont
     * "connect" et "disconnect"
     */
    this.socket.on('connect', () => {
      console.log(
        '[SOCKET] connected:',
        this.socket?.id,
      );
    });

    this.socket.on('disconnect', reason => {
      console.log(
        '[SOCKET] disconnected:',
        reason,
      );
    });

    this.socket.on('connect_error', error => {
      console.log(
        '[SOCKET] connection error:',
        error.message,
      );
    });

    this.socket.onAny((event, ...args) => {
      console.log(
        '[SOCKET EVENT]',
        event,
        JSON.stringify(args),
      );
    });

    return this.socket;
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    console.log('[SOCKET] disconnect()');

    this.socket.disconnect();
    this.socket = null;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }

  emit(event: string, payload?: any) {
    if (!this.socket) {
      console.warn(
        `[SOCKET] emit skipped - socket not initialized for event "${event}"`,
      );
      return;
    }

    console.log(
      '[SOCKET] emit =>',
      event,
      payload,
    );

    this.socket.emit(event, payload);
  }

  on(
    event: string,
    callback: (...args: any[]) => void,
  ) {
    if (!this.socket) {
      console.warn(
        `[SOCKET] on("${event}") skipped - socket not initialized`,
      );
      return;
    }

    console.log(
      '[SOCKET] register listener =>',
      event,
    );

    this.socket.on(event, callback);
  }

  off(
    event: string,
    callback?: (...args: any[]) => void,
  ) {
    if (!this.socket) {
      return;
    }

    console.log(
      '[SOCKET] remove listener =>',
      event,
    );

    if (callback) {
      this.socket.off(event, callback);
      return;
    }

    this.socket.off(event);
  }
}

export default new SocketService();