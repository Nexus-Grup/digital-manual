import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const de: Dictionary = {
    meta: {
        title: "Manual digital | Die Anleitung der Zukunft: interaktiv, barrierefrei und nachhaltig",
        description:
            "Ersetzen Sie unübersichtliche Papieranleitungen durch barrierefreie digitale 3D-Anleitungen per QR-Code. Ein intuitiver Leitfaden für alle, die montieren – und für Marken weniger Kosten, ESG-Ziele und weniger Kundenservice-Anfragen.",
    },
    header: {
        homeAria: "Manual digital, zurück zum Anfang",
        navAria: "Seitenbereiche",
        nav: ["Das Problem", "Lösung", "Barrierefreiheit", "Über uns", "Für Unternehmen"],
        contact: "Kontakt",
        contrast: {
            trigger: "Kontrastoptionen",
            group: "Darstellungsmodus",
            normal: "Standard",
            gray: "Graustufen",
            high: "Hoher Kontrast",
        },
        language: {
            trigger: "Sprache: {language}. Sprache ändern",
            menu: "Sprache wählen",
        },
        libras: {
            open: "Übersetzung in Libras (Brasilianische Gebärdensprache) öffnen",
            close: "Übersetzung in Libras schließen",
            loading: "Übersetzung in Libras wird geladen…",
            error: "VLibras konnte nicht geladen werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
        },
    },
    productHeader: {
        homeAria: "Digitales Handbuch, alle Produkte anzeigen",
        menu: {
            open: "Menü öffnen",
            title: "Menü",
            close: "Menü schließen",
            search: "Suchen",
            searchAria: "Im Menü suchen",
            navAria: "Hauptmenü",
            groupProduct: "Dieses Produkt",
            groupGeneral: "Allgemein",
            home: "Start",
            manual: "Anleitung",
            information: "Informationen",
            assembly: "Montage",
            allProducts: "Alle Produkte",
            empty: "Nichts gefunden für „{query}“. Versuche ein anderes Wort.",
        },
    },
    mobileMenu: {
        open: "Menü öffnen",
        close: "Menü schließen",
        navAria: "Hauptmenü",
    },
    hero: {
        tag: "Die Anleitung der Zukunft",
        titleStart: "Schluss mit unverständlichen Papieranleitungen. Willkommen im Zeitalter der",
        titleHighlight: "digitalen 3D-Anleitung",
        titleEnd: ".",
        text: "Wir verwandeln statische Anleitungen in interaktive 360°-Erlebnisse – 100 % barrierefrei und nachhaltig, direkt vom QR-Code auf der Verpackung in Ihre Hand.",
        searchLabel: "Sie haben schon ein Produkt? Finden Sie jetzt die Anleitung",
        searchPlaceholder: "Produktname, Modell oder Artikelnummer",
        searchAria: "Anleitung nach Produktname, Modell oder Artikelnummer suchen",
        searchButton: "Anleitung suchen",
        b2bText: "Sie sind Hersteller oder Marke?",
        b2bButton: "Anleitungen meines Unternehmens digitalisieren",
        highlights: ["QR-Code auf der Verpackung", "3D-Ansicht in 360°", "Gebärdensprache und Vorlesefunktion"],
        mascotAlt: "Lucca, die Wegweiser-Eule von Manual digital, mit Schutzhelm",
        badge3d: "3D 360°",
        badgeEco: "Kein unnötiges Papier",
    },
    problem: {
        eyebrow: "Das Problem",
        title: "Die unsichtbaren Kosten von Papier in der Industrie.",
        text: "Die gedruckte Anleitung verteuert die Logistik, erzeugt Abfall und landet meistens im Müll oder in Vergessenheit. Und wer das Produkt montieren muss, bleibt trotzdem ohne Hilfe.",
        industryTitle: "Für die Industrie",
        stats: [
            {
                value: "4.741 t",
                label: "Papier pro Jahr",
                text: "geschätzt allein für die Basisanleitungen von vier Großkonzernen: Whirlpool, Electrolux, Samsung und Apple.",
            },
            {
                value: "80 g",
                label: "pro Anleitung",
                text: "wiegt eine einzige Haushaltsgeräte-Anleitung im Schnitt – multipliziert mit Millionen Kartons.",
            },
            {
                value: "13.152",
                label: "Pakete à 500 Blatt",
                text: "pro Jahr in einem einzigen Konsumgüter-Szenario mit 1,6 Millionen gedruckten Anleitungen.",
            },
        ],
        usersTitle: "Für alle, die montieren",
        pains: [
            "Winzige Schrift und Zeichnungen, die mehr verwirren als erklären.",
            "Anleitung verloren, zerrissen oder mit dem Karton weggeworfen.",
            "Keine Hilfen für Menschen mit Seh- oder Hörbehinderung oder Leseschwierigkeiten.",
            "Nur eine Sprache, kein Video und keine Möglichkeit, das Teil aus einem anderen Winkel zu sehen.",
        ],
        note: "Illustrative Schätzungen aus der Studie von Time Nexus auf Basis der Geschäftsberichte 2025 und der Annahme von 75-g/m²-Papier im A5-Format. Sie stellen keine internen Daten der genannten Unternehmen dar.",
    },
    calculator: {
        eyebrow: "Wirkungsrechner",
        title: "Wie viel Papier könnte Ihr Unternehmen einsparen?",
        text: "Geben Sie an, wie viele Produkte Sie pro Jahr verkaufen, und sehen Sie anhand der Annahmen unserer Studie, was der Umstieg auf Manual digital bewirkt.",
        productsLabel: "Verkaufte Produkte pro Jahr",
        manualTypeLabel: "Art der Anleitung",
        manualTypes: [
            "Haushaltsgerät (34 Seiten, 80 g)",
            "Kompakte Anleitung (16 Seiten, 18,72 g)",
            "Smartphone (Faltblatt, 1,5 g)",
        ],
        shareLabel: "Produkte, die heute mit gedruckter Anleitung ausgeliefert werden",
        shares: ["70 % der Produkte", "80 % der Produkte", "90 % der Produkte"],
        resultsTitle: "{count} gedruckte Anleitungen weniger pro Jahr bedeuten:",
        results: ["weniger Papier pro Jahr", "A4-Blätter (Äquivalent)", "Pakete à 500 Blatt"],
        units: {
            tonOne: "Tonne",
            tonOther: "Tonnen",
            kgOne: "Kilogramm",
            kgOther: "Kilogramm",
        },
        note: "Annahmen: Papier mit 75 g/m², A4-Blatt mit 4,68 g und Anleitungen von 18,72 g bis 80 g laut Studie von Time Nexus. Ohne Umschlag, Druckmakulatur und Transport.",
    },
    solution: {
        eyebrow: "Die Lösung",
        title: "Viel mehr als ein PDF: ein geführtes Erlebnis.",
        text: "Manual digital macht aus dem Heftchen im Karton einen visuellen, interaktiven und stets aktuellen Leitfaden. Probieren Sie es aus: Drehen Sie das Teil und haken Sie die Schritte ab.",
        features: [
            {
                title: "3D-Ansicht in 360°",
                text: "Drehen, zoomen und jedes Teil in der Explosionsansicht sehen. Kein Rätselraten mehr anhand einer Zeichnung.",
            },
            {
                title: "Intelligente Schritt-für-Schritt-Anleitung",
                text: "Interaktive Montage-Checklisten und detaillierte Informationen zu jedem Teil – in Ihrem Tempo.",
            },
            {
                title: "Video-Center",
                text: "Die besten Videos zum Produkt, gesammelt und geordnet direkt in der Anleitung.",
            },
            {
                title: "Hybrider Zugang",
                text: "Kamera auf den QR-Code der Verpackung richten oder das Modell direkt auf der Website suchen.",
            },
        ],
        demo: {
            product: "TV-Möbel · Modell R-120",
            step: "Schritt {current} von {total}",
            cubeSpinning: "Teil dreht sich um 360 Grad",
            cubeExploded: "Teil in Explosionsansicht",
            explode: "Explosionsansicht zeigen",
            assemble: "Teil zusammensetzen",
            progress: "Montagefortschritt",
            steps: ["Teile A, B und C bereitlegen", "Seitenteil auf die Basis stecken", "Mit 4 M6-Schrauben befestigen"],
        },
    },
    accessibility: {
        eyebrow: "100 % barrierefrei",
        title: "Technologie für alle Menschen.",
        text: "Niemand sollte wegen sensorischer, sprachlicher oder kognitiver Barrieren zurückbleiben. Barrierefreiheit ist kein Extra, sondern der Ausgangspunkt.",
        quote: "„Anleiten heißt einbeziehen.“",
        quoteHint: "Jetzt ausprobieren: Nutzen Sie oben auf der Seite die Schaltflächen für Kontrast, Sprache und Gebärdensprache.",
        carouselLabel: "Barrierefreiheitsfunktionen",
        features: [
            {
                title: "Übersetzung in Libras",
                text: "Native VLibras-Integration, damit gehörlose Menschen alle Inhalte der Anleitung in Brasilianischer Gebärdensprache erreichen.",
            },
            {
                title: "Screenreader und Vorlesen",
                text: "Vollständige Navigation per Sprache und Audio für Menschen mit Sehbehinderung oder Leseschwierigkeiten.",
            },
            {
                title: "Visueller Komfort",
                text: "Dark Mode, White Mode und hoher Kontrast mit einem Tippen – mit großen, gut lesbaren Texten.",
            },
            {
                title: "Sprachübersetzung",
                text: "Sofortiger Sprachwechsel für Kundinnen, Kunden und Märkte auf der ganzen Welt.",
            },
        ],
    },
    brand: {
        eyebrow: "Über uns",
        title: "Eine neue Art, Informationen zu vermitteln: für die Menschen und für den Planeten.",
        text: "Manual digital ist entstanden, um statische, unübersichtliche Papierbeilagen durch ein interaktives, barrierefreies und nutzerzentriertes Erlebnis zu ersetzen.",
        missionTitle: "Mission",
        missionText:
            "Das Erlebnis nach dem Kauf und bei der Montage von Produkten mit interaktiven, intuitiven und 100 % barrierefreien digitalen Anleitungen zu verändern – und dabei Papierverschwendung und Betriebskosten der Hersteller drastisch zu senken.",
        visionTitle: "Vision",
        visionText:
            "Der weltweite Standard für digitale technische Dokumentation und interaktiven After-Sales-Service zu werden und Konsumgüter, Haushaltsgeräte und Möbel in eine Zukunft ohne unnötiges Papier und mit digitaler Inklusion für alle zu führen.",
        valuesTitle: "Unsere Werte",
        values: [
            {
                title: "Radikale Barrierefreiheit",
                text: "Anleiten heißt einbeziehen: Gebärdensprache, Screenreader, hoher Kontrast, Dark und White Mode und mehrere Sprachen.",
            },
            {
                title: "Messbare Nachhaltigkeit",
                text: "Jeder gescannte QR-Code spart Bäume, Wasser, Energie und Emissionen in der Druckkette.",
            },
            {
                title: "Nutzerzentrierte Innovation",
                text: "3D in 360°, Explosionsansicht, Schritt-für-Schritt-Checklisten und kuratierte Videos.",
            },
            {
                title: "Effizienz und B2B-Partnerschaft",
                text: "Weniger Druck-, Lager- und Versandkosten bei besseren ESG-Kennzahlen.",
            },
            {
                title: "Verantwortungsvoller Wandel",
                text: "Wir reduzieren Papier mit Bedacht, ohne diejenigen auszuschließen, die noch eine gedruckte Version brauchen.",
            },
        ],
        legacyTitle: "Unser Vermächtnis",
        legacyText:
            "Zu beweisen, dass kleine Änderungen bei der Vermittlung von Informationen im großen Maßstab jedes Jahr Tausende Tonnen natürlicher Ressourcen sparen und zugleich technisches Wissen für Millionen Menschen mit Behinderung zugänglich machen.",
        positioningTitle: "Unsere Positionierung",
        positioning: [
            {
                audience: "Für Hersteller und Industrie",
                text: "Wir sind kein PDF-Archiv. Wir sind eine intelligente After-Sales-SaaS-Plattform, die Druckkosten und Umweltbelastungen in erreichte ESG-Ziele, weniger Kundenservice-Anfragen und ein begeisterndes Unboxing verwandelt.",
            },
            {
                audience: "Für alle, die kaufen und montieren",
                text: "Schluss mit dem Frust über unverständliche Anleitungen. Ein visueller, interaktiver 3D-Leitfaden, angepasst an Ihre Bedürfnisse – per QR-Code in Ihrer Hand oder im Browser.",
            },
        ],
    },
    brandBand: {
        aria: "Markenclaim",
        text: "Die Anleitung der Zukunft. Interaktiv für alle, die montieren, barrierefrei für alle, nachhaltig für den Planeten.",
    },
    marquee: {
        title: "Der Markt, den wir verändern wollen: große Hersteller von Elektronik, Haushaltsgeräten und Möbeln",
    },
    sustainability: {
        eyebrow: "Nachhaltigkeit",
        title: "Jeder gescannte QR-Code ist Papier, das nicht im Müll landet.",
        text: "Die Information bleibt im Karton – nur am richtigen Ort: auf dem Handy der Person, die montiert, immer aktuell und ohne Umweltkosten durch den Druck.",
        resources: [
            {
                title: "Weniger gefällte Bäume",
                text: "Anleitungen, die nicht gedruckt werden, verbrauchen keinen neuen Zellstoff.",
            },
            {
                title: "Weniger Wasser",
                text: "Die Papierherstellung gehört zu den Industrien mit dem höchsten Wasserverbrauch.",
            },
            {
                title: "Weniger Energie",
                text: "Ohne Druck, Beschnitt und Weiterverarbeitung spart die Lieferkette Energie.",
            },
            {
                title: "Weniger CO₂ beim Transport",
                text: "Leichtere, kompaktere Kartons senken Gewicht und Logistikemissionen.",
            },
        ],
        transitionTitle: "Verantwortungsvoller Wandel",
        transitionText:
            "Niemand soll ohne Anleitung bleiben. Wir reduzieren Papier mit Bedacht und behalten eine gedruckte Version für alle bei, die noch keinen einfachen Zugang zu Internet oder Smartphone haben.",
    },
    business: {
        eyebrow: "Für Unternehmen",
        title: "Warum entscheiden sich innovative Marken für Manual digital?",
        text: "Eine After-Sales-SaaS-Plattform, die Druckkosten und Umweltbelastungen in Einsparungen, ESG-Kennzahlen und zufriedenere Kundschaft verwandelt.",
        benefits: [
            {
                title: "Geringere Kosten",
                text: "Direkte Einsparungen bei Druck, Papier, Lagerung und Versandgewicht für jede verkaufte Einheit.",
            },
            {
                title: "Echte ESG-Ziele",
                text: "Wirkungsberichte mit eingesparten Tonnen Papier und CO₂ – bereit für die Unternehmensberichterstattung.",
            },
            {
                title: "Aktualisierung in Echtzeit",
                text: "Anleitungen sofort korrigieren oder verbessern, ohne ganze Chargen neu zu drucken.",
            },
            {
                title: "Weniger Kundenservice-Anfragen",
                text: "Klarere Montage senkt Retouren, negative Bewertungen und Rückfragen beim Support.",
            },
        ],
        ctaText: "Finden Sie mit dem Wirkungsrechner heraus, wie viel Ihr Betrieb einsparen kann.",
        ctaPrimary: "Mit Fachleuten sprechen",
        ctaSecondary: "Wirkung berechnen",
    },
    howItWorks: {
        eyebrow: "So funktioniert’s",
        title: "Vom Papier zum QR-Code in drei Schritten.",
        text: "Einfache, schnelle Einführung, ohne die Produktionslinie zu ändern.",
        steps: [
            {
                title: "Übermittlung",
                text: "Ihr Unternehmen sendet die aktuelle Anleitung sowie die technischen und 3D-Dateien des Produkts.",
            },
            {
                title: "Umwandlung",
                text: "Die Plattform macht daraus eine interaktive, barrierefreie 3D-Anleitung mit integrierten Videos.",
            },
            {
                title: "Veröffentlichung",
                text: "Wir erstellen den individuellen QR-Code für die Verpackung und indexieren die Anleitung in der öffentlichen Suche.",
            },
        ],
    },
    catalog: {
        eyebrow: "Für alle, die montieren",
        title: "Entdecken Sie bereits digitalisierte Anleitungen.",
        text: "Wählen Sie eine Kategorie und testen Sie sofort das 3D-Erlebnis und die Barrierefreiheitsfunktionen. Demo-Modelle.",
        filterAria: "Nach Kategorie filtern",
        categories: {
            all: "Alle",
            appliances: "Haushaltsgeräte",
            furniture: "Möbel",
            tools: "Werkzeuge",
            electronics: "Elektronik",
        },
        carouselLabel: "Digitalisierte Anleitungen",
        products: [
            { name: "No-Frost-Kühlschrank 450 L", features: ["3D 360°", "Videos", "Gebärdensprache"] },
            { name: "Waschmaschine 12 kg", features: ["Checkliste", "Vorlesen"] },
            { name: "Kleiderschrank mit 6 Türen", features: ["Explosionsansicht", "Checkliste"] },
            { name: "TV-Möbel R-120", features: ["3D 360°", "Gebärdensprache"] },
            { name: "Akkuschrauber 12 V", features: ["Videos", "Sicherheit"] },
            { name: "Schlagbohrmaschine 650 W", features: ["3D 360°", "Vorlesen"] },
            { name: "55-Zoll-Smart-TV", features: ["Einrichtung", "Gebärdensprache"] },
            { name: "Bluetooth-Lautsprecher", features: ["Videos", "Sprachen"] },
        ],
        openManual: "Anleitung öffnen",
        viewAll: "Alle Anleitungen ansehen",
    },
    contact: {
        eyebrow: "Sprechen Sie mit uns",
        title: "Bereit, Verpackung und After-Sales Ihrer Produkte zu modernisieren?",
        text: "Erzählen Sie uns kurz von Ihrem Betrieb. Unser Team bereitet eine Demo mit einer Anleitung aus Ihrer Produktlinie vor.",
        name: "Name",
        company: "Unternehmen",
        email: "Geschäftliche E-Mail",
        volume: "Ungefähre Anzahl Produkte pro Jahr",
        volumes: [
            "Bis 10.000 Produkte/Jahr",
            "10.000 bis 100.000 Produkte/Jahr",
            "100.000 bis 1 Million Produkte/Jahr",
            "Über 1 Million Produkte/Jahr",
        ],
        submit: "Demo anfragen",
        privacy: "Wir verwenden Ihre Daten nur, um auf diese Anfrage zu antworten.",
        successTitle: "Ihre Nachricht ist angekommen!",
        successText: "Time Nexus meldet sich in Kürze unter der angegebenen E-Mail-Adresse bei Ihnen.",
        sendAnother: "Weitere Nachricht senden",
    },
    footer: {
        tagline: "Die Anleitung der Zukunft. Interaktiv für alle, die montieren, barrierefrei für alle, nachhaltig für den Planeten.",
        navAria: "Links in der Fußzeile",
        columns: [
            {
                title: "Navigation",
                links: ["Das Problem", "Die Lösung", "Nachhaltigkeit", "Über uns"],
            },
            {
                title: "Für Sie",
                links: ["Anleitung suchen", "Digitalisierte Anleitungen", "Barrierefreiheitsfunktionen"],
            },
            {
                title: "Für Unternehmen",
                links: ["Vorteile", "So funktioniert’s", "Wirkungsrechner", "Kontakt"],
            },
        ],
        commitmentTitle: "Verpflichtung zur Barrierefreiheit",
        commitmentText:
            "Wir folgen den WCAG-Richtlinien – mit einer Struktur, die mit Screenreadern, hohem Kontrast, Libras über VLibras und Sprachübersetzung funktioniert. Sind Sie auf eine Barriere gestoßen? Schreiben Sie uns.",
        copyright: "© 2026 Manual digital. Alle Rechte vorbehalten.",
        team: "Entwickelt von Time Nexus: Danilo, Stephany, Thaiza und Bianca.",
    },
    productSearch: {
        title: "Finde die Anleitung zu deinem Produkt",
        text: "Suche nach Name, Modell oder Code oder scanne den QR-Code auf der Verpackung.",
        search: {
            label: "Name, Modell oder Code",
            placeholder: "z. B. Akkuschrauber, GSR 120-LI",
            aria: "Anleitung nach Name, Modell oder Code suchen",
            button: "Suchen",
        },
        filterAria: "Nach Kategorie filtern",
        subcategoryAria: "Nach Produkttyp filtern",
        allSubcategories: "Alle",
        subcategories: {
            refrigerator: "Kühlschränke",
            washer: "Waschmaschinen",
            microwave: "Mikrowellen",
            wardrobe: "Kleiderschränke",
            tvStand: "TV-Möbel",
            desk: "Schreibtische",
            screwdriver: "Akkuschrauber",
            drill: "Bohrmaschinen",
            sander: "Schleifmaschinen",
            tv: "Fernseher",
            speaker: "Lautsprecher",
            headphones: "Kopfhörer",
        },
        resultsAria: "Gefundene Anleitungen",
        countAll: "{count} Anleitungen verfügbar",
        countAllOne: "1 Anleitung verfügbar",
        countQuery: "{count} Ergebnisse für „{query}“",
        countQueryOne: "1 Ergebnis für „{query}“",
        emptyTitle: "Keine Anleitungen für „{query}“ gefunden",
        emptyCategory: "In dieser Kategorie gibt es noch keine Anleitungen",
        emptyText: "Prüfe den Namen oder Code auf dem Etikett oder der Verpackung und versuche es erneut.",
        clear: "Alle Anleitungen anzeigen",
        openManual: "Anleitung öffnen",
        other: "Sonstiges",
        demoNote: "",
        cta: {
            title: "Du bist Hersteller? Digitalisiere die Anleitungen deiner Marke.",
            text: "Weniger Papier, weniger Supportanfragen und eine barrierefreie Anleitung für alle Kunden.",
            button: "Kontakt aufnehmen",
        },
    },
    readAloud: {
        titleReading: "Wird vorgelesen",
        titlePaused: "Vorlesen pausiert",
        titleDone: "Vorlesen beendet",
        titleError: "Vorlesen unterbrochen",
        fab: "Markierten Text vorlesen",
        pause: "Pause",
        resume: "Fortsetzen",
        replay: "Erneut vorlesen",
        close: "Vorlesen schließen",
        missingVoice: "Dieses Gerät hat keine Stimme für diese Sprache. Das Vorlesen kann seltsam klingen.",
        error: "Dieser Text konnte nicht vorgelesen werden.",
    },
    carousel: {
        goTo: "Zu Karte {index} von {total}",
    },
};

export default de;
