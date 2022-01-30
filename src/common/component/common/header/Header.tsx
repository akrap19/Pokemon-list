import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="pokemon-header">
      <a href="/">
        <img
          src="https://www.freepnglogos.com/uploads/pokemon-logo-png-0.png"
          alt="logo"
        />
      </a>
    </header>
  );
}

export default Header;
