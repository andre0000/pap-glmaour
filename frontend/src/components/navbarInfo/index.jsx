import React from "react";
import "./styles.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const NavbarInfo = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout"; // Check if on the checkout page

  if (isCheckoutPage) return null; // Do not render the navbar info on the checkout page

  const message = t("navbarinfo.info");
  const repeatedMessage = Array(20).fill(`${message}  • `).join(" ");

  return (
    <div className="mini-navbar">
      <div className="scroll-wrapper">
        <div className="scroll-content">{repeatedMessage}</div>
      </div>
    </div>
  );
};

export default NavbarInfo;
