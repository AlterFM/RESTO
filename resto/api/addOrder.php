<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "resto_db");

// Periksa koneksi
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);

// Validasi input
if (empty($data['orders'])) {
    echo json_encode(["success" => false, "message" => "Tidak ada pesanan untuk dikirim."]);
    exit;
}

// Hitung total keseluruhan
$totalKeseluruhan = 0;

// Ambil nama pembeli dari data (asumsi nama pembeli ada di order pertama)
$namaPembeli = $data['orders'][0]['nama'];

// Siapkan query untuk memasukkan data pembelian
$queryInsertPembelian = "INSERT INTO pembelian (nama_pembeli, total_pesanan) VALUES (?, ?)";
$stmtPembelian = $conn->prepare($queryInsertPembelian);

// Bind parameter untuk nama pembeli (sebelum total dihitung)
$stmtPembelian->bind_param("si", $namaPembeli, $totalKeseluruhan);

// Eksekusi query untuk memasukkan data pembelian
if (!$stmtPembelian->execute()) {
    echo json_encode(["success" => false, "message" => "Terjadi kesalahan saat menambahkan pesanan: " . $stmtPembelian->error]);
    exit;
}

// Ambil id_pembelian yang baru saja dimasukkan
$idPembelian = $stmtPembelian->insert_id;

// Siapkan query untuk memasukkan detail pembelian
$queryInsertDetail = "INSERT INTO detail_pembelian (id_pembelian, id_makanan, id_minuman, kuantitas, harga) VALUES (?, ?, ?, ?, ?)";
$stmtDetail = $conn->prepare($queryInsertDetail);

// Loop melalui setiap order dan simpan ke database
foreach ($data['orders'] as $order) {
    // Tentukan apakah pesanan adalah makanan atau minuman
    $idMakanan = !empty($order['pesanan']) && strpos($order['pesanan'], 'M') === 0 ? substr($order['pesanan'], 1) : null;
    $idMinuman = !empty($order['pesanan']) && strpos($order['pesanan'], 'B') === 0 ? substr($order['pesanan'], 1) : null;

    // Pastikan total ada di dalam order dan tambahkan ke total keseluruhan
    if (isset($order['total'])) {
        $totalKeseluruhan += $order['total'];
        
        // Bind parameter sesuai dengan tipe data di database
        $stmtDetail->bind_param("iiiii", $idPembelian, $idMakanan, $idMinuman, $order['kuantitas'], $order['harga']);
        
        // Eksekusi query detail pembelian
        if (!$stmtDetail->execute()) {
            echo json_encode(["success" => false, "message" => "Terjadi kesalahan saat menambahkan detail pesanan: " . $stmtDetail->error]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Total tidak ditemukan untuk pesanan."]);
        exit;
    }
}
// Update total pesanan di tabel pembelian setelah semua detail disimpan
$queryUpdateTotal = "UPDATE pembelian SET total_pesanan = ? WHERE id_pembelian = ?";
$stmtUpdateTotal = $conn->prepare($queryUpdateTotal);
$stmtUpdateTotal->bind_param("ii", $totalKeseluruhan, $idPembelian);
$stmtUpdateTotal->execute();

// Berikan respons sukses
echo json_encode(["success" => true, "message" => "Pesanan berhasil ditambahkan!"]);

// Tutup koneksi
$stmtDetail->close();
$conn->close();
?>
