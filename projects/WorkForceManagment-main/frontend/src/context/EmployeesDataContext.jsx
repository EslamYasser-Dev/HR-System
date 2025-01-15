// EmployeesContext.js
import { createContext, useContext, useState } from "react";

const EmployeesContext = createContext();

// eslint-disable-next-line react/prop-types
export const EmployeesProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contextValue = {
    searchTerm,
    setSearchTerm,
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
  };

  return <EmployeesContext.Provider value={contextValue}>{children}</EmployeesContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployeesContext = () => {
  return useContext(EmployeesContext);
};
