# CardCreator - Brainstorming Design Mobile First

## Contexte
Application de création de cartes de visite professionnelles, reprise complète avec approche mobile first. L'application doit être accessible, inclusive, et offrir une expérience tactile fluide sur smartphone tout en restant élégante sur desktop.

---

<response>
<text>

## Idée 1 : "Atelier Papetier" — Design Néo-Artisanal

### Design Movement
Inspiré du mouvement **Arts & Crafts** revisité numériquement — l'idée d'un atelier de papeterie haut de gamme transposé en interface mobile.

### Core Principles
1. **Tactilité numérique** : Chaque interaction doit évoquer la manipulation physique d'une carte de visite
2. **Hiérarchie par la texture** : Les surfaces ont des qualités matérielles différentes (papier, carton, lin)
3. **Progression guidée** : L'utilisateur est accompagné étape par étape comme chez un artisan
4. **Simplicité fonctionnelle** : Réduire la surcharge cognitive, une action à la fois

### Color Philosophy
- Fond principal : Crème chaud `#F7F3ED` — évoque le papier de qualité
- Texte : Encre charbon `#2D2A26` — lisibilité maximale, sensation d'impression
- Accent primaire : Cuivre `#B87333` — touche artisanale premium
- Accent secondaire : Vert sauge `#7A8B6F` — naturel, rassurant
- Surfaces actives : Blanc cassé `#FEFCF8`

### Layout Paradigm
- **Stack vertical mobile** : Tout s'empile naturellement, pas de grille forcée
- **Cartes flottantes** : Les sections sont des "cartes" physiques qui se superposent avec des ombres douces
- **Navigation par gestes** : Swipe entre les étapes de création
- **Bottom sheet** pour les options secondaires

### Signature Elements
1. **Bordures cousues** : Lignes pointillées subtiles évoquant la couture sur papier
2. **Ombres portées douces** : Chaque carte semble posée sur un bureau en bois
3. **Coins légèrement arrondis** avec un radius de 12px — ni trop carré, ni trop rond

### Interaction Philosophy
- Les transitions imitent le mouvement d'une carte qu'on retourne ou qu'on glisse
- Les boutons ont un léger enfoncement au toucher (scale 0.97)
- Les formulaires apparaissent comme des fiches qu'on remplit

### Animation
- Entrée des éléments par glissement vertical doux (200ms ease-out)
- Retournement de carte avec perspective 3D
- Micro-animations sur les inputs : léger rebond au focus
- Transition entre pages : slide horizontal fluide

### Typography System
- Titres : **DM Serif Display** — élégance classique
- Corps : **DM Sans** — lisibilité moderne, poids 400/500/600
- Labels : DM Sans 500, taille réduite, espacement large (tracking)
- Données carte : Police variable selon le template choisi

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Idée 2 : "Studio Créatif" — Design Néo-Brutaliste Doux

### Design Movement
**Néo-Brutalisme adouci** — des formes franches et des couleurs vives mais avec une douceur tactile adaptée au mobile. Inspiré des studios de design contemporains.

### Core Principles
1. **Audace contrôlée** : Des choix visuels forts mais jamais agressifs
2. **Clarté absolue** : Chaque élément a un rôle évident, pas de décoration gratuite
3. **Mobile comme canvas** : L'écran mobile est traité comme une toile de création
4. **Feedback immédiat** : Chaque action produit une réponse visuelle claire

### Color Philosophy
- Fond : Blanc pur `#FFFFFF` avec des zones de couleur vive en accent
- Texte : Noir profond `#0F0F0F` — contraste maximal
- Accent primaire : Bleu électrique `#2563EB` — énergie créative
- Accent chaud : Orange vif `#F97316` — appels à l'action
- Surfaces : Gris très clair `#F8FAFC` avec bordures noires fines (1px)

### Layout Paradigm
- **Blocs empilés asymétriques** : Les sections ne sont pas toutes de la même largeur
- **Bordures visibles** : Les éléments sont délimités par des traits nets
- **Plein écran mobile** : Chaque étape occupe tout l'écran
- **Barre d'outils flottante** en bas avec des icônes larges et tactiles

### Signature Elements
1. **Bordures noires franches** (2px) sur les cartes et boutons — identité néo-brutaliste
2. **Ombres décalées** : Box-shadow offset (4px, 4px) en couleur d'accent
3. **Badges colorés** : Étiquettes vives pour les catégories de templates

### Interaction Philosophy
- Les éléments réagissent avec un décalage d'ombre au toucher
- Les boutons se déplacent légèrement vers le bas-droit au press
- Navigation par tabs en bas de l'écran avec indicateur animé

### Animation
- Transitions snap : rapides et précises (150ms ease)
- Apparition des cartes par scale de 0.95 à 1 avec opacité
- Indicateur de tab qui glisse horizontalement
- Shake subtil sur les erreurs de validation

### Typography System
- Titres : **Space Grotesk** — géométrique et moderne, poids 700
- Corps : **Space Grotesk** — cohérence, poids 400/500
- Boutons : Space Grotesk 600, uppercase avec tracking large
- Chiffres et données : **JetBrains Mono** pour les codes couleur

</text>
<probability>0.06</probability>
</response>

---

<response>
<text>

## Idée 3 : "Pocket Studio" — Design Glassmorphism Épuré

### Design Movement
**Glassmorphism minimaliste** — surfaces translucides et flous, évoquant une application native iOS/Android premium. Inspiré des interfaces de productivité haut de gamme.

### Core Principles
1. **Profondeur par la transparence** : Les couches visuelles créent une hiérarchie naturelle
2. **Fluidité totale** : Tout coule, rien ne saute — transitions continues
3. **Focus mobile** : L'interface est pensée pour le pouce, avec des zones de toucher généreuses
4. **Élégance discrète** : La beauté vient de la retenue, pas de l'excès

### Color Philosophy
- Fond : Gris bleuté très doux `#F1F5F9` — neutre et reposant
- Texte : Ardoise foncé `#1E293B` — professionnel sans être dur
- Accent primaire : Indigo `#6366F1` — sophistiqué et moderne
- Accent secondaire : Émeraude `#10B981` — succès et validation
- Surfaces glass : `rgba(255, 255, 255, 0.7)` avec backdrop-blur

### Layout Paradigm
- **Couches superposées** : Les panneaux flottent les uns sur les autres
- **Navigation bottom-bar** avec effet glass
- **Cartes glass** : Conteneurs semi-transparents avec bordures lumineuses
- **Full-bleed mobile** : Contenu bord à bord avec padding interne

### Signature Elements
1. **Surfaces givrées** : backdrop-filter blur(20px) avec bordure blanche subtile
2. **Gradient mesh** en arrière-plan : taches de couleur douces et organiques
3. **Indicateurs lumineux** : Points de couleur pour les statuts et la navigation

### Interaction Philosophy
- Les éléments glass se densifient au toucher (opacité augmente)
- Les transitions utilisent des courbes spring pour un feeling naturel
- Le scroll révèle progressivement le contenu avec parallaxe subtile

### Animation
- Spring animations (tension 200, friction 20) pour les mouvements
- Fade-in progressif des éléments au scroll (Intersection Observer)
- Morphing des boutons entre les états
- Gradient mesh qui évolue lentement en arrière-plan (60s loop)

### Typography System
- Titres : **Outfit** — géométrique arrondie, chaleureuse, poids 600/700
- Corps : **Outfit** — excellente lisibilité mobile, poids 400/500
- Micro-texte : Outfit 400, opacité réduite pour la hiérarchie
- Monospace : **Fira Code** pour les valeurs techniques (couleurs hex)

</text>
<probability>0.07</probability>
</response>
