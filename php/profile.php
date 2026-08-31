<?php
/**
 * User Profile Retrieval & Update Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$user = checkAuth(); // Ensure user is logged in
$role = $user['role'];
$userId = $user['id'];

$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'update' : 'get');

if ($action === 'get') {
    if (!$pdo) {
        // Fallback demo profile
        sendJsonResponse(true, 'Profile fetched (demo)', [
            'full_name'     => $user['name'],
            'username'      => $user['username'],
            'role'          => $user['role'],
            'department'    => 'Information Technology',
            'email'         => $user['username'] . '@itdept.edu',
            'phone'         => '+91 98765 43210',
            'roll_no'       => '23IT042',
            'register_no'   => '312323205042',
            'year_of_study' => '3rd Year',
            'semester'      => 'Sem VI',
            'cgpa'          => '8.42',
            'attendance'    => '82.4%'
        ]);
    }

    try {
        if ($role === 'student') {
            $stmt = $pdo->prepare("SELECT s.*, u.email, u.username FROM students s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch();
        } elseif ($role === 'staff') {
            $stmt = $pdo->prepare("SELECT st.*, u.email, u.username FROM staff st JOIN users u ON st.user_id = u.id WHERE st.user_id = ?");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch();
        } elseif ($role === 'hod') {
            $stmt = $pdo->prepare("SELECT h.*, u.email, u.username FROM hod h JOIN users u ON h.user_id = u.id WHERE h.user_id = ?");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch();
        } else {
            $stmt = $pdo->prepare("SELECT id, username, email, role, status, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $profile = $stmt->fetch();
        }

        if ($profile) {
            sendJsonResponse(true, 'Profile loaded successfully', $profile);
        } else {
            sendJsonResponse(true, 'Default profile', [
                'full_name'  => $user['name'],
                'role'       => $role,
                'department' => 'Information Technology'
            ]);
        }
    } catch (Exception $e) {
        sendJsonResponse(false, 'Database error while fetching profile: ' . $e->getMessage());
    }
} elseif ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $phone = sanitizeInput($input['phone'] ?? '');
    $address = sanitizeInput($input['address'] ?? '');
    $fullName = sanitizeInput($input['full_name'] ?? '');

    if ($pdo) {
        try {
            if ($role === 'student' && !empty($phone)) {
                $stmt = $pdo->prepare("UPDATE students SET phone = ?, address = ? WHERE user_id = ?");
                $stmt->execute([$phone, $address, $userId]);
            } elseif ($role === 'staff' && !empty($phone)) {
                $stmt = $pdo->prepare("UPDATE staff SET phone = ? WHERE user_id = ?");
                $stmt->execute([$phone, $userId]);
            }
            sendJsonResponse(true, 'Profile updated successfully in database!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to update profile: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'Profile updated successfully (local)!');
} else {
    sendJsonResponse(false, 'Invalid action specified.');
}
?>
