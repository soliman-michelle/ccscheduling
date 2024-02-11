-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2024 at 08:37 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scheduling`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_year`
--

CREATE TABLE `academic_year` (
  `academic_id` int(11) NOT NULL,
  `start` int(100) NOT NULL,
  `end` int(100) NOT NULL,
  `sem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_year`
--

INSERT INTO `academic_year` (`academic_id`, `start`, `end`, `sem`) VALUES
(6, 2023, 2024, 2),
(20, 2024, 2025, 1);

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` int(11) NOT NULL,
  `program` varchar(40) NOT NULL,
  `firstYear` int(40) NOT NULL,
  `secondYear` int(40) NOT NULL,
  `thirdYear` int(40) NOT NULL,
  `fourthYear` int(40) NOT NULL,
  `total` int(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`id`, `program`, `firstYear`, `secondYear`, `thirdYear`, `fourthYear`, `total`) VALUES
(8, 'BSCS-DS', 3, 2, 1, 0, 6),
(9, 'BSIT-BA', 2, 2, 2, 2, 8),
(10, 'BSIT-SD', 3, 3, 3, 2, 11),
(23, 'BSCS', 1, 1, 1, 1, 4);

--
-- Triggers `blocks`
--
DELIMITER $$
CREATE TRIGGER `after_blocks_delete` AFTER DELETE ON `blocks` FOR EACH ROW BEGIN
  -- Delete related records in wh_blk
  DELETE FROM wh_blk
  WHERE block_id = OLD.id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_blocks_insert` AFTER INSERT ON `blocks` FOR EACH ROW BEGIN
  INSERT INTO wh_blk (block_id, program, year, block)
  VALUES (NEW.id, NEW.program, 1, NEW.firstYear),
         (NEW.id, NEW.program, 2, NEW.secondYear),
         (NEW.id, NEW.program, 3, NEW.thirdYear),
         (NEW.id, NEW.program, 4, NEW.fourthYear);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_blocks_update` AFTER UPDATE ON `blocks` FOR EACH ROW BEGIN
  UPDATE wh_blk
  SET block = NEW.firstYear
  WHERE block_id = NEW.id AND program = NEW.program AND year = 1;
  
  UPDATE wh_blk
  SET block = NEW.secondYear
  WHERE Block_id = NEW.id AND program = NEW.program AND year = 2;
  
  UPDATE wh_blk
  SET block = NEW.thirdYear
  WHERE Block_id = NEW.id AND program = NEW.program AND year = 3;
  
  UPDATE wh_blk
  SET block = NEW.fourthYear
  WHERE Block_id = NEW.id AND program = NEW.program AND year = 4;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `block_course_assignment`
--

CREATE TABLE `block_course_assignment` (
  `class_id` int(11) NOT NULL,
  `course_id` int(50) NOT NULL,
  `program` varchar(50) NOT NULL,
  `year` int(50) NOT NULL,
  `block` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `block_course_assignment`
--

INSERT INTO `block_course_assignment` (`class_id`, `course_id`, `program`, `year`, `block`) VALUES
(4, 105, 'BSCS-DS', 1, 'A'),
(5, 105, 'BSCS-DS', 1, 'B'),
(6, 105, 'BSCS-DS', 1, 'C'),
(7, 105, 'BSIT-BA', 1, 'A'),
(8, 105, 'BSIT-BA', 1, 'B'),
(9, 105, 'BSIT-SD', 1, 'A'),
(10, 105, 'BSIT-SD', 1, 'B'),
(11, 105, 'BSIT-SD', 1, 'C'),
(12, 105, 'BSIT-SD', 1, 'D'),
(13, 106, 'BSIT-BA', 1, 'A'),
(14, 106, 'BSIT-BA', 1, 'B'),
(15, 106, 'BSIT-SD', 1, 'A'),
(16, 106, 'BSIT-SD', 1, 'B'),
(17, 106, 'BSIT-SD', 1, 'C'),
(18, 106, 'BSIT-SD', 1, 'D'),
(19, 108, 'BSCS-DS', 1, 'A'),
(20, 108, 'BSCS-DS', 1, 'B'),
(21, 108, 'BSCS-DS', 1, 'C'),
(22, 109, 'BSIT-BA', 2, 'A'),
(23, 109, 'BSIT-BA', 2, 'B'),
(24, 109, 'BSIT-SD', 2, 'A'),
(25, 109, 'BSIT-SD', 2, 'B'),
(26, 109, 'BSIT-SD', 2, 'C'),
(27, 110, 'BSIT-BA', 2, 'A'),
(28, 110, 'BSIT-BA', 2, 'B'),
(29, 110, 'BSIT-SD', 2, 'A'),
(30, 110, 'BSIT-SD', 2, 'B'),
(31, 110, 'BSIT-SD', 2, 'C'),
(32, 111, 'BSIT-SD', 2, 'A'),
(33, 111, 'BSIT-SD', 2, 'B'),
(34, 111, 'BSIT-SD', 2, 'C'),
(35, 111, 'BSIT-BA', 2, 'A'),
(36, 111, 'BSIT-BA', 2, 'B'),
(37, 112, 'BSIT-BA', 2, 'A'),
(38, 112, 'BSIT-BA', 2, 'B'),
(39, 112, 'BSIT-SD', 2, 'A'),
(40, 112, 'BSIT-SD', 2, 'B'),
(41, 112, 'BSIT-SD', 2, 'C'),
(42, 113, 'BSIT-BA', 2, 'A'),
(43, 113, 'BSIT-BA', 2, 'B'),
(46, 113, 'BSIT-SD', 2, 'A'),
(47, 113, 'BSIT-SD', 2, 'B'),
(48, 113, 'BSIT-SD', 2, 'C'),
(49, 114, 'BSIT-SD', 2, 'A'),
(50, 114, 'BSIT-SD', 2, 'B'),
(51, 114, 'BSIT-SD', 2, 'C'),
(52, 114, 'BSIT-BA', 2, 'A'),
(53, 114, 'BSIT-BA', 2, 'B'),
(54, 115, 'BSCS-DS', 2, 'A'),
(55, 115, 'BSCS-DS', 2, 'B'),
(56, 116, 'BSCS-DS', 2, 'A'),
(57, 116, 'BSCS-DS', 2, 'B'),
(58, 117, 'BSCS-DS', 2, 'A'),
(59, 117, 'BSCS-DS', 2, 'B'),
(60, 118, 'BSCS-DS', 2, 'A'),
(61, 118, 'BSCS-DS', 2, 'B'),
(62, 119, 'BSCS-DS', 2, 'A'),
(63, 119, 'BSCS-DS', 2, 'B'),
(64, 120, 'BSCS-DS', 2, 'A'),
(65, 120, 'BSCS-DS', 2, 'B'),
(66, 121, 'BSIT-BA', 3, 'A'),
(67, 121, 'BSIT-BA', 3, 'B'),
(68, 121, 'BSIT-SD', 3, 'A'),
(69, 121, 'BSIT-SD', 3, 'B'),
(70, 121, 'BSIT-SD', 3, 'C'),
(71, 122, 'BSIT-BA', 3, 'A'),
(72, 122, 'BSIT-BA', 3, 'B'),
(73, 122, 'BSIT-SD', 3, 'A'),
(74, 122, 'BSIT-SD', 3, 'B'),
(75, 122, 'BSIT-SD', 3, 'C'),
(76, 123, 'BSIT-BA', 3, 'A'),
(77, 123, 'BSIT-BA', 3, 'B'),
(78, 123, 'BSIT-SD', 3, 'A'),
(79, 123, 'BSIT-SD', 3, 'B'),
(80, 123, 'BSIT-SD', 3, 'C'),
(81, 124, 'BSIT-BA', 3, 'A'),
(82, 124, 'BSIT-BA', 3, 'B'),
(83, 125, 'BSIT-BA', 3, 'A'),
(84, 125, 'BSIT-BA', 3, 'B'),
(85, 126, 'BSIT-BA', 3, 'A'),
(86, 126, 'BSIT-BA', 3, 'B'),
(87, 127, 'BSIT-SD', 3, 'A'),
(88, 127, 'BSIT-SD', 3, 'B'),
(89, 127, 'BSIT-SD', 3, 'C'),
(90, 128, 'BSIT-SD', 3, 'A'),
(91, 128, 'BSIT-SD', 3, 'B'),
(92, 128, 'BSIT-SD', 3, 'C'),
(93, 129, 'BSCS-DS', 3, 'A'),
(94, 130, 'BSCS-DS', 3, 'A'),
(95, 131, 'BSCS-DS', 3, 'A'),
(96, 132, 'BSCS-DS', 3, 'A'),
(97, 133, 'BSCS-DS', 3, 'A'),
(98, 134, 'BSCS-DS', 3, 'A'),
(99, 135, 'BSCS-DS', 4, 'A'),
(100, 135, 'BSCS-DS', 4, 'B'),
(101, 136, 'BSCS-DS', 4, 'A'),
(102, 136, 'BSCS-DS', 4, 'B');

-- --------------------------------------------------------

--
-- Table structure for table `classcode`
--

CREATE TABLE `classcode` (
  `code_id` int(11) NOT NULL,
  `course` varchar(255) DEFAULT NULL,
  `class_code` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classcode`
--

INSERT INTO `classcode` (`code_id`, `course`, `class_code`) VALUES
(19, 'CC 1101 Programming 1', 101),
(20, 'CC 1101 Programming 1', 102),
(21, 'CC 1101 Programming 1', 103),
(22, 'CC 1101 Programming 1', 104),
(23, 'CC 2103 Data Structures and Algorithm', 213),
(24, 'CC 2103 Data Structures and Algorithm', 111),
(25, 'CC 1101 Programming 1', 105),
(26, 'CC 1101 Programming 1', 106),
(27, 'CC 1101 Programming 1', 107),
(28, 'CC 1101 Programming 1', 108),
(29, 'CC 1101 Programming 1', 109);

-- --------------------------------------------------------

--
-- Table structure for table `classhandle`
--

CREATE TABLE `classhandle` (
  `id` int(11) NOT NULL,
  `prof` varchar(255) NOT NULL,
  `class_codes` int(255) DEFAULT NULL,
  `total` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classhandle`
--

INSERT INTO `classhandle` (`id`, `prof`, `class_codes`, `total`) VALUES
(1, 'Bea Belarmino', 322, 3);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(30) NOT NULL,
  `course_name` varchar(40) NOT NULL,
  `units` int(20) NOT NULL,
  `duration` int(80) NOT NULL,
  `ftf` int(11) DEFAULT NULL,
  `online` int(11) DEFAULT NULL,
  `lab` int(11) DEFAULT NULL,
  `sem` int(11) DEFAULT NULL,
  `yearLevel` enum('1','2','3','4') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_code`, `course_name`, `units`, `duration`, `ftf`, `online`, `lab`, `sem`, `yearLevel`) VALUES
(105, 'CC 1202', 'Computer Programming 2', 3, 5, 2, 1, 2, 2, '1'),
(106, 'IT 1201', 'Discrete Math', 3, 3, 2, 1, 0, 2, '1'),
(108, 'CS 1201', 'Discrete Structure', 3, 3, 2, 1, 0, 2, '1'),
(109, 'IT 2206', 'DBMS', 3, 5, 2, 1, 2, 2, '2'),
(110, 'IT 2207', 'OOP', 3, 5, 2, 1, 2, 2, '2'),
(111, 'IT 2208', 'Quantitative', 3, 3, 2, 1, 0, 2, '2'),
(112, 'IT 2209', 'Social and Professional Issue', 3, 3, 2, 1, 0, 2, '2'),
(113, 'IT 2210', 'HCI 2', 3, 5, 2, 1, 2, 2, '2'),
(114, 'IT 2211', 'Integrative Programming and Technologies', 3, 5, 2, 1, 2, 2, '2'),
(115, 'CS 2206', 'DBMS', 3, 5, 2, 1, 2, 2, '2'),
(116, 'CS 2207', 'OOP', 3, 5, 2, 1, 2, 2, '2'),
(117, 'CS 2208', 'Math for Data Science', 3, 5, 2, 1, 2, 2, '2'),
(118, 'CS 2209', 'Algorithm and Complexity', 3, 5, 2, 1, 2, 2, '2'),
(119, 'CS 2210', 'Programming 3', 3, 5, 2, 1, 2, 2, '2'),
(120, 'CS 2211', 'Data Science in Practice', 3, 5, 2, 1, 2, 2, '2'),
(121, 'IT 3217', 'Information Assurance and Security 2', 3, 5, 2, 1, 2, 2, '3'),
(122, 'IT 3218', 'Platform Technologies', 3, 3, 2, 1, 0, 2, '3'),
(123, 'IT 3219', 'Capstone 1', 3, 3, 2, 1, 0, 2, '3'),
(124, 'BA 3203', 'Fundamental of Enterprise', 3, 5, 2, 1, 2, 2, '3'),
(125, 'BA 3204', 'Analytics Technique and Tools', 3, 5, 2, 1, 2, 2, '3'),
(126, 'BA 3205', 'Analytics App', 3, 5, 2, 1, 2, 2, '3'),
(127, 'SD 3203', 'Software Engineering 2', 3, 5, 2, 1, 2, 2, '3'),
(128, 'SD 3204', 'IT Project Management', 3, 3, 2, 1, 0, 2, '3'),
(129, 'CS 3216', 'Programming languages', 3, 5, 2, 1, 2, 2, '3'),
(130, 'CS 3217', 'Software Engineering 2', 3, 3, 2, 1, 0, 2, '3'),
(131, 'CS 3218', 'Social Issues and Practices', 3, 3, 2, 1, 0, 2, '3'),
(132, 'CS 3219', 'Introduction to AI', 3, 5, 2, 1, 2, 2, '3'),
(133, 'CS 3220', 'Operating System', 3, 5, 2, 1, 2, 2, '3'),
(134, 'DS 3202', 'Machine Learning', 3, 5, 2, 1, 2, 2, '3'),
(135, 'CS 4224', 'Thesis 2', 3, 3, 2, 1, 0, 2, '4'),
(136, 'DS 4203', 'Natural Language Processing', 3, 5, 2, 1, 2, 2, '4');

--
-- Triggers `courses`
--
DELIMITER $$
CREATE TRIGGER `update_courses_trigger` AFTER UPDATE ON `courses` FOR EACH ROW BEGIN
    IF NEW.course_code <> OLD.course_code OR NEW.course_name <> OLD.course_name THEN
        -- Your logic for updating course details goes here
        UPDATE courses
        SET
            course_code = NEW.course_code,
            course_name = NEW.course_name,
            units = NEW.units,
            sem = NEW.sem,
            duration = NEW.duration,
            ftf = NEW.ftf,
            online = NEW.online,
            lab = NEW.lab
        WHERE course_code = OLD.course_code AND course_name = OLD.course_name;
        
        -- Your additional logic goes here if needed
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `monitor_class`
--

CREATE TABLE `monitor_class` (
  `id` int(11) NOT NULL,
  `prof_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `assign_block` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('michellesoliman002@gmail.com', 'GLvMxCKJ5IhMpHI1m6HjlsybzWxqt5Wb', '2023-11-28 14:36:33'),
('michellesoliman002@gmail.com', 'tSogAylxhF9gckl3dyZuuNJbWngVkk82', '2023-11-28 14:41:29'),
('michellesoliman002@gmail.com', '4Ui0Jpnv0LTLfAJdrh936rWLMxusC9CY', '2023-12-17 13:40:26'),
('michellesoliman002@gmail.com', 'iesew2lIRfenCHsrYKFsG8momrer9MyR', '2023-12-17 13:40:37'),
('michellesoliman002@gmail.com', 'Opx6x9XEkjSvuNia4mUhX0L9IRS8hcWR', '2023-12-17 13:40:37'),
('michellesoliman002@gmail.com', 'ro1iN8YE6bC9vbyORPmr8YPmVnO8TzdB', '2023-12-17 13:40:38'),
('michellesoliman002@gmail.com', 'Kqy4ogSeNLnTMFAZGfO32hpKAJS3pMmV', '2023-12-17 13:40:38'),
('michellesoliman002@gmail.com', 'nanoyhlxQImCYmFO21XDqxsMZmYukLiV', '2023-12-17 13:40:38'),
('michellesoliman002@gmail.com', 'ejNtfWb1ope7isLnTWo6pGPWPVDCEwhl', '2023-12-17 13:40:49'),
('michellesoliman002@gmail.com', '9rbjfxIxtQSvCobmeZ7wg2azqD97YcXv', '2024-02-05 06:50:14'),
('michellesoliman002@gmail.com', 'gc4q1vsMG7MSlhiKeECc5xNAKrhPU2V9', '2024-02-05 06:50:17'),
('michellesoliman002@gmail.com', 'DnD3oZnAtKD25ly8mMKfl4hgpSmJTwEQ', '2024-02-05 06:53:04');

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(11) NOT NULL,
  `program` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program`) VALUES
(1, 'BSCS'),
(2, 'BSCS-DS'),
(3, 'BSIT-SD'),
(4, 'BSIT-BA');

-- --------------------------------------------------------

--
-- Table structure for table `program_course_assignment_reference`
--

CREATE TABLE `program_course_assignment_reference` (
  `id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `program` varchar(50) NOT NULL,
  `year` int(50) NOT NULL,
  `block` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_course_assignment_reference`
--

INSERT INTO `program_course_assignment_reference` (`id`, `User_id`, `course_id`, `program`, `year`, `block`) VALUES
(421, 46, 108, 'BSCS-DS', 1, 'A'),
(422, 46, 108, 'BSCS-DS', 1, 'B'),
(423, 46, 108, 'BSCS-DS', 1, 'C'),
(424, 38, 108, 'BSCS-DS', 1, 'A'),
(425, 38, 108, 'BSCS-DS', 1, 'B'),
(426, 38, 108, 'BSCS-DS', 1, 'C'),
(427, 46, 112, 'BSIT-BA', 2, 'A'),
(428, 46, 112, 'BSIT-BA', 2, 'B'),
(429, 46, 112, 'BSIT-SD', 2, 'A'),
(430, 46, 112, 'BSIT-SD', 2, 'B'),
(431, 46, 112, 'BSIT-SD', 2, 'C'),
(432, 34, 105, 'BSCS-DS', 1, 'A'),
(433, 34, 105, 'BSCS-DS', 1, 'B'),
(434, 34, 105, 'BSCS-DS', 1, 'C'),
(435, 34, 105, 'BSIT-BA', 1, 'A'),
(436, 34, 105, 'BSIT-BA', 1, 'B'),
(437, 34, 105, 'BSIT-SD', 1, 'A'),
(438, 34, 105, 'BSIT-SD', 1, 'B'),
(439, 34, 105, 'BSIT-SD', 1, 'C'),
(440, 34, 105, 'BSIT-SD', 1, 'D'),
(441, 42, 105, 'BSCS-DS', 1, 'A'),
(442, 42, 105, 'BSCS-DS', 1, 'B'),
(443, 42, 105, 'BSCS-DS', 1, 'C'),
(444, 42, 105, 'BSIT-BA', 1, 'A'),
(445, 42, 105, 'BSIT-BA', 1, 'B'),
(446, 42, 105, 'BSIT-SD', 1, 'A'),
(447, 42, 105, 'BSIT-SD', 1, 'B'),
(448, 42, 105, 'BSIT-SD', 1, 'C'),
(449, 42, 105, 'BSIT-SD', 1, 'D'),
(450, 32, 105, 'BSCS-DS', 1, 'A'),
(451, 32, 105, 'BSCS-DS', 1, 'B'),
(452, 32, 105, 'BSCS-DS', 1, 'C'),
(453, 32, 105, 'BSIT-BA', 1, 'A'),
(454, 32, 105, 'BSIT-BA', 1, 'B'),
(455, 32, 105, 'BSIT-SD', 1, 'A'),
(456, 32, 105, 'BSIT-SD', 1, 'B'),
(457, 32, 105, 'BSIT-SD', 1, 'C'),
(458, 32, 105, 'BSIT-SD', 1, 'D'),
(459, 44, 105, 'BSCS-DS', 1, 'A'),
(460, 44, 105, 'BSCS-DS', 1, 'B'),
(461, 44, 105, 'BSCS-DS', 1, 'C'),
(462, 44, 105, 'BSIT-BA', 1, 'A'),
(463, 44, 105, 'BSIT-BA', 1, 'B'),
(464, 44, 105, 'BSIT-SD', 1, 'A'),
(465, 44, 105, 'BSIT-SD', 1, 'B'),
(466, 44, 105, 'BSIT-SD', 1, 'C'),
(467, 44, 105, 'BSIT-SD', 1, 'D'),
(468, 31, 124, 'BSIT-BA', 3, 'A'),
(469, 31, 124, 'BSIT-BA', 3, 'B'),
(470, 31, 125, 'BSIT-BA', 3, 'A'),
(471, 31, 125, 'BSIT-BA', 3, 'B'),
(472, 31, 113, 'BSIT-BA', 2, 'A'),
(473, 31, 113, 'BSIT-BA', 2, 'B'),
(474, 31, 113, 'BSIT-SD', 2, 'A'),
(475, 31, 113, 'BSIT-SD', 2, 'B'),
(476, 31, 113, 'BSIT-SD', 2, 'C'),
(477, 31, 114, 'BSIT-SD', 2, 'A'),
(478, 31, 114, 'BSIT-SD', 2, 'B'),
(479, 31, 114, 'BSIT-SD', 2, 'C'),
(480, 31, 114, 'BSIT-BA', 2, 'A'),
(481, 31, 114, 'BSIT-BA', 2, 'B'),
(482, 37, 121, 'BSIT-BA', 3, 'A'),
(483, 37, 121, 'BSIT-BA', 3, 'B'),
(484, 37, 121, 'BSIT-SD', 3, 'A'),
(485, 37, 121, 'BSIT-SD', 3, 'B'),
(486, 37, 121, 'BSIT-SD', 3, 'C'),
(487, 38, 121, 'BSIT-BA', 3, 'A'),
(488, 38, 121, 'BSIT-BA', 3, 'B'),
(489, 38, 121, 'BSIT-SD', 3, 'A'),
(490, 38, 121, 'BSIT-SD', 3, 'B'),
(491, 38, 121, 'BSIT-SD', 3, 'C'),
(492, 43, 121, 'BSIT-BA', 3, 'A'),
(493, 43, 121, 'BSIT-BA', 3, 'B'),
(494, 43, 121, 'BSIT-SD', 3, 'A'),
(495, 43, 121, 'BSIT-SD', 3, 'B'),
(496, 43, 121, 'BSIT-SD', 3, 'C'),
(497, 34, 106, 'BSIT-BA', 1, 'A'),
(498, 34, 106, 'BSIT-BA', 1, 'B'),
(499, 34, 106, 'BSIT-SD', 1, 'A'),
(500, 34, 106, 'BSIT-SD', 1, 'B'),
(501, 34, 106, 'BSIT-SD', 1, 'C'),
(502, 34, 106, 'BSIT-SD', 1, 'D'),
(503, 32, 109, 'BSIT-BA', 2, 'A'),
(504, 32, 109, 'BSIT-BA', 2, 'B'),
(505, 32, 109, 'BSIT-SD', 2, 'A'),
(506, 32, 109, 'BSIT-SD', 2, 'B'),
(507, 32, 109, 'BSIT-SD', 2, 'C'),
(508, 37, 109, 'BSIT-BA', 2, 'A'),
(509, 37, 109, 'BSIT-BA', 2, 'B'),
(510, 37, 109, 'BSIT-SD', 2, 'A'),
(511, 37, 109, 'BSIT-SD', 2, 'B'),
(512, 37, 109, 'BSIT-SD', 2, 'C'),
(513, 43, 130, 'BSCS-DS', 3, 'A'),
(514, 45, 112, 'BSIT-BA', 2, 'A'),
(515, 45, 112, 'BSIT-BA', 2, 'B'),
(516, 45, 112, 'BSIT-SD', 2, 'A'),
(517, 45, 112, 'BSIT-SD', 2, 'B'),
(518, 45, 112, 'BSIT-SD', 2, 'C'),
(519, 35, 110, 'BSIT-BA', 2, 'A'),
(520, 35, 110, 'BSIT-BA', 2, 'B'),
(521, 35, 110, 'BSIT-SD', 2, 'A'),
(522, 35, 110, 'BSIT-SD', 2, 'B'),
(523, 35, 110, 'BSIT-SD', 2, 'C'),
(524, 35, 116, 'BSCS-DS', 2, 'A'),
(525, 35, 116, 'BSCS-DS', 2, 'B'),
(526, 39, 118, 'BSCS-DS', 2, 'A'),
(527, 39, 118, 'BSCS-DS', 2, 'B'),
(528, 40, 119, 'BSCS-DS', 2, 'A'),
(529, 40, 119, 'BSCS-DS', 2, 'B'),
(530, 40, 129, 'BSCS-DS', 3, 'A'),
(531, 40, 126, 'BSIT-BA', 3, 'A'),
(532, 40, 126, 'BSIT-BA', 3, 'B'),
(533, 40, 106, 'BSIT-BA', 1, 'A'),
(534, 40, 106, 'BSIT-BA', 1, 'B'),
(535, 40, 106, 'BSIT-SD', 1, 'A'),
(536, 40, 106, 'BSIT-SD', 1, 'B'),
(537, 40, 106, 'BSIT-SD', 1, 'C'),
(538, 40, 106, 'BSIT-SD', 1, 'D'),
(539, 39, 120, 'BSCS-DS', 2, 'A'),
(540, 39, 120, 'BSCS-DS', 2, 'B'),
(541, 41, 135, 'BSCS-DS', 4, 'A'),
(542, 41, 135, 'BSCS-DS', 4, 'B'),
(543, 41, 123, 'BSIT-BA', 3, 'A'),
(544, 41, 123, 'BSIT-BA', 3, 'B'),
(545, 41, 123, 'BSIT-SD', 3, 'A'),
(546, 41, 123, 'BSIT-SD', 3, 'B'),
(547, 41, 123, 'BSIT-SD', 3, 'C'),
(548, 44, 106, 'BSIT-BA', 1, 'A'),
(549, 44, 106, 'BSIT-BA', 1, 'B'),
(550, 44, 106, 'BSIT-SD', 1, 'A'),
(551, 44, 106, 'BSIT-SD', 1, 'B'),
(552, 44, 106, 'BSIT-SD', 1, 'C'),
(553, 44, 106, 'BSIT-SD', 1, 'D'),
(554, 44, 122, 'BSIT-BA', 3, 'A'),
(555, 44, 122, 'BSIT-BA', 3, 'B'),
(556, 44, 122, 'BSIT-SD', 3, 'A'),
(557, 44, 122, 'BSIT-SD', 3, 'B'),
(558, 44, 122, 'BSIT-SD', 3, 'C'),
(559, 44, 111, 'BSIT-SD', 2, 'A'),
(560, 44, 111, 'BSIT-SD', 2, 'B'),
(561, 44, 111, 'BSIT-SD', 2, 'C'),
(562, 44, 111, 'BSIT-BA', 2, 'A'),
(563, 44, 111, 'BSIT-BA', 2, 'B'),
(564, 38, 127, 'BSIT-SD', 3, 'A'),
(565, 38, 127, 'BSIT-SD', 3, 'B'),
(566, 38, 127, 'BSIT-SD', 3, 'C'),
(567, 43, 132, 'BSCS-DS', 3, 'A'),
(568, 35, 136, 'BSCS-DS', 4, 'A'),
(569, 35, 136, 'BSCS-DS', 4, 'B'),
(570, 35, 115, 'BSCS-DS', 2, 'A'),
(571, 35, 115, 'BSCS-DS', 2, 'B'),
(572, 42, 133, 'BSCS-DS', 3, 'A'),
(573, 37, 134, 'BSCS-DS', 3, 'A'),
(574, 43, 117, 'BSCS-DS', 2, 'A'),
(575, 43, 117, 'BSCS-DS', 2, 'B'),
(576, 42, 131, 'BSCS-DS', 3, 'A'),
(577, 37, 110, 'BSIT-BA', 2, 'A'),
(578, 37, 110, 'BSIT-BA', 2, 'B'),
(579, 37, 110, 'BSIT-SD', 2, 'A'),
(580, 37, 110, 'BSIT-SD', 2, 'B'),
(581, 37, 110, 'BSIT-SD', 2, 'C'),
(582, 38, 109, 'BSIT-BA', 2, 'A'),
(583, 38, 109, 'BSIT-BA', 2, 'B'),
(584, 38, 109, 'BSIT-SD', 2, 'A'),
(585, 38, 109, 'BSIT-SD', 2, 'B'),
(586, 38, 109, 'BSIT-SD', 2, 'C'),
(587, 43, 113, 'BSIT-BA', 2, 'A'),
(588, 43, 113, 'BSIT-BA', 2, 'B'),
(589, 43, 113, 'BSIT-SD', 2, 'A'),
(590, 43, 113, 'BSIT-SD', 2, 'B'),
(591, 43, 113, 'BSIT-SD', 2, 'C'),
(592, 36, 122, 'BSIT-BA', 3, 'A'),
(593, 36, 122, 'BSIT-BA', 3, 'B'),
(594, 36, 122, 'BSIT-SD', 3, 'A'),
(595, 36, 122, 'BSIT-SD', 3, 'B'),
(596, 36, 122, 'BSIT-SD', 3, 'C'),
(597, 36, 111, 'BSIT-SD', 2, 'A'),
(598, 36, 111, 'BSIT-SD', 2, 'B'),
(599, 36, 111, 'BSIT-SD', 2, 'C'),
(600, 36, 111, 'BSIT-BA', 2, 'A'),
(601, 36, 111, 'BSIT-BA', 2, 'B'),
(602, 33, 110, 'BSIT-BA', 2, 'A'),
(603, 33, 110, 'BSIT-BA', 2, 'B'),
(604, 33, 110, 'BSIT-SD', 2, 'A'),
(605, 33, 110, 'BSIT-SD', 2, 'B'),
(606, 33, 110, 'BSIT-SD', 2, 'C'),
(607, 33, 113, 'BSIT-BA', 2, 'A'),
(608, 33, 113, 'BSIT-BA', 2, 'B'),
(609, 33, 113, 'BSIT-SD', 2, 'A'),
(610, 33, 113, 'BSIT-SD', 2, 'B'),
(611, 33, 113, 'BSIT-SD', 2, 'C'),
(612, 33, 114, 'BSIT-SD', 2, 'A'),
(613, 33, 114, 'BSIT-SD', 2, 'B'),
(614, 33, 114, 'BSIT-SD', 2, 'C'),
(615, 33, 114, 'BSIT-BA', 2, 'A'),
(616, 33, 114, 'BSIT-BA', 2, 'B'),
(617, 34, 114, 'BSIT-SD', 2, 'A'),
(618, 34, 114, 'BSIT-SD', 2, 'B'),
(619, 34, 114, 'BSIT-SD', 2, 'C'),
(620, 34, 114, 'BSIT-BA', 2, 'A'),
(621, 34, 114, 'BSIT-BA', 2, 'B'),
(622, 46, 111, 'BSIT-SD', 2, 'A'),
(623, 46, 111, 'BSIT-SD', 2, 'B'),
(624, 46, 111, 'BSIT-SD', 2, 'C'),
(625, 46, 111, 'BSIT-BA', 2, 'A'),
(626, 46, 111, 'BSIT-BA', 2, 'B'),
(627, 33, 122, 'BSIT-BA', 3, 'A'),
(628, 33, 122, 'BSIT-BA', 3, 'B'),
(629, 33, 122, 'BSIT-SD', 3, 'A'),
(630, 33, 122, 'BSIT-SD', 3, 'B'),
(631, 33, 122, 'BSIT-SD', 3, 'C'),
(637, 36, 112, 'BSIT-BA', 2, 'A'),
(638, 36, 112, 'BSIT-BA', 2, 'B'),
(639, 36, 112, 'BSIT-SD', 2, 'A'),
(640, 36, 112, 'BSIT-SD', 2, 'B'),
(641, 36, 112, 'BSIT-SD', 2, 'C'),
(648, 30, 128, 'BSIT-SD', 3, 'A'),
(649, 30, 128, 'BSIT-SD', 3, 'B'),
(650, 30, 128, 'BSIT-SD', 3, 'C');

-- --------------------------------------------------------

--
-- Table structure for table `program_course_mapping`
--

CREATE TABLE `program_course_mapping` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `program` varchar(255) NOT NULL,
  `year_level` int(11) NOT NULL,
  `blocks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `program_course_mapping`
--

INSERT INTO `program_course_mapping` (`id`, `course_id`, `program`, `year_level`, `blocks`) VALUES
(123, 105, 'BSCS-DS', 1, 3),
(124, 105, 'BSIT-BA', 1, 2),
(125, 105, 'BSIT-SD', 1, 4),
(126, 106, 'BSIT-BA', 1, 2),
(127, 106, 'BSIT-SD', 1, 4),
(128, 108, 'BSCS-DS', 1, 3),
(129, 109, 'BSIT-BA', 2, 2),
(130, 109, 'BSIT-SD', 2, 3),
(131, 110, 'BSIT-BA', 2, 2),
(132, 110, 'BSIT-SD', 2, 3),
(133, 111, 'BSIT-SD', 2, 3),
(134, 111, 'BSIT-BA', 2, 2),
(135, 112, 'BSIT-BA', 2, 2),
(136, 112, 'BSIT-SD', 2, 3),
(137, 113, 'BSIT-BA', 2, 2),
(138, 113, 'BSCS-DS', 2, 2),
(139, 113, 'BSIT-SD', 2, 3),
(140, 114, 'BSIT-SD', 2, 3),
(141, 114, 'BSIT-BA', 2, 2),
(142, 115, 'BSCS-DS', 2, 2),
(143, 116, 'BSCS-DS', 2, 2),
(144, 117, 'BSCS-DS', 2, 2),
(145, 118, 'BSCS-DS', 2, 2),
(146, 119, 'BSCS-DS', 2, 2),
(147, 120, 'BSCS-DS', 2, 2),
(148, 121, 'BSIT-BA', 3, 2),
(149, 121, 'BSIT-SD', 3, 3),
(150, 122, 'BSIT-BA', 3, 2),
(151, 122, 'BSIT-SD', 3, 3),
(152, 123, 'BSIT-BA', 3, 2),
(153, 123, 'BSIT-SD', 3, 3),
(154, 124, 'BSIT-BA', 3, 2),
(155, 125, 'BSIT-BA', 3, 2),
(156, 126, 'BSIT-BA', 3, 2),
(157, 127, 'BSIT-SD', 3, 3),
(158, 128, 'BSIT-SD', 3, 3),
(159, 129, 'BSCS-DS', 3, 1),
(160, 130, 'BSCS-DS', 3, 1),
(161, 131, 'BSCS-DS', 3, 1),
(162, 132, 'BSCS-DS', 3, 1),
(163, 133, 'BSCS-DS', 3, 1),
(164, 134, 'BSCS-DS', 3, 1),
(165, 135, 'BSCS-DS', 4, 2),
(166, 136, 'BSCS-DS', 4, 2);

--
-- Triggers `program_course_mapping`
--
DELIMITER $$
CREATE TRIGGER `after_insert_program_mapping` AFTER INSERT ON `program_course_mapping` FOR EACH ROW BEGIN
    DECLARE program_block VARCHAR(255);
    DECLARE block_num INT;
    DECLARE i INT;

    -- Get the block value
    SET block_num = NEW.blocks;

    -- Loop to insert for each block letter
    SET i = 1;
    WHILE i <= block_num DO
        -- Calculate the corresponding block letter
        SET program_block = CHAR(64 + i);

        -- Insert into block_course_assignment
        INSERT INTO block_course_assignment (course_id, program, year, block)
        VALUES (NEW.course_id, NEW.program, NEW.year_level, program_block);

        -- Increment the loop counter
        SET i = i + 1;
    END WHILE;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `min_hour` int(100) DEFAULT NULL,
  `max_hour` int(100) DEFAULT NULL,
  `min_prep` int(20) DEFAULT NULL,
  `max_prep` int(20) DEFAULT NULL,
  `days` int(20) DEFAULT NULL,
  `laboratory` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`role_id`, `role`, `min_hour`, `max_hour`, `min_prep`, `max_prep`, `days`, `laboratory`) VALUES
(1, 'Dean', 6, 6, 1, 2, 5, 'No'),
(2, 'Program Chair', 24, 25, 2, 4, 5, 'Yes'),
(3, 'CSO', 15, 20, 2, 3, 5, 'Yes'),
(4, 'New Teacher', 24, 25, 2, 3, 5, 'Yes'),
(5, 'Professor', 24, 27, 2, 4, 5, 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `roomName` varchar(30) NOT NULL,
  `location` varchar(40) NOT NULL,
  `capacity` int(60) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `roomName`, `location`, `capacity`, `type`) VALUES
(8, 'NB 303', 'New Building', 50, 'Regular'),
(18, 'NB 306', 'New Building', 50, 'Laboratory'),
(19, 'NB 307', 'New Building', 45, 'Laboratory'),
(27, 'NB 304', 'New Building', 50, 'Regular'),
(32, 'NB 308', 'New Building', 40, 'Laboratory');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `block` varchar(100) NOT NULL,
  `day` varchar(255) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(50) NOT NULL,
  `type` enum('Lab','Online','Face-to-Face') NOT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `semester_id` int(11) NOT NULL,
  `sem` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`semester_id`, `sem`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `specialization`
--

CREATE TABLE `specialization` (
  `specialization_id` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specialization`
--

INSERT INTO `specialization` (`specialization_id`, `User_id`, `course_id`) VALUES
(270, 46, 108),
(271, 38, 108),
(272, 46, 112),
(273, 34, 105),
(274, 42, 105),
(275, 32, 105),
(276, 44, 105),
(277, 31, 124),
(278, 31, 125),
(279, 31, 113),
(280, 31, 114),
(281, 37, 121),
(282, 38, 121),
(283, 43, 121),
(284, 34, 106),
(285, 32, 109),
(286, 37, 109),
(287, 43, 130),
(288, 45, 112),
(289, 35, 110),
(290, 35, 116),
(291, 39, 118),
(292, 40, 119),
(293, 40, 129),
(294, 40, 126),
(295, 40, 106),
(296, 39, 120),
(297, 41, 135),
(298, 41, 123),
(299, 44, 106),
(300, 44, 122),
(301, 44, 111),
(302, 38, 127),
(303, 43, 132),
(304, 35, 136),
(305, 35, 115),
(306, 42, 133),
(307, 37, 134),
(308, 43, 117),
(309, 42, 131),
(310, 37, 110),
(311, 38, 109),
(312, 43, 113),
(313, 36, 122),
(314, 36, 111),
(315, 33, 110),
(316, 33, 113),
(317, 33, 114),
(318, 34, 114),
(319, 46, 111),
(320, 33, 122),
(322, 36, 112),
(325, 30, 128);

--
-- Triggers `specialization`
--
DELIMITER $$
CREATE TRIGGER `after_insert_specialization` AFTER INSERT ON `specialization` FOR EACH ROW BEGIN
    DECLARE program_name VARCHAR(50);
    DECLARE year_val INT(50);
    DECLARE block_name VARCHAR(20);
    DECLARE done INT DEFAULT FALSE;

    DECLARE cur CURSOR FOR
        SELECT program, year, block
        FROM block_course_assignment
        WHERE course_id = NEW.course_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    fetch_cur: LOOP
        FETCH cur INTO program_name, year_val, block_name;
        IF done THEN
            LEAVE fetch_cur;
        END IF;

        INSERT INTO program_course_assignment_reference (User_id, course_id, program, year, block)
        VALUES (NEW.User_id, NEW.course_id, program_name, year_val, block_name);
    END LOOP;

    CLOSE cur;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `delete_program_course_assignment` AFTER DELETE ON `specialization` FOR EACH ROW BEGIN
  DELETE FROM program_course_assignment_reference 
  WHERE User_id = OLD.User_id AND course_id = OLD.course_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `summer`
--

CREATE TABLE `summer` (
  `id` int(11) NOT NULL,
  `User_id` int(50) NOT NULL,
  `course_id` int(50) NOT NULL,
  `slot` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `summer`
--

INSERT INTO `summer` (`id`, `User_id`, `course_id`, `slot`) VALUES
(17, 34, 105, 1),
(18, 41, 123, 1),
(19, 38, 108, 2),
(20, 37, 134, 1),
(21, 43, 132, 1),
(22, 40, 106, 1);

-- --------------------------------------------------------

--
-- Table structure for table `summer_sched`
--

CREATE TABLE `summer_sched` (
  `summer_id` int(50) NOT NULL,
  `id` int(50) NOT NULL,
  `block` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `day` varchar(100) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `start` year(4) NOT NULL,
  `end` year(4) NOT NULL,
  `sem` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `summer_sched`
--

INSERT INTO `summer_sched` (`summer_id`, `id`, `block`, `type`, `day`, `start_time`, `end_time`, `room`, `color`, `start`, `end`, `sem`) VALUES
(20, 17, 'A', 'ftf', 'Thursday', '07:00:00', '09:00:00', 'NB 307', 'rgba(217,132,97,0.5)', '2023', '2024', '2'),
(21, 17, 'A', 'online', 'Friday', '11:00:00', '12:00:00', NULL, 'rgba(217,132,97,0.5)', '2023', '2024', '2'),
(22, 17, 'A', 'lab', 'Friday', '07:00:00', '09:00:00', 'NB 303', 'rgba(217,132,97,0.5)', '2023', '2024', '2'),
(23, 18, 'A', 'ftf', 'Monday', '11:00:00', '01:00:00', 'NB 306', 'rgba(157,14,53,0.5)', '2023', '2024', '2'),
(24, 18, 'A', 'online', 'Thursday', '07:00:00', '08:00:00', NULL, 'rgba(157,14,53,0.5)', '2023', '2024', '2'),
(25, 19, 'A', 'ftf', 'Monday', '09:00:00', '11:00:00', 'NB 307', 'rgba(174,201,181,0.5)', '2023', '2024', '2'),
(26, 19, 'A', 'online', 'Friday', '11:00:00', '12:00:00', NULL, 'rgba(174,201,181,0.5)', '2023', '2024', '2'),
(27, 19, 'B', 'ftf', 'Wednesday', '07:00:00', '09:00:00', 'NB 306', 'rgba(146,84,94,0.5)', '2023', '2024', '2'),
(28, 19, 'B', 'online', 'Monday', '11:00:00', '12:00:00', NULL, 'rgba(146,84,94,0.5)', '2023', '2024', '2'),
(31, 20, 'A', 'ftf', 'Tuesday', '01:00:00', '03:00:00', 'NB 303', 'rgba(24,20,221,0.5)', '2023', '2024', '2'),
(32, 20, 'A', 'online', 'Tuesday', '07:00:00', '08:00:00', NULL, 'rgba(24,20,221,0.5)', '2023', '2024', '2'),
(33, 20, 'A', 'lab', 'Monday', '11:00:00', '01:00:00', 'NB 304', 'rgba(24,20,221,0.5)', '2023', '2024', '2'),
(34, 21, 'A', 'ftf', 'Thursday', '11:00:00', '01:00:00', 'NB 303', 'rgba(11,251,5,0.5)', '2023', '2024', '2'),
(35, 21, 'A', 'online', 'Monday', '01:00:00', '02:00:00', NULL, 'rgba(11,251,5,0.5)', '2023', '2024', '2'),
(36, 21, 'A', 'lab', 'Wednesday', '11:00:00', '01:00:00', 'NB 307', 'rgba(11,251,5,0.5)', '2023', '2024', '2'),
(37, 22, 'A', 'ftf', 'Monday', '01:00:00', '03:00:00', 'NB 307', 'rgba(217,175,8,0.5)', '2023', '2024', '2'),
(38, 22, 'A', 'online', 'Monday', '07:00:00', '08:00:00', NULL, 'rgba(217,175,8,0.5)', '2023', '2024', '2'),
(39, 23, 'A', 'ftf', 'Thursday', '07:00:00', '09:00:00', 'NB 306', 'rgba(57,133,100,0.5)', '2023', '2024', '2'),
(40, 23, 'A', 'online', 'Friday', '01:00:00', '02:00:00', NULL, 'rgba(57,133,100,0.5)', '2023', '2024', '2'),
(41, 23, 'A', 'lab', 'Thursday', '07:00:00', '09:00:00', 'NB 307', 'rgba(57,133,100,0.5)', '2023', '2024', '2'),
(48, 26, 'A', 'ftf', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(49, 26, 'A', 'online', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(50, 26, 'A', 'lab', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(51, 27, 'A', 'ftf', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(52, 27, 'A', 'online', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(53, 27, 'A', 'lab', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(54, 28, 'A', 'ftf', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(55, 28, 'A', 'online', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(56, 29, 'A', 'ftf', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(57, 29, 'A', 'online', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(58, 29, 'A', 'lab', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(59, 30, 'A', 'ftf', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(60, 30, 'A', 'online', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(61, 30, 'A', 'lab', NULL, NULL, NULL, NULL, NULL, '0000', '0000', ''),
(62, 31, 'A', 'ftf', 'Thursday', '07:00:00', '09:00:00', 'NB 306', 'rgba(27,134,130,0.5)', '2023', '2024', '2'),
(63, 31, 'A', 'online', 'Wednesday', '11:00:00', '12:00:00', NULL, 'rgba(27,134,130,0.5)', '2023', '2024', '2'),
(64, 31, 'A', 'lab', 'Friday', '01:00:00', '03:00:00', 'NB 304', 'rgba(27,134,130,0.5)', '2023', '2024', '2');

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `unit_id` int(11) NOT NULL,
  `min_hour` int(50) NOT NULL,
  `max_hour` int(50) NOT NULL,
  `min_prep` int(50) NOT NULL,
  `max_prep` int(50) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`unit_id`, `min_hour`, `max_hour`, `min_prep`, `max_prep`, `type`) VALUES
(1, 6, 6, 1, 2, 'No'),
(2, 24, 30, 2, 4, 'Yes'),
(3, 24, 30, 2, 3, 'Yes'),
(4, 24, 30, 2, 3, 'Yes'),
(5, 24, 30, 2, 4, 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `university_info`
--

CREATE TABLE `university_info` (
  `id` int(11) NOT NULL,
  `universityLogo` varchar(255) DEFAULT NULL,
  `departmentLogo` varchar(255) DEFAULT NULL,
  `telephoneNumber` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `barangay` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `schoolName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `university_info`
--

INSERT INTO `university_info` (`id`, `universityLogo`, `departmentLogo`, `telephoneNumber`, `address`, `barangay`, `province`, `schoolName`) VALUES
(9, 'uploads/1701507670401.jpg', 'uploads/1701507670403.png', '2842-321', 'Laguna Sports Complex', 'Bubukal', 'Laguna', 'Laguna University');

-- --------------------------------------------------------

--
-- Table structure for table `userdata`
--

CREATE TABLE `userdata` (
  `user_id` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userdata`
--

INSERT INTO `userdata` (`user_id`, `firstName`, `middleName`, `lastName`, `email`, `images`, `role`) VALUES
(41, 'McJosh', 'Agonia', 'De Lima', 'michellesoliman002@gmail.com', 'uploads/1701007378207.jpg', 'Program Chair'),
(43, 'Marlon', 'Lacson', 'Atanacio', 'marlon@gmail.com', 'uploads/1701101856645.jpg', 'Dean');

-- --------------------------------------------------------

--
-- Table structure for table `userlogin`
--

CREATE TABLE `userlogin` (
  `user_id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userlogin`
--

INSERT INTO `userlogin` (`user_id`, `username`, `password`) VALUES
(41, 'mcjosh', '$2b$10$saZQMcteVAex/QSrC5G2MeIW2gwZxaKUP.ryYPRLjOmPrx.xWSkfO'),
(43, 'admin', '$2b$10$3UD1iLJyxrC5KXmN1W9I7eiWIFnUsLUFHF5JwgA17FGkMcZWaOw3G');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `mname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) NOT NULL,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_id`, `fname`, `mname`, `lname`, `role`) VALUES
(30, 'Vinboy Abraham', 'C', 'Luyon', 5),
(31, 'James Aaron', 'F', 'Guevarra', 5),
(32, 'Patrecia', 'A', 'Toledo', 4),
(33, 'John Ren', 'G', 'Santos', 5),
(34, 'Abigail', 'D', 'Hernandez', 4),
(35, 'Bea May', 'M', 'Belarmino', 5),
(36, 'Meca', 'F', 'Ibarrientos', 4),
(37, 'Christian Jay', 'B', 'Tantan', 5),
(38, 'Kim David', 'C', 'Ritardo', 5),
(39, 'Ronnie', 'V', 'Edec', 2),
(40, 'Mc Josh', 'Y', 'De Lima', 2),
(41, 'Numeriano', 'B', 'Aguado', 5),
(42, 'Kurt Robin', 'A', 'San Jose', 5),
(43, 'Jolymar', 'R', 'Ropal', 5),
(44, 'Chrisna', 'L', 'Fucio', 3),
(45, 'Marlon', 'L', 'Atanacio', 1),
(46, 'Joselle', 'A', 'Banocnoc', 3);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `before_user_delete` BEFORE DELETE ON `users` FOR EACH ROW BEGIN
    DELETE FROM specialization WHERE User_id = OLD.User_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `wh_blk`
--

CREATE TABLE `wh_blk` (
  `id` int(11) NOT NULL,
  `block_id` int(11) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `block` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wh_blk`
--

INSERT INTO `wh_blk` (`id`, `block_id`, `program`, `year`, `block`) VALUES
(5, 8, 'BSCS-DS', 1, 3),
(6, 8, 'BSCS-DS', 2, 2),
(7, 8, 'BSCS-DS', 3, 1),
(8, 8, 'BSCS-DS', 4, 0),
(9, 9, 'BSIT-BA', 1, 2),
(10, 9, 'BSIT-BA', 2, 2),
(11, 9, 'BSIT-BA', 3, 2),
(12, 9, 'BSIT-BA', 4, 2),
(13, 10, 'BSIT-SD', 1, 3),
(14, 10, 'BSIT-SD', 2, 3),
(15, 10, 'BSIT-SD', 3, 3),
(16, 10, 'BSIT-SD', 4, 2),
(65, 23, 'BSCS', 1, 1),
(66, 23, 'BSCS', 2, 1),
(67, 23, 'BSCS', 3, 1),
(68, 23, 'BSCS', 4, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_year`
--
ALTER TABLE `academic_year`
  ADD PRIMARY KEY (`academic_id`);

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `block_course_assignment`
--
ALTER TABLE `block_course_assignment`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `classcode`
--
ALTER TABLE `classcode`
  ADD PRIMARY KEY (`code_id`);

--
-- Indexes for table `classhandle`
--
ALTER TABLE `classhandle`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `unique_course` (`course_code`,`course_name`);

--
-- Indexes for table `monitor_class`
--
ALTER TABLE `monitor_class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prof_id` (`prof_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `program_course_assignment_reference`
--
ALTER TABLE `program_course_assignment_reference`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_course_assignment_reference_ibfk_2` (`course_id`);

--
-- Indexes for table `program_course_mapping`
--
ALTER TABLE `program_course_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`semester_id`);

--
-- Indexes for table `specialization`
--
ALTER TABLE `specialization`
  ADD PRIMARY KEY (`specialization_id`),
  ADD KEY `fk_courses` (`course_id`),
  ADD KEY `fk_user` (`User_id`);

--
-- Indexes for table `summer`
--
ALTER TABLE `summer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `summer_sched`
--
ALTER TABLE `summer_sched`
  ADD PRIMARY KEY (`summer_id`),
  ADD KEY `idx_start_end_sem` (`start`,`end`,`sem`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`unit_id`);

--
-- Indexes for table `university_info`
--
ALTER TABLE `university_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userdata`
--
ALTER TABLE `userdata`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `userlogin`
--
ALTER TABLE `userlogin`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_id`),
  ADD KEY `role` (`role`);

--
-- Indexes for table `wh_blk`
--
ALTER TABLE `wh_blk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wh_blk_ibfk_1` (`block_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_year`
--
ALTER TABLE `academic_year`
  MODIFY `academic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `block_course_assignment`
--
ALTER TABLE `block_course_assignment`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT for table `classcode`
--
ALTER TABLE `classcode`
  MODIFY `code_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `classhandle`
--
ALTER TABLE `classhandle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `monitor_class`
--
ALTER TABLE `monitor_class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `program_course_assignment_reference`
--
ALTER TABLE `program_course_assignment_reference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=651;

--
-- AUTO_INCREMENT for table `program_course_mapping`
--
ALTER TABLE `program_course_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211;

--
-- AUTO_INCREMENT for table `semester`
--
ALTER TABLE `semester`
  MODIFY `semester_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `specialization`
--
ALTER TABLE `specialization`
  MODIFY `specialization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=326;

--
-- AUTO_INCREMENT for table `summer`
--
ALTER TABLE `summer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `summer_sched`
--
ALTER TABLE `summer_sched`
  MODIFY `summer_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `unit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `university_info`
--
ALTER TABLE `university_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `userdata`
--
ALTER TABLE `userdata`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `wh_blk`
--
ALTER TABLE `wh_blk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `monitor_class`
--
ALTER TABLE `monitor_class`
  ADD CONSTRAINT `monitor_class_ibfk_1` FOREIGN KEY (`prof_id`) REFERENCES `users` (`User_id`),
  ADD CONSTRAINT `monitor_class_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `specialization`
--
ALTER TABLE `specialization`
  ADD CONSTRAINT `fk_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`User_id`) REFERENCES `users` (`User_id`);

--
-- Constraints for table `userlogin`
--
ALTER TABLE `userlogin`
  ADD CONSTRAINT `userlogin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userdata` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `role` (`role_id`);

--
-- Constraints for table `wh_blk`
--
ALTER TABLE `wh_blk`
  ADD CONSTRAINT `wh_blk_ibfk_1` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
