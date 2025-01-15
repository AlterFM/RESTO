import React from "react";
import Menu from "./components/Menu";
import Form from "./components/Form";
import './App.css';


const App = () => {
  const makanan = [
    { nama: "Nasi Goreng Spesial", harga: 25000 },
    { nama: "Ayam Geprek Sambal", harga: 20000 },
    { nama: "Mie Goreng Pedas", harga: 18000 },
    { nama: "Soto Ayam", harga: 22000 },
    { nama: "Sate Ayam (10 tusuk)", harga: 30000 },
  ];

  const minuman = [
    { nama: "Es Teh Manis", harga: 8000 },
    { nama: "Kopi Susu", harga: 12000 },
    { nama: "Jus Alpukat", harga: 15000 },
    { nama: "Lemon Tea", harga: 10000 },
    { nama: "Air Mineral", harga: 5000 },
  ];

  return (
    <div className="app">
      <header>
        <h1>Resto Cepat Santap</h1>
        <p>Alamat: Alamat Alamat</p>
      </header>
      <div className="menus">
        <Menu data={makanan} title="Daftar Menu Makanan" />
        <Menu data={minuman} title="Daftar Menu Minuman" />
      </div>
      <Form />
    </div>
  );
};

export default App;
