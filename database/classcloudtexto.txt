-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 07-11-2025 a las 18:21:24
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `fecha_asistencia` datetime NOT NULL,
  `fecha_asistida` datetime DEFAULT NULL,
  `id_horario` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `asistencia`
--
DELIMITER $$
CREATE TRIGGER `trg_asistencia_insert` AFTER INSERT ON `asistencia` FOR EACH ROW BEGIN
    UPDATE GESTION_PUNTOS
    SET total_puntos_actuales = total_puntos_actuales + 5
    WHERE id_rol_usuario = NEW.id_rol_usuario;

    INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario)
    VALUES (
        'INSERT', 
        'Se registró asistencia y se sumaron 5 puntos.',
        'ASISTENCIA',
        NEW.id_rol_usuario
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aula`
--

CREATE TABLE `aula` (
  `id_aula` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ubicacion` varchar(200) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `disponible` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aula`
--

INSERT INTO `aula` (`id_aula`, `nombre`, `ubicacion`, `descripcion`, `disponible`) VALUES
(1, 'Aula Virtual 1', 'Online', 'Clases virtuales disponibles', 'S');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id_bitacora` int(11) NOT NULL,
  `accion` varchar(10) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bitacora`
--

INSERT INTO `bitacora` (`id_bitacora`, `accion`, `descripcion`, `tabla_afectada`, `id_rol_usuario`) VALUES
(1, 'INSERT', 'Se creó registro de puntos para nuevo usuario.', 'ROL_USUARIO', 6),
(2, 'INSERT', 'Se creó registro de puntos para nuevo usuario.', 'ROL_USUARIO', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje_certificado`
--

CREATE TABLE `canje_certificado` (
  `id_tipo_certificado` int(11) NOT NULL,
  `fecha_canjeo` datetime NOT NULL,
  `estado` varchar(8) NOT NULL,
  `id_certificado` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje_recompensa`
--

CREATE TABLE `canje_recompensa` (
  `id_recompensa` int(11) NOT NULL,
  `usado` varchar(2) NOT NULL,
  `fecha_usado` datetime NOT NULL,
  `id_tipo_recompensa` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `canje_recompensa`
--
DELIMITER $$
CREATE TRIGGER `trg_recompensa_usada` AFTER UPDATE ON `canje_recompensa` FOR EACH ROW BEGIN
    IF NEW.usado = '1' THEN
        INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario)
        VALUES (
            'UPDATE',
            CONCAT('Recompensa ID ', NEW.id_recompensa, ' fue usada.'),
            'CANJE_RECOMPENSA',
            NEW.id_rol_usuario
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificado`
--

CREATE TABLE `certificado` (
  `id_certificado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio_puntos` int(11) DEFAULT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `preciopuntos` int(11) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `duracion` int(11) NOT NULL,
  `id_tipo_curso` int(11) NOT NULL,
  `id_docente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `examen` (
  `id_examen` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `valor_puntos` int(11) NOT NULL,
  `cantidad_oportinudades` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `examen_realizado`
--

CREATE TABLE `examen_realizado` (
  `id_examen_realizado` int(11) NOT NULL,
  `nota` int(11) NOT NULL,
  `fecha_realizado` datetime NOT NULL,
  `estado` varchar(10) NOT NULL,
  `id_examen` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foro`
--

CREATE TABLE `foro` (
  `id_foro` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `valor_puntos` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_puntos`
--

CREATE TABLE `gestion_puntos` (
  `id_gestion_puntos` int(11) NOT NULL,
  `total_puntos_acumulados` int(11) NOT NULL,
  `total_puntos_gastados` int(11) NOT NULL,
  `total_puntos_actuales` int(11) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gestion_puntos`
--

INSERT INTO `gestion_puntos` (`id_gestion_puntos`, `total_puntos_acumulados`, `total_puntos_gastados`, `total_puntos_actuales`, `id_rol_usuario`) VALUES
(1, 0, 0, 0, 1),
(2, 0, 0, 0, 6),
(3, 0, 0, 0, 6),
(4, 0, 0, 0, 7),
(5, 0, 0, 0, 7);

--
-- Disparadores `gestion_puntos`
--
DELIMITER $$
CREATE TRIGGER `trg_insignias_automaticas` AFTER UPDATE ON `gestion_puntos` FOR EACH ROW BEGIN
    -- Insignia 1 (100 puntos)
    IF NEW.total_puntos_acumulados >= 100 AND 
       (SELECT COUNT(*) FROM OBTENER_INSIGNIA WHERE id_rol_usuario = NEW.id_rol_usuario AND id_insignia = 1) = 0 THEN
        INSERT INTO OBTENER_INSIGNIA (id_rol_usuario, id_insignia)
        VALUES (NEW.id_rol_usuario, 1);
    END IF;

    -- Insignia 2 (300 puntos)
    IF NEW.total_puntos_acumulados >= 300 AND 
       (SELECT COUNT(*) FROM OBTENER_INSIGNIA WHERE id_rol_usuario = NEW.id_rol_usuario AND id_insignia = 2) = 0 THEN
        INSERT INTO OBTENER_INSIGNIA (id_rol_usuario, id_insignia)
        VALUES (NEW.id_rol_usuario, 2);
    END IF;

    -- Insignia 3 (600 puntos)
    IF NEW.total_puntos_acumulados >= 600 AND 
       (SELECT COUNT(*) FROM OBTENER_INSIGNIA WHERE id_rol_usuario = NEW.id_rol_usuario AND id_insignia = 3) = 0 THEN
        INSERT INTO OBTENER_INSIGNIA (id_rol_usuario, id_insignia)
        VALUES (NEW.id_rol_usuario, 3);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id_horario` int(11) NOT NULL,
  `dia` varchar(10) NOT NULL,
  `hora` time NOT NULL,
  `valor_puntos` int(11) DEFAULT NULL,
  `id_curso` int(11) NOT NULL,
  `id_aula` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Volcado de datos para la tabla `inscripcion`
--

INSERT INTO `inscripcion` (`id_inscripcion`, `fecha_inscripcion`, `fecha_finalizacion`, `costo`, `modalidad`, `progreso`, `estado`, `id_curso`, `id_rol_usuario`) VALUES
(1, '2025-10-26 23:07:58', NULL, 150, 'online', 0, 'activo', 1, 4),
(2, '2025-10-26 23:07:58', NULL, 200, 'online', 0, 'activo', 2, 4),
(4, '2025-10-01 00:00:00', NULL, 50, 'Presencial', 0, 'Activo', 4, 1),
(5, '2025-10-01 00:00:00', NULL, 70, 'Presencial', 0, 'Activo', 5, 1);

--
-- Disparadores `inscripcion`
--
DELIMITER $$
CREATE TRIGGER `trg_puntos_por_inscripcion` AFTER INSERT ON `inscripcion` FOR EACH ROW BEGIN
    UPDATE GESTION_PUNTOS
    SET total_puntos_acumulados = total_puntos_acumulados + 10,
        total_puntos_actuales = total_puntos_actuales + 10
    WHERE id_rol_usuario = NEW.id_rol_usuario;

    INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario)
    VALUES (
        'INSERT',
        CONCAT('Ganó 10 puntos por inscribirse al curso ID ', NEW.id_curso),
        'INSCRIPCION',
        NEW.id_rol_usuario
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insignia`
--

CREATE TABLE `insignia` (
  `id_insignia` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `id_rareza` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `insignia`
--

INSERT INTO `insignia` (`id_insignia`, `nombre`, `descripcion`, `id_rareza`) VALUES
(1, '10 asistencias', 'Asiste a 10 clases de manera puntual', 1),
(2, '1ra clase', 'Participa por primera vez en una clase', 1),
(3, '5 cursos', 'Completa exitosamente 5 cursos', 3),
(4, 'Promedio destacado', 'Obtén un promedio mayor a 90%', 4),
(5, 'Mejor de la clase', 'Sé el estudiante número 1 en el ranking', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `contrasenia` varchar(25) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `correo_institucional` varchar(40) NOT NULL,
  `id_rol_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id_login`, `contrasenia`, `codigo`, `correo_institucional`, `id_rol_usuario`) VALUES
(1, '123456', 'O8X58XCR', 'rosales@classcloud.edu.bo', 1),
(2, '1234567', 'U8X68XCR', 'gonzales@classcloud.edu.bo', 5),
(3, '123456', 'PR10Q8WY', 'usuarioprueba@classcloud.edu.bo', 6),
(4, '12345678', 'C236JO5W', 'josue@classcloud.edu.bo', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id_modulo` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `valor_puntos` int(11) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `obtener_insignia` (
  `id_obtener_insignia` int(11) NOT NULL,
  `id_rol_usuario` int(11) DEFAULT NULL,
  `id_insignia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obtener_insignia`
--

INSERT INTO `obtener_insignia` (`id_obtener_insignia`, `id_rol_usuario`, `id_insignia`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL,
  `fecha_pago` date NOT NULL,
  `monto_pagado` int(11) NOT NULL,
  `tipo_pago` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `pago`
--
DELIMITER $$
CREATE TRIGGER `trg_pago_insert` AFTER INSERT ON `pago` FOR EACH ROW BEGIN
    UPDATE GESTION_PUNTOS 
    SET total_puntos_actuales = total_puntos_actuales + (NEW.monto_pagado / 10)
    WHERE id_rol_usuario = (
        SELECT id_rol_usuario 
        FROM INSCRIPCION 
        WHERE id_inscripcion = NEW.id_inscripcion
        LIMIT 1
    );

    INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario)
    VALUES (
        'INSERT', 
        CONCAT('Pago de ', NEW.monto_pagado, ' Bs registrado.'),
        'PAGO',
        (SELECT id_rol_usuario FROM INSCRIPCION WHERE id_inscripcion = NEW.id_inscripcion LIMIT 1)
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso_modulo`
--

CREATE TABLE `progreso_modulo` (
  `id_progreso_modulo` int(11) NOT NULL,
  `progreso` double NOT NULL,
  `estado` varchar(15) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `id_inscripcion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rareza`
--

CREATE TABLE `rareza` (
  `id_rareza` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rareza`
--

INSERT INTO `rareza` (`id_rareza`, `nombre`, `valor`) VALUES
(1, 'Común', 10),
(2, 'Poco Común', 20),
(3, 'Rara', 40),
(4, 'Épica', 60),
(5, 'Legendaria', 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recompensa`
--

CREATE TABLE `recompensa` (
  `id_recompensa` int(11) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `precio_puntos` int(11) NOT NULL,
  `descuento` int(11) DEFAULT NULL,
  `id_tipo_recompensa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requisito`
--

CREATE TABLE `requisito` (
  `id_requisito` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `id_tipo_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `rol_permisos` (
  `id_rol_permisos` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `id_rol_usuario` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id_rol_usuario`, `id_usuario`, `id_rol`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 2),
(5, 5, 2),
(6, 6, 1),
(7, 7, 1);

--
-- Disparadores `rol_usuario`
--
DELIMITER $$
CREATE TRIGGER `trg_crear_gestion_puntos` AFTER INSERT ON `rol_usuario` FOR EACH ROW BEGIN
    INSERT INTO GESTION_PUNTOS (total_puntos_acumulados, total_puntos_gastados, total_puntos_actuales, id_rol_usuario)
    VALUES (0, 0, 0, NEW.id_rol_usuario);

    INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario)
    VALUES (
        'INSERT',
        'Se creó registro de puntos para nuevo usuario.',
        'ROL_USUARIO',
        NEW.id_rol_usuario
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seminario`
--

CREATE TABLE `seminario` (
  `id_seminario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `precio_puntos` int(11) DEFAULT NULL,
  `descripccion` varchar(200) NOT NULL,
  `id_curso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tema`
--

CREATE TABLE `tema` (
  `id_tema` int(11) NOT NULL,
  `nombre_tema` varchar(100) NOT NULL,
  `numero` int(11) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_curso`
--

CREATE TABLE `tipo_curso` (
  `id_tipo_curso` int(11) NOT NULL,
  `nombre_curso` varchar(100) NOT NULL,
  `curso_extra` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `tipo_recompensa` (
  `id_tipo_recompensa` int(11) NOT NULL,
  `nombre_tipo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

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
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombres`, `apellidos`, `fecha_nacimiento`, `ci`, `telefono`, `correo`, `estado`) VALUES
(1, 'Nayver', 'Mamani', '2004-04-06', '82402336', 68539527, 'rosales@gmail.com', 'Activo'),
(2, 'Laura', 'Gonzales', '1992-08-15', '1234568', 78965415, 'laura.gonzales@umss.edu.bo', 'activo'),
(3, 'Carlos', 'Torrez', '1985-04-02', '1234569', 78965416, 'carlos.torrez@umss.edu.bo', 'activo'),
(4, 'Andrea', 'Lopez', '1998-03-22', '1234570', 78965417, 'andrea.lopez@umss.edu.bo', 'activo'),
(5, 'Jose', 'Gonzales', '1985-04-02', '9493439', 74329912, 'gonzales@gmail.com', 'Activo'),
(6, 'usuarioprueba', 'prueba', '2025-02-28', '85672770', 45221332, 'usuarioprueba@gmail.com', 'Activo'),
(7, 'josue', 'menacho', '2015-12-07', '97204434', 55555555, 'josue@gmail.com', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `id_asistencia` (`id_asistencia`),
  ADD KEY `idx_asistencia_horario` (`id_horario`),
  ADD KEY `idx_asistencia_usuario` (`id_rol_usuario`),
  ADD KEY `idx_asistencia_fecha` (`fecha_asistencia`);

--
-- Indices de la tabla `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id_aula`),
  ADD UNIQUE KEY `id_aula` (`id_aula`);

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD UNIQUE KEY `id_bitacora` (`id_bitacora`),
  ADD KEY `id_rol_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `canje_certificado`
--
ALTER TABLE `canje_certificado`
  ADD PRIMARY KEY (`id_tipo_certificado`),
  ADD UNIQUE KEY `id_tipo_certificado` (`id_tipo_certificado`),
  ADD KEY `idx_canjecertificado_certificado` (`id_certificado`),
  ADD KEY `idx_canjecertificado_inscripcion` (`id_inscripcion`);

--
-- Indices de la tabla `canje_recompensa`
--
ALTER TABLE `canje_recompensa`
  ADD PRIMARY KEY (`id_recompensa`),
  ADD UNIQUE KEY `id_recompensa` (`id_recompensa`),
  ADD KEY `idx_canjerecompensa_tipo` (`id_tipo_recompensa`),
  ADD KEY `idx_canjerecompensa_usuario` (`id_rol_usuario`);

--
-- Indices de la tabla `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`id_certificado`),
  ADD UNIQUE KEY `id_certificado` (`id_certificado`),
  ADD KEY `idx_certificado_nombre` (`nombre`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`),
  ADD UNIQUE KEY `id_curso` (`id_curso`),
  ADD KEY `idx_curso_tipo` (`id_tipo_curso`),
  ADD KEY `idx_curso_docente` (`id_docente`);

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
  ADD UNIQUE KEY `id_curso` (`id_curso`),
  ADD KEY `idx_foro_curso` (`id_curso`);

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
  ADD KEY `idx_horario_curso` (`id_curso`),
  ADD KEY `idx_horario_aula` (`id_aula`);

--
-- Indices de la tabla `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD UNIQUE KEY `id_inscripcion` (`id_inscripcion`),
  ADD KEY `idx_inscripcion_curso` (`id_curso`),
  ADD KEY `idx_inscripcion_usuario` (`id_rol_usuario`);

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
  ADD KEY `idx_modulo_curso` (`id_curso`);

--
-- Indices de la tabla `obtener_insignia`
--
ALTER TABLE `obtener_insignia`
  ADD PRIMARY KEY (`id_obtener_insignia`),
  ADD UNIQUE KEY `id_obtener_insignia` (`id_obtener_insignia`),
  ADD KEY `idx_obtenerinsignia_usuario` (`id_rol_usuario`),
  ADD KEY `idx_obtenerinsignia_insignia` (`id_insignia`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `id_pago` (`id_pago`),
  ADD UNIQUE KEY `id_inscripcion` (`id_inscripcion`),
  ADD KEY `idx_pago_inscripcion` (`id_inscripcion`),
  ADD KEY `idx_pago_fecha` (`fecha_pago`);

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
  ADD KEY `idx_recompensa_tipo` (`id_tipo_recompensa`);

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
  ADD KEY `idx_rolpermisos_rol` (`id_rol`),
  ADD KEY `idx_rolpermisos_permiso` (`id_permiso`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id_rol_usuario`),
  ADD KEY `idx_rol_usuario_usuario` (`id_usuario`),
  ADD KEY `idx_rol_usuario_rol` (`id_rol`);

--
-- Indices de la tabla `seminario`
--
ALTER TABLE `seminario`
  ADD PRIMARY KEY (`id_seminario`),
  ADD UNIQUE KEY `id_seminario` (`id_seminario`),
  ADD KEY `idx_seminario_curso` (`id_curso`);

--
-- Indices de la tabla `tema`
--
ALTER TABLE `tema`
  ADD PRIMARY KEY (`id_tema`),
  ADD UNIQUE KEY `id_tema` (`id_tema`),
  ADD KEY `idx_tema_modulo` (`id_modulo`);

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
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `idx_usuario_correo` (`correo`),
  ADD KEY `idx_usuario_ci` (`ci`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `aula`
--
ALTER TABLE `aula`
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id_bitacora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id_gestion_puntos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id_insignia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `obtener_insignia`
--
ALTER TABLE `obtener_insignia`
  MODIFY `id_obtener_insignia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id_rareza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id_rol_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Filtros para la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`id_rol_usuario`) REFERENCES `rol_usuario` (`id_rol_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
