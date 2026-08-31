<?php
/**
 * Department Gallery & Highlights Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM gallery ORDER BY id DESC");
        $gallery = $stmt->fetchAll();
        if (!empty($gallery)) {
            sendJsonResponse(true, 'Gallery loaded', $gallery);
        }
    } catch (Exception $e) {}
}

sendJsonResponse(true, 'Gallery (Sample)', [
    ['title' => 'Smart India Hackathon Winners', 'category' => 'Hackathon 2025', 'gradient' => 'linear-gradient(135deg, #2563eb, #60a5fa)'],
    ['title' => 'Industrial Visit to ISRO Bangalore', 'category' => 'ISRO Visit', 'gradient' => 'linear-gradient(135deg, #10b981, #34d399)'],
    ['title' => 'Hands-on Deep Learning Summit', 'category' => 'AI Workshop', 'gradient' => 'linear-gradient(135deg, #8b5cf6, #a78bfa)']
]);
?>
