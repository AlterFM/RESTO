import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Form from './components/Form';
// import OrderList from './components/orderlist'; // Import OrderList component
import './App.css';

const App = () => {
  const [menuData, setMenuData] = useState({ makanan: [], minuman: [] });
  
  // Ambil data dari API menu dan orders secara bersamaan menggunakan Promise.all()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuResponse = await fetch("http://localhost/Pemweb/Resto/resto/api/getMenu.php");
        const menuData = await menuResponse.json();

        if (menuData.success) {
          setMenuData(menuData.data);
        }

      } catch (err) {
        console.error("Error fetching menu data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Resto Cepat Santap</h1>
        <p>Alamat: Kelapa Dua Wetan Corner</p>
      </header>
      <div className="menus">
        <Menu data={menuData.makanan} title="Daftar Menu Makanan" />
        <Menu data={menuData.minuman} title="Daftar Menu Minuman" />
      </div>
      {/* Mengoper menuData ke Form sebagai props */}
      <Form menuData={menuData} />
      {/* Menampilkan daftar pesanan */}
      {/* <OrderList /> */}
    </div>
  );
};

export default App;
