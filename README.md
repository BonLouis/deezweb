# Usage

* Run `npm run serve`

========================================================================
# Tree
```
.
├── bundle.js -------------------------------------------  .js buildé
├── css ------------- css de composants, reset et main
│   ├── album.css
│   ├── artist.css
│   ├── main.css
│   ├── reset.css
│   └── tabs-menu.css
├── index.html
├── js --------------------------------*.js non buildé
│   ├── components ---------------- Composants Vue
│   │   ├── albumGrid.js
│   │   ├── artistGrid.js
│   │   ├── tabsMenu.js
│   │   └── trackGrid.js
│   ├── main.js ------------- Instance de Vue
│   ├── pages ------------ Composants pages (utilisées par Router.js)
│   │   ├── album.js
│   │   ├── artist.js
│   │   ├── favs.js
│   │   ├── home.js
│   │   ├── search.js
│   │   └── track.js
│   ├── Router.js
│   └── utils.js ---------- Bases urls + mixin
└── templates ---------------- *.html fetchés
    ├── components ---------- *.html de composants
    │   ├── album-grid.html
    │   ├── artist-grid.html
    │   ├── tabsMenu.html
    │   └── track-grid.html
    └── pages --------------- *.html de pages
        ├── album.html
        ├── artist.html
        ├── favorites.html
        ├── home.html
        └── search.html
```
# Infos
* Ce projet utilise `fetch()` afin de se passer de la syntaxe 'inline-html', rendant les fichiers html de composants plus facile à lire, à travailler. Il faut donc un serveur local. J'ai pensé à vous ==> `npm run serve`.
* Les composants embarquant le mixin chargent leur propre feuille css (persistante). Ce n'est pas flagrant, mais cela permet d'étaler le chargement de ressource, et rendre plus rapidement la première page.

# Autres
Bonne lecture !
