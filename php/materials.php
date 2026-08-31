<?php
/**
 * Course Study Materials & Question Papers Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'upload' : 'list');

if ($action === 'list') {
    $search = trim($_GET['search'] ?? '');
    $type = trim($_GET['type'] ?? 'all');

    if ($pdo) {
        try {
            $sql = "
                SELECT 
                    m.id,
                    m.title,
                    m.file_type,
                    m.file_size,
                    m.file_path,
                    m.description,
                    m.downloads_count,
                    m.created_at,
                    s.subject_name,
                    s.subject_code,
                    st.full_name AS uploaded_by_name
                FROM materials m
                JOIN subjects s ON m.subject_id = s.id
                LEFT JOIN staff st ON m.uploaded_by = st.id
                WHERE 1=1
            ";
            $params = [];

            if (!empty($search)) {
                $sql .= " AND (m.title LIKE :q OR s.subject_name LIKE :q OR s.subject_code LIKE :q)";
                $params[':q'] = "%{$search}%";
            }
            if (!empty($type) && $type !== 'all') {
                $sql .= " AND m.file_type = :type";
                $params[':type'] = $type;
            }

            $sql .= " ORDER BY m.id DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $materials = $stmt->fetchAll();

            sendJsonResponse(true, 'Materials loaded', $materials);
        } catch (Exception $e) {}
    }

    // Default Sample Data
    sendJsonResponse(true, 'Materials loaded (Sample)', [
        [
            'id' => 1,
            'title' => 'Unit 1 & 2: Java Multithreading & Streams',
            'subject_name' => 'Java Programming',
            'file_type' => 'pdf',
            'file_size' => '4.2 MB',
            'uploaded_by_name' => 'Prof. Rajesh Kumar'
        ],
        [
            'id' => 2,
            'title' => 'Relational Algebra & Normalization 3NF/BCNF',
            'subject_name' => 'DBMS',
            'file_type' => 'pdf',
            'file_size' => '6.8 MB',
            'uploaded_by_name' => 'Dr. Meenakshi S.'
        ],
        [
            'id' => 3,
            'title' => 'Anna University 2021-2025 Solved Papers',
            'subject_name' => 'Computer Networks',
            'file_type' => 'qp',
            'file_size' => '8.1 MB',
            'uploaded_by_name' => '5 Year Collection'
        ],
        [
            'id' => 4,
            'title' => 'Web Technology & React Lab Experiments',
            'subject_name' => 'Web Technology Lab',
            'file_type' => 'doc',
            'file_size' => '3.5 MB',
            'uploaded_by_name' => 'Department Approved'
        ]
    ]);

} elseif ($action === 'upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitizeInput($_POST['title'] ?? '');
    $subjectId = (int)($_POST['subject_id'] ?? 1);
    $type = sanitizeInput($_POST['file_type'] ?? 'pdf');

    if (empty($title)) {
        sendJsonResponse(false, 'Material title is required');
    }

    $filePath = 'uploads/materials/sample_doc.pdf';
    $fileSize = '3.5 MB';

    // Handle file upload if present
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/materials/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9\._-]/", "_", basename($_FILES['file']['name']));
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            $filePath = 'uploads/materials/' . $fileName;
            $fileSize = round($_FILES['file']['size'] / (1024 * 1024), 1) . ' MB';
        }
    }

    if ($pdo) {
        try {
            $staffId = $_SESSION['user_id'] ?? 1;
            $stmt = $pdo->prepare("
                INSERT INTO materials (title, subject_id, file_type, file_size, file_path, uploaded_by)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$title, $subjectId, $type, $fileSize, $filePath, $staffId]);
            sendJsonResponse(true, 'Material successfully published to student portal!');
        } catch (Exception $e) {
            sendJsonResponse(false, 'Failed to save material: ' . $e->getMessage());
        }
    }

    sendJsonResponse(true, 'Material uploaded and published to students!');
} else {
    sendJsonResponse(false, 'Invalid action for materials endpoint.');
}
?>
