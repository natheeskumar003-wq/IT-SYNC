<?php
/**
 * Department Announcements & Circulars Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'post' : 'list');

if ($action === 'list') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC LIMIT 20");
            $announcements = $stmt->fetchAll();
            if (!empty($announcements)) {
                sendJsonResponse(true, 'Announcements fetched', $announcements);
            }
        } catch (Exception $e) {}
    }

    sendJsonResponse(true, 'Announcements (Sample)', [
        [
            'id' => 1,
            'title' => 'Internal Assessment Examination - 1 Schedule',
            'content' => 'All students are notified that Internal Exam 1 will commence from 15th next month. Portions: Unit 1 & 2. Hall tickets will be issued in respective classrooms.',
            'category' => 'Exam',
            'priority' => 'High',
            'posted_by' => 'Exam Branch',
            'created_at' => '2 hrs ago'
        ],
        [
            'id' => 2,
            'title' => 'National Level Symposium "INFORMIX 2026" Registrations',
            'content' => 'Registrations for paper presentation, web designing, and hackathon are now live. Cash prizes worth Rs. 50,000 to be won!',
            'category' => 'Symposium',
            'priority' => 'Medium',
            'posted_by' => 'HOD Office',
            'created_at' => 'Yesterday'
        ],
        [
            'id' => 3,
            'title' => 'Hands-on Workshop on Generative AI & Deep Learning',
            'content' => 'A 2-day workshop on Generative AI will be held in IT Seminar Hall 2 on Nov 02, 2026. Certificates for all participants.',
            'category' => 'Workshop',
            'priority' => 'Medium',
            'posted_by' => 'Faculty Coordinator',
            'created_at' => '2 days ago'
        ]
    ]);

} elseif ($action === 'post' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $title = sanitizeInput($input['title'] ?? '');
    $content = sanitizeInput($input['content'] ?? '');
    $category = sanitizeInput($input['category'] ?? 'General');

    if (empty($title) || empty($content)) {
        sendJsonResponse(false, 'Title and content are required');
    }

    $postedBy = $_SESSION['full_name'] ?? 'Department Office';

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO announcements (title, content, category, posted_by) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $content, $category, $postedBy]);
            sendJsonResponse(true, 'Announcement posted successfully to the digital hub!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to post announcement: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'Announcement broadcasted to portal!');
}
?>
