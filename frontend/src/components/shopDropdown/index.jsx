import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useTranslation } from "react-i18next";

const ShopDropdown = ({ onClose }) => {
  const [types, setTypes] = useState([]);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypesAndSubTypes = async () => {
      try {
        const typesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/types`
        );
        const subTypesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/subTypes`
        );

        if (!typesResponse.ok || !subTypesResponse.ok) {
          throw new Error("Erro ao buscar os dados");
        }

        const typesData = await typesResponse.json();
        const subTypesData = await subTypesResponse.json();

        const processedTypes = typesData.map((type) => ({
          ...type,
          sub_types: subTypesData.filter(
            (subType) => subType.type_id === type.id
          ),
        }));

        setTypes(processedTypes);
      } catch (error) {
        console.error("Erro ao buscar os types e sub_types:", error);
      }
    };

    fetchTypesAndSubTypes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.(); // chama função de fechar se for passada
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNavigate = (url) => {
    navigate(url);
    onClose?.(); // fecha dropdown após navegar
  };

  return (
    <div className="shop-dropdown container-fluid px-0" ref={dropdownRef}>
      <div className="shop-dropdown-inner row mx-0">
        <div className="dropdown-col col-12 col-md-2 mb-3">
          <span
            onClick={() => handleNavigate("/catalog?filter=new_arrivals")}
            className="type-link d-block mb-2 fw-bold cursor-pointer"
          >
            {t("title.newArrivals")}
          </span>
          <span
            onClick={() => handleNavigate("/catalog")}
            className="type-link d-block fw-bold cursor-pointer"
          >
            {t("title.allProducts")}
          </span>
        </div>

        {[...types].reverse().map((type) => (
          <div key={type.id} className="dropdown-col col-6 col-md-2 mb-3">
            <span
              onClick={() => handleNavigate(`/catalog?type_id=${type.id}`)}
              className="type-link d-block fw-semibold mb-2 text-uppercase small cursor-pointer"
            >
              {type.name}
            </span>
            <div className="sub-types">
              {type.sub_types.map((subType) => (
                <span
                  key={subType.id}
                  onClick={() =>
                    handleNavigate(`/catalog?sub_type_id=${subType.id}`)
                  }
                  className="sub-type-link d-block text-muted small mb-1 cursor-pointer"
                >
                  {subType.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopDropdown;
