import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = ({ title, endpoint }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/menu/${endpoint}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [endpoint]);

  return (
    <div className="menu">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nama}</td>
              <td>Rp{item.harga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu;
