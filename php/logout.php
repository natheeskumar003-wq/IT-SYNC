<?php
/**
 * Logout & Session Cleanup Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

// Unset all session variables
$_SESSION = [];

// Destroy session cookie if present
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy session
session_destroy();

sendJsonResponse(true, 'Logged out successfully', [
    'redirect' => 'index.html'
]);
?>
