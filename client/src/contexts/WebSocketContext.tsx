import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Alert } from '@shared/schema';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface WebSocketContextType {
  connected: boolean;
  lastMessage: WebSocketMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  lastMessage: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create WebSocket connection
    const host = window.location.host;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${wsProtocol}//${host}/api/ws`);

    // Connection opened
    ws.addEventListener('open', () => {
      setConnected(true);
      console.log('WebSocket connection established');
    });

    // Listen for messages
    ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setLastMessage(message);
        
        // Handle different message types
        if (message.type === 'ALERT_UPDATE') {
          // Invalidate alerts cache to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
          
          // Show toast notification for resolved alerts
          if (message.data && (message.data as Alert).status === 'resolved') {
            toast({
              title: 'Alert Resolved',
              description: `Alert has been marked as resolved`,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle errors
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    });

    // Handle disconnection
    ws.addEventListener('close', () => {
      setConnected(false);
      console.log('WebSocket connection closed');
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
      }, 5000);
    });

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [toast]);

  return (
    <WebSocketContext.Provider value={{ connected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};