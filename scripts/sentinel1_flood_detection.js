/**
 * Script de détection d'inondations avec Sentinel-1 sur Google Earth Engine
 * 
 * Ce script utilise les images radar Sentinel-1 pour détecter les zones inondées.
 * Le radar est particulièrement utile car il peut voir à travers les nuages.
 * 
 * INSTRUCTIONS:
 * 1. Copiez ce code dans Google Earth Engine: https://code.earthengine.google.com/
 * 2. Changez la zone d'étude (geometry) selon vos besoins
 * 3. Changez les dates (startDate, endDate) pour la période souhaitée
 * 4. Cliquez sur "Run" pour exécuter
 */

// ===== CONFIGURATION =====
// Zone d'étude (Abidjan, Côte d'Ivoire)
var geometry = ee.Geometry.Rectangle([-4.5, 5.0, -3.5, 5.5]);

// Période d'analyse (saison des pluies en Côte d'Ivoire: mai-juin et septembre-octobre)
var startDate = '2024-05-01';
var endDate = '2024-10-31';

// Seuil de détection d'eau (valeur entre -25 et -10 pour Sentinel-1)
var waterThreshold = -16;

// ===== FONCTIONS =====

// Fonction pour masquer le bruit
function maskEdges(image) {
  var angles = image.select('angle');
  return image.updateMask(angles.gt(0).and(angles.lt(45)));
}

// Fonction pour calculer l'indice d'eau (Water Index)
function calculateWaterIndex(image) {
  // Utilisation de la polarisation VV (Vertical-Vertical)
  var vv = image.select('VV');
  return vv.rename('waterIndex');
}

// Fonction pour classifier l'eau
function classifyWater(image) {
  var waterIndex = calculateWaterIndex(image);
  var water = waterIndex.lt(waterThreshold).rename('water');
  return image.addBands(water);
}

// ===== TRAITEMENT DES DONNÉES =====

// Charger la collection Sentinel-1
var s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .map(maskEdges)
  .map(classifyWater);

// Créer une composition temporelle (médiane)
var s1Composite = s1Collection.median().clip(geometry);

// Extraire la couche d'eau
var waterMask = s1Composite.select('water');

// ===== VISUALISATION =====

// Paramètres de visualisation pour l'image radar
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

// Afficher la carte
Map.centerObject(geometry, 10);
Map.addLayer(s1Composite, radarVis, 'Sentinel-1 Radar (VV)', false);
Map.addLayer(waterMask, waterVis, 'Zones inondées détectées');

// ===== EXPORT =====

// Exporter le masque d'eau vers Google Drive
Export.image.toDrive({
  image: waterMask,
  description: 'flood_detection_sentinel1',
  scale: 10,  // Résolution 10m
  region: geometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// ===== STATISTIQUES =====

// Calculer la superficie des zones inondées
var pixelArea = waterMask.multiply(ee.Image.pixelArea());
var totalFloodedArea = pixelArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

print('Superficie totale inondée (m²):', totalFloodedArea);

// Afficher le nombre d'images utilisées
print('Nombre d\'images Sentinel-1 utilisées:', s1Collection.size());

print('Script terminé avec succès!');
