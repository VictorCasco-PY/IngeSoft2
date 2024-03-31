import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../context/UserContext';

const ProtectedRoute = ({ component: Component, roles = ["ADMIN", "CLIENTE", "ENTRENADOR", "CAJERO"], ...rest }) => {

  const navigate = useNavigate();
  const { rol, userId } = useCurrentUser();
  const isAuthenticated = userId !== null;

  //Los roles por el momento son strings, tengo que pedir a backend que me mande un enum

  return (
    <Route
      {...rest}
      render={(props) =>
        (isAuthenticated && roles.includes(rol)) ? (
          <Component {...props} />
        ) : (
          navigate("/")
        )
      }
    />
  );
};

export default ProtectedRoute;
