<?php
/**
 * Real File Upload Handler (Study Materials, Assignment Submissions, Proofs)
 * Supports PDF, DOCX, ZIP, PPTX with validation and directory placement
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Invalid request method. POST required.');
}

$uploadType = sanitizeInput($_POST['upload_type'] ?? 'materials');
$title = sanitizeInput($_POST['title'] ?? 'Uploaded Document');
$subjectId = intval($_POST['subject_id'] ?? 1);

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    sendJsonResponse(false, 'No file uploaded or an upload error occurred.');
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileSize = $file['size'];
$fileTmpPath = $file['tmp_name'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

$allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'png', 'jpg'];

if (!in_array($fileExt, $allowedExtensions)) {
    sendJsonResponse(false, 'Invalid file format. Allowed: ' . implode(', ', $allowedExtensions));
}

if ($fileSize > 25 * 1024 * 1024) { // 25MB limit
    sendJsonResponse(false, 'File size exceeds maximum permitted limit (25MB).');
}

// Target Directory
$targetDir = __DIR__ . '/../uploads/' . ($uploadType === 'assignments' ? 'assignments/' : 'materials/');
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$uniqueFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
$destination = $targetDir . $uniqueFileName;

if (move_uploaded_file($fileTmpPath, $destination)) {
    $relativePath = 'uploads/' . ($uploadType === 'assignments' ? 'assignments/' : 'materials/') . $uniqueFileName;
    $fileSizeKb = round($fileSize / 1024);

    // If it's a study material, insert into materials table
    if ($uploadType === 'materials') {
        $staffId = 1; // Current staff
        $category = sanitizeInput($_POST['category'] ?? 'notes');

        $stmt = $pdo->prepare("
            INSERT INTO materials (subject_id, uploaded_by, title, category, file_path, file_size_kb)
            VALUES (:sub, :staff, :title, :cat, :path, :size)
        ");
        $stmt->execute([
            ':sub' => $subjectId,
            ':staff' => $staffId,
            ':title' => $title,
            ':cat' => $category,
            ':path' => $relativePath,
            ':size' => $fileSizeKb
        ]);
    }

    sendJsonResponse(true, 'File uploaded successfully!', [
        'file_name' => $fileName,
        'file_path' => $relativePath,
        'file_size_kb' => $fileSizeKb,
        'uploaded_at' => date('Y-m-d H:i:s')
    ]);
} else {
    sendJsonResponse(false, 'Failed to move uploaded file to target directory.');
}
