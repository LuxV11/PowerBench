  [[Doc Base de donnée V2]]


```SQL
-- =========================
-- TABLE : Type_User
-- =========================
CREATE TABLE Type_User (
    Type_user INT PRIMARY KEY AUTO_INCREMENT,
    Libelle_Type_User VARCHAR(100) NOT NULL
);

-- =========================
-- TABLE : User
-- =========================
CREATE TABLE User (
    ID_Users INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Date_modification_user DATETIME,
    Reset_Token VARCHAR(255),
    Date_creation_user DATETIME DEFAULT CURRENT_TIMESTAMP,

    Type_user INT NOT NULL,
    Id_Site INT NOT NULL,

    CONSTRAINT fk_user_type
        FOREIGN KEY (Type_user)
        REFERENCES Type_User(Type_user)
);

-- =========================
-- TABLE : Site
-- =========================
CREATE TABLE Site (
    Id_Site INT PRIMARY KEY AUTO_INCREMENT,
    Adresse_site VARCHAR(255) NOT NULL
);

-- Ajout de la clé étrangère User → Site (1,1)
ALTER TABLE User
ADD CONSTRAINT fk_user_site
FOREIGN KEY (Id_Site)
REFERENCES Site(Id_Site);

-- =========================
-- TABLE : Banc_Puissance
-- =========================
CREATE TABLE Banc_Puissance (
    Id_banc_Puissance INT PRIMARY KEY AUTO_INCREMENT,
    Libelle_Banc_Puissance VARCHAR(150) NOT NULL,

    Id_Site INT NOT NULL UNIQUE,

    CONSTRAINT fk_banc_site
        FOREIGN KEY (Id_Site)
        REFERENCES Site(Id_Site)
);

-- =========================
-- TABLE : Type_Capteur
-- =========================
CREATE TABLE Type_Capteur (
    Type_Capteur INT PRIMARY KEY AUTO_INCREMENT,
    Libelle_Capteur VARCHAR(100) NOT NULL,
    Modele_Capteur VARCHAR(100)
);

-- =========================
-- TABLE : Capteur
-- =========================
CREATE TABLE Capteur (
    Id_capteur INT PRIMARY KEY AUTO_INCREMENT,
    Mesure_capteur VARCHAR(100) NOT NULL,

    Type_Capteur INT NOT NULL,
    Id_banc_Puissance INT NOT NULL,

    CONSTRAINT fk_capteur_type
        FOREIGN KEY (Type_Capteur)
        REFERENCES Type_Capteur(Type_Capteur),

    CONSTRAINT fk_capteur_banc
        FOREIGN KEY (Id_banc_Puissance)
        REFERENCES Banc_Puissance(Id_banc_Puissance)
);


```


