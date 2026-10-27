/**
 * Script de détection d'inondations avec Sentinel-2 sur Google Earth Engine
 * 
 * Ce script utilise les images optiques Sentinel-2 pour détecter les zones inondées.
 * Utilise l'indice NDWI (Normalized Difference Water Index) et MNDWI.
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

// Seuils de détection d'eau
var ndwiThreshold = 0.3;  // NDWI threshold
var mndwiThreshold = 0.3;  // MNDWI threshold

// ===== FONCTIONS =====

// Fonction pour masquer les nuages
function maskS2clouds(image) {
  var qa = image.select('QA60');
  // Bits 10 et 11 sont les nuages et cirrus
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

// Fonction pour calculer NDWI (Normalized Difference Water Index)
// NDWI = (Green - NIR) / (Green + NIR)
function calculateNDWI(image) {
  var green = image.select('B3');
  var nir = image.select('B8');
  var ndwi = green.subtract(nir).divide(green.add(nir)).rename('NDWI');
  return image.addBands(ndwi);
}

// Fonction pour calculer MNDWI (Modified NDWI)
// MNDWI = (Green - SWIR) / (Green + SWIR)
function calculateMNDWI(image) {
  var green = image.select('B3');
  var swir = image.select('B11');
  var mndwi = green.subtract(swir).divide(green.add(swir)).rename('MNDWI');
  return image.addBands(mndwi);
}

// Fonction pour classifier l'eau
function classifyWater(image) {
  var ndwi = image.select('NDWI');
  var mndwi = image.select('MNDWI');
  
  // Combiner NDWI et MNDWI pour une meilleure détection
  var water = ndwi.gt(ndwiThreshold).and(mndwi.gt(mndwiThreshold)).rename('water');
  return image.addBands(water);
}

// ===== TRAITEMENT DES DONNÉES =====

// Charger la collection Sentinel-2
var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))  // Maximum 20% de nuages
  .map(maskS2clouds)
  .map(calculateNDWI)
  .map(calculateMNDWI)
  .map(classifyWater);

// Créer une composition temporelle (médiane)
var s2Composite = s2Collection.median().clip(geometry);

// Extraire les couches d'indices et d'eau
var ndwi = s2Composite.select('NDWI');
var mndwi = s2Composite.select('MNDWI');
var waterMask = s2Composite.select('water');

// ===== VISUALISATION =====

// Paramètres de visualisation en vraies couleurs
var trueColorVis = {
  min: 0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2']
};

// Paramètres de visualisation pour NDWI
var ndwiVis = {
  min: -1,
  max: 1,
  palette: ['white', 'cyan', 'blue']
};

// Paramètres de visualisation pour MNDWI
var mndwiVis = {
  min: -1,
  max: 1,
  palette: ['white', 'cyan', 'blue']
};

// Paramètres de visualisation pour le masque d'eau
var waterVis = {
  min: 0,
  max: 1,
  palette: ['white', 'blue']
};

// Afficher la carte
Map.centerObject(geometry, 10);
Map.addLayer(s2Composite, trueColorVis, 'Sentinel-2 Vraies couleurs', false);
Map.addLayer(ndwi, ndwiVis, 'NDWI (Indice d\'eau)', false);
Map.addLayer(mndwi, mndwiVis, 'MNDWI (Indice d\'eau modifié)', false);
Map.addLayer(waterMask, waterVis, 'Zones inondées détectées');

// ===== EXPORT =====

// Exporter le masque d'eau vers Google Drive
Export.image.toDrive({
  image: waterMask,
  description: 'flood_detection_sentinel2',
  scale: 10,  // Résolution 10m
  region: geometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

// Exporter l'indice NDWI
Export.image.toDrive({
  image: ndwi,
  description: 'ndwi_sentinel2',
  scale: 10,
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
print('Nombre d\'images Sentinel-2 utilisées:', s2Collection.size());

// ===== ANALYSE TEMPORELLE =====

// Créer une série temporelle de la superficie inondée
var floodTimeSeries = s2Collection.map(function(image) {
  var water = image.select('water');
  var area = water.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e13
  });
  return ee.Feature(null, {
    'date': image.date().format('YYYY-MM-dd'),
    'flooded_area': area.get('water')
  });
});

print('Série temporelle de la superficie inondée:', floodTimeSeries);

// Graphique de la série temporelle
var chart = ui.Chart.feature.series({
  features: floodTimeSeries,
  xProperty: 'date',
  yProperties: ['flooded_area']
})
.setOptions({
  title: 'Évolution de la superficie inondée',
  hAxis: {title: 'Date'},
  vAxis: {title: 'Superficie (m²)'},
  pointSize: 3
});

print(chart);

print('Script terminé avec succès!');
