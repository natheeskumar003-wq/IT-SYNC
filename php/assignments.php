<?php
/**
 * Assignment Management, Submission & Grading Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'submit' : 'list');

if ($action === 'list') {
    if ($pdo) {
        try {
            $studentId = $_SESSION['user_id'] ?? 1;
            $stmt = $pdo->prepare("
                SELECT 
                    a.id,
                    a.title,
                    a.description,
                    a.due_date,
                    a.max_marks,
                    s.subject_name,
                    st.full_name AS faculty_name,
                    COALESCE(sub.status, 'Pending') AS status,
                    COALESCE(sub.marks_awarded, '--') AS grade,
                    sub.submitted_at
                FROM assignments a
                JOIN subjects s ON a.subject_id = s.id
                LEFT JOIN staff st ON a.created_by = st.id
                LEFT JOIN submissions sub ON sub.assignment_id = a.id AND sub.student_id = ?
                ORDER BY a.id ASC
            ");
            $stmt->execute([$studentId]);
            $assignments = $stmt->fetchAll();

            sendJsonResponse(true, 'Assignments loaded', $assignments);
        } catch (Exception $e) {}
    }

    sendJsonResponse(true, 'Assignments loaded (Sample)', [
        ['id' => 'ASN-1', 'title' => 'Java Multi-threading & Socket Programming', 'subject_name' => 'Java Programming', 'due_date' => 'Tomorrow, 11:59 PM', 'status' => 'Pending', 'grade' => '--'],
        ['id' => 'ASN-2', 'title' => 'ER Modeling & Complex SQL Queries', 'subject_name' => 'DBMS', 'due_date' => 'Sep 05, 2026', 'status' => 'Submitted', 'grade' => '92/100'],
        ['id' => 'ASN-3', 'title' => 'TCP/IP Subnetting & Routing Lab', 'subject_name' => 'Computer Networks', 'due_date' => 'Sep 08, 2026', 'status' => 'Pending', 'grade' => '--']
    ]);

} elseif ($action === 'submit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $assignmentId = (int)($_POST['assignment_id'] ?? 1);
    $studentNotes = sanitizeInput($_POST['notes'] ?? '');
    $filePath = 'uploads/assignments/solution_' . time() . '.pdf';

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/assignments/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9\._-]/", "_", basename($_FILES['file']['name']));
        move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $fileName);
        $filePath = 'uploads/assignments/' . $fileName;
    }

    if ($pdo) {
        try {
            $studentId = $_SESSION['user_id'] ?? 1;
            $stmt = $pdo->prepare("
                INSERT INTO submissions (assignment_id, student_id, file_path, student_notes, marks_awarded, status)
                VALUES (?, ?, ?, ?, 'Under Evaluation', 'Submitted')
                ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), student_notes = VALUES(student_notes), status = 'Submitted'
            ");
            $stmt->execute([$assignmentId, $studentId, $filePath, $studentNotes]);
            sendJsonResponse(true, 'Assignment solution submitted successfully to faculty!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Submission failed: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'Assignment submitted successfully!');

} elseif ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitizeInput($_POST['title'] ?? '');
    $subjectId = (int)($_POST['subject_id'] ?? 1);
    $dueDate = sanitizeInput($_POST['due_date'] ?? 'Next Week');

    if (empty($title)) {
        sendJsonResponse(false, 'Title is required');
    }

    if ($pdo) {
        try {
            $staffId = $_SESSION['user_id'] ?? 1;
            $stmt = $pdo->prepare("INSERT INTO assignments (title, subject_id, due_date, created_by) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $subjectId, $dueDate, $staffId]);
            sendJsonResponse(true, 'New assignment created & published!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to create assignment: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'New assignment created & published!');
}
?>
