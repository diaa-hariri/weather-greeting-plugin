# Weather Greeting Plugin

Un plugin WordPress qui affiche un résumé météo avec une icône, un fond dégradé, et une infobulle au survol.

---

## Fonctionnalités

- Affiche la météo actuelle basée sur la localisation de l'utilisateur.
- Icônes météo claires et esthétiques.
- Fond en dégradé changeant selon la condition météo.
- Infobulle descriptive affichée au survol de l'icône.
- Mise en cache locale des données météo pour 30 minutes afin d'optimiser les performances.

---

## Fichiers principaux

- `weather-greeting.php` : Fichier principal du plugin qui gère l'initialisation et les hooks WordPress.
- `css/weather-greeting.css` : Styles CSS pour l'apparence du widget météo.
- `js/weather-greeting.js` : Script JavaScript pour récupérer les données météo et afficher l'interface utilisateur.

---

## Installation

1. Téléchargez le dossier du plugin dans le répertoire `/wp-content/plugins/` de votre site WordPress.
2. Activez le plugin depuis le tableau de bord WordPress.
3. Utilisez le shortcode `[weather_greeting]` dans vos articles, pages, ou widgets pour afficher la météo.

---

## Usage

Ajoutez simplement le shortcode suivant à l'endroit où vous souhaitez afficher la météo :

[weather_greeting]

---

## 📄 Licence

Ce plugin est distribué sous la licence MIT.  
Vous êtes libre de l’utiliser, de le modifier et de le redistribuer.  
Voir le texte complet de la licence ici :  
👉 [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

