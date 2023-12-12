import React, { useEffect } from 'react';

const GoogleSignIn = () => {
  useEffect(() => {
    // Load the Google API client
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
      });
    });
  }, []);

  const handleSignInClick = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Get user ID
      console.log('Full Name: ' + profile.getName()); // Get user's full name
      console.log('Given Name: ' + profile.getGivenName()); // Get user's given name
      console.log('Email: ' + profile.getEmail()); // Get user's email

      // You can use this information to authenticate the user or perform other operations
    });
  };

  return (
    <div>
      <button onClick={handleSignInClick}>Login with Google</button>
    </div>
  );
};

export default GoogleSignIn;
