import React from 'react';
import LogoIcon from '../_assets/logo.png';

function Logo() {
  return (
    <div className="normal-case text-2xl text-black">
      <img src={LogoIcon} alt="logo" className="inline h-10 mr-2" />
      <span>MocasinerosTickets</span>
    </div>
  );
}

export { Logo };