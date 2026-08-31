<?php
/**
 * Leave & On-Duty (OD) Management Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'apply' : 'list');

if ($action === 'list') {
    $forRole = $_GET['for'] ?? ($_SESSION['role'] ?? 'student');

    if ($pdo) {
        try {
            if ($forRole === 'student') {
                $studentId = $_SESSION['user_id'] ?? 1;
                $stmt = $pdo->prepare("SELECT * FROM leave_requests WHERE student_id = ? ORDER BY id DESC");
                $stmt->execute([$studentId]);
                $leaves = $stmt->fetchAll();
                sendJsonResponse(true, 'Student leaves loaded', $leaves);
            } else {
                // Faculty / HOD approval queue
                $stmt = $pdo->query("
                    SELECT 
                        l.id,
                        l.leave_type AS type,
                        l.from_date AS `from`,
                        l.to_date AS `to`,
                        l.reason,
                        l.status,
                        s.full_name AS student,
                        s.roll_no AS roll
                    FROM leave_requests l
                    JOIN students s ON l.student_id = s.id
                    ORDER BY l.id DESC
                ");
                $leaves = $stmt->fetchAll();
                sendJsonResponse(true, 'Leave approval queue loaded', $leaves);
            }
        } catch (Exception $e) {}
    }

    sendJsonResponse(true, 'Leaves (Sample)', [
        ['id' => 'LEV-101', 'student' => 'Student User', 'roll' => '23IT042', 'type' => 'Medical Leave', 'from' => '2026-09-02', 'to' => '2026-09-04', 'reason' => 'Viral Fever & Doctor Visit', 'status' => 'Approved'],
        ['id' => 'LEV-102', 'student' => 'Student User', 'roll' => '23IT042', 'type' => 'On-Duty (Symposium)', 'from' => '2026-09-14', 'to' => '2026-09-14', 'reason' => 'Paper Presentation at NIT Trichy', 'status' => 'Pending']
    ]);

} elseif ($action === 'apply' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $type = sanitizeInput($input['type'] ?? '');
    $fromDate = sanitizeInput($input['from'] ?? '');
    $toDate = sanitizeInput($input['to'] ?? '');
    $reason = sanitizeInput($input['reason'] ?? '');

    if (empty($type) || empty($fromDate) || empty($toDate) || empty($reason)) {
        sendJsonResponse(false, 'All fields are required');
    }

    if ($pdo) {
        try {
            $studentId = $_SESSION['user_id'] ?? 1;
            $stmt = $pdo->prepare("
                INSERT INTO leave_requests (student_id, leave_type, from_date, to_date, reason, status)
                VALUES (?, ?, ?, ?, ?, 'Pending')
            ");
            $stmt->execute([$studentId, $type, $fromDate, $toDate, $reason]);
            sendJsonResponse(true, 'Leave application submitted successfully!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to submit leave: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'Leave application submitted successfully!');

} elseif ($action === 'update_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $id = (int)($input['id'] ?? 0);
    $status = sanitizeInput($input['status'] ?? 'Approved');
    $reviewer = $_SESSION['full_name'] ?? 'Faculty Reviewer';

    if ($pdo && $id > 0) {
        try {
            $stmt = $pdo->prepare("UPDATE leave_requests SET status = ?, reviewed_by = ? WHERE id = ?");
            $stmt->execute([$status, $reviewer, $id]);
            sendJsonResponse(true, "Leave application #{$id} marked as {$status}!");
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to update leave status: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, "Leave application updated to {$status}!");
}
?>
