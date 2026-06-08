# UMR-AMES — Site web

Site institutionnel de l'**Unité Mixte de Recherche AMES**
(Analyse et Modélisation pour l'Environnement et la Santé).

## Structure

```
.
├── index.html        # Page française (lang="fr")
├── en/
│   └── index.html    # English version (lang="en")
├── css/style.css     # Styles partagés (design system, responsive)
├── js/main.js        # JS partagé et bilingue (libellés selon la langue)
├── logo/             # Logos (UMR-AMES + partenaires)
├── favicon.png       # Icône de l'onglet
└── CNAME             # Domaine personnalisé (umr-ames.com)
```

Le site est **bilingue** : un sélecteur **FR | EN** dans l'en-tête bascule entre
`index.html` (français) et `en/index.html` (anglais). Les deux pages partagent
la même feuille de styles et le même script ; les liens `hreflang` indiquent
les versions linguistiques aux moteurs de recherche.

## Mise en ligne (GitHub Pages)

1. Placer ces fichiers à la racine de la branche publiée (`main` ou `master`).
2. Dans **Settings → Pages**, choisir la branche et le dossier `/ (root)`.
3. Le fichier `index.html` est servi automatiquement à la racine du domaine.

> Important : les chemins des images respectent la casse exacte des fichiers
> (`logo/ames.png` en minuscules), car GitHub Pages est sensible à la casse.

## Sections

Accueil · Présentation · Axes de recherche · Équipes · Membres · Projets ·
Publications · Actualités · Partenaires · Contact.

## À compléter par l'unité

- Tableau **Membres** : champs « à compléter » (établissement, grade, email).
- Section **Actualités** : ajouter les événements récents.
- Section **Projets** : compléter avec les projets financés en cours.
