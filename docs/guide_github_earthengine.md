# Guide: Utiliser les scripts depuis GitHub dans Google Earth Engine

Ce guide explique comment utiliser vos scripts stockés sur GitHub dans Google Earth Engine.

## 📥 Méthode 1: Copier/Coller depuis GitHub (Recommandé pour débutants)

C'est la méthode la plus simple et la plus directe.

### Étape 1: Ouvrir votre dépôt sur GitHub

1. Allez sur votre dépôt: https://github.com/henrijoel1209/flood-detection-earthengine
2. Vous verrez la liste de vos fichiers

### Étape 2: Naviguer vers le script voulu

1. Cliquez sur le dossier **`scripts/`**
2. Vous verrez tous vos scripts:
   - `sentinel1_flood_detection.js`
   - `sentinel2_flood_detection.js`
   - `sentinel1_before_after.js`
   - `sentinel1_advanced.js`
   - `earth_engine_app.js`

### Étape 3: Copier le code

**Option A: Bouton de copie**
1. Cliquez sur le fichier que vous voulez (ex: `sentinel1_flood_detection.js`)
2. Regardez en haut à droite du fichier
3. Cliquez sur l'icône **"Copy"** (deux rectangles) 📋
4. Le code est maintenant copié dans votre presse-papier

**Option B: Sélection manuelle**
1. Cliquez sur le fichier
2. Sélectionnez tout le code (Ctrl+A)
3. Copiez (Ctrl+C)

### Étape 4: Coller dans Google Earth Engine

1. Ouvrez https://code.earthengine.google.com/
2. Créez un nouveau script:
   - Cliquez sur **File** > **New** (ou le bouton +)
   - Ou utilisez un script existant en effaçant son contenu
3. Collez le code (Ctrl+V)
4. Cliquez sur le bouton **Run**

### Étape 5: Enregistrer dans Google Earth Engine (optionnel)

Pour garder le script dans votre compte Earth Engine:

1. Cliquez sur **File** > **Save**
2. Donnez un nom au script (ex: "Abidjan Flood Detection")
3. Cliquez sur **Save**

Le script sera maintenant disponible dans votre compte Earth Engine.

---

## 🔄 Méthode 2: Cloner le dépôt localement

Utile si vous voulez modifier les scripts avant de les utiliser.

### Étape 1: Cloner le dépôt

Ouvrez un terminal (Command Prompt ou PowerShell) et exécutez:

```bash
git clone https://github.com/henrijoel1209/flood-detection-earthengine.git
```

Cela créera un dossier `flood-detection-earthengine` avec tous vos fichiers.

### Étape 2: Modifier les scripts localement

1. Ouvrez le dossier cloné
2. Modifiez les fichiers avec votre éditeur de texte
3. Sauvegardez les modifications

### Étape 3: Copier vers Google Earth Engine

1. Ouvrez le fichier modifié dans votre éditeur
2. Copiez tout le code
3. Collez dans Google Earth Engine
4. Cliquez sur Run

### Étape 4: Envoyer les modifications sur GitHub (optionnel)

Si vous voulez sauvegarder vos modifications sur GitHub:

```bash
cd flood-detection-earthengine
git add .
git commit -m "Description de vos modifications"
git push
```

---

## 🔄 Méthode 3: Utiliser des outils de synchronisation (Avancé)

Il existe des outils pour synchroniser automatiquement entre GitHub et Earth Engine.

### Option A: earthengine-snippet-sync

Outil pour synchroniser les snippets Earth Engine avec GitHub.

**Installation:**
```bash
npm install -g earthengine-snippet-sync
```

**Utilisation:**
```bash
earthengine-snippet-sync pull  # Télécharger depuis Earth Engine
earthengine-snippet-sync push  # Envoyer vers Earth Engine
```

### Option B: ee-sync

Un autre outil de synchronisation.

**Installation:**
```bash
pip install ee-sync
```

**Utilisation:**
```bash
ee-sync pull
ee-sync push
```

---

## 📋 Workflow recommandé

### Pour les modifications fréquentes:

1. **Modifier localement** dans votre dossier de projet
2. **Tester dans Earth Engine** (copier/coller)
3. **Si ça fonctionne**: Commit et push sur GitHub
4. **Si ça ne fonctionne pas**: Modifier et réessayer

### Pour les collaborations:

1. **Collaborateur** fait un fork de votre dépôt
2. Il modifie et fait un Pull Request
3. Vous reviewez et mergez
4. Vous copiez le code modifié dans Earth Engine

---

## 💡 Conseils pratiques

### 1. Organiser vos scripts sur GitHub

Ajoutez des descriptions dans le README pour chaque script:

```markdown
## Scripts disponibles

### sentinel1_flood_detection.js
- **Usage**: Détection basique avec Sentinel-1
- **Région**: Configurable
- **Difficulté**: Débutant

### earth_engine_app.js
- **Usage**: Application interactive complète
- **Région**: Sélectionnable via menu
- **Difficulté**: Avancé
```

### 2. Versioning

Utilisez des tags pour marquer les versions importantes:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 3. README avec instructions d'utilisation

Ajoutez dans votre README comment utiliser les scripts dans Earth Engine:

```markdown
## Comment utiliser dans Google Earth Engine

1. Allez sur [GitHub](https://github.com/henrijoel1209/flood-detection-earthengine)
2. Naviguez vers `scripts/`
3. Cliquez sur le script voulu
4. Copiez le code
5. Collez dans [Google Earth Engine](https://code.earthengine.google.com/)
6. Cliquez sur Run
```

---

## 🚫 Limitations

### Ce que vous NE POUVEZ PAS faire directement:

- ❌ Exécuter des scripts GitHub directement dans Earth Engine (sans copier/coller)
- ❌ Synchronisation automatique bidirectionnelle
- ❌ Utiliser des fichiers locaux depuis Earth Engine

### Ce que vous POUVEZ faire:

- ✅ Copier/coller des scripts depuis GitHub
- ✅ Stocker vos scripts sur GitHub comme backup
- ✅ Collaborer avec d'autres via GitHub
- ✅ Historique et versioning des scripts

---

## 🎯 Résumé rapide

| Méthode | Difficulté | Avantages | Inconvénients |
|---------|-----------|-----------|---------------|
| Copier/Coller | ⭐ Facile | Simple, rapide | Manuel |
| Clone local | ⭐⭐ Moyen | Modifiable localement | Plus d'étapes |
| Outils de sync | ⭐⭐⭐ Difficile | Automatique | Installation requise |

**Recommandation pour débutant**: Utilisez la méthode **Copier/Coller**.

---

## 🆘 Dépannage

### Problème: Le code ne se copie pas

**Solution:**
- Vérifiez que vous êtes sur la page du fichier (pas le dépôt)
- Utilisez Ctrl+A pour tout sélectionner, puis Ctrl+C

### Problème: Le script ne fonctionne pas dans Earth Engine

**Solution:**
- Vérifiez que vous avez copié tout le code
- Regardez la console pour les erreurs
- Assurez-vous que la région et les dates sont correctes

### Problème: Modifications non visibles sur GitHub

**Solution:**
```bash
git status  # Vérifiez les modifications
git add .
git commit -m "Votre message"
git push
```

---

## 📚 Ressources supplémentaires

- [Documentation GitHub](https://docs.github.com/)
- [Documentation Google Earth Engine](https://developers.google.com/earth-engine)
- [Git Basics](https://git-scm.com/docs/gittutorial)

---

Besoin d'aide ? N'hésitez pas à poser des questions ! 🚀
