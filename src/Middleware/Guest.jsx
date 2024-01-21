import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../Helpers/Storage";

const Guest = () => {
  const auth = getAuthUser();
  return <>{!auth ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default Guest;
