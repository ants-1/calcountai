import React, { createContext, useState, ReactNode } from "react";

interface UserContextType {
  userData: any;
  updateUserData: (data: any) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);

  const updateUserData = (data: any) => {
    setUserData(data);
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};


