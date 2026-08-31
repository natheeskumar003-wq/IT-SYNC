<?php
/**
 * Role-Based Login Authentication Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Invalid request method. Only POST is accepted.', null, 405);
}

// Read raw JSON or form-data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$username = isset($input['username']) ? trim($input['username']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';
$role     = isset($input['role']) ? trim(strtolower($input['role'])) : '';

if (empty($username) || empty($password)) {
    sendJsonResponse(false, 'Please provide both username and password.');
}

$pdo = getDbConnection();

if ($pdo) {
    // 1. Check database users table
    try {
        $stmt = $pdo->prepare("SELECT id, username, email, password_hash, role, status FROM users WHERE username = :user OR email = :user LIMIT 1");
        $stmt->execute([':user' => $username]);
        $user = $stmt->fetch();

        if ($user) {
            // Check password (supports Bcrypt hash, and '1234' demo fallback)
            $passwordMatches = password_verify($password, $user['password_hash']) || ($password === '1234' && $user['username'] === $username);

            if ($passwordMatches) {
                if ($user['status'] !== 'active') {
                    sendJsonResponse(false, 'Your account is suspended or inactive. Please contact the administrator.');
                }

                // Verify role match if specified
                if (!empty($role) && strtolower($user['role']) !== $role) {
                    sendJsonResponse(false, "Role mismatch. This account belongs to role: " . strtoupper($user['role']));
                }

                $userRole = strtolower($user['role']);
                $fullName = ucfirst($user['username']);

                // Fetch details based on role
                if ($userRole === 'student') {
                    $st = $pdo->prepare("SELECT full_name, roll_no FROM students WHERE user_id = ?");
                    $st->execute([$user['id']]);
                    if ($row = $st->fetch()) {
                        $fullName = $row['full_name'];
                    }
                } elseif ($userRole === 'staff') {
                    $st = $pdo->prepare("SELECT full_name FROM staff WHERE user_id = ?");
                    $st->execute([$user['id']]);
                    if ($row = $st->fetch()) {
                        $fullName = $row['full_name'];
                    }
                } elseif ($userRole === 'hod') {
                    $st = $pdo->prepare("SELECT full_name FROM hod WHERE user_id = ?");
                    $st->execute([$user['id']]);
                    if ($row = $st->fetch()) {
                        $fullName = $row['full_name'];
                    }
                } elseif ($userRole === 'admin') {
                    $fullName = 'System Administrator';
                }

                // Initialize PHP Session
                $_SESSION['user_id']   = $user['id'];
                $_SESSION['username']  = $user['username'];
                $_SESSION['email']     = $user['email'];
                $_SESSION['role']      = $userRole;
                $_SESSION['full_name'] = $fullName;

                // Update last login
                $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);

                // Determine redirect target
                $redirectUrl = "{$userRole}.html";

                sendJsonResponse(true, 'Login successful!', [
                    'redirect'  => $redirectUrl,
                    'user_id'   => $user['id'],
                    'username'  => $user['username'],
                    'role'      => $userRole,
                    'full_name' => $fullName
                ]);
            }
        }
    } catch (Exception $e) {
        // Fallback to demo credentials if database query fails
    }
}

// 2. Demo Fallback Authentication (Ensures offline / clean demo functionality)
$demoUsers = [
    'student' => ['role' => 'student', 'name' => 'Student User', 'redirect' => 'student.html'],
    'staff'   => ['role' => 'staff',   'name' => 'Prof. Rajesh Kumar', 'redirect' => 'staff.html'],
    'hod'     => ['role' => 'hod',     'name' => 'Dr. K. Senthil', 'redirect' => 'hod.html'],
    'admin'   => ['role' => 'admin',   'name' => 'Super Administrator', 'redirect' => 'admin.html'],
];

$normalizedUser = strtolower($username);
if (isset($demoUsers[$normalizedUser]) && $password === '1234') {
    if (!empty($role) && $demoUsers[$normalizedUser]['role'] !== $role) {
        sendJsonResponse(false, "Selected role does not match username '{$username}'.");
    }

    $userInfo = $demoUsers[$normalizedUser];
    $_SESSION['user_id']   = 999;
    $_SESSION['username']  = $normalizedUser;
    $_SESSION['role']      = $userInfo['role'];
    $_SESSION['full_name'] = $userInfo['name'];

    sendJsonResponse(true, 'Login successful! (Demo Mode)', [
        'redirect'  => $userInfo['redirect'],
        'username'  => $normalizedUser,
        'role'      => $userInfo['role'],
        'full_name' => $userInfo['name']
    ]);
}

sendJsonResponse(false, 'Invalid username or password. Please try demo credentials: student, staff, hod, admin (password: 1234).');
?>
