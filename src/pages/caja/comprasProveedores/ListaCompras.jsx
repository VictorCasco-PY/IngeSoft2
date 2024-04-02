import React, { useEffect } from 'react';
import FlechaAtras from '../../../components/flechaAtras/FlechaAtras';
import CartaPrincipal from '../../../components/cartaPrincipal/CartaPrincipal';
import TablaCaja from '../../../components/tables/TablaCaja';
import { useComprasCaja } from '../../../context/ComprasCajaState';
import api from '../../../utils/api';

const ListaCompras = () => {
  const { items = [], addItem } = useComprasCaja() || {};

  const obtenerFacturas = async () => {
    try {
      const response = await api.get('/facturas-proveedores/page/1');
      response.data.items.forEach((factura) => addItem(factura));
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

  return (
    <>
      <CartaPrincipal>
        <div className="d-flex align-items-center" style={{ marginTop: '1.5rem' }}>
          <FlechaAtras ruta="/caja" />
          <h2 style={{ marginLeft: '3rem' }}>Listar Compras Realizadas</h2>
        </div>
        <TablaCaja items={items} />
      </CartaPrincipal>
    </>
  );
};

export default ListaCompras;