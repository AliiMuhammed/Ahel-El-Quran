import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [notificationPermission, setNotificationPermission] = useState(null);

  useEffect(() => {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 5 * 60 * 1000); // Set the target time 5 minutes from now

    // Calculate the time difference between now and the target time
    const timeDiff = targetTime - now;

    // Set a timeout to trigger the notification at the target time
    const timeoutId = setTimeout(() => {
      showNotification();
    }, timeDiff);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  const showNotification = () => {
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
      // Check if the user has granted permission
      if (Notification.permission === "granted") {
        // Display the notification
        new Notification("Time for your notification!");
        setNotificationPermission("granted");
      } else if (Notification.permission !== "denied") {
        // If permission is not denied, request it
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            // Display the notification after permission is granted
            showNotification();
            setNotificationPermission("granted");
          } else {
            console.log("Notification permission denied");
            setNotificationPermission("denied");
          }
        });
      }
    }
  };

  // Save the permission status to local storage or another persistent storage mechanism
  useEffect(() => {
    localStorage.setItem("notificationPermission", notificationPermission);
  }, [notificationPermission]);

  return <div>{/* Your component content */}</div>;
};

export default Notifications;
