import { useEffect, useState } from "react";
import "./styles.css";

const CatalogBase = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao parsear usuário:", error);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProducts();
  }, []);

  return <div className="catalog-wrapper">{children({ products, user })}</div>;
};

export default CatalogBase;
