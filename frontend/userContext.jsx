import { createContext, useState } from "react";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        isLoginOpen,
        setIsLoginOpen,
        isRegisterOpen,
        setIsRegisterOpen,
        handleLoginSuccess,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
