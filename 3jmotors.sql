-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 26 mai 2026 à 08:15
-- Version du serveur : 11.8.6-MariaDB-0+deb13u1 from Debian
-- Version de PHP : 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `3jmotors`
--

-- --------------------------------------------------------

--
-- Structure de la table `capteur`
--

CREATE TABLE `capteur` (
  `ID_CAPTEUR` int(11) NOT NULL,
  `TYPE_CAPTEUR` int(11) NOT NULL,
  `ID_MODELE_CAPTEUR` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `mesure`
--

CREATE TABLE `mesure` (
  `ID_MESURE` int(11) NOT NULL,
  `ID_CAPTEUR` int(11) NOT NULL,
  `UNITE_MESURE` int(11) NOT NULL,
  `ID_SITE` int(11) NOT NULL,
  `MESURE` decimal(3,2) DEFAULT NULL,
  `DATE_MESURE` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `modele_capteur`
--

CREATE TABLE `modele_capteur` (
  `ID_MODELE_CAPTEUR` int(11) NOT NULL,
  `LIBELLE_MODELE_CAPTEUR` varchar(100) DEFAULT NULL,
  `PLAGE_MESURE_1` varchar(50) DEFAULT NULL,
  `PLAGE_MESURE_2` varchar(50) DEFAULT NULL,
  `PRECISION_1` varchar(30) DEFAULT NULL,
  `PRECISION_2` varchar(30) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `site`
--

CREATE TABLE `site` (
  `ID_SITE` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL,
  `TYPE_SITE` int(11) NOT NULL,
  `NUM_ETAGE` int(11) DEFAULT NULL,
  `LIBELLE_SITE` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_capteur`
--

CREATE TABLE `type_capteur` (
  `TYPE_CAPTEUR` int(11) NOT NULL,
  `LIBELLE_TYPE_CAPTEUR` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_site`
--

CREATE TABLE `type_site` (
  `TYPE_SITE` int(11) NOT NULL,
  `LIBELLE_TYPE_SITE` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_user`
--

CREATE TABLE `type_user` (
  `TYPE_USER` int(11) NOT NULL,
  `LIBELLE_TYPE_USER` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `unite_mesure`
--

CREATE TABLE `unite_mesure` (
  `UNITE_MESURE` int(11) NOT NULL,
  `LIBELLE_UNITE_MESURE` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `ID_USER` int(11) NOT NULL,
  `TYPE_USER` int(11) NOT NULL,
  `NOM_USER` varchar(60) DEFAULT NULL,
  `MAIL_USER` varchar(80) DEFAULT NULL,
  `MDP` varchar(250) DEFAULT NULL,
  `DATE_CONNEXION` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_uca1400_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `capteur`
--
ALTER TABLE `capteur`
  ADD PRIMARY KEY (`ID_CAPTEUR`),
  ADD KEY `FK_CONCERNE` (`TYPE_CAPTEUR`),
  ADD KEY `FK_RECUPERE` (`ID_MODELE_CAPTEUR`);

--
-- Index pour la table `mesure`
--
ALTER TABLE `mesure`
  ADD PRIMARY KEY (`ID_MESURE`),
  ADD KEY `FK_ASSOCIER` (`ID_SITE`),
  ADD KEY `FK_FOURNI` (`ID_CAPTEUR`),
  ADD KEY `FK_POSSEDE` (`UNITE_MESURE`);

--
-- Index pour la table `modele_capteur`
--
ALTER TABLE `modele_capteur`
  ADD PRIMARY KEY (`ID_MODELE_CAPTEUR`);

--
-- Index pour la table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`ID_SITE`),
  ADD KEY `FK_AFFECTER` (`TYPE_SITE`),
  ADD KEY `FK_MANAGER` (`ID_USER`);

--
-- Index pour la table `type_capteur`
--
ALTER TABLE `type_capteur`
  ADD PRIMARY KEY (`TYPE_CAPTEUR`);

--
-- Index pour la table `type_site`
--
ALTER TABLE `type_site`
  ADD PRIMARY KEY (`TYPE_SITE`);

--
-- Index pour la table `type_user`
--
ALTER TABLE `type_user`
  ADD PRIMARY KEY (`TYPE_USER`);

--
-- Index pour la table `unite_mesure`
--
ALTER TABLE `unite_mesure`
  ADD PRIMARY KEY (`UNITE_MESURE`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID_USER`),
  ADD KEY `FK_CORRESPONDRE` (`TYPE_USER`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `capteur`
--
ALTER TABLE `capteur`
  MODIFY `ID_CAPTEUR` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `mesure`
--
ALTER TABLE `mesure`
  MODIFY `ID_MESURE` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `modele_capteur`
--
ALTER TABLE `modele_capteur`
  MODIFY `ID_MODELE_CAPTEUR` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `site`
--
ALTER TABLE `site`
  MODIFY `ID_SITE` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `type_capteur`
--
ALTER TABLE `type_capteur`
  MODIFY `TYPE_CAPTEUR` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `type_site`
--
ALTER TABLE `type_site`
  MODIFY `TYPE_SITE` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `type_user`
--
ALTER TABLE `type_user`
  MODIFY `TYPE_USER` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `unite_mesure`
--
ALTER TABLE `unite_mesure`
  MODIFY `UNITE_MESURE` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
