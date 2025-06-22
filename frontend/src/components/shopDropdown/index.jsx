import { Link } from "react-router-dom";
import "./styles.css";

const ShopDropdown = () => {
  return (
    <div className="shop-dropdown">
      <div className="shop-dropdown-inner">
        <div className="dropdown-col">
          <Link
            to="/catalog?filter=new"
            className="dropdown-item dropdown-bold"
          >
            New Arrivals
          </Link>
          <Link
            to="/catalog?filter=best"
            className="dropdown-item dropdown-bold"
          >
            Best Sellers
          </Link>
        </div>
        <div className="dropdown-col">
          <Link
            to="/catalog?category=clothing"
            className="dropdown-item dropdown-bold"
          >
            Clothing
          </Link>
          <Link to="/catalog?type=shirts" className="dropdown-item">
            Shirts
          </Link>
          <Link to="/catalog?type=pants" className="dropdown-item">
            Pants
          </Link>
          <Link to="/catalog?type=jackets" className="dropdown-item">
            Jackets
          </Link>
        </div>
        <div className="dropdown-col">
          <Link
            to="/catalog?category=accessories"
            className="dropdown-item dropdown-bold"
          >
            Accessories
          </Link>
          <Link to="/catalog?type=hats" className="dropdown-item">
            Hats
          </Link>
          <Link to="/catalog?type=bags" className="dropdown-item">
            Bags
          </Link>
          <Link to="/catalog?type=socks" className="dropdown-item">
            Socks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopDropdown;
