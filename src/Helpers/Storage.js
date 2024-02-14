export const getAuthUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const setAuthUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const removeAuthUser = () => {
  if (localStorage.getItem("currentUser")) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users"));

    if (!Array.isArray(users)) {
      users = [];
    }

    // Find and update the user in the users array
    users = users.map((user) => {
      if (user.email === currentUser.email) {
        return currentUser;
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("currentUser");
  }
};

export const updatePrayerTable = (newPrayerTable) => {
  const user = getAuthUser();
  if (user) {
    user.prayerTable = newPrayerTable;
    setAuthUser(user);
  }
};
