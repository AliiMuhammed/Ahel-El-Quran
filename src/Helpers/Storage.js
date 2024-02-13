export const getAuthUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const setAuthUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const removeAuthUser = () => {
  if (localStorage.getItem("currentUser")) {
    localStorage.removeItem("currentUser");
  }
};
