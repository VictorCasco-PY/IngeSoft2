import React, { useState, useEffect } from 'react';
import FlechaAtras from '../../../components/flechaAtras/FlechaAtras';
import CartaPrincipal from '../../../components/cartaPrincipal/CartaPrincipal';
import TablaCaja from '../../../components/tables/TablaCaja';
import { useComprasCaja } from '../../../context/ComprasCajaState';
import api from '../../../utils/api';
import CobroProveedores from './facturas_ventas/CobrarProveedoresPendiente'; 
import { toast, Toaster } from 'react-hot-toast';
const ListaCompras = () => {
  const { items = [] } = useComprasCaja() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [facturas, setFacturas] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [cobroModalOpen, setCobroModalOpen] = useState(false); 

  const obtenerFacturas = async (page) => {
    try {
      const response = await api.get(`/facturas-proveedores/estado/pendiente/page/${page}`);
      setFacturas(response.data.items);
      console.log(response.data.items)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };
  const handleRowClick = (item) => {
    setSelectedItem(item); 
    console.log(item);
    setCobroModalOpen(true);
  };

  const handleCloseCobroModal = () => {
    setCobroModalOpen(false); 
  };

  useEffect(() => {
    obtenerFacturas(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <><Toaster
    position="top-right"
    reverseOrder={false}
    toastOptions={{
        success: {
            style: {
                background: "#75B798",
                color: "#0A3622",
            },
        },
        error: {
            style: {
                background: "#FFDBD9",
                color: "#D92D20",
            },
        },
    }}
/>
      <CartaPrincipal>
        <div className="d-flex align-items-center" style={{ marginTop: '1.5rem' }}>
          <FlechaAtras ruta="/caja" />
          <h2 style={{ marginLeft: '3rem' }}>Lista de cobros a proveedores</h2>
        </div>
        <TablaCaja
          items={facturas}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick} 
          mostrarFiltro={false}
        />
        {/* Modal de cobro */}
        {cobroModalOpen && selectedItem && (
          <CobroProveedores
            factura={selectedItem} 
            closeModal={handleCloseCobroModal} 
            open={cobroModalOpen} 
            toast={toast}
          />
        )}
      </CartaPrincipal>
    </>
  );
};

export default ListaCompras;
