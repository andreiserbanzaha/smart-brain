import React from 'react';

const Navigation = ({ onRouteChangeCallback, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p className='f3 link dim black underline pa3 pointer' onClick={() => onRouteChangeCallback('signout')}> Sign out </p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p className='f3 link dim black underline pa3 pointer' onClick={() => onRouteChangeCallback('signin')}> Sign in </p>
        <p className='f3 link dim black underline pa3 pointer' onClick={() => onRouteChangeCallback('register')}> Register </p>
      </nav>
    );
  }
}

export default Navigation;