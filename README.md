# Projet de Détection d'Inondations avec Google Earth Engine

Ce projet contient des scripts pour l'analyse et la détection d'inondations en utilisant les images satellites Sentinel-1 et Sentinel-2 via Google Earth Engine.

## 📋 Table des matières

- [Introduction](#introduction)
- [Prérequis](#prérequis)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Guide d'utilisation](#guide-dutilisation)
- [Créer une plateforme interactive](#créer-une-plateforme-interactive)
- [Concepts de base](#concepts-de-base)
- [Ressources utiles](#ressources-utiles)

## 🌊 Introduction

### Qu'est-ce que Google Earth Engine ?

Google Earth Engine (GEE) est une plateforme cloud qui permet d'analyser des quantités massives de données satellitaires. Elle met à disposition des archives de données de télédétection (plus de 40 ans) et fournit des outils de calcul parallèle pour traiter ces données.

### Pourquoi Sentinel-1 et Sentinel-2 ?

**Sentinel-1 (Radar)**
- Capteur radar (SAR) - fonctionne jour et nuit, à travers les nuages
- Résolution: 5-40m
- Fréquence de revisite: 6 jours (avec les deux satellites)
- Idéal pour la détection d'eau car l'eau réfléchit peu le radar

**Sentinel-2 (Optique)**
- Capteur optique multispectral
- Résolution: 10-60m
- Fréquence de revisite: 5 jours (avec les deux satellites)
- Utilise des indices spectraux (NDWI, MNDWI) pour détecter l'eau

## 📦 Prérequis

1. **Compte Google Earth Engine**
   - Allez sur https://code.earthengine.google.com/
   - Connectez-vous avec votre compte Google
   - Demandez l'accès (gratuit pour usage non-commercial)

2. **Navigateur web**
   - Chrome, Firefox ou Edge recommandé

3. **Connaissances de base (optionnelles)**
   - Notions de JavaScript
   - Concepts de base en télédétection et SIG

## 📁 Structure du projet

```
projet/
├── scripts/                    # Scripts Earth Engine
│   ├── sentinel1_flood_detection.js      # Détection avec Sentinel-1
│   ├── sentinel2_flood_detection.js      # Détection avec Sentinel-2
│   ├── sentinel1_before_after.js         # Comparaison avant/après
│   ├── sentinel1_advanced.js             # Script avancé avec statistiques
│   └── earth_engine_app.js               # Application interactive complète
├── data/                       # Pour stocker les données exportées
├── docs/                       # Documentation supplémentaire
│   ├── guide_debutant.md       # Guide des concepts de base
│   └── guide_plateforme.md     # Guide pour créer une plateforme
├── config.json                 # Configuration et régions d'exemple
└── README.md                   # Ce fichier
```

## 🚀 Scripts disponibles

### 1. sentinel1_flood_detection.js

Détection d'inondations utilisant les images radar Sentinel-1.

**Avantages:**
- Fonctionne même avec couverture nuageuse
- Sensible à la présence d'eau
- Bon pour les zones tropicales et à couverture nuageuse fréquente

**Paramètres à modifier:**
- `geometry`: Zone d'étude (coordonnées)
- `startDate` et `endDate`: Période d'analyse
- `waterThreshold`: Seuil de détection d'eau (-25 à -10)

### 2. sentinel2_flood_detection.js

Détection d'inondations utilisant les images optiques Sentinel-2.

**Avantages:**
- Utilise des indices spectraux (NDWI, MNDWI)
- Images en vraies couleurs plus intuitives
- Meilleure résolution spectrale

**Paramètres à modifier:**
- `geometry`: Zone d'étude
- `startDate` et `endDate`: Période d'analyse
- `ndwiThreshold` et `mndwiThreshold`: Seuils de détection

### 3. sentinel1_before_after.js

Comparaison avant/après inondation avec Sentinel-1.

**Fonctionnalités:**
- Compare deux périodes temporelles
- Identifie les nouvelles zones inondées
- Identifie les zones où l'eau s'est retirée
- Calcul des superficies de changement

**Paramètres à modifier:**
- `geometry`: Zone d'étude
- `beforeStartDate` et `beforeEndDate`: Période avant
- `afterStartDate` et `afterEndDate`: Période après

### 4. sentinel1_advanced.js

Version avancée de la détection avec Sentinel-1.

**Fonctionnalités:**
- Statistiques détaillées (superficie, pourcentage)
- Série temporelle mensuelle
- Graphiques d'évolution
- Interface utilisateur avec panneau de contrôle
- Plusieurs palettes de visualisation

**Paramètres à modifier:**
- `geometry`: Zone d'étude
- `startDate` et `endDate`: Période d'analyse
- `waterThreshold`: Seuil de détection

### 5. earth_engine_app.js

Application interactive complète avec interface utilisateur.

**Fonctionnalités:**
- Sélection interactive de la région (menu déroulant)
- Choix des dates via interface
- Slider pour ajuster le seuil de détection
- Affichage des résultats en temps réel
- Export vers Google Drive via bouton
- Partageable via lien URL

**Comment utiliser:**
1. Créez une nouvelle App dans GEE (File > New > App)
2. Copiez le code dans le fichier d'application
3. Cliquez sur Run
4. Publiez pour partager

## 📖 Guide d'utilisation

### Étape 1: Ouvrir Google Earth Engine

1. Allez sur https://code.earthengine.google.com/
2. Connectez-vous avec votre compte Google

### Étape 2: Copier un script

1. Ouvrez un des fichiers `.js` dans le dossier `scripts/`
2. Copiez tout le contenu du fichier
3. Collez-le dans l'éditeur de Google Earth Engine

### Étape 3: Configurer la zone d'étude

Dans chaque script, vous trouverez une section de configuration:

```javascript
// Zone d'étude (exemple: delta du Nil - changez selon votre région)
var geometry = ee.Geometry.Rectangle([31.0, 30.0, 32.0, 31.5]);
```

Pour définir votre propre zone:

**Option A: Utiliser un rectangle**
```javascript
var geometry = ee.Geometry.Rectangle([longitude_min, latitude_min, longitude_max, latitude_max]);
```

**Option B: Utiliser un point avec un rayon**
```javascript
var geometry = ee.Geometry.Point([longitude, latitude]).buffer(10000); // 10km de rayon
```

**Option C: Dessiner sur la carte**
- Dans GEE, utilisez l'outil de dessin (icône de polygone)
- Dessinez votre zone sur la carte
- Le code sera généré automatiquement

### Étape 4: Configurer les dates

```javascript
var startDate = '2024-01-01';
var endDate = '2024-12-31';
```

Format: YYYY-MM-DD

## 🚀 Créer une plateforme interactive

Pour transformer vos scripts en une application web interactive partageable, consultez le guide détaillé: <ref_file file="D:\TELECHARGEMENT\projet\docs\guide_plateforme.md" />

### Scripts pour plateforme

1. **sentinel1_advanced.js** - Script amélioré avec statistiques avancées et graphiques
2. **earth_engine_app.js** - Application complète avec interface utilisateur interactive

### Fonctionnalités de l'app

- ✅ Sélection interactive de la région (Abidjan, Dakar, Lagos, etc.)
- ✅ Choix des dates d'analyse
- ✅ Slider pour ajuster le seuil de détection
- ✅ Affichage des statistiques en temps réel
- ✅ Export vers Google Drive
- ✅ Partage via lien URL

### Comment créer l'app

1. Ouvrez Google Earth Engine
2. Cliquez sur **File** > **New** > **App**
3. Copiez le code de `earth_engine_app.js`
4. Collez dans le nouveau fichier
5. Cliquez sur **Run**
6. Cliquez sur **Publish** pour partager

### Étape 6: Exporter les résultats

Les scripts incluent des commandes d'export vers Google Drive:

1. Dans le panneau "Tasks" (en haut à droite), vous verrez les tâches d'export
2. Cliquez sur le bouton **"Run"** à côté de la tâche
3. Configurez les options d'export:
   - **Description**: Nom du fichier
   - **Drive folder**: Dossier dans Google Drive
4. Cliquez sur **"Run"** pour lancer l'export
5. Le fichier sera disponible dans votre Google Drive

### Étape 7: Exécuter le script (pour scripts simples)

Pour les scripts simples (pas l'app):
1. Cliquez sur le bouton **"Run"** en haut de l'éditeur
2. Attendez que le script s'exécute
3. Les résultats s'affichent dans:
   - La carte (à droite)
   - La console (en bas à droite)
   - Le panneau "Tasks" (en haut à droite) pour les exports

## 📚 Concepts de base

### Indices spectraux utilisés

#### NDWI (Normalized Difference Water Index)
```
NDWI = (Green - NIR) / (Green + NIR)
```
- Utilise les bandes verte et proche infrarouge
- Valeurs positives indiquent la présence d'eau
- Seuil typique: > 0.3

#### MNDWI (Modified NDWI)
```
MNDWI = (Green - SWIR) / (Green + SWIR)
```
- Utilise les bandes verte et infrarouge à courte longueur d'onde
- Mieux sépare l'eau des zones urbaines
- Seuil typique: > 0.3

### Valeurs de rétrodiffusion radar (Sentinel-1)

Les valeurs de rétrodiffusion (backscatter) sont en décibels (dB):
- **Eau**: -25 à -10 dB (réfléchit peu le radar)
- **Végétation**: -15 à -5 dB
- **Zones urbaines**: -5 à +5 dB (réfléchit beaucoup)

### Comprendre les résultats

**Carte des zones inondées:**
- **Blanc**: Pas d'eau
- **Bleu**: Eau détectée

**Carte de changement (avant/après):**
- **Rouge**: Nouvelles zones inondées
- **Vert**: Eau retirée
- **Bleu**: Eau persistante

## 🔧 Personnalisation

### Ajuster les seuils de détection

**Pour Sentinel-1:**
```javascript
var waterThreshold = -16;  // Plus bas = plus sensible à l'eau
```

**Pour Sentinel-2:**
```javascript
var ndwiThreshold = 0.3;   // Plus bas = plus sensible à l'eau
var mndwiThreshold = 0.3;
```

### Filtrer les nuages (Sentinel-2)

```javascript
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))  // 20% max de nuages
```

### Changer la résolution d'export

```javascript
scale: 10,  // 10 mètres pour Sentinel-1 et Sentinel-2
scale: 20,  // 20 mètres (plus rapide, moins précis)
```

## 📊 Analyse des résultats

Les scripts calculent automatiquement:
- Superficie totale des zones inondées (en m²)
- Nombre d'images utilisées
- Série temporelle (pour Sentinel-2)
- Statistiques de changement (pour avant/après)

Ces informations s'affichent dans la console en bas à droite de l'interface GEE.

## 🌐 Ressources utiles

### Documentation officielle
- [Google Earth Engine Documentation](https://developers.google.com/earth-engine)
- [Sentinel-1 User Guide](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-1-sar)
- [Sentinel-2 User Guide](https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi)

### Tutoriels
- [Earth Engine Tutorials](https://developers.google.com/earth-engine/tutorials)
- [Earth Engine Catalog](https://developers.google.com/earth-engine/datasets)

### Exemples de code
- [Earth Engine Gallery](https://code.earthengine.google.com/)
- Recherchez "flood" ou "water" dans la galerie

## 💡 Conseils pour les débutants

1. **Commencez petit**: Testez d'abord sur une petite zone géographique
2. **Utilisez les dates récentes**: Les données Sentinel sont disponibles depuis 2014
3. **Vérifiez la couverture**: Assurez-vous qu'il y a des images pour votre période et zone
4. **Ajustez les seuils**: Les seuils par défaut peuvent ne pas convenir à toutes les régions
5. **Comparez les résultats**: Utilisez Sentinel-1 et Sentinel-2 pour valider vos résultats

## 🐛 Dépannage

### Problème: "Collection query aborted"
- Cause: Trop de données ou zone trop grande
- Solution: Réduisez la zone d'étude ou la période temporelle

### Problème: "Memory limit exceeded"
- Cause: Zone trop grande ou trop d'images
- Solution: Divisez votre zone en plusieurs parties ou utilisez une période plus courte

### Problème: Pas d'images disponibles
- Cause: Mauvaises dates ou zone de couverture
- Solution: Vérifiez les dates et la position géographique

### Problème: Résultats peu précis
- Cause: Seuils inadaptés
- Solution: Ajustez les seuils selon votre région

## 📝 Notes importantes

- Les scripts sont fournis à titre éducatif
- Pour un usage professionnel, validez toujours les résultats avec des données de terrain
- Les seuils de détection peuvent varier selon la région et la saison
- Consultez les métadonnées des images pour comprendre les conditions d'acquisition

## 🤝 Contribution

Ce projet est destiné à l'apprentissage. N'hésitez pas à modifier les scripts selon vos besoins.

## 📄 Licence

Ce projet est fourni gratuitement à des fins éducatives.

---

**Bon courage pour votre projet de détection d'inondations !** 🌊🛰️
