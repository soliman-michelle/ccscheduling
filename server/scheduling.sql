-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2024 at 04:25 PM
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
-- Table structure for table `summer_sched`
--

CREATE TABLE `summer_sched` (
  `summer_id` int(50) NOT NULL,
  `id` int(50) NOT NULL,
  `block` varchar(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `day` varchar(100) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `room` int(50) NOT NULL,
  `color` varchar(255) NOT NULL,
  `start` year(4) NOT NULL,
  `end` year(4) NOT NULL,
  `sem` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `summer_sched`
--

INSERT INTO `summer_sched` (`summer_id`, `id`, `block`, `type`, `day`, `start_time`, `end_time`, `room`, `color`, `start`, `end`, `sem`) VALUES
(20, 17, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(21, 17, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(22, 17, 'A', 'lab', '', NULL, NULL, 0, '', '0000', '0000', ''),
(23, 18, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(24, 18, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(25, 19, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(26, 19, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(27, 19, 'B', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(28, 19, 'B', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(31, 20, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(32, 20, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(33, 20, 'A', 'lab', '', NULL, NULL, 0, '', '0000', '0000', ''),
(34, 21, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(35, 21, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(36, 21, 'A', 'lab', '', NULL, NULL, 0, '', '0000', '0000', ''),
(37, 22, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(38, 22, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(39, 23, 'A', 'ftf', '', NULL, NULL, 0, '', '0000', '0000', ''),
(40, 23, 'A', 'online', '', NULL, NULL, 0, '', '0000', '0000', ''),
(41, 23, 'A', 'lab', '', NULL, NULL, 0, '', '0000', '0000', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `summer_sched`
--
ALTER TABLE `summer_sched`
  ADD PRIMARY KEY (`summer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `summer_sched`
--
ALTER TABLE `summer_sched`
  MODIFY `summer_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
