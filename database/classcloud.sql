-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 27-10-2025 a las 07:26:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `classcloud`
--
CREATE DATABASE IF NOT EXISTS `classcloud` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `classcloud`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `fecha_asistencia` datetime NOT NULL,
  `fecha_asistida` datetime DEFAULT NULL,
  `id_horario` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `asistencia`
--

TRUNCATE TABLE `asistencia`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aula`
--

DROP TABLE IF EXISTS `aula`;
CREATE TABLE `aula` (
  `id_aula` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ubicacion` varchar(200) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `disponible` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `aula`
--

TRUNCATE TABLE `aula`;
--
-- Volcado de datos para la tabla `aula`
--

INSERT INTO `aula` (`id_aula`, `nombre`, `ubicacion`, `descripcion`, `disponible`) VALUES
(1, 'Aula Virtual 1', 'Online', 'Clases virtuales disponibles', 'S');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje_certificado`
--

DROP TABLE IF EXISTS `canje_certificado`;
CREATE TABLE `canje_certificado` (
  `id_tipo_certificado` int(11) NOT NULL,
  `fecha_canjeo` datetime NOT NULL,
  `estado` varchar(8) NOT NULL,
  `id_certificado` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `canje_certificado`
--

TRUNCATE TABLE `canje_certificado`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje_recompensa`
--

DROP TABLE IF EXISTS `canje_recompensa`;
CREATE TABLE `canje_recompensa` (
  `id_recompensa` int(11) NOT NULL,
  `usado` varchar(2) NOT NULL,
  `fecha_usado` datetime NOT NULL,
  `id_tipo_recompensa` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `canje_recompensa`
--

TRUNCATE TABLE `canje_recompensa`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificado`
--

DROP TABLE IF EXISTS `certificado`;
CREATE TABLE `certificado` (
  `id_certificado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio_puntos` int(11) DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `certificado`
--

TRUNCATE TABLE `certificado`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

DROP TABLE IF EXISTS `curso`;
CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `preciopuntos` int(11) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `duracion` int(11) NOT NULL,
  `id_tipo_curso` int(11) NOT NULL,
  `id_docente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `curso`
--

TRUNCATE TABLE `curso`;
--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`id_curso`, `preciopuntos`, `estado`, `duracion`, `id_tipo_curso`, `id_docente`) VALUES
(1, 150, 'activo', 40, 1, 2),
(2, 200, 'activo', 60, 2, 3),
(3, 180, 'activo', 50, 3, 2),
(4, 0, 'ACTIVO', 60, 4, 5),
(5, 0, 'ACTIVO', 30, 5, 5),
(6, 0, 'ACTIVO', 40, 2, 5),
(7, 0, 'ACTIVO', 30, 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `examen`
--

DROP TABLE IF EXISTS `examen`;
CREATE TABLE `examen` (
  `id_examen` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `valor_puntos` int(11) NOT NULL,
  `cantidad_oportinudades` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `examen`
--

TRUNCATE TABLE `examen`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `examen_realizado`
--

DROP TABLE IF EXISTS `examen_realizado`;
CREATE TABLE `examen_realizado` (
  `id_examen_realizado` int(11) NOT NULL,
  `nota` int(11) NOT NULL,
  `fecha_realizado` datetime NOT NULL,
  `estado` varchar(10) NOT NULL,
  `id_examen` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `examen_realizado`
--

TRUNCATE TABLE `examen_realizado`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foro`
--

DROP TABLE IF EXISTS `foro`;
CREATE TABLE `foro` (
  `id_foro` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `valor_puntos` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `foro`
--

TRUNCATE TABLE `foro`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_puntos`
--

DROP TABLE IF EXISTS `gestion_puntos`;
CREATE TABLE `gestion_puntos` (
  `id_gestion_puntos` int(11) NOT NULL,
  `total_puntos_acumulados` int(11) NOT NULL,
  `total_puntos_gastados` int(11) NOT NULL,
  `total_puntos_actuales` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `gestion_puntos`
--

TRUNCATE TABLE `gestion_puntos`;
--
-- Volcado de datos para la tabla `gestion_puntos`
--

INSERT INTO `gestion_puntos` (`id_gestion_puntos`, `total_puntos_acumulados`, `total_puntos_gastados`, `total_puntos_actuales`, `id_rol_usuario`) VALUES
(1, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

DROP TABLE IF EXISTS `horario`;
CREATE TABLE `horario` (
  `id_horario` int(11) NOT NULL,
  `dia` varchar(10) NOT NULL,
  `hora` time NOT NULL,
  `valor_puntos` int(11) DEFAULT NULL,
  `id_curso` int(11) NOT NULL,
  `id_aula` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `horario`
--

TRUNCATE TABLE `horario`;
--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id_horario`, `dia`, `hora`, `valor_puntos`, `id_curso`, `id_aula`) VALUES
(1, 'Martes', '10:00:00', 15, 1, 1),
(2, 'Martes', '10:00:00', 15, 2, 1),
(3, 'Martes', '10:00:00', 15, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcion`
--

DROP TABLE IF EXISTS `inscripcion`;
CREATE TABLE `inscripcion` (
  `id_inscripcion` int(11) NOT NULL,
  `fecha_inscripcion` datetime NOT NULL,
  `fecha_finalizacion` datetime DEFAULT NULL,
  `costo` int(11) NOT NULL,
  `modalidad` varchar(10) NOT NULL,
  `progreso` double NOT NULL,
  `estado` varchar(10) NOT NULL,
  `id_curso` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `inscripcion`
--

TRUNCATE TABLE `inscripcion`;
--
-- Volcado de datos para la tabla `inscripcion`
--

INSERT INTO `inscripcion` (`id_inscripcion`, `fecha_inscripcion`, `fecha_finalizacion`, `costo`, `modalidad`, `progreso`, `estado`, `id_curso`, `id_rol_usuario`) VALUES
(1, '2025-10-26 23:07:58', NULL, 150, 'online', 0, 'activo', 1, 4),
(2, '2025-10-26 23:07:58', NULL, 200, 'online', 0, 'activo', 2, 4),
(4, '2025-10-01 00:00:00', NULL, 50, 'Presencial', 0, 'Activo', 4, 1),
(5, '2025-10-01 00:00:00', NULL, 70, 'Presencial', 0, 'Activo', 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insignia`
--

DROP TABLE IF EXISTS `insignia`;
CREATE TABLE `insignia` (
  `id_insignia` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `id_rareza` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `insignia`
--

TRUNCATE TABLE `insignia`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `contrasenia` varchar(25) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `correo_institucional` varchar(40) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `login`
--

TRUNCATE TABLE `login`;
--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id_login`, `contrasenia`, `codigo`, `correo_institucional`, `id_rol_usuario`) VALUES
(1, '123456', 'O8X58XCR', 'rosales@classcloud.edu.bo', 1),
(2, '1234567', 'U8X68XCR', 'gonzales@classcloud.edu.bo', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

DROP TABLE IF EXISTS `modulo`;
CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `valor_puntos` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `modulo`
--

TRUNCATE TABLE `modulo`;
--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id_modulo`, `nombre`, `valor_puntos`, `id_curso`) VALUES
(1, '0', 50, 1),
(2, '0', 50, 2),
(3, '0', 50, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obtener_insignia`
--

DROP TABLE IF EXISTS `obtener_insignia`;
CREATE TABLE `obtener_insignia` (
  `id_obtener_insignia` int(11) NOT NULL,
  `id_rol_usuario` int(11) DEFAULT NULL,
  `id_insignia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `obtener_insignia`
--

TRUNCATE TABLE `obtener_insignia`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL,
  `fecha_pago` date NOT NULL,
  `monto_pagado` int(11) NOT NULL,
  `tipo_pago` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `pago`
--

TRUNCATE TABLE `pago`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

DROP TABLE IF EXISTS `permiso`;
CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `permiso`
--

TRUNCATE TABLE `permiso`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso_modulo`
--

DROP TABLE IF EXISTS `progreso_modulo`;
CREATE TABLE `progreso_modulo` (
  `id_progreso_modulo` int(11) NOT NULL,
  `progreso` double NOT NULL,
  `estado` varchar(15) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `progreso_modulo`
--

TRUNCATE TABLE `progreso_modulo`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rareza`
--

DROP TABLE IF EXISTS `rareza`;
CREATE TABLE `rareza` (
  `id_rareza` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `rareza`
--

TRUNCATE TABLE `rareza`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recompensa`
--

DROP TABLE IF EXISTS `recompensa`;
CREATE TABLE `recompensa` (
  `id_recompensa` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `precio_puntos` int(11) NOT NULL,
  `descuento` int(11) DEFAULT NULL,
  `id_tipo_recompensa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `recompensa`
--

TRUNCATE TABLE `recompensa`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requisito`
--

DROP TABLE IF EXISTS `requisito`;
CREATE TABLE `requisito` (
  `id_requisito` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `id_tipo_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `requisito`
--

TRUNCATE TABLE `requisito`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `rol`
--

TRUNCATE TABLE `rol`;
--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(2, 'Docente'),
(1, 'Estudiante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permisos`
--

DROP TABLE IF EXISTS `rol_permisos`;
CREATE TABLE `rol_permisos` (
  `id_rol_permisos` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `rol_permisos`
--

TRUNCATE TABLE `rol_permisos`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

DROP TABLE IF EXISTS `rol_usuario`;
CREATE TABLE `rol_usuario` (
  `id_rol_usuario` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `rol_usuario`
--

TRUNCATE TABLE `rol_usuario`;
--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id_rol_usuario`, `id_usuario`, `id_rol`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seminario`
--

DROP TABLE IF EXISTS `seminario`;
CREATE TABLE `seminario` (
  `id_seminario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `precio_puntos` int(11) DEFAULT NULL,
  `descripccion` varchar(200) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `seminario`
--

TRUNCATE TABLE `seminario`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tema`
--

DROP TABLE IF EXISTS `tema`;
CREATE TABLE `tema` (
  `id_tema` int(11) NOT NULL,
  `nombre_tema` varchar(100) NOT NULL,
  `numero` int(11) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tema`
--

TRUNCATE TABLE `tema`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_curso`
--

DROP TABLE IF EXISTS `tipo_curso`;
CREATE TABLE `tipo_curso` (
  `id_tipo_curso` int(11) NOT NULL,
  `nombre_curso` varchar(100) NOT NULL,
  `curso_extra` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tipo_curso`
--

TRUNCATE TABLE `tipo_curso`;
--
-- Volcado de datos para la tabla `tipo_curso`
--

INSERT INTO `tipo_curso` (`id_tipo_curso`, `nombre_curso`, `curso_extra`) VALUES
(1, 'Desarrollo Web con PHP', 'NO'),
(2, 'Python para Principiantes', 'NO'),
(3, 'Inteligencia Artificial Básica', 'SI'),
(4, 'Base de Datos', 'NO'),
(5, 'Introducion a Python', 'NO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_recompensa`
--

DROP TABLE IF EXISTS `tipo_recompensa`;
CREATE TABLE `tipo_recompensa` (
  `id_tipo_recompensa` int(11) NOT NULL,
  `nombre_tipo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tipo_recompensa`
--

TRUNCATE TABLE `tipo_recompensa`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombres` varchar(70) NOT NULL,
  `apellidos` varchar(70) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `ci` varchar(9) NOT NULL,
  `telefono` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `estado` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `usuario`
--

TRUNCATE TABLE `usuario`;
--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombres`, `apellidos`, `fecha_nacimiento`, `ci`, `telefono`, `correo`, `estado`) VALUES
(1, 'Nayver', 'Mamani', '2004-04-06', '82402336', 68539527, 'rosales@gmail.com', 'Activo'),
(2, 'Laura', 'Gonzales', '1992-08-15', '1234568', 78965415, 'laura.gonzales@umss.edu.bo', 'activo'),
(3, 'Carlos', 'Torrez', '1985-04-02', '1234569', 78965416, 'carlos.torrez@umss.edu.bo', 'activo'),
(4, 'Andrea', 'Lopez', '1998-03-22', '1234570', 78965417, 'andrea.lopez@umss.edu.bo', 'activo'),
(5, 'Jose', 'Gonzales', '1985-04-02', '9493439', 74329912, 'gonzales@gmail.com', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `id_asistencia` (`id_asistencia`),
  ADD KEY `id_horario` (`id_horario`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id_aula`),
  ADD UNIQUE KEY `id_aula` (`id_aula`);

--
-- Indices de la tabla `canje_certificado`
--
ALTER TABLE `canje_certificado`
  ADD PRIMARY KEY (`id_tipo_certificado`),
  ADD UNIQUE KEY `id_tipo_certificado` (`id_tipo_certificado`),
  ADD KEY `id_certificado` (`id_certificado`),
  ADD KEY `id_inscripcion` (`id_inscripcion`);

--
-- Indices de la tabla `canje_recompensa`
--
ALTER TABLE `canje_recompensa`
  ADD PRIMARY KEY (`id_recompensa`),
  ADD UNIQUE KEY `id_recompensa` (`id_recompensa`),
  ADD KEY `id_tipo_recompensa` (`id_tipo_recompensa`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`id_certificado`),
  ADD UNIQUE KEY `id_certificado` (`id_certificado`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`),
  ADD UNIQUE KEY `id_curso` (`id_curso`),
  ADD KEY `id_tipo_curso` (`id_tipo_curso`),
  ADD KEY `id_docente` (`id_docente`);

--
-- Indices de la tabla `examen`
--
ALTER TABLE `examen`
  ADD PRIMARY KEY (`id_examen`),
  ADD UNIQUE KEY `id_examen` (`id_examen`);

--
-- Indices de la tabla `examen_realizado`
--
ALTER TABLE `examen_realizado`
  ADD PRIMARY KEY (`id_examen_realizado`),
  ADD UNIQUE KEY `id_examen_realizado` (`id_examen_realizado`),
  ADD KEY `id_examen` (`id_examen`),
  ADD KEY `id_modulo` (`id_modulo`);

--
-- Indices de la tabla `foro`
--
ALTER TABLE `foro`
  ADD PRIMARY KEY (`id_foro`),
  ADD UNIQUE KEY `id_foro` (`id_foro`),
  ADD UNIQUE KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `gestion_puntos`
--
ALTER TABLE `gestion_puntos`
  ADD PRIMARY KEY (`id_gestion_puntos`),
  ADD UNIQUE KEY `id_gestion_puntos` (`id_gestion_puntos`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id_horario`),
  ADD UNIQUE KEY `id_horario` (`id_horario`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `id_aula` (`id_aula`);

--
-- Indices de la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD UNIQUE KEY `id_inscripcion` (`id_inscripcion`),
  ADD KEY `id_curso` (`id_curso`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `insignia`
--
ALTER TABLE `insignia`
  ADD PRIMARY KEY (`id_insignia`),
  ADD UNIQUE KEY `id_insignia` (`id_insignia`),
  ADD KEY `id_rareza` (`id_rareza`);

--
-- Indices de la tabla `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id_login`),
  ADD UNIQUE KEY `id_login` (`id_login`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id_modulo`),
  ADD UNIQUE KEY `id_modulo` (`id_modulo`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `obtener_insignia`
--
ALTER TABLE `obtener_insignia`
  ADD PRIMARY KEY (`id_obtener_insignia`),
  ADD UNIQUE KEY `id_obtener_insignia` (`id_obtener_insignia`),
  ADD KEY `id_insignia` (`id_insignia`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `id_pago` (`id_pago`),
  ADD UNIQUE KEY `id_inscripcion` (`id_inscripcion`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `id_permiso` (`id_permiso`);

--
-- Indices de la tabla `progreso_modulo`
--
ALTER TABLE `progreso_modulo`
  ADD PRIMARY KEY (`id_progreso_modulo`),
  ADD UNIQUE KEY `id_progreso_modulo` (`id_progreso_modulo`),
  ADD KEY `id_modulo` (`id_modulo`),
  ADD KEY `id_inscripcion` (`id_inscripcion`);

--
-- Indices de la tabla `rareza`
--
ALTER TABLE `rareza`
  ADD PRIMARY KEY (`id_rareza`),
  ADD UNIQUE KEY `id_rareza` (`id_rareza`);

--
-- Indices de la tabla `recompensa`
--
ALTER TABLE `recompensa`
  ADD PRIMARY KEY (`id_recompensa`),
  ADD UNIQUE KEY `id_recompensa` (`id_recompensa`),
  ADD KEY `id_tipo_recompensa` (`id_tipo_recompensa`);

--
-- Indices de la tabla `requisito`
--
ALTER TABLE `requisito`
  ADD PRIMARY KEY (`id_requisito`),
  ADD UNIQUE KEY `id_requisito` (`id_requisito`),
  ADD KEY `id_tipo_curso` (`id_tipo_curso`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `id_rol` (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD PRIMARY KEY (`id_rol_permisos`),
  ADD UNIQUE KEY `id_rol_permisos` (`id_rol_permisos`),
  ADD KEY `id_permiso` (`id_permiso`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id_rol_usuario`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `seminario`
--
ALTER TABLE `seminario`
  ADD PRIMARY KEY (`id_seminario`),
  ADD UNIQUE KEY `id_seminario` (`id_seminario`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Indices de la tabla `tema`
--
ALTER TABLE `tema`
  ADD PRIMARY KEY (`id_tema`),
  ADD UNIQUE KEY `id_tema` (`id_tema`),
  ADD KEY `id_modulo` (`id_modulo`);

--
-- Indices de la tabla `tipo_curso`
--
ALTER TABLE `tipo_curso`
  ADD PRIMARY KEY (`id_tipo_curso`),
  ADD UNIQUE KEY `id_tipo_curso` (`id_tipo_curso`);

--
-- Indices de la tabla `tipo_recompensa`
--
ALTER TABLE `tipo_recompensa`
  ADD PRIMARY KEY (`id_tipo_recompensa`),
  ADD UNIQUE KEY `id_tipo_recompensa` (`id_tipo_recompensa`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `ci` (`ci`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `aula`
--
ALTER TABLE `aula`
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `canje_certificado`
--
ALTER TABLE `canje_certificado`
  MODIFY `id_tipo_certificado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `canje_recompensa`
--
ALTER TABLE `canje_recompensa`
  MODIFY `id_recompensa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `certificado`
--
ALTER TABLE `certificado`
  MODIFY `id_certificado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `examen`
--
ALTER TABLE `examen`
  MODIFY `id_examen` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `examen_realizado`
--
ALTER TABLE `examen_realizado`
  MODIFY `id_examen_realizado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `foro`
--
ALTER TABLE `foro`
  MODIFY `id_foro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gestion_puntos`
--
ALTER TABLE `gestion_puntos`
  MODIFY `id_gestion_puntos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  MODIFY `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `insignia`
--
ALTER TABLE `insignia`
  MODIFY `id_insignia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `obtener_insignia`
--
ALTER TABLE `obtener_insignia`
  MODIFY `id_obtener_insignia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `progreso_modulo`
--
ALTER TABLE `progreso_modulo`
  MODIFY `id_progreso_modulo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rareza`
--
ALTER TABLE `rareza`
  MODIFY `id_rareza` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recompensa`
--
ALTER TABLE `recompensa`
  MODIFY `id_recompensa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `requisito`
--
ALTER TABLE `requisito`
  MODIFY `id_requisito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  MODIFY `id_rol_permisos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  MODIFY `id_rol_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `seminario`
--
ALTER TABLE `seminario`
  MODIFY `id_seminario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tema`
--
ALTER TABLE `tema`
  MODIFY `id_tema` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_curso`
--
ALTER TABLE `tipo_curso`
  MODIFY `id_tipo_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_recompensa`
--
ALTER TABLE `tipo_recompensa`
  MODIFY `id_tipo_recompensa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_horario`) REFERENCES `horario` (`id_horario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `canje_certificado`
--
ALTER TABLE `canje_certificado`
  ADD CONSTRAINT `canje_certificado_ibfk_1` FOREIGN KEY (`id_certificado`) REFERENCES `certificado` (`id_certificado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `canje_certificado_ibfk_2` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripcion` (`id_inscripcion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `canje_recompensa`
--
ALTER TABLE `canje_recompensa`
  ADD CONSTRAINT `canje_recompensa_ibfk_1` FOREIGN KEY (`id_tipo_recompensa`) REFERENCES `recompensa` (`id_recompensa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `canje_recompensa_ibfk_2` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`id_tipo_curso`) REFERENCES `tipo_curso` (`id_tipo_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `curso_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `examen_realizado`
--
ALTER TABLE `examen_realizado`
  ADD CONSTRAINT `examen_realizado_ibfk_1` FOREIGN KEY (`id_examen`) REFERENCES `examen` (`id_examen`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `examen_realizado_ibfk_2` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `foro`
--
ALTER TABLE `foro`
  ADD CONSTRAINT `foro_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `gestion_puntos`
--
ALTER TABLE `gestion_puntos`
  ADD CONSTRAINT `gestion_puntos_ibfk_1` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `horario_ibfk_2` FOREIGN KEY (`id_aula`) REFERENCES `aula` (`id_aula`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD CONSTRAINT `inscripcion_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `inscripcion_ibfk_2` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `insignia`
--
ALTER TABLE `insignia`
  ADD CONSTRAINT `insignia_ibfk_1` FOREIGN KEY (`id_rareza`) REFERENCES `rareza` (`id_rareza`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD CONSTRAINT `modulo_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `obtener_insignia`
--
ALTER TABLE `obtener_insignia`
  ADD CONSTRAINT `obtener_insignia_ibfk_1` FOREIGN KEY (`id_insignia`) REFERENCES `insignia` (`id_insignia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `obtener_insignia_ibfk_2` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripcion` (`id_inscripcion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `progreso_modulo`
--
ALTER TABLE `progreso_modulo`
  ADD CONSTRAINT `progreso_modulo_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `progreso_modulo_ibfk_2` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripcion` (`id_inscripcion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `recompensa`
--
ALTER TABLE `recompensa`
  ADD CONSTRAINT `recompensa_ibfk_1` FOREIGN KEY (`id_tipo_recompensa`) REFERENCES `tipo_recompensa` (`id_tipo_recompensa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `requisito`
--
ALTER TABLE `requisito`
  ADD CONSTRAINT `requisito_ibfk_1` FOREIGN KEY (`id_tipo_curso`) REFERENCES `tipo_curso` (`id_tipo_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD CONSTRAINT `rol_permisos_ibfk_1` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `rol_permisos_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD CONSTRAINT `rol_usuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `rol_usuario_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `seminario`
--
ALTER TABLE `seminario`
  ADD CONSTRAINT `seminario_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tema`
--
ALTER TABLE `tema`
  ADD CONSTRAINT `tema_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
