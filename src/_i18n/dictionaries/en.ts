import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const en: Dictionary = {
    meta: {
        title: "Manual digital | The manual of the future: interactive, accessible and sustainable",
        description:
            "Replace confusing paper manuals with accessible 3D digital manuals via QR Code. An intuitive guide for whoever assembles the product; lower costs, ESG goals and fewer support tickets for brands.",
    },
    header: {
        homeAria: "Manual digital, back to top",
        navAria: "Page sections",
        nav: ["The problem", "Solution", "Accessibility", "About us", "For business"],
        contact: "Contact us",
        contrast: {
            trigger: "Contrast options",
            group: "Display mode",
            normal: "Default",
            gray: "Grayscale",
            high: "High contrast",
        },
        language: {
            trigger: "Language: {language}. Change language",
            menu: "Choose language",
        },
        libras: {
            open: "Open Libras (Brazilian Sign Language) translation",
            close: "Close Libras translation",
            loading: "Loading Libras translation…",
            error: "VLibras could not be loaded. Check your connection and try again.",
        },
    },
    mobileMenu: {
        open: "Open menu",
        close: "Close menu",
        navAria: "Main menu",
    },
    hero: {
        tag: "The manual of the future",
        titleStart: "Say goodbye to confusing paper manuals. Welcome to the era of the",
        titleHighlight: "3D Digital Manual",
        titleEnd: ".",
        text: "We turn static instructions into interactive 360° experiences, 100% accessible and sustainable, straight from the QR Code on the box to the palm of your hand.",
        searchLabel: "Already have a product? Find its manual now",
        searchPlaceholder: "Product name, model or code",
        searchAria: "Search manuals by product name, model or code",
        searchButton: "Search manual",
        b2bText: "Are you a manufacturer or brand?",
        b2bButton: "Digitize my company's manuals",
        highlights: ["QR Code on the packaging", "360° 3D view", "Sign language and read-aloud"],
        mascotAlt: "Lucca, the Manual digital guide owl, wearing a safety helmet",
        badge3d: "3D 360°",
        badgeEco: "Zero unnecessary paper",
    },
    problem: {
        eyebrow: "The problem",
        title: "The hidden cost of paper in industry.",
        text: "Printed manuals make logistics more expensive, create waste and are usually thrown away or forgotten. And whoever has to assemble the product is still left without help.",
        industryTitle: "For industry",
        stats: [
            {
                value: "4,741 t",
                label: "of paper per year",
                text: "estimated in basic manuals from just four giants: Whirlpool, Electrolux, Samsung and Apple.",
            },
            {
                value: "80 g",
                label: "per manual",
                text: "is the average weight of a single home-appliance manual, multiplied by millions of boxes.",
            },
            {
                value: "13,152",
                label: "reams of 500 sheets",
                text: "per year in a single consumer-goods scenario, with 1.6 million printed manuals.",
            },
        ],
        usersTitle: "For whoever assembles it",
        pains: [
            "Tiny print and drawings that confuse more than they explain.",
            "Manuals lost, torn or thrown away with the box.",
            "No support for people with visual or hearing impairments or reading difficulties.",
            "Only one language, no video and no way to see the part from another angle.",
        ],
        note: "Illustrative estimates from the Time Nexus study, based on 2025 annual reports and assuming 75 g/m² paper in A5 format. They do not represent internal data from the companies mentioned.",
    },
    calculator: {
        eyebrow: "Impact calculator",
        title: "How much paper could your company stop printing?",
        text: "Enter how many products you sell per year and see, using our research assumptions, the impact of switching to Manual digital.",
        productsLabel: "Products sold per year",
        manualTypeLabel: "Manual type",
        manualTypes: [
            "Home appliance (34 pages, 80 g)",
            "Compact manual (16 pages, 18.72 g)",
            "Smartphone (leaflet, 1.5 g)",
        ],
        shareLabel: "Products currently shipped with a printed manual",
        shares: ["70% of products", "80% of products", "90% of products"],
        resultsTitle: "{count} fewer printed manuals per year means:",
        results: ["less paper per year", "equivalent A4 sheets", "reams of 500 sheets"],
        note: "Assumptions: 75 g/m² paper, 4.68 g A4 sheet and manuals from 18.72 g to 80 g, according to the Time Nexus study. Covers, printing waste and shipping not included.",
    },
    solution: {
        eyebrow: "The solution",
        title: "Far beyond a PDF: a guided experience.",
        text: "Manual digital turns the booklet in the box into a visual, interactive and always up-to-date guide. Try it here: rotate the part and tick off the steps.",
        features: [
            {
                title: "360° 3D view",
                text: "Rotate, zoom in and see every part in an exploded view. No more guessing from a drawing.",
            },
            {
                title: "Smart step-by-step",
                text: "Interactive assembly checklists and detailed information on every part, at your own pace.",
            },
            {
                title: "Video hub",
                text: "The best videos about the product, gathered and organized inside the manual itself.",
            },
            {
                title: "Hybrid access",
                text: "Point your camera at the QR Code on the box or search for the model right on the website.",
            },
        ],
        demo: {
            product: "TV stand · Model R-120",
            step: "Step {current} of {total}",
            cubeSpinning: "Part rotating 360 degrees",
            cubeExploded: "Part in exploded view",
            explode: "See exploded view",
            assemble: "Assemble part",
            progress: "Assembly progress",
            steps: ["Separate parts A, B and C", "Fit the side panel onto the base", "Fasten with 4 M6 screws"],
        },
    },
    accessibility: {
        eyebrow: "100% accessible",
        title: "Technology made for everyone.",
        text: "No consumer should be left behind because of sensory, language or cognitive barriers. Accessibility is not an extra: it is the starting point.",
        quote: "“To instruct is to include.”",
        quoteHint: "Try it now: use the contrast, language and sign language buttons at the top of the page.",
        carouselLabel: "Accessibility features",
        features: [
            {
                title: "Libras translation",
                text: "Native VLibras integration so deaf people can access all manual content in Brazilian Sign Language.",
            },
            {
                title: "Screen reader and read-aloud",
                text: "Full voice and audio navigation for people with low vision or reading difficulties.",
            },
            {
                title: "Visual comfort",
                text: "Dark Mode, White Mode and High Contrast in one tap, with large, legible text.",
            },
            {
                title: "Language translation",
                text: "Instant language switching to serve consumers and markets around the world.",
            },
        ],
    },
    brand: {
        eyebrow: "About us",
        title: "A new way to deliver information: for people and for the planet.",
        text: "Manual digital was created to replace static, confusing printed leaflets with an interactive, accessible experience centered on the people who use it.",
        missionTitle: "Mission",
        missionText:
            "To transform the post-purchase and product assembly experience with interactive, intuitive and 100% accessible digital manuals, drastically reducing paper waste and manufacturers' operating costs.",
        visionTitle: "Vision",
        visionText:
            "To become the global standard for interactive digital technical documentation and after-sales, leading consumer goods, home appliances and furniture toward the end of unnecessary paper and universal digital inclusion.",
        valuesTitle: "Our values",
        values: [
            {
                title: "Radical accessibility",
                text: "To instruct is to include: sign language, screen readers, high contrast, Dark and White Mode and multiple languages.",
            },
            {
                title: "Measurable sustainability",
                text: "Every scanned QR Code saves trees, water, energy and emissions in the printing chain.",
            },
            {
                title: "User-centered innovation",
                text: "360° 3D, exploded views, step-by-step checklists and curated videos.",
            },
            {
                title: "B2B efficiency and partnership",
                text: "Lower printing, storage and shipping costs, with stronger ESG indicators.",
            },
            {
                title: "Responsible transition",
                text: "We reduce paper intelligently, without excluding those who still need printed support.",
            },
        ],
        legacyTitle: "Our legacy",
        legacyText:
            "To prove that small changes in how we deliver information at scale save thousands of tonnes of natural resources every year, while making technical knowledge accessible to millions of people with disabilities.",
        positioningTitle: "Our positioning",
        positioning: [
            {
                audience: "For manufacturers and industry",
                text: "We are not a PDF repository. We are a smart after-sales SaaS platform that turns printing costs and environmental liabilities into achieved ESG goals, fewer support tickets and a delightful unboxing.",
            },
            {
                audience: "For those who buy and assemble",
                text: "The end of frustration with confusing manuals. A visual, interactive 3D guide adapted to your needs, in the palm of your hand via QR Code or in your browser.",
            },
        ],
    },
    brandBand: {
        aria: "Brand signature",
        text: "The manual of the future. Interactive for whoever assembles, accessible for everyone, sustainable for the planet.",
    },
    marquee: {
        title: "The market we want to transform: major electronics, home appliance and furniture manufacturers",
    },
    sustainability: {
        eyebrow: "Sustainability",
        title: "Every scanned QR Code is paper that never becomes waste.",
        text: "The information is still in the box, just in the right place: on the phone of whoever is assembling, always up to date and with no environmental cost of printing.",
        resources: [
            {
                title: "Fewer trees cut down",
                text: "Manuals that are not printed no longer consume new pulp.",
            },
            {
                title: "Less water",
                text: "Papermaking is one of the most water-intensive industries.",
            },
            {
                title: "Less energy",
                text: "No printing, trimming or finishing means energy saved across the production chain.",
            },
            {
                title: "Lower shipping emissions",
                text: "Lighter, more compact boxes reduce weight and logistics emissions.",
            },
        ],
        transitionTitle: "Responsible transition",
        transitionText:
            "We don't want to leave anyone without instructions. We reduce paper intelligently and keep a printed version for those who still lack easy access to the internet or a smartphone.",
    },
    business: {
        eyebrow: "For business",
        title: "Why do innovative brands choose Manual digital?",
        text: "An after-sales SaaS platform that turns printing costs and environmental liabilities into savings, ESG indicators and happier customers.",
        benefits: [
            {
                title: "Lower costs",
                text: "Direct savings on printing, paper, storage and shipping weight for every unit sold.",
            },
            {
                title: "Real ESG goals",
                text: "Impact reports with tonnes of paper and CO₂ saved, ready for your corporate reporting.",
            },
            {
                title: "Real-time updates",
                text: "Fix instructions or add improvements instantly, without reprinting entire batches.",
            },
            {
                title: "Fewer support tickets",
                text: "Clearer assembly reduces returns, negative reviews and support questions.",
            },
        ],
        ctaText: "Find out how much your operation could save with the impact calculator.",
        ctaPrimary: "Talk to a specialist",
        ctaSecondary: "Calculate impact",
    },
    howItWorks: {
        eyebrow: "How it works",
        title: "From paper to QR Code in three steps.",
        text: "Simple, fast implementation, without changing your production line.",
        steps: [
            {
                title: "Upload",
                text: "Your company sends its current manual and the product's technical and 3D files.",
            },
            {
                title: "Transformation",
                text: "The platform converts the material into an interactive, accessible 3D manual with built-in videos.",
            },
            {
                title: "Publishing",
                text: "We generate a unique QR Code for the packaging and index the manual in the public search.",
            },
        ],
    },
    catalog: {
        eyebrow: "For whoever assembles",
        title: "Explore manuals that are already digital.",
        text: "Pick a category and try the 3D experience and accessibility features right away. Demo models.",
        filterAria: "Filter by category",
        categories: {
            all: "All",
            appliances: "Home appliances",
            furniture: "Furniture",
            tools: "Tools",
            electronics: "Electronics",
        },
        carouselLabel: "Digital manuals",
        products: [
            { name: "Frost-free refrigerator 450 L", features: ["3D 360°", "Videos", "Sign language"] },
            { name: "Washing machine 12 kg", features: ["Checklist", "Read-aloud"] },
            { name: "6-door wardrobe", features: ["Exploded view", "Checklist"] },
            { name: "TV stand R-120", features: ["3D 360°", "Sign language"] },
            { name: "Cordless screwdriver 12 V", features: ["Videos", "Safety"] },
            { name: "Impact drill 650 W", features: ["3D 360°", "Read-aloud"] },
            { name: "55-inch Smart TV", features: ["Setup", "Sign language"] },
            { name: "Bluetooth speaker", features: ["Videos", "Languages"] },
        ],
        openManual: "Open manual",
        viewAll: "See all manuals",
    },
    contact: {
        eyebrow: "Get in touch",
        title: "Ready to modernize your products' packaging and after-sales?",
        text: "Tell us a little about your operation. Our team will prepare a demo with a manual from your product line.",
        name: "Name",
        company: "Company",
        email: "Business email",
        volume: "Approximate number of products per year",
        volumes: [
            "Up to 10,000 products/year",
            "10,000 to 100,000 products/year",
            "100,000 to 1 million products/year",
            "Over 1 million products/year",
        ],
        submit: "Request a demo",
        privacy: "We only use your data to reply to this request.",
        successTitle: "We've received your message!",
        successText: "Time Nexus will get back to you soon at the email you provided.",
        sendAnother: "Send another message",
    },
    footer: {
        tagline: "The manual of the future. Interactive for whoever assembles, accessible for everyone, sustainable for the planet.",
        navAria: "Footer links",
        columns: [
            {
                title: "Navigation",
                links: ["The problem", "The solution", "Sustainability", "About us"],
            },
            {
                title: "For you",
                links: ["Search for a manual", "Digital manuals", "Accessibility features"],
            },
            {
                title: "For business",
                links: ["Benefits", "How it works", "Impact calculator", "Contact us"],
            },
        ],
        commitmentTitle: "Accessibility commitment",
        commitmentText:
            "We follow the WCAG guidelines, with a structure compatible with screen readers, high contrast, Libras via VLibras and language translation. Found a barrier? Let us know.",
        copyright: "© 2026 Manual digital. All rights reserved.",
        team: "Made by Time Nexus: Danilo, Stephany, Thaiza and Bianca.",
    },
    carousel: {
        goTo: "Go to card {index} of {total}",
    },
};

export default en;
