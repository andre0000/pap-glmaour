import React from "react";
import "./styles.css";
import { useTranslation } from "react-i18next";

const NavbarInfo = () => {
  const { t } = useTranslation();
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
