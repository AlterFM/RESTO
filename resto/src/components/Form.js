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

  const calculateTotal = (kuantitas, harga) => kuantitas * harga;

  const handleQuantityChange = (e) => {
    const kuantitas = Math.max(1, e.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      kuantitas,
      total: calculateTotal(kuantitas, prevForm.harga),
    }));
  };

  const handleMenuSelect = (e) => {
    const selectedItemId = e.target.value; // Format: "type-id"
    const [type, id] = selectedItemId.split("-"); // Memisahkan tipe dan ID
  
    const selectedMenuItem =
      type === "makanan"
        ? menuData.makanan.find((item) => item.kode_makanan === id)
        : menuData.minuman.find((item) => item.kode_minuman === id);
  
    if (selectedMenuItem) {
      setForm({
        pesanan: selectedMenuItem.nama_makanan || selectedMenuItem.nama_minuman,
        harga: selectedMenuItem.harga_makanan || selectedMenuItem.harga_minuman,
        kuantitas: 1,
        total: calculateTotal(1, selectedMenuItem.harga_makanan || selectedMenuItem.harga_minuman),
      });
    }
  };

  const handleAddOrUpdateOrder = () => {
    if (!namaPembeli || !form.pesanan || form.kuantitas <= 0 || form.total <= 0) {
      alert("Semua field harus diisi dengan benar!");
      return;
    }

    const orderToAdd = { ...form, nama: namaPembeli };

    if (editingIndex !== null) {
      const updatedOrders = orders.map((order, index) =>
        index === editingIndex ? orderToAdd : order
      );
      setOrders(updatedOrders);
      setEditingIndex(null);
    } else {
      setOrders([...orders, orderToAdd]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      pesanan: "",
      kuantitas: 1,
      harga: 0,
      total: 0,
    });
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
      resetForm();
      setEditingIndex(null);
    }
  };

  const handleSubmitOrders = () => {
    if (orders.length === 0) {
      alert("Tidak ada pesanan untuk dikirim.");
      return;
    }
  
    // Pastikan setiap order memiliki total
    const orderData = orders.map(order => ({
      pesanan: order.pesanan,
      kuantitas: order.kuantitas,
      harga: order.harga,
      total: order.total, // Pastikan total ada di sini
      nama: namaPembeli // Tambahkan nama pembeli ke setiap order
    }));
  
    axios
      .post("http://localhost/Pemweb/Resto/resto/api/addOrder.php", { orders: orderData })
      .then((response) => {
        console.log(response.data); // Log respons dari server
        alert(response.data.message);
        if (response.data.success) {
          setOrders([]);
          setNamaPembeli("");
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Error submitting orders:", error);
        alert("Terjadi kesalahan saat mengirim pesanan.");
      });
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
          {menuData.makanan.map((item) => (
            <option key={`makanan-${item.kode_makanan}`} value={`makanan-${item.kode_makanan}`}>
              {item.nama_makanan}
            </option>
          ))}
          {menuData.minuman.map((item) => (
            <option key={`minuman-${item.kode_minuman}`} value={`minuman-${item.kode_minuman}`}>
              {item.nama_minuman}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="kuantitas"
          placeholder="Kuantitas"
          value={form.kuantitas}
          onChange={handleQuantityChange}
          min="1"
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
