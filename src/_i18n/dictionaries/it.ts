import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const it: Dictionary = {
    meta: {
        title: "Manual digital | Il manuale del futuro: interattivo, accessibile e sostenibile",
        description:
            "Sostituisci i confusi manuali cartacei con manuali digitali in 3D, accessibili tramite codice QR. Una guida intuitiva per chi monta; meno costi, obiettivi ESG e meno richieste all'assistenza clienti per i brand.",
    },
    header: {
        homeAria: "Manual digital, torna all'inizio",
        navAria: "Sezioni della pagina",
        nav: ["Il problema", "Soluzione", "Accessibilità", "Chi siamo", "Per le aziende"],
        contact: "Contattaci",
        contrast: {
            trigger: "Opzioni di contrasto",
            group: "Modalità di visualizzazione",
            normal: "Predefinito",
            gray: "Scala di grigi",
            high: "Contrasto elevato",
        },
        language: {
            trigger: "Lingua: {language}. Cambia lingua",
            menu: "Scegli la lingua",
        },
        libras: {
            open: "Apri la traduzione in Libras (lingua dei segni brasiliana)",
            close: "Chiudi la traduzione in Libras",
            loading: "Caricamento della traduzione in Libras…",
            error: "Impossibile caricare VLibras. Controlla la connessione e riprova.",
        },
    },
    productHeader: {
        homeAria: "Manuale digitale, vedi tutti i prodotti",
        menu: {
            open: "Apri menu",
            title: "Menu",
            close: "Chiudi menu",
            search: "Cerca",
            searchAria: "Cerca nel menu",
            navAria: "Menu principale",
            groupProduct: "In questo prodotto",
            groupGeneral: "Generale",
            home: "Inizio",
            manual: "Manuale",
            information: "Informazioni",
            assembly: "Montaggio",
            allProducts: "Tutti i prodotti",
            empty: "Nessun risultato per “{query}”. Prova un'altra parola.",
        },
    },
    mobileMenu: {
        open: "Apri il menu",
        close: "Chiudi il menu",
        navAria: "Menu principale",
    },
    hero: {
        tag: "Il manuale del futuro",
        titleStart: "Di' addio ai confusi manuali cartacei. Benvenuto nell'era del",
        titleHighlight: "Manuale Digitale 3D",
        titleEnd: ".",
        text: "Trasformiamo istruzioni statiche in esperienze interattive a 360°, accessibili al 100% e sostenibili, direttamente dal codice QR della scatola al palmo della tua mano.",
        searchLabel: "Hai già un prodotto? Trova subito il suo manuale",
        searchPlaceholder: "Nome, modello o codice del prodotto",
        searchAria: "Cerca un manuale per nome, modello o codice del prodotto",
        searchButton: "Cerca manuale",
        b2bText: "Sei un produttore o un brand?",
        b2bButton: "Digitalizzare i manuali della mia azienda",
        highlights: ["Codice QR sulla confezione", "Vista 3D a 360°", "Lingua dei segni e lettura ad alta voce"],
        mascotAlt: "Lucca, il gufo guida di Manual digital, con il casco di sicurezza",
        badge3d: "3D 360°",
        badgeEco: "Zero carta superflua",
    },
    problem: {
        eyebrow: "Il problema",
        title: "Il costo invisibile della carta nell'industria.",
        text: "Il manuale stampato rende la logistica più costosa, genera rifiuti e il più delle volte finisce buttato o dimenticato. E chi deve montare il prodotto resta comunque senza aiuto.",
        industryTitle: "Per l'industria",
        stats: [
            {
                value: "4.741 t",
                label: "di carta all'anno",
                text: "stimate solo per i manuali di base di quattro colossi: Whirlpool, Electrolux, Samsung e Apple.",
            },
            {
                value: "80 g",
                label: "per manuale",
                text: "è il peso medio di un singolo manuale di elettrodomestico, moltiplicato per milioni di scatole.",
            },
            {
                value: "13.152",
                label: "risme da 500 fogli",
                text: "all'anno in un solo scenario di beni di consumo, con 1,6 milioni di manuali stampati.",
            },
        ],
        usersTitle: "Per chi monta",
        pains: [
            "Caratteri minuscoli e disegni che confondono più di quanto spieghino.",
            "Manuale perso, strappato o buttato insieme alla scatola.",
            "Nessun supporto per persone con disabilità visive, uditive o difficoltà di lettura.",
            "Una sola lingua, nessun video e nessun modo di vedere il pezzo da un'altra angolazione.",
        ],
        note: "Stime illustrative dello studio del Time Nexus, basate sui bilanci annuali 2025 e sull'ipotesi di carta da 75 g/m² in formato A5. Non rappresentano dati interni delle aziende citate.",
    },
    calculator: {
        eyebrow: "Calcolatore di impatto",
        title: "Quanta carta potrebbe smettere di stampare la tua azienda?",
        text: "Indica quanti prodotti vendi all'anno e scopri, con le ipotesi della nostra ricerca, l'impatto del passaggio a Manual digital.",
        productsLabel: "Prodotti venduti all'anno",
        manualTypeLabel: "Tipo di manuale",
        manualTypes: [
            "Elettrodomestico (34 pagine, 80 g)",
            "Manuale compatto (16 pagine, 18,72 g)",
            "Smartphone (pieghevole, 1,5 g)",
        ],
        shareLabel: "Prodotti che oggi includono un manuale stampato",
        shares: ["70% dei prodotti", "80% dei prodotti", "90% dei prodotti"],
        resultsTitle: "{count} manuali stampati in meno all'anno significano:",
        results: ["di carta in meno all'anno", "fogli A4 equivalenti", "risme da 500 fogli"],
        note: "Ipotesi: carta da 75 g/m², foglio A4 da 4,68 g e manuali da 18,72 g a 80 g, secondo lo studio del Time Nexus. Esclusi copertina, scarti di stampa e trasporto.",
    },
    solution: {
        eyebrow: "La soluzione",
        title: "Molto più di un PDF: un'esperienza guidata.",
        text: "Manual digital trasforma il libretto nella scatola in una guida visiva, interattiva e sempre aggiornata. Provalo qui: ruota il pezzo e spunta i passaggi.",
        features: [
            {
                title: "Vista 3D a 360°",
                text: "Ruota, ingrandisci e guarda ogni pezzo in vista esplosa. Basta tirare a indovinare dal disegno.",
            },
            {
                title: "Passo dopo passo intelligente",
                text: "Checklist di montaggio interattive e informazioni dettagliate su ogni pezzo, al tuo ritmo.",
            },
            {
                title: "Centro video",
                text: "I migliori video sul prodotto, raccolti e organizzati all'interno del manuale stesso.",
            },
            {
                title: "Accesso ibrido",
                text: "Inquadra il codice QR della scatola con la fotocamera o cerca il modello direttamente sul sito.",
            },
        ],
        demo: {
            product: "Mobile TV · Modello R-120",
            step: "Passaggio {current} di {total}",
            cubeSpinning: "Pezzo in rotazione a 360 gradi",
            cubeExploded: "Pezzo in vista esplosa",
            explode: "Mostra vista esplosa",
            assemble: "Assembla il pezzo",
            progress: "Avanzamento del montaggio",
            steps: ["Separa i pezzi A, B e C", "Incastra il fianco sulla base", "Fissa con 4 viti M6"],
        },
    },
    accessibility: {
        eyebrow: "Accessibilità al 100%",
        title: "Tecnologia pensata per tutte le persone.",
        text: "Nessun consumatore dovrebbe restare indietro a causa di barriere sensoriali, linguistiche o cognitive. L'accessibilità non è un extra: è il punto di partenza.",
        quote: "«Istruire è includere.»",
        quoteHint: "Provalo subito: usa i pulsanti di contrasto, lingua e lingua dei segni in cima alla pagina.",
        carouselLabel: "Funzioni di accessibilità",
        features: [
            {
                title: "Traduzione in Libras",
                text: "Integrazione nativa con VLibras per includere le persone sorde in tutto il contenuto del manuale, nella lingua dei segni brasiliana.",
            },
            {
                title: "Screen reader e lettura ad alta voce",
                text: "Navigazione completa tramite voce e audio per persone ipovedenti o con difficoltà di lettura.",
            },
            {
                title: "Comfort visivo",
                text: "Modalità scura, modalità chiara e contrasto elevato con un tocco, con testi grandi e leggibili.",
            },
            {
                title: "Traduzione della lingua",
                text: "Cambio di lingua istantaneo per servire consumatori e mercati di tutto il mondo.",
            },
        ],
    },
    brand: {
        eyebrow: "Chi siamo",
        title: "Un nuovo modo di trasmettere le informazioni: per le persone e per il pianeta.",
        text: "Manual digital nasce per sostituire foglietti stampati, statici e confusi con un'esperienza interattiva, accessibile e centrata su chi la usa.",
        missionTitle: "Missione",
        missionText:
            "Trasformare l'esperienza post-acquisto e di montaggio dei prodotti con manuali digitali interattivi, intuitivi e accessibili al 100%, riducendo drasticamente lo spreco di carta e i costi operativi dell'industria.",
        visionTitle: "Visione",
        visionText:
            "Diventare lo standard globale della documentazione tecnica digitale e del post-vendita interattivo, guidando beni di consumo, elettrodomestici e arredamento verso la fine della carta superflua e l'inclusione digitale universale.",
        valuesTitle: "I nostri valori",
        values: [
            {
                title: "Accessibilità radicale",
                text: "Istruire è includere: lingua dei segni, screen reader, contrasto elevato, modalità scura e chiara e più lingue.",
            },
            {
                title: "Sostenibilità misurabile",
                text: "Ogni codice QR scansionato risparmia alberi, acqua, energia ed emissioni nella filiera di stampa.",
            },
            {
                title: "Innovazione centrata sull'utente",
                text: "3D a 360°, vista esplosa, checklist passo dopo passo e video selezionati.",
            },
            {
                title: "Efficienza e partnership B2B",
                text: "Meno costi di stampa, stoccaggio e trasporto, con indicatori ESG più solidi.",
            },
            {
                title: "Transizione responsabile",
                text: "Riduciamo la carta con intelligenza, senza escludere chi ha ancora bisogno del supporto stampato.",
            },
        ],
        legacyTitle: "La nostra eredità",
        legacyText:
            "Dimostrare che piccoli cambiamenti nel modo di trasmettere le informazioni su larga scala fanno risparmiare ogni anno migliaia di tonnellate di risorse naturali, rendendo al contempo le conoscenze tecniche accessibili a milioni di persone con disabilità.",
        positioningTitle: "Il nostro posizionamento",
        positioning: [
            {
                audience: "Per produttori e industria",
                text: "Non siamo un archivio di PDF. Siamo una piattaforma SaaS di post-vendita intelligente che trasforma i costi di stampa e le passività ambientali in obiettivi ESG raggiunti, meno richieste all'assistenza e un unboxing che conquista.",
            },
            {
                audience: "Per chi acquista e monta",
                text: "Basta frustrazione con manuali confusi. Una guida visiva, interattiva, in 3D e adattata alle tue esigenze, nel palmo della tua mano tramite codice QR o nel browser.",
            },
        ],
    },
    brandBand: {
        aria: "Firma del brand",
        text: "Il manuale del futuro. Interattivo per chi monta, accessibile a tutti, sostenibile per il pianeta.",
    },
    marquee: {
        title: "Il mercato che vogliamo trasformare: i grandi produttori di elettronica, elettrodomestici e mobili",
    },
    sustainability: {
        eyebrow: "Sostenibilità",
        title: "Ogni codice QR scansionato è carta che non diventa rifiuto.",
        text: "L'informazione resta nella scatola, ma nel posto giusto: sullo smartphone di chi monta, sempre aggiornata e senza costo ambientale di stampa.",
        resources: [
            {
                title: "Meno alberi abbattuti",
                text: "I manuali che non vengono stampati non consumano nuova cellulosa.",
            },
            {
                title: "Meno acqua",
                text: "La produzione della carta è una delle industrie che consumano più acqua.",
            },
            {
                title: "Meno energia",
                text: "Senza tipografia, rifilatura e finitura, la filiera produttiva risparmia energia.",
            },
            {
                title: "Meno CO₂ nel trasporto",
                text: "Scatole più leggere e compatte riducono il peso e le emissioni logistiche.",
            },
        ],
        transitionTitle: "Transizione responsabile",
        transitionText:
            "Non vogliamo lasciare nessuno senza istruzioni. Riduciamo la carta con intelligenza e manteniamo la versione stampata per chi non ha ancora un accesso facile a internet o a uno smartphone.",
    },
    business: {
        eyebrow: "Per le aziende",
        title: "Perché i brand innovativi scelgono Manual digital?",
        text: "Una piattaforma SaaS di post-vendita che trasforma costi di stampa e passività ambientali in risparmi, indicatori ESG e clienti più soddisfatti.",
        benefits: [
            {
                title: "Riduzione dei costi",
                text: "Risparmio diretto su stampa, carta, stoccaggio e peso di spedizione per ogni unità venduta.",
            },
            {
                title: "Obiettivi ESG concreti",
                text: "Report di impatto con le tonnellate di carta e di CO₂ risparmiate, pronti per il bilancio aziendale.",
            },
            {
                title: "Aggiornamento in tempo reale",
                text: "Correggi le istruzioni o aggiungi miglioramenti all'istante, senza ristampare interi lotti.",
            },
            {
                title: "Meno richieste all'assistenza",
                text: "Montaggi più chiari riducono resi, recensioni negative e dubbi all'assistenza.",
            },
        ],
        ctaText: "Scopri quanto può risparmiare la tua attività con il calcolatore di impatto.",
        ctaPrimary: "Parla con un esperto",
        ctaSecondary: "Calcola l'impatto",
    },
    howItWorks: {
        eyebrow: "Come funziona",
        title: "Dalla carta al codice QR in tre passaggi.",
        text: "Implementazione semplice e rapida, senza modificare la linea di produzione.",
        steps: [
            {
                title: "Invio",
                text: "La tua azienda invia il manuale attuale e i file tecnici e 3D del prodotto.",
            },
            {
                title: "Trasformazione",
                text: "La piattaforma converte il materiale in un manuale 3D interattivo, accessibile e con video integrati.",
            },
            {
                title: "Pubblicazione",
                text: "Generiamo il codice QR esclusivo per la confezione e indicizziamo il manuale nel motore di ricerca pubblico.",
            },
        ],
    },
    catalog: {
        eyebrow: "Per chi monta",
        title: "Esplora i manuali già digitalizzati.",
        text: "Scegli una categoria e prova subito l'esperienza 3D e le funzioni di accessibilità. Modelli dimostrativi.",
        filterAria: "Filtra per categoria",
        categories: {
            all: "Tutti",
            appliances: "Elettrodomestici",
            furniture: "Mobili",
            tools: "Utensili",
            electronics: "Elettronica",
        },
        carouselLabel: "Manuali digitalizzati",
        products: [
            { name: "Frigorifero No Frost 450 L", features: ["3D 360°", "Video", "Lingua dei segni"] },
            { name: "Lavatrice 12 kg", features: ["Checklist", "Lettura ad alta voce"] },
            { name: "Armadio a 6 ante", features: ["Vista esplosa", "Checklist"] },
            { name: "Mobile TV R-120", features: ["3D 360°", "Lingua dei segni"] },
            { name: "Avvitatore 12 V", features: ["Video", "Sicurezza"] },
            { name: "Trapano a percussione 650 W", features: ["3D 360°", "Lettura ad alta voce"] },
            { name: "Smart TV da 55 pollici", features: ["Configurazione", "Lingua dei segni"] },
            { name: "Cassa Bluetooth", features: ["Video", "Lingue"] },
        ],
        openManual: "Apri il manuale",
        viewAll: "Vedi tutti i manuali",
    },
    contact: {
        eyebrow: "Parliamone",
        title: "Pronto a modernizzare la confezione e il post-vendita dei tuoi prodotti?",
        text: "Raccontaci qualcosa della tua attività. Il nostro team preparerà una demo con un manuale della tua linea di prodotti.",
        name: "Nome",
        company: "Azienda",
        email: "E-mail aziendale",
        volume: "Volume approssimativo di prodotti all'anno",
        volumes: [
            "Fino a 10.000 prodotti/anno",
            "Da 10.000 a 100.000 prodotti/anno",
            "Da 100.000 a 1 milione di prodotti/anno",
            "Oltre 1 milione di prodotti/anno",
        ],
        submit: "Richiedi una demo",
        privacy: "Utilizziamo i tuoi dati solo per rispondere a questa richiesta.",
        successTitle: "Abbiamo ricevuto il tuo messaggio!",
        successText: "Il Time Nexus ti risponderà a breve all'indirizzo e-mail indicato.",
        sendAnother: "Invia un altro messaggio",
    },
    footer: {
        tagline: "Il manuale del futuro. Interattivo per chi monta, accessibile a tutti, sostenibile per il pianeta.",
        navAria: "Link del piè di pagina",
        columns: [
            {
                title: "Navigazione",
                links: ["Il problema", "La soluzione", "Sostenibilità", "Chi siamo"],
            },
            {
                title: "Per te",
                links: ["Cerca un manuale", "Manuali digitalizzati", "Funzioni di accessibilità"],
            },
            {
                title: "Per le aziende",
                links: ["Vantaggi", "Come funziona", "Calcolatore di impatto", "Contattaci"],
            },
        ],
        commitmentTitle: "Impegno per l'accessibilità",
        commitmentText:
            "Seguiamo le linee guida WCAG, con una struttura compatibile con screen reader, contrasto elevato, Libras tramite VLibras e traduzione della lingua. Hai incontrato una barriera? Scrivici.",
        copyright: "© 2026 Manual digital. Tutti i diritti riservati.",
        team: "Realizzato dal Time Nexus: Danilo, Stephany, Thaiza e Bianca.",
    },
    readAloud: {
        titleReading: "Lettura ad alta voce",
        titlePaused: "Lettura in pausa",
        titleDone: "Lettura terminata",
        titleError: "Lettura interrotta",
        fab: "Leggi ad alta voce il testo selezionato",
        pause: "Pausa",
        resume: "Riprendi",
        replay: "Rileggi",
        close: "Chiudi lettura",
        missingVoice: "Questo dispositivo non ha una voce in questa lingua. La lettura potrebbe suonare strana.",
        error: "Impossibile leggere questo testo.",
    },
    carousel: {
        goTo: "Vai alla scheda {index} di {total}",
    },
};

export default it;
