/**
 * Script Earth Engine pour le Bassin Versant de l'Agnéby
 * 
 * Ce script collecte et analyse les données pour le projet de mémoire:
 * - Modélisation hydrologique assistée par algorithmes bio-inspirés
 * - Prévision des crues en contexte de changement climatique
 * - Cas du bassin versant de l'Agnéby (Côte d'Ivoire)
 */

// ===== CONFIGURATION =====
// Bassin versant de l'Agnéby (coordonnées approximatives)
var agnebyBasin = ee.Geometry.Rectangle([-5.0, 5.5, -4.0, 6.5]);

// Période d'analyse (longue pour l'analyse climatique)
var startDate = '2000-01-01';
var endDate = '2024-12-31';

// ===== FONCTIONS =====

// Fonction pour masquer les nuages (Sentinel-2)
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

// Fonction pour calculer NDWI (eau)
function calculateNDWI(image) {
  var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
  return image.addBands(ndwi);
}

// Fonction pour calculer NDVI (végétation)
function calculateNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// ===== 1. DONNÉES TOPOGRAPHIQUES (MNT) =====

print('=== 1. TÉLÉCHARGEMENT DU MNT ===');

var srtm = ee.Image('USGS/SRTMGL1_003').clip(agnebyBasin);
var slope = ee.Terrain.slope(srtm);
var aspect = ee.Terrain.aspect(srtm);

Map.centerObject(agnebyBasin, 10);
Map.addLayer(srtm, {min: 0, max: 500, palette: ['white', 'black']}, 'MNT (Altitude)', false);
Map.addLayer(slope, {min: 0, max: 60, palette: ['white', 'red']}, 'Pente', false);

// Exporter le MNT
Export.image.toDrive({
  image: srtm,
  description: 'agneby_elevation',
  scale: 30,
  region: agnebyBasin,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

print('MNT téléchargé');

// ===== 2. DONNÉES DE PRÉCIPITATIONS (CHIRPS) =====

print('=== 2. ANALYSE DES PRÉCIPITATIONS ===');

var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterBounds(agnebyBasin)
  .filterDate(startDate, endDate);

// Précipitations annuelles
var annualPrecip = chirps.map(function(image) {
  var year = ee.Date(image.get('system:time_start')).get('year');
  return image.set('year', year);
});

var yearlyPrecip = annualPrecip.reduceColumns({
  selectors: ['precipitation'],
  reducer: ee.Reducer.sum().group({
    fields: ['year'],
    groupName: 'year'
  })
});

print('Précipitations annuelles:', yearlyPrecip);

// Précipitations mensuelles moyennes
var monthlyPrecip = chirps.map(function(image) {
  var month = ee.Date(image.get('system:time_start')).get('month');
  return image.set('month', month);
});

var monthlyMean = monthlyPrecip.reduceColumns({
  selectors: ['precipitation'],
  reducer: ee.Reducer.mean().group({
    fields: ['month'],
    groupName: 'month'
  })
});

print('Précipitations mensuelles moyennes:', monthlyMean);

// Créer un graphique des précipitations annuelles
var precipChart = ui.Chart.image.series({
  imageCollection: chirps,
  region: agnebyBasin,
  reducer: ee.Reducer.mean(),
  scale: 5566,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Précipitations mensuelles - Bassin de l\'Agnéby (2000-2024)',
  vAxis: {title: 'Précipitation (mm)'},
  hAxis: {title: 'Date'},
  pointSize: 3
});

print(precipChart);

// ===== 3. DÉTECTION DES INONDATIONS HISTORIQUES =====

print('=== 3. DÉTECTION DES INONDATIONS ===');

// Collection Sentinel-1 pour les inondations
var s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(agnebyBasin)
  .filterDate('2020-01-01', '2024-12-31')
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'));

print('Nombre d\'images Sentinel-1:', s1Collection.size());

// Fonction de détection d'eau
function detectWater(image) {
  var vv = image.select('VV');
  var water = vv.lt(-16).rename('water');
  return image.addBands(water);
}

var s1WithWater = s1Collection.map(detectWater);
var s1Composite = s1WithWater.median().clip(agnebyBasin);
var waterMask = s1Composite.select('water');

Map.addLayer(waterMask, {min: 0, max: 1, palette: ['white', 'blue']}, 'Zones inondées');

// Exporter le masque d'eau
Export.image.toDrive({
  image: waterMask,
  description: 'agneby_flood_zones',
  scale: 10,
  region: agnebyBasin,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// ===== 4. ANALYSE DE L'OCCUPATION DU SOL =====

print('=== 4. ANALYSE DE L\'OCCUPATION DU SOL ===');

// Sentinel-2 pour l'occupation du sol
var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(agnebyBasin)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds)
  .map(calculateNDWI)
  .map(calculateNDVI);

var s2Composite = s2Collection.median().clip(agnebyBasin);

// Vraies couleurs
var trueColor = {
  min: 0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2']
};

Map.addLayer(s2Composite, trueColor, 'Occupation du sol (2023)', false);

// NDVI (végétation)
Map.addLayer(s2Composite.select('NDVI'), {
  min: -0.2,
  max: 0.8,
  palette: ['white', 'green']
}, 'NDVI (Végétation)', false);

// NDWI (eau)
Map.addLayer(s2Composite.select('NDWI'), {
  min: -0.5,
  max: 0.5,
  palette: ['white', 'blue']
}, 'NDWI (Eau)', false);

// Exporter l'occupation du sol
Export.image.toDrive({
  image: s2Composite,
  description: 'agneby_landcover_2023',
  scale: 10,
  region: agnebyBasin,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13
});

// ===== 5. ANALYSE DES TENDANCES CLIMATIQUES =====

print('=== 5. ANALYSE DES TENDANCES CLIMATIQUES ===');

// Utiliser ERA5 pour la température
var era5 = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY')
  .filterBounds(agnebyBasin)
  .filterDate(startDate, endDate)
  .select('temperature_2m');

var tempChart = ui.Chart.image.series({
  imageCollection: era5,
  region: agnebyBasin,
  reducer: ee.Reducer.mean(),
  scale: 9000,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'Température mensuelle - Bassin de l\'Agnéby (2000-2024)',
  vAxis: {title: 'Température (K)'},
  hAxis: {title: 'Date'},
  pointSize: 3
});

print(tempChart);

// ===== 6. EXTRACTION DES STATISTIQUES =====

print('=== 6. STATISTIQUES DU BASSIN ===');

// Superficie du bassin
var area = agnebyBasin.area().divide(1000000); // km²
print('Superficie du bassin (km²):', area);

// Altitude moyenne
var meanElevation = srtm.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: agnebyBasin,
  scale: 30,
  maxPixels: 1e13
});
print('Altitude moyenne (m):', meanElevation);

// Pente moyenne
var meanSlope = slope.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: agnebyBasin,
  scale: 30,
  maxPixels: 1e13
});
print('Pente moyenne (degrés):', meanSlope);

// ===== 7. EXPORT DES DONNÉES POUR MACHINE LEARNING =====

print('=== 7. PRÉPARATION DES DONNÉES POUR ML ===');

// Créer un échantillonnage pour l'entraînement
var samplePoints = ee.FeatureCollection.randomPoints(agnebyBasin, 1000);

// Extraire les valeurs aux points d'échantillonnage
var features = s2Composite.sampleRegions({
  collection: samplePoints,
  scale: 10,
  properties: ['NDVI', 'NDWI', 'B2', 'B3', 'B4', 'B8']
});

print('Échantillons pour ML:', features.size());

// Exporter les échantillons
Export.table.toDrive({
  collection: features,
  description: 'agneby_ml_samples',
  fileFormat: 'CSV'
});

print('=== ANALYSE TERMINÉE ===');
print('Vérifiez l\'onglet Tasks pour les exports');
