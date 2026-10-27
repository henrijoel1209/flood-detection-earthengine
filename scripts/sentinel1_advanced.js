/**
 * Script avancé de détection d'inondations avec Sentinel-1
 * Avec plus de visualisations et analyses
 */

// ===== CONFIGURATION =====
var geometry = ee.Geometry.Rectangle([-4.5, 5.0, -3.5, 5.5]);
var startDate = '2024-05-01';
var endDate = '2024-10-31';
var waterThreshold = -16;

// ===== FONCTIONS =====

function maskEdges(image) {
  var angles = image.select('angle');
  return image.updateMask(angles.gt(0).and(angles.lt(45)));
}

function calculateWaterIndex(image) {
  var vv = image.select('VV');
  return vv.rename('waterIndex');
}

function classifyWater(image) {
  var waterIndex = calculateWaterIndex(image);
  var water = waterIndex.lt(waterThreshold).rename('water');
  return image.addBands(water);
}

// ===== TRAITEMENT =====

var s1Collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .map(maskEdges)
  .map(classifyWater);

var s1Composite = s1Collection.median().clip(geometry);
var waterMask = s1Composite.select('water');

// ===== STATISTIQUES AVANCÉES =====

// Calculer la superficie
var pixelArea = ee.Image.pixelArea();
var totalFloodedArea = waterMask.multiply(pixelArea).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

// Calculer le pourcentage de la zone inondée
var totalArea = pixelArea.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 10,
  maxPixels: 1e13
});

var floodPercentage = ee.Number(totalFloodedArea.getNumber('water'))
  .divide(totalArea.getNumber('area'))
  .multiply(100);

print('=== STATISTIQUES D\'INONDATION ===');
print('Superficie totale (m²):', totalArea);
print('Superficie inondée (m²):', totalFloodedArea);
print('Pourcentage inondé (%):', floodPercentage);
print('Nombre d\'images:', s1Collection.size());

// ===== SÉRIE TEMPORELLE =====

// Créer une série temporelle mensuelle
var months = ee.List.sequence(5, 10);  // Mai à octobre

var monthlyFlood = ee.ImageCollection.fromImages(
  months.map(function(month) {
    var start = ee.Date.fromYMD(2024, month, 1);
    var end = start.advance(1, 'month');
    
    var monthlyCollection = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(geometry)
      .filterDate(start, end)
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .map(maskEdges)
      .map(classifyWater);
    
    var monthlyComposite = monthlyCollection.median().clip(geometry);
    var monthlyWater = monthlyComposite.select('water');
    
    var area = monthlyWater.multiply(pixelArea).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: geometry,
      scale: 10,
      maxPixels: 1e13
    });
    
    return monthlyWater.set({
      'system:time_start': start.millis(),
      'month': month,
      'flooded_area': area.getNumber('water')
    });
  })
);

// Graphique de la série temporelle
var chart = ui.Chart.image.series({
  imageCollection: monthlyFlood.select('water'),
  region: geometry,
  reducer: ee.Reducer.mean(),
  scale: 10,
  xProperty: 'system:time_start'
})
.setOptions({
  title: 'Évolution de l\'inondation (Mai-Octobre 2024)',
  vAxis: {title: 'Proportion d\'eau'},
  hAxis: {title: 'Date'},
  pointSize: 5
});

print(chart);

// ===== INTERFACE UTILISATEUR =====

// Créer un panneau de contrôle
var panel = ui.Panel({
  style: {width: '300px'}
});

panel.add(ui.Label({
  value: '🌊 Détection d\'Inondations - Abidjan',
  style: {fontWeight: 'bold', fontSize: '16px'}
}));

panel.add(ui.Label('_________________________________'));

panel.add(ui.Label({
  value: '📊 Statistiques:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

panel.add(ui.Label({
  value: 'Images utilisées: ' + s1Collection.size().getInfo()
}));

panel.add(ui.Label({
  value: 'Pourcentage inondé: ' + floodPercentage.getInfo().toFixed(2) + '%'
}));

panel.add(ui.Label('_________________________________'));

panel.add(ui.Label({
  value: '📅 Période d\'analyse:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

panel.add(ui.Label(startDate + ' à ' + endDate));

panel.add(ui.Label('_________________________________'));

panel.add(ui.Label({
  value: '💡 Conseil:',
  style: {fontWeight: 'bold', fontSize: '14px'}
}));

panel.add(ui.Label('Ajustez le seuil waterThreshold pour changer la sensibilité de détection'));

// Ajouter le panneau à la carte
ui.root.widgets().add(panel);

// ===== VISUALISATION =====

Map.centerObject(geometry, 10);

// Couche radar originale
Map.addLayer(s1Composite, {
  min: -25,
  max: 0,
  bands: ['VV']
}, 'Sentinel-1 Radar (VV)', false);

// Couche eau (bleu)
Map.addLayer(waterMask, {
  min: 0,
  max: 1,
  palette: ['white', 'blue']
}, 'Zones inondées', true);

// Couche avec palette améliorée
Map.addLayer(waterMask, {
  min: 0,
  max: 1,
  palette: ['#FFFFFF', '#E0F7FA', '#4FC3F7', '#0288D1', '#01579B']
}, 'Zones inondées (palette avancée)', false);

// Ajouter la géométrie de la zone d'étude
Map.addLayer(geometry, {color: 'red'}, 'Zone d\'étude', false);

// ===== EXPORT =====

Export.image.toDrive({
  image: waterMask,
  description: 'flood_detection_abidjan_2024',
  scale: 10,
  region: geometry,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

print('Script avancé terminé avec succès!');
