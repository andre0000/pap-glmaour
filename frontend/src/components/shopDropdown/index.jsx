import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const ShopDropdown = () => {
  const [types, setTypes] = useState({});

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/products/types");
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error("Erro ao buscar tipos e subtipos:", error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="shop-dropdown">
      <div className="shop-dropdown-inner">
        {Object.entries(types).map(([type, subTypes]) => (
          <div className="dropdown-col" key={type}>
            <Link
              to={`/catalog?category=${type}`}
              className="dropdown-item dropdown-bold"
            >
              {type}
            </Link>
            {subTypes.map((subType) => (
              <Link
                to={`/catalog?type=${subType}`}
                className="dropdown-item"
                key={subType}
              >
                {subType}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopDropdown;
