import { useState, useEffect, useRef } from 'react';

export const useRealtimeData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = () => {
    try {
      setStatus('connecting');
      // Simulation of WebSocket for demo purposes since we don't have a real WS server
      // In production: ws.current = new WebSocket(endpoint);
      
      setTimeout(() => {
        setStatus('connected');
      }, 1000);

      // Mock data stream
      const interval = setInterval(() => {
        const mockData = {
          timestamp: new Date().toISOString(),
          value: Math.random() * 100,
          ...options.mockDataGenerator?.()
        };
        setData(mockData);
      }, options.interval || 2000);

      ws.current = {
        close: () => clearInterval(interval),
        send: (msg) => console.log("Sent:", msg)
      };

    } catch (err) {
      setError(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [endpoint]);

  return { data, status, error };
};