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
    bizumPhone: "600 000 000",    // Editable por Víctor con su móvil de Bizum/WhatsApp
    whatsappNumber: "34600000000",// Editable para recibir el pedido directo en WhatsApp
    contactEmail: "hola@sivisecraft.es",
    etsyUrl: "https://www.etsy.com/es/shop/SiviseCraft",
    wallapopText: "5★ (35 val. • +26 ventas)",
    vintedText: "5★ (13 val.)",
    etsyText: "4.9★ (+70 pedidos • +12 países)"
};

// Tramos Oficiales de Envío (100% Mensajería con Seguimiento — Sin entregas en mano)
const SHIPPING_TIERS = {
    inpost: {
        id: "inpost",
        label: "📦 Punto Pack / InPost (Península)",
        baseCost: 3.95,
        freeOverThreshold: true,
        eta: "Entrega en Punto Pack o Taquilla InPost (3-4 días laborables)",
        needsAddress: true,
        addressHint: "Indica tu dirección o el nombre de tu Punto Pack InPost más cercano"
    },
    domicilio: {
        id: "domicilio",
        label: "🚚 Domicilio 24/48h (Península)",
        baseCost: 4.95,
        freeOverThreshold: true,
        eta: "Entrega urgente en domicilio con seguimiento (24/48h tras fabricación)",
        needsAddress: true,
        addressHint: "Calle, número, piso y puerta para entrega a domicilio"
    },
    eu: {
        id: "eu",
        label: "🌍 Unión Europea Certificado (9,90 €)",
        baseCost: 9.90,
        freeOverThreshold: false,
        eta: "International Tracked Shipping EU (5-8 business days)",
        needsAddress: true,
        addressHint: "Full street address, postal code, city and EU country"
    }
};

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
                name: "Formato / Pack Ahorro",
                options: [
                    { label: "1 Expositor (18,00 €)", price: 18.00 },
                    { label: "Pack Ahorro 2 Expositores (32,00 € • 16€/ud)", price: 32.00 },
                    { label: "Pack Coleccionista 4 Expositores (64,00 € • Envío Gratis)", price: 64.00 }
                ]
            },
            {
                name: "Color Principal",
                options: [
                    { label: "Morado Army (Blanco en relieve)" },
                    { label: "Rojo McDonald's (Amarillo en relieve)" },
                    { label: "Combinado (Rojo + Morado para Packs)" }
                ]
            },
            {
                name: "Nombres en las baldas",
                options: [
                    { label: "Con nombres de los 7 miembros (RM, JIN, SUGA...)" },
                    { label: "Sin nombres (solo logos BTS y Tiny Tan)" }
                ]
            }
        ]
    },

    // 2. EXPOSITOR DRAGON BALL BURGER KING (CON / SIN LUZ LED)
    {
        id: "exp_dragon_ball",
        name: "Expositor Dragon Ball Burger King (Normal / Con Luz LED)",
        price: 14.00,
        oldPrice: 19.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Superventas Wallapop",
        badgeType: "gold",
        channelInfo: "Éxito en Wallapop y Vinted • Opción LED o Normal",
        image: "img/expositor_dragonball.jpg",
        gallery: [
            "img/expositor_dragonball.jpg"
        ],
        desc: "Expositor diseñado específicamente para lucir la colección de figuras de Dragon Ball de Burger King. Elige entre la versión con iluminación LED cálida integrada para destacar la silueta y las bolas de dragón (14,00 €) o la estructura Normal de colección completa (16,00 €). Impreso en PLA de alta densidad. Muñecos no incluidos.",
        variants: [
            {
                name: "Versión del Expositor",
                options: [
                    { label: "Con Luz LED integrada (14,00 €)", price: 14.00 },
                    { label: "Modelo Normal Colección Completa (16,00 €)", price: 16.00 }
                ]
            }
        ]
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
        variants: [
            {
                name: "Acabado",
                options: [
                    { label: "Negro Mate + Casco Plata Beskar (20,00 €)", price: 20.00 }
                ]
            }
        ]
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
        variants: [
            {
                name: "Configuración",
                options: [
                    { label: "Completo 4 Gradas + Cartel Welcome to Hawkins (22,50 €)", price: 22.50 }
                ]
            }
        ]
    },

    // 5. EXPOSITOR STITCH BURGER KING
    {
        id: "exp_stitch",
        name: "Expositor Stitch & Angel Burger King",
        price: 15.00,
        oldPrice: 19.00,
        category: "expositores",
        collection: "expositores",
        featured: true,
        badge: "Top Wallapop & Vinted",
        badgeType: "teal",
        channelInfo: "Uno de los favoritos en Wallapop (5★) y Vinted (5★)",
        image: "img/expositor_stitch.jpg",
        gallery: [
            "img/expositor_stitch.jpg"
        ],
        desc: "Expositor temático impreso en 3D para organizar y lucir toda la colección de figuras de Stitch de Burger King. Encajes a medida para evitar caídas y colores vivos inspirados en Stitch y Angel. Muñecos no incluidos.",
        variants: [
            {
                name: "Combinación de Color",
                options: [
                    { label: "Azul Stitch & Rosa Angel (15,00 €)", price: 15.00 },
                    { label: "Azul Tropical Completo (15,00 €)", price: 15.00 },
                    { label: "Rosa Angel Completo (15,00 €)", price: 15.00 }
                ]
            }
        ]
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
        image: "https://i.etsystatic.com/48356593/r/il/ec6e60/6511660505/il_fullxfull.6511660505_tuwc.jpg",
        gallery: [
            "https://i.etsystatic.com/48356593/r/il/ec6e60/6511660505/il_fullxfull.6511660505_tuwc.jpg",
            "https://i.etsystatic.com/48356593/r/il/19e629/6463558230/il_fullxfull.6463558230_66ga.jpg",
            "https://i.etsystatic.com/48356593/r/il/4f3d4d/6511660877/il_fullxfull.6511660877_jzfu.jpg",
            "https://i.etsystatic.com/48356593/r/il/ebf8a8/6415429872/il_fullxfull.6415429872_phrx.jpg",
            "https://i.etsystatic.com/48356593/r/il/cb38c0/6415430382/il_fullxfull.6415430382_3thr.jpg",
            "https://i.etsystatic.com/48356593/r/il/fc4b21/6463528739/il_fullxfull.6463528739_tg0l.jpg"
        ],
        desc: "Expositor de coches de Mario Kart para la colección completa de 10 karts de McDonald's. Decoraciones hendidas en laterales con los iconos de objetos/armas de Mario Kart y frontal superior con relieve de los GPs. Disponible en el nuevo modelo compacto de 2 baldas (16,00 €) o el modelo clásico de 4 baldas (28,00 €). Coches no incluidos.",
        variants: [
            {
                name: "Modelo de Estantería",
                options: [
                    { label: "Modelo Compacto 2 Baldas (10 coches) (16,00 €)", price: 16.00 },
                    { label: "Modelo Clásico 4 Baldas (Gran Formato) (28,00 €)", price: 28.00 }
                ]
            }
        ]
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
        image: "https://i.etsystatic.com/48356593/r/il/919dcd/6379651938/il_fullxfull.6379651938_8vw3.jpg",
        gallery: [
            "https://i.etsystatic.com/48356593/r/il/919dcd/6379651938/il_fullxfull.6379651938_8vw3.jpg",
            "https://i.etsystatic.com/48356593/r/il/0820a6/6376219416/il_fullxfull.6376219416_fmnm.jpg",
            "https://i.etsystatic.com/48356593/r/il/5b2b56/6424301993/il_fullxfull.6424301993_6lum.jpg",
            "https://i.etsystatic.com/48356593/r/il/b223d6/6424300061/il_fullxfull.6424300061_vxrn.jpg",
            "https://i.etsystatic.com/48356593/r/il/575787/6424300065/il_fullxfull.6424300065_tfzd.jpg",
            "https://i.etsystatic.com/48356593/r/il/7516cc/6424302727/il_fullxfull.6424302727_tosa.jpg"
        ],
        desc: "Expositor para las 6 figuras de Friends de McDonald's. Impreso en el icónico color morado de la puerta del apartamento de Mónica con el marco amarillo en relieve y el logo oficial de Friends hendido en el frente. Muñecos no incluidos.",
        variants: [
            {
                name: "Edición",
                options: [
                    { label: "Morado Puerta de Mónica + Marco Amarillo (20,00 €)", price: 20.00 }
                ]
            }
        ]
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
        variants: [
            {
                name: "Acabado",
                options: [
                    { label: "Rojo McDonald's + Logo Pixel Amarillo (15,00 €)", price: 15.00 }
                ]
            }
        ]
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
        desc: "Expositor con silueta de ataúd en negro mate texturizado PEI y detalles en morado Nevermore. Incluye la tipografía 'WEDNESDAY' en el compartimento superior, el escudo 'Unitas Est Invicta 1791' de Nevermore Academy en el inferior y ranuras hexagonales a medida para las peanas de las figuras. Figuras no incluidas.",
        variants: [
            {
                name: "Color",
                options: [
                    { label: "Negro Mate + Relieves Morado Nevermore (18,00 €)", price: 18.00 }
                ]
            }
        ]
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
        image: "https://i.etsystatic.com/48356593/r/il/318d57/7245887120/il_fullxfull.7245887120_hrx0.jpg",
        gallery: [
            "https://i.etsystatic.com/48356593/r/il/318d57/7245887120/il_fullxfull.7245887120_hrx0.jpg",
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
        image: "https://i.etsystatic.com/48356593/r/il/6a2743/6516118914/il_fullxfull.6516118914_4929.jpg",
        gallery: [
            "https://i.etsystatic.com/48356593/r/il/6a2743/6516118914/il_fullxfull.6516118914_4929.jpg",
            "https://i.etsystatic.com/48356593/r/il/ad7f67/6516117182/il_fullxfull.6516117182_6gx8.jpg",
            "https://i.etsystatic.com/48356593/r/il/428f91/6516118706/il_fullxfull.6516118706_e1qx.jpg",
            "https://i.etsystatic.com/48356593/r/il/ad98b9/6516118730/il_fullxfull.6516118730_fxgk.jpg",
            "https://i.etsystatic.com/48356593/r/il/37bd8a/6564244133/il_fullxfull.6564244133_h1np.jpg"
        ],
        desc: "Litofanía de alta resolución del cuadro 'Las Meninas' de Diego Velázquez. Al encender su iluminación LED interna, el grosor milimétrico del PLA proyecta la obra maestra con calidad fotográfica. Marco blanco de 25x25 cm con cable USB e interruptor.",
        variants: [
            {
                name: "Color del Marco",
                options: [
                    { label: "Marco Blanco 25x25 cm + LED USB (40,00 €)", price: 40.00 }
                ]
            }
        ]
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
        image: "https://i.etsystatic.com/48356593/r/il/e059bb/8264785536/il_fullxfull.8264785536_1nvg.jpg",
        gallery: [
            "https://i.etsystatic.com/48356593/r/il/e059bb/8264785536/il_fullxfull.8264785536_1nvg.jpg",
            "https://i.etsystatic.com/48356593/r/il/9dbcd5/8312699101/il_fullxfull.8312699101_1zh8.jpg",
            "https://i.etsystatic.com/48356593/r/il/9db59f/8312699261/il_fullxfull.8312699261_pgwq.jpg",
            "https://i.etsystatic.com/48356593/r/il/04436e/8312698855/il_fullxfull.8312698855_dihn.jpg",
            "https://i.etsystatic.com/48356593/r/il/af693e/8312699021/il_fullxfull.8312699021_3vmt.jpg"
        ],
        desc: "Reloj de pared funcional basado en Toy Story: esfera azul cielo con las nubes blancas de la habitación de Andy, números en relieve con la tipografía original, manecillas inspiradas en Buzz Lightyear y Woody, y el detalle secreto de la firma de 'ANDY' en la parte trasera.",
        variants: [
            {
                name: "Modelo",
                options: [
                    { label: "Reloj Completo listo para colgar (18,00 €)", price: 18.00 }
                ]
            }
        ]
    }
];

// Reseñas Verificadas Reales extraídas de c:\workspace\SIVISECRAFT\assets\etsy\reviews.json
const VERIFIED_REVIEWS = [
    {
        reviewer: "Alexandra",
        date: "24 Jul 2026",
        rating: 5,
        country: "🇬🇧 Internacional",
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
// MOTOR DE CARRITO, ENVÍOS POR TRAMOS Y CHECKOUT DIRECTO (BIZUM + STRIPE)
// ============================================================================
const CART_STORAGE_KEY = "sivisecraft_official_cart_v1";
const SHIPPING_STORAGE_KEY = "sivisecraft_shipping_tier_v1";
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

function getSelectedShippingTierId() {
    const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return (saved && SHIPPING_TIERS[saved]) ? saved : "inpost";
}

function setSelectedShippingTierId(tierId) {
    if (SHIPPING_TIERS[tierId]) {
        localStorage.setItem(SHIPPING_STORAGE_KEY, tierId);
        updateCartUI();
        if (document.getElementById("stripe-overlay")?.classList.contains("open")) {
            renderCheckoutSummary();
        }
    }
}

function calculateShippingCost(subtotal, tierId) {
    if (subtotal <= 0) return 0.00;
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.inpost;
    if (tier.freeOverThreshold && subtotal >= STORE_CONFIG.freeShippingThreshold) {
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
    const badgeClass = p.badgeType === "teal" ? "teal" : (p.badgeType === "gold" ? "gold" : "");
    const galleryCount = p.gallery ? p.gallery.length : 1;

    let variantsHTML = "";
    if (p.variants && p.variants.length > 0) {
        variantsHTML = `<div class="product-variants-inline">`;
        p.variants.forEach((v, idx) => {
            variantsHTML += `
                <div>
                    <div class="variant-row-label">${v.name}</div>
                    <select id="card-var-${p.id}-${idx}" class="variant-select-sm" onchange="onVariantChange('${p.id}', 'card')">
                        ${v.options.map(o => `<option value="${o.label}">${o.label}</option>`).join("")}
                    </select>
                </div>
            `;
        });
        variantsHTML += `</div>`;
    }

    return `
        <article class="product-card" data-category="${p.category}" data-id="${p.id}">
            <div class="product-media" onclick="openProductDetail('${p.id}')" title="Ver galería de fotos reales y detalles">
                ${p.badge ? `<span class="product-badge ${badgeClass}">${p.badge}</span>` : ""}
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                ${galleryCount > 1 ? `<span class="product-gallery-count">📷 ${galleryCount} fotos</span>` : ""}
            </div>
            <div class="product-details">
                <div style="font-size:0.72rem; color:var(--accent-pichi); font-weight:700; margin-bottom:4px;">
                    ${p.channelInfo || "Fabricado en nuestro taller de Madrid"}
                </div>
                <div class="product-header-row">
                    <h3 onclick="openProductDetail('${p.id}')">${p.name}</h3>
                    <div class="product-price-box">
                        <span class="product-price" id="card-price-${p.id}">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="product-old-price" title="Precio en plataformas con comisiones">${formatPrice(p.oldPrice)}</span>` : ""}
                    </div>
                </div>
                <p class="product-desc">${p.desc}</p>
                ${variantsHTML}
                <div class="product-card-actions">
                    <button class="btn-icon-only" onclick="openProductDetail('${p.id}')" title="Ver todas las fotos y descripción">
                        🔍
                    </button>
                    <button class="btn btn-primary" onclick="addProductToCartFromDOM('${p.id}', 'card')">Añadir al Carrito</button>
                </div>
            </div>
        </article>
    `;
}

// Modal de Galería y Detalle de Producto
function openProductDetail(productId) {
    const p = PRODUCTS.find(item => item.id === productId);
    if (!p) return;

    const modal = document.getElementById("product-detail-modal");
    const content = document.getElementById("product-detail-body");
    if (!modal || !content) return;

    const photos = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];

    let variantsHTML = "";
    if (p.variants && p.variants.length > 0) {
        variantsHTML = `<div style="margin: 16px 0; display:flex; flex-direction:column; gap:12px;">`;
        p.variants.forEach((v, idx) => {
            variantsHTML += `
                <div>
                    <label style="display:block; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:4px;">${v.name}</label>
                    <select id="detail-var-${p.id}-${idx}" onchange="onVariantChange('${p.id}', 'detail')">
                        ${v.options.map(o => `<option value="${o.label}">${o.label}</option>`).join("")}
                    </select>
                </div>
            `;
        });
        variantsHTML += `</div>`;
    }

    content.innerHTML = `
        <div class="modal-header">
            <h2>${p.name}</h2>
            <button class="close-btn" onclick="closeDetailModal()">&times;</button>
        </div>
        <div class="detail-modal-grid">
            <div>
                <div class="detail-main-media" id="detail-main-Stage">
                    <img src="${photos[0]}" alt="${p.name}" id="detail-main-img">
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
                <div style="font-size:0.78rem; color:var(--accent-pichi); font-weight:700; margin-bottom:6px;">
                    ${p.channelInfo || "Impresión 3D de alta precisión en PLA biodegradable"}
                </div>
                <div style="display:flex; align-items:baseline; gap:12px; margin-bottom:14px;">
                    <span class="config-price" id="detail-price-${p.id}">${formatPrice(p.price)}</span>
                    ${p.oldPrice ? `<span style="text-decoration:line-through; color:var(--text-secondary); font-size:0.9rem;">En Etsy: ${formatPrice(p.oldPrice)}</span>` : ""}
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6; margin-bottom:14px;">
                    ${p.desc}
                </p>
                ${variantsHTML}
                <div style="background:var(--bg-primary); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:16px;">
                    <div>📦 <strong>Punto Pack InPost:</strong> 3,95 € <span style="color:var(--accent-pichi);font-weight:700;">(GRATIS en pedidos > 45€)</span></div>
                    <div>🚚 <strong>Domicilio 24/48h:</strong> 4,95 € <span style="color:var(--accent-pichi);font-weight:700;">(GRATIS en pedidos > 45€)</span></div>
                    <div>🌍 <strong>Unión Europea Certificado:</strong> 9,90 €</div>
                    <div>🎁 <strong>Detalle sorpresa 3D incluido</strong> en cada paquete</div>
                </div>
                <div style="margin-top:auto;">
                    <button class="btn btn-primary" onclick="addProductToCartFromDOM('${p.id}', 'detail')">🛒 Añadir al Carrito y Ver Cesta</button>
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

// Actualizar UI del Carrito Lateral + Tramos de Envío
function updateCartUI() {
    const cart = getCart();
    const badge = document.getElementById("cart-badge");
    const itemsContainer = document.getElementById("cart-items");
    const tierSelect = document.getElementById("cart-shipping-tier-select");
    const currentTierId = getSelectedShippingTierId();

    if (tierSelect && tierSelect.value !== currentTierId) {
        tierSelect.value = currentTierId;
    }

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
        badge.textContent = totalQty;
    }

    if (!itemsContainer) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, currentTierId);
    const total = subtotal + shipping;

    // Actualizar barra de envío gratis (>45€)
    const freeBannerText = document.getElementById("free-shipping-text");
    const freeBannerFill = document.getElementById("free-shipping-fill");
    if (freeBannerText && freeBannerFill) {
        if (currentTierId === "eu") {
            freeBannerText.innerHTML = `🌍 <strong>Envío Internacional UE Certificado:</strong> Tarifa plana 9,90 €`;
            freeBannerFill.style.width = "100%";
        } else if (subtotal >= STORE_CONFIG.freeShippingThreshold) {
            freeBannerText.innerHTML = `🎉 ¡Enhorabuena! Tienes <strong>ENVÍO GRATIS</strong> en tu pedido (> 45,00 €)`;
            freeBannerFill.style.width = "100%";
        } else {
            const missing = Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal);
            const pct = Math.min(100, Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100));
            freeBannerText.innerHTML = `🎁 Te faltan <strong>${formatPrice(missing)}</strong> para conseguir <strong>ENVÍO GRATIS</strong> (pedidos > 45€)`;
            freeBannerFill.style.width = `${pct}%`;
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
    const overlay = document.getElementById("stripe-overlay");
    if (!overlay) return;
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
    const tierId = getSelectedShippingTierId();
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.inpost;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, tierId);
    const total = subtotal + shipping;

    const checkoutShippingSelect = document.getElementById("checkout-shipping-tier");
    if (checkoutShippingSelect && checkoutShippingSelect.value !== tierId) {
        checkoutShippingSelect.value = tierId;
    }

    const etaHint = document.getElementById("checkout-shipping-eta");
    if (etaHint) etaHint.textContent = tier.eta;

    const addrGroup = document.getElementById("checkout-address-group");
    const addrInput = document.getElementById("chk-address");
    if (addrGroup && addrInput) {
        addrInput.placeholder = tier.addressHint;
        if (!tier.needsAddress) {
            addrInput.required = false;
            addrInput.value = "Recogida en mano en Madrid (0,00 €)";
        } else {
            addrInput.required = true;
            if (addrInput.value === "Recogida en mano en Madrid (0,00 €)") {
                addrInput.value = "";
            }
        }
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

    const tierId = getSelectedShippingTierId();
    const tier = SHIPPING_TIERS[tierId] || SHIPPING_TIERS.inpost;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = calculateShippingCost(subtotal, tierId);
    const total = subtotal + shipping;
    const orderId = "SC-" + Math.floor(10000 + Math.random() * 90000);

    lastCompletedOrder = {
        orderId,
        date: new Date().toLocaleDateString("es-ES"),
        method: activePaymentMethod === "bizum" ? "Bizum (0% comisión)" : "Tarjeta / Apple Pay (Stripe Checkout)",
        name,
        email,
        phone,
        address: `${address}, ${zip} ${city}`,
        shippingId: tierId,
        shippingLabel: tier.label,
        subtotal,
        shipping,
        total,
        notes,
        status: "En preparación en el Taller 3D (Madrid)",
        items: [...cart]
    };

    // Guardamos siempre el pedido en "Mis Pedidos / Seguimiento" del cliente
    saveCompletedOrder(lastCompletedOrder);

    const proc = document.getElementById("stripe-processing");
    const procTitle = document.getElementById("stripe-processing-title");
    const procSub = document.getElementById("stripe-processing-sub");
    proc.classList.add("active");

    // Si eligió Stripe (Opción B), intentamos crear sesión real en /api/checkout (Cloudflare Pages Function)
    if (activePaymentMethod === "stripe" && window.location.protocol.startsWith("http")) {
        if (procTitle) procTitle.textContent = "Conectando con la Pasarela Oficial de Stripe...";
        if (procSub) procSub.textContent = "Enviando tu cesta y dirección cifradas (256-bit SSL)";

        try {
            const resp = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    customer: { name, email, phone, address, zip, city, notes },
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

    setTimeout(() => {
        proc.classList.remove("active");
        showOrderSuccessModal(lastCompletedOrder);
    }, 1200);
}

function showOrderSuccessModal(orderObj) {
    lastCompletedOrder = orderObj;
    const overlay = document.getElementById("stripe-overlay");
    if (overlay) overlay.classList.add("open");
    const succ = document.getElementById("stripe-success");
    if (!succ) return;
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

    const shippingOptionsHTML = Object.values(SHIPPING_TIERS).map(t => {
        const priceTag = t.baseCost === 0 ? "0,00 €" : `${t.baseCost.toFixed(2).replace(".", ",")} €${t.freeOverThreshold ? " • Gratis >45€" : ""}`;
        return `<option value="${t.id}">${t.label.replace(/\s*\([^)]*€[^)]*\)/g, "")} (${priceTag})</option>`;
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
                    Consulta el estado de fabricación 3D de tus pedidos o busca por tu código <strong>#SC-XXXXX</strong>. En cuanto depositamos tu paquete en InPost o Correos, recibirás además un SMS/Email oficial con el número de seguimiento.
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
                        <label for="cart-shipping-tier-select">Método de Entrega / Tramo de Envío</label>
                        <select id="cart-shipping-tier-select" class="shipping-tier-select" onchange="setSelectedShippingTierId(this.value)">
                            ${shippingOptionsHTML}
                        </select>
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
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 16px;">Importe total del pedido</div>
                    <div id="stripe-total-amount" class="stripe-total-amount">0,00 €</div>

                    <div class="form-group" style="margin-bottom:16px;">
                        <label for="checkout-shipping-tier">Tramo de Envío Seleccionado</label>
                        <select id="checkout-shipping-tier" class="shipping-tier-select" onchange="setSelectedShippingTierId(this.value)">
                            ${shippingOptionsHTML}
                        </select>
                        <div id="checkout-shipping-eta" style="font-size:0.75rem; color:var(--accent-pichi); margin-top:4px; font-weight:600;"></div>
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
                        <h2 style="font-family: var(--font-title); font-weight: 800; margin-bottom: 6px; color: var(--text-primary);">¡Pedido Registrado!</h2>
                        <p style="color: var(--text-secondary); font-size: 0.88rem;">Hemos generado tu orden de taller. Puedes enviarnos la confirmación en 1 clic por WhatsApp para agilizar el envío.</p>

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
                            <input type="text" id="chk-address" required class="stripe-input" placeholder="Dirección completa o Punto Pack InPost *">
                            <div style="display:grid; grid-template-columns: 0.4fr 0.6fr; gap:10px;">
                                <input type="text" id="chk-zip" required class="stripe-input" placeholder="C. Postal *">
                                <input type="text" id="chk-city" required class="stripe-input" placeholder="Ciudad / Provincia *">
                            </div>
                        </div>

                        <input type="text" id="chk-notes" class="stripe-input" placeholder="Notas opcionales (ej. nombre para botella, colores pack, horario...)">

                        <!-- Caja Bizum -->
                        <div id="pay-box-bizum" class="bizum-instructions-card">
                            <h4>📱 Pago Directo por Bizum (Instantáneo y 0% Comisiones)</h4>
                            <p style="color:var(--text-secondary); line-height:1.45;">
                                Al pulsar en confirmar se generará tu código de pedido <strong>#SC</strong> para que envíes el Bizum con ese concepto y nos avises en 1 clic por WhatsApp. ¡Empezamos a imprimir tu pieza en el acto!
                            </p>
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
                            <div class="review-date">${r.date} • ${r.country}</div>
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
