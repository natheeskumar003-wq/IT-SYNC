<?php
/**
 * Department Events & Symposium E-Pass Registration Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'register' : 'list');

if ($action === 'list') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM events ORDER BY id ASC");
            $events = $stmt->fetchAll();
            if (!empty($events)) {
                sendJsonResponse(true, 'Events fetched', $events);
            }
        } catch (Exception $e) {}
    }

    sendJsonResponse(true, 'Events (Sample)', [
        ['title' => 'National IT Symposium "INFORMIX 2026"', 'category' => 'Symposium', 'event_date' => 'OCT 14', 'venue' => 'Main Auditorium', 'event_time' => '09:00 AM'],
        ['title' => 'Fullstack Web Dev Bootcamp', 'category' => 'Workshop', 'event_date' => 'NOV 02', 'venue' => 'Lab 3', 'event_time' => '10:00 AM']
    ]);

} elseif ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $name = sanitizeInput($input['name'] ?? '');
    $roll = sanitizeInput($input['roll'] ?? '');
    $college = sanitizeInput($input['college'] ?? '');
    $eventName = sanitizeInput($input['event'] ?? 'Code Debugging');

    if (empty($name) || empty($roll) || empty($eventName)) {
        sendJsonResponse(false, 'Please fill all required registration details.');
    }

    $epassCode = 'EPASS-' . strtoupper(substr(md5(uniqid($roll, true)), 0, 8));

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO event_registrations (student_name, roll_no, college_name, event_name, epass_code)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$name, $roll, $college, $eventName, $epassCode]);
        } catch (Exception $e) {}
    }

    sendJsonResponse(true, 'E-Pass Generated Successfully!', [
        'student_name' => $name,
        'roll_no'      => $roll,
        'college_name' => $college,
        'event_name'   => $eventName,
        'epass_code'   => $epassCode,
        'date'         => 'October 14, 2026'
    ]);
}
?>
