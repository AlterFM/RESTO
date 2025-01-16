<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "resto_db");

// Periksa koneksi
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);

// Validasi input yang lebih baik
if (empty($data['nama']) || empty($data['pesanan']) || !isset($data['kuantitas']) || !isset($data['total'])) {
    echo json_encode(["success" => false, "message" => "Semua field harus diisi!"]);
    exit;
}

// Siapkan query untuk memasukkan data pembelian dengan prepared statement
$query = "INSERT INTO pembelian (nama_pembeli, pesanan, kuantitas, total_pesanan) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssii", $data['nama'], $data['pesanan'], $data['kuantitas'], $data['total']);

// Eksekusi query dan berikan feedback yang jelas
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Pesanan berhasil ditambahkan!"]);
} else {
    echo json_encode(["success" => false, "message" => "Terjadi kesalahan saat menambahkan pesanan: " . $stmt->error]);
}

// Tutup koneksi
$stmt->close();
$conn->close();
?>
