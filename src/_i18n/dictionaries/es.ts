import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const es: Dictionary = {
    meta: {
        title: "Manual digital | El manual del futuro: interactivo, accesible y sostenible",
        description:
            "Sustituye los confusos manuales en papel por manuales digitales en 3D, accesibles y por código QR. Una guía intuitiva para quien monta; menos costes, metas ESG y menos consultas al servicio de atención para las marcas.",
    },
    header: {
        homeAria: "Manual digital, volver al inicio",
        navAria: "Secciones de la página",
        nav: ["El problema", "Solución", "Accesibilidad", "Quiénes somos", "Para empresas"],
        contact: "Contáctanos",
        contrast: {
            trigger: "Opciones de contraste",
            group: "Modo de visualización",
            normal: "Predeterminado",
            gray: "Escala de grises",
            high: "Alto contraste",
        },
        language: {
            trigger: "Idioma: {language}. Cambiar idioma",
            menu: "Elegir idioma",
        },
        libras: {
            open: "Abrir traducción a Libras (lengua de señas brasileña)",
            close: "Cerrar traducción a Libras",
            loading: "Cargando la traducción a Libras…",
            error: "No se pudo cargar VLibras. Comprueba la conexión e inténtalo de nuevo.",
        },
    },
    mobileMenu: {
        open: "Abrir menú",
        close: "Cerrar menú",
        navAria: "Menú principal",
    },
    hero: {
        tag: "El manual del futuro",
        titleStart: "Di adiós a los confusos manuales en papel. Bienvenido a la era del",
        titleHighlight: "Manual Digital 3D",
        titleEnd: ".",
        text: "Transformamos instrucciones estáticas en experiencias interactivas en 360°, 100 % accesibles y sostenibles, directamente del código QR de la caja a la palma de tu mano.",
        searchLabel: "¿Ya tienes un producto? Encuentra su manual ahora",
        searchPlaceholder: "Nombre, modelo o código del producto",
        searchAria: "Buscar manual por nombre, modelo o código del producto",
        searchButton: "Buscar manual",
        b2bText: "¿Eres fabricante o marca?",
        b2bButton: "Digitalizar los manuales de mi empresa",
        highlights: ["Código QR en el embalaje", "Visualización 3D en 360°", "Lengua de señas y lectura en voz alta"],
        mascotAlt: "Lucca, la lechuza guía de Manual digital, con casco de seguridad",
        badge3d: "3D 360°",
        badgeEco: "Cero papel innecesario",
    },
    problem: {
        eyebrow: "El problema",
        title: "El coste invisible del papel en la industria.",
        text: "El manual impreso encarece la logística, genera residuos y, la mayoría de las veces, acaba desechado u olvidado. Y quien necesita montar el producto sigue sin ayuda.",
        industryTitle: "Para la industria",
        stats: [
            {
                value: "4741 t",
                label: "de papel al año",
                text: "estimadas solo en manuales básicos de cuatro gigantes: Whirlpool, Electrolux, Samsung y Apple.",
            },
            {
                value: "80 g",
                label: "por manual",
                text: "es el peso medio de un solo manual de electrodoméstico, multiplicado por millones de cajas.",
            },
            {
                value: "13 152",
                label: "resmas de 500 hojas",
                text: "al año en un único escenario de bienes de consumo, con 1,6 millones de manuales impresos.",
            },
        ],
        usersTitle: "Para quien monta",
        pains: [
            "Letra diminuta y dibujos que confunden más de lo que explican.",
            "Manual perdido, roto o tirado a la basura junto con la caja.",
            "Ningún recurso para personas con discapacidad visual, auditiva o dificultades de lectura.",
            "Un solo idioma, sin vídeo y sin forma de ver la pieza desde otro ángulo.",
        ],
        note: "Estimaciones ilustrativas del estudio de Time Nexus, basadas en informes anuales de 2025 y en la premisa de papel de 75 g/m² en formato A5. No representan datos internos de las empresas citadas.",
    },
    calculator: {
        eyebrow: "Calculadora de impacto",
        title: "¿Cuánto papel dejaría de imprimir tu empresa?",
        text: "Indica cuántos productos vendes al año y descubre, con las premisas de nuestra investigación, el impacto de pasarte a Manual digital.",
        productsLabel: "Productos vendidos al año",
        manualTypeLabel: "Tipo de manual",
        manualTypes: [
            "Electrodoméstico (34 páginas, 80 g)",
            "Manual compacto (16 páginas, 18,72 g)",
            "Smartphone (folleto, 1,5 g)",
        ],
        shareLabel: "Productos que hoy incluyen manual impreso",
        shares: ["70 % de los productos", "80 % de los productos", "90 % de los productos"],
        resultsTitle: "{count} manuales impresos menos al año significan:",
        results: ["menos de papel al año", "hojas A4 equivalentes", "resmas de 500 hojas"],
        note: "Premisas: papel de 75 g/m², hoja A4 de 4,68 g y manual de 18,72 g a 80 g, según el estudio de Time Nexus. Sin contar portada, mermas de impresión ni transporte.",
    },
    solution: {
        eyebrow: "La solución",
        title: "Mucho más que un PDF: una experiencia guiada.",
        text: "Manual digital convierte el folleto de la caja en una guía visual, interactiva y siempre actualizada. Pruébalo aquí: gira la pieza y marca los pasos.",
        features: [
            {
                title: "Visualización 3D en 360°",
                text: "Gira, acerca y mira cada pieza en vista explosionada. Se acabó adivinar a partir del dibujo.",
            },
            {
                title: "Paso a paso inteligente",
                text: "Listas de montaje interactivas e información detallada de cada pieza, a tu ritmo.",
            },
            {
                title: "Centro de vídeos",
                text: "Los mejores vídeos sobre el producto, reunidos y organizados dentro del propio manual.",
            },
            {
                title: "Acceso híbrido",
                text: "Apunta la cámara al código QR de la caja o busca el modelo directamente en el sitio web.",
            },
        ],
        demo: {
            product: "Mueble para TV · Modelo R-120",
            step: "Paso {current} de {total}",
            cubeSpinning: "Pieza girando 360 grados",
            cubeExploded: "Pieza en vista explosionada",
            explode: "Ver vista explosionada",
            assemble: "Montar pieza",
            progress: "Progreso del montaje",
            steps: ["Separa las piezas A, B y C", "Encaja el lateral en la base", "Fija con 4 tornillos M6"],
        },
    },
    accessibility: {
        eyebrow: "Accesibilidad 100 %",
        title: "Tecnología hecha para todas las personas.",
        text: "Ningún consumidor debería quedarse atrás por barreras sensoriales, lingüísticas o cognitivas. La accesibilidad no es un extra: es el punto de partida.",
        quote: "«Instruir es incluir.»",
        quoteHint: "Pruébalo ahora: usa los botones de contraste, idioma y lengua de señas en la parte superior de la página.",
        carouselLabel: "Recursos de accesibilidad",
        features: [
            {
                title: "Traducción a Libras",
                text: "Integración nativa con VLibras para incluir a las personas sordas en todo el contenido del manual, en lengua de señas brasileña.",
            },
            {
                title: "Lector de pantalla y voz alta",
                text: "Navegación completa por voz y audio para personas con baja visión o dificultades de lectura.",
            },
            {
                title: "Confort visual",
                text: "Modo oscuro, modo claro y alto contraste con un toque, con textos grandes y legibles.",
            },
            {
                title: "Traducción de idioma",
                text: "Cambio de idioma instantáneo para atender a consumidores y mercados de todo el mundo.",
            },
        ],
    },
    brand: {
        eyebrow: "Quiénes somos",
        title: "Una nueva forma de entregar información: para las personas y para el planeta.",
        text: "Manual digital nace para sustituir folletos impresos, estáticos y confusos por una experiencia interactiva, accesible y centrada en quien la usa.",
        missionTitle: "Misión",
        missionText:
            "Transformar la experiencia de posventa y montaje de productos con manuales digitales interactivos, intuitivos y 100 % accesibles, reduciendo drásticamente el desperdicio de papel y los costes operativos de la industria.",
        visionTitle: "Visión",
        visionText:
            "Ser el estándar global de documentación técnica digital y posventa interactiva, liderando la transición de los bienes de consumo, electrodomésticos y muebles hacia el fin del papel innecesario y la inclusión digital universal.",
        valuesTitle: "Nuestros valores",
        values: [
            {
                title: "Accesibilidad radical",
                text: "Instruir es incluir: lengua de señas, lector de pantalla, alto contraste, modo oscuro y claro y varios idiomas.",
            },
            {
                title: "Sostenibilidad medible",
                text: "Cada código QR escaneado ahorra árboles, agua, energía y emisiones en la cadena gráfica.",
            },
            {
                title: "Innovación centrada en el usuario",
                text: "3D en 360°, vista explosionada, listas paso a paso y vídeos seleccionados.",
            },
            {
                title: "Eficiencia y alianza B2B",
                text: "Menos costes de impresión, almacenamiento y transporte, con indicadores ESG más sólidos.",
            },
            {
                title: "Transición responsable",
                text: "Reducimos el papel con inteligencia, sin excluir a quien todavía necesita el soporte impreso.",
            },
        ],
        legacyTitle: "Nuestro legado",
        legacyText:
            "Demostrar que pequeños cambios en la forma de entregar información a gran escala ahorran miles de toneladas de recursos naturales al año, a la vez que democratizan el conocimiento técnico para millones de personas con discapacidad.",
        positioningTitle: "Nuestro posicionamiento",
        positioning: [
            {
                audience: "Para fabricantes e industrias",
                text: "No somos un repositorio de PDF. Somos una plataforma SaaS de posventa inteligente que convierte costes gráficos y pasivos ambientales en metas ESG cumplidas, menos consultas al servicio de atención y una experiencia de unboxing memorable.",
            },
            {
                audience: "Para quien compra y monta",
                text: "Se acabó la frustración con manuales confusos. Una guía visual, interactiva, en 3D y adaptada a tus necesidades, en la palma de tu mano mediante código QR o en el navegador.",
            },
        ],
    },
    brandBand: {
        aria: "Firma de la marca",
        text: "El manual del futuro. Interactivo para quien monta, accesible para todos, sostenible para el planeta.",
    },
    marquee: {
        title: "El mercado que queremos transformar: grandes fabricantes de electrónica, electrodomésticos y muebles",
    },
    sustainability: {
        eyebrow: "Sostenibilidad",
        title: "Cada código QR escaneado es papel que no acaba en la basura.",
        text: "La información sigue en la caja, pero en el lugar correcto: en el móvil de quien va a montar, siempre actualizada y sin coste ambiental de impresión.",
        resources: [
            {
                title: "Menos árboles talados",
                text: "Los manuales que no se imprimen dejan de consumir celulosa nueva.",
            },
            {
                title: "Menos agua",
                text: "La fabricación de papel es una de las industrias que más agua consumen.",
            },
            {
                title: "Menos energía",
                text: "Sin imprenta, guillotinado ni acabado, se ahorra energía en la cadena productiva.",
            },
            {
                title: "Menos carbono en el transporte",
                text: "Cajas más ligeras y compactas reducen el peso y las emisiones logísticas.",
            },
        ],
        transitionTitle: "Transición responsable",
        transitionText:
            "No queremos dejar a nadie sin instrucciones. Reducimos el papel con inteligencia y mantenemos la versión impresa para quien todavía no tiene fácil acceso a internet o a un smartphone.",
    },
    business: {
        eyebrow: "Para empresas",
        title: "¿Por qué las marcas innovadoras eligen Manual digital?",
        text: "Una plataforma SaaS de posventa que convierte el coste gráfico y el pasivo ambiental en ahorro, indicadores ESG y clientes más satisfechos.",
        benefits: [
            {
                title: "Reducción de costes",
                text: "Ahorro directo en impresión, papel, almacenamiento y peso de transporte por cada unidad vendida.",
            },
            {
                title: "Metas ESG reales",
                text: "Informes de impacto con toneladas de papel y CO₂ ahorrados, listos para el informe corporativo.",
            },
            {
                title: "Actualización en tiempo real",
                text: "Corrige instrucciones o añade mejoras al instante, sin reimprimir lotes enteros.",
            },
            {
                title: "Menos consultas al soporte",
                text: "Montajes más claros reducen devoluciones, reseñas negativas y dudas en el soporte.",
            },
        ],
        ctaText: "Descubre cuánto puede ahorrar tu operación con la calculadora de impacto.",
        ctaPrimary: "Hablar con un especialista",
        ctaSecondary: "Calcular impacto",
    },
    howItWorks: {
        eyebrow: "Cómo funciona",
        title: "Del papel al código QR en tres pasos.",
        text: "Implementación sencilla y rápida, sin cambiar la línea de producción.",
        steps: [
            {
                title: "Envío",
                text: "Tu empresa envía el manual actual y los archivos técnicos y 3D del producto.",
            },
            {
                title: "Transformación",
                text: "La plataforma convierte el material en un manual 3D interactivo, accesible y con vídeos integrados.",
            },
            {
                title: "Publicación",
                text: "Generamos el código QR exclusivo para el embalaje e indexamos el manual en el buscador público.",
            },
        ],
    },
    catalog: {
        eyebrow: "Para quien monta",
        title: "Explora manuales ya digitalizados.",
        text: "Elige una categoría y prueba al momento la experiencia 3D y los recursos de accesibilidad. Modelos de demostración.",
        filterAria: "Filtrar por categoría",
        categories: {
            all: "Todos",
            appliances: "Electrodomésticos",
            furniture: "Muebles",
            tools: "Herramientas",
            electronics: "Electrónica",
        },
        carouselLabel: "Manuales digitalizados",
        products: [
            { name: "Frigorífico No Frost 450 L", features: ["3D 360°", "Vídeos", "Lengua de señas"] },
            { name: "Lavadora 12 kg", features: ["Lista de pasos", "Voz alta"] },
            { name: "Armario de 6 puertas", features: ["Vista explosionada", "Lista de pasos"] },
            { name: "Mueble para TV R-120", features: ["3D 360°", "Lengua de señas"] },
            { name: "Atornillador 12 V", features: ["Vídeos", "Seguridad"] },
            { name: "Taladro percutor 650 W", features: ["3D 360°", "Voz alta"] },
            { name: "Smart TV de 55 pulgadas", features: ["Configuración", "Lengua de señas"] },
            { name: "Altavoz Bluetooth", features: ["Vídeos", "Idiomas"] },
        ],
        openManual: "Abrir manual",
        viewAll: "Ver todos los manuales",
    },
    contact: {
        eyebrow: "Hablemos",
        title: "¿Listo para modernizar el embalaje y la posventa de tus productos?",
        text: "Cuéntanos un poco sobre tu operación. Nuestro equipo prepara una demostración con un manual de tu línea de productos.",
        name: "Nombre",
        company: "Empresa",
        email: "Correo corporativo",
        volume: "Volumen aproximado de productos al año",
        volumes: [
            "Hasta 10 000 productos/año",
            "De 10 000 a 100 000 productos/año",
            "De 100 000 a 1 millón de productos/año",
            "Más de 1 millón de productos/año",
        ],
        submit: "Quiero una demostración",
        privacy: "Solo usamos tus datos para responder a este contacto.",
        successTitle: "¡Hemos recibido tu mensaje!",
        successText: "Time Nexus se pondrá en contacto contigo pronto en el correo indicado.",
        sendAnother: "Enviar otro mensaje",
    },
    footer: {
        tagline: "El manual del futuro. Interactivo para quien monta, accesible para todos, sostenible para el planeta.",
        navAria: "Enlaces del pie de página",
        columns: [
            {
                title: "Navegación",
                links: ["El problema", "La solución", "Sostenibilidad", "Quiénes somos"],
            },
            {
                title: "Para ti",
                links: ["Buscar un manual", "Manuales digitalizados", "Recursos de accesibilidad"],
            },
            {
                title: "Para empresas",
                links: ["Ventajas", "Cómo funciona", "Calculadora de impacto", "Contáctanos"],
            },
        ],
        commitmentTitle: "Compromiso de accesibilidad",
        commitmentText:
            "Seguimos las pautas WCAG, con una estructura compatible con lectores de pantalla, alto contraste, Libras mediante VLibras y traducción de idioma. ¿Has encontrado alguna barrera? Escríbenos.",
        copyright: "© 2026 Manual digital. Todos los derechos reservados.",
        team: "Hecho por Time Nexus: Danilo, Stephany, Thaiza y Bianca.",
    },
    carousel: {
        goTo: "Ir a la tarjeta {index} de {total}",
    },
};

export default es;
