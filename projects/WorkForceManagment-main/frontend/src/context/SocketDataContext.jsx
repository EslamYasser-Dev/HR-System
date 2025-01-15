// SocketDataContext.js
import { createContext, useContext } from 'react';
import useSocketData from '../hooks/useSocketData';


const { VITE_NODE_SOCKET } = import.meta.env;
const SocketDataContext = createContext();

// eslint-disable-next-line react/prop-types
export const SocketDataProvider = ({ children }) => {
  const { data, loading, error, connected } = useSocketData(VITE_NODE_SOCKET);

  const contextValues = {
    data,
    loading,
    error,
    connected,
  };

  return (
    <SocketDataContext.Provider value={contextValues}>
      {children}
    </SocketDataContext.Provider>
  );
};

export const useSocketDataContext = () => {
  return useContext(SocketDataContext);
};
