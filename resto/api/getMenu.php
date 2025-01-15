<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "resto_db");

// Periksa koneksi
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Query untuk mengambil data makanan dan minuman
$queryMakanan = "SELECT id_makanan, nama_makanan, harga_makanan FROM makanan";
$queryMinuman = "SELECT id_minuman, nama_minuman, jenis, harga_minuman FROM minuman";

$resultMakanan = $conn->query($queryMakanan);
$resultMinuman = $conn->query($queryMinuman);

if (!$resultMakanan || !$resultMinuman) {
    die(json_encode(["success" => false, "message" => "Query failed: " . $conn->error]));
}

// Siapkan array untuk menyimpan hasil
$dataMakanan = [];
$dataMinuman = [];

// Ambil data makanan
while ($row = $resultMakanan->fetch_assoc()) {
    $dataMakanan[] = $row;
}

// Ambil data minuman
while ($row = $resultMinuman->fetch_assoc()) {
    $dataMinuman[] = $row;
}

// Gabungkan hasil dan kirimkan dalam format JSON
echo json_encode([
    "success" => true,
    "data" => [
        "makanan" => $dataMakanan,
        "minuman" => $dataMinuman
    ]
]);

// Tutup koneksi
$conn->close();
?>
