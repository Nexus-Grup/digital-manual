// Source dictionary (pt-BR). Its shape defines the Dictionary type every other locale must match.
// Lists (highlights, stats, steps...) are positional: components pair them with icons/links in the same order.

const ptBR = {
    meta: {
        title: "Manual digital | O manual do futuro: interativo, acessível e sustentável",
        description:
            "Troque manuais de papel confusos por manuais digitais em 3D, acessíveis e via QR Code. Para quem monta, um guia intuitivo; para marcas, menos custo, metas ESG e menos chamados no SAC.",
    },
    header: {
        homeAria: "Manual digital, voltar ao início",
        navAria: "Seções da página",
        nav: ["O problema", "Solução", "Acessibilidade", "Sobre nós", "Para empresas"],
        contact: "Fale conosco",
        account: "Entrar na sua conta",
        contrast: {
            trigger: "Opções de contraste",
            group: "Modo de visualização",
            normal: "Padrão",
            gray: "Escala de cinza",
            high: "Alto contraste",
        },
        language: {
            trigger: "Idioma: {language}. Alterar idioma",
            menu: "Escolher idioma",
        },
        libras: {
            open: "Abrir tradução em Libras",
            close: "Fechar tradução em Libras",
            loading: "Carregando a tradução em Libras…",
            error: "Não foi possível carregar o VLibras. Verifique a conexão e tente de novo.",
        },
    },
    productHeader: {
        homeAria: "Manual digital, ver todos os produtos",
        menu: {
            open: "Abrir menu",
            title: "Menu",
            close: "Fechar menu",
            search: "Buscar",
            searchAria: "Buscar no menu",
            navAria: "Menu principal",
            groupProduct: "Neste produto",
            groupGeneral: "Geral",
            home: "Início",
            manual: "Manual",
            information: "Informações",
            assembly: "Montagem",
            allProducts: "Todos os produtos",
            empty: "Nada encontrado para “{query}”. Tente outra palavra.",
        },
    },
    mobileMenu: {
        open: "Abrir menu",
        close: "Fechar menu",
        navAria: "Menu principal",
    },
    hero: {
        tag: "O manual do futuro",
        titleStart: "Diga adeus aos manuais de papel confusos. Bem-vindo à era do",
        titleHighlight: "Manual Digital",
        titleEnd: ".",
        text: "Transformamos instruções estáticas em experiências interativas em 360°, 100% acessíveis e sustentáveis, direto do QR Code da caixa para a palma da sua mão.",
        searchLabel: "Já tem um produto? Encontre o manual agora",
        searchPlaceholder: "Nome, modelo ou código do produto",
        searchAria: "Buscar manual por nome, modelo ou código do produto",
        searchButton: "Buscar manual",
        b2bText: "É fabricante ou marca?",
        b2bButton: "Digitalizar os manuais da minha empresa",
        highlights: ["QR Code na embalagem", "Visualização 3D em 360°", "Libras e leitura em voz alta"],
        mascotAlt: "Lucca, a coruja guia do Manual digital, escaneando com o celular o QR Code de um manual",
        badge3d: "3D 360°",
        badgeEco: "Zero papel desnecessário",
    },
    problem: {
        eyebrow: "O problema",
        title: "O custo invisível do papel na indústria.",
        text: "O manual físico encarece a logística, gera lixo e, na maioria das vezes, acaba descartado ou esquecido. E quem precisa montar o produto continua sem ajuda.",
        industryTitle: "Para a indústria",
        stats: [
            {
                value: "4.741 t",
                label: "de papel por ano",
                text: "estimadas só em manuais básicos de quatro gigantes: Whirlpool, Electrolux, Samsung e Apple.",
            },
            {
                value: "80 g",
                label: "por manual",
                text: "é o peso médio de um único manual de eletrodoméstico, multiplicado por milhões de caixas.",
            },
            {
                value: "13.152",
                label: "resmas de 500 folhas",
                text: "por ano em um único cenário de bens de consumo, com 1,6 milhão de manuais impressos.",
            },
        ],
        usersTitle: "Para quem monta",
        pains: [
            "Letras miúdas e desenhos que confundem mais do que explicam.",
            "Manual perdido, rasgado ou jogado fora junto com a caixa.",
            "Nenhum recurso para pessoas com deficiência visual, auditiva ou dificuldade de leitura.",
            "Um só idioma, sem vídeo e sem como ver a peça de outro ângulo.",
        ],
        note: "Estimativas ilustrativas do estudo do Time Nexus, com base em relatórios anuais de 2025 e na premissa de papel 75 g/m² em formato A5. Não representam dados internos das empresas citadas.",
    },
    calculator: {
        eyebrow: "Calculadora de impacto",
        title: "Quanto papel a sua empresa deixaria de imprimir?",
        text: "Informe quantos produtos você vende por ano e veja, com as premissas da nossa pesquisa, o impacto de migrar para o Manual digital.",
        productsLabel: "Produtos vendidos por ano",
        manualTypeLabel: "Tipo de manual",
        manualTypes: [
            "Eletrodoméstico (34 páginas, 80 g)",
            "Manual compacto (16 páginas, 18,72 g)",
            "Smartphone (folheto, 1,5 g)",
        ],
        shareLabel: "Produtos que hoje vão com manual impresso",
        shares: ["70% dos produtos", "80% dos produtos", "90% dos produtos"],
        resultsTitle: "{count} manuais impressos a menos por ano significam:",
        results: ["de papel a menos por ano", "folhas A4 equivalentes", "resmas de 500 folhas"],
        units: {
            tonOne: "tonelada",
            tonOther: "toneladas",
            kgOne: "quilo",
            kgOther: "quilos",
        },
        note: "Premissas: papel 75 g/m², folha A4 de 4,68 g e manual de 18,72 g a 80 g, conforme o estudo do Time Nexus. Sem contar capa, perdas de impressão e frete.",
    },
    solution: {
        eyebrow: "A solução",
        title: "Muito além de um PDF: uma experiência guiada.",
        text: "O Manual digital transforma o livreto da caixa em um guia visual, interativo e sempre atualizado. Experimente ao lado: gire a peça e marque as etapas.",
        features: [
            {
                title: "Visualização 3D em 360°",
                text: "Gire, aproxime e veja cada peça em vista explodida. Nada de adivinhar pelo desenho.",
            },
            {
                title: "Passo a passo inteligente",
                text: "Checklists interativos de montagem e informações detalhadas de cada peça, no seu ritmo.",
            },
            {
                title: "Central de vídeos",
                text: "Os melhores vídeos sobre o produto reunidos e organizados dentro do próprio manual.",
            },
            {
                title: "Acesso híbrido",
                text: "Aponte a câmera para o QR Code da caixa ou pesquise pelo modelo direto no site.",
            },
        ],
        demo: {
            product: "Rack para TV · Modelo R-120",
            step: "Passo {current} de {total}",
            cubeSpinning: "Peça girando em 360 graus",
            cubeExploded: "Peça em vista explodida",
            explode: "Ver vista explodida",
            assemble: "Montar peça",
            progress: "Progresso da montagem",
            steps: ["Separe as peças A, B e C", "Encaixe a lateral na base", "Fixe com 4 parafusos M6"],
        },
    },
    accessibility: {
        eyebrow: "Acessibilidade 100%",
        title: "Tecnologia feita para todas as pessoas.",
        text: "Nenhum consumidor deve ficar para trás por barreiras sensoriais, linguísticas ou cognitivas. Acessibilidade não é um extra: é o ponto de partida.",
        quote: "“Instruir é incluir.”",
        quoteHint: "Experimente agora: use os botões de contraste, idioma e Libras no topo da página.",
        carouselLabel: "Recursos de acessibilidade",
        features: [
            {
                title: "Tradução em Libras",
                text: "Integração nativa com o VLibras para a inclusão de pessoas surdas em todo o conteúdo do manual.",
            },
            {
                title: "Leitura de tela e voz alta",
                text: "Navegação completa por voz e áudio para pessoas com baixa visão ou dificuldade de leitura.",
            },
            {
                title: "Conforto visual",
                text: "Dark Mode, White Mode e Alto Contraste a um toque, com textos grandes e legíveis.",
            },
            {
                title: "Tradução de idioma",
                text: "Conversão instantânea de idioma para atender consumidores e mercados do mundo todo.",
            },
        ],
    },
    brand: {
        eyebrow: "Quem somos",
        title: "Um novo jeito de entregar informação: para as pessoas e para o planeta.",
        text: "O Manual digital nasce para substituir folhetos impressos, estáticos e confusos por uma experiência interativa, acessível e centrada em quem usa.",
        missionTitle: "Missão",
        missionText:
            "Transformar a experiência de pós-compra e montagem de produtos com manuais digitais interativos, intuitivos e 100% acessíveis, reduzindo drasticamente o desperdício de papel e os custos operacionais das indústrias.",
        visionTitle: "Visão",
        visionText:
            "Ser o padrão global de documentação técnica digital e pós-venda interativo, liderando a transição de bens de consumo, eletrodomésticos e mobiliário rumo ao fim do papel desnecessário e à inclusão digital universal.",
        valuesTitle: "Nossos valores",
        values: [
            {
                title: "Acessibilidade radical",
                text: "Instruir é incluir: Libras, leitura de tela, alto contraste, Dark e White Mode e vários idiomas.",
            },
            {
                title: "Sustentabilidade mensurável",
                text: "Cada QR Code escaneado poupa árvores, água, energia e emissões na cadeia gráfica.",
            },
            {
                title: "Inovação centrada no usuário",
                text: "3D em 360°, vista explodida, checklists passo a passo e curadoria de vídeos.",
            },
            {
                title: "Eficiência e parceria B2B",
                text: "Menos custo de impressão, armazenagem e frete, com indicadores ESG mais fortes.",
            },
            {
                title: "Transição responsável",
                text: "Reduzimos o papel com inteligência, sem excluir quem ainda precisa do suporte impresso.",
            },
        ],
        legacyTitle: "Nosso legado",
        legacyText:
            "Provar que pequenas mudanças na forma como entregamos informação em larga escala poupam milhares de toneladas de recursos naturais por ano, enquanto democratizam o conhecimento técnico para milhões de pessoas com deficiência.",
        positioningTitle: "Nosso posicionamento",
        positioning: [
            {
                audience: "Para fabricantes e indústrias",
                text: "Não somos um repositório de PDFs. Somos uma plataforma SaaS de pós-venda inteligente, que transforma custos gráficos e passivos ambientais em metas ESG atingidas, menos chamados no SAC e encantamento no unboxing.",
            },
            {
                audience: "Para quem compra e monta",
                text: "O fim da frustração com manuais confusos. Um guia visual, interativo, em 3D e adaptado às suas necessidades, na palma da mão pelo QR Code ou no navegador.",
            },
        ],
    },
    brandBand: {
        aria: "Assinatura da marca",
        text: "O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o planeta.",
    },
    marquee: {
        title: "O mercado que queremos transformar: grandes fabricantes de eletrônicos, eletrodomésticos e móveis",
    },
    sustainability: {
        eyebrow: "Sustentabilidade",
        title: "Cada QR Code escaneado é papel que não vira lixo.",
        text: "A informação continua na caixa, só que no lugar certo: no celular de quem vai montar, sempre atualizada e sem custo ambiental de impressão.",
        resources: [
            {
                title: "Menos árvores derrubadas",
                text: "Manuais que não são impressos deixam de consumir celulose nova.",
            },
            {
                title: "Menos água",
                text: "A fabricação de papel é uma das indústrias que mais consomem água.",
            },
            {
                title: "Menos energia",
                text: "Sem gráfica, refile e acabamento, sobra energia na cadeia produtiva.",
            },
            {
                title: "Menos carbono no frete",
                text: "Caixas mais leves e compactas reduzem peso e emissões logísticas.",
            },
        ],
        transitionTitle: "Transição responsável",
        transitionText:
            "Não queremos deixar ninguém sem instrução. Reduzimos o papel com inteligência e mantemos a versão impressa para quem ainda não tem acesso fácil à internet ou a um smartphone.",
    },
    business: {
        eyebrow: "Para empresas",
        title: "Por que marcas inovadoras escolhem o Manual digital?",
        text: "Uma plataforma SaaS de pós-venda que transforma custo gráfico e passivo ambiental em economia, indicadores ESG e clientes mais satisfeitos.",
        benefits: [
            {
                title: "Redução de custos",
                text: "Corte direto em impressão, papel, armazenagem e peso no frete de cada unidade vendida.",
            },
            {
                title: "Metas ESG reais",
                text: "Relatórios de impacto com toneladas de papel e CO₂ economizados, prontos para o balanço corporativo.",
            },
            {
                title: "Atualização em tempo real",
                text: "Corrija instruções ou inclua melhorias na hora, sem reimprimir lotes inteiros.",
            },
            {
                title: "Menos chamados no SAC",
                text: "Montagens mais claras reduzem devoluções, avaliações negativas e dúvidas no suporte.",
            },
        ],
        ctaText: "Descubra quanto a sua operação pode economizar com a calculadora de impacto.",
        ctaPrimary: "Falar com especialista",
        ctaSecondary: "Calcular impacto",
    },
    howItWorks: {
        eyebrow: "Como funciona",
        title: "Do papel ao QR Code em três passos.",
        text: "Implementação simples e rápida, sem mudar a linha de produção.",
        steps: [
            {
                title: "Envio",
                text: "Sua empresa envia o manual atual e os arquivos técnicos e 3D do produto.",
            },
            {
                title: "Transformação",
                text: "A plataforma converte o material em um manual 3D interativo, acessível e com vídeos integrados.",
            },
            {
                title: "Publicação",
                text: "Geramos o QR Code exclusivo para a embalagem e indexamos o manual no buscador público.",
            },
        ],
    },
    catalog: {
        eyebrow: "Para quem monta",
        title: "Explore manuais já digitalizados.",
        text: "Escolha uma categoria e abra o manual digital: montagem ilustrada, vídeos e recursos de acessibilidade.",
        filterAria: "Filtrar por categoria",
        categories: {
            all: "Todos",
            appliances: "Eletrodomésticos",
            furniture: "Móveis",
            tools: "Ferramentas",
            electronics: "Eletrônicos",
            other: "Outros",
        },
        carouselLabel: "Manuais digitalizados",
        openManual: "Abrir manual",
        viewAll: "Ver todos os manuais",
    },
    contact: {
        eyebrow: "Fale com a gente",
        title: "Pronto para modernizar a embalagem e o pós-venda dos seus produtos?",
        text: "Conte um pouco sobre a sua operação. Nosso time prepara uma demonstração com um manual da sua linha de produtos.",
        name: "Nome",
        company: "Empresa",
        email: "E-mail corporativo",
        volume: "Volume aproximado de produtos por ano",
        volumes: [
            "Até 10 mil produtos/ano",
            "De 10 mil a 100 mil produtos/ano",
            "De 100 mil a 1 milhão de produtos/ano",
            "Mais de 1 milhão de produtos/ano",
        ],
        submit: "Quero uma demonstração",
        privacy: "Usamos seus dados apenas para retornar este contato.",
        successTitle: "Recebemos seu contato!",
        successText: "Em breve o Time Nexus fala com você pelo e-mail informado.",
        sendAnother: "Enviar outro contato",
    },
    footer: {
        tagline: "O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o planeta.",
        navAria: "Links do rodapé",
        columns: [
            {
                title: "Navegação",
                links: ["O problema", "A solução", "Sustentabilidade", "Quem somos"],
            },
            {
                title: "Para você",
                links: ["Buscar um manual", "Manuais digitalizados", "Recursos de acessibilidade"],
            },
            {
                title: "Para empresas",
                links: ["Vantagens", "Como funciona", "Calculadora de impacto", "Fale conosco"],
            },
        ],
        commitmentTitle: "Compromisso de acessibilidade",
        commitmentText:
            "Seguimos as diretrizes WCAG, com estrutura compatível com leitores de tela, alto contraste, Libras via VLibras e tradução de idioma. Encontrou alguma barreira? Fale com a gente.",
        copyright: "© 2026 Manual digital. Todos os direitos reservados.",
        team: "Feito pelo Time Nexus: Danilo, Stephany, Thaiza e Bianca.",
    },
    productSearch: {
        title: "Encontre o manual do seu produto",
        text: "Pesquise pelo nome, modelo ou código, ou aponte a câmera para o QR Code da embalagem.",
        search: {
            label: "Nome, modelo ou código",
            placeholder: "Ex.: parafusadeira, GSR 120-LI",
            aria: "Buscar manual por nome, modelo ou código",
            button: "Buscar",
        },
        filterAria: "Filtrar por categoria",
        subcategoryAria: "Filtrar por tipo de produto",
        allSubcategories: "Todas",
        subcategories: {
            refrigerator: "Geladeiras",
            washer: "Lavadoras",
            microwave: "Micro-ondas",
            wardrobe: "Guarda-roupas",
            tvStand: "Racks e painéis",
            desk: "Escrivaninhas",
            screwdriver: "Parafusadeiras",
            drill: "Furadeiras",
            sander: "Lixadeiras",
            tv: "TVs",
            speaker: "Caixas de som",
            headphones: "Fones de ouvido",
        },
        resultsAria: "Manuais encontrados",
        countAll: "{count} manuais disponíveis",
        countAllOne: "1 manual disponível",
        countQuery: "{count} resultados para “{query}”",
        countQueryOne: "1 resultado para “{query}”",
        emptyTitle: "Não encontramos manuais para “{query}”",
        emptyCategory: "Ainda não há manuais nesta categoria",
        emptyText: "Confira o nome ou o código na etiqueta ou na embalagem do produto e tente de novo.",
        clear: "Ver todos os manuais",
        openManual: "Abrir manual",
        other: "Outros",
        demoNote: "",
        cta: {
            title: "É fabricante? Digitalize os manuais da sua marca.",
            text: "Menos papel, menos chamados no SAC e um manual acessível para todos os seus clientes.",
            button: "Fale conosco",
        },
    },
    readAloud: {
        titleReading: "Lendo em voz alta",
        titlePaused: "Leitura pausada",
        titleDone: "Leitura concluída",
        titleError: "Leitura interrompida",
        fab: "Ler texto selecionado em voz alta",
        pause: "Pausar",
        resume: "Continuar",
        replay: "Ler de novo",
        close: "Fechar leitura",
        missingVoice: "Este aparelho não tem uma voz neste idioma. A leitura pode soar estranha.",
        error: "Não foi possível ler este texto.",
    },
    carousel: {
        goTo: "Ir para o card {index} de {total}",
    },
};

export type Dictionary = typeof ptBR;

export default ptBR;
