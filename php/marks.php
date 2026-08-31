<?php
/**
 * Marks & Grading Endpoint (Staff-only entry and Student view)
 * Allows Faculty to enter/update Internal 1, Internal 2, Model Exam, Assignment, and Semester Result
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? 'get_student_marks';
$role = $_SESSION['role'] ?? 'staff';

try {
    if ($action === 'get_batch_marks') {
        $subjectId = intval($_GET['subject_id'] ?? 1);

        $stmt = $pdo->prepare("
            SELECT p.*, s.roll_no, s.register_no, u.full_name AS student_name, sub.subject_name, sub.subject_code
            FROM performance p
            JOIN students s ON p.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN subjects sub ON p.subject_id = sub.id
            WHERE p.subject_id = :subject_id
            ORDER BY s.roll_no ASC
        ");
        $stmt->execute([':subject_id' => $subjectId]);
        $marks = $stmt->fetchAll();

        sendJsonResponse(true, 'Batch marks roster retrieved', $marks);
    }
    elseif ($action === 'save_mark') {
        // Staff-only permission check
        if (isset($_SESSION['role']) && !in_array($_SESSION['role'], ['staff', 'hod', 'admin'])) {
            sendJsonResponse(false, 'Unauthorized: Only faculty members can enter or edit marks.');
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $performanceId = intval($input['performance_id'] ?? 0);
        $studentId = intval($input['student_id'] ?? 1);
        $subjectId = intval($input['subject_id'] ?? 1);
        $internal1 = floatval($input['internal_1'] ?? 0);
        $internal2 = floatval($input['internal_2'] ?? 0);
        $modelExam = floatval($input['model_exam'] ?? 0);
        $assignment = floatval($input['assignment_score'] ?? 0);
        $semesterGrade = sanitizeInput($input['semester_grade'] ?? 'A');
        
        // Automatic GPA calculation formula based on Anna University grading
        $gpaMap = ['O' => 10.0, 'A+' => 9.0, 'A' => 8.0, 'B+' => 7.0, 'B' => 6.0, 'C' => 5.0, 'RA' => 0.0];
        $calculatedGpa = $gpaMap[$semesterGrade] ?? 8.0;

        if ($performanceId > 0) {
            $stmt = $pdo->prepare("
                UPDATE performance 
                SET internal_1 = :i1, internal_2 = :i2, model_exam = :me, 
                    assignment_score = :asgn, semester_grade = :grade, gpa = :gpa
                WHERE id = :id
            ");
            $stmt->execute([
                ':i1' => $internal1,
                ':i2' => $internal2,
                ':me' => $modelExam,
                ':asgn' => $assignment,
                ':grade' => $semesterGrade,
                ':gpa' => $calculatedGpa,
                ':id' => $performanceId
            ]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO performance (student_id, subject_id, internal_1, internal_2, model_exam, assignment_score, semester_grade, gpa)
                VALUES (:student_id, :subject_id, :i1, :i2, :me, :asgn, :grade, :gpa)
                ON DUPLICATE KEY UPDATE internal_1 = :i1, internal_2 = :i2, model_exam = :me, assignment_score = :asgn, semester_grade = :grade, gpa = :gpa
            ");
            $stmt->execute([
                ':student_id' => $studentId,
                ':subject_id' => $subjectId,
                ':i1' => $internal1,
                ':i2' => $internal2,
                ':me' => $modelExam,
                ':asgn' => $assignment,
                ':grade' => $semesterGrade,
                ':gpa' => $calculatedGpa
            ]);
        }

        sendJsonResponse(true, 'Marks saved and published to student scorecard successfully!');
    }
    elseif ($action === 'get_student_marks') {
        $studentId = intval($_GET['student_id'] ?? 1);

        $stmt = $pdo->prepare("
            SELECT p.*, sub.subject_name, sub.subject_code, sub.credits, u.full_name AS faculty_name
            FROM performance p
            JOIN subjects sub ON p.subject_id = sub.id
            JOIN staff st ON sub.staff_id = st.id
            JOIN users u ON st.user_id = u.id
            WHERE p.student_id = :student_id
            ORDER BY sub.subject_code ASC
        ");
        $stmt->execute([':student_id' => $studentId]);
        $scorecard = $stmt->fetchAll();

        sendJsonResponse(true, 'Student academic scorecard loaded', $scorecard);
    }
    else {
        sendJsonResponse(false, 'Invalid action specified');
    }
} catch (PDOException $e) {
    sendJsonResponse(false, 'Database error: ' . $e->getMessage());
}
