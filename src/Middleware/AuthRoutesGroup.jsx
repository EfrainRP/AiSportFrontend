// src/Middleware/AuthRoutesGroup.js
import React from 'react';
import { Route } from 'react-router-dom';
import AuthRoute from 'AuthRoute';

const AuthRoutesGroup = ({ routes }) => {
  return (
    <>
      {routes.map((route, index) => (
        <AuthRoute key={index} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default AuthRoutesGroup;
