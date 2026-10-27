# 🎓 Projet de Mémoire: Modélisation Hydrologique pour la Prévision des Crues

**Titre complet**: Modélisation hydrologique assistée par algorithmes bio-inspirés pour la prévision des crues en contexte de changement climatique : Cas du bassin versant de l'Agnéby (Côte d'Ivoire)

## 📋 Résumé du Projet

Ce projet développe un système de prévision des crues utilisant des algorithmes bio-inspirés (réseaux de neurones, LSTM, algorithmes génétiques) pour le bassin versant de l'Agnéby en Côte d'Ivoire, en tenant compte du changement climatique.

## 🗺️ Zone d'Étude

**Bassin Versant de l'Agnéby**
- **Localisation**: Sud de la Côte d'Ivoire
- **Superficie**: ~1,500 km²
- **Climat**: Tropical humide
- **Principal cours d'eau**: Rivière Agnéby

## 🎯 Objectifs

### Objectif Principal
Développer un système de prévision des crues utilisant des algorithmes bio-inspirés.

### Objectifs Spécifiques
1. ✅ Collecter et préparer les données hydrologiques et climatiques
2. ✅ Analyser les tendances climatiques dans la région
3. ⏳ Développer des modèles de prévision avec algorithmes bio-inspirés
4. ⏳ Valider les modèles avec des données historiques
5. ⏳ Créer une interface de visualisation des prévisions

## 📦 Structure du Projet

```
projet/
├── data/                          # Données brutes
│   ├── hydrological/              # Données hydrométriques
│   ├── satellite/                 # Images satellites (depuis GEE)
│   ├── climate/                   # Données climatiques
│   └── topography/                # MNT et topographie
├── notebooks/                     # Jupyter notebooks
│   ├── 01_data_collection.ipynb   # Collecte des données
│   ├── 02_preprocessing.ipynb     # Prétraitement
│   ├── 03_eda.ipynb               # Analyse exploratoire
│   ├── 04_climate_analysis.ipynb  # Analyse climatique
│   ├── 05_model_training.ipynb    # Entraînement des modèles
│   ├── 06_model_evaluation.ipynb  # Évaluation
│   └── 07_visualization.ipynb     # Visualisation
├── scripts/                       # Scripts
│   ├── earth_engine/              # Scripts Google Earth Engine
│   │   └── earth_engine_agneby.js # Script complet pour le bassin
│   ├── ml_models/                 # Modèles machine learning
│   └── utils/                     # Fonctions utilitaires
├── models/                        # Modèles sauvegardés
├── results/                       # Résultats et figures
├── docs/                          # Documentation
│   ├── plan_memoire.md            # Plan détaillé du mémoire
│   └── guide_github_earthengine.md # Guide GitHub-GEE
└── README_MEMOIRE.md              # Ce fichier
```

## 🛠️ Technologies Utilisées

### Télédétection
- **Google Earth Engine**: Extraction de données satellites
- **Sentinel-1**: Images radar pour détection d'inondations
- **Sentinel-2**: Images optiques pour occupation du sol
- **Landsat**: Séries temporelles longues
- **CHIRPS**: Précipitations satellitaires
- **SRTM**: Modèle numérique de terrain

### Machine Learning
- **Python**: Langage principal
- **TensorFlow/Keras**: Réseaux de neurones (ANN, LSTM)
- **scikit-learn**: Algorithmes classiques (SVM, Random Forest)
- **PyTorch**: Alternative à TensorFlow
- **XGBoost**: Gradient boosting

### Analyse Hydrologique
- **SWAT**: Soil and Water Assessment Tool (optionnel)
- **HEC-HMS**: Hydrologic Modeling System (optionnel)

### Visualisation
- **Matplotlib/Seaborn**: Graphiques Python
- **Plotly**: Graphiques interactifs
- **Folium**: Cartes interactives
- **Streamlit**: Interface web

## 📊 Méthodologie

### Phase 1: Collecte des Données (1-2 mois)
- [x] Structure du projet créée
- [ ] Acquérir les données hydrologiques (SODECI, ANADER)
- [ ] Télécharger les données satellites via Earth Engine
- [ ] Obtenir les données climatiques (CHIRPS, ERA5)
- [ ] Télécharger le MNT (SRTM)

### Phase 2: Prétraitement (1 mois)
- [ ] Nettoyage des données
- [ ] Traitement des valeurs manquantes
- [ ] Normalisation des données
- [ ] Création de séries temporelles

### Phase 3: Analyse Exploratoire (1 mois)
- [ ] Analyse statistique des données
- [ ] Visualisation des tendances
- [ ] Corrélation entre variables
- [ ] Analyse des événements de crue historiques

### Phase 4: Analyse du Changement Climatique (1 mois)
- [ ] Analyse des tendances climatiques (1970-présent)
- [ ] Projection avec scénarios futurs (RCP 4.5, 8.5)
- [ ] Évaluation de l'impact sur les crues

### Phase 5: Modélisation (2-3 mois)
- [ ] Préparation des datasets d'entraînement/test
- [ ] Entraînement des modèles (ANN, LSTM, SVM, etc.)
- [ ] Optimisation des hyperparamètres
- [ ] Comparaison des modèles

### Phase 6: Validation (1 mois)
- [ ] Validation avec données historiques
- [ ] Analyse des erreurs
- [ ] Tests de sensibilité
- [ ] Calibration du modèle

### Phase 7: Prévision et Visualisation (1 mois)
- [ ] Génération de prévisions
- [ ] Création d'interface de visualisation
- [ ] Développement d'alertes de crue
- [ ] Documentation

## 🧮 Algorithmes Bio-Inspirés

### 1. Réseaux de Neurones Artificiels (ANN)
- **Usage**: Prévision des débits
- **Avantages**: Bon pour les relations non-linéaires

### 2. Réseaux LSTM (Long Short-Term Memory)
- **Usage**: Prévision temporelle
- **Avantages**: Idéal pour les séries temporelles

### 3. Algorithmes Génétiques
- **Usage**: Optimisation des paramètres
- **Avantages**: Exploration de l'espace de solutions

### 4. SVM (Support Vector Machines)
- **Usage**: Classification de risque
- **Avantages**: Bon pour les petits datasets

### 5. Random Forest
- **Usage**: Classification et régression
- **Avantages**: Robuste, interprétable

## 📈 Indicateurs de Performance

### Pour les Modèles de Prévision
- **RMSE** (Root Mean Square Error)
- **MAE** (Mean Absolute Error)
- **NSE** (Nash-Sutcliffe Efficiency)
- **R²** (Coefficient de détermination)
- **KGE** (Kling-Gupta Efficiency)

### Pour la Classification
- **Accuracy**
- **Precision**
- **Recall**
- **F1-Score**
- **ROC-AUC**

## 🚀 Démarrage Rapide

### 1. Cloner le projet
```bash
git clone https://github.com/henrijoel1209/flood-detection-earthengine.git
cd flood-detection-earthengine
```

### 2. Installer les dépendances Python
```bash
pip install pandas numpy matplotlib seaborn scikit-learn tensorflow rasterio geopandas
```

### 3. Exécuter le script Earth Engine
1. Ouvrez Google Earth Engine: https://code.earthengine.google.com/
2. Copiez le script `scripts/earth_engine/earth_engine_agneby.js`
3. Collez dans GEE et exécutez
4. Exportez les données vers Google Drive

### 4. Lancer les notebooks
```bash
jupyter notebook notebooks/
```

## 📚 Documentation

- **Plan du mémoire**: <ref_file file="D:\TELECHARGEMENT\projet\docs\plan_memoire.md" />
- **Guide GitHub-GEE**: <ref_file file="D:\TELECHARGEMENT\projet\docs\guide_github_earthengine.md" />
- **Guide débutant télédétection**: <ref_file file="D:\TELECHARGEMENT\projet\docs\guide_debutant.md" />

## 📖 Références

### Modélisation Hydrologique
- Beven, K. J. (2012). Rainfall-Runoff Modelling
- Singh, V. P. (2017). Handbook of Applied Hydrology

### Algorithmes Bio-Inspirés
- Haykin, S. (2009). Neural Networks and Learning Machines
- Goldberg, D. E. (1989). Genetic Algorithms

### Changement Climatique
- IPCC (2021). Climate Change 2021: The Physical Science Basis

## 🤝 Contribution

Ce projet est pour un mémoire de recherche. Les contributions sont les bienvenues sous forme de:
- Rapports de bugs
- Améliorations de code
- Suggestions de modèles
- Documentation

## 📄 Licence

Ce projet est à des fins de recherche académique.

## 📧 Contact

Pour toute question sur ce projet de mémoire, n'hésitez pas à contacter via GitHub.

---

**Statut du projet**: 🚧 En développement
**Dernière mise à jour**: Octobre 2024
