import CatalogBase from "../catalogBase";
import NewArrivals from "../../components/newArrivals";
import AddButton from "../../components/addProductButton";
import AddProductModal from "../../modals/addProduct";
import { useState } from "react";

const CatalogPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <CatalogBase>
      {({ products, user }) => (
        <>
          {user?.is_admin && (
            <div className="add-button-wrapper">
              <AddButton onClick={() => setShowAddModal(true)} />
            </div>
          )}

          <NewArrivals products={products} />

          <AddProductModal
            show={showAddModal}
            handleClose={() => setShowAddModal(false)}
          />
        </>
      )}
    </CatalogBase>
  );
};

export default CatalogPage;
