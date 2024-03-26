CREATE DATABASE  IF NOT EXISTS `eheshoppingdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `eheshoppingdb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: eheshoppingdb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `idEmpleado` int NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idEmpleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1201,'$2a$10$gmqt2z0iQ.wRJ.Z.gJa3Pe4aLrM78ltdOrriyvBSKCe4Hg4zyr9LG','Juan Garcia'),(1202,'$2a$10$xHtE8dTof/.kjcZm9muRx.tFg5qkKLdPGNiQ1wsSGKQXhq505pSBW','Jennifer Acuna'),(1203,'$2a$10$HKCWhHHnWZG1IjCNUVy7M.IRtGtaZhKlp9iZ/Wrbz/6./nyCAifl6','Linda Contreras'),(1204,'$2a$10$aQsFYGP33/AJO6dnw2yeeemvGT9IKQSeyJBHBLipc4P2fbP/9t8yy','Andrea Marroquin'),(1205,'$2a$10$fUXPfhUZmTvWlD/ycN/Is.AIfAg8BX2FJlPsKmMg/Pz6oWXeAQLmq','Jose Vasquez');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `numeroDeOrden` int NOT NULL AUTO_INCREMENT,
  `idDelProducto` int NOT NULL,
  `nombreDelProducto` varchar(50) NOT NULL,
  `proveedor` varchar(50) NOT NULL,
  `cantidad` int NOT NULL,
  `idEmpleado` int NOT NULL,
  PRIMARY KEY (`numeroDeOrden`),
  KEY `idDelProducto` (`idDelProducto`),
  KEY `proveedor` (`proveedor`),
  KEY `idEmpleado` (`idEmpleado`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`idDelProducto`) REFERENCES `productos` (`idDelProducto`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`proveedor`) REFERENCES `proveedores` (`proveedor`),
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,4,'Arroz','Graneros Unidos',2,1201),(2,7,'Avena','quaker',5,1201),(3,5,'Pollo','Avicola La Granja',2,1201);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `idDelProducto` int NOT NULL,
  `nombreDelProducto` varchar(50) NOT NULL,
  `proveedor` varchar(50) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `existencia` int NOT NULL,
  PRIMARY KEY (`idDelProducto`),
  KEY `proveedor` (`proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Leche','Lacteos del Campo','Leche entera pasteurizada','Lacteos',300),(2,'Pan de molde','Hornos Artesanales','Pan de molde integral','Panaderia',80),(3,'Manzanas','Frutas del Valle','Manzanas rojas frescas','Frutas',120),(4,'Arroz','Graneros Unidos','Arroz blanco de grano largo','Cereales',200),(5,'Pollo','Avicola La Granja','Pechugas de pollo sin piel','Carnes',90),(6,'Cereal de desayuno','Mananeros S.A.','Cereal integral con miel','Desayuno',110),(7,'Avena','Quaker','Avena en granos','Granos',150);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `proveedor` varchar(50) NOT NULL,
  `idProveedor` int NOT NULL,
  `idDelProducto` int NOT NULL,
  PRIMARY KEY (`proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES ('Avicola La Granja',1005,5),('Ehe Milk',1008,1),('Frutas del Valle',1003,3),('Graneros Unidos',1004,4),('Grupo Australia S.A.',1007,1),('Hornos Artesanales',1002,2),('Lacteos del Campo',1001,1),('Mananeros S.A.',1006,6),('quaker',1009,7);
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'eheshoppingdb'
--

--
-- Dumping routines for database 'eheshoppingdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-25 19:50:54
