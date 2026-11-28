// ============================================================================
// SIVISECRAFT.ES — Base de Datos Oficial de Catálogo, Reseñas, Envíos y Carrito
// 100% Código Propio • Coste 0€/mes • Sincronizado con Etsy, Wallapop y Vinted
// ============================================================================

const STORE_CONFIG = {
    name: "SiviseCraft",
    domain: "www.sivisecraft.es",
    owner: "Víctor Aguado",
    city: "Madrid",
    freeShippingThreshold: 45.00, // Envío GRATIS > 45€ (Península)
    bizumPhone: "654 95 06 45",    // Teléfono oficial Bizum SiviseCraft
    whatsappNumber: "34654950645", // Teléfono oficial WhatsApp SiviseCraft
    contactEmail: "hola@sivisecraft.es",
    etsyUrl: "https://www.etsy.com/es/shop/SiviseCraft",
    wallapopText: "5★ (35 val. • +26 ventas)",
    vintedText: "5★ (13 val.)",
    etsyText: "4.9★ (+70 pedidos • +12 países)"
};

// Tramos Oficiales de Envío (Correos Domicilio Nacional + Destinos Internacionales Etsy)
const SHIPPING_TIERS = {
    espana: {
        id: "espana",
        label: "🚚 Envío a Domicilio con Correos (España)",
        baseCost: 6.00,
        freeThreshold: 45.00,
        eta: "Entrega a domicilio con seguimiento Correos 48/72h (Península y Baleares)",
        needsAddress: true,
        addressHint: "Calle, número, piso y puerta para entrega a domicilio"
    },
    ue: {
        id: "ue",
        label: "🇪🇺 Unión Europea Certificado (15,00 €)",
        baseCost: 15.00,
        freeThreshold: 90.00,
        eta: "International Tracked Shipping EU (5-8 business days)",
        needsAddress: true,
        addressHint: "Full street address, postal code, city and EU country"
    },
    finlandia: {
        id: "finlandia",
        label: "🇫🇮 Finlandia Certificado (20,00 €)",
        baseCost: 20.00,
        freeThreshold: null,
        eta: "Tracked Shipping Finland (5-9 business days)",
        needsAddress: true,
        addressHint: "Osoite, postinumero, kaupunki (Full street address)"
    },
    usa: {
        id: "usa",
        label: "🇺🇸 Estados Unidos (USA) Tracked (25,00 €)",
        baseCost: 25.00,
        freeThreshold: null,
        eta: "USPS Tracked Shipping USA (7-12 business days)",
        needsAddress: true,
        addressHint: "Street address, Apt/Suite, City, State, ZIP code"
    },
    mexico: {
        id: "mexico",
        label: "🇲🇽 México Internacional Certificado (25,00 €)",
        baseCost: 25.00,
        freeThreshold: null,
        eta: "Envío Internacional Certificado con Seguimiento (8-14 días)",
        needsAddress: true,
        addressHint: "Calle, número, colonia, código postal, ciudad y estado"
    },
    australia: {
        id: "australia",
        label: "🇦🇺 Australia Tracked Shipping (25,00 €)",
        baseCost: 25.00,
        freeThreshold: null,
        eta: "Australia Post Tracked International (10-16 business days)",
        needsAddress: true,
        addressHint: "Street address, Suburb/City, State, Postcode"
    },
    paraguay: {
        id: "paraguay",
        label: "🇵🇾 Paraguay / LATAM Certificado (60,00 €)",
        baseCost: 60.00,
        freeThreshold: null,
        eta: "Envío Internacional Certificado Prioritario (8-15 días)",
        needsAddress: true,
        addressHint: "Dirección completa, código postal, ciudad y departamento"
    }
};

// Países de destino soportados -> asignan automáticamente su tramo de envío oficial
const SHIPPING_COUNTRIES = [
    { code: "ES", name: "🇪🇸 España (Península y Baleares)", nameEn: "🇪🇸 Spain", tier: "espana" },
    { code: "DE", name: "🇩🇪 Alemania", nameEn: "🇩🇪 Germany", tier: "ue" },
    { code: "AT", name: "🇦🇹 Austria", nameEn: "🇦🇹 Austria", tier: "ue" },
    { code: "BE", name: "🇧🇪 Bélgica", nameEn: "🇧🇪 Belgium", tier: "ue" },
    { code: "DK", name: "🇩🇰 Dinamarca", nameEn: "🇩🇰 Denmark", tier: "ue" },
    { code: "FR", name: "🇫🇷 Francia", nameEn: "🇫🇷 France", tier: "ue" },
    { code: "GR", name: "🇬🇷 Grecia", nameEn: "🇬🇷 Greece", tier: "ue" },
    { code: "IE", name: "🇮🇪 Irlanda", nameEn: "🇮🇪 Ireland", tier: "ue" },
    { code: "IT", name: "🇮🇹 Italia", nameEn: "🇮🇹 Italy", tier: "ue" },
    { code: "LU", name: "🇱🇺 Luxemburgo", nameEn: "🇱🇺 Luxembourg", tier: "ue" },
    { code: "NL", name: "🇳🇱 Países Bajos", nameEn: "🇳🇱 Netherlands", tier: "ue" },
    { code: "PL", name: "🇵🇱 Polonia", nameEn: "🇵🇱 Poland", tier: "ue" },
    { code: "PT", name: "🇵🇹 Portugal", nameEn: "🇵🇹 Portugal", tier: "ue" },
    { code: "CZ", name: "🇨🇿 República Checa", nameEn: "🇨🇿 Czech Republic", tier: "ue" },
    { code: "RO", name: "🇷🇴 Rumanía", nameEn: "🇷🇴 Romania", tier: "ue" },
    { code: "SE", name: "🇸🇪 Suecia", nameEn: "🇸🇪 Sweden", tier: "ue" },
    { code: "EU_OTHER", name: "🇪🇺 Otro país de la Unión Europea", nameEn: "🇪🇺 Other EU Country", tier: "ue" },
    { code: "FI", name: "🇫🇮 Finlandia", nameEn: "🇫🇮 Finland", tier: "finlandia" },
    { code: "US", name: "🇺🇸 Estados Unidos (USA)", nameEn: "🇺🇸 United States (USA)", tier: "usa" },
    { code: "CA", name: "🇨🇦 Canadá", nameEn: "🇨🇦 Canada", tier: "usa" },
    { code: "MX", name: "🇲🇽 México", nameEn: "🇲🇽 Mexico", tier: "mexico" },
    { code: "AU", name: "🇦🇺 Australia", nameEn: "🇦🇺 Australia", tier: "australia" },
    { code: "PY", name: "🇵🇾 Paraguay", nameEn: "🇵🇾 Paraguay", tier: "paraguay" },
    { code: "LATAM_OTHER", name: "🌎 Otros países LATAM / Resto del mundo", nameEn: "🌎 Other LATAM / Rest of World", tier: "paraguay" }
];

// Catálogo Unificado Real (13 Productos: Expositores BK & McDonald's, K-Pop y Coleccionismo)
const PRODUCTS = [
    // 1. EXPOSITOR TINY TAN 7 FIGURAS + PACKS AHORRO
    {
        id: "exp_tinytan_7",
        name: "Expositor Colección Tiny Tan McDonald's (7 Figuras)",
        price: 18.00,
        oldPrice: 25.00,
        category: "kpop",
        collection: "expositores",
        featured: true,
        badge: "Top Ventas Internacional",
        badgeType: "pink",
        channelInfo: "Best-seller en Etsy (+12 países) • Precio directo taller",
        image: "img/tinytan_nombres.jpg",
        gallery: [
            "img/tinytan_nombres.jpg",
            "img/tinytan_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/efd878/7293826835/il_fullxfull.7293826835_1gsp.jpg",
            "https://i.etsystatic.com/48356593/r/il/3c0425/7293827383/il_fullxfull.7293827383_jut7.jpg",
            "https://i.etsystatic.com/48356593/r/il/8765c2/7293828011/il_fullxfull.7293828011_n4fy.jpg",
            "https://i.etsystatic.com/48356593/r/il/54972c/7245868420/il_fullxfull.7245868420_4kuw.jpg",
            "https://i.etsystatic.com/48356593/r/il/277d08/7245868382/il_fullxfull.7245868382_sps1.jpg"
        ],
        desc: "Expositor a medida para las 7 figuras de la colección Tiny Tan BTS de McDonald's. Incluye logos oficiales de BTS y Tiny Tan en relieve/hendido y opción con los nombres de los 7 integrantes (RM, JIN, SUGA, J-HOPE, JIMIN, V, JUNG KOOK). Disponible en packs de ahorro para las dos ediciones (Roja y Encore Morada). Figuras no incluidas.",
        variants: [
            {
                name: "Pack",
                options: [
                    { label: "1 Expositor (18,00 €)", price: 18.00 },
                    { label: "Pack Ahorro 2 Expositores (32,00 € • 16€/ud)", price: 32.00 }
                ]
            },
            {
                name: "Color",
                options: [
                    { label: "Morado" },
                    { label: "Rojo" },
                    { label: "Pack x2: 1 Rojo + 1 Morado" }
                ]
            },
            {
                name: "Nombres en las baldas",
                options: [
                    { label: "Con Nombres" },
                    { label: "Sin Nombres" }
                ]
            }
        ]
    },

    // 2. EXPOSITOR DRAGON BALL BURGER KING (CON LUZ LED)
    {
        id: "exp_dragon_ball",
        name: "Expositor Dragon Ball Burger King con Luz LED",
        price: 16.00,
        oldPrice: 20.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Con Luz LED",
        badgeType: "gold",
        channelInfo: "Luz LED integrada • Fabricado en nuestro taller de Madrid",
        image: "img/dragonball_1.jpg",
        gallery: [
            "img/dragonball_1.jpg",
            "img/dragonball_2.jpg",
            "img/dragonball_3.jpg",
            "img/dragonball_4.jpg"
        ],
        desc: "Expositor diseñado específicamente para la colección de figuras Dragon Ball de Burger King. Incluye iluminación LED cálida integrada para destacar la silueta y dar un efecto espectacular a tu estantería o setup. Muñecos no incluidos.",
        variants: []
    },

    // 3. EXPOSITOR THE MANDALORIAN & GROGU
    {
        id: "exp_mandalorian",
        name: "Expositor The Mandalorian & Grogu (Star Wars)",
        price: 20.00,
        oldPrice: 25.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Nuevo Lanzamiento",
        badgeType: "teal",
        channelInfo: "Diseño propio en doble altura con casco Mandaloriano",
        image: "img/mandalorian_1.jpg",
        gallery: [
            "img/mandalorian_1.jpg",
            "img/mandalorian_2.jpg",
            "img/mandalorian_3.jpg",
            "img/mandalorian_4.jpg",
            "https://i.etsystatic.com/48356593/r/il/2c7041/8107617851/il_fullxfull.8107617851_d665.jpg",
            "https://i.etsystatic.com/48356593/r/il/4b4c80/8107616387/il_fullxfull.8107616387_4fz8.jpg",
            "https://i.etsystatic.com/48356593/r/il/a4a104/8107616385/il_fullxfull.8107616385_cuwb.jpg"
        ],
        desc: "Expositor en negro mate y plata espacial para la colección completa de cápsulas y figuras de The Mandalorian and Grogu. Respaldo superior con el icónico casco mandaloriano en relieve multicolor, tipografía frontal en 3D y 7 bases circulares calibradas al milímetro. Muñecos no incluidos.",
        variants: []
    },

    // 4. EXPOSITOR STRANGER THINGS "WELCOME TO HAWKINS"
    {
        id: "exp_stranger_things",
        name: "Expositor Stranger Things 'Welcome to Hawkins' McDonald's",
        price: 22.50,
        oldPrice: 28.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Gran Formato 4 Gradas",
        badgeType: "pink",
        channelInfo: "Capacidad para las 12 figuras + sus 12 cofres/casitas",
        image: "img/stranger_1.jpg",
        gallery: [
            "img/stranger_1.jpg",
            "img/stranger_2.jpg",
            "img/stranger_3.jpg",
            "img/stranger_4.jpg"
        ],
        desc: "Estantería en 4 niveles estilo grada para exhibir la colección completa de 12 figuras de Stranger Things de McDonald's junto a sus 12 casitas/cofres de colores detrás de cada personaje. Coronada con el cartel clásico 'WELCOME TO HAWKINS' en blanco y negro. Muñecos no incluidos.",
        variants: []
    },

    // 5. EXPOSITOR STITCH BURGER KING
    {
        id: "exp_stitch",
        name: "Expositor Stitch Burger King",
        price: 15.00,
        oldPrice: 19.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Top Wallapop & Vinted",
        badgeType: "teal",
        channelInfo: "Uno de los favoritos en Wallapop (5★) y Vinted (5★)",
        image: "img/stitch_1.jpg",
        gallery: [
            "img/stitch_1.jpg",
            "img/stitch_2.jpg",
            "img/stitch_3.jpg",
            "img/stitch_4.jpg"
        ],
        desc: "Expositor temático impreso en 3D para organizar y lucir toda la colección de figuras de Stitch de Burger King. Encajes a medida para evitar caídas y diseño calibrado para cada personaje. Muñecos no incluidos.",
        variants: []
    },

    // 6. CALENDARIO DE ADVIENTO / JOYERO DERPY K-POP DEMON HUNTERS
    {
        id: "adviento_derpy",
        name: "Calendario de Adviento / Joyero Derpy (K-Pop Demon Hunters)",
        price: 40.00,
        oldPrice: 45.00,
        category: "kpop",
        collection: "navidad",
        featured: true,
        badge: "Joya 24 Cajones",
        badgeType: "gold",
        channelInfo: "Números extraíbles: se convierte en joyero permanente",
        image: "img/derpy_1.jpg",
        video: "img/derpy_video.mp4",
        gallery: [
            "img/derpy_1.jpg",
            "img/derpy_2.jpg",
            "img/derpy_3.jpg",
            "img/derpy_4.jpg",
            "https://i.etsystatic.com/48356593/r/il/e9081b/7360675100/il_fullxfull.7360675100_tggm.jpg",
            "https://i.etsystatic.com/48356593/r/il/dbf5d0/7360671866/il_fullxfull.7360671866_4n37.jpg",
            "https://i.etsystatic.com/48356593/r/il/77d387/7360671884/il_fullxfull.7360671884_q6ip.jpg",
            "https://i.etsystatic.com/48356593/r/il/f3d14f/7408590641/il_fullxfull.7408590641_cmke.jpg"
        ],
        desc: "Calendario de Adviento de Derpy, el tigre azul de las K-Pop Demon Hunters (Huntrix). Cuando termines de descubrir las 24 sorpresas, quita los números de los pomos y tendrás un espectacular joyero de 24 cajones (3x3x3 cm cada cajón; medidas totales 21 cm ancho x 24 cm alto x 4 cm fondo).",
        variants: [
            {
                name: "Contenido del Calendario",
                options: [
                    { label: "Vacío para rellenar a tu gusto (40,00 €)", price: 40.00 },
                    { label: "Con 24 Sorpresas (24 Charms K-Pop Demon Hunters) (45,00 € • Envío Gratis)", price: 45.00 }
                ]
            }
        ]
    },

    // 7. EXPOSITOR MARIO KART MCDONALD'S (10 COCHES)
    {
        id: "exp_mariokart",
        name: "Expositor Colección Completa Mario Kart McDonald's (10 Coches)",
        price: 16.00,
        oldPrice: 28.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Desde 16,00 €",
        badgeType: "pink",
        channelInfo: "Relieves de copas GP y armas de Mario Kart en laterales",
        image: "img/mariokart_1.jpg",
        gallery: [
            "img/mariokart_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/19e629/6463558230/il_fullxfull.6463558230_66ga.jpg",
            "https://i.etsystatic.com/48356593/r/il/4f3d4d/6511660877/il_fullxfull.6511660877_jzfu.jpg",
            "https://i.etsystatic.com/48356593/r/il/ebf8a8/6415429872/il_fullxfull.6415429872_phrx.jpg",
            "https://i.etsystatic.com/48356593/r/il/cb38c0/6415430382/il_fullxfull.6415430382_3thr.jpg",
            "https://i.etsystatic.com/48356593/r/il/fc4b21/6463528739/il_fullxfull.6463528739_tg0l.jpg"
        ],
        desc: "Expositor de coches de Mario Kart para la colección completa de 10 karts de McDonald's. Decoraciones hendidas en laterales con los iconos de objetos/armas de Mario Kart y frontal superior con relieve de los GPs. Coches no incluidos.",
        variants: []
    },

    // 8. EXPOSITOR MUÑECOS DE FRIENDS MCDONALD'S
    {
        id: "exp_friends",
        name: "Expositor Muñecos de Friends McDonald's (Puerta de Mónica)",
        price: 20.00,
        oldPrice: 25.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Clásico 5★ Etsy",
        badgeType: "teal",
        channelInfo: "Morado original con el marco amarillo de la mirilla",
        image: "img/friends_1.jpg",
        gallery: [
            "img/friends_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/0820a6/6376219416/il_fullxfull.6376219416_fmnm.jpg",
            "https://i.etsystatic.com/48356593/r/il/5b2b56/6424301993/il_fullxfull.6424301993_6lum.jpg",
            "https://i.etsystatic.com/48356593/r/il/b223d6/6424300061/il_fullxfull.6424300061_vxrn.jpg",
            "https://i.etsystatic.com/48356593/r/il/575787/6424300065/il_fullxfull.6424300065_tfzd.jpg",
            "https://i.etsystatic.com/48356593/r/il/7516cc/6424302727/il_fullxfull.6424302727_tosa.jpg"
        ],
        desc: "Expositor para las 6 figuras de Friends de McDonald's. Impreso en el icónico color morado de la puerta del apartamento de Mónica con el marco amarillo en relieve y el logo oficial de Friends hendido en el frente. Muñecos no incluidos.",
        variants: []
    },

    // 9. EXPOSITOR MINECRAFT MCDONALD'S
    {
        id: "exp_minecraft",
        name: "Expositor Colección Minecraft McDonald's (6 Figuras)",
        price: 15.00,
        oldPrice: 20.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Precio Directo 15€",
        badgeType: "pink",
        channelInfo: "Logo M pixelado en amarillo sobre estructura roja",
        image: "img/minecraft_1.jpg",
        gallery: [
            "img/minecraft_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/a973f8/6839758209/il_fullxfull.6839758209_ik8d.jpg",
            "https://i.etsystatic.com/48356593/r/il/33b239/6791751514/il_fullxfull.6791751514_7o8w.jpg",
            "https://i.etsystatic.com/48356593/r/il/3a6e3a/6791751540/il_fullxfull.6791751540_rpcc.jpg",
            "https://i.etsystatic.com/48356593/r/il/4d11b6/6839758203/il_fullxfull.6839758203_ktvj.jpg"
        ],
        desc: "Expositor rojo con dos baldas amplias para la colección completa de 6 muñecos y cubos de McDonald's versión Minecraft. Incluye el arco de McDonald's en estética vóxel/píxel amarillo en relieve. Muñecos no incluidos.",
        variants: []
    },

    // 10. EXPOSITOR MIÉRCOLES (WEDNESDAY NEVERMORE)
    {
        id: "exp_miercoles",
        name: "Expositor Miércoles (Wednesday Addams • Ataúd Nevermore)",
        price: 18.00,
        oldPrice: 22.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Diseño Gótico 3D",
        badgeType: "teal",
        channelInfo: "Con escudo Nevermore Academy en relieve bicolor",
        image: "img/miercoles_1.jpg",
        gallery: [
            "img/miercoles_1.jpg"
        ],
        desc: "Expositor con silueta de ataúd en negro mate texturizado y detalles en morado Nevermore. Incluye la tipografía 'WEDNESDAY' en el compartimento superior, el escudo 'Unitas Est Invicta 1791' de Nevermore Academy en el inferior y ranuras hexagonales a medida para las peanas de las figuras. Figuras no incluidas.",
        variants: []
    },

    // 11. EXPOSITOR INDIVIDUAL TINY TAN MCDONALD'S
    {
        id: "exp_tinytan_ind",
        name: "Expositor Individual Tiny Tan BTS McDonald's",
        price: 6.00,
        oldPrice: 8.00,
        category: "kpop",
        collection: "expositores",
        featured: false,
        badge: "Personalizable 6€",
        badgeType: "pink",
        channelInfo: "Elige color y el nombre de tu bias de BTS en el frontal",
        image: "img/tinytan_indiv.jpg",
        gallery: [
            "img/tinytan_indiv.jpg",
            "https://i.etsystatic.com/48356593/r/il/c56b55/7293845331/il_fullxfull.7293845331_5r36.jpg",
            "https://i.etsystatic.com/48356593/r/il/dc67df/7293847323/il_fullxfull.7293847323_f4ej.jpg",
            "https://i.etsystatic.com/48356593/r/il/4f80c4/7245887896/il_fullxfull.7245887896_kp71.jpg",
            "https://i.etsystatic.com/48356593/r/il/f949b4/7303914415/il_fullxfull.7303914415_yacv.jpg"
        ],
        desc: "Peana expositora individual para una figura de la colección Tiny Tan de McDonald's. Incluye logos de BTS y Tiny Tan y permite personalizar el frontal con el nombre de tu integrante favorito o 'BTS'. Disponible en morado y rojo.",
        variants: [
            {
                name: "Color Principal",
                options: [
                    { label: "Morado Army" },
                    { label: "Rojo McDonald's" }
                ]
            },
            {
                name: "Nombre en el Frontal",
                options: [
                    { label: "BTS" },
                    { label: "RM" },
                    { label: "JIN" },
                    { label: "SUGA" },
                    { label: "J-HOPE" },
                    { label: "JIMIN" },
                    { label: "V" },
                    { label: "JUNG KOOK" },
                    { label: "Ninguno (Liso)" }
                ]
            }
        ]
    },

    // 12. LÁMPARA LITOFANÍA LAS MENINAS DE VELÁZQUEZ
    {
        id: "lampara_meninas",
        name: "Lámpara Litofanía 'Las Meninas' de Velázquez (25x25 cm LED)",
        price: 40.00,
        oldPrice: 45.00,
        category: "arte",
        collection: "lamparas",
        featured: false,
        badge: "Arte & Luz 3D",
        badgeType: "gold",
        channelInfo: "Marco 25x25 cm con retroiluminación LED USB e interruptor",
        image: "img/meninas_1.jpg",
        gallery: [
            "img/meninas_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/ad7f67/6516117182/il_fullxfull.6516117182_6gx8.jpg",
            "https://i.etsystatic.com/48356593/r/il/428f91/6516118706/il_fullxfull.6516118706_e1qx.jpg",
            "https://i.etsystatic.com/48356593/r/il/ad98b9/6516118730/il_fullxfull.6516118730_fxgk.jpg",
            "https://i.etsystatic.com/48356593/r/il/37bd8a/6564244133/il_fullxfull.6564244133_h1np.jpg"
        ],
        desc: "Litofanía de alta resolución del cuadro 'Las Meninas' de Diego Velázquez. Al encender su iluminación LED interna, el grosor milimétrico del PLA proyecta la obra maestra con calidad fotográfica. Marco blanco de 25x25 cm con cable USB e interruptor.",
        variants: []
    },

    // 13. RELOJ DE PARED TOY STORY (HABITACIÓN DE ANDY)
    {
        id: "reloj_toystory",
        name: "Reloj de Pared Inspirado en Toy Story (Habitación de Andy)",
        price: 18.00,
        oldPrice: 20.00,
        category: "arte",
        collection: "relojes",
        featured: false,
        badge: "Firma de Andy trasera",
        badgeType: "teal",
        channelInfo: "Manecillas inspiradas en Woody y Buzz Lightyear",
        image: "img/toystory_1.jpg",
        gallery: [
            "img/toystory_1.jpg",
            "https://i.etsystatic.com/48356593/r/il/9dbcd5/8312699101/il_fullxfull.8312699101_1zh8.jpg",
            "https://i.etsystatic.com/48356593/r/il/9db59f/8312699261/il_fullxfull.8312699261_pgwq.jpg",
            "https://i.etsystatic.com/48356593/r/il/04436e/8312698855/il_fullxfull.8312698855_dihn.jpg",
            "https://i.etsystatic.com/48356593/r/il/af693e/8312699021/il_fullxfull.8312699021_3vmt.jpg"
        ],
        desc: "Reloj de pared funcional basado en Toy Story: esfera azul cielo con las nubes blancas de la habitación de Andy, números en relieve con la tipografía original, manecillas inspiradas en Buzz Lightyear y Woody, y el detalle secreto de la firma de 'ANDY' en la parte trasera.",
        variants: []
    }
];

// Reseñas Verificadas Reales extraídas de c:\workspace\SIVISECRAFT\assets\etsy\reviews.json
const VERIFIED_REVIEWS = [
    {
        reviewer: "Alexandra",
        date: "24 Jul 2026",
        rating: 5,
        country: "🇷🇴 Rumanía (Cluj)",
        product: "Pack 2 Expositores Tiny Tan (Morado + Rojo)",
        message: "I ordered two collection displays, one purple and one red. They look great, just as described and really good quality. I was also very pleasantly surprised to find 2 keychains with a handwritten message included in the package, which honestly made my day! Would definitely recommend this seller.",
        order_id: 4114342051
    },
    {
        reviewer: "Time for beads",
        date: "09 Dic 2025",
        rating: 5,
        country: "🇪🇸 España",
        product: "Expositor Colección 3D",
        message: "Tal como se muestra en el anuncio. Buena calidad, encaja perfectamente. El vendedor me incluyó un regalo 🥰",
        order_id: 3894431277
    },
    {
        reviewer: "Petra",
        date: "10 Mar 2026",
        rating: 5,
        country: "🇩🇪 Alemania",
        product: "Expositor Muñecos Friends McDonald's",
        message: "Die Kaufabwicklung war problemlos, in den Aufsteller passen die Friends Figuren super rein.",
        order_id: 3910019102
    },
    {
        reviewer: "Paolo",
        date: "09 Feb 2026",
        rating: 5,
        country: "🇮🇹 Italia",
        product: "Expositor Muñecos Friends McDonald's",
        message: "Great display for the Friends McDonalds collectibles!",
        order_id: 3933937672
    },
    {
        reviewer: "Mizz",
        date: "19 Nov 2025",
        rating: 5,
        country: "🌍 Internacional",
        product: "Expositor Tiny Tan BTS",
        message: "Very cute display for my Tinytans 💜 Great customer service too :)",
        order_id: 3821219434
    },
    {
        reviewer: "Lisa",
        date: "23 Nov 2025",
        rating: 5,
        country: "🌍 Internacional",
        product: "Expositor Colección",
        message: "I love it! Looks exactly like on the pictures. Really beautiful to display your figures!",
        order_id: 3820124500
    },
    {
        reviewer: "TFBOYS",
        date: "02 Mar 2026",
        rating: 5,
        country: "🌍 Internacional",
        product: "Expositor + Llavero Regalo",
        message: "The item is very good and I also liked the keychains as a gift.",
        order_id: 3971266182
    },
    {
        reviewer: "Vadim",
        date: "27 Nov 2025",
        rating: 5,
        country: "🌍 Internacional",
        product: "Expositor K-Pop BTS",
        message: "Best thing to have for K-POP collection. Best item ever for K-POP fans!",
        order_id: 3837410262
    },
    {
        reviewer: "Erika",
        date: "15 Oct 2025",
        rating: 5,
        country: "🇩🇪 Alemania",
        product: "Expositor Tiny Tan Morado",
        message: "Aaah💜💜💜 Es ist Wunderschön.. Ich bin sehr sehr Glücklich. DANKESCHÖN NOCHMAL ❤️❤️",
        order_id: 3822211213
    },
    {
        reviewer: "Nese",
        date: "22 Dic 2025",
        rating: 5,
        country: "🇩🇪 Alemania",
        product: "Expositor 3D",
        message: "Toll verarbeitet und schnell geliefert.",
        order_id: 3896854708
    },
    {
        reviewer: "Heike",
        date: "11 Dic 2025",
        rating: 5,
        country: "🇩🇪 Alemania",
        product: "Expositor Colección",
        message: "Tolles Produkt genau wie beschrieben 👍🏻",
        order_id: 3878146675
    },
    {
        reviewer: "patrickderijck",
        date: "06 Feb 2026",
        rating: 5,
        country: "🇧🇪 Bélgica",
        product: "Expositor 3D",
        message: "Great item looks really great",
        order_id: 3953260236
    }
];

// ============================================================================
// DATOS DEL PASAPORTE SIVISECRAFT (PAÍSES, CIUDADES Y LOGROS DESBLOQUEADOS)
// ============================================================================
const PASSPORT_DATA = {
    stats: {
        totalOrders: 170,
        totalCountries: 16,
        totalCities: 56,
        averageRating: "4.9★",
        kmTraveled: "+47.200 km",
        bambuHours: "+1.960 h"
    },
    unlockedCountries: [
        {
            code: "ES",
            flag: "🇪🇸",
            name: "España",
            status: "Taller Base (Madrid)",
            orders: 86,
            percentage: 51,
            cities: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Bilbao", "Alicante", "Valladolid", "Vigo", "Gijón", "Palma de Mallorca", "Murcia", "Granada", "Córdoba", "Toledo", "Santander", "Oviedo", "Salamanca", "Santiago", "Badajoz", "Pamplona", "Albacete", "Castellón"]
        },
        {
            code: "DE",
            flag: "🇩🇪",
            name: "Alemania",
            status: "Top 1 Internacional",
            orders: 26,
            percentage: 15,
            cities: ["Berlín", "Múnich", "Hamburgo", "Frankfurt", "Colonia", "Stuttgart", "Düsseldorf", "Leipzig", "Dresde"]
        },
        {
            code: "FR",
            flag: "🇫🇷",
            name: "Francia",
            status: "Desbloqueado",
            orders: 16,
            percentage: 10,
            cities: ["París", "Lyon", "Marsella", "Burdeos", "Toulouse", "Estrasburgo", "Nantes", "Lille"]
        },
        {
            code: "IT",
            flag: "🇮🇹",
            name: "Italia",
            status: "Desbloqueado",
            orders: 12,
            percentage: 7,
            cities: ["Roma", "Milán", "Florencia", "Turín", "Bolonia", "Nápoles", "Verona"]
        },
        {
            code: "GB",
            flag: "🇬🇧",
            name: "Reino Unido",
            status: "Desbloqueado",
            orders: 11,
            percentage: 7,
            cities: ["Londres", "Manchester", "Edimburgo", "Birmingham", "Bristol", "Leeds"]
        },
        {
            code: "NL",
            flag: "🇳🇱",
            name: "Países Bajos",
            status: "Desbloqueado",
            orders: 7,
            percentage: 4,
            cities: ["Ámsterdam", "Róterdam", "Utrecht", "Eindhoven", "La Haya"]
        },
        {
            code: "BE",
            flag: "🇧🇪",
            name: "Bélgica",
            status: "Desbloqueado",
            orders: 5,
            percentage: 3,
            cities: ["Bruselas", "Amberes", "Gante", "Brujas", "Lieja"]
        },
        {
            code: "PT",
            flag: "🇵🇹",
            name: "Portugal",
            status: "Desbloqueado",
            orders: 4,
            percentage: 2,
            cities: ["Lisboa", "Oporto", "Coímbra", "Braga", "Faro"]
        },
        {
            code: "US",
            flag: "🇺🇸",
            name: "Estados Unidos",
            status: "Transatlántico",
            orders: 3,
            percentage: 2,
            cities: ["Nueva York", "Austin", "Chicago"]
        },
        {
            code: "CH",
            flag: "🇨🇭",
            name: "Suiza",
            status: "Desbloqueado",
            orders: 2,
            percentage: 1,
            cities: ["Zúrich", "Ginebra", "Basilea"]
        },
        {
            code: "AT",
            flag: "🇦🇹",
            name: "Austria",
            status: "Desbloqueado",
            orders: 2,
            percentage: 1,
            cities: ["Viena", "Salzburgo"]
        },
        {
            code: "PL",
            flag: "🇵🇱",
            name: "Polonia",
            status: "Desbloqueado",
            orders: 1,
            percentage: 1,
            cities: ["Varsovia", "Cracovia"]
        },
        {
            code: "SE",
            flag: "🇸🇪",
            name: "Suecia",
            status: "Nórdico",
            orders: 1,
            percentage: 1,
            cities: ["Estocolmo", "Gotemburgo"]
        },
        {
            code: "DK",
            flag: "🇩🇰",
            name: "Dinamarca",
            status: "Nórdico",
            orders: 1,
            percentage: 1,
            cities: ["Copenhague", "Aarhus"]
        },
        {
            code: "RO",
            flag: "🇷🇴",
            name: "Rumanía",
            status: "Europa del Este",
            orders: 1,
            percentage: 1,
            cities: ["Cluj-Napoca"]
        },
        {
            code: "CA",
            flag: "🇨🇦",
            name: "Canadá",
            status: "Transatlántico",
            orders: 1,
            percentage: 1,
            cities: ["New Ross"]
        }
    ],
    milestones: [
        {
            date: "28 Noviembre 2026",
            badge: "Nuevo País Desbloqueado",
            badgeType: "gold",
            title: "🇨🇦 ¡Canadá (New Ross) desbloqueado con el 1er Calendario Derpy!",
            desc: "Natasha desde New Ross (Canadá) estrena nuestro primer Calendario de Adviento de Derpy con 24 charms y convierte a Canadá en el territorio nº 16 del Pasaporte SiviseCraft.",
            icon: "🍁"
        },
        {
            date: "12 Octubre 2026",
            badge: "Nuevo País Desbloqueado",
            badgeType: "accent",
            title: "🇩🇰 Dinamarca entra en el Pasaporte SiviseCraft",
            desc: "Nuestro primer expositor 3D emprende viaje directo a Copenhague. ¡El frío nórdico tiene ahora un pedacito de diseño hecho en Madrid!",
            icon: "🚀"
        },
        {
            date: "15 Septiembre 2026",
            badge: "Hito Transatlántico",
            badgeType: "gold",
            title: "🇺🇸 ¡Cruzamos el charco! Desbloqueado Estados Unidos",
            desc: "Un coleccionista de Austin (Texas) nos encarga un set personalizado. Las creaciones del taller cruzan oficialmente el océano.",
            icon: "✈️"
        },
        {
            date: "24 Julio 2026",
            badge: "Reseña 5★ Internacional",
            badgeType: "teal",
            title: "🇷🇴 Rumanía (Cluj): 'Honestly made my day!'",
            desc: "Alexandra desde Cluj-Napoca recibe su pack de 2 expositores con llaveros sorpresa y nota manuscrita, y nos deja esta preciosa reseña 5 estrellas.",
            icon: "⭐"
        },
        {
            date: "10 Marzo 2026",
            badge: "Superventas Europeo",
            badgeType: "blue",
            title: "🇩🇪 Alemania se consolida como 2º mayor destino",
            desc: "Superamos los 25 pedidos enviados a territorio alemán (Berlín, Múnich, Frankfurt, Colonia...). ¡Vielen Dank!",
            icon: "📦"
        },
        {
            date: "09 Febrero 2026",
            badge: "Nuevo País Desbloqueado",
            badgeType: "accent",
            title: "🇮🇹 ¡Ciao Italia! Milán estrena expositor Friends",
            desc: "Paolo recibe su expositor en Milán para su colección de cafetería Central Perk. ¡Grande Paolo!",
            icon: "🍕"
        },
        {
            date: "15 Octubre 2025",
            badge: "Génesis del Taller",
            badgeType: "dark",
            title: "🇪🇸 Sale el Envío #SC-001 desde nuestro taller en Madrid",
            desc: "Víctor calibra la Bambu Lab A1, prepara la superficie de impresión y empaqueta el primer pedido de la historia de SiviseCraft.",
            icon: "🌱"
        }
    ]
};

// ============================================================================
// MOTOR DE CARRITO, ENVÍOS POR TRAMOS Y CHECKOUT DIRECTO (BIZUM + STRIPE)
// ============================================================================
const CART_STORAGE_KEY = "sivisecraft_official_cart_v1";
const SHIPPING_STORAGE_KEY = "sivisecraft_shipping_tier_v1";
const COUNTRY_STORAGE_KEY = "sivisecraft_country_v1";
const ORDERS_STORAGE_KEY = "sivisecraft_my_orders_v1";

function getSavedOrders() {
    try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCompletedOrder(orderObj) {
    const list = getSavedOrders().filter(o => o.orderId !== orderObj.orderId);
    list.unshift(orderObj);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
}

function getCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
    window.dispatchEvent(new Event("storage"));
}

function getSelectedCountryCode() {
    const saved = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (saved && SHIPPING_COUNTRIES.some(c => c.code === saved)) {
        return saved;
    }
    return "ES";
}

function getSelectedCountry() {
    const code = getSelectedCountryCode();
    return SHIPPING_COUNTRIES.find(c => c.code === code) || SHIPPING_COUNTRIES[0];
}

function setSelectedCountryCode(code) {
    const found = SHIPPING_COUNTRIES.find(c => c.code === code);
    if (!found) return;
    localStorage.setItem(COUNTRY_STORAGE_KEY, found.code);
    localStorage.setItem(SHIPPING_STORAGE_KEY, found.tier);
    trackHoldingEvent("select_country", found.code);
    updateCartUI();
    if (document.getElementById("stripe-overlay")?.classList.contains("open")) {
        renderCheckoutSummary();
    }
}

function getSelectedShippingTierId() {
    return getSelectedCountry().tier;
}

function setSelectedShippingTierId(tierId) {
    if (SHIPPING_TIERS[tierId]) {
        localStorage.setItem(SHIPPING_STORAGE_KEY, tierId);
        const matchCountry = SHIPPING_COUNTRIES.find(c => c.tier === tierId);
        if (matchCountry) localStorage.setItem(COUNTRY_STORAGE_KEY, matchCountry.code);
        updateCartUI();
        if (document.getElementById("stripe-overlay")?.classList.contains("open")) {
            renderCheckoutSummary();
        }
    }
}

function calculateShippingCost(subtotal, tierId) {
    if (subtotal <= 0) return 0.00;
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.espana;
    if (tier.freeThreshold && subtotal >= tier.freeThreshold) {
        return 0.00;
    }
    return tier.baseCost;
}

function formatPrice(num) {
    return num.toFixed(2).replace(".", ",") + " €";
}

function showToast(msg) {
    let toast = document.getElementById("sc-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sc-toast";
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#5eead4;font-weight:800;">✓</span> <span>${msg}</span>`;
    toast.classList.add("show");
    clearTimeout(window._scToastTimer);
    window._scToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// Añadir producto desde tarjeta o modal leyendo sus selectores de variante
function addProductToCartFromDOM(productId, containerPrefix = "card") {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    let finalPrice = product.price;
    const selectedOptions = [];

    if (product.variants && product.variants.length > 0) {
        product.variants.forEach((v, idx) => {
            const selectEl = document.getElementById(`${containerPrefix}-var-${productId}-${idx}`);
            if (selectEl) {
                const optIndex = selectEl.selectedIndex;
                const optObj = v.options[optIndex];
                if (optObj) {
                    selectedOptions.push(`${v.name}: ${optObj.label.replace(/\s*\([^)]*€[^)]*\)/g, "")}`);
                    if (typeof optObj.price === "number") {
                        finalPrice = optObj.price;
                    }
                }
            } else if (v.options[0]) {
                selectedOptions.push(`${v.name}: ${v.options[0].label.replace(/\s*\([^)]*€[^)]*\)/g, "")}`);
                if (typeof v.options[0].price === "number") {
                    finalPrice = v.options[0].price;
                }
            }
        });
    }

    const metaString = selectedOptions.join(" • ");
    const cartId = metaString ? `${product.id}__${metaString}` : product.id;

    let cart = getCart();
    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            cartId: cartId,
            name: product.name,
            price: finalPrice,
            image: product.image,
            qty: 1,
            meta: metaString
        });
    }

    saveCart(cart);
    showToast(`Añadido: ${product.name}`);
    trackHoldingEvent("add_to_cart", product.name || productId);
    if (containerPrefix === "detail") {
        closeDetailModal();
        toggleCartDrawer(true);
    }
}

// Añadir un producto directamente al carrito (útil para landings temáticas como Pichi Studio, packs o configuradores personalizados)
function addDirectItemToCart(item) {
    if (!item || !item.name || typeof item.price !== "number") return;
    let cart = getCart();
    const cartId = item.cartId || (item.meta ? `${item.id || 'custom'}__${item.meta}` : (item.id || 'custom'));
    const existing = cart.find(i => i.cartId === cartId);
    if (existing) {
        existing.qty += (item.qty || 1);
    } else {
        cart.push({
            id: item.id || "custom",
            cartId: cartId,
            name: item.name,
            price: item.price,
            image: item.image || "img/logo.svg",
            qty: item.qty || 1,
            meta: item.meta || ""
        });
    }
    saveCart(cart);
    updateCartUI();
    showToast(`Añadido: ${item.name}`);
    toggleCartDrawer(true);
}

// Actualizar precio en vivo cuando el usuario cambia una variante (ej. Pack 2 TinyTan o Dragon Ball Normal/LED)
function onVariantChange(productId, containerPrefix = "card") {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !product.variants) return;

    let newPrice = product.price;
    product.variants.forEach((v, idx) => {
        const selectEl = document.getElementById(`${containerPrefix}-var-${productId}-${idx}`);
        if (selectEl) {
            const optObj = v.options[selectEl.selectedIndex];
            if (optObj && typeof optObj.price === "number") {
                newPrice = optObj.price;
            }
        }
    });

    const priceEl = document.getElementById(`${containerPrefix}-price-${productId}`);
    if (priceEl) {
        priceEl.textContent = formatPrice(newPrice);
    }
}

// Renderizar una tarjeta de producto
function buildProductCardHTML(p) {
    const isEn = typeof getCurrentLang === "function" && getCurrentLang() === "en";
    const lp = typeof getLocalizedProduct === "function" ? getLocalizedProduct(p) : p;
    const badgeClass = p.badgeType === "teal" ? "teal" : (p.badgeType === "gold" ? "gold" : "");
    const galleryCount = p.gallery ? p.gallery.length : 1;

    let variantsHTML = "";
    if (p.variants && p.variants.length > 0) {
        variantsHTML = `<div class="product-variants-inline">`;
        p.variants.forEach((v, idx) => {
            const vName = typeof translateVariantLabel === "function" ? translateVariantLabel(v.name) : v.name;
            variantsHTML += `
                <div>
                    <div class="variant-row-label">${vName}</div>
                    <select id="card-var-${p.id}-${idx}" class="variant-select-sm" onchange="onVariantChange('${p.id}', 'card')">
                        ${v.options.map(o => `<option value="${o.label}">${typeof translateVariantLabel === "function" ? translateVariantLabel(o.label) : o.label}</option>`).join("")}
                    </select>
                </div>
            `;
        });
        variantsHTML += `</div>`;
    }

    return `
        <article class="product-card" data-category="${p.category}" data-id="${p.id}">
            <div class="product-media" onclick="openProductDetail('${p.id}')" title="${isEn ? "View real photo gallery & details" : "Ver galería de fotos reales y detalles"}">
                ${lp.badge ? `<span class="product-badge ${badgeClass}">${lp.badge}</span>` : ""}
                <img src="${p.image}" alt="${lp.name}" loading="lazy">
                ${galleryCount > 1 ? `<span class="product-gallery-count">📷 ${galleryCount} ${isEn ? "photos" : "fotos"}</span>` : ""}
            </div>
            <div class="product-details">
                ${p.designer ? `
                    <div style="font-size:0.75rem; color:var(--accent-stripe); font-weight:700; margin-bottom:4px; display:flex; align-items:center; gap:4px;">
                        🤝 ${isEn ? "Designed by" : "Diseñado por"} <strong>${p.designer.name}</strong>
                    </div>
                ` : `
                    <div style="font-size:0.72rem; color:var(--accent-pichi); font-weight:700; margin-bottom:4px;">
                        ${isEn ? "3D printed in our Madrid workshop" : (p.channelInfo || "Fabricado en nuestro taller de Madrid")}
                    </div>
                `}
                <div class="product-header-row">
                    <h3 onclick="openProductDetail('${p.id}')">${lp.name}</h3>
                    <div class="product-price-box">
                        <span class="product-price" id="card-price-${p.id}">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="product-old-price" title="${isEn ? "Price on marketplace platforms" : "Precio en plataformas con comisiones"}">${formatPrice(p.oldPrice)}</span>` : ""}
                    </div>
                </div>
                <p class="product-desc">${lp.desc}</p>
                ${variantsHTML}
                <div class="product-card-actions">
                    <button class="btn-icon-only" onclick="openProductDetail('${p.id}')" title="${isEn ? "View all photos & details" : "Ver todas las fotos y descripción"}">
                        🔍
                    </button>
                    <button class="btn btn-primary" onclick="addProductToCartFromDOM('${p.id}', 'card')">${isEn ? "🛒 Add to Cart" : "Añadir al Carrito"}</button>
                </div>
            </div>
        </article>
    `;
}

// Modal de Galería y Detalle de Producto
function openProductDetail(productId) {
    const p = PRODUCTS.find(item => item.id === productId);
    if (!p) return;

    trackHoldingEvent("view_product", p.name || productId);

    const modal = document.getElementById("product-detail-modal");
    const content = document.getElementById("product-detail-body");
    if (!modal || !content) return;

    const photos = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
    const lp = typeof getLocalizedProduct === "function" ? getLocalizedProduct(p) : p;

    let variantsHTML = "";
    if (p.variants && p.variants.length > 0) {
        variantsHTML = `<div style="margin: 16px 0; display:flex; flex-direction:column; gap:12px;">`;
        p.variants.forEach((v, idx) => {
            const vName = typeof translateVariantLabel === "function" ? translateVariantLabel(v.name) : v.name;
            variantsHTML += `
                <div>
                    <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:4px;">${vName}</label>
                    <select id="detail-var-${p.id}-${idx}" onchange="onVariantChange('${p.id}', 'detail')">
                        ${v.options.map(o => `<option value="${o.label}">${typeof translateVariantLabel === "function" ? translateVariantLabel(o.label) : o.label}</option>`).join("")}
                    </select>
                </div>
            `;
        });
        variantsHTML += `</div>`;
    }

    content.innerHTML = `
        <div class="modal-header">
            <h2>${lp.name}</h2>
            <button class="close-btn" onclick="closeDetailModal()">&times;</button>
        </div>
        <div class="detail-modal-grid">
            <div>
                <div class="detail-main-media" id="detail-main-Stage">
                    <img src="${photos[0]}" alt="${lp.name}" id="detail-main-img">
                </div>
                <div class="detail-thumbs-row">
                    ${photos.map((url, idx) => `
                        <div class="detail-thumb ${idx === 0 ? 'active' : ''}" onclick="switchDetailMedia('${url}', false, this)">
                            <img src="${url}" alt="Miniatura ${idx + 1}">
                        </div>
                    `).join("")}
                    ${p.video ? `
                        <div class="detail-thumb" onclick="switchDetailMedia('${p.video}', true, this)" style="display:flex;align-items:center;justify-content:center;background:#1A1F26;color:#fff;font-size:0.7rem;font-weight:700;">
                            ▶ Vídeo
                        </div>
                    ` : ""}
                </div>
            </div>
            <div style="display:flex; flex-direction:column;">
                ${p.designer ? `
                    <div style="background:rgba(13,148,136,0.08); border:1px solid rgba(13,148,136,0.25); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:12px; font-size:0.82rem; color:var(--text-primary); line-height:1.5;">
                        🤝 <strong>Diseño de Autor:</strong> ${p.designer.name} (${p.designer.handle}) • <em>${p.designer.bio}</em>.<br>
                        Fabricado bajo demanda con precisión Bambu Lab A1 en el taller SiviseCraft de Madrid. Royalty directo al autor con cada venta.
                    </div>
                ` : `
                    <div style="font-size:0.78rem; color:var(--accent-pichi); font-weight:700; margin-bottom:6px;">
                        ${p.channelInfo || "Impresión 3D de alta precisión en PLA biodegradable"}
                    </div>
                `}
                <div style="display:flex; align-items:baseline; gap:12px; margin-bottom:14px;">
                    <span class="config-price" id="detail-price-${p.id}">${formatPrice(p.price)}</span>
                    ${p.oldPrice ? `<span style="text-decoration:line-through; color:var(--text-secondary); font-size:0.9rem;">${(typeof getCurrentLang === "function" && getCurrentLang() === "en") ? "On Etsy:" : "En Etsy:"} ${formatPrice(p.oldPrice)}</span>` : ""}
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:14px;">
                    ${(typeof getLocalizedProduct === "function" ? getLocalizedProduct(p) : p).desc}
                </p>
                ${variantsHTML}
                <div style="background:var(--bg-primary); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:16px;">
                    ${(typeof getCurrentLang === "function" && getCurrentLang() === "en") ? `
                        <div>🚚 <strong>Spain Home Delivery:</strong> 6,00 € <span style="color:var(--accent-pichi);font-weight:700;">(FREE over 45€)</span></div>
                        <div>🇪🇺 <strong>European Union Tracked:</strong> 15,00 € <span style="color:var(--accent-pichi);font-weight:700;">(FREE over 90€)</span></div>
                        <div>✈️ <strong>Worldwide (USA, Canada, Mexico, Australia...):</strong> Tracked shipping</div>
                        <div>🎁 <strong>Free 3D-printed gift keychain included</strong> in every parcel</div>
                    ` : `
                        <div>🚚 <strong>España a Domicilio (Correos):</strong> 6,00 € <span style="color:var(--accent-pichi);font-weight:700;">(GRATIS en pedidos > 45€)</span></div>
                        <div>🌍 <strong>Unión Europea Certificado:</strong> 15,00 € <span style="color:var(--accent-pichi);font-weight:700;">(GRATIS en pedidos > 90€)</span></div>
                        <div>✈️ <strong>Internacional (USA, Canadá, México, Australia...):</strong> Con número de seguimiento oficial</div>
                        <div>🎁 <strong>Detalle sorpresa 3D incluido</strong> en cada paquete</div>
                    `}
                </div>
                <div style="margin-top:auto;">
                    <button class="btn btn-primary" onclick="addProductToCartFromDOM('${p.id}', 'detail')">${(typeof getCurrentLang === "function" && getCurrentLang() === "en") ? "🛒 Add to Cart & View Bag" : "🛒 Añadir al Carrito y Ver Cesta"}</button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add("open");
}

function switchDetailMedia(url, isVideo, thumbEl) {
    const stage = document.getElementById("detail-main-Stage");
    if (!stage) return;
    document.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");

    if (isVideo) {
        stage.innerHTML = `<video src="${url}" controls autoplay muted loop playsinline></video>`;
    } else {
        stage.innerHTML = `<img src="${url}" alt="Vista detallada">`;
    }
}

function closeDetailModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) modal.classList.remove("open");
}

// Actualizar UI del Carrito Lateral + Envío Automático por País
function updateCartUI() {
    const cart = getCart();
    const badge = document.getElementById("cart-badge");
    const itemsContainer = document.getElementById("cart-items");
    const countrySelect = document.getElementById("cart-country-select");
    const currentCountry = getSelectedCountry();
    const currentTierId = currentCountry.tier;
    const currentTier = SHIPPING_TIERS[currentTierId] || SHIPPING_TIERS.espana;

    if (countrySelect && countrySelect.value !== currentCountry.code) {
        countrySelect.value = currentCountry.code;
    }

    const autoHint = document.getElementById("cart-shipping-auto-hint");
    if (autoHint) {
        const cleanLabel = currentTier.label.replace(/\s*\([^)]*€[^)]*\)/g, "");
        autoHint.textContent = `${cleanLabel} • ${currentTier.freeThreshold ? `Gratis >${currentTier.freeThreshold}€` : formatPrice(currentTier.baseCost)}`;
    }

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
        badge.textContent = totalQty;
    }

    if (!itemsContainer) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, currentTierId);
    const total = subtotal + shipping;

    // Actualizar barra de envío gratis
    const freeBannerText = document.getElementById("free-shipping-text");
    const freeBannerFill = document.getElementById("free-shipping-fill");
    if (freeBannerText && freeBannerFill) {
        const tier = SHIPPING_TIERS[currentTierId] || SHIPPING_TIERS.espana;
        if (tier.freeThreshold) {
            if (subtotal >= tier.freeThreshold) {
                freeBannerText.innerHTML = `🎉 ¡Enhorabuena! Tienes <strong>ENVÍO GRATIS</strong> en tu pedido (> ${formatPrice(tier.freeThreshold)})`;
                freeBannerFill.style.width = "100%";
            } else {
                const missing = Math.max(0, tier.freeThreshold - subtotal);
                const pct = Math.min(100, Math.round((subtotal / tier.freeThreshold) * 100));
                freeBannerText.innerHTML = `🎁 Te faltan <strong>${formatPrice(missing)}</strong> para conseguir <strong>ENVÍO GRATIS</strong> (pedidos > ${formatPrice(tier.freeThreshold)})`;
                freeBannerFill.style.width = `${pct}%`;
            }
        } else {
            freeBannerText.innerHTML = `✈️ <strong>Envío Internacional con Seguimiento:</strong> Tarifa fija ${formatPrice(tier.baseCost)}`;
            freeBannerFill.style.width = "100%";
        }
    }

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <div style="font-size:2.2rem;">🛒</div>
                <p>Tu cesta está vacía.<br><span style="font-size:0.8rem;">Añade expositores o piezas personalizadas del catálogo.</span></p>
            </div>
        `;
        document.getElementById("cart-subtotal").textContent = "0,00 €";
        document.getElementById("cart-shipping").textContent = "0,00 €";
        document.getElementById("cart-total").textContent = "0,00 €";
        return;
    }

    itemsContainer.innerHTML = "";
    cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    ${item.meta ? `<div class="cart-item-meta">${item.meta}</div>` : ""}
                    <div class="cart-item-price">${formatPrice(lineTotal)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="changeCartQty('${item.cartId.replace(/'/g, "\\'")}', -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="changeCartQty('${item.cartId.replace(/'/g, "\\'")}', 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeCartItem('${item.cartId.replace(/'/g, "\\'")}')">Eliminar</button>
                </div>
            </div>
        `;
        itemsContainer.appendChild(div);
    });

    document.getElementById("cart-subtotal").textContent = formatPrice(subtotal);
    document.getElementById("cart-shipping").textContent = shipping === 0 ? "GRATIS (0,00 €)" : formatPrice(shipping);
    document.getElementById("cart-total").textContent = formatPrice(total);
}

function changeCartQty(cartId, delta) {
    let cart = getCart();
    const target = cart.find(i => i.cartId === cartId);
    if (target) {
        target.qty += delta;
        if (target.qty <= 0) {
            cart = cart.filter(i => i.cartId !== cartId);
        }
        saveCart(cart);
    }
}

function removeCartItem(cartId) {
    let cart = getCart().filter(i => i.cartId !== cartId);
    saveCart(cart);
}

function toggleCartDrawer(forceState) {
    const overlay = document.getElementById("cart-drawer-overlay");
    if (!overlay) return;
    if (typeof forceState === "boolean") {
        overlay.classList.toggle("open", forceState);
    } else {
        overlay.classList.toggle("open");
    }
    if (overlay.classList.contains("open")) {
        updateCartUI();
    }
}

// ============================================================================
// CHECKOUT DIRECTO (BIZUM 0% COMISIÓN + STRIPE TARJETA + DIRECCIÓN + WHATSAPP)
// ============================================================================
let activePaymentMethod = "bizum"; // 'bizum' (recomendado 0% comisión) o 'stripe'

function openDirectCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Añade primero algún producto al carrito");
        return;
    }
    toggleCartDrawer(false);
    trackHoldingEvent("open_checkout", `${cart.length} artículos`);
    const overlay = document.getElementById("stripe-overlay");
    if (!overlay) return;
    document.getElementById("stripe-success")?.classList.remove("active");
    const statusBadge = document.getElementById("stripe-summary-status-badge");
    if (statusBadge) statusBadge.style.display = "none";
    const countryBox = document.getElementById("checkout-country-box");
    if (countryBox) countryBox.style.display = "block";
    overlay.classList.add("open");
    renderCheckoutSummary();
    selectPaymentMethod(activePaymentMethod);
}

function closeDirectCheckout(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById("stripe-overlay");
    if (overlay) overlay.classList.remove("open");
}

function selectPaymentMethod(method) {
    activePaymentMethod = method;
    const tabBizum = document.getElementById("pay-tab-bizum");
    const tabStripe = document.getElementById("pay-tab-stripe");
    const boxBizum = document.getElementById("pay-box-bizum");
    const boxStripe = document.getElementById("pay-box-stripe");
    const submitBtn = document.getElementById("checkout-submit-btn");

    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = calculateShippingCost(subtotal, getSelectedShippingTierId());
    const total = subtotal + shipping;

    if (method === "bizum") {
        tabBizum?.classList.add("active");
        tabStripe?.classList.remove("active");
        if (boxBizum) boxBizum.style.display = "block";
        if (boxStripe) boxStripe.style.display = "none";
        if (submitBtn) submitBtn.textContent = `Confirmar Pedido con Bizum • ${formatPrice(total)}`;
    } else {
        tabStripe?.classList.add("active");
        tabBizum?.classList.remove("active");
        if (boxStripe) boxStripe.style.display = "block";
        if (boxBizum) boxBizum.style.display = "none";
        if (submitBtn) submitBtn.textContent = `Pagar con Tarjeta (Stripe) • ${formatPrice(total)}`;
    }
}

function renderCheckoutSummary() {
    const cart = getCart();
    const country = getSelectedCountry();
    const tierId = country.tier;
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.espana;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, tierId);
    const total = subtotal + shipping;

    const checkoutCountrySelect = document.getElementById("checkout-country-select");
    if (checkoutCountrySelect && checkoutCountrySelect.value !== country.code) {
        checkoutCountrySelect.value = country.code;
    }

    const etaHint = document.getElementById("checkout-shipping-eta");
    if (etaHint) {
        const cleanTier = tier.label.replace(/\s*\([^)]*€[^)]*\)/g, "");
        etaHint.innerHTML = `<strong>${cleanTier}</strong> · ${tier.eta}`;
    }

    const addrGroup = document.getElementById("checkout-address-group");
    const addrInput = document.getElementById("chk-address");
    if (addrGroup && addrInput) {
        addrInput.placeholder = tier.addressHint;
        addrInput.required = true;
    }

    document.getElementById("stripe-total-amount").textContent = formatPrice(total);
    document.getElementById("stripe-subtotal-cost").textContent = formatPrice(subtotal);
    document.getElementById("stripe-shipping-cost").textContent = shipping === 0 ? "GRATIS (0,00 €)" : formatPrice(shipping);

    const listContainer = document.getElementById("stripe-items-list");
    if (listContainer) {
        listContainer.innerHTML = "";
        cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "stripe-list-item";
            div.innerHTML = `
                <div class="stripe-list-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div>
                    <div class="stripe-list-item-title">${item.name}</div>
                    <div class="stripe-list-item-qty">Cant: ${item.qty} ${item.meta ? `• ${item.meta}` : ""}</div>
                </div>
                <div class="stripe-list-item-price">${formatPrice(item.price * item.qty)}</div>
            `;
            listContainer.appendChild(div);
        });
    }

    selectPaymentMethod(activePaymentMethod);
}

let lastCompletedOrder = null;

async function submitDirectOrder(e) {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) return;

    const name = document.getElementById("chk-name").value.trim();
    const email = document.getElementById("chk-email").value.trim();
    const phone = document.getElementById("chk-phone").value.trim();
    const address = document.getElementById("chk-address").value.trim();
    const zip = document.getElementById("chk-zip").value.trim();
    const city = document.getElementById("chk-city").value.trim();
    const notes = document.getElementById("chk-notes").value.trim();

    const country = getSelectedCountry();
    const tierId = country.tier;
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.espana;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, tierId);
    const total = subtotal + shipping;
    const orderId = "SC-" + Math.floor(10000 + Math.random() * 90000);

    lastCompletedOrder = {
        orderId,
        date: new Date().toLocaleDateString("es-ES"),
        method: activePaymentMethod === "bizum" ? "Bizum (0% comisión)" : "Tarjeta / Apple Pay (Stripe Checkout)",
        paymentType: activePaymentMethod,
        name,
        email,
        phone,
        countryCode: country.code,
        countryName: country.name,
        address: `${address}, ${zip} ${city} (${country.name})`,
        shippingId: tierId,
        shippingLabel: tier.label,
        subtotal,
        shipping,
        total,
        notes,
        status: activePaymentMethod === "bizum"
            ? "Pendiente de confirmación de Bizum"
            : "Iniciando pago en Stripe...",
        items: [...cart]
    };

    // Guardamos siempre el pedido en "Mis Pedidos / Seguimiento" del cliente
    saveCompletedOrder(lastCompletedOrder);
    trackHoldingEvent("order_submitted", activePaymentMethod);

    const proc = document.getElementById("stripe-processing");
    const procTitle = document.getElementById("stripe-processing-title");
    const procSub = document.getElementById("stripe-processing-sub");
    proc.classList.add("active");

    // Si eligió Stripe (Opción B), intentamos crear sesión real en /api/checkout
    if (activePaymentMethod === "stripe" && window.location.protocol.startsWith("http")) {
        if (procTitle) procTitle.textContent = "Conectando con la Pasarela Oficial de Stripe...";
        if (procSub) procSub.textContent = "Enviando tu cesta y dirección cifradas (256-bit SSL)";

        try {
            const resp = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    customer: { name, email, phone, address, zip, city, notes, countryCode: country.code, countryName: country.name },
                    countryCode: country.code,
                    shippingTierId: tier.id,
                    shippingTierLabel: tier.label,
                    shippingCost: shipping,
                    items: cart,
                    originUrl: window.location.origin
                })
            });

            if (resp.ok) {
                const data = await resp.json();
                if (data && data.url) {
                    saveCart([]);
                    window.location.href = data.url;
                    return;
                }
            }
        } catch (err) {
            // En entorno local sin Worker activo continúa al simulador local
        }
    }

    if (procTitle) procTitle.textContent = "Registrando tu Pedido en el Taller...";
    if (procSub) procSub.textContent = "Generando ficha de seguimiento #" + orderId;

    // Registrar pedido Bizum en Cloudflare D1 + disparar correos y alertas push automáticas
    if (activePaymentMethod === "bizum" && window.location.protocol.startsWith("http")) {
        try {
            await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    customer: { name, email, phone, address, zip, city, notes, countryCode: country.code, countryName: country.name },
                    countryCode: country.code,
                    shippingTierId: tier.id,
                    shippingTierLabel: tier.label,
                    items: cart
                })
            });
        } catch (_err) {
            // Si está en local sin Worker continúa sin bloquear
        }
    }

    setTimeout(() => {
        proc.classList.remove("active");
        saveCart([]);
        showOrderSuccessModal(lastCompletedOrder);
    }, 800);
}

function showOrderSuccessModal(orderObj) {
    lastCompletedOrder = orderObj;
    const overlay = document.getElementById("stripe-overlay");
    if (overlay) overlay.classList.add("open");

    // Sincronizar el panel izquierdo con los datos REALES del pedido completado (evita mostrar 0,00 € tras vaciar el carrito)
    const totalEl = document.getElementById("stripe-total-amount");
    const subEl = document.getElementById("stripe-subtotal-cost");
    const shipEl = document.getElementById("stripe-shipping-cost");
    const listContainer = document.getElementById("stripe-items-list");
    const countryBox = document.getElementById("checkout-country-box");
    const statusBadge = document.getElementById("stripe-summary-status-badge");

    const isBizum = String(orderObj.method || "").toLowerCase().includes("bizum");

    if (totalEl) totalEl.textContent = formatPrice(orderObj.total || 0);
    if (subEl) subEl.textContent = formatPrice(orderObj.subtotal || 0);
    if (shipEl) shipEl.textContent = (orderObj.shipping === 0) ? "GRATIS (0,00 €)" : formatPrice(orderObj.shipping || 0);
    if (countryBox) countryBox.style.display = "none";

    if (statusBadge) {
        statusBadge.style.display = "inline-flex";
        if (isBizum) {
            statusBadge.style.background = "#fef3c7";
            statusBadge.style.color = "#92400e";
            statusBadge.style.borderColor = "#fcd34d";
            statusBadge.textContent = "⏳ PENDIENTE DE BIZUM";
        } else {
            statusBadge.style.background = "#dcfce7";
            statusBadge.style.color = "#166534";
            statusBadge.style.borderColor = "#86efac";
            statusBadge.textContent = "✅ PEDIDO PAGADO";
        }
    }

    if (listContainer && Array.isArray(orderObj.items)) {
        listContainer.innerHTML = orderObj.items.map(item => `
            <div class="stripe-list-item">
                <div class="stripe-list-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div>
                    <div class="stripe-list-item-title">${item.name}</div>
                    <div class="stripe-list-item-qty">Cant: ${item.qty} ${item.meta ? `• ${item.meta}` : ""}</div>
                </div>
                <div class="stripe-list-item-price">${formatPrice(item.price * item.qty)}</div>
            </div>
        `).join("");
    }

    const succ = document.getElementById("stripe-success");
    if (!succ) return;

    const titleEl = document.getElementById("receipt-title");
    const subtitleEl = document.getElementById("receipt-subtitle");
    const bizumWarnEl = document.getElementById("receipt-bizum-warning");

    if (titleEl) {
        titleEl.textContent = isBizum ? "¡Pedido Registrado! Falta tu Bizum" : "¡Pago Confirmado con Éxito!";
    }
    if (subtitleEl) {
        subtitleEl.textContent = isBizum
            ? "Hemos reservado tu orden de taller. Realiza ahora el Bizum y pulsa el botón de WhatsApp para confirmarlo."
            : "¡Muchas gracias! Hemos recibido tu pago por Stripe y tu pedido ya está en nuestra cola de impresión 3D.";
    }
    if (bizumWarnEl) {
        if (isBizum) {
            bizumWarnEl.style.display = "block";
            bizumWarnEl.innerHTML = `⚠️ <strong>AVISO IMPORTANTE:</strong> Este pedido <strong>no se realizará ni se enviará hasta la confirmación del pago por Bizum</strong> de <strong>${formatPrice(orderObj.total)}</strong> al móvil <strong>${STORE_CONFIG.bizumPhone}</strong> indicando el concepto <strong>${orderObj.orderId}</strong>.`;
        } else {
            bizumWarnEl.style.display = "none";
        }
    }

    document.getElementById("receipt-order-id").textContent = orderObj.orderId;
    document.getElementById("receipt-name").textContent = `${orderObj.name} (${orderObj.phone})`;
    document.getElementById("receipt-shipping").textContent = `${orderObj.shippingLabel}`;
    document.getElementById("receipt-address").textContent = orderObj.address;
    document.getElementById("receipt-method").textContent = orderObj.method;
    document.getElementById("receipt-amount").textContent = formatPrice(orderObj.total);
    succ.classList.add("active");
}

function openTrackingModal() {
    const modal = document.getElementById("tracking-modal");
    if (!modal) return;
    renderTrackingOrders();
    modal.classList.add("open");
}

function closeTrackingModal() {
    const modal = document.getElementById("tracking-modal");
    if (modal) modal.classList.remove("open");
}

function renderTrackingOrders(searchCode = "") {
    const container = document.getElementById("tracking-orders-list");
    if (!container) return;

    const orders = getSavedOrders();
    const cleanSearch = searchCode.trim().toUpperCase();
    const filtered = cleanSearch
        ? orders.filter(o => o.orderId.toUpperCase().includes(cleanSearch))
        : orders;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="background:var(--bg-primary); border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; color:var(--text-secondary); font-size:0.88rem;">
                ${cleanSearch
                    ? `No hemos encontrado el pedido <strong>${cleanSearch}</strong> en este navegador. Pulsa debajo para consultarlo directamente con Víctor por WhatsApp indicando tu código o nombre.`
                    : `Aún no tienes pedidos guardados en este dispositivo. Cuando realices un pedido, aquí verás tu recibo, dirección y estado de fabricación/envío.`
                }
                <div style="margin-top:14px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('¡Hola Víctor! Quería consultar el estado de mi pedido ' + (cleanSearch || 'en SiviseCraft'))}" target="_blank" class="btn btn-teal" style="width:auto; padding:9px 16px; font-size:0.8rem;">
                        💬 Consultar por WhatsApp
                    </a>
                    <a href="https://www.inpost.es/seguimiento-de-envio/" target="_blank" rel="noopener" class="btn btn-secondary" style="width:auto; padding:9px 16px; font-size:0.8rem;">
                        📦 Localizador InPost
                    </a>
                    <a href="https://www.correos.es/es/es/herramientas/localizador/envios" target="_blank" rel="noopener" class="btn btn-secondary" style="width:auto; padding:9px 16px; font-size:0.8rem;">
                        🚚 Localizador Correos
                    </a>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(o => `
        <div style="background:var(--bg-primary); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:1px dashed var(--border); padding-bottom:10px; margin-bottom:12px;">
                <div>
                    <span style="font-family:var(--font-mono); font-weight:800; font-size:1rem; color:var(--accent-stripe);">${o.orderId}</span>
                    <span style="font-size:0.78rem; color:var(--text-secondary); margin-left:8px;">📅 ${o.date}</span>
                </div>
                <span style="background:rgba(13,148,136,0.1); color:var(--accent-pichi); font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:20px;">
                    🖨️ ${o.status || "Recibido en Taller 3D"}
                </span>
            </div>

            <!-- Barra de progreso de 3 etapas del pedido -->
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; font-size:0.74rem; text-align:center;">
                <div style="background:#fff; border:1px solid var(--accent-pichi); color:var(--accent-pichi); padding:6px; border-radius:var(--radius-sm); font-weight:700;">
                    1. ✓ Orden Recibida
                </div>
                <div style="background:#fff; border:1px solid var(--accent-pichi); color:var(--text-primary); padding:6px; border-radius:var(--radius-sm); font-weight:700;">
                    2. 🖨️ Impresión 3D y Calidad
                </div>
                <div style="background:#fff; border:1px solid var(--border); color:var(--text-secondary); padding:6px; border-radius:var(--radius-sm);">
                    3. 📦 Envío + Localizador
                </div>
            </div>

            <div style="font-size:0.82rem; color:var(--text-primary); margin-bottom:8px;">
                <strong>Artículos:</strong> ${o.items.map(i => `${i.qty}x ${i.name}`).join(", ")}
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">
                📍 <strong>Entrega:</strong> ${o.shippingLabel} — ${o.address} • <strong>Total:</strong> ${formatPrice(o.total)} (${o.method})
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent('¡Hola Víctor! Te escribo por mi pedido ' + o.orderId + ' (' + o.name + ')')}" target="_blank" class="btn btn-teal" style="width:auto; padding:7px 14px; font-size:0.76rem;">
                    💬 Preguntar estado por WhatsApp
                </a>
                <a href="https://www.inpost.es/seguimiento-de-envio/" target="_blank" rel="noopener" class="btn btn-secondary" style="width:auto; padding:7px 14px; font-size:0.76rem;">
                    📦 Web InPost
                </a>
                <a href="https://www.correos.es/es/es/herramientas/localizador/envios" target="_blank" rel="noopener" class="btn btn-secondary" style="width:auto; padding:7px 14px; font-size:0.76rem;">
                    🚚 Web Correos
                </a>
            </div>
        </div>
    `).join("");
}

function sendOrderViaWhatsApp() {
    if (!lastCompletedOrder) return;
    const o = lastCompletedOrder;
    const itemsLines = o.items.map(i => `• ${i.qty}x ${i.name} ${i.meta ? `(${i.meta})` : ""} — ${formatPrice(i.price * i.qty)}`).join("\n");
    const text = `¡Hola Víctor! 👋 Acabo de hacer un pedido en www.sivisecraft.es:\n\n` +
        `🧾 *Pedido:* ${o.orderId}\n` +
        `💳 *Pago:* ${o.method}\n` +
        `🚚 *Envío:* ${o.shippingLabel} (${o.shipping === 0 ? "GRATIS" : formatPrice(o.shipping)})\n` +
        `💰 *Total:* ${formatPrice(o.total)}\n\n` +
        `📦 *Productos:*\n${itemsLines}\n\n` +
        `📍 *Datos de entrega:*\n${o.name}\n${o.address}\nTel: ${o.phone} | Email: ${o.email}` +
        (o.notes ? `\n📝 *Notas:* ${o.notes}` : "");

    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
}

function exitCheckoutSuccess() {
    saveCart([]);
    document.getElementById("stripe-success")?.classList.remove("active");
    document.getElementById("stripe-overlay")?.classList.remove("open");
}

function checkStripeReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pago") === "ok") {
        const orderId = params.get("order");
        const orders = getSavedOrders();
        const found = orderId ? orders.find(o => o.orderId === orderId) : orders[0];
        saveCart([]);
        if (found) {
            found.status = "Pagado por Stripe • En cola de impresión 3D";
            saveCompletedOrder(found);
            showOrderSuccessModal(found);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ============================================================================
// INYECTAR COMPONENTES COMPARTIDOS (DRAWER CARRITO, MODALES Y CHECKOUT)
// ============================================================================
function injectSharedStoreModals() {
    const wrapper = document.getElementById("shared-modals-mount");
    if (!wrapper) return;

    const countryOptionsHTML = SHIPPING_COUNTRIES.map(c => {
        const t = SHIPPING_TIERS[c.tier] || SHIPPING_TIERS.espana;
        const priceTag = `${t.baseCost.toFixed(2).replace(".", ",")} €${t.freeThreshold ? ` • Gratis >${t.freeThreshold}€` : ""}`;
        return `<option value="${c.code}">${c.name} (${priceTag})</option>`;
    }).join("");

    wrapper.innerHTML = `
        <!-- Modal Seguimiento de Pedidos (Mis Pedidos) -->
        <div id="tracking-modal" class="modal-overlay" onclick="closeTrackingModal()">
            <div class="modal-container" onclick="event.stopPropagation()" style="max-width:680px;">
                <div class="modal-header">
                    <h2>📦 Seguimiento de Pedidos y Envíos</h2>
                    <button class="close-btn" onclick="closeTrackingModal()">&times;</button>
                </div>
                <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:14px;">
                    Consulta el estado de fabricación 3D de tus pedidos o busca por tu código <strong>#SC-XXXXX</strong>. En cuanto depositamos tu paquete en Correos, recibirás además un SMS/Email oficial con el número de seguimiento.
                </p>
                <div style="display:flex; gap:10px; margin-bottom:18px;">
                    <input type="text" id="tracking-search-input" class="text-input" placeholder="Buscar por código de pedido (ej. SC-48291)..." oninput="renderTrackingOrders(this.value)">
                </div>
                <div id="tracking-orders-list" style="max-height:380px; overflow-y:auto;"></div>
            </div>
        </div>

        <!-- Modal Vista Detallada de Producto -->
        <div id="product-detail-modal" class="modal-overlay" onclick="closeDetailModal()">
            <div class="modal-container" onclick="event.stopPropagation()" id="product-detail-body"></div>
        </div>

        <!-- Carrito Lateral Interactivo (Cart Drawer) -->
        <div id="cart-drawer-overlay" class="cart-drawer-overlay" onclick="toggleCartDrawer(false)">
            <div class="cart-drawer" onclick="event.stopPropagation()">
                <div class="cart-header">
                    <h2>Tu Cesta de Pedidos</h2>
                    <button class="close-btn" onclick="toggleCartDrawer(false)">&times;</button>
                </div>
                <div class="free-shipping-banner">
                    <div id="free-shipping-text">🎁 Envío GRATIS en pedidos de +45,00 € (Península)</div>
                    <div class="free-shipping-progress-bg">
                        <div id="free-shipping-fill" class="free-shipping-progress-fill" style="width: 0%;"></div>
                    </div>
                </div>
                <div id="cart-items" class="cart-items"></div>
                <div class="cart-footer">
                    <div class="shipping-tier-box">
                        <label for="cart-country-select">País de Destino (Envío automático)</label>
                        <select id="cart-country-select" class="shipping-tier-select" onchange="setSelectedCountryCode(this.value)">
                            ${countryOptionsHTML}
                        </select>
                        <div id="cart-shipping-auto-hint" style="font-size:0.74rem; color:var(--accent-pichi); margin-top:4px; font-weight:600;"></div>
                    </div>
                    <div class="cart-totals-row">
                        <span>Subtotal productos</span>
                        <span id="cart-subtotal" style="font-weight: 700;">0,00 €</span>
                    </div>
                    <div class="cart-totals-row">
                        <span>Gastos de envío</span>
                        <span id="cart-shipping" style="font-weight: 700; color: var(--accent-pichi);">0,00 €</span>
                    </div>
                    <div class="cart-totals-row total">
                        <span>Total a Pagar</span>
                        <span id="cart-total">0,00 €</span>
                    </div>
                    <button onclick="openDirectCheckout()" class="btn btn-primary" style="margin-top: 12px; font-size:0.95rem; padding:14px;">
                        Tramitar Pedido (Bizum / Tarjeta) &rarr;
                    </button>
                </div>
            </div>
        </div>

        <!-- Pantalla de Checkout Directo (Bizum 0% Comisión + Stripe Checkout) -->
        <div id="stripe-overlay" class="stripe-overlay">
            <div class="stripe-container">
                <div class="stripe-summary-panel">
                    <a href="#" class="stripe-back-btn" onclick="closeDirectCheckout(event)">
                        &larr; Volver a la tienda SiviseCraft
                    </a>
                    <div class="stripe-merchant">
                        <img src="img/logo.svg" alt="SiviseCraft" style="height:28px; width:auto;">
                        <span>SiviseCraft Oficial</span>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top: 16px;">
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Importe total del pedido</div>
                        <span id="stripe-summary-status-badge" style="display:none; font-size:0.72rem; font-weight:800; padding:3px 10px; border-radius:999px; border:1px solid transparent;"></span>
                    </div>
                    <div id="stripe-total-amount" class="stripe-total-amount">0,00 €</div>

                    <div id="checkout-country-box" class="form-group" style="margin-bottom:16px;">
                        <label for="checkout-country-select">País de Destino (tarifa asignada automáticamente)</label>
                        <select id="checkout-country-select" class="shipping-tier-select" onchange="setSelectedCountryCode(this.value)">
                            ${countryOptionsHTML}
                        </select>
                        <div id="checkout-shipping-eta" style="font-size:0.75rem; color:var(--accent-pichi); margin-top:5px; font-weight:600;"></div>
                    </div>

                    <div id="stripe-items-list" style="margin-top: 16px; max-height: 260px; overflow-y:auto;"></div>

                    <div class="stripe-fee-row" style="margin-top: 16px;">
                        <span>Subtotal</span>
                        <span id="stripe-subtotal-cost" style="font-weight:600;">0,00 €</span>
                    </div>
                    <div class="stripe-fee-row">
                        <span>Gastos de Envío</span>
                        <span id="stripe-shipping-cost" style="font-weight:700; color:var(--accent-pichi);">0,00 €</span>
                    </div>
                    <div style="margin-top:20px; padding:12px; background:#fff; border:1px solid var(--border); border-radius:var(--radius-md); font-size:0.78rem; color:var(--text-secondary);">
                        🎁 <strong>Promesa Taller SiviseCraft:</strong> Todos los pedidos se embalan a mano en Madrid e incluyen un llavero impreso en 3D de regalo.
                    </div>
                </div>

                <div class="stripe-payment-panel" style="position: relative;">
                    <!-- Procesando -->
                    <div id="stripe-processing" class="processing-overlay">
                        <div class="processing-spinner"></div>
                        <h3 id="stripe-processing-title" style="font-family: var(--font-heading); margin-bottom: 8px;">Registrando tu Pedido en el Taller...</h3>
                        <p id="stripe-processing-sub" style="color: var(--text-secondary); font-size: 0.85rem;">Generando orden de fabricación y recibo oficial</p>
                    </div>

                    <!-- Confirmación de Pedido -->
                    <div id="stripe-success" class="success-overlay">
                        <div class="success-icon-wrapper">&check;</div>
                        <h2 id="receipt-title" style="font-family: var(--font-title); font-weight: 800; margin-bottom: 6px; color: var(--text-primary);">¡Pedido Registrado!</h2>
                        <p id="receipt-subtitle" style="color: var(--text-secondary); font-size: 0.88rem;">Hemos generado tu orden de taller. Puedes enviarnos la confirmación en 1 clic por WhatsApp para agilizar el envío.</p>

                        <div id="receipt-bizum-warning" style="display:none; width:100%; background:#fef2f2; border:1.5px solid #f87171; color:#991b1b; padding:12px 14px; border-radius:10px; font-size:0.84rem; line-height:1.45; margin:12px 0 6px; text-align:left;"></div>

                        <div class="order-receipt">
                            <div class="receipt-row">
                                <span>Nº de Pedido</span>
                                <span id="receipt-order-id">SC-00000</span>
                            </div>
                            <div class="receipt-row">
                                <span>Cliente</span>
                                <span id="receipt-name">-</span>
                            </div>
                            <div class="receipt-row">
                                <span>Modalidad de Entrega</span>
                                <span id="receipt-shipping">-</span>
                            </div>
                            <div class="receipt-row">
                                <span>Dirección / Destino</span>
                                <span id="receipt-address">-</span>
                            </div>
                            <div class="receipt-row">
                                <span>Método de Pago</span>
                                <span id="receipt-method">-</span>
                            </div>
                            <div class="receipt-row">
                                <span>Total del Pedido</span>
                                <span id="receipt-amount" style="color: var(--accent-pichi); font-weight: 800;">0,00 €</span>
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                            <button type="button" class="btn btn-teal" onclick="sendOrderViaWhatsApp()">
                                💬 Enviar Confirmación por WhatsApp a Víctor
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="exitCheckoutSuccess()">
                                Volver a la Tienda
                            </button>
                        </div>
                    </div>

                    <h3 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 6px;">1. Elige tu Método de Pago</h3>
                    <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:12px;">Sin comisiones ocultas de intermediarios.</p>

                    <div class="stripe-tabs">
                        <button type="button" id="pay-tab-bizum" class="payment-tab-btn active" onclick="selectPaymentMethod('bizum')">
                            <span>📱 Pagar con Bizum</span>
                            <span class="sub">★ Recomendado • 0% Comisiones</span>
                        </button>
                        <button type="button" id="pay-tab-stripe" class="payment-tab-btn" onclick="selectPaymentMethod('stripe')">
                            <span>💳 Tarjeta / Apple Pay</span>
                            <span class="sub">Pasarela Segura Stripe</span>
                        </button>
                    </div>

                    <form id="checkout-form" onsubmit="submitDirectOrder(event)">
                        <h3 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 10px;">2. Datos de Envío y Contacto</h3>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <input type="text" id="chk-name" required class="stripe-input" placeholder="Nombre y Apellidos *">
                            <input type="tel" id="chk-phone" required class="stripe-input" placeholder="Teléfono móvil (Bizum / Avisos) *">
                        </div>
                        <input type="email" id="chk-email" required class="stripe-input" placeholder="Correo electrónico para seguimiento *">

                        <div id="checkout-address-group">
                            <input type="text" id="chk-address" required class="stripe-input" placeholder="Dirección completa de entrega a domicilio *">
                            <div style="display:grid; grid-template-columns: 0.4fr 0.6fr; gap:10px;">
                                <input type="text" id="chk-zip" required class="stripe-input" placeholder="C. Postal *">
                                <input type="text" id="chk-city" required class="stripe-input" placeholder="Ciudad / Provincia *">
                            </div>
                        </div>

                        <input type="text" id="chk-notes" class="stripe-input" placeholder="Notas opcionales (ej. nombre para botella, colores pack, horario...)">

                        <!-- Caja Bizum -->
                        <div id="pay-box-bizum" class="bizum-instructions-card">
                            <h4>📱 Pago Directo por Bizum (Instantáneo y 0% Comisiones)</h4>
                            <p style="color:var(--text-secondary); line-height:1.45; margin-bottom:10px;">
                                Envía tu Bizum al móvil <strong>${STORE_CONFIG.bizumPhone}</strong> indicando tu código de pedido <strong>#SC</strong> en el concepto.
                            </p>
                            <div style="background:#fef2f2; border:1.5px solid #f87171; color:#991b1b; padding:10px 12px; border-radius:8px; font-size:0.82rem; font-weight:700; line-height:1.45;">
                                ⚠️ AVISO IMPORTANTE: Este pedido no se realizará ni se enviará hasta la confirmación del pago por Bizum.
                            </div>
                        </div>

                        <!-- Caja Stripe Tarjeta (Opción B: Pasarela Oficial Stripe Checkout con dirección ya vinculada) -->
                        <div id="pay-box-stripe" class="bizum-instructions-card" style="display:none; background:rgba(219,39,119,0.05); border-color:rgba(219,39,119,0.22);">
                            <h4 style="color:var(--accent-stripe);">💳 Pasarela Oficial Stripe Checkout (Tarjeta / Apple Pay / Google Pay)</h4>
                            <p style="color:var(--text-secondary); line-height:1.45;">
                                <strong>No tienes que volver a escribir tu dirección:</strong> los datos de envío que acabas de rellenar arriba quedan vinculados automáticamente a tu pedido <strong>#SC</strong>. Al pulsar el botón te llevaremos a la pantalla segura de Stripe con tu importe exacto bloqueado.
                            </p>
                        </div>

                        <button type="submit" id="checkout-submit-btn" class="stripe-payment-btn">
                            Confirmar Pedido
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Renderizar tarjetas de reseñas verificadas
function renderVerifiedReviews(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const list = limit ? VERIFIED_REVIEWS.slice(0, limit) : VERIFIED_REVIEWS;

    container.innerHTML = list.map(r => `
        <div class="review-card">
            <div>
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${r.reviewer.charAt(0).toUpperCase()}</div>
                        <div>
                            <div class="reviewer-name">${r.reviewer}</div>
                            <div class="review-date">${r.date} • ${replaceFlagEmojisWithImg(r.country)}</div>
                        </div>
                    </div>
                    <div class="reviews-stars">${"★".repeat(r.rating)}</div>
                </div>
                <p class="review-message">"${r.message}"</p>
            </div>
            <div class="review-verified">
                <span>✓ Compra verificada (#${r.order_id})</span>
                <span style="margin-left:auto; color:var(--text-secondary); font-weight:600;">${r.product}</span>
            </div>
        </div>
    `).join("");
}

// Manejador de clic/toque para el submenú de Colecciones en la barra superior
document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".nav-dropdown-toggle");
    const dropdown = e.target.closest(".nav-dropdown");
    if (toggle && dropdown) {
        if (!window.matchMedia("(hover: hover)").matches || e.pointerType === "touch") {
            e.preventDefault();
            dropdown.classList.toggle("open");
        }
    } else if (!e.target.closest(".nav-dropdown-menu")) {
        document.querySelectorAll(".nav-dropdown.open").forEach(d => d.classList.remove("open"));
    }
});

// Reemplazar emojis de banderas de países por banderas vectoriales SVG reales (para compatibilidad universal en Windows, Mac, Android e iOS)
function replaceFlagEmojisWithImg(text) {
    if (!text) return text;
    const emojiMap = {
        "🇪🇸": "es", "🇩🇪": "de", "🇫🇷": "fr", "🇮🇹": "it",
        "🇬🇧": "gb", "🇳🇱": "nl", "🇧🇪": "be", "🇵🇹": "pt",
        "🇺🇸": "us", "🇨🇦": "ca", "🇨🇭": "ch", "🇦🇹": "at",
        "🇵🇱": "pl", "🇸🇪": "se", "🇩🇰": "dk", "🇷🇴": "ro"
    };
    return text.replace(/🇪🇸|🇩🇪|🇫🇷|🇮🇹|🇬🇧|🇳🇱|🇧🇪|🇵🇹|🇺🇸|🇨🇦|🇨🇭|🇦🇹|🇵🇱|🇸🇪|🇩🇰|🇷🇴/g, (match) => {
        const code = emojiMap[match];
        return `<img src="img/flags/${code}.svg" class="inline-flag-img" alt="Bandera ${code.toUpperCase()}" loading="lazy">`;
    });
}

// Renderizar página completa del Pasaporte SiviseCraft
function renderPassportPage() {
    const isEn = typeof getCurrentLang === "function" && getCurrentLang() === "en";
    const statsMount = document.getElementById("passport-stats-mount");
    if (statsMount) {
        const s = PASSPORT_DATA.stats;
        statsMount.innerHTML = `
            <div class="passport-stat-card">
                <div class="passport-stat-num highlight">${s.totalCountries}</div>
                <div class="passport-stat-label">${isEn ? "Countries Unlocked" : "Países Desbloqueados"}</div>
            </div>
            <div class="passport-stat-card">
                <div class="passport-stat-num">${s.totalCities}</div>
                <div class="passport-stat-label">${isEn ? "Cities Reached" : "Ciudades Destino"}</div>
            </div>
            <div class="passport-stat-card">
                <div class="passport-stat-num">${s.totalOrders}</div>
                <div class="passport-stat-label">${isEn ? "Orders Delivered" : "Envíos Entregados"}</div>
            </div>
            <div class="passport-stat-card">
                <div class="passport-stat-num highlight">${s.averageRating}</div>
                <div class="passport-stat-label">${isEn ? "Average Rating" : "Valoración Media"}</div>
            </div>
            <div class="passport-stat-card">
                <div class="passport-stat-num">${s.kmTraveled}</div>
                <div class="passport-stat-label">${isEn ? "Km Traveled" : "Km Recorridos"}</div>
            </div>
        `;
    }

    const milestonesMount = document.getElementById("passport-milestones-mount");
    if (milestonesMount) {
        milestonesMount.innerHTML = PASSPORT_DATA.milestones.map(m => `
            <div class="milestone-card">
                <div class="milestone-icon">${m.icon}</div>
                <div class="milestone-body">
                    <div class="milestone-header">
                        <span class="milestone-badge ${m.badgeType || ''}">${m.badge}</span>
                        <span class="milestone-date">${m.date}</span>
                    </div>
                    <h4 class="milestone-title">${replaceFlagEmojisWithImg(m.title)}</h4>
                    <p class="milestone-desc">${replaceFlagEmojisWithImg(m.desc)}</p>
                </div>
            </div>
        `).join("");
    }

    const countriesMount = document.getElementById("passport-countries-mount");
    if (countriesMount) {
        const countryEnNames = {
            ES: "Spain", DE: "Germany", FR: "France", IT: "Italy", GB: "United Kingdom",
            NL: "Netherlands", BE: "Belgium", PT: "Portugal", US: "United States",
            CH: "Switzerland", AT: "Austria", PL: "Poland", SE: "Sweden",
            DK: "Denmark", RO: "Romania", CA: "Canada"
        };
        countriesMount.innerHTML = PASSPORT_DATA.unlockedCountries.map(c => {
            const dispName = isEn ? (countryEnNames[c.code] || c.name) : c.name;
            const orderWord = isEn ? (c.orders === 1 ? "order" : "orders") : (c.orders === 1 ? "pedido" : "pedidos");
            return `
            <div class="country-card">
                <div class="country-card-header">
                    <div class="country-title-box">
                        <img src="img/flags/${c.code.toLowerCase()}.svg" class="country-flag-img" alt="${dispName}" loading="lazy">
                        <div>
                            <div class="country-name">${dispName}</div>
                            <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">${c.status}</span>
                        </div>
                    </div>
                    <div class="country-orders-badge">${c.orders} ${orderWord}</div>
                </div>
                <div class="country-progress-bar" title="${c.percentage}%">
                    <div class="country-progress-fill" style="width: ${c.percentage}%"></div>
                </div>
                <div class="country-cities-label">${isEn ? "Cities reached" : "Ciudades alcanzadas"} (${c.cities.length}):</div>
                <div class="city-chips-wrap">
                    ${c.cities.map(city => `<span class="city-chip">${city}</span>`).join("")}
                </div>
            </div>
        `;
        }).join("");
    }
}

// ============================================================================
// HOLDING ANALYTICS & TELEMETRÍA SIN COOKIES (0 €/mes · 100% RGPD)
// Estándar oficial del Holding (Plausible/AEPD: Cero cookies, cero IPs guardadas)
// ============================================================================
let _holdingTelemetryInitialized = false;

function initHoldingTelemetry() {
    if (_holdingTelemetryInitialized) return;
    if (window.location.pathname.startsWith("/admin")) return;
    _holdingTelemetryInitialized = true;

    const sessionId = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : (Math.random().toString(36).slice(2) + Date.now().toString(36));
    const startTs = Date.now();
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || params.get("ref") || "";

    const sendPing = (isUnload = false) => {
        const elapsedSec = Math.min(3600, Math.max(1, Math.round((Date.now() - startTs) / 1000)));
        const payload = JSON.stringify({
            session_id: sessionId,
            path: window.location.pathname || "/",
            referrer: utm || document.referrer || "",
            duration_sec: elapsedSec
        });
        if (isUnload && navigator.sendBeacon) {
            navigator.sendBeacon("/api/telemetry", new Blob([payload], { type: "application/json" }));
        } else {
            fetch("/api/telemetry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
                keepalive: true
            }).catch(() => {});
        }
    };

    sendPing(false);
    setInterval(() => {
        if (document.visibilityState === "visible") sendPing(false);
    }, 20000);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") sendPing(true);
    });
}

function trackHoldingEvent(eventName, eventTarget = "") {
    if (!eventName) return;
    try {
        fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event_name: eventName,
                event_target: String(eventTarget || "").slice(0, 128)
            }),
            keepalive: true
        }).catch(() => {});
    } catch (_e) {}
}

// ============================================================================
// SISTEMA BILINGÜE LIGERO (ES / EN · 0 librerías · Autodetección + Selector)
// ============================================================================
const LANG_STORAGE_KEY = "sivisecraft_lang_v1";

function getCurrentLang() {
    try {
        const urlLang = new URLSearchParams(window.location.search).get("lang");
        if (urlLang === "en" || urlLang === "es") {
            localStorage.setItem(LANG_STORAGE_KEY, urlLang);
            return urlLang;
        }
        const saved = localStorage.getItem(LANG_STORAGE_KEY);
        if (saved === "en" || saved === "es") return saved;
        const navLang = (navigator.language || "es").toLowerCase();
        if (navLang.startsWith("en")) return "en";
    } catch (_e) {}
    return "es";
}

function toggleStoreLanguage() {
    const next = getCurrentLang() === "en" ? "es" : "en";
    localStorage.setItem(LANG_STORAGE_KEY, next);
    window.location.reload();
}

function injectLanguageToggle() {
    const lang = getCurrentLang();
    const navActions = document.querySelector(".nav-actions");
    if (navActions && !document.getElementById("lang-toggle-btn")) {
        const btn = document.createElement("button");
        btn.id = "lang-toggle-btn";
        btn.type = "button";
        btn.className = "cart-icon-btn";
        btn.style.background = "var(--bg-primary)";
        btn.style.padding = "6px 9px";
        btn.style.fontSize = "0.76rem";
        btn.title = lang === "en" ? "Cambiar a Español" : "Switch to English";
        btn.innerHTML = lang === "en" ? "🇪🇸<span class=\"btn-label-desktop\"> ES</span>" : "🇬🇧<span class=\"btn-label-desktop\"> EN</span>";
        btn.onclick = toggleStoreLanguage;
        navActions.insertBefore(btn, navActions.firstChild);
    }

    // Inyectar sub-barra de navegación rápida móvil debajo de la navbar (solo visible <= 640px)
    const headerEl = document.querySelector("header");
    if (headerEl && !headerEl.querySelector(".mobile-quick-nav")) {
        const path = window.location.pathname.toLowerCase();
        const isCatalog = path.includes("catalogo");
        const isPassport = path.includes("pasaporte");
        const isHome = !isCatalog && !isPassport && !path.includes("pichi");

        const bar = document.createElement("div");
        bar.className = "mobile-quick-nav";
        bar.innerHTML = lang === "en"
            ? `<a href="index.html" class="${isHome ? "active" : ""}">Home</a>
               <a href="catalogo.html" class="${isCatalog ? "active" : ""}">Catalog</a>
               <a href="pasaporte.html" class="${isPassport ? "active" : ""}">🌍 Passport</a>`
            : `<a href="index.html" class="${isHome ? "active" : ""}">Inicio</a>
               <a href="catalogo.html" class="${isCatalog ? "active" : ""}">Catálogo</a>
               <a href="pasaporte.html" class="${isPassport ? "active" : ""}">🌍 Pasaporte</a>`;
        headerEl.appendChild(bar);
    }
}

// Traducciones al inglés de los 13 productos del catálogo
const PRODUCTS_EN = {
    exp_tinytan_7: {
        name: "Tiny Tan BTS McDonald's Display Stand (7 Figures)",
        badge: "INTERNATIONAL BESTSELLER",
        desc: "Custom 3D-printed display stand for all 7 Tiny Tan BTS McDonald's figures. Precision-fitted slots, optional engraved names, and savings bundles (Pack x2 / Pack x4)."
    },
    exp_dragon_ball: {
        name: "Dragon Ball Burger King Display Stand with LED Light",
        badge: "LED EDITION",
        desc: "Two-tier display stand for the Burger King Dragon Ball figure collection featuring translucent illuminated pedestals and 3D embossed Dragon Ball logo."
    },
    exp_mandalorian: {
        name: "The Mandalorian & Grogu Display Stand (Star Wars)",
        badge: "COLLECTOR'S PICK",
        desc: "Star Wars inspired stand with iconic Mandalorian helmet backdrop and custom slots for all 7 Burger King Mandalorian & Grogu capsules."
    },
    exp_stranger_things: {
        name: "Stranger Things 'Welcome to Hawkins' Display Stand",
        badge: "4-TIER STAND",
        desc: "4-tier display rack for McDonald's Stranger Things figures and houses, topped with the iconic 'Welcome to Hawkins' 3D sign."
    },
    exp_stitch: {
        name: "Stitch Burger King Display Stand",
        badge: "FAN FAVORITE",
        desc: "3D-printed Stitch silhouette display stand in vibrant blue tones, custom-designed for Burger King Stitch figures."
    },
    adviento_derpy: {
        name: "Derpy Advent Calendar / 24-Drawer Jewelry Box (K-Pop)",
        badge: "24 DRAWERS",
        desc: "Reusable 24-drawer Advent calendar and jewelry organizer inspired by Derpy (K-Pop Demon Hunters). Available empty or filled with 24 3D-printed surprise charms."
    },
    exp_mariokart: {
        name: "Mario Kart McDonald's Complete Display Stand (10 Karts)",
        badge: "10 KARTS",
        desc: "Two-level racing stand with embossed Mario Kart cup emblems designed to showcase all 10 McDonald's Mario Kart racers."
    },
    exp_friends: {
        name: "Friends McDonald's Display Stand (Monica's Door)",
        badge: "ICONIC FRAME",
        desc: "Purple display stand inspired by Monica's apartment door with the iconic yellow peephole frame, fitted for all 6 McDonald's Friends figures."
    },
    exp_minecraft: {
        name: "Minecraft McDonald's Collection Display Stand (6 Figures)",
        badge: "6 FIGURES",
        desc: "Stepped display stand in bold red with pixelated golden 'M' emblem designed for the 6 McDonald's Minecraft collectible figures."
    },
    exp_miercoles: {
        name: "Wednesday Addams Display Stand (Nevermore Coffin)",
        badge: "NEVERMORE",
        desc: "Gothic coffin-shaped display shelf with embossed Wednesday lettering and Nevermore Academy crest in black and purple."
    },
    exp_tinytan_ind: {
        name: "Single Tiny Tan BTS McDonald's Display Stand",
        badge: "SINGLE STAND",
        desc: "Individual display stand with back card slot and custom engraved member name (RM, Jin, Suga, J-Hope, Jimin, V, or Jung Kook)."
    },
    lampara_meninas: {
        name: "Velázquez 'Las Meninas' 3D Lithophane LED Lamp (25x25 cm)",
        badge: "ART LIGHTING",
        desc: "25x25 cm 3D-printed lithophane art lamp revealing Velázquez's masterpiece 'Las Meninas' with warm integrated LED lighting."
    },
    reloj_toystory: {
        name: "Toy Story Inspired Wall Clock (Andy's Room Clouds)",
        badge: "WALL CLOCK",
        desc: "3D-printed wall clock featuring Andy's iconic blue sky and white clouds wallpaper with silent quartz movement."
    }
};

const VARIANT_EN_MAP = {
    "Pack": "Pack",
    "Color": "Color",
    "Nombres en las baldas": "Engraved shelf names",
    "Contenido del Calendario": "Calendar contents",
    "Color Principal": "Main color",
    "Nombre en el Frontal": "Front engraved name",
    "1 Expositor (18,00 €)": "1 Display Stand (18,00 €)",
    "Pack Ahorro 2 Expositores (32,00 € • 16€/ud)": "2-Stand Savings Pack (32,00 € • 16€/ea)",
    "Morado": "Purple",
    "Rojo": "Red",
    "Pack x2: 1 Rojo + 1 Morado": "Pack x2: 1 Red + 1 Purple",
    "Con Nombres": "With names",
    "Sin Nombres": "Without names",
    "Vacío para rellenar a tu gusto (40,00 €)": "Empty to fill yourself (40,00 €)",
    "Con 24 Sorpresas (24 Charms K-Pop Demon Hunters) (45,00 € • Envío Gratis)": "With 24 Surprises (24 K-Pop Demon Hunters Charms) (45,00 €)",
    "Morado Army": "Army Purple",
    "Rojo McDonald's": "McDonald's Red",
    "Ninguno (Liso)": "None (Plain)"
};

function translateVariantLabel(str) {
    if (getCurrentLang() !== "en") return str;
    return VARIANT_EN_MAP[str] || str;
}

function getLocalizedProduct(p) {
    if (!p) return p;
    if (getCurrentLang() !== "en") return p;
    const en = PRODUCTS_EN[p.id];
    if (!en) return p;
    return { ...p, name: en.name || p.name, badge: en.badge || p.badge, desc: en.desc || p.desc };
}

function applyEnglishTranslationsIfNeeded() {
    if (getCurrentLang() !== "en") return;
    document.documentElement.lang = "en";
    const setText = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
    const setHTML = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };

    // 1. Top promo bar
    const promoBar = document.querySelector(".top-promo-bar");
    if (promoBar) {
        if (window.location.pathname.includes("pasaporte")) {
            promoBar.innerHTML = `🌍 <strong>PASSPORT:</strong> 16 Countries & +56 Cities<span class="promo-desktop-only"> <span class="sep">|</span> 🚚 Spain <strong>6,00 €</strong> • 🇪🇺 EU <strong>15,00 €</strong> • ✈️ Worldwide Tracked <span class="sep">|</span> 💳 Stripe / Bizum</span>`;
        } else {
            promoBar.innerHTML = `🎁 <strong>FREE SHIPPING</strong> Spain >45€ • 🇪🇺 EU >90€<span class="promo-desktop-only"> <span class="sep">|</span> 🚚 Spain <strong>6,00 €</strong> • 🇪🇺 EU <strong>15,00 €</strong> • ✈️ Worldwide Tracked <span class="sep">|</span> 💳 Secure Stripe Checkout</span>`;
        }
    }

    // 2. Navigation links & buttons
    const navMap = {
        "Inicio": "Home",
        "Catálogo": "Catalog",
        "Expositores": "Display Stands",
        "Navidad": "Christmas",
        "Relojes": "Clocks",
        "Lámparas": "Lamps",
        "🌍 Pasaporte": "🌍 Passport"
    };
    document.querySelectorAll("header nav a").forEach(a => {
        const txt = a.textContent.trim();
        if (txt.startsWith("Colecciones")) {
            a.innerHTML = `Collections <span class="dropdown-chevron">▾</span>`;
        } else if (navMap[txt]) {
            a.textContent = navMap[txt];
        } else {
            const firstSpan = a.querySelector("span:first-child");
            if (firstSpan && navMap[firstSpan.textContent.trim()]) {
                firstSpan.textContent = navMap[firstSpan.textContent.trim()];
            }
        }
    });

    document.querySelectorAll(".nav-actions .cart-icon-btn span").forEach(sp => {
        if (sp.textContent.trim() === "Seguimiento") sp.textContent = "Track Order";
        if (sp.textContent.trim() === "Cesta") sp.textContent = "Cart";
    });

    // 3. HOME PAGE (index.html) full translation
    const heroH1 = document.querySelector(".hero h1");
    if (heroH1 && heroH1.textContent.includes("artesanía")) {
        setText(".hero .tag", "✨ 3D Digital Workshop in Madrid • Collectibles & Custom Designs");
        heroH1.innerHTML = `Where technology meets <span>craftsmanship</span>`;
        setText(".hero p", "Collectible display stands, LED art lighting, and custom 3D-printed accessories designed in Madrid. Precision-engineered in eco-friendly PLA and shipped worldwide with tracking.");

        const heroBtns = document.querySelectorAll(".hero .hero-cta-row a");
        if (heroBtns[0]) heroBtns[0].textContent = "View full catalog";
        if (heroBtns[1]) heroBtns[1].textContent = "Meet the designer";

        const statPs = document.querySelectorAll(".hero-stats .stat-item p");
        if (statPs[0]) statPs[0].textContent = "Satisfaction";
        if (statPs[1]) statPs[1].textContent = "Avg. rating";
        if (statPs[2]) statPs[2].textContent = "Orders shipped";
        if (statPs[3]) statPs[3].textContent = "Countries 🌍";

        const showcaseCard = document.querySelector(".hero .hero-showcase-card");
        if (showcaseCard) {
            const spans = showcaseCard.querySelectorAll("div:first-child span");
            if (spans[0]) spans[0].textContent = "// OUR WORKSHOP CREATIONS";
            if (spans[1]) spans[1].textContent = "4 Disciplines";
            const foot = showcaseCard.lastElementChild;
            if (foot) foot.innerHTML = `✨ <strong>Collectible display stands, art lighting & original pieces</strong>`;
        }

        // Trust strip (4 items)
        const trustItems = document.querySelectorAll(".trust-strip .trust-item");
        const trustEn = [
            ["Best Price Guaranteed", "Up to 25% cheaper than Etsy by cutting out marketplace commissions and fees."],
            ["Free 3D Gift Keychain", "Every parcel includes a surprise 3D-printed keychain and a handwritten thank-you note."],
            ["Tracked Worldwide Delivery", "Spain 6,00€ (FREE >45€), EU 15,00€ (FREE >90€), USA, Canada, Mexico & Australia."],
            ["Secure Stripe or Bizum", "Pay in seconds with Card, Apple Pay, Google Pay, or Bizum, with direct WhatsApp support."]
        ];
        trustItems.forEach((item, i) => {
            if (!trustEn[i]) return;
            const h4 = item.querySelector("h4");
            const p = item.querySelector("p");
            if (h4) h4.textContent = trustEn[i][0];
            if (p) p.textContent = trustEn[i][1];
        });

        // Specialty section (#especialidad-expositores)
        const spec = document.getElementById("especialidad-expositores");
        if (spec) {
            const tag = spec.querySelector(".tag");
            if (tag) tag.textContent = "🎯 Workshop Specialty • 1,000+ hours of precision calibration";
            const h2 = spec.querySelector("h2");
            if (h2) h2.innerHTML = `Custom display stands for your <span>favorite collections</span>`;
            const p = spec.querySelector("p");
            if (p) p.innerHTML = `We design and 3D-print millimeter-accurate stands for <strong>McDonald's &amp; Burger King</strong> figures (<em>Tiny Tan BTS, LED Dragon Ball, Mandalorian &amp; Grogu, Stranger Things, Stitch, Mario Kart, Friends, Minecraft, Wednesday</em>) and collectible organizers.`;
            const ctas = spec.querySelectorAll(".hero-cta-row a");
            if (ctas[0]) ctas[0].innerHTML = "View all 10 display stands &rarr;";
            if (ctas[1]) ctas[1].textContent = "View best sellers";
            const caption = spec.querySelector(".hero-showcase-card > div:last-child");
            if (caption) caption.innerHTML = `📷 <strong>Real workshop photos</strong> • Click any item to open full gallery &amp; video`;
        }

        // Custom / Personalization section (#personalizacion)
        const pers = document.getElementById("personalizacion");
        if (pers) {
            const tag = pers.querySelector(".tag");
            if (tag) tag.textContent = "✨ Custom 3D Design • In-House Madrid Workshop";
            const h2 = pers.querySelector("h2");
            if (h2) h2.innerHTML = `Have a unique idea? <span style="color: var(--accent-stripe);">We customize anything</span>`;
            const p = pers.querySelector("p");
            if (p) p.textContent = "We go beyond our catalog: we design and 3D-print 100% custom pieces with your preferred colors, dimensions, engraved names, or any collection you want to showcase.";
            const cards = pers.querySelectorAll("h4");
            const cardPs = pers.querySelectorAll("div[style*='grid'] p");
            const persCards = [
                ["Custom colors & engraved names", "Change the color of any display stand or add your name, date, or embossed message."],
                ["Stands for any collection", "Funko, LEGO, Hot Wheels, Kinder, or a new series? We CAD-design it to fit your figures."],
                ["Unique gifts & exclusives", "Custom photo lithophane lamps, event keychains, trophies, or celebration favors."]
            ];
            persCards.forEach((c, i) => {
                if (cards[i]) cards[i].textContent = c[0];
                if (cardPs[i]) cardPs[i].textContent = c[1];
            });
            const waBtn = pers.querySelector("a.btn-teal");
            if (waBtn) waBtn.textContent = "💬 Tell us your idea on WhatsApp (No obligation)";
        }

        // Best sellers section (#superventas)
        const sv = document.getElementById("superventas");
        if (sv) {
            const kicker = sv.querySelector(".kicker");
            if (kicker) kicker.textContent = "// OFFICIAL SIVISECRAFT CATALOG";
            const h2 = sv.querySelector("h2");
            if (h2) h2.textContent = "Best sellers";
            const p = sv.querySelector(".section-header p");
            if (p) p.textContent = "Choose color, version (standard or LED light), or savings bundle right on each card and add it to your cart.";
            const tabs = sv.querySelectorAll(".filter-tabs .filter-btn");
            const tabLabels = ["All (13)", "Display Stands (10)", "Christmas (1)", "Clocks (1)", "Lamps (1)"];
            tabs.forEach((b, i) => { if (tabLabels[i]) b.textContent = tabLabels[i]; });
            const moreBtn = sv.querySelector("a.btn-teal");
            if (moreBtn) moreBtn.innerHTML = "Open catalog search &rarr;";
        }

        // Reviews section (#resenas)
        const rev = document.getElementById("resenas");
        if (rev) {
            const kicker = rev.querySelector(".kicker");
            if (kicker) kicker.textContent = "// VERIFIED CUSTOMER REVIEWS";
            const h2 = rev.querySelector("h2");
            if (h2) h2.textContent = "What collectors worldwide say";
            const p = rev.querySelector(".section-header p");
            if (p) p.textContent = "Real verified reviews from collectors who received our 3D-printed display stands and gifts.";
        }

        // Shipping & workshop section (#envios)
        const envSec = document.getElementById("envios");
        if (envSec) {
            const kicker = envSec.querySelector(".kicker");
            if (kicker) kicker.textContent = "// TRANSPARENT WORLDWIDE SHIPPING";
            const h2 = envSec.querySelector("h2");
            if (h2) h2.textContent = "Shipping rates & workshop";
            const p = envSec.querySelector(".section-header p");
            if (p) p.textContent = "Your shipping rate is calculated automatically in the cart based on your destination country.";

            const shipCards = envSec.querySelectorAll("div[style*='grid'] > div");
            const shipEn = [
                ["Spain Home Delivery", "6,00 €", "Fast tracked home delivery with Correos (48h) across Mainland Spain & Balearic Islands."],
                ["Spain Orders > 45 €", "FREE SHIPPING", "Automatically unlocked in your cart on national orders over 45,00 €."],
                ["European Union", "15,00 €", "Tracked international EU shipping. <strong>FREE on orders over 90 €!</strong>"],
                ["Worldwide", "From 20,00 €", "Finland (20€), USA, Canada, Mexico, Australia (25€), and Rest of World with tracking."]
            ];
            shipCards.forEach((card, i) => {
                if (!shipEn[i]) return;
                const h3 = card.querySelector("h3");
                const priceDiv = card.querySelector("div[style*='font-mono']");
                const cp = card.querySelector("p");
                if (h3) h3.textContent = shipEn[i][0];
                if (priceDiv) priceDiv.textContent = shipEn[i][1];
                if (cp) cp.innerHTML = shipEn[i][2];
            });
        }

        const taller = document.getElementById("taller");
        if (taller) {
            const h3 = taller.querySelector("h3");
            if (h3) h3.textContent = "Designed by a collector, printed with Bambu Lab precision";
            const ps = taller.querySelectorAll("p");
            if (ps[0]) ps[0].innerHTML = `Behind every <strong>SiviseCraft</strong> stand are hours of parametric CAD design measuring each base, capsule, and figure so it fits snugly on the first try. We print on demand in our Madrid workshop using eco-friendly plant-based PLA with premium textured finishes.`;
            if (ps[1]) ps[1].textContent = "Looking for a custom color or a display stand for another collection? Leave a note at checkout or message us on WhatsApp and we will make it for you.";
        }
    }

    // 4. CATALOG PAGE (catalogo.html)
    if (window.location.pathname.includes("catalogo")) {
        const mainH1 = document.querySelector("main h1");
        if (mainH1) mainH1.textContent = "Official SiviseCraft Catalog";
        const mainKicker = document.querySelector("main span[style*='font-mono']");
        if (mainKicker) mainKicker.textContent = "// COMPLETE WORKSHOP CATALOG • 13 ACTIVE REFERENCES";
        const mainP = document.querySelector("main > p");
        if (mainP) mainP.textContent = "Filter by collection, search your favorite series, or click any product photo to open its real photo gallery and videos.";
        const searchIn = document.getElementById("search-input");
        if (searchIn) searchIn.placeholder = "Search display stand (e.g. Dragon Ball, Tiny Tan, Mandalorian, Stranger Things, Stitch, Mario Kart, Friends)...";
        setText("label[for='sort-select']", "Sort by:");
        const sortSel = document.getElementById("sort-select");
        if (sortSel && sortSel.options.length >= 3) {
            sortSel.options[0].textContent = "Featured / Best Sellers";
            sortSel.options[1].textContent = "Price: Low to High";
            sortSel.options[2].textContent = "Price: High to Low";
        }
        const catTabs = document.querySelectorAll(".filter-tabs .filter-btn");
        const catEn = ["All Collections (13)", "Display Stands (10)", "Christmas (1)", "Clocks (1)", "Lamps (1)"];
        catTabs.forEach((b, i) => { if (catEn[i]) b.textContent = catEn[i]; });
    }

    // 5. PASSPORT PAGE (pasaporte.html)
    if (window.location.pathname.includes("pasaporte")) {
        setText("main .tag", "✈️ OFFICIAL SIVISECRAFT PASSPORT // LIVE DESTINATION MAP");
        setText("main h1", "From our Madrid workshop to the world");
        const pIntro = document.querySelector("main > div > p");
        if (pIntro) pIntro.innerHTML = `Every display stand, clock, and lithophane is carefully 3D-printed on our <strong>Bambu Lab A1</strong> and shipped safely to collectors across Europe and the Americas.`;
        const secH2s = document.querySelectorAll("main section h2");
        if (secH2s[0]) secH2s[0].textContent = "New Country Unlocked! & Workshop Chronicles";
        if (secH2s[1]) secH2s[1].textContent = "Countries, Shipments & Destination Cities";
        const unlock = document.querySelector(".unlock-cta-card");
        if (unlock) {
            const badge = unlock.querySelector(".unlock-reward-badge");
            if (badge) badge.textContent = "🎯 SIVISECRAFT UNLOCK CHALLENGE";
            const h3 = unlock.querySelector("h3");
            if (h3) h3.textContent = "Is your country or city not on the map yet?";
            const up = unlock.querySelector("p");
            if (up) up.innerHTML = `If you order from a country or city that is not yet on our Passport, <strong>mention it in your order notes</strong>: we'll make you an official ambassador and include an <strong>exclusive 3D-printed Passport keychain 100% FREE</strong> in your box.`;
            const uBtns = unlock.querySelectorAll("a.btn");
            if (uBtns[0]) uBtns[0].innerHTML = "View Catalog & Unlock &rarr;";
            if (uBtns[1]) uBtns[1].textContent = "Ask about special shipping on WhatsApp";
        }
    }

    // 6. Footer translation (all pages)
    const footerCopy = document.querySelector("footer .container > div:nth-child(2)");
    if (footerCopy) {
        footerCopy.innerHTML = `&copy; 2026 <strong>www.sivisecraft.es</strong> — 3D Design &amp; Printing in Madrid by Víctor Aguado.`;
    }
    const footerMap = {
        "Inicio": "Home", "Catálogo": "Catalog", "🌍 Pasaporte": "🌍 Passport",
        "Superventas": "Best Sellers", "Reseñas Reales (4.9★)": "Verified Reviews (4.9★)",
        "Reseñas (4.9★)": "Reviews (4.9★)", "Envíos y Taller": "Shipping & Workshop",
        "Etsy Oficial": "Official Etsy"
    };
    document.querySelectorAll("footer a").forEach(a => {
        const t = a.textContent.trim();
        if (footerMap[t]) a.textContent = footerMap[t];
    });

    // 7. Country dropdowns -> English country names
    ["cart-country-select", "checkout-country-select"].forEach(selId => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        Array.from(sel.options).forEach(opt => {
            const c = SHIPPING_COUNTRIES.find(item => item.code === opt.value);
            if (c) {
                const t = SHIPPING_TIERS[c.tier] || SHIPPING_TIERS.espana;
                const priceTag = `${t.baseCost.toFixed(2).replace(".", ",")} €${t.freeThreshold ? ` • Free >${t.freeThreshold}€` : ""}`;
                opt.textContent = `${c.nameEn} (${priceTag})`;
            }
        });
    });

    // 8. Cart Drawer, Tracking & Checkout Modals
    setText("#tracking-modal .modal-header h2", "📦 Order & Shipment Tracking");
    setText(".cart-header h2", "Your Shopping Cart");
    setText("label[for='cart-country-select']", "Destination Country (Auto Shipping)");
    setText("label[for='checkout-country-select']", "Destination Country (shipping calculated automatically)");
    setText(".stripe-back-btn", "← Back to SiviseCraft Store");
    setText("#pay-tab-bizum span:first-child", "📱 Pay with Bizum (Spain)");
    setText("#pay-tab-bizum .sub", "0% Fees • Spain Mobile Only");
    setText("#pay-tab-stripe span:first-child", "💳 Card / Apple Pay");
    setText("#pay-tab-stripe .sub", "★ Recommended • Secure Stripe Checkout");

    const cartRows = document.querySelectorAll(".cart-footer .cart-totals-row span:first-child");
    if (cartRows[0]) cartRows[0].textContent = "Products subtotal";
    if (cartRows[1]) cartRows[1].textContent = "Shipping";
    if (cartRows[2]) cartRows[2].textContent = "Total to pay";

    const payBoxBizum = document.getElementById("pay-box-bizum");
    if (payBoxBizum) {
        payBoxBizum.innerHTML = `
            <h4>📱 Direct Bizum Payment (Spain Only • 0% Fees)</h4>
            <p style="color:var(--text-secondary); line-height:1.45; margin-bottom:10px;">
                Send your Bizum to <strong>${STORE_CONFIG.bizumPhone}</strong> with your <strong>#SC</strong> order code in the reference.
            </p>
            <div style="background:#fef2f2; border:1.5px solid #f87171; color:#991b1b; padding:10px 12px; border-radius:8px; font-size:0.82rem; font-weight:700; line-height:1.45;">
                ⚠️ IMPORTANT NOTICE: This order will not be produced or shipped until Bizum payment is confirmed.
            </div>
        `;
    }
    const payBoxStripe = document.getElementById("pay-box-stripe");
    if (payBoxStripe) {
        payBoxStripe.innerHTML = `
            <h4 style="color:var(--accent-stripe);">💳 Official Stripe Checkout (Card / Apple Pay / Google Pay)</h4>
            <p style="color:var(--text-secondary); line-height:1.45;">
                Your shipping details above are automatically linked to your order. Click below to complete payment securely on Stripe.
            </p>
        `;
    }

    const phMap = {
        "chk-name": "Full Name *",
        "chk-phone": "Mobile Phone *",
        "chk-email": "Email address for tracking *",
        "chk-zip": "ZIP / Postal Code *",
        "chk-city": "City / State *",
        "chk-notes": "Optional notes (custom colors, names...)",
        "tracking-search-input": "Search by order code (e.g. SC-48291)..."
    };
    Object.entries(phMap).forEach(([id, ph]) => {
        const el = document.getElementById(id);
        if (el) el.placeholder = ph;
    });

    const cartCheckoutBtn = document.querySelector(".cart-footer .btn-primary");
    if (cartCheckoutBtn) cartCheckoutBtn.textContent = "Proceed to Checkout →";

    if (typeof activePaymentMethod !== "undefined" && activePaymentMethod === "bizum") {
        activePaymentMethod = "stripe";
    }
}

// Auto-inicialización al cargar la web
function _initSiviseCraftRuntime() {
    initHoldingTelemetry();
    injectLanguageToggle();
    // Esperar un micro-tick a que las páginas inyecten los modales y tarjetas
    setTimeout(applyEnglishTranslationsIfNeeded, 60);
}

if (typeof window !== "undefined" && window.document) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", _initSiviseCraftRuntime);
    } else {
        _initSiviseCraftRuntime();
    }
}
