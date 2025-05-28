import "./styles.css";
import { useTranslation } from "react-i18next";

const AddButton = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      className="add-button"
      onClick={onClick}
      title={t("button.addProduct")}
    >
      + {t("button.addProduct")}
    </button>
  );
};

export default AddButton;
