import React, { useState, useEffect, ReactNode, useContext, createContext } from "react";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';



const login = () => {
  window.location.href = "http://localhost:5100/auth/discord";
};

const logout = () => {
  window.location.href = "http://localhost:5100/auth/logout";
};

interface AuthButtonProps {
  onClick?: () => void; // The onClick prop is a function with no arguments and no return value.
  children: ReactNode;  // The children prop can be any valid React node (text, element, component, etc.)
}

interface AuthenticatedActionProps {
  isAdmin: boolean;     // isAdmin is a boolean indicating if the user is an admin
  logout: () => void;   // logout is a function that takes no arguments and returns nothing
}

const AuthButton: React.FC<AuthButtonProps> = ({ onClick, children }) => (
  <div className='mr-8'>
  <Button variant="outline" onClick={onClick}>
    {children}
  </Button>
  </div>
);

const AuthenticatedActions: React.FC<AuthenticatedActionProps> = ({ isAdmin, logout }) => (
  <div className='flex flex-row'>
    {isAdmin && (
      <AuthButton>
        <Link to='/admin'>Admin</Link>
      </AuthButton>
    )}
    <AuthButton onClick={logout}>Logout</AuthButton>
  </div>
);



const Authenticator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkStatus = async () => {
    try {
      const response = await fetch("http://localhost:5100/auth/status", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.loggedIn) {
        setIsAuthenticated(true);
        if (data.isAdmin) {
          setIsAdmin(true);
        }
      } else {
        setIsAuthenticated(false);
      }  
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
  <div className="ml-auto flex space-x-4">
      {isAuthenticated ? (
        <AuthenticatedActions isAdmin={isAdmin} logout={logout} />
      ) : (
        <AuthButton onClick={login}>Login</AuthButton>
      )}
    </div>
  );
};

export default Authenticator;
