import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [form, setForm] = useState({ nama: "", jumlah: "", harga: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrder = () => {
    if (!form.nama || !form.jumlah || !form.harga) {
      alert("Semua field harus diisi!");
      return;
    }

    axios
      .post("http://localhost/addOrder.php", form)
      .then((response) => {
        alert(response.data.message);
        setForm({ nama: "", jumlah: "", harga: "" });
      })
      .catch((error) => console.error("Error adding order:", error));
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
