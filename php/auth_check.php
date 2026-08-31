<?php
/**
 * Auth Check Middleware & Active Session Provider
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    sendJsonResponse(true, 'User is authenticated', [
        'authenticated' => true,
        'user_id'       => $_SESSION['user_id'],
        'username'      => $_SESSION['username'] ?? '',
        'role'          => $_SESSION['role'],
        'full_name'     => $_SESSION['full_name'] ?? 'User',
        'department'    => 'Information Technology'
    ]);
} else {
    sendJsonResponse(false, 'Not authenticated', [
        'authenticated' => false
    ], 200);
}
?>
