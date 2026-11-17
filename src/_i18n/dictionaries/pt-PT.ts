import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// European Portuguese: telemóvel, ecrã, utilizador, equipa, registo, "está a montar"...
const ptPT: Dictionary = {
    meta: {
        title: "Manual digital | O manual do futuro: interativo, acessível e sustentável",
        description:
            "Troque manuais em papel confusos por manuais digitais em 3D, acessíveis e por código QR. Para quem monta, um guia intuitivo; para as marcas, menos custos, metas ESG e menos pedidos ao apoio ao cliente.",
    },
    header: {
        homeAria: "Manual digital, voltar ao início",
        navAria: "Secções da página",
        nav: ["O problema", "Solução", "Acessibilidade", "Sobre nós", "Para empresas"],
        contact: "Contacte-nos",
        contrast: {
            trigger: "Opções de contraste",
            group: "Modo de visualização",
            normal: "Predefinido",
            gray: "Escala de cinzentos",
            high: "Alto contraste",
        },
        language: {
            trigger: "Idioma: {language}. Alterar idioma",
            menu: "Escolher idioma",
        },
        libras: {
            open: "Abrir tradução em Libras (língua gestual brasileira)",
            close: "Fechar tradução em Libras",
            loading: "A carregar a tradução em Libras…",
            error: "Não foi possível carregar o VLibras. Verifique a ligação e tente novamente.",
        },
    },
    mobileMenu: {
        open: "Abrir menu",
        close: "Fechar menu",
        navAria: "Menu principal",
    },
    hero: {
        tag: "O manual do futuro",
        titleStart: "Diga adeus aos manuais em papel confusos. Bem-vindo à era do",
        titleHighlight: "Manual Digital 3D",
        titleEnd: ".",
        text: "Transformamos instruções estáticas em experiências interativas a 360°, 100% acessíveis e sustentáveis, diretamente do código QR da caixa para a palma da sua mão.",
        searchLabel: "Já tem um produto? Encontre o manual agora",
        searchPlaceholder: "Nome, modelo ou referência do produto",
        searchAria: "Pesquisar manual por nome, modelo ou referência do produto",
        searchButton: "Pesquisar manual",
        b2bText: "É fabricante ou marca?",
        b2bButton: "Digitalizar os manuais da minha empresa",
        highlights: ["Código QR na embalagem", "Visualização 3D a 360°", "Língua gestual e leitura em voz alta"],
        mascotAlt: "Lucca, a coruja guia do Manual digital, com capacete de segurança",
        badge3d: "3D 360°",
        badgeEco: "Zero papel desnecessário",
    },
    problem: {
        eyebrow: "O problema",
        title: "O custo invisível do papel na indústria.",
        text: "O manual impresso encarece a logística, gera lixo e, na maioria das vezes, acaba deitado fora ou esquecido. E quem precisa de montar o produto continua sem ajuda.",
        industryTitle: "Para a indústria",
        stats: [
            {
                value: "4741 t",
                label: "de papel por ano",
                text: "estimadas só em manuais básicos de quatro gigantes: Whirlpool, Electrolux, Samsung e Apple.",
            },
            {
                value: "80 g",
                label: "por manual",
                text: "é o peso médio de um único manual de eletrodoméstico, multiplicado por milhões de caixas.",
            },
            {
                value: "13 152",
                label: "resmas de 500 folhas",
                text: "por ano num único cenário de bens de consumo, com 1,6 milhões de manuais impressos.",
            },
        ],
        usersTitle: "Para quem monta",
        pains: [
            "Letras minúsculas e desenhos que confundem mais do que explicam.",
            "Manual perdido, rasgado ou deitado fora com a caixa.",
            "Nenhum recurso para pessoas com deficiência visual, auditiva ou dificuldades de leitura.",
            "Um só idioma, sem vídeo e sem forma de ver a peça de outro ângulo.",
        ],
        note: "Estimativas ilustrativas do estudo da equipa Time Nexus, com base em relatórios anuais de 2025 e no pressuposto de papel de 75 g/m² em formato A5. Não representam dados internos das empresas citadas.",
    },
    calculator: {
        eyebrow: "Calculadora de impacto",
        title: "Quanto papel deixaria a sua empresa de imprimir?",
        text: "Indique quantos produtos vende por ano e veja, com os pressupostos do nosso estudo, o impacto de mudar para o Manual digital.",
        productsLabel: "Produtos vendidos por ano",
        manualTypeLabel: "Tipo de manual",
        manualTypes: [
            "Eletrodoméstico (34 páginas, 80 g)",
            "Manual compacto (16 páginas, 18,72 g)",
            "Smartphone (folheto, 1,5 g)",
        ],
        shareLabel: "Produtos que hoje seguem com manual impresso",
        shares: ["70% dos produtos", "80% dos produtos", "90% dos produtos"],
        resultsTitle: "Menos {count} manuais impressos por ano significam:",
        results: ["de papel a menos por ano", "folhas A4 equivalentes", "resmas de 500 folhas"],
        note: "Pressupostos: papel de 75 g/m², folha A4 de 4,68 g e manual de 18,72 g a 80 g, segundo o estudo da equipa Time Nexus. Sem contar capa, desperdício de impressão e transporte.",
    },
    solution: {
        eyebrow: "A solução",
        title: "Muito mais do que um PDF: uma experiência guiada.",
        text: "O Manual digital transforma o folheto da caixa num guia visual, interativo e sempre atualizado. Experimente aqui ao lado: rode a peça e assinale os passos.",
        features: [
            {
                title: "Visualização 3D a 360°",
                text: "Rode, aproxime e veja cada peça em vista explodida. Acabou-se adivinhar pelo desenho.",
            },
            {
                title: "Passo a passo inteligente",
                text: "Listas de verificação de montagem interativas e informação detalhada de cada peça, ao seu ritmo.",
            },
            {
                title: "Central de vídeos",
                text: "Os melhores vídeos sobre o produto, reunidos e organizados dentro do próprio manual.",
            },
            {
                title: "Acesso híbrido",
                text: "Aponte a câmara do telemóvel para o código QR da caixa ou pesquise o modelo diretamente no site.",
            },
        ],
        demo: {
            product: "Móvel de TV · Modelo R-120",
            step: "Passo {current} de {total}",
            cubeSpinning: "Peça a rodar 360 graus",
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
        text: "Nenhum consumidor deve ficar para trás por barreiras sensoriais, linguísticas ou cognitivas. A acessibilidade não é um extra: é o ponto de partida.",
        quote: "«Instruir é incluir.»",
        quoteHint: "Experimente já: utilize os botões de contraste, idioma e língua gestual no topo da página.",
        carouselLabel: "Recursos de acessibilidade",
        features: [
            {
                title: "Tradução em Libras",
                text: "Integração nativa com o VLibras para incluir as pessoas surdas em todo o conteúdo do manual, em língua gestual brasileira.",
            },
            {
                title: "Leitor de ecrã e voz alta",
                text: "Navegação completa por voz e áudio para pessoas com baixa visão ou dificuldades de leitura.",
            },
            {
                title: "Conforto visual",
                text: "Modo escuro, modo claro e alto contraste com um toque, com textos grandes e legíveis.",
            },
            {
                title: "Tradução de idioma",
                text: "Mudança de idioma instantânea para servir consumidores e mercados de todo o mundo.",
            },
        ],
    },
    brand: {
        eyebrow: "Quem somos",
        title: "Uma nova forma de entregar informação: para as pessoas e para o planeta.",
        text: "O Manual digital nasce para substituir folhetos impressos, estáticos e confusos por uma experiência interativa, acessível e centrada em quem a utiliza.",
        missionTitle: "Missão",
        missionText:
            "Transformar a experiência pós-compra e de montagem de produtos com manuais digitais interativos, intuitivos e 100% acessíveis, reduzindo drasticamente o desperdício de papel e os custos operacionais da indústria.",
        visionTitle: "Visão",
        visionText:
            "Ser a referência mundial em documentação técnica digital e pós-venda interativo, liderando a transição dos bens de consumo, eletrodomésticos e mobiliário rumo ao fim do papel desnecessário e à inclusão digital universal.",
        valuesTitle: "Os nossos valores",
        values: [
            {
                title: "Acessibilidade radical",
                text: "Instruir é incluir: língua gestual, leitor de ecrã, alto contraste, modo escuro e claro e vários idiomas.",
            },
            {
                title: "Sustentabilidade mensurável",
                text: "Cada código QR lido poupa árvores, água, energia e emissões na cadeia gráfica.",
            },
            {
                title: "Inovação centrada no utilizador",
                text: "3D a 360°, vista explodida, listas passo a passo e curadoria de vídeos.",
            },
            {
                title: "Eficiência e parceria B2B",
                text: "Menos custos de impressão, armazenamento e transporte, com indicadores ESG mais sólidos.",
            },
            {
                title: "Transição responsável",
                text: "Reduzimos o papel com inteligência, sem excluir quem ainda precisa do suporte impresso.",
            },
        ],
        legacyTitle: "O nosso legado",
        legacyText:
            "Provar que pequenas mudanças na forma como entregamos informação em grande escala poupam milhares de toneladas de recursos naturais por ano, ao mesmo tempo que democratizam o conhecimento técnico para milhões de pessoas com deficiência.",
        positioningTitle: "O nosso posicionamento",
        positioning: [
            {
                audience: "Para fabricantes e indústria",
                text: "Não somos um repositório de PDF. Somos uma plataforma SaaS de pós-venda inteligente, que transforma custos gráficos e passivos ambientais em metas ESG cumpridas, menos pedidos ao apoio ao cliente e um unboxing memorável.",
            },
            {
                audience: "Para quem compra e monta",
                text: "O fim da frustração com manuais confusos. Um guia visual, interativo, em 3D e adaptado às suas necessidades, na palma da mão através do código QR ou no navegador.",
            },
        ],
    },
    brandBand: {
        aria: "Assinatura da marca",
        text: "O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o planeta.",
    },
    marquee: {
        title: "O mercado que queremos transformar: grandes fabricantes de eletrónica, eletrodomésticos e mobiliário",
    },
    sustainability: {
        eyebrow: "Sustentabilidade",
        title: "Cada código QR lido é papel que não vai para o lixo.",
        text: "A informação continua na caixa, mas no sítio certo: no telemóvel de quem está a montar, sempre atualizada e sem custo ambiental de impressão.",
        resources: [
            {
                title: "Menos árvores abatidas",
                text: "Os manuais que não são impressos deixam de consumir celulose nova.",
            },
            {
                title: "Menos água",
                text: "O fabrico de papel é uma das indústrias que mais água consomem.",
            },
            {
                title: "Menos energia",
                text: "Sem gráfica, corte e acabamento, poupa-se energia na cadeia de produção.",
            },
            {
                title: "Menos carbono no transporte",
                text: "Caixas mais leves e compactas reduzem o peso e as emissões logísticas.",
            },
        ],
        transitionTitle: "Transição responsável",
        transitionText:
            "Não queremos deixar ninguém sem instruções. Reduzimos o papel com inteligência e mantemos a versão impressa para quem ainda não tem acesso fácil à internet ou a um smartphone.",
    },
    business: {
        eyebrow: "Para empresas",
        title: "Porque é que as marcas inovadoras escolhem o Manual digital?",
        text: "Uma plataforma SaaS de pós-venda que transforma custos gráficos e passivo ambiental em poupança, indicadores ESG e clientes mais satisfeitos.",
        benefits: [
            {
                title: "Redução de custos",
                text: "Poupança direta em impressão, papel, armazenamento e peso no transporte de cada unidade vendida.",
            },
            {
                title: "Metas ESG reais",
                text: "Relatórios de impacto com as toneladas de papel e de CO₂ poupadas, prontos para o relatório da empresa.",
            },
            {
                title: "Atualização em tempo real",
                text: "Corrija instruções ou acrescente melhorias de imediato, sem reimprimir lotes inteiros.",
            },
            {
                title: "Menos pedidos ao apoio ao cliente",
                text: "Montagens mais claras reduzem devoluções, avaliações negativas e dúvidas no apoio ao cliente.",
            },
        ],
        ctaText: "Descubra quanto a sua operação pode poupar com a calculadora de impacto.",
        ctaPrimary: "Falar com um especialista",
        ctaSecondary: "Calcular impacto",
    },
    howItWorks: {
        eyebrow: "Como funciona",
        title: "Do papel ao código QR em três passos.",
        text: "Implementação simples e rápida, sem alterar a linha de produção.",
        steps: [
            {
                title: "Envio",
                text: "A sua empresa envia o manual atual e os ficheiros técnicos e 3D do produto.",
            },
            {
                title: "Transformação",
                text: "A plataforma converte o material num manual 3D interativo, acessível e com vídeos integrados.",
            },
            {
                title: "Publicação",
                text: "Geramos o código QR exclusivo para a embalagem e indexamos o manual no motor de pesquisa público.",
            },
        ],
    },
    catalog: {
        eyebrow: "Para quem monta",
        title: "Explore manuais já digitalizados.",
        text: "Escolha uma categoria e experimente de imediato a experiência 3D e os recursos de acessibilidade. Modelos de demonstração.",
        filterAria: "Filtrar por categoria",
        categories: {
            all: "Todos",
            appliances: "Eletrodomésticos",
            furniture: "Mobiliário",
            tools: "Ferramentas",
            electronics: "Eletrónica",
        },
        carouselLabel: "Manuais digitalizados",
        products: [
            { name: "Frigorífico No Frost 450 L", features: ["3D 360°", "Vídeos", "Língua gestual"] },
            { name: "Máquina de lavar roupa 12 kg", features: ["Lista de verificação", "Voz alta"] },
            { name: "Roupeiro de 6 portas", features: ["Vista explodida", "Lista de verificação"] },
            { name: "Móvel de TV R-120", features: ["3D 360°", "Língua gestual"] },
            { name: "Aparafusadora 12 V", features: ["Vídeos", "Segurança"] },
            { name: "Berbequim de percussão 650 W", features: ["3D 360°", "Voz alta"] },
            { name: "Smart TV de 55 polegadas", features: ["Configuração", "Língua gestual"] },
            { name: "Coluna Bluetooth", features: ["Vídeos", "Idiomas"] },
        ],
        openManual: "Abrir manual",
        viewAll: "Ver todos os manuais",
    },
    contact: {
        eyebrow: "Fale connosco",
        title: "Pronto para modernizar a embalagem e o pós-venda dos seus produtos?",
        text: "Conte-nos um pouco sobre a sua operação. A nossa equipa prepara uma demonstração com um manual da sua linha de produtos.",
        name: "Nome",
        company: "Empresa",
        email: "E-mail profissional",
        volume: "Volume aproximado de produtos por ano",
        volumes: [
            "Até 10 mil produtos/ano",
            "De 10 mil a 100 mil produtos/ano",
            "De 100 mil a 1 milhão de produtos/ano",
            "Mais de 1 milhão de produtos/ano",
        ],
        submit: "Quero uma demonstração",
        privacy: "Utilizamos os seus dados apenas para responder a este contacto.",
        successTitle: "Recebemos o seu contacto!",
        successText: "A equipa Time Nexus vai responder-lhe em breve através do e-mail indicado.",
        sendAnother: "Enviar outro contacto",
    },
    footer: {
        tagline: "O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o planeta.",
        navAria: "Ligações do rodapé",
        columns: [
            {
                title: "Navegação",
                links: ["O problema", "A solução", "Sustentabilidade", "Quem somos"],
            },
            {
                title: "Para si",
                links: ["Pesquisar um manual", "Manuais digitalizados", "Recursos de acessibilidade"],
            },
            {
                title: "Para empresas",
                links: ["Vantagens", "Como funciona", "Calculadora de impacto", "Contacte-nos"],
            },
        ],
        commitmentTitle: "Compromisso de acessibilidade",
        commitmentText:
            "Seguimos as diretrizes WCAG, com uma estrutura compatível com leitores de ecrã, alto contraste, Libras através do VLibras e tradução de idioma. Encontrou alguma barreira? Fale connosco.",
        copyright: "© 2026 Manual digital. Todos os direitos reservados.",
        team: "Feito pela equipa Time Nexus: Danilo, Stephany, Thaiza e Bianca.",
    },
    carousel: {
        goTo: "Ir para o cartão {index} de {total}",
    },
};

export default ptPT;
