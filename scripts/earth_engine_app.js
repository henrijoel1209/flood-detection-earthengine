/**
 * APPLICATION EARTH ENGINE - Détection d'Inondations
 * 
 * C'est une application interactive avec interface utilisateur
 * Pour créer une app, allez dans: File > New > App
 */

// ===== CONFIGURATION INITIALE =====
var initialGeometry = ee.Geometry.Rectangle([-4.5, 5.0, -3.5, 5.5]);
var initialStartDate = '2024-05-01';
var initialEndDate = '2024-10-31';
var initialThreshold = -16;

// ===== FONCTIONS =====

function maskEdges(image) {
  var angles = image.select('angle');
  return image.updateMask(angles.gt(0).and(angles.lt(45)));
}

function calculateWaterIndex(image) {
  var vv = image.select('VV');
  return vv.rename('waterIndex');
}

function classifyWater(image, threshold) {
  var waterIndex = calculateWaterIndex(image);
  var water = waterIndex.lt(threshold).rename('water');
  return image.addBands(water);
}

// Fonction principale d'analyse
function analyzeFlood(geometry, startDate, endDate, threshold) {
  var s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(geometry)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .map(maskEdges)
    .map(function(img) { return classifyWater(img, threshold); });
  
  var s1Composite = s1Collection.median().clip(geometry);
  var waterMask = s1Composite.select('water');
  
  // Calculer les statistiques
  var pixelArea = ee.Image.pixelArea();
  var totalFloodedArea = waterMask.multiply(pixelArea).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e13
  });
  
  var totalArea = pixelArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e13
  });
  
  return {
    waterMask: waterMask,
    radar: s1Composite,
    floodedArea: totalFloodedArea,
    totalArea: totalArea,
    imageCount: s1Collection.size()
  };
}

// ===== INTERFACE UTILISATEUR =====

// Créer le panneau principal
var mainPanel = ui.Panel({
  style: {
    width: '320px',
    padding: '10px'
  }
});

// Titre
mainPanel.add(ui.Label({
  value: '🌊 Plateforme de Détection d\'Inondations',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#1E88E5',
    margin: '0px 0px 10px 0px'
  }
}));

mainPanel.add(ui.Label('_________________________________'));

// Sélection de la région
mainPanel.add(ui.Label({
  value: '📍 Sélectionnez une région:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

var regionSelect = ui.Select({
  items: [
    'Abidjan (Côte d\'Ivoire)',
    'Dakar (Sénégal)',
    'Lagos (Nigeria)',
    'Accra (Ghana)',
    'Personnalisé'
  ],
  value: 'Abidjan (Côte d\'Ivoire)',
  style: {width: '100%'}
});

mainPanel.add(regionSelect);

// Coordonnées personnalisées
var latMin = ui.Textbox({placeholder: 'Latitude min', value: '5.0'});
var latMax = ui.Textbox({placeholder: 'Latitude max', value: '5.5'});
var lonMin = ui.Textbox({placeholder: 'Longitude min', value: '-4.5'});
var lonMax = ui.Textbox({placeholder: 'Longitude max', value: '-3.5'});

var coordPanel = ui.Panel([latMin, latMax, lonMin, lonMax], ui.Panel.Layout.flow('horizontal'));
mainPanel.add(coordPanel);

// Dates
mainPanel.add(ui.Label({
  value: '📅 Période d\'analyse:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

var startDateBox = ui.Textbox({value: '2024-05-01', placeholder: 'YYYY-MM-DD'});
var endDateBox = ui.Textbox({value: '2024-10-31', placeholder: 'YYYY-MM-DD'});

mainPanel.add(ui.Label('Date de début:'));
mainPanel.add(startDateBox);
mainPanel.add(ui.Label('Date de fin:'));
mainPanel.add(endDateBox);

// Seuil de détection
mainPanel.add(ui.Label({
  value: '⚙️ Seuil de détection d\'eau:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

var thresholdSlider = ui.Slider({
  min: -25,
  max: -10,
  value: -16,
  step: 1
});

mainPanel.add(thresholdSlider);
mainPanel.add(ui.Label('Valeur: ' + thresholdSlider.getValue()));

thresholdSlider.onChange(function(value) {
  mainPanel.widgets().get(mainPanel.widgets().length() - 1).setValue('Valeur: ' + value);
});

// Bouton d'analyse
var analyzeButton = ui.Button({
  label: '🔍 Analyser',
  style: {
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px'
  }
});

mainPanel.add(analyzeButton);

// Séparateur
mainPanel.add(ui.Label('_________________________________'));

// Panneau de résultats
mainPanel.add(ui.Label({
  value: '📊 Résultats:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

var resultsPanel = ui.Panel({
  style: {
    backgroundColor: '#F5F5F5',
    padding: '10px',
    border: '1px solid #DDD'
  }
});

mainPanel.add(resultsPanel);

// Bouton d'export
var exportButton = ui.Button({
  label: '💾 Exporter vers Google Drive',
  style: {
    width: '100%',
    backgroundColor: '#2196F3',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px'
  }
});

mainPanel.add(exportButton);

// ===== LOGIQUE DE L'APPLICATION =====

// Variables globales
var currentResults = null;
var currentGeometry = initialGeometry;

// Fonction pour obtenir la géométrie
function getGeometry() {
  var region = regionSelect.getValue();
  
  if (region === 'Abidjan (Côte d\'Ivoire)') {
    return ee.Geometry.Rectangle([-4.5, 5.0, -3.5, 5.5]);
  } else if (region === 'Dakar (Sénégal)') {
    return ee.Geometry.Rectangle([-17.5, 14.5, -17.0, 15.0]);
  } else if (region === 'Lagos (Nigeria)') {
    return ee.Geometry.Rectangle([3.0, 6.0, 4.0, 6.5]);
  } else if (region === 'Accra (Ghana)') {
    return ee.Geometry.Rectangle([-0.5, 5.0, 0.5, 5.8]);
  } else {
    return ee.Geometry.Rectangle([
      parseFloat(lonMin.getValue()),
      parseFloat(latMin.getValue()),
      parseFloat(lonMax.getValue()),
      parseFloat(latMax.getValue())
    ]);
  }
}

// Fonction d'analyse
analyzeButton.onClick(function() {
  var geometry = getGeometry();
  var startDate = startDateBox.getValue();
  var endDate = endDateBox.getValue();
  var threshold = thresholdSlider.getValue();
  
  currentGeometry = geometry;
  
  // Afficher "Chargement..."
  resultsPanel.widgets().reset();
  resultsPanel.add(ui.Label('⏳ Analyse en cours...'));
  
  // Lancer l'analyse
  var results = analyzeFlood(geometry, startDate, endDate, threshold);
  currentResults = results;
  
  // Mettre à jour la carte
  Map.centerObject(geometry, 10);
  Map.layers().reset();
  
  Map.addLayer(results.radar, {
    min: -25,
    max: 0,
    bands: ['VV']
  }, 'Radar (VV)', false);
  
  Map.addLayer(results.waterMask, {
    min: 0,
    max: 1,
    palette: ['white', 'blue']
  }, 'Zones inondées', true);
  
  // Afficher les résultats
  resultsPanel.widgets().reset();
  resultsPanel.add(ui.Label('✅ Analyse terminée!'));
  resultsPanel.add(ui.Label('_________________________________'));
  resultsPanel.add(ui.Label('Images utilisées: ' + results.imageCount.getInfo()));
  resultsPanel.add(ui.Label('Période: ' + startDate + ' à ' + endDate));
  resultsPanel.add(ui.Label('Seuil: ' + threshold));
  resultsPanel.add(ui.Label('_________________________________'));
  resultsPanel.add(ui.Label('Superficie inondée: ' + 
    results.floodedArea.getNumber('water').getInfo().toFixed(0) + ' m²'));
  resultsPanel.add(ui.Label('Superficie totale: ' + 
    results.totalArea.getNumber('area').getInfo().toFixed(0) + ' m²'));
  
  var percentage = ee.Number(results.floodedArea.getNumber('water'))
    .divide(results.totalArea.getNumber('area'))
    .multiply(100)
    .getInfo()
    .toFixed(2);
  resultsPanel.add(ui.Label('Pourcentage inondé: ' + percentage + '%'));
});

// Fonction d'export
exportButton.onClick(function() {
  if (!currentResults) {
    resultsPanel.widgets().reset();
    resultsPanel.add(ui.Label('❌ Erreur: Analysez d\'abord!'));
    return;
  }
  
  Export.image.toDrive({
    image: currentResults.waterMask,
    description: 'flood_detection_' + new Date().getTime(),
    scale: 10,
    region: currentGeometry,
    fileFormat: 'GeoTIFF',
    maxPixels: 1e13,
    crs: 'EPSG:4326'
  });
  
  resultsPanel.widgets().reset();
  resultsPanel.add(ui.Label('✅ Export lancé!'));
  resultsPanel.add(ui.Label('Vérifiez l\'onglet Tasks'));
});

// Ajouter le panneau à l'interface
ui.root.widgets().add(mainPanel);

// Initialiser avec la carte
Map.centerObject(initialGeometry, 10);
Map.addLayer(ee.Image().clip(initialGeometry), {}, 'Zone d\'étude');

print('Application chargée avec succès!');
print('Utilisez le panneau à gauche pour interagir.');
