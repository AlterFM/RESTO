import React, { useState } from "react";
import axios from "axios";

const Form = ({ menuData }) => {
  const [namaPembeli, setNamaPembeli] = useState("");
  const [form, setForm] = useState({
    pesanan: "",
    kuantitas: 1,
    harga: 0,
    total: 0,
  });
  const [orders, setOrders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const kuantitas = Math.max(1, e.target.value);
    setForm({ ...form, kuantitas, total: form.harga * kuantitas });
  };

  const handleMenuSelect = (e) => {
    const selectedItem = e.target.value;
    const selectedMenu = [
      ...menuData.makanan,
      ...menuData.minuman,
    ].find((item) => item.id_makanan === selectedItem || item.id_minuman === selectedItem);

    if (selectedMenu) {
      setForm({
        ...form,
        pesanan: selectedMenu.nama_makanan || selectedMenu.nama_minuman,
        harga: selectedMenu.harga_makanan || selectedMenu.harga_minuman,
        total: (selectedMenu.harga_makanan || selectedMenu.harga_minuman) * form.kuantitas,
      });
    }
  };

  const handleAddOrUpdateOrder = () => {
    if (!namaPembeli || !form.pesanan || !form.kuantitas || !form.total) {
      alert("Semua field harus diisi!");
      return;
    }

    if (editingIndex !== null) {
      const updatedOrders = orders.map((order, index) =>
        index === editingIndex ? { ...form, nama: namaPembeli } : order
      );
      setOrders(updatedOrders);
      setEditingIndex(null);
    } else {
      setOrders([...orders, { ...form, nama: namaPembeli }]);
    }

    setForm({ pesanan: "", kuantitas: 1, harga: 0, total: 0 });
  };

  const handleEditOrder = (index) => {
    const orderToEdit = orders[index];
    setForm(orderToEdit);
    setEditingIndex(index);
  };

  const handleRemoveOrder = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);

    if (editingIndex === index) {
      setForm({ pesanan: "", kuantitas: 1, harga: 0, total: 0 });
      setEditingIndex(null);
    }
  };

  const handleSubmitOrders = () => {
    if (orders.length === 0) {
      alert("Tidak ada pesanan untuk dikirim.");
      return;
    }

    axios
      .post("http://localhost/Pemweb/Resto/resto/api/addOrders.php", { orders })
      .then((response) => {
        alert(response.data.message);
        if (response.data.success) {
          setOrders([]);
          setNamaPembeli("");
          setForm({ pesanan: "", kuantitas: 1, harga: 0, total: 0 });
        }
      })
      .catch((error) => console.error("Error submitting orders:", error));
  };

  const totalKeseluruhan = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="form">
      <h2>Form Pemesanan</h2>
      
      <div>
        <input
          type="text"
          name="namaPembeli"
          placeholder="Nama Pembeli"
          value={namaPembeli}
          onChange={(e) => setNamaPembeli(e.target.value)}
        />
      </div>
      
      <div>
        <select name="pesanan" value={form.pesanan} onChange={handleMenuSelect}>
          <option value="">Pilih Pesanan</option>
          {[...menuData.makanan, ...menuData.minuman].map((item) => (
            <option key={item.id_makanan || item.id_minuman} value={item.id_makanan || item.id_minuman}>
              {item.nama_makanan || item.nama_minuman}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="kuantitas"
          placeholder="Kuantitas"
          value={form.kuantitas}
          onChange={handleQuantityChange}
        />

        <input
          type="number"
          name="total"
          placeholder="Total Harga"
          value={form.total}
          readOnly
        />

        <button onClick={handleAddOrUpdateOrder}>
          {editingIndex !== null ? "Update Pesanan" : "Tambah Pesanan"}
        </button>
      </div>

      <h3>Daftar Pesanan</h3>
      {namaPembeli && <p>Nama Pembeli: {namaPembeli}</p>}
      {orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Pesanan</th>
              <th>Kuantitas</th>
              <th>Harga per Item</th>
              <th>Total Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.pesanan}</td>
                <td>{order.kuantitas}</td>
                <td>{order.harga}</td>
                <td>{order.total}</td>
                <td>
                  <button onClick={() => handleEditOrder(index)}>Edit</button>
                  <button onClick={() => handleRemoveOrder(index)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Total Keseluruhan: {totalKeseluruhan}</h3>

      <button onClick={handleSubmitOrders}>Kirim Pesanan</button>
    </div>
  );
};

export default Form;
