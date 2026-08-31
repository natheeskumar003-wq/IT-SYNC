-- ============================================================================
-- IT DIGITAL HUB - Normalized Database Schema & Comprehensive Demo Dataset
-- Institution: Government College of Engineering, Erode (GCE Erode / Formerly IRTT)
-- Department: Information Technology
-- Database Engine: MySQL 5.7+ / 8.x / MariaDB (InnoDB, UTF-8 Multilingual)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `it_digital_hub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `it_digital_hub`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE (Core Credentials & RBAC)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'staff', 'hod', 'admin') NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. STAFF TABLE (Faculty & Professors)
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `staff_code` VARCHAR(20) NOT NULL UNIQUE,
  `designation` VARCHAR(50) NOT NULL,
  `qualification` VARCHAR(100) NOT NULL,
  `department` VARCHAR(50) DEFAULT 'Information Technology',
  `cabin_no` VARCHAR(30) DEFAULT 'Room IT-204',
  `experience_years` INT UNSIGNED DEFAULT 10,
  `specialization` VARCHAR(150) DEFAULT 'Distributed Systems & Cloud Computing',
  `joining_date` DATE DEFAULT '2016-06-15',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CLASS ADVISORS TABLE (Year-Wise Faculty Advisor Mapping)
DROP TABLE IF EXISTS `class_advisors`;
CREATE TABLE `class_advisors` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `year_level` ENUM('I Year', 'II Year', 'III Year', 'IV Year') NOT NULL,
  `batch_section` VARCHAR(30) NOT NULL,
  `academic_year` VARCHAR(20) DEFAULT '2026-2027',
  `staff_id` INT UNSIGNED NOT NULL,
  `cabin_location` VARCHAR(50) DEFAULT 'IT Block, Cabin 204',
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. STUDENTS TABLE (Student Profiles & Academic Metadata)
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `roll_no` VARCHAR(20) NOT NULL UNIQUE,
  `register_no` VARCHAR(20) NOT NULL UNIQUE,
  `department` VARCHAR(50) DEFAULT 'Information Technology',
  `year_level` ENUM('I Year', 'II Year', 'III Year', 'IV Year') DEFAULT 'III Year',
  `batch_section` VARCHAR(10) DEFAULT 'IT-A',
  `semester` INT UNSIGNED DEFAULT 6,
  `cgpa` DECIMAL(3,2) DEFAULT 8.42,
  `rank_position` VARCHAR(20) DEFAULT '4th in Dept',
  `credits_completed` INT UNSIGNED DEFAULT 118,
  `standing_arrears` INT UNSIGNED DEFAULT 0,
  `class_advisor_id` INT UNSIGNED DEFAULT 1,
  `blood_group` VARCHAR(5) DEFAULT 'O+ve',
  `dob` DATE DEFAULT '2005-04-12',
  `address` TEXT DEFAULT 'GCE Erode Student Hostel, Thindal, Erode, Tamil Nadu 638012',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_advisor_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. HOD TABLE (Head of Department)
DROP TABLE IF EXISTS `hod`;
CREATE TABLE `hod` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `staff_code` VARCHAR(20) NOT NULL UNIQUE,
  `qualification` VARCHAR(100) DEFAULT 'Ph.D., M.E., B.Tech (IIT Madras)',
  `office_room` VARCHAR(30) DEFAULT 'Room IT-301, 3rd Floor, GCE Erode Admin Block',
  `office_phone` VARCHAR(30) DEFAULT '+91 424 2533279',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COURSES & DEGREE TRACKS
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_code` VARCHAR(20) NOT NULL UNIQUE,
  `course_name` VARCHAR(100) NOT NULL,
  `degree` VARCHAR(50) NOT NULL DEFAULT 'B.Tech / B.E.',
  `duration_years` INT UNSIGNED DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SUBJECTS TABLE (Semester Subjects)
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT UNSIGNED NOT NULL,
  `subject_code` VARCHAR(20) NOT NULL UNIQUE,
  `subject_name` VARCHAR(100) NOT NULL,
  `semester` INT UNSIGNED NOT NULL,
  `credits` INT UNSIGNED NOT NULL DEFAULT 3,
  `staff_id` INT UNSIGNED NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ATTENDANCE & ROLL CALL TABLE
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `subject_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `session_date` DATE NOT NULL,
  `period_slot` INT UNSIGNED DEFAULT 1,
  `status` ENUM('present', 'absent', 'od', 'medical_leave') NOT NULL DEFAULT 'present',
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. ATTENDANCE SUMMARY CACHE TABLE
DROP TABLE IF EXISTS `attendance_summary`;
CREATE TABLE `attendance_summary` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `subject_id` INT UNSIGNED NOT NULL,
  `classes_conducted` INT UNSIGNED NOT NULL DEFAULT 40,
  `classes_attended` INT UNSIGNED NOT NULL DEFAULT 35,
  `percentage` DECIMAL(5,2) GENERATED ALWAYS AS ((`classes_attended` / `classes_conducted`) * 100) STORED,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. STUDY MATERIALS TABLE
DROP TABLE IF EXISTS `materials`;
CREATE TABLE `materials` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `subject_id` INT UNSIGNED NOT NULL,
  `uploaded_by` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('notes', 'qp', 'doc', 'syllabus', 'lab_manual') NOT NULL DEFAULT 'notes',
  `file_path` VARCHAR(255) NOT NULL,
  `file_size_kb` INT UNSIGNED DEFAULT 2048,
  `downloads_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`uploaded_by`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ASSIGNMENTS TABLE
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `subject_id` INT UNSIGNED NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `due_date` DATETIME NOT NULL,
  `max_marks` INT UNSIGNED DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. ASSIGNMENT SUBMISSIONS TABLE
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `submission_notes` TEXT DEFAULT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `marks_obtained` INT UNSIGNED DEFAULT NULL,
  `faculty_feedback` TEXT DEFAULT NULL,
  `status` ENUM('submitted', 'evaluated', 'late') DEFAULT 'submitted',
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. STUDENT PERFORMANCE & MARKS ROSTER (Internal & Semester Result)
DROP TABLE IF EXISTS `performance`;
CREATE TABLE `performance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `subject_id` INT UNSIGNED NOT NULL,
  `semester` INT UNSIGNED DEFAULT 6,
  `internal_1` DECIMAL(4,1) DEFAULT 44.0,
  `internal_2` DECIMAL(4,1) DEFAULT 46.5,
  `model_exam` DECIMAL(4,1) DEFAULT 88.0,
  `assignment_score` DECIMAL(4,1) DEFAULT 95.0,
  `semester_grade` VARCHAR(5) DEFAULT 'A+',
  `gpa` DECIMAL(3,2) DEFAULT 8.65,
  `updated_by_staff_id` INT UNSIGNED DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. INTER-ROLE MESSAGING & DM TABLE ("IT Hub Messenger")
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED DEFAULT NULL,
  `message_type` ENUM('dm', 'official_request', 'broadcast') NOT NULL DEFAULT 'dm',
  `subject_tag` VARCHAR(100) DEFAULT 'General Inquiry',
  `message_text` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. LEAVE & ON-DUTY (OD) APPLICATIONS
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `leave_type` ENUM('Medical Leave', 'On-Duty (Symposium)', 'On-Duty (Sports)', 'Personal Leave') NOT NULL,
  `from_date` DATE NOT NULL,
  `to_date` DATE NOT NULL,
  `reason` TEXT NOT NULL,
  `proof_doc_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `reviewed_by_staff_id` INT UNSIGNED DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. ANNOUNCEMENTS & OFFICIAL CIRCULARS
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  `category` ENUM('general', 'exam', 'symposium', 'placement', 'urgent') NOT NULL DEFAULT 'general',
  `target_role` ENUM('all', 'student', 'staff', 'hod') NOT NULL DEFAULT 'all',
  `published_by` VARCHAR(100) NOT NULL DEFAULT 'Department Office, GCE Erode',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. EVENTS & SYMPOSIUM REGISTRATION
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `event_type` ENUM('Symposium', 'Workshop', 'Hackathon', 'Webinar') NOT NULL DEFAULT 'Symposium',
  `description` TEXT NOT NULL,
  `event_date` DATE NOT NULL,
  `venue` VARCHAR(100) DEFAULT 'IT Seminar Hall, GCE Erode',
  `registration_fee` INT UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `event_registrations`;
CREATE TABLE `event_registrations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT UNSIGNED NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `roll_no` VARCHAR(20) NOT NULL,
  `college_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `epass_code` VARCHAR(50) NOT NULL UNIQUE,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. TIMETABLE
DROP TABLE IF EXISTS `timetable`;
CREATE TABLE `timetable` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  `period_no` INT UNSIGNED NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `subject_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `hall_no` VARCHAR(30) DEFAULT 'LH-IT-101',
  `batch_section` VARCHAR(10) DEFAULT 'IT-A',
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SAMPLE DEMO DATA (Pass: 1234 -> Bcrypt: $2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK)
-- ============================================================================

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `full_name`, `phone`) VALUES
(1, 'hod', 'hod@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'hod', 'Dr. K. Senthil, Ph.D.', '+91 94432 11223'),
(2, 'staff', 'rajesh.k@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'staff', 'Prof. Rajesh Kumar, M.E.', '+91 98421 55667'),
(3, 'staff2', 'meenakshi.s@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'staff', 'Dr. Meenakshi S., Ph.D.', '+91 97512 33445'),
(4, 'staff3', 'anand.v@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'staff', 'Prof. Anand V., M.Tech', '+91 96231 77889'),
(5, 'student', 'student@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'student', 'Aarav Sharma', '+91 91234 56789'),
(6, 'admin', 'admin@gceerode.ac.in', '$2y$10$w82J.5Qv3fB9.1aNq0l9mO8T7rQ8Qz1zW0y4B2l2E9zL7vN3vV9yK', 'admin', 'GCE Erode IT Administrator', '+91 424 2533279');

INSERT INTO `hod` (`id`, `user_id`, `staff_code`, `qualification`, `office_room`) VALUES
(1, 1, 'HOD-IT-01', 'Ph.D., M.E. (IIT Madras)', 'Room IT-301, GCE Erode Admin Block');

INSERT INTO `staff` (`id`, `user_id`, `staff_code`, `designation`, `qualification`, `cabin_no`, `experience_years`, `specialization`) VALUES
(1, 2, 'FAC-IT-101', 'Associate Professor', 'M.E., (Ph.D.)', 'Room IT-204', 12, 'Java Programming & Cloud Computing'),
(2, 3, 'FAC-IT-102', 'Assistant Professor (Sr. Gr.)', 'Ph.D., M.E.', 'Room IT-102', 8, 'Database Systems & Data Mining'),
(3, 4, 'FAC-IT-103', 'Assistant Professor', 'M.Tech', 'Room IT-201', 6, 'Computer Networks & Cyber Security');

INSERT INTO `class_advisors` (`id`, `year_level`, `batch_section`, `academic_year`, `staff_id`, `cabin_location`) VALUES
(1, 'I Year', 'IT-A & B', '2026-2027', 2, 'Room IT-102 (Dr. Meenakshi S.)'),
(2, 'II Year', 'IT-A & B', '2026-2027', 3, 'Room IT-201 (Prof. Anand V.)'),
(3, 'III Year', 'IT-A', '2026-2027', 1, 'Room IT-204 (Prof. Rajesh Kumar)'),
(4, 'IV Year', 'IT-A & B', '2026-2027', 1, 'Room IT-204 (Prof. Rajesh Kumar)');

INSERT INTO `students` (`id`, `user_id`, `roll_no`, `register_no`, `department`, `year_level`, `batch_section`, `semester`, `cgpa`, `rank_position`, `credits_completed`, `class_advisor_id`) VALUES
(1, 5, '23IT042', '730423205042', 'Information Technology', 'III Year', 'IT-A', 6, 8.42, '4th in Dept', 118, 1);

INSERT INTO `courses` (`id`, `course_code`, `course_name`, `degree`) VALUES
(1, 'BTECH-IT', 'Information Technology', 'B.Tech'),
(2, 'MTECH-IT', 'Information Technology', 'M.Tech');

INSERT INTO `subjects` (`id`, `course_id`, `subject_code`, `subject_name`, `semester`, `credits`, `staff_id`) VALUES
(1, 1, 'IT8601', 'Java Programming', 6, 4, 1),
(2, 1, 'IT8602', 'Database Management Systems', 6, 4, 2),
(3, 1, 'IT8603', 'Computer Networks', 6, 3, 3),
(4, 1, 'IT8611', 'Web Technology & Cloud Lab', 6, 2, 1);

INSERT INTO `performance` (`id`, `student_id`, `subject_id`, `semester`, `internal_1`, `internal_2`, `model_exam`, `assignment_score`, `semester_grade`, `gpa`) VALUES
(1, 1, 1, 6, 46.0, 48.0, 92.0, 95.0, 'O', 9.20),
(2, 1, 2, 6, 44.0, 45.5, 88.0, 90.0, 'A+', 8.70),
(3, 1, 3, 6, 42.0, 43.0, 84.0, 88.0, 'A', 8.20),
(4, 1, 4, 6, 48.0, 49.0, 96.0, 98.0, 'O', 9.50);

INSERT INTO `attendance_summary` (`id`, `student_id`, `subject_id`, `classes_conducted`, `classes_attended`) VALUES
(1, 1, 1, 42, 38),
(2, 1, 2, 38, 32),
(3, 1, 3, 35, 29),
(4, 1, 4, 24, 22);

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message_type`, `subject_tag`, `message_text`, `is_read`, `created_at`) VALUES
(1, 5, 2, 'official_request', 'Lab Extra Class Request', 'Respected Sir, could we schedule an extra practice session for Socket Programming lab?', 0, '2026-08-27 10:15:00'),
(2, 2, 5, 'dm', 'Assignment Clarification', 'Hello Aarav, your Java multithreading assignment code structure is very neat. Keep it up!', 1, '2026-08-27 11:30:00'),
(3, 2, 1, 'official_request', 'IoT Lab Hardware Budget', 'Respected HOD, requesting approval for purchase of 15 ESP32 boards for semester VI project lab.', 0, '2026-08-27 12:00:00'),
(4, 1, NULL, 'broadcast', 'Official Department Circular', 'All faculty and students are requested to attend the NBA Accreditation meeting tomorrow at 10:00 AM.', 1, '2026-08-27 09:00:00');

INSERT INTO `announcements` (`id`, `title`, `content`, `category`, `published_by`) VALUES
(1, 'Internal Assessment II Time Table Announced', 'Internal Assessment II for III Year IT starts on Oct 15, 2026. Hall tickets available in portal.', 'exam', 'Exam Cell, GCE Erode'),
(2, 'INFOFEST 2026 - Annual National Level IT Symposium', 'Registration open for Hackathon, Paper Presentation, Web Debugging & Coding Relay.', 'symposium', 'Prof. Rajesh Kumar, Staff In-charge');
