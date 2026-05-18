# Rapport de conception – Base de données (Version Bêta)

## 1. Contexte du projet

Le projet consiste à développer un **dashboard de visualisation de données moteur** destiné à une **seule machine** et **une seule voiture**, en l’occurrence une **Mercedes C63 AMG**.  
Ce dashboard a pour objectif d’afficher et, le cas échéant, d’historiser des **mesures moteur** telles que le régime (RPM), la puissance, le couple, la température ou les émissions.

La version actuelle du projet est explicitement définie comme une **version bêta**, avec une volonté claire de :
- limiter la complexité,
- réduire les risques techniques,
- favoriser la rapidité de développement et de validation,
- garantir une base saine et évolutive.

---

## 2. Périmètre fonctionnel de la version bêta

### 2.1 Fonctionnalités incluses
La version bêta doit permettre :
- l’acquisition de valeurs mesurées,
- l’affichage de ces valeurs en temps réel ou quasi temps réel,
- l’historisation optionnelle des mesures,
- la consultation de valeurs passées (courbes, tendances).

### 2.2 Fonctionnalités exclues
Les éléments suivants sont **hors périmètre volontairement** :
- gestion des utilisateurs,
- gestion multi-véhicules,
- gestion multi-moteurs,
- configuration avancée des capteurs,
- permissions, rôles ou audit,
- comparaison de sessions ou d’historiques complexes.

Ces exclusions sont des **choix de conception assumés**, cohérents avec une version bêta.

---

## 3. Analyse de la donnée métier

### 3.1 Identification de la donnée fondamentale

Après analyse fonctionnelle, il apparaît que **toutes les fonctionnalités de la bêta reposent sur une seule entité métier fondamentale** :

> **La mesure**

Une mesure est définie par :
- un **type** (ex. RPM, Power, Torque),
- une **valeur numérique**,
- une **unité**,
- un **instant de mesure**.

Toutes les données manipulées par le système partagent exactement cette structure.

---

### 3.2 Absence de besoin de relations complexes

Dans le contexte actuel :
- il n’existe qu’un seul véhicule,
- un seul moteur,
- une seule source de données logique,
- aucun besoin de différenciation par utilisateur ou session.

Par conséquent :
- aucune relation inter-entités n’est requise,
- aucune clé étrangère n’apporte de valeur fonctionnelle,
- toute table supplémentaire introduirait une complexité non justifiée.

---

## 4. Justification du choix d’une base à table unique

### 4.1 Principe de sobriété architecturale

Le choix d’une **base de données composée d’une seule table** répond au principe fondamental suivant :

> *Ne pas introduire de complexité tant qu’elle n’apporte pas de valeur métier.*

Dans le cadre de cette bêta, une seule table permet de couvrir **100 % des besoins fonctionnels identifiés**.

---

### 4.2 Risques évités par ce choix

L’introduction prématurée de tables supplémentaires (Vehicle, Engine, Sensor, SensorType, etc.) aurait pour conséquences :
- une augmentation du temps de développement,
- une multiplication des jointures inutiles,
- une augmentation du risque de bugs,
- une rigidité accrue lors des évolutions futures,
- une difficulté de maintenance sans bénéfice immédiat.

---

### 4.3 Avantages techniques

Une table unique offre :
- des requêtes simples et performantes,
- une excellente lisibilité du modèle de données,
- une facilité de débogage,
- une intégration directe avec des flux temps réel,
- une compatibilité idéale avec SQLite ou PostgreSQL.

---

## 5. Description de la table centrale `measurement`

### 5.1 Rôle de la table

La table `measurement` constitue **le cœur du système**.  
Elle représente l’unique source de vérité pour toutes les données affichées et analysées par le dashboard.

---

### 5.2 Champs et justification

| Champ | Rôle | Justification |
|-----|-----|--------------|
| `id` | Identifiant unique | Nécessaire pour l’identification technique |
| `type` | Type de mesure | Permet d’identifier la nature de la donnée |
| `value` | Valeur mesurée | Donnée brute utilisée par le système |
| `unit` | Unité | Garantit la cohérence et l’interprétation correcte |
| `timestamp` | Date et heure | Indispensable pour l’historisation et l’analyse |

Chaque champ a une **utilité directe et immédiate** dans la version bêta.

---

## 6. Évolutivité maîtrisée

Ce modèle minimal n’est pas un frein à l’évolution future.  
Il constitue au contraire une **base solide et extensible**.

Des évolutions futures possibles incluent :
- ajout d’un champ `session_id`,
- ajout d’une table `vehicle` en cas de multi-véhicules,
- ajout d’utilisateurs,
- ajout de métadonnées de capteurs.

Ces évolutions pourront être réalisées **sans remise en cause du modèle initial**.

---

## 7. Conclusion

Le choix d’une base de données à **table unique** pour la version bêta du projet est :
- techniquement justifié,
- fonctionnellement suffisant,
- cohérent avec les objectifs du projet,
- aligné avec les bonnes pratiques d’ingénierie logicielle.

Ce choix permet de livrer rapidement une solution fiable, testable et évolutive, tout en évitant la sur-ingénierie et les coûts techniques inutiles.

La table `measurement` constitue ainsi **l’élément central et critique** de l’architecture de données de la version bêta.