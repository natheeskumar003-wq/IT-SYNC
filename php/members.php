<?php
/**
 * Member Management Endpoint (CRUD)
 * Allows Staff to add/edit students, and HOD to add/edit faculty and assign Class Advisors
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? 'list_students';

try {
    // 1. LIST STUDENTS (for Staff and HOD)
    if ($action === 'list_students') {
        $stmt = $pdo->query("
            SELECT s.*, u.full_name, u.email, u.phone, u.status AS user_status, 
                   st.staff_code AS advisor_code, u_adv.full_name AS advisor_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN staff st ON s.class_advisor_id = st.id
            LEFT JOIN users u_adv ON st.user_id = u_adv.id
            ORDER BY s.roll_no ASC
        ");
        $students = $stmt->fetchAll();
        sendJsonResponse(true, 'Student directory retrieved', $students);
    }
    
    // 2. ADD / EDIT STUDENT (Staff / HOD Action)
    elseif ($action === 'save_student') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $studentId = intval($input['student_id'] ?? 0);
        $rollNo = sanitizeInput($input['roll_no'] ?? '');
        $regNo = sanitizeInput($input['register_no'] ?? '');
        $fullName = sanitizeInput($input['full_name'] ?? '');
        $email = sanitizeInput($input['email'] ?? '');
        $phone = sanitizeInput($input['phone'] ?? '');
        $batch = sanitizeInput($input['batch_section'] ?? 'IT-A');
        $advisorId = intval($input['class_advisor_id'] ?? 1);

        if (empty($rollNo) || empty($fullName)) {
            sendJsonResponse(false, 'Roll Number and Student Name are required');
        }

        if ($studentId > 0) {
            // Update Student Record
            $stmt = $pdo->prepare("SELECT user_id FROM students WHERE id = :id");
            $stmt->execute([':id' => $studentId]);
            $userId = $stmt->fetchColumn();

            $stmt = $pdo->prepare("UPDATE users SET full_name = :name, email = :email, phone = :phone WHERE id = :user_id");
            $stmt->execute([':name' => $fullName, ':email' => $email, ':phone' => $phone, ':user_id' => $userId]);

            $stmt = $pdo->prepare("UPDATE students SET roll_no = :roll, register_no = :reg, batch_section = :batch, class_advisor_id = :advisor WHERE id = :id");
            $stmt->execute([':roll' => $rollNo, ':reg' => $regNo, ':batch' => $batch, ':advisor' => $advisorId, ':id' => $studentId]);

            sendJsonResponse(true, "Student {$fullName} updated successfully");
        } else {
            // Create New Student User & Record
            $defaultHash = password_hash('1234', PASSWORD_BCRYPT);
            $username = strtolower($rollNo);

            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (:u, :e, :p, 'student', :n, :ph)");
            $stmt->execute([':u' => $username, ':e' => $email, ':p' => $defaultHash, ':n' => $fullName, ':ph' => $phone]);
            $newUserId = $pdo->lastInsertId();

            $stmt = $pdo->prepare("INSERT INTO students (user_id, roll_no, register_no, batch_section, class_advisor_id) VALUES (:u, :r, :reg, :b, :adv)");
            $stmt->execute([':u' => $newUserId, ':r' => $rollNo, ':reg' => $regNo, ':b' => $batch, ':adv' => $advisorId]);

            sendJsonResponse(true, "New student {$fullName} ({$rollNo}) enrolled successfully");
        }
    }

    // 3. LIST FACULTY & CLASS ADVISORS (for HOD)
    elseif ($action === 'list_staff') {
        $stmt = $pdo->query("
            SELECT st.*, u.full_name, u.email, u.phone, u.status AS user_status,
                   ca.year_level AS advisory_year, ca.batch_section AS advisory_batch
            FROM staff st
            JOIN users u ON st.user_id = u.id
            LEFT JOIN class_advisors ca ON st.id = ca.staff_id
            ORDER BY st.id ASC
        ");
        $staffMembers = $stmt->fetchAll();
        sendJsonResponse(true, 'Faculty directory retrieved', $staffMembers);
    }

    // 4. ADD / EDIT FACULTY (HOD Action)
    elseif ($action === 'save_staff') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $staffId = intval($input['staff_id'] ?? 0);
        $staffCode = sanitizeInput($input['staff_code'] ?? '');
        $fullName = sanitizeInput($input['full_name'] ?? '');
        $designation = sanitizeInput($input['designation'] ?? 'Assistant Professor');
        $qualification = sanitizeInput($input['qualification'] ?? 'M.E.');
        $cabinNo = sanitizeInput($input['cabin_no'] ?? 'Room IT-204');
        $email = sanitizeInput($input['email'] ?? '');
        $phone = sanitizeInput($input['phone'] ?? '');
        $advisoryYear = sanitizeInput($input['advisory_year'] ?? '');

        if (empty($staffCode) || empty($fullName)) {
            sendJsonResponse(false, 'Staff Code and Faculty Name are required');
        }

        if ($staffId > 0) {
            // Update Staff Record
            $stmt = $pdo->prepare("SELECT user_id FROM staff WHERE id = :id");
            $stmt->execute([':id' => $staffId]);
            $userId = $stmt->fetchColumn();

            $stmt = $pdo->prepare("UPDATE users SET full_name = :name, email = :email, phone = :phone WHERE id = :user_id");
            $stmt->execute([':name' => $fullName, ':email' => $email, ':phone' => $phone, ':user_id' => $userId]);

            $stmt = $pdo->prepare("UPDATE staff SET staff_code = :code, designation = :desig, qualification = :qual, cabin_no = :cabin WHERE id = :id");
            $stmt->execute([':code' => $staffCode, ':desig' => $designation, ':qual' => $qualification, ':cabin' => $cabinNo, ':id' => $staffId]);

            // Update Class Advisor Mapping if selected
            if (!empty($advisoryYear)) {
                $stmt = $pdo->prepare("UPDATE class_advisors SET staff_id = :staff_id WHERE year_level = :year");
                $stmt->execute([':staff_id' => $staffId, ':year' => $advisoryYear]);
            }

            sendJsonResponse(true, "Faculty {$fullName} updated successfully");
        } else {
            // Create New Faculty User & Record
            $defaultHash = password_hash('1234', PASSWORD_BCRYPT);
            $username = strtolower(str_replace(' ', '', $fullName));

            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role, full_name, phone) VALUES (:u, :e, :p, 'staff', :n, :ph)");
            $stmt->execute([':u' => $username, ':e' => $email, ':p' => $defaultHash, ':n' => $fullName, ':ph' => $phone]);
            $newUserId = $pdo->lastInsertId();

            $stmt = $pdo->prepare("INSERT INTO staff (user_id, staff_code, designation, qualification, cabin_no) VALUES (:u, :c, :d, :q, :cb)");
            $stmt->execute([':u' => $newUserId, ':c' => $staffCode, ':d' => $designation, ':q' => $qualification, ':cb' => $cabinNo]);

            sendJsonResponse(true, "New faculty member {$fullName} appointed successfully");
        }
    }
    else {
        sendJsonResponse(false, 'Invalid member management action');
    }
} catch (PDOException $e) {
    sendJsonResponse(false, 'Database error: ' . $e->getMessage());
}
