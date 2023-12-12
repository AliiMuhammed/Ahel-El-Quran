import React, { useEffect } from "react";

const GoogleSignIn = () => {
  useEffect(() => {
    // Load the Google API client
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id:
          "657254172252-rsnl8qpgr30upjlubkkn34d4eb4c8r4o.apps.googleusercontent.com",
      });
    });
  }, []);

  const handleSignInClick = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Get user ID
      console.log("Full Name: " + profile.getName()); // Get user's full name
      console.log("Given Name: " + profile.getGivenName()); // Get user's given name
      console.log("Email: " + profile.getEmail()); // Get user's email

      // You can use this information to authenticate the user or perform other operations
    });
  };

  return (
    <section>
      <section>
        <button className="m-5" onClick={handleSignInClick}>Login with Google</button>
      </section>
    </section>
  );
};

export default GoogleSignIn;
