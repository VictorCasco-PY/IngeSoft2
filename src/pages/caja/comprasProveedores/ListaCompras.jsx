import React, { useState, useEffect } from 'react';
import FlechaAtras from '../../../components/flechaAtras/FlechaAtras';
import CartaPrincipal from '../../../components/cartaPrincipal/CartaPrincipal';
import TablaCaja from '../../../components/tables/TablaCaja';
import { useComprasCaja } from '../../../context/ComprasCajaState';
import api from '../../../utils/api';

const ListaCompras = () => {
  const { items = [], addItem } = useComprasCaja() || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [facturas, setFacturas] = useState([]);

  const obtenerFacturas = async (page) => {
    try {
      const response = await api.get(`/facturas-proveedores/page/${page}`);
      setFacturas(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };

  useEffect(() => {
    obtenerFacturas(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <CartaPrincipal>
        <div className="d-flex align-items-center" style={{ marginTop: '1.5rem' }}>
          <FlechaAtras ruta="/caja" />
          <h2 style={{ marginLeft: '3rem' }}>Listar Compras Realizadas</h2>
        </div>
        <TablaCaja
          items={facturas}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </CartaPrincipal>
    </>
  );
};

export default ListaCompras;
