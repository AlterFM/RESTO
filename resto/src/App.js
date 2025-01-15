import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Form from "./components/Form";
import './App.css';

const App = () => {
  const [menuData, setMenuData] = useState({ makanan: [], minuman: [] });

  // Ambil data dari API
  useEffect(() => {
    fetch("http://localhost/Pemweb/Resto/resto/api/getMenu.php")
      .then((response) => response.json())
      .then((data) => setMenuData(data.data))
      .catch((err) => console.error("Error fetching data: ", err));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Resto Cepat Santap</h1>
        <p>Alamat: Kelapa Dua Wetan Corner</p>
      </header>
      <div className="menus">
        <Menu data={menuData.makanan} title="Daftar Menu" />
      </div>
      <Form />
    </div>
  );
};

export default App;
