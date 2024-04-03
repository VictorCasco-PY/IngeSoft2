import React, {useEffect} from 'react';
import { useNavigate , Outlet } from 'react-router-dom';
import { useCurrentUser } from '../context/UserContext';
import UserStorage from './UserStorage';

const ProtectedRoute = ({ roles = ["ADMIN", "CLIENTE", "ENTRENADOR", "CAJERO"] }) => {
  const { rol, userId } = useCurrentUser();
  const isAuthenticated = localStorage.getItem("user") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    // la razon por la cual utilizo UserStorage y no context es porque el context no se actualiza antes de que se ejecute este useEffect
    const userRol = UserStorage.getUserRol();
    if (!isAuthenticated || !roles.includes(userRol)) {
      //console.log("No estas permitido")
      navigate("/");
    }
    
  }, [isAuthenticated]);

  //Los roles por el momento son strings, tengo que pedir a backend que me mande un enum
  
  return (
    <>
      {(isAuthenticated && roles.includes(rol)) && (<Outlet />)};
    </>
  );
};

export default ProtectedRoute;
