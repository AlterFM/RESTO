<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "resto_db");

// Periksa koneksi
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Query untuk mengambil data pesanan
$query = "SELECT * FROM pembelian";
$result = $conn->query($query);

if (!$result) {
    die(json_encode(["success" => false, "message" => "Query failed: " . $conn->error]));
}

// Ambil data pesanan
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

// Kirimkan data dalam format JSON
echo json_encode([
    "success" => true,
    "orders" => $orders
]);

// Tutup koneksi
$conn->close();
?>
