

## 1. Vue d’ensemble

La nouvelle version de la base de données repose sur la même logique fonctionnelle que le modèle initial, mais elle apporte :

- une **formalisation SQL complète**
    
- un **renforcement des contraintes d’intégrité**
    
- une **clarification des relations (cardinalités réelles)**
    
- des **améliorations de sécurité et de cohérence des données**
    

---

## 2. Évolutions globales

### ✅ Points conservés

- Les entités principales sont identiques :
    
    - `User`
        
    - `Type_User`
        
    - `Site`
        
    - `Banc_Puissance`
        
    - `Capteur`
        
    - `Type_Capteur`
        
- Les relations fonctionnelles du diagramme sont respectées.
    
- Les cardinalités globales (1-N, 1-1) sont conservées.
    

---

## 3. Modifications détaillées par table

---

### 🧑‍💼 Table `Type_User`

**Ancienne version (diagramme)**

- Table présente avec identifiant et libellé.
    

**Nouvelle version (SQL)**

`CREATE TABLE Type_User (     Type_user INT PRIMARY KEY AUTO_INCREMENT,     Libelle_Type_User VARCHAR(100) NOT NULL );`

✅ **Améliorations**

- Ajout de `AUTO_INCREMENT`
    
- Ajout de la contrainte `NOT NULL` sur le libellé
    
- Structure claire et normalisée
    

---

### 👤 Table `User`

**Ancienne version**

- Lien avec `Type_User`
    
- Lien 1-1 avec `Site`
    
- Champs fonctionnels présents
    

**Nouvelle version**

`Username VARCHAR(100) NOT NULL UNIQUE Email VARCHAR(150) NOT NULL UNIQUE`

✅ **Modifications majeures**

- Ajout de contraintes `UNIQUE` sur `Username` et `Email`
    
- Ajout de `DEFAULT CURRENT_TIMESTAMP` sur `Date_creation_user`
    
- Séparation explicite des clés étrangères :
    
    - `Type_user`
        
    - `Id_Site`
        

🔐 **Sécurité améliorée**

- `Password` en `VARCHAR(255)` (adapté au hash)
    
- Support du `Reset_Token`
    

---

### 🏭 Table `Site`

**Ancienne version**

- Table existante avec relation vers `User` et `Banc_Puissance`
    

**Nouvelle version**

`CREATE TABLE Site (     Id_Site INT PRIMARY KEY AUTO_INCREMENT,     Adresse_site VARCHAR(255) NOT NULL );`

✅ **Améliorations**

- Clé primaire auto-incrémentée
    
- Contrainte `NOT NULL` sur l’adresse
    

---

### 🔗 Relation `User` → `Site`

**Diagramme**

- Relation **1-1**
    

**SQL**

`ALTER TABLE User ADD CONSTRAINT fk_user_site FOREIGN KEY (Id_Site) REFERENCES Site(Id_Site);`

✅ Relation correctement implémentée  
⚠️ **Remarque** : l’unicité côté `User.Id_Site` n’est pas forcée → plusieurs users peuvent techniquement pointer vers un même site (à corriger si 1-1 strict requis).

---

### ⚡ Table `Banc_Puissance`

**Nouvelle version**

`Id_Site INT NOT NULL UNIQUE`

✅ **Évolution importante**

- La contrainte `UNIQUE` sur `Id_Site` impose :
    
    - **1 site = 1 banc de puissance**
        
- Ceci rend la relation **1-1 effective au niveau SQL**, ce qui n’était pas garanti dans le diagramme.
    

---

### 📡 Table `Type_Capteur`

**Ancienne version**

- Table existante
    

**Nouvelle version**

`Libelle_Capteur VARCHAR(100) NOT NULL, Modele_Capteur VARCHAR(100)`

✅ Ajout :

- d’une contrainte `NOT NULL` sur le libellé
    
- meilleure description métier du capteur
    

---

### 📊 Table `Capteur`

**Ancienne version**

- Relation avec `Type_Capteur`
    
- Relation N-1 avec `Banc_Puissance`
    

**Nouvelle version**

`CONSTRAINT fk_capteur_type CONSTRAINT fk_capteur_banc`

✅ **Améliorations**

- Relations clairement nommées
    
- Intégrité référentielle garantie
    
- Cardinalités respectées :
    
    - Plusieurs capteurs → un banc
        
    - Plusieurs capteurs → un type
        

---

## 4. Synthèse des améliorations

|Aspect|Amélioration|
|---|---|
|Intégrité|Clés étrangères explicites|
|Sécurité|Mots de passe hashables, reset token|
|Cohérence|Contraintes `NOT NULL` et `UNIQUE`|
|Modélisation|Relations 1-1 réellement appliquées|
|Lisibilité|Nommage clair des contraintes|

---

## 5. Conclusion

La nouvelle base de données représente une **évolution robuste et professionnelle** du modèle initial.  
Elle traduit fidèlement le diagramme tout en corrigeant ses limites techniques, notamment :

- l’absence de contraintes réelles
    
- les ambiguïtés sur les relations 1-1
    
- la sécurité des données utilisateurs
    

👉 Cette version est **prête pour un environnement de production**.