<?php
/**
 * Department Hall of Fame & Achievements Endpoint
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM achievements ORDER BY id DESC");
        $achievements = $stmt->fetchAll();
        if (!empty($achievements)) {
            sendJsonResponse(true, 'Achievements loaded', $achievements);
        }
    } catch (Exception $e) {}
}

sendJsonResponse(true, 'Achievements (Sample)', [
    [
        'title' => '1st Prize in National Hackathon - Team ByteCraft',
        'winner_name' => 'Aarav Sharma & Team',
        'category' => 'Hackathon',
        'description' => 'Won Rs. 1,00,000 cash prize for developing an AI-driven disaster relief dashboard.',
        'badge_color' => 'var(--warning-light)',
        'text_color' => 'var(--warning)'
    ],
    [
        'title' => 'University Gold Medalist in Web Architecture',
        'winner_name' => 'Priya Sundaram',
        'category' => 'Academic',
        'description' => 'Secured state 1st rank in Anna University Examinations across all affiliated colleges.',
        'badge_color' => 'var(--success-light)',
        'text_color' => 'var(--success)'
    ]
]);
?>
