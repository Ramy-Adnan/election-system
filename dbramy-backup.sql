-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: DBRAMY
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_log`
--

DROP TABLE IF EXISTS `attendance_log`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `individual_note` text,
  `status` enum('present','absent') NOT NULL,
  `general_note` text,
  `log_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `observer_id` (`observer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_log`
--

LOCK TABLES `attendance_log` WRITE;
/*!40000 ALTER TABLE `attendance_log` DISABLE KEYS */;
INSERT INTO `attendance_log` VALUES (34,2,'╪▒╪¡┘à┘å ╪╣╪»┘å╪º┘å',NULL,'present','╪▒╪¡┘à┘å ╪╣╪º┘ê┘è','2025-10-16 08:29:22',NULL,NULL),(35,2,'┘à╪¡┘à╪» ┘â╪º┘à┘ä',NULL,'present','╪▒╪¡┘à┘å ╪╣╪º┘ê┘è','2025-10-16 08:29:22',NULL,NULL),(45,2,'╪▒╪¡┘à┘å ╪╣╪»┘å╪º┘å',NULL,'present','┘ç╪░┘ç ╪º┘ä┘à┘ä╪º╪¡╪╕╪º╪¬ ╪│╪¬╪╢┘ç╪▒ ╪¿╪¬╪¡┘ä┘è┘ä ╪º┘ä┘à┘ê╪╕┘ü┘è┘å ┘ü┘é╪╖ ┘ê┘ä┘â┘ä ╪º┘ä┘à┘ê╪╕┘ü┘è┘å','2025-10-16 10:55:43',NULL,NULL),(46,2,'┘à╪¡┘à╪» ┘â╪º┘à┘ä',NULL,'present','┘ç╪░┘ç ╪º┘ä┘à┘ä╪º╪¡╪╕╪º╪¬ ╪│╪¬╪╢┘ç╪▒ ╪¿╪¬╪¡┘ä┘è┘ä ╪º┘ä┘à┘ê╪╕┘ü┘è┘å ┘ü┘é╪╖ ┘ê┘ä┘â┘ä ╪º┘ä┘à┘ê╪╕┘ü┘è┘å','2025-10-16 10:55:43',NULL,NULL),(65,4,'┘à╪¡┘à╪»',NULL,'absent','','2025-10-17 06:54:01',32.00483400,44.90847600),(66,5,'┘à╪¡┘à╪»',NULL,'present','','2025-10-17 11:47:42',32.00483400,44.90847600);
/*!40000 ALTER TABLE `attendance_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'╪¡╪│┘å ╪º╪»┘å┘è┘å ╪º┘ä┘ç┘ä╪º┘ä┘è','c1','12345'),(2,'╪▒╪º┘à┘è','c2','12345');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidate_id` int NOT NULL,
  `observer_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `employees_ibfk_2` (`observer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (10,1,2,'┘à╪¡┘à╪» ┘â╪º┘à┘ä',NULL,'07809774178','╪│╪º╪ª┘é ╪¬┘â╪│┘è','╪º┘ä╪╣┘ü╪º╪¼┘ä┘ç','2025-10-16 07:04:53'),(11,2,3,'┘à╪▒╪º┘é╪¿ ┘à╪╢┘è┘ê┘ü',NULL,'07809774178','╪│╪º╪ª┘é ╪¬┘â╪│┘è','╪º┘ä╪╣┘ü╪º╪¼┘ä┘ç','2025-10-16 07:13:12'),(12,1,2,'╪▒╪¡┘à┘å ╪╣╪»┘å╪º┘å',NULL,'0780','╪╖╪º┘ä╪¿','╪º┘ä╪╣╪║╪º┘ä╪¼╪⌐','2025-10-16 08:28:55'),(13,1,4,'┘à╪¡┘à╪» ',NULL,'0780','╪│╪º┘è┘é','╪º┘ä╪»╪║╪º╪▒╪⌐','2025-10-17 06:53:40'),(14,1,5,'┘à╪¡┘à╪»',NULL,'0780','╪╣╪º╪╖┘ä','╪┤╪º╪▒╪╣','2025-10-17 11:28:16'),(15,1,5,'╪¼╪º╪│┘à ┘à╪¡┘à╪»',NULL,'0780','111','111','2025-10-17 11:48:09'),(16,1,5,'┘è┘è',NULL,'┘è┘è','┘è┘è┘è','┘è┘è┘è','2025-10-17 11:48:32');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end_of_day_center_report`
--

DROP TABLE IF EXISTS `end_of_day_center_report`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `end_of_day_center_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `center_name` varchar(255) DEFAULT NULL,
  `station_count` int DEFAULT NULL,
  `employee_count` int DEFAULT NULL,
  `notes` text,
  `is_received` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `observer_id` (`observer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end_of_day_center_report`
--

LOCK TABLES `end_of_day_center_report` WRITE;
/*!40000 ALTER TABLE `end_of_day_center_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `end_of_day_center_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `end_of_day_station_report`
--

DROP TABLE IF EXISTS `end_of_day_station_report`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `end_of_day_station_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `candidate_name` varchar(255) DEFAULT NULL,
  `center_name` varchar(255) DEFAULT NULL,
  `station_number` int NOT NULL,
  `vote_count` int NOT NULL,
  `is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  `result_image_url` varchar(255) DEFAULT NULL,
  `notes` text,
  `is_received` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `observer_id` (`observer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `end_of_day_station_report`
--

LOCK TABLES `end_of_day_station_report` WRITE;
/*!40000 ALTER TABLE `end_of_day_station_report` DISABLE KEYS */;
INSERT INTO `end_of_day_station_report` VALUES (4,2,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ╪º╪¿┘å  ╪º┘ä╪│┘â┘è╪¬',1,1,0,'/uploads/1760648383749_2_report_1760648377153.jpg','1',0,'2025-10-16 20:59:43'),(5,2,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ╪º╪¿┘å  ╪º┘ä╪│┘â┘è╪¬',2,2,0,'/uploads/1760648664763_2_report_1760648661977.jpg','2',0,'2025-10-16 21:04:24'),(6,2,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ╪º╪¿┘å  ╪º┘ä╪│┘â┘è╪¬',3,3,0,'/uploads/1760649205286_2_report_1760649200071.jpg','',0,'2025-10-16 21:13:25'),(7,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',1,1,0,'/uploads/1760692276816_5_report_1760692220564.jpg','',0,'2025-10-17 09:11:16'),(8,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',2,0,1,'/uploads/1760700592158_5_report_1760700588005.jpg','1',0,'2025-10-17 11:29:52'),(9,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',3,0,1,'/uploads/1760700621762_5_report_1760700618978.jpg','2',0,'2025-10-17 11:30:21'),(10,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',4,3,0,'/uploads/1760701167333_5_report_1760701151533.jpg','',0,'2025-10-17 11:39:27'),(11,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',5,0,1,'/uploads/1760701779507_5_report_1760701762770.jpg','',0,'2025-10-17 11:49:39'),(12,5,'╪º╪│┘à ╪º┘ä┘à╪▒╪┤╪¡ ┘ç┘å╪º','┘à╪»╪▒╪│╪⌐ ┘à╪º┘ä┘â ╪¿┘è┘å ┘å┘ê┘è╪▒┘ç',6,0,1,'/uploads/1760704443938_5_report_1760704441573.jpg','',0,'2025-10-17 12:34:03');
/*!40000 ALTER TABLE `end_of_day_station_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `final_reports`
--

DROP TABLE IF EXISTS `final_reports`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `final_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `polling_center_id` int NOT NULL,
  `candidate_name_reported` varchar(255) NOT NULL,
  `station_name` varchar(255) NOT NULL,
  `vote_count` int NOT NULL,
  `result_image_url` varchar(512) NOT NULL,
  `notes` text,
  `report_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `observer_id_idx` (`observer_id`),
  KEY `polling_center_id_idx` (`polling_center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `final_reports`
--

LOCK TABLES `final_reports` WRITE;
/*!40000 ALTER TABLE `final_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `final_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hourly_reports`
--

DROP TABLE IF EXISTS `hourly_reports`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hourly_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `polling_center_id` int NOT NULL,
  `present_count` int NOT NULL,
  `absent_count` int NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `notes` text,
  `report_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `observer_id_idx` (`observer_id`),
  KEY `polling_center_id_idx` (`polling_center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hourly_reports`
--

LOCK TABLES `hourly_reports` WRITE;
/*!40000 ALTER TABLE `hourly_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `hourly_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observers`
--

DROP TABLE IF EXISTS `observers`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `candidate_id` int DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observers`
--

LOCK TABLES `observers` WRITE;
/*!40000 ALTER TABLE `observers` DISABLE KEYS */;
INSERT INTO `observers` VALUES (2,'╪¡╪│┘è┘å ╪º╪»┘å┘è┘å','h','1',1,NULL,NULL,NULL,NULL),(3,'╪│╪º┘à┘è ╪╣╪»┘å╪º┘å','o','1111',2,NULL,NULL,NULL,NULL),(4,'┘â╪▒╪º╪▒','mm','1',1,NULL,NULL,NULL,NULL),(5,'┘à╪╡╪╖┘ü┘ë','c1','12345',1,'','1111-11-11','',''),(6,'╪▒╪º┘à┘è ╪╣╪»┘å╪º┘å','rr','1',1,'0789','1994-11-11','cars','akik');
/*!40000 ALTER TABLE `observers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online_observers`
--

DROP TABLE IF EXISTS `online_observers`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `online_observers` (
  `observer_id` int NOT NULL,
  `socket_id` varchar(255) NOT NULL,
  `last_location_lat` decimal(10,8) DEFAULT NULL,
  `last_location_lng` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`observer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online_observers`
--

LOCK TABLES `online_observers` WRITE;
/*!40000 ALTER TABLE `online_observers` DISABLE KEYS */;
/*!40000 ALTER TABLE `online_observers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `polling_centers`
--

DROP TABLE IF EXISTS `polling_centers`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polling_centers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int NOT NULL,
  `center_name` varchar(255) NOT NULL,
  `station_count` int DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `observer_id` (`observer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `polling_centers`
--

LOCK TABLES `polling_centers` WRITE;
/*!40000 ALTER TABLE `polling_centers` DISABLE KEYS */;
INSERT INTO `polling_centers` VALUES (3,2,'مسسسس',5,'مسووو','ييييي','بببببب','2025-10-16 06:38:12',NULL,NULL),(4,4,'ببببب',5,'بربربر','عتعتعتعت','تتتت','2025-10-17 06:52:51',32.00483400,44.90847600),(5,5,'عتعت',6,'عتععت','عتعت','عتععت','2025-10-17 09:04:59',31.91836130,44.96776170),(6,6,'┘à╪»╪▒╪│╪⌐ ╪º┘ä╪«┘ê╪º┘ä╪»',4,'عتعتعت','عتعتت','عتعت','2025-10-17 13:00:44',32.00483400,44.90847600);
/*!40000 ALTER TABLE `polling_centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client       = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observer_id` int DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `center_name` varchar(255) DEFAULT NULL,
  `stations_count` int DEFAULT NULL,
  `report_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `observer_id` (`observer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3856 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (4,NULL,32.00483400,44.90847600,NULL,NULL,'2025-10-12 16:14:23'),(5,NULL,32.00483400,44.90847600,NULL,NULL,'2025-10-12 16:14:27'),(3855,6,32.00483400,44.90847600,NULL,NULL,'2025-10-17 13:07:39');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-17 16:19:34