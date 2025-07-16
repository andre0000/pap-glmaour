import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "../userContext";

const savedLang = sessionStorage.getItem("language");
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <App />
      </UserProvider>
    </I18nextProvider>
  </React.StrictMode>
);
