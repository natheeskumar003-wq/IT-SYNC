<?php
/**
 * Messages & Communication Endpoint ("IT Hub Messenger")
 * Roles: Student (Request to Staff, DM to Student), Staff (Request to HOD, DM to Student), HOD (Broadcast & DM to all)
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$userId = $_SESSION['user_id'] ?? 5; // Default demo student if session not set
$role = $_SESSION['role'] ?? 'student';

try {
    if ($action === 'list') {
        $typeFilter = $_GET['type'] ?? 'all';
        
        $sql = "SELECT m.*, u.full_name AS sender_name, u.role AS sender_role, 
                       r.full_name AS receiver_name, r.role AS receiver_role
                FROM messages m
                LEFT JOIN users u ON m.sender_id = u.id
                LEFT JOIN users r ON m.receiver_id = r.id
                WHERE m.message_type = 'broadcast' 
                   OR m.sender_id = :userId 
                   OR m.receiver_id = :userId
                ORDER BY m.created_at DESC LIMIT 50";
                
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':userId' => $userId]);
        $messages = $stmt->fetchAll();

        sendJsonResponse(true, 'Messages retrieved successfully', $messages);
    } 
    elseif ($action === 'send') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        
        $receiverId = !empty($input['receiver_id']) ? intval($input['receiver_id']) : null;
        $messageType = sanitizeInput($input['message_type'] ?? 'dm');
        $subjectTag = sanitizeInput($input['subject_tag'] ?? 'General');
        $messageText = sanitizeInput($input['message_text'] ?? '');
        
        if (empty($messageText)) {
            sendJsonResponse(false, 'Message text cannot be empty');
        }

        $stmt = $pdo->prepare("
            INSERT INTO messages (sender_id, receiver_id, message_type, subject_tag, message_text)
            VALUES (:sender_id, :receiver_id, :message_type, :subject_tag, :message_text)
        ");
        
        $stmt->execute([
            ':sender_id' => $userId,
            ':receiver_id' => $receiverId,
            ':message_type' => $messageType,
            ':subject_tag' => $subjectTag,
            ':message_text' => $messageText
        ]);

        sendJsonResponse(true, 'Message transmitted successfully', [
            'id' => $pdo->lastInsertId(),
            'message_text' => $messageText,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }
    elseif ($action === 'mark_read') {
        $msgId = intval($_GET['id'] ?? 0);
        $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE id = :id AND (receiver_id = :userId OR receiver_id IS NULL)");
        $stmt->execute([':id' => $msgId, ':userId' => $userId]);
        sendJsonResponse(true, 'Message marked as read');
    }
    else {
        sendJsonResponse(false, 'Invalid action parameter');
    }
} catch (PDOException $e) {
    sendJsonResponse(false, 'Database error: ' . $e->getMessage());
}
