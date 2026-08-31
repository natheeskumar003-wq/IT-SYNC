<?php
/**
 * ============================================================================
 * IT DIGITAL HUB - Information Technology Department Digital Portal
 * Database Configuration & Core Helpers (PDO)
 * ============================================================================
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Credentials (Default XAMPP / MySQL settings)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'it_digital_hub');
define('DB_PORT', '3306');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get PDO Database Connection
 * @return PDO|null
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Return null if database connection fails (enables graceful fallback)
        return null;
    }
}

/**
 * Send standard JSON Response
 * @param bool $success
 * @param string $message
 * @param mixed $data
 * @param int $statusCode
 */
function sendJsonResponse($success, $message = '', $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

/**
 * Helper to sanitize string inputs
 * @param string $data
 * @return string
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Check if the user is authenticated and has required role
 * @param array|string $allowedRoles
 * @return array Current user session
 */
function checkAuth($allowedRoles = []) {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
        sendJsonResponse(false, 'Unauthorized. Please login to continue.', null, 401);
    }

    if (!empty($allowedRoles)) {
        if (is_string($allowedRoles)) {
            $allowedRoles = [$allowedRoles];
        }
        if (!in_array($_SESSION['role'], $allowedRoles, true)) {
            sendJsonResponse(false, 'Forbidden. You do not have permission to access this resource.', null, 403);
        }
    }

    return [
        'id'       => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'role'     => $_SESSION['role'],
        'name'     => $_SESSION['full_name'] ?? $_SESSION['username']
    ];
}
?>
