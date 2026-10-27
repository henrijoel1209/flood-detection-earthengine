# Guide du Débutant en Télédétection et SIG

Ce guide est conçu pour vous aider à comprendre les concepts de base de la télédétection et des SIG (Systèmes d'Information Géographique) dans le contexte de votre projet d'inondations.

## 📚 Concepts Fondamentaux

### Qu'est-ce que la Télédétection ?

La télédétection est l'acquisition d'informations sur un objet ou un phénomène sans contact physique avec celui-ci. Dans notre cas, nous utilisons des satellites pour observer la Terre depuis l'espace.

### Qu'est-ce qu'un SIG ?

Un Système d'Information Géographique (SIG) est un système conçu pour capturer, stocker, manipuler, analyser, gérer et présenter des données spatiales ou géographiques.

## 🛰️ Les Satellites Sentinel

### Mission Copernicus

Les satellites Sentinel font partie du programme Copernicus de l'Union Européenne, qui fournit des données d'observation de la Terre gratuites et ouvertes.

### Sentinel-1

**Type:** Radar (SAR - Synthetic Aperture Radar)

**Caractéristiques:**
- Onde électromagnétique émise par le satellite
- Fonctionne jour et nuit
- Traverse les nuages et la pluie
- Mesure la rétrodiffusion (réflexion) de l'onde

**Avantages pour les inondations:**
- Peut observer même quand il y a des nuages (fréquent pendant les inondations)
- L'eau réfléchit peu le radar (apparaît sombre)
- Sensible à la rugosité de surface

**Inconvénients:**
- Images en noir et blanc (pas de couleurs naturelles)
- Interprétation plus complexe que les images optiques

### Sentinel-2

**Type:** Optique multispectral

**Caractéristiques:**
- Capteur optique comme un appareil photo
- Fonctionne avec la lumière du soleil
- 13 bandes spectrales (différentes longueurs d'onde)
- Résolution jusqu'à 10m

**Avantages pour les inondations:**
- Images en couleurs naturelles
- Utilisation d'indices spectraux (NDWI, MNDWI)
- Plus intuitif pour les débutants

**Inconvénients:**
- Ne fonctionne pas à travers les nuages
- Ne fonctionne pas la nuit

## 🌈 Bandes Spectrales (Sentinel-2)

Les satellites optiques comme Sentinel-2 mesurent la lumière dans différentes bandes spectrales:

| Bande | Nom | Longueur d'onde (μm) | Résolution (m) | Utilisation |
|-------|-----|---------------------|----------------|-------------|
| B1 | Coastal aerosol | 0.433-0.453 | 60 | Aérosols côtiers |
| B2 | Blue | 0.458-0.523 | 10 | Eau peu profonde |
| B3 | Green | 0.543-0.578 | 10 | Végétation, eau |
| B4 | Red | 0.650-0.680 | 10 | Végétation |
| B5 | Red Edge 1 | 0.698-0.713 | 20 | Végétation |
| B6 | Red Edge 2 | 0.733-0.748 | 20 | Végétation |
| B7 | Red Edge 3 | 0.773-0.793 | 20 | Végétation |
| B8 | NIR | 0.785-0.900 | 10 | Végétation, biomasse |
| B8A | Red Edge 4 | 0.855-0.875 | 20 | Végétation |
| B9 | Water vapour | 0.940-0.948 | 60 | Vapeur d'eau |
| B10 | Cirrus | 1.360-1.390 | 60 | Cirrus |
| B11 | SWIR 1 | 1.565-1.655 | 20 | Nuages, neige, eau |
| B12 | SWIR 2 | 2.100-2.280 | 20 | Nuages, neige, eau |

**Abréviations:**
- NIR: Near Infrared (Proche infrarouge)
- SWIR: Short-Wave Infrared (Infrarouge à courte longueur d'onde)

## 📊 Indices Spectraux

### NDWI (Normalized Difference Water Index)

**Formule:**
```
NDWI = (Green - NIR) / (Green + NIR)
```

**Explication:**
- L'eau absorbe fortement dans le NIR (valeur basse)
- L'eau réfléchit dans le vert (valeur élevée)
- Résultat: valeurs positives pour l'eau (-1 à +1)

**Interprétation:**
- NDWI > 0.3: Présence d'eau probable
- NDWI < 0: Pas d'eau

### MNDWI (Modified NDWI)

**Formule:**
```
MNDWI = (Green - SWIR) / (Green + SWIR)
```

**Pourquoi le modifier?**
- Le SWIR est mieux absorbé par l'eau que le NIR
- Les zones urbaines réfléchissent dans le NIR (confusion possible)
- MNDWI sépare mieux l'eau des zones construites

## 🗺️ Systèmes de Coordonnées

### Latitude et Longitude

**Latitude:** Distance nord/sud de l'équateur (-90° à +90°)
- Positive: Nord de l'équateur
- Négative: Sud de l'équateur

**Longitude:** Distance est/ouest du méridien de Greenwich (-180° à +180°)
- Positive: Est de Greenwich
- Négative: Ouest de Greenwich

**Exemple:**
- Paris: 48.8566° N, 2.3522° E
- Dakar: 14.7167° N, 17.4677° W

### CRS (Coordinate Reference System)

Le système de coordonnées de référence le plus utilisé:
- **EPSG:4326**: WGS84 (latitude/longitude en degrés)
- **EPSG:3857**: Web Mercator (mètres, utilisé par Google Maps)

## 🖼️ Types d'Images

### Images optiques

- Similaires aux photos
- Dépendent de la lumière du soleil
- Ne fonctionnent pas à travers les nuages
- Riches en informations spectrales

### Images radar

- Utilisent des ondes électromagnétiques
- Fonctionnent jour et nuit
- Traversent les nuages
- Mesurent la texture et la rugosité

## 🎯 Détection d'Eau

### Principes physiques

**Eau et radar:**
- L'eau calme est lisse → réfléchit peu le radar → apparaît sombre
- L'eau agitée est rugueuse → réfléchit plus → apparaît plus clair

**Eau et optique:**
- L'eau absorbe le NIR et SWIR → valeurs basses
- L'eau réfléchit le vert → valeurs élevées
- L'eau trouble contient des sédiments → peut réfléchir plus

### Facteurs influençant la détection

1. **Profondeur de l'eau:**
   - Eau peu profonde: peut voir le fond (confusion avec terre)
   - Eau profonde: détection plus fiable

2. **Végétation:**
   - Végétation aquatique: peut être confondue avec terre
   - Forêts inondées: difficile à détecter

3. **Sédiments:**
   - Eau trouble: peut réfléchir plus (confusion)
   - Eau claire: détection plus facile

4. **Ombres:**
   - Ombres des nuages ou montagnes: peuvent ressembler à l'eau
   - Important de vérifier avec plusieurs images

## 📈 Analyse Temporelle

### Pourquoi comparer avant/après?

- Identifier les changements
- Distinguer l'eau permanente des inondations temporaires
- Quantifier l'impact des inondations

### Série temporelle

- Collection d'images sur une période
- Permet de suivre l'évolution
- Utile pour comprendre la dynamique des inondations

## 🔧 Bonnes Pratiques

### 1. Commencez simple
- Utilisez d'abord une seule image
- Vérifiez que vous comprenez les résultats
- Puis passez à l'analyse temporelle

### 2. Validez vos résultats
- Comparez avec des photos de terrain si possible
- Utilisez plusieurs méthodes (Sentinel-1 et Sentinel-2)
- Vérifiez les conditions météorologiques

### 3. Documentez vos paramètres
- Notez les seuils utilisés
- Gardez une trace des dates
- Sauvegardez vos configurations

### 4. Itérez
- Ajustez les seuils selon votre région
- Testez différentes périodes
- Améliorez progressivement votre méthode

## 📖 Ressources d'Apprentissage

### Cours en ligne gratuits
- [NASA ARSET](https://arset.gsfc.nasa.gov/) - Cours sur la télédétection
- [Copernicus Training](https://training.eo4geo.eu/) - Formation Copernicus
- [GIS Geography](https://gisgeography.com/) - Tutoriels SIG

### Livres recommandés
- "Remote Sensing of the Environment" - Jensen
- "Introductory Digital Image Processing" - Jensen

### Communautés
- [Google Earth Engine Community](https://groups.google.com/g/google-earth-engine-developers)
- [GIS Stack Exchange](https://gis.stackexchange.com/)
- [Reddit r/gis](https://www.reddit.com/r/gis/)

## ❓ Questions Fréquentes

### Q: Pourquoi utiliser Sentinel-1 au lieu de Sentinel-2 ?
R: Sentinel-1 fonctionne à travers les nuages, ce qui est crucial pendant les inondations quand le ciel est souvent couvert.

### Q: Quelle résolution dois-je choisir ?
R: Pour les inondations, 10m (Sentinel-1 et Sentinel-2) est généralement suffisant. Si vous avez besoin de plus de détails, considérez d'autres satellites.

### Q: Combien de temps faut-il pour obtenir les images ?
R: Les images Sentinel sont généralement disponibles 1-3 jours après l'acquisition. Les archives remontent à 2014 pour Sentinel-1 et 2015 pour Sentinel-2.

### Q: Puis-je utiliser ces scripts pour d'autres applications ?
R: Oui ! Les mêmes principes s'appliquent à la détection de lacs, de rivières, de zones humides, etc.

### Q: Comment savoir si mes résultats sont corrects ?
R: Comparez avec des cartes de référence, des photos de terrain, ou des données historiques. La validation sur le terrain est idéale quand c'est possible.

## 🎓 Prochaines Étapes

Une fois que vous maîtrisez les bases:

1. **Apprendre plus d'indices spectraux:**
   - NDVI (végétation)
   - NDBI (zones urbaines)
   - NDSI (neige)

2. **Explorer d'autres satellites:**
   - Landsat (résolution 30m, archives depuis 1972)
   - MODIS (résolution 250m, quotidien)

3. **Apprendre le machine learning:**
   - Classification supervisée
   - Classification non supervisée
   - Deep learning pour la télédétection

4. **Intégrer avec des données SIG:**
   - Ajouter des couches vectorielles
   - Analyser avec des données démographiques
   - Créer des cartes interactives

---

**N'hésitez pas à expérimenter et à poser des questions !** 🚀
