import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  // getting the current user
  const { currentUser } = useSelector((state) => state.user);

  // make a condition for the surrent user
  // if the current user exsist else navigate to the signin page
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
