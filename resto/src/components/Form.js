import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ nama: "", jumlah: "", harga: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrder = () => {
    axios
      .post("http://localhost:5000/api/order", form)
      .then((res) => {
        setOrders([...orders, form]);
        setForm({ nama: "", jumlah: "", harga: "" });
        alert(res.data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="form">
      <h2>Form Pemesanan</h2>
      <div>
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
        />
        <input
          type="number"
          name="jumlah"
          placeholder="Jumlah"
          value={form.jumlah}
          onChange={handleChange}
        />
        <input
          type="number"
          name="harga"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
        />
        <button onClick={handleAddOrder}>Tambah</button>
      </div>
    </div>
  );
};

export default Form;
