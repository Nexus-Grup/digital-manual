import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const fr: Dictionary = {
    meta: {
        title: "Manual digital | Le manuel du futur : interactif, accessible et durable",
        description:
            "Remplacez les notices papier confuses par des manuels numériques, accessibles via QR code. Un guide intuitif pour ceux qui montent ; moins de coûts, des objectifs ESG et moins de demandes au service client pour les marques.",
    },
    header: {
        homeAria: "Manual digital, retour en haut de page",
        navAria: "Sections de la page",
        nav: ["Le problème", "Solution", "Accessibilité", "Qui sommes-nous", "Entreprises"],
        contact: "Nous contacter",
        contrast: {
            trigger: "Options de contraste",
            group: "Mode d’affichage",
            normal: "Par défaut",
            gray: "Niveaux de gris",
            high: "Contraste élevé",
        },
        language: {
            trigger: "Langue : {language}. Changer de langue",
            menu: "Choisir la langue",
        },
        libras: {
            open: "Ouvrir la traduction en Libras (langue des signes brésilienne)",
            close: "Fermer la traduction en Libras",
            loading: "Chargement de la traduction en Libras…",
            error: "Impossible de charger VLibras. Vérifiez votre connexion et réessayez.",
        },
    },
    productHeader: {
        homeAria: "Manuel numérique, voir tous les produits",
        menu: {
            open: "Ouvrir le menu",
            title: "Menu",
            close: "Fermer le menu",
            search: "Rechercher",
            searchAria: "Rechercher dans le menu",
            navAria: "Menu principal",
            groupProduct: "Ce produit",
            groupGeneral: "Général",
            home: "Accueil",
            manual: "Manuel",
            information: "Informations",
            assembly: "Montage",
            allProducts: "Tous les produits",
            empty: "Aucun résultat pour « {query} ». Essayez un autre mot.",
        },
    },
    mobileMenu: {
        open: "Ouvrir le menu",
        close: "Fermer le menu",
        navAria: "Menu principal",
    },
    hero: {
        tag: "Le manuel du futur",
        titleStart: "Dites adieu aux notices papier incompréhensibles. Bienvenue dans l’ère du",
        titleHighlight: "Manuel numérique 3D",
        titleEnd: ".",
        text: "Nous transformons des instructions statiques en expériences interactives à 360°, 100 % accessibles et durables, du QR code de la boîte jusqu’à la paume de votre main.",
        searchLabel: "Vous avez déjà un produit ? Trouvez son manuel maintenant",
        searchPlaceholder: "Nom, modèle ou référence du produit",
        searchAria: "Rechercher un manuel par nom, modèle ou référence du produit",
        searchButton: "Rechercher",
        b2bText: "Vous êtes fabricant ou marque ?",
        b2bButton: "Numériser les manuels de mon entreprise",
        highlights: ["QR code sur l’emballage", "Vue 3D à 360°", "Langue des signes et lecture à voix haute"],
        mascotAlt: "Lucca, la chouette guide de Manual digital, portant un casque de sécurité",
        badge3d: "3D 360°",
        badgeEco: "Zéro papier inutile",
    },
    problem: {
        eyebrow: "Le problème",
        title: "Le coût invisible du papier dans l’industrie.",
        text: "La notice imprimée alourdit la logistique, génère des déchets et finit le plus souvent jetée ou oubliée. Et celui qui doit monter le produit reste sans aide.",
        industryTitle: "Pour l’industrie",
        stats: [
            {
                value: "4 741 t",
                label: "de papier par an",
                text: "estimées rien que pour les notices de base de quatre géants : Whirlpool, Electrolux, Samsung et Apple.",
            },
            {
                value: "80 g",
                label: "par notice",
                text: "c’est le poids moyen d’une seule notice d’électroménager, multiplié par des millions de cartons.",
            },
            {
                value: "13 152",
                label: "ramettes de 500 feuilles",
                text: "par an dans un seul scénario de biens de consommation, avec 1,6 million de notices imprimées.",
            },
        ],
        usersTitle: "Pour ceux qui montent",
        pains: [
            "Des caractères minuscules et des schémas qui embrouillent plus qu’ils n’expliquent.",
            "Une notice perdue, déchirée ou jetée avec le carton.",
            "Aucune aide pour les personnes malvoyantes, malentendantes ou ayant des difficultés de lecture.",
            "Une seule langue, pas de vidéo et aucun moyen de voir la pièce sous un autre angle.",
        ],
        note: "Estimations illustratives de l’étude du Time Nexus, basées sur les rapports annuels 2025 et sur l’hypothèse d’un papier de 75 g/m² au format A5. Elles ne représentent pas des données internes des entreprises citées.",
    },
    calculator: {
        eyebrow: "Calculateur d’impact",
        title: "Combien de papier votre entreprise pourrait-elle cesser d’imprimer ?",
        text: "Indiquez combien de produits vous vendez par an et découvrez, selon les hypothèses de notre étude, l’impact du passage à Manual digital.",
        productsLabel: "Produits vendus par an",
        manualTypeLabel: "Type de notice",
        manualTypes: [
            "Électroménager (34 pages, 80 g)",
            "Notice compacte (16 pages, 18,72 g)",
            "Smartphone (dépliant, 1,5 g)",
        ],
        shareLabel: "Produits livrés aujourd’hui avec une notice imprimée",
        shares: ["70 % des produits", "80 % des produits", "90 % des produits"],
        resultsTitle: "{count} notices imprimées en moins par an, cela représente :",
        results: ["de papier en moins par an", "feuilles A4 équivalentes", "ramettes de 500 feuilles"],
        note: "Hypothèses : papier de 75 g/m², feuille A4 de 4,68 g et notice de 18,72 g à 80 g, selon l’étude du Time Nexus. Hors couverture, gâche d’impression et transport.",
    },
    solution: {
        eyebrow: "La solution",
        title: "Bien plus qu’un PDF : une expérience guidée.",
        text: "Manual digital transforme le livret de la boîte en un guide visuel, interactif et toujours à jour. Essayez ici : faites tourner la pièce et cochez les étapes.",
        features: [
            {
                title: "Vue 3D à 360°",
                text: "Faites pivoter, zoomez et voyez chaque pièce en vue éclatée. Fini les devinettes à partir d’un schéma.",
            },
            {
                title: "Étape par étape intelligent",
                text: "Des check-lists de montage interactives et des informations détaillées sur chaque pièce, à votre rythme.",
            },
            {
                title: "Centre de vidéos",
                text: "Les meilleures vidéos sur le produit, réunies et organisées dans le manuel lui-même.",
            },
            {
                title: "Accès hybride",
                text: "Pointez votre appareil photo sur le QR code de la boîte ou recherchez le modèle directement sur le site.",
            },
        ],
        demo: {
            product: "Meuble TV · Modèle R-120",
            step: "Étape {current} sur {total}",
            cubeSpinning: "Pièce en rotation à 360 degrés",
            cubeExploded: "Pièce en vue éclatée",
            explode: "Voir la vue éclatée",
            assemble: "Assembler la pièce",
            progress: "Progression du montage",
            steps: ["Séparez les pièces A, B et C", "Emboîtez le côté sur la base", "Fixez avec 4 vis M6"],
        },
    },
    accessibility: {
        eyebrow: "Accessibilité 100 %",
        title: "Une technologie pensée pour tout le monde.",
        text: "Aucun consommateur ne devrait être laissé de côté à cause de barrières sensorielles, linguistiques ou cognitives. L’accessibilité n’est pas un bonus : c’est le point de départ.",
        quote: "« Instruire, c’est inclure. »",
        quoteHint: "Essayez maintenant : utilisez les boutons de contraste, de langue et de langue des signes en haut de la page.",
        carouselLabel: "Fonctionnalités d’accessibilité",
        features: [
            {
                title: "Traduction en Libras",
                text: "Intégration native de VLibras pour rendre tout le contenu du manuel accessible aux personnes sourdes, en langue des signes brésilienne.",
            },
            {
                title: "Lecteur d’écran et voix haute",
                text: "Navigation complète par la voix et l’audio pour les personnes malvoyantes ou ayant des difficultés de lecture.",
            },
            {
                title: "Confort visuel",
                text: "Mode sombre, mode clair et contraste élevé en un geste, avec des textes grands et lisibles.",
            },
            {
                title: "Traduction de langue",
                text: "Changement de langue instantané pour servir les consommateurs et les marchés du monde entier.",
            },
        ],
    },
    brand: {
        eyebrow: "Qui sommes-nous",
        title: "Une nouvelle façon de transmettre l’information : pour les personnes et pour la planète.",
        text: "Manual digital est né pour remplacer les notices imprimées, statiques et confuses par une expérience interactive, accessible et centrée sur l’utilisateur.",
        missionTitle: "Mission",
        missionText:
            "Transformer l’expérience après-achat et le montage des produits grâce à des manuels numériques interactifs, intuitifs et 100 % accessibles, en réduisant drastiquement le gaspillage de papier et les coûts opérationnels des industriels.",
        visionTitle: "Vision",
        visionText:
            "Devenir la référence mondiale de la documentation technique numérique et de l’après-vente interactive, en menant les biens de consommation, l’électroménager et l’ameublement vers la fin du papier inutile et l’inclusion numérique universelle.",
        valuesTitle: "Nos valeurs",
        values: [
            {
                title: "Accessibilité radicale",
                text: "Instruire, c’est inclure : langue des signes, lecteur d’écran, contraste élevé, modes sombre et clair et plusieurs langues.",
            },
            {
                title: "Durabilité mesurable",
                text: "Chaque QR code scanné épargne des arbres, de l’eau, de l’énergie et des émissions dans la chaîne graphique.",
            },
            {
                title: "Innovation centrée sur l’utilisateur",
                text: "3D à 360°, vue éclatée, check-lists étape par étape et sélection de vidéos.",
            },
            {
                title: "Efficacité et partenariat B2B",
                text: "Moins de coûts d’impression, de stockage et de transport, avec de meilleurs indicateurs ESG.",
            },
            {
                title: "Transition responsable",
                text: "Nous réduisons le papier intelligemment, sans exclure ceux qui ont encore besoin du support imprimé.",
            },
        ],
        legacyTitle: "Notre héritage",
        legacyText:
            "Prouver que de petits changements dans la façon de diffuser l’information à grande échelle permettent d’économiser des milliers de tonnes de ressources naturelles chaque année, tout en démocratisant le savoir technique pour des millions de personnes en situation de handicap.",
        positioningTitle: "Notre positionnement",
        positioning: [
            {
                audience: "Pour les fabricants et l’industrie",
                text: "Nous ne sommes pas un dépôt de PDF. Nous sommes une plateforme SaaS d’après-vente intelligente qui transforme les coûts d’impression et les passifs environnementaux en objectifs ESG atteints, en moins de demandes au service client et en un déballage mémorable.",
            },
            {
                audience: "Pour ceux qui achètent et montent",
                text: "Fini la frustration des notices confuses. Un guide visuel, interactif, en 3D et adapté à vos besoins, dans la paume de votre main via QR code ou dans votre navigateur.",
            },
        ],
    },
    brandBand: {
        aria: "Signature de la marque",
        text: "Le manuel du futur. Interactif pour ceux qui montent, accessible à tous, durable pour la planète.",
    },
    marquee: {
        title: "Le marché que nous voulons transformer : les grands fabricants d’électronique, d’électroménager et de meubles",
    },
    sustainability: {
        eyebrow: "Durabilité",
        title: "Chaque QR code scanné, c’est du papier qui ne finit pas à la poubelle.",
        text: "L’information reste dans la boîte, mais au bon endroit : sur le téléphone de celui qui monte, toujours à jour et sans coût environnemental d’impression.",
        resources: [
            {
                title: "Moins d’arbres abattus",
                text: "Les notices qui ne sont pas imprimées ne consomment plus de pâte à papier neuve.",
            },
            {
                title: "Moins d’eau",
                text: "La fabrication du papier est l’une des industries les plus consommatrices d’eau.",
            },
            {
                title: "Moins d’énergie",
                text: "Sans impression, massicotage ni finition, la chaîne de production économise de l’énergie.",
            },
            {
                title: "Moins de carbone dans le transport",
                text: "Des cartons plus légers et plus compacts réduisent le poids et les émissions logistiques.",
            },
        ],
        transitionTitle: "Transition responsable",
        transitionText:
            "Nous ne voulons laisser personne sans instructions. Nous réduisons le papier intelligemment et conservons une version imprimée pour ceux qui n’ont pas encore facilement accès à internet ou à un smartphone.",
    },
    business: {
        eyebrow: "Entreprises",
        title: "Pourquoi les marques innovantes choisissent-elles Manual digital ?",
        text: "Une plateforme SaaS d’après-vente qui transforme les coûts d’impression et le passif environnemental en économies, en indicateurs ESG et en clients plus satisfaits.",
        benefits: [
            {
                title: "Réduction des coûts",
                text: "Des économies directes sur l’impression, le papier, le stockage et le poids transporté pour chaque unité vendue.",
            },
            {
                title: "Des objectifs ESG concrets",
                text: "Des rapports d’impact indiquant les tonnes de papier et de CO₂ économisées, prêts pour le reporting de l’entreprise.",
            },
            {
                title: "Mise à jour en temps réel",
                text: "Corrigez les instructions ou ajoutez des améliorations instantanément, sans réimprimer des lots entiers.",
            },
            {
                title: "Moins de demandes au service client",
                text: "Un montage plus clair réduit les retours, les avis négatifs et les questions au support.",
            },
        ],
        ctaText: "Découvrez combien votre activité peut économiser grâce au calculateur d’impact.",
        ctaPrimary: "Parler à un expert",
        ctaSecondary: "Calculer l’impact",
    },
    howItWorks: {
        eyebrow: "Comment ça marche",
        title: "Du papier au QR code en trois étapes.",
        text: "Une mise en place simple et rapide, sans modifier la ligne de production.",
        steps: [
            {
                title: "Envoi",
                text: "Votre entreprise envoie la notice actuelle ainsi que les fichiers techniques et 3D du produit.",
            },
            {
                title: "Transformation",
                text: "La plateforme convertit le contenu en un manuel 3D interactif, accessible et doté de vidéos intégrées.",
            },
            {
                title: "Publication",
                text: "Nous générons le QR code unique pour l’emballage et indexons le manuel dans le moteur de recherche public.",
            },
        ],
    },
    catalog: {
        eyebrow: "Pour ceux qui montent",
        title: "Découvrez des manuels déjà numérisés.",
        text: "Choisissez une catégorie et testez tout de suite l’expérience 3D et les fonctions d’accessibilité. Modèles de démonstration.",
        filterAria: "Filtrer par catégorie",
        categories: {
            all: "Tous",
            appliances: "Électroménager",
            furniture: "Meubles",
            tools: "Outils",
            electronics: "Électronique",
        },
        carouselLabel: "Manuels numérisés",
        products: [
            { name: "Réfrigérateur No Frost 450 L", features: ["3D 360°", "Vidéos", "Langue des signes"] },
            { name: "Lave-linge 12 kg", features: ["Check-list", "Voix haute"] },
            { name: "Armoire 6 portes", features: ["Vue éclatée", "Check-list"] },
            { name: "Meuble TV R-120", features: ["3D 360°", "Langue des signes"] },
            { name: "Visseuse 12 V", features: ["Vidéos", "Sécurité"] },
            { name: "Perceuse à percussion 650 W", features: ["3D 360°", "Voix haute"] },
            { name: "Smart TV 55 pouces", features: ["Configuration", "Langue des signes"] },
            { name: "Enceinte Bluetooth", features: ["Vidéos", "Langues"] },
        ],
        openManual: "Ouvrir le manuel",
        viewAll: "Voir tous les manuels",
    },
    contact: {
        eyebrow: "Parlons-en",
        title: "Prêt à moderniser l’emballage et l’après-vente de vos produits ?",
        text: "Parlez-nous un peu de votre activité. Notre équipe prépare une démonstration avec un manuel de votre gamme de produits.",
        name: "Nom",
        company: "Entreprise",
        email: "E-mail professionnel",
        volume: "Volume approximatif de produits par an",
        volumes: [
            "Jusqu’à 10 000 produits/an",
            "De 10 000 à 100 000 produits/an",
            "De 100 000 à 1 million de produits/an",
            "Plus d’1 million de produits/an",
        ],
        submit: "Demander une démo",
        privacy: "Nous utilisons vos données uniquement pour répondre à cette demande.",
        successTitle: "Nous avons bien reçu votre message !",
        successText: "Le Time Nexus vous répondra bientôt à l’adresse e-mail indiquée.",
        sendAnother: "Envoyer un autre message",
    },
    footer: {
        tagline: "Le manuel du futur. Interactif pour ceux qui montent, accessible à tous, durable pour la planète.",
        navAria: "Liens du pied de page",
        columns: [
            {
                title: "Navigation",
                links: ["Le problème", "La solution", "Durabilité", "Qui sommes-nous"],
            },
            {
                title: "Pour vous",
                links: ["Rechercher un manuel", "Manuels numérisés", "Fonctions d’accessibilité"],
            },
            {
                title: "Entreprises",
                links: ["Avantages", "Comment ça marche", "Calculateur d’impact", "Nous contacter"],
            },
        ],
        commitmentTitle: "Engagement d’accessibilité",
        commitmentText:
            "Nous suivons les recommandations WCAG, avec une structure compatible avec les lecteurs d’écran, le contraste élevé, la Libras via VLibras et la traduction de langue. Vous avez rencontré un obstacle ? Écrivez-nous.",
        copyright: "© 2026 Manual digital. Tous droits réservés.",
        team: "Réalisé par le Time Nexus : Danilo, Stephany, Thaiza et Bianca.",
    },
    productSearch: {
        title: "Trouvez le manuel de votre produit",
        text: "Recherchez par nom, modèle ou code, ou scannez le QR code de l'emballage.",
        search: {
            label: "Nom, modèle ou code",
            placeholder: "Ex. : visseuse, GSR 120-LI",
            aria: "Rechercher un manuel par nom, modèle ou code",
            button: "Rechercher",
        },
        filterAria: "Filtrer par catégorie",
        resultsAria: "Manuels trouvés",
        countAll: "{count} manuels disponibles",
        countAllOne: "1 manuel disponible",
        countQuery: "{count} résultats pour « {query} »",
        countQueryOne: "1 résultat pour « {query} »",
        emptyTitle: "Aucun manuel trouvé pour « {query} »",
        emptyCategory: "Pas encore de manuels dans cette catégorie",
        emptyText: "Vérifiez le nom ou le code sur l'étiquette ou l'emballage du produit, puis réessayez.",
        clear: "Voir tous les manuels",
        openManual: "Ouvrir le manuel",
        other: "Autres",
        demoNote: "",
        cta: {
            title: "Vous êtes fabricant ? Numérisez les manuels de votre marque.",
            text: "Moins de papier, moins d'appels au SAV et un manuel accessible à tous vos clients.",
            button: "Nous contacter",
        },
    },
    readAloud: {
        titleReading: "Lecture à voix haute",
        titlePaused: "Lecture en pause",
        titleDone: "Lecture terminée",
        titleError: "Lecture interrompue",
        fab: "Lire le texte sélectionné à voix haute",
        pause: "Pause",
        resume: "Reprendre",
        replay: "Relire",
        close: "Fermer la lecture",
        missingVoice: "Cet appareil n'a pas de voix dans cette langue. La lecture peut sembler étrange.",
        error: "Impossible de lire ce texte.",
    },
    carousel: {
        goTo: "Aller à la carte {index} sur {total}",
    },
};

export default fr;
