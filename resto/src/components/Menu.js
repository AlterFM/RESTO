import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [makananData, setMakananData] = useState([]);
  const [minumanData, setMinumanData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/Pemweb/Resto/resto/api/getMenu.php")
      .then((res) => {
        // Memperbarui state dengan data makanan dan minuman
        setMakananData(res.data.data.makanan);
        setMinumanData(res.data.data.minuman);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="menu">
      <h2>Menu Makanan</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Makanan</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {makananData.map((item, index) => (
            <tr key={item.id_makanan}>
              <td>{index + 1}</td>
              <td>{item.nama_makanan}</td>
              <td>Rp{item.harga_makanan}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Menu Minuman</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Minuman</th>
            <th>Jenis</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {minumanData.map((item, index) => (
            <tr key={item.id_minuman}>
              <td>{index + 1}</td>
              <td>{item.nama_minuman}</td>
              <td>{item.jenis}</td>
              <td>Rp{item.harga_minuman}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;
