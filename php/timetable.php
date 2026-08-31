<?php
/**
 * Timetable Management Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$day = $_GET['day'] ?? 'Today';

if ($day === 'Today') {
    $currentDay = date('l'); // Monday, Tuesday...
    if ($currentDay === 'Sunday') $currentDay = 'Monday';
} else {
    $currentDay = $day;
}

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                t.id,
                t.day_of_week,
                t.time_slot,
                s.subject_name,
                s.subject_code,
                st.full_name AS faculty_name,
                t.room_no,
                t.class_type
            FROM timetable t
            JOIN subjects s ON t.subject_id = s.id
            LEFT JOIN staff st ON t.staff_id = st.id
            WHERE t.day_of_week = ?
            ORDER BY t.time_slot ASC
        ");
        $stmt->execute([$currentDay]);
        $schedule = $stmt->fetchAll();

        if (!empty($schedule)) {
            sendJsonResponse(true, "Timetable for {$currentDay}", [
                'day' => $currentDay,
                'schedule' => $schedule
            ]);
        }
    } catch (Exception $e) {}
}

// Fallback timetable
sendJsonResponse(true, "Timetable for {$currentDay} (Sample)", [
    'day' => $currentDay,
    'schedule' => [
        ['time_slot' => '10:00 AM', 'subject_name' => 'Java Programming', 'faculty_name' => 'Prof. Rajesh Kumar', 'room_no' => 'IT Lab 1', 'class_type' => 'Lab', 'status' => 'Next Class'],
        ['time_slot' => '11:00 AM', 'subject_name' => 'DBMS (Database Systems)', 'faculty_name' => 'Dr. Meenakshi S.', 'room_no' => 'Hall 302', 'class_type' => 'Lecture', 'status' => 'Scheduled'],
        ['time_slot' => '01:30 PM', 'subject_name' => 'Computer Networks', 'faculty_name' => 'Prof. Anand V.', 'room_no' => 'Smart Room 104', 'class_type' => 'Lecture', 'status' => 'Afternoon']
    ]
]);
?>
