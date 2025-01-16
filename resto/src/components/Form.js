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
  const [editingIndex, setEditingIndex] = useState(null); // Menyimpan indeks pesanan yang sedang diedit

  // Menghitung total berdasarkan kuantitas dan harga
  const calculateTotal = (kuantitas, harga) => {
    return kuantitas * harga;
  };

  const handleQuantityChange = (e) => {
    const kuantitas = Math.max(1, e.target.value);
    setForm((prevForm) => ({
      ...prevForm,
      kuantitas,
      total: calculateTotal(kuantitas, prevForm.harga),
    }));
  };

  const handleMenuSelect = (e) => {
    const selectedItemId = e.target.value; // Mendapatkan ID item yang dipilih
    console.log("Selected Item ID:", selectedItemId); // Log ID yang dipilih

    const [type, id] = selectedItemId.split('-'); // Memisahkan tipe dan id

    // Mencari item berdasarkan tipe dan ID
    const selectedMenuItem =
      type === 'makanan'
        ? menuData.makanan.find(item => item.id_makanan === id)
        : menuData.minuman.find(item => item.id_minuman === id);

    console.log("Selected Menu Item:", selectedMenuItem); // Log item yang ditemukan

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

    if (editingIndex !== null) {
      // Update existing order
      const updatedOrders = orders.map((order, index) =>
        index === editingIndex ? { ...form, nama: namaPembeli } : order
      );
      setOrders(updatedOrders);
      setEditingIndex(null); // Reset editing index
    } else {
      // Add new order
      setOrders([...orders, { ...form, nama: namaPembeli }]);
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
    setEditingIndex(index); // Set index untuk mode edit
  };

  const handleRemoveOrder = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);

    // Reset form jika menghapus pesanan yang sedang diedit
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

    axios
      .post("http://localhost/Pemweb/Resto/resto/api/addOrder.php", { orders })
      .then((response) => {
        alert(response.data.message);
        if (response.data.success) {
          // Reset daftar pesanan dan nama pembeli setelah berhasil dikirim
          setOrders([]);
          setNamaPembeli("");
          resetForm();
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
          <option 
            key={item.id_makanan ? `makanan-${item.id_makanan}` : `minuman-${item.id_minuman}`} 
            value={item.id_makanan ? `makanan-${item.id_makanan}` : `minuman-${item.id_minuman}`}>
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
              <th>Aksi</th> {/* Tambahkan kolom aksi */}
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
                  {/* Tombol Edit */}
                  <button onClick={() => handleEditOrder(index)}>Edit</button>
                  {/* Tombol Hapus */}
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
