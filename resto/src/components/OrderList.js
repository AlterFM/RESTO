import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
   const [orders, setOrders] = useState([]);

   useEffect(() => {
     axios.get('http://localhost/Pemweb/Resto/resto/api/getOrders.php')
       .then((response) => {
         if (response.data.success) {
           setOrders(response.data.orders);
         }
       })
       .catch((error) => console.error('Error fetching orders:', error));
   }, []);

   return (
     <div className="order-list">
       <h2>Daftar Pembelian</h2>
       <table>
         <thead>
           <tr>
             <th>No</th>
             <th>Nama Pembeli</th>
             <th>Pesanan</th>
             <th>Kuantitas</th>
             <th>Total</th>
           </tr>
         </thead>
         <tbody>
           {orders.map((order, index) => (
             <tr key={order.id_pembelian}>
               <td>{index + 1}</td>
               <td>{order.nama_pembeli}</td>
               <td>{order.pesanan}</td>
               <td>{order.kuantitas}</td>
               <td>Rp{order.total_pesanan}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
};

export default OrderList;
