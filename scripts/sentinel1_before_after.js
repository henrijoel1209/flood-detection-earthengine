/**
 * Script de comparaison avant/après inondation avec Sentinel-1
 * 
 * Ce script compare une période avant et après une inondation pour visualiser
 * les changements dans les zones inondées.
 * 
 * INSTRUCTIONS:
 * 1. Copiez ce code dans Google Earth Engine: https://code.earthengine.google.com/
 * 2. Changez la zone d'étude (geometry) selon vos besoins
 * 3. Changez les dates (beforeStartDate, beforeEndDate, afterStartDate, afterEndDate)
 * 4. Cliquez sur "Run" pour exécuter
 */

// ===== CONFIGURATION =====
// Zone d'étude (Abidjan, Côte d'Ivoire)
var geometry = ee.Geometry.Rectangle([-4.5, 5.0, -3.5, 5.5]);

// Période avant (saison sèche - janvier-mars)
var beforeStartDate = '2024-01-01';
var beforeEndDate = '2024-03-31';

// Période après (saison des pluies - mai-octobre)
var afterStartDate = '2024-05-01';
var afterEndDate = '2024-10-31';

// Seuil de détection d'eau
var waterThreshold = -16;

// ===== FONCTIONS =====

// Fonction pour masquer le bruit
function maskEdges(image) {
  var angles = image.select('angle');
  return image.updateMask(angles.gt(0).and(angles.lt(45)));
}

// Fonction pour calculer l'indice d'eau
function calculateWaterIndex(image) {
  var vv = image.select('VV');
  return vv.rename('waterIndex');
}

// Fonction pour classifier l'eau
function classifyWater(image) {
  var waterIndex = calculateWaterIndex(image);
  var water = waterIndex.lt(waterThreshold).rename('water');
  return image.addBands(water);
}

// Fonction pour traiter une collection
function processCollection(startDate, endDate) {
  return ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(geometry)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .map(maskEdges)
    .map(classifyWater)
    .median()
    .clip(geometry);
}

// ===== TRAITEMENT DES DONNÉES =====

// Traiter les périodes avant et après
var beforeComposite = processCollection(beforeStartDate, beforeEndDate);
var afterComposite = processCollection(afterStartDate, afterEndDate);

// Extraire les masques d'eau
var beforeWater = beforeComposite.select('water');
var afterWater = afterComposite.select('water');

// Calculer le changement (nouvelles zones inondées)
var newFlood = afterWater.subtract(beforeWater).gt(0).rename('newFlood');
var recededWater = beforeWater.subtract(afterWater).gt(0).rename('recededWater');

// Créer une carte de changement
var changeMap = ee.Image.cat(
  newFlood,
  recededWater,
  afterWater
).rename(['newFlood', 'recededWater', 'currentWater']);

// ===== VISUALISATION =====

// Paramètres de visualisation radar
var radarVis = {
  min: -25,
  max: 0,
  bands: ['VV']
};

// Paramètres de visualisation pour le masque d'eau
var waterVis = {
  min: 0,
  max: 1,
  palette: ['white', 'blue']
};

// Paramètres de visualisation pour la carte de changement
var changeVis = {
  min: 0,
  max: 1,
  bands: ['newFlood', 'recededWater', 'currentWater'],
  palette: ['FFFFFF', 'FF0000', '00FF00', '0000FF']
};

// Afficher la carte
Map.centerObject(geometry, 10);
Map.addLayer(beforeComposite, radarVis, 'Avant inondation (Radar)', false);
Map.addLayer(afterComposite, radarVis, 'Après inondation (Radar)', false);
Map.addLayer(beforeWater, waterVis, 'Eau avant', false);
Map.addLayer(afterWater, waterVis, 'Eau après', false);
Map.addLayer(newFlood, {min: 0, max: 1, palette: ['white', 'red']}, 'Nouvelles zones inondées');
Map.addLayer(recededWater, {min: 0, max: 1, palette: ['white', 'green']}, 'Eau retirée');
Map.addLayer(changeMap, changeVis, 'Carte de changement');

// ===== STATISTIQUES =====

// Calculer les superficies
var pixelArea = ee.Image.pixelArea();

var beforeArea = beforeWater.multiply(pixelArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

var afterArea = afterWater.multiply(pixelArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

var newFloodArea = newFlood.multiply(pixelArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

var recededArea = recededWater.multiply(pixelArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

print('=== STATISTIQUES ===');
print('Superficie eau avant (m²):', beforeArea);
print('Superficie eau après (m²):', afterArea);
print('Nouvelles zones inondées (m²):', newFloodArea);
print('Eau retirée (m²):', recededArea);

// Calculer le changement net
var changeNet = afterArea.getNumber('water').subtract(beforeArea.getNumber('water'));
print('Changement net (m²):', changeNet);

// ===== EXPORT =====

// Exporter la carte de changement
Export.image.toDrive({
  image: changeMap,
  description: 'flood_change_map_sentinel1',
  scale: 10,
  region: geometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

print('Script terminé avec succès!');
