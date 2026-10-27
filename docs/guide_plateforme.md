# Guide: Créer une Plateforme sur Google Earth Engine

Ce guide explique comment transformer vos scripts en une application interactive partageable.

## 🎯 Qu'est-ce qu'une Earth Engine App ?

Une **Earth Engine App** est une application web interactive que vous pouvez créer directement dans Google Earth Engine. Elle permet:
- Une interface utilisateur avec boutons, menus, etc.
- Interactivité (changer les paramètres, voir les résultats en temps réel)
- Partage avec d'autres utilisateurs via un lien URL

## 📝 Étape 1: Créer une nouvelle App

### Méthode A: Créer depuis zéro

1. Dans Google Earth Engine, cliquez sur **File** (en haut à gauche)
2. Sélectionnez **New** > **App**
3. Un nouveau fichier avec l'extension `.html` sera créé
4. Collez le code de `earth_engine_app.js` dans ce fichier

### Méthode B: Convertir un script existant

1. Ouvrez votre script actuel
2. Cliquez sur **File** > **Save as App**
3. Donnez un nom à votre application
4. L'interface d'application sera générée automatiquement

## 🎨 Étape 2: Personnaliser l'interface

Le script `earth_engine_app.js` inclut déjà:
- ✅ Sélection de région (Abidjan, Dakar, Lagos, etc.)
- ✅ Sélection de dates
- ✅ Slider pour ajuster le seuil de détection
- ✅ Bouton d'analyse
- ✅ Affichage des résultats
- ✅ Bouton d'export vers Google Drive

### Personnalisations possibles:

#### 1. Changer les couleurs
```javascript
mainPanel.add(ui.Label({
  value: 'Votre titre',
  style: {
    color: '#FF5722',  // Changer la couleur
    fontSize: '20px'   // Changer la taille
  }
}));
```

#### 2. Ajouter plus de régions
Dans la fonction `getGeometry()`, ajoutez:
```javascript
else if (region === 'Votre Ville') {
  return ee.Geometry.Rectangle([lonMin, latMin, lonMax, latMax]);
}
```

#### 3. Ajouter plus de visualisations
```javascript
Map.addLayer(results.waterMask, {
  min: 0,
  max: 1,
  palette: ['white', 'cyan', 'blue', 'darkblue']
}, 'Palette personnalisée');
```

## 🚀 Étape 3: Tester l'application

1. Cliquez sur le bouton **Run**
2. Le panneau de contrôle apparaîtra à gauche
3. Testez différentes options:
   - Changez la région
   - Modifiez les dates
   - Ajustez le seuil avec le slider
   - Cliquez sur "Analyser"
   - Voyez les résultats se mettre à jour

## 📤 Étape 4: Partager l'application

### Option A: Partager comme lien

1. Cliquez sur **Publish** (en haut à droite)
2. Donnez un nom à votre application
3. Cochez "Anyone with the link can view"
4. Cliquez sur **Publish**
5. Un lien URL sera généré
6. Partagez ce lien avec d'autres personnes

### Option B: Partager comme code

1. Cliquez sur **File** > **Share**
2. Entrez l'email des personnes avec qui vous voulez partager
3. Choisissez les permissions (Can view, Can edit)
4. Cliquez sur **Send**

### Option C: Intégrer dans un site web

Vous pouvez intégrer l'app dans votre propre site web avec un iframe:

```html
<iframe src="https://earthengine.google.com/embed/YOUR_APP_ID"
        width="100%" height="600px">
</iframe>
```

## 🔧 Étape 5: Améliorer continuellement

### Idées d'améliorations:

#### 1. Ajouter des couches de référence
```javascript
// Ajouter des limites administratives
var adminBounds = ee.FeatureCollection("FAO/GAUL/2015/level0");
Map.addLayer(adminBounds, {}, 'Limites administratives');
```

#### 2. Ajouter des statistiques historiques
```javascript
// Comparer avec l'année précédente
var previousYear = startDate.replace('2024', '2023');
var previousResults = analyzeFlood(geometry, previousYear, ...);
```

#### 3. Ajouter des graphiques
```javascript
var chart = ui.Chart.image.series({...});
resultsPanel.add(chart);
```

#### 4. Ajouter des alertes
```javascript
if (percentage > 50) {
  resultsPanel.add(ui.Label('⚠️ ALERTE: Inondation sévère!', {
    style: {color: 'red', fontWeight: 'bold'}
  }));
}
```

#### 5. Ajouter des données météo
```javascript
// Ajouter des données de précipitations
var precip = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(startDate, endDate)
  .filterBounds(geometry);
```

## 📊 Étape 6: Créer un tableau de bord

Pour une plateforme plus avancée, vous pouvez créer plusieurs apps:

1. **App de surveillance en temps réel**
   - Dernières 7 jours
   - Mise à jour automatique

2. **App d'analyse historique**
   - Comparaison sur plusieurs années
   - Tendances et statistiques

3. **App de prévision**
   - Basée sur les prévisions météo
   - Zones à risque

## 🌐 Étape 7: Déployer sur votre propre serveur (avancé)

Pour un déploiement professionnel:

### Option A: Google Cloud Platform
1. Créer un projet GCP
2. Utiliser Earth Engine API
3. Créer une application web avec Node.js/Python
4. Déployer sur Google App Engine ou Cloud Run

### Option B: Frameworks web
- React + Earth Engine API
- Vue.js + Earth Engine API
- Streamlit (Python)

### Option C: Outils low-code
- Google AppSheet
- Microsoft Power Apps
- Bubble

## 📚 Ressources pour aller plus loin

### Documentation Earth Engine Apps
- [Earth Engine Apps Documentation](https://developers.google.com/earth-engine/guides/apps)
- [UI Widgets Reference](https://developers.google.com/earth-engine/guides/ui)

### Tutoriels
- [Building Earth Engine Apps](https://developers.google.com/earth-engine/tutorials/community/building-a-ui)
- [Earth Engine App Gallery](https://earthengine.google.com/apps/)

### Exemples d'apps existantes
- Cherchez "flood" dans la galerie d'apps Earth Engine
- Inspirez-vous des apps existantes

## 💡 Conseils pour une bonne plateforme

1. **Simplicité d'abord**
   - Commencez avec une interface simple
   - Ajoutez des fonctionnalités progressivement

2. **Performance**
   - Évitez de charger trop de données
   - Utilisez des filtres efficaces
   - Limitez la taille de la zone d'étude

3. **Expérience utilisateur**
   - Ajoutez des messages de chargement
   - Expliquez les erreurs clairement
   - Testez avec différents utilisateurs

4. **Documentation**
   - Ajoutez une section "Aide"
   - Expliquez comment utiliser l'app
   - Documentez les paramètres

5. **Mises à jour**
   - Planifiez des mises à jour régulières
   - Ajoutez de nouvelles fonctionnalités
   - Corrigez les bugs signalés

## 🎯 Prochaines étapes pour votre projet

1. **Tester l'app** avec le code fourni
2. **Personnaliser** pour vos besoins spécifiques
3. **Publier** et partager avec des collègues
4. **Collecter des feedbacks** et améliorer
5. **Ajouter des fonctionnalités** progressivement

Bonne chance avec votre plateforme ! 🚀
