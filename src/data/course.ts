import type { Course } from './types'

export const COURSE_CALIDAD: Course = {
  id: 'calidad',
  title: 'Buenas Prácticas de Manufactura',
  subtitle: 'Capacitación obligatoria BPM',
  company: 'Mi Gusto',
  totalModules: 4,
  objectives: [
    'Garantizar la elaboración de alimentos seguros',
    'Controlar el personal, las instalaciones y las operaciones',
    'Cumplir con el Código Alimentario Argentino',
  ],
  passScore: 12,
  questions: [
    {
      id: 1,
      question: "Las Buenas Prácticas de Manufactura tienen como finalidad principal:",
      options: [
        "A) Estandarizar los procesos productivos para mejorar la eficiencia.",
        "B) Garantizar que los alimentos sean producidos bajo condiciones que minimicen riesgos para la salud del consumidor.",
        "C) Reducir los costos asociados a reclamos y devoluciones.",
        "D) Mejorar la calidad organoléptica de los productos elaborados."
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Respecto a la higiene personal, puede afirmarse que:",
      options: [
        "A) Constituye una medida complementaria a los controles operacionales.",
        "B) Es importante únicamente en las etapas finales de elaboración.",
        "C) Es una de las barreras fundamentales para prevenir la contaminación de los alimentos.",
        "D) Tiene impacto solamente cuando existe contacto directo con el producto."
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "El uso de elementos personales en áreas productivas se encuentra restringido porque:",
      options: [
        "A) Puede interferir con la correcta ejecución de las tareas.",
        "B) Dificulta la limpieza y desinfección de las instalaciones.",
        "C) Incrementa la probabilidad de contaminación física del producto.",
        "D) Genera incumplimientos relacionados con la imagen corporativa."
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Una instalación diseñada bajo criterios de BPM debe:",
      options: [
        "A) Facilitar la circulación del personal y materiales minimizando riesgos de contaminación.",
        "B) Priorizar la utilización eficiente del espacio disponible.",
        "C) Permitir la máxima capacidad productiva posible.",
        "D) Adaptarse a las necesidades operativas de cada turno."
      ],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "La correcta identificación de materias primas y productos tiene como principal objetivo:",
      options: [
        "A) Optimizar la gestión del almacén.",
        "B) Facilitar el control de inventarios.",
        "C) Garantizar la trazabilidad y evitar errores operativos.",
        "D) Mejorar la organización visual de los sectores."
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "El lavado de manos se considera una medida crítica porque:",
      options: [
        "A) Reduce la presencia de contaminantes que pueden transferirse al alimento.",
        "B) Disminuye el desgaste de los guantes.",
        "C) Permite mantener una mejor presentación personal.",
        "D) Favorece el cumplimiento de los procedimientos de ingreso."
      ],
      correctAnswer: 0
    },
    {
      id: 7,
      question: "La presencia de condensación en áreas de producción representa un riesgo debido a que:",
      options: [
        "A) Puede afectar la temperatura ambiente.",
        "B) Puede favorecer la transferencia de contaminantes hacia el producto.",
        "C) Incrementa los tiempos de limpieza.",
        "D) Reduce la eficiencia de los equipos."
      ],
      correctAnswer: 1
    },
    {
      id: 8,
      question: "Los programas de limpieza y desinfección tienen como propósito:",
      options: [
        "A) Mantener el orden visual de la planta.",
        "B) Asegurar condiciones adecuadas para prevenir fuentes de contaminación.",
        "C) Reducir el desgaste de los equipos.",
        "D) Mejorar la productividad de los sectores."
      ],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "Una desviación en el cumplimiento de BPM puede provocar:",
      options: [
        "A) Incremento de costos operativos.",
        "B) Retrasos en la producción.",
        "C) Pérdida de la inocuidad del alimento.",
        "D) Disminución de la eficiencia del proceso."
      ],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "La responsabilidad sobre el cumplimiento de BPM corresponde:",
      options: [
        "A) Al departamento de Calidad.",
        "B) A supervisores y jefaturas.",
        "C) Al personal que manipula alimentos.",
        "D) A toda persona que participe en actividades relacionadas con el producto."
      ],
      correctAnswer: 3
    },
    {
      id: 11,
      question: "La capacitación en BPM es necesaria porque:",
      options: [
        "A) Permite cumplir requisitos normativos.",
        "B) Facilita la estandarización de tareas.",
        "C) Contribuye a que el personal comprenda y aplique prácticas que protejan la inocuidad.",
        "D) Mejora el desempeño general de la organización."
      ],
      correctAnswer: 2
    },
    {
      id: 12,
      question: "Una correcta gestión de residuos busca principalmente:",
      options: [
        "A) Mantener la planta ordenada.",
        "B) Evitar la generación de focos de contaminación y atracción de plagas.",
        "C) Reducir el volumen de desperdicios.",
        "D) Optimizar los tiempos de limpieza."
      ],
      correctAnswer: 1
    },
    {
      id: 13,
      question: "El concepto de contaminación cruzada se relaciona con:",
      options: [
        "A) La mezcla accidental de diferentes lotes.",
        "B) La transferencia de contaminantes entre personas, superficies, equipos o alimentos.",
        "C) El uso simultáneo de distintas materias primas.",
        "D) El almacenamiento compartido de materiales."
      ],
      correctAnswer: 1
    },
    {
      id: 14,
      question: "La trazabilidad dentro de un sistema BPM permite:",
      options: [
        "A) Conocer el rendimiento de cada línea.",
        "B) Reconstruir la historia y recorrido de un producto.",
        "C) Mejorar la gestión de compras.",
        "D) Optimizar la planificación de la producción."
      ],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "La aplicación efectiva de BPM puede considerarse:",
      options: [
        "A) Un requisito documental.",
        "B) Una herramienta preventiva para proteger al consumidor.",
        "C) Un mecanismo para reducir costos.",
        "D) Un sistema de control exclusivo del producto terminado."
      ],
      correctAnswer: 1
    }
  ],
  modules: [
    // ─── MÓDULO 0: INTRODUCCIÓN ───────────────────────────────────────
    {
      id: 'intro',
      number: 0,
      title: 'Introducción',
      description: 'Qué son las BPM y por qué son obligatorias.',
      icon: '🏭',
      color: 'brand-600',
      colorHex: '#2d6a4f',
      lessons: [
        {
          id: 'intro-portada',
          title: 'BPM — Mi Gusto',
          type: 'hero',
          content: {
            title: 'Buenas Prácticas de Manufactura',
            subtitle: 'Capacitación BPM',
            description: 'Garantizar la elaboración de alimentos seguros para el consumidor mediante el control del personal, las instalaciones y las operaciones.',
            imageSuggested: 'Foto general de la planta Mi Gusto',
            imageAlt: 'Planta de producción Mi Gusto',
            image: '/diapositivas/BuenasPracticasManufactura.png',
            tagline: 'Mi Gusto · Capacitación obligatoria',
          },
        },
        {
          id: 'intro-que-son',
          title: '¿Qué son las BPM?',
          type: 'bullet-list',
          content: {
            title: '¿Qué son las BPM?',
            description: 'Las Buenas Prácticas de Manufactura son un conjunto de procedimientos obligatorios establecidos por el Código Alimentario Argentino para asegurar la inocuidad de los alimentos.',
            badge: 'CAA',
            imageSuggested: 'Producto terminado + consumidor satisfecho',
            imageAlt: 'Consumidor satisfecho con producto Mi Gusto',
            image: '/diapositivas/queSonLasBPM.png',
            mobileStackedImageGrid: true,
            items: [
              { text: 'Alimentos seguros', icon: '✅' },
              { text: 'Menos reclamos', icon: '📉' },
              { text: 'Menos desperdicios', icon: '♻️' },
              { text: 'Cumplimiento legal', icon: '⚖️' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 1: PERSONAL ───────────────────────────────────────────
    {
      id: 'personal',
      number: 1,
      title: 'El Personal',
      description: 'La primera barrera de defensa contra la contaminación.',
      icon: '👷🏻',
      color: 'blue-500',
      colorHex: '#3b82f6',
      lessons: [
        {
          id: 'personal-hero',
          title: 'Bloque 1: El Personal',
          type: 'module-hero',
          content: {
            title: 'El Personal',
            subtitle: 'Bloque 1',
            description: 'El personal es la primera barrera de defensa en la cadena de inocuidad alimentaria.',
            tagline: '7 lecciones',
          },
        },
        {
          id: 'personal-barrera',
          title: 'Primera barrera de defensa',
          type: 'alert',
          content: {
            title: 'El Personal es la Primera Barrera de Defensa',
            description: 'Un manipulador puede contaminar un alimento con:',
            mobileItemsGrid: true,
            items: [
              { text: 'Cabellos', icon: '💇🏻' },
              { text: 'Microorganismos', icon: '🦠' },
              { text: 'Objetos personales', icon: '💍' },
              { text: 'Malas prácticas', icon: '❌' },
            ],
            imageSuggested: 'Operario correctamente vestido',
            imageAlt: 'Operario con EPP correcto',
            highlight: 'Cada trabajador es responsable de la inocuidad del producto.',
            highlightVariant: 'warning',
          },
        },
        {
          id: 'personal-higiene',
          title: 'Higiene Personal',
          type: 'steps',
          content: {
            title: 'Higiene Personal',
            subtitle: 'Antes de ingresar a producción',
            imageSuggested: 'Primer plano de manos limpias',
            imageAlt: 'Manos limpias en lavamanos',
            steps: [
              { number: 1, title: 'Bañarse diariamente' },
              { number: 2, title: 'Uñas cortas y sin esmalte' },
              { number: 3, title: 'Sin perfumes excesivos' },
              { number: 4, title: 'Manos limpias al ingresar' },
            ],
          },
        },
        {
          id: 'personal-prohibidos',
          title: 'Elementos Prohibidos',
          type: 'compare',
          content: {
            title: 'Elementos Prohibidos en Producción',
            description: 'Pueden caer al producto y generar contaminación física.',
            imageSuggested: 'Foto comparativa Correcto vs Incorrecto',
            imageAlt: 'Comparación de uso de accesorios',
            image: '/diapositivas/prohibidosEnPlanta.png',
            highlight: 'Riesgo: Contaminación física del producto.',
            highlightVariant: 'danger',
          },
        },
        {
          id: 'personal-uniforme',
          title: 'Uniforme de Trabajo',
          type: 'bullet-list',
          content: {
            title: 'Uniforme de Trabajo',
            description: 'El uniforme debe mantenerse en condiciones óptimas en todo momento.',
            imageSuggested: 'Personal de Mi Gusto correctamente uniformado',
            imageAlt: 'Personal con uniforme completo',
            image: '/diapositivas/Uniforme.png',
            imageFit: 'contain',
            mobileStackedImageGrid: true,
            items: [
              { text: 'Limpio', icon: '✨' },
              { text: 'Completo', icon: '✅' },
              { text: 'En buen estado', icon: '👍' },
              { text: 'Exclusivo para producción', icon: '🏭' },
            ],
          },
        },
        {
          id: 'personal-cofia',
          title: 'Uso de Cofia y Barbijo',
          type: 'compare',
          content: {
            title: 'Uso Correcto de Cofia y Barbijo',
            imageSuggested: 'Ejemplo correcto e incorrecto de cofia y barbijo',
            imageAlt: 'Uso correcto e incorrecto de EPP facial',
            image: '/diapositivas/UsoCorrectoBarbijo.png',
          },
        },
        {
          id: 'personal-lavado',
          title: 'Lavado de Manos',
          type: 'steps',
          content: {
            title: 'Lavado de Manos',
            subtitle: 'Momentos obligatorios',
            imageSuggested: 'Secuencia de lavado de manos paso a paso',
            imageAlt: 'Secuencia de lavado de manos',
            steps: [
              { number: 1, title: 'Al ingresar a producción' },
              { number: 2, title: 'Luego de ir al baño' },
              { number: 3, title: 'Después de comer o beber' },
              { number: 4, title: 'Luego de tocar residuos' },
              { number: 5, title: 'Al cambiar de tarea' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 2: INSTALACIONES ──────────────────────────────────────
    {
      id: 'instalaciones',
      number: 2,
      title: 'Las Instalaciones',
      description: 'Condiciones físicas que garantizan la elaboración segura.',
      icon: '🏗️',
      color: 'amber-500',
      colorHex: '#f59e0b',
      lessons: [
        {
          id: 'inst-hero',
          title: 'Bloque 2: Instalaciones',
          type: 'module-hero',
          content: {
            title: 'Las Instalaciones',
            subtitle: 'Bloque 2',
            description: 'El CAA establece que los establecimientos deben mantenerse en condiciones que permitan la elaboración segura de alimentos.',
            tagline: '7 lecciones',
          },
        },
        {
          id: 'inst-intro',
          title: 'Instalaciones Higiénicas',
          type: 'bullet-list',
          content: {
            title: 'Instalaciones Higiénicas',
            badge: 'CAA',
            description: 'El Código Alimentario Argentino establece que los establecimientos deben mantenerse en condiciones que permitan la elaboración segura de alimentos.',
            items: [
              { text: 'Superficies lavables y resistentes', icon: '🧹' },
              { text: 'Sin grietas ni roturas', icon: '🔍' },
              { text: 'Libres de humedad y desprendimientos', icon: '💧' },
              { text: 'Buena iluminación y ventilación', icon: '💡' },
            ],
          },
        },
        {
          id: 'inst-pisos',
          title: 'Pisos',
          type: 'bullet-list',
          content: {
            title: 'Pisos',
            imageSuggested: 'Piso sanitario de la planta',
            imageAlt: 'Piso lavable antideslizante de la planta',
            image: '/diapositivas/pisos.png',
          },
        },
        {
          id: 'inst-paredes',
          title: 'Paredes y Techos',
          type: 'compare',
          content: {
            title: 'Paredes y Techos',
            imageSuggested: 'Ejemplo correcto e incorrecto de paredes',
            imageAlt: 'Estado de paredes y techos',
            image: '/diapositivas/paredesYtechos.png',
            mobileItemsGrid: true,
            compareColumns: [
              {
                label: 'Incorrecto ❌',
                variant: 'incorrect',
                items: ['Con humedad o manchas', 'Con desprendimientos', 'Sucios o con hongos'],
              },
              {
                label: 'Correcto ✅',
                variant: 'correct',
                items: ['Limpios y secos', 'Sin humedad', 'Sin desprendimientos'],
              },
            ],
          },
        },
        {
          id: 'inst-iluminacion',
          title: 'Iluminación',
          type: 'bullet-list',
          content: {
            title: 'Iluminación',
            description: 'Una buena iluminación es fundamental para la seguridad alimentaria.',
            items: [
              { text: 'Detectar suciedad fácilmente', icon: '🔦' },
              { text: 'Verificar limpieza correctamente', icon: '🔍' },
              { text: 'Evitar errores en el proceso', icon: '✅' },
            ],
          },
        },
        {
          id: 'inst-ventilacion',
          title: 'Ventilación',
          type: 'bullet-list',
          content: {
            title: 'Ventilación',
            description: 'La ventilación adecuada es clave para mantener condiciones seguras de producción.',
            items: [
              { text: 'Evitar condensación', icon: '💨' },
              { text: 'Reducir humedad ambiental', icon: '📉' },
              { text: 'Mejorar el ambiente de trabajo', icon: '🌬️' },
            ],
          },
        },
        {
          id: 'inst-agua',
          title: 'Agua Potable',
          type: 'alert',
          content: {
            title: 'Agua Potable',
            description: 'Toda el agua utilizada en la planta debe ser potable:',
            items: [
              { text: 'Elaboración de productos', icon: '🍽️' },
              { text: 'Limpieza de equipos y superficies', icon: '🧽' },
              { text: 'Lavado de manos del personal', icon: '🙌' },
            ],
            highlight: 'El uso de agua no potable es causa directa de contaminación alimentaria.',
            highlightVariant: 'danger',
          },
        },
        {
          id: 'inst-plagas',
          title: 'Control de Plagas',
          type: 'alert',
          content: {
            title: 'Control de Plagas',
            description: 'Se debe evitar el ingreso de:',
            items: [
              { text: 'Insectos', icon: '🪲' },
              { text: 'Roedores', icon: '🐀' },
              { text: 'Aves', icon: '🐦' },
            ],
            highlight: 'Señales de alerta: excrementos, insectos vivos, material dañado o roído.',
            highlightVariant: 'warning',
          },
        },
      ],
    },

    // ─── MÓDULO 3: OPERACIONES ────────────────────────────────────────
    {
      id: 'operaciones',
      number: 3,
      title: 'Las Operaciones',
      description: 'Control de procesos para garantizar la inocuidad.',
      icon: '⚙️',
      color: 'purple-500',
      colorHex: '#a855f7',
      lessons: [
        {
          id: 'op-hero',
          title: 'Bloque 3: Operaciones',
          type: 'module-hero',
          content: {
            title: 'Las Operaciones',
            subtitle: 'Bloque 3',
            description: 'El control de los procesos productivos es fundamental para garantizar que el alimento llegue al consumidor de forma segura.',
            tagline: '8 lecciones',
          },
        },
        {
          id: 'op-recepcion',
          title: 'Recepción de Materias Primas',
          type: 'steps',
          content: {
            title: 'Recepción de Materias Primas',
            subtitle: 'Verificar siempre al recibir',
            steps: [
              { number: 1, title: 'Temperatura del producto y transporte' },
              { number: 2, title: 'Estado del vehículo de entrega' },
              { number: 3, title: 'Integridad de los envases' },
              { number: 4, title: 'Fecha de vencimiento' },
              { number: 5, title: 'Número de lote' },
            ],
          },
        },
        {
          id: 'op-almacenamiento',
          title: 'Almacenamiento',
          type: 'bullet-list',
          content: {
            title: 'Almacenamiento',
            description: 'Separar correctamente para evitar contaminación cruzada.',
            imageSuggested: 'Depósito ordenado y correctamente organizado',
            imageAlt: 'Depósito ordenado de materias primas',
            image: '/diapositivas/almacenamiento.png',
            mobileStackedImageGrid: true,
            items: [
              { text: 'Materias primas', icon: '📦' },
              { text: 'Material de empaque', icon: '📫' },
              { text: 'Producto terminado', icon: '🏷️' },
              { text: 'Productos químicos', icon: '⚗️' },
            ],
            highlight: 'Cada categoría debe almacenarse en su área designada, separada físicamente.',
            highlightVariant: 'info',
          },
        },
        {
          id: 'op-lotes',
          title: 'Identificación de Lotes',
          type: 'alert',
          content: {
            title: 'Identificación de Lotes',
            description: 'Todo producto debe estar identificado con su número de lote.',
            highlight: 'Sin identificación de lote → no existe trazabilidad. Si hay un problema, no se puede rastrear el producto.',
            highlightVariant: 'danger',
            items: [
              { text: 'Identificar siempre todo producto', icon: '🏷️' },
              { text: 'Registrar el lote en planillas', icon: '📋' },
              { text: 'Permitir trazabilidad completa', icon: '🔍' },
            ],
          },
        },
        {
          id: 'op-contaminacion',
          title: 'Contaminación Cruzada',
          type: 'alert',
          content: {
            title: 'Contaminación Cruzada',
            description: 'Ocurre cuando un contaminante pasa de un lugar a otro. Ejemplos:',
            items: [
              { text: 'Manos sucias que tocan alimentos', icon: '🤲' },
              { text: 'Utensilios contaminados sin lavar', icon: '🍴' },
              { text: 'Contacto entre productos crudos y cocidos', icon: '🥩' },
            ],
            highlight: 'La contaminación cruzada es una de las principales causas de enfermedades transmitidas por alimentos.',
            highlightVariant: 'danger',
          },
        },
        {
          id: 'op-limpieza',
          title: 'Limpieza y Desinfección',
          type: 'bullet-list',
          content: {
            title: 'Limpieza y Desinfección',
            badge: 'CAA',
            description: 'El CAA establece que las áreas de manipulación, equipos y utensilios deben limpiarse y desinfectarse con la frecuencia necesaria para evitar contaminación.',
            items: [
              { text: 'Áreas de manipulación de alimentos', icon: '🧹' },
              { text: 'Equipos y maquinaria', icon: '⚙️' },
              { text: 'Utensilios y herramientas', icon: '🍴' },
              { text: 'Con la frecuencia necesaria', icon: '🔄' },
            ],
          },
        },
        {
          id: 'op-quimicos',
          title: 'Productos Químicos',
          type: 'steps',
          content: {
            title: 'Productos Químicos',
            badge: 'CAA',
            description: 'El CAA exige su control para evitar contaminación química.',
            steps: [
              { number: 1, title: 'Identificados correctamente con etiqueta' },
              { number: 2, title: 'Autorizados para uso en industria alimentaria' },
              { number: 3, title: 'Almacenados fuera del área de producción' },
            ],
          },
        },
        {
          id: 'op-residuos',
          title: 'Residuos',
          type: 'alert',
          content: {
            title: 'Residuos',
            description: 'Los residuos deben retirarse frecuentemente para evitar:',
            items: [
              { text: 'Generación de olores', icon: '👃' },
              { text: 'Atracción de plagas', icon: '🪲' },
              { text: 'Contaminación de productos', icon: '⚠️' },
            ],
            highlight: 'Los residuos acumulados son una de las principales fuentes de contaminación y atracción de plagas.',
            highlightVariant: 'warning',
          },
        },
        {
          id: 'op-registros',
          title: 'Registros',
          type: 'quote',
          content: {
            title: 'Registros',
            quote: 'Si no está registrado, no puede demostrarse.',
            description: 'Completar siempre:',
            mobileItemsGrid: true,
            items: [
              { text: 'Planillas de control', icon: '📋' },
              { text: 'Registros de limpieza y desinfección', icon: '🧹' },
              { text: 'Trazabilidad de lotes', icon: '🔍' },
              { text: 'Controles de temperatura', icon: '🌡️' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 4: CIERRE ─────────────────────────────────────────────
    {
      id: 'cierre',
      number: 4,
      title: 'Compromiso',
      description: 'Todos somos responsables de la inocuidad alimentaria.',
      icon: '🤝🏻',
      color: 'brand-600',
      colorHex: '#2d6a4f',
      lessons: [
        {
          id: 'cierre-responsables',
          title: 'Todos Somos Responsables',
          type: 'alert',
          content: {
            title: 'Todos Somos Responsables',
            description: 'La inocuidad no depende solamente del área de Calidad. Cada colaborador es responsable de proteger al consumidor.',
            imageSuggested: 'Foto grupal del personal Mi Gusto',
            imageAlt: 'Equipo Mi Gusto trabajando junto',
            highlight: 'Cada tarea que realizás, por pequeña que sea, impacta en la seguridad del alimento.',
            highlightVariant: 'success',
            mobileItemsGrid: true,
            items: [
              { text: 'El personal', icon: '👷🏻' },
              { text: 'Producción', icon: '🏭' },
              { text: 'Calidad', icon: '✅' },
              { text: 'Logística', icon: '🚛' },
            ],
          },
        },
        {
          id: 'cierre-compromiso',
          title: 'Mi Compromiso',
          type: 'commitment',
          content: {
            title: 'Mi Compromiso',
            quote: '"Cada tarea que realizo impacta en la seguridad del alimento que llegará a una familia."',
            description: 'Al completar esta capacitación, me comprometo a aplicar las Buenas Prácticas de Manufactura en cada jornada de trabajo.',
          },
        },
        {
          id: 'evaluacion-test',
          title: 'Evaluación de BPM',
          type: 'evaluation',
          content: {
            title: 'Evaluación de BPM',
            description: 'Completá la evaluación obligatoria de 15 preguntas de opción múltiple.',
          },
        },
        {
          id: 'cierre-equipo',
          title: 'Trabajemos en Equipo',
          type: 'closing',
          content: {
            title: '¡Gracias por capacitarte!',
            subtitle: 'Trabajemos en Equipo',
            description: 'La calidad y la inocuidad la hacemos entre todos.',
            tagline: 'Mi Gusto · BPM',
          },
        },
      ],
    },
  ],
}

export const COURSE_ARMADO: Course = {
  id: 'armado',
  title: 'Armado',
  subtitle: 'Roles y responsabilidades de cada puesto',
  company: 'Mi Gusto',
  totalModules: 5,
  objectives: [
    'Detectar desvíos a tiempo en la producción',
    'Garantizar la calidad, inocuidad y presentación del producto',
    'Asegurar la trazabilidad y reducir desperdicios',
  ],
  passScore: 18,
  questions: [
    {
      id: 1,
      question: "¿Cuál de las siguientes actividades corresponde al Checker?",
      options: [
        "A) Abrir tapas y trasladar bateas vacías.",
        "B) Verificar peso, estado de las empanadas y completar registros.",
        "C) Cargar relleno y realizar cambios de matrices.",
        "D) Controlar únicamente el cierre de las empanadas."
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Al detectar una bandeja incompleta, el Checker debe:",
      options: [
        "A) Completarla con empanadas de cualquier lote.",
        "B) Registrar la situación y continuar sin informar.",
        "C) Verificar la causa e informar el desvío si corresponde.",
        "D) Guardarla igualmente para evitar demoras."
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "¿Por qué es importante verificar las etiquetas?",
      options: [
        "A) Porque permiten conocer el operador que trabajó.",
        "B) Porque forman parte de la trazabilidad del producto.",
        "C) Porque facilitan el movimiento de carros.",
        "D) Porque indican la cantidad de desperdicio generado."
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "¿Cuál de las siguientes situaciones debe registrarse como anomalía?",
      options: [
        "A) Cambio de turno.",
        "B) Balanza encendida.",
        "C) Presencia de una batea rota.",
        "D) Producción normal."
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "¿Cuál es una práctica incorrecta durante la manipulación de tapas?",
      options: [
        "A) Utilizar guantes en ambas manos.",
        "B) Controlar la temperatura de las tapas.",
        "C) Estirar la masa utilizando el codo.",
        "D) Informar anomalías observadas."
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "¿Cuál es el objetivo de controlar el estado de las tapas?",
      options: [
        "A) Reducir el tiempo de producción.",
        "B) Detectar defectos que puedan afectar el producto final.",
        "C) Evitar el uso de guantes.",
        "D) Mejorar la velocidad del cargador."
      ],
      correctAnswer: 1
    },
    {
      id: 7,
      question: "La torre de tapas debe realizarse:",
      options: [
        "A) Directamente sobre el piso.",
        "B) Sobre cualquier superficie disponible.",
        "C) Utilizando un cajón vacío como base.",
        "D) Sobre bateas de producto terminado."
      ],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "Si se detectan tapas con defectos visibles, el Tapero debe:",
      options: [
        "A) Continuar utilizándolas hasta finalizar el lote.",
        "B) Separarlas e informar la situación.",
        "C) Mezclarlas con tapas en buen estado.",
        "D) Esperar la inspección del siguiente turno."
      ],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "¿Cuál es una de las responsabilidades del Sacador?",
      options: [
        "A) Realizar el cambio de matrices.",
        "B) Controlar manualmente el peso de las empanadas.",
        "C) Abrir tapas para la línea.",
        "D) Completar etiquetas de producción."
      ],
      correctAnswer: 1
    },
    {
      id: 10,
      question: "Una empanada manchada debe:",
      options: [
        "A) Continuar en la línea si cumple el peso.",
        "B) Ser apartada para evaluación.",
        "C) Colocarse en el fondo de la bandeja.",
        "D) Mezclarse con producto conforme."
      ],
      correctAnswer: 1
    },
    {
      id: 11,
      question: "¿Qué debe verificar antes de guardar una bandeja?",
      options: [
        "A) Que la bandeja esté completa y correctamente acondicionada.",
        "B) Que el carro esté identificado.",
        "C) Que existan bateas vacías disponibles.",
        "D) Que el cargador haya limpiado la máquina."
      ],
      correctAnswer: 0
    },
    {
      id: 12,
      question: "El papel sulfito debe:",
      options: [
        "A) Cubrir correctamente la bandeja.",
        "B) Utilizarse únicamente en algunos gustos.",
        "C) Colocarse después del congelado.",
        "D) Reemplazarse por cualquier papel disponible."
      ],
      correctAnswer: 0
    },
    {
      id: 13,
      question: "¿Cuál es la función principal del Cargador?",
      options: [
        "A) Verificar planillas.",
        "B) Controlar contramuestras.",
        "C) Abastecer correctamente la máquina.",
        "D) Transportar carros completos."
      ],
      correctAnswer: 2
    },
    {
      id: 14,
      question: "Un cambio incorrecto de matrices puede generar:",
      options: [
        "A) Mejor rendimiento.",
        "B) Defectos en el producto elaborado.",
        "C) Menor necesidad de controles.",
        "D) Ningún impacto en la producción."
      ],
      correctAnswer: 1
    },
    {
      id: 15,
      question: "Si detecta una situación que puede afectar la producción, el Cargador debe:",
      options: [
        "A) Esperar al final del turno.",
        "B) Informar inmediatamente.",
        "C) Resolverla sin comunicarla.",
        "D) Continuar hasta que alguien más la detecte."
      ],
      correctAnswer: 1
    },
    {
      id: 16,
      question: "La limpieza frecuente de la máquina permite:",
      options: [
        "A) Reducir controles de calidad.",
        "B) Evitar acumulación de residuos y posibles contaminaciones.",
        "C) Incrementar la temperatura del producto.",
        "D) Disminuir el uso de IAC."
      ],
      correctAnswer: 1
    },
    {
      id: 17,
      question: "¿Cuál de las siguientes tareas corresponde al Libero?",
      options: [
        "A) Controlar el peso de las empanadas.",
        "B) Realizar marcaciones.",
        "C) Retirar bateas vacías y mantener el orden del sector.",
        "D) Colocar etiquetas de contramuestra."
      ],
      correctAnswer: 2
    },
    {
      id: 18,
      question: "Antes de iniciar la producción, el Libero debe verificar:",
      options: [
        "A) Que las máquinas estén correctamente armadas y limpias.",
        "B) Que las planillas estén archivadas.",
        "C) Que existan empanadas congeladas en cámara.",
        "D) Que todas las etiquetas estén impresas."
      ],
      correctAnswer: 0
    },
    {
      id: 19,
      question: "Mantener el orden en cámaras permite:",
      options: [
        "A) Mejorar la organización y reducir riesgos operativos.",
        "B) Eliminar la necesidad de registros.",
        "C) Disminuir controles de calidad.",
        "D) Reducir la cantidad de personal."
      ],
      correctAnswer: 0
    },
    {
      id: 20,
      question: "¿Qué debe hacer el Libero ante una solicitud de la línea?",
      options: [
        "A) Atenderla oportunamente para mantener la continuidad del proceso.",
        "B) Esperar la autorización del siguiente turno.",
        "C) Priorizar únicamente tareas administrativas.",
        "D) Resolverla cuando finalice la producción."
      ],
      correctAnswer: 0
    },
    {
      id: 21,
      question: "¿Qué tienen en común todos los puestos del sector Armado?",
      options: [
        "A) Son responsables únicamente de la velocidad de producción.",
        "B) Comparten la responsabilidad de asegurar la calidad, inocuidad y conformidad del producto.",
        "C) Realizan exactamente las mismas tareas.",
        "D) Su función principal es completar documentación."
      ],
      correctAnswer: 1
    },
    {
      id: 22,
      question: "Ante una anomalía detectada durante la producción, la conducta correcta es:",
      options: [
        "A) Esperar a que el supervisor la detecte.",
        "B) Informarla, registrarla y actuar según corresponda.",
        "C) Continuar produciendo para evitar demoras.",
        "D) Corregirla sin comunicarla."
      ],
      correctAnswer: 1
    }
  ],
  modules: [
    // ─── MÓDULO 0: INTRODUCCIÓN ───────────────────────────────────────
    {
      id: 'intro',
      number: 0,
      title: 'Introducción',
      description: 'El sector Armado y su importancia en la calidad.',
      icon: '🥟',
      color: 'brand-600',
      colorHex: '#2d6a4f',
      lessons: [
        {
          id: 'armado-portada',
          title: 'Armado — Mi Gusto',
          type: 'hero',
          content: {
            title: 'Sector Armado',
            subtitle: 'Roles y Responsabilidades',
            description: 'El sector Armado es uno de los últimos controles antes de que las empanadas salgan a la venta. Cada puesto tiene tareas específicas que contribuyen a garantizar la calidad, inocuidad, trazabilidad y presentación del producto.',
            imageSuggested: 'Operarios armando empanadas en línea de producción',
            imageAlt: 'Línea de armado de empanadas',
            tagline: 'Mi Gusto · Capacitación de Sector',
          },
        },
        {
          id: 'armado-intro-que-es',
          title: 'Importancia del Sector',
          type: 'bullet-list',
          content: {
            title: 'Objetivos del Sector',
            description: 'El cumplimiento de estas actividades permite detectar desvíos a tiempo, evitar desperdicios y asegurar que el producto llegue al cliente en óptimas condiciones.',
            badge: 'Calidad',
            mobileStackedImageGrid: true,
            items: [
              { text: 'Detectar desvíos a tiempo', icon: '🔍' },
              { text: 'Evitar desperdicios', icon: '♻️' },
              { text: 'Asegurar la inocuidad', icon: '🛡️' },
              { text: 'Llegar en óptimas condiciones', icon: '🤝' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 1: CHECKER ─────────────────────────────────────────────
    {
      id: 'checker',
      number: 1,
      title: 'Checker',
      description: 'Responsable de controles de calidad y registros.',
      icon: '📋',
      color: 'blue-500',
      colorHex: '#3b82f6',
      lessons: [
        {
          id: 'checker-hero',
          title: 'Módulo 1: Checker',
          type: 'module-hero',
          content: {
            title: 'El Checker',
            subtitle: 'Módulo 1',
            description: 'El Checker es el principal responsable de los controles de calidad y registros durante la producción.',
            tagline: '8 lecciones',
          },
        },
        {
          id: 'checker-antes',
          title: 'Antes de Comenzar',
          type: 'bullet-list',
          content: {
            title: 'Elementos del Checker',
            description: 'Debe verificar que dispone de todos los elementos necesarios para realizar correctamente su trabajo:',
            items: [
              { text: 'Balanza', icon: '⚖️' },
              { text: 'Guantes', icon: '🧤' },
              { text: 'Tenedor o cuchara', icon: '🍴' },
              { text: 'Carpeta, Planillas y Lapicera', icon: '📋' },
              { text: 'IAC, Paños y Elementos de limpieza', icon: '🧼' },
            ],
            highlight: 'Trabajar sin alguno de estos elementos puede afectar la calidad de los controles realizados.',
            highlightVariant: 'warning',
          },
        },
        {
          id: 'checker-control',
          title: 'Control del Producto',
          type: 'bullet-list',
          content: {
            title: 'Control del Producto',
            description: 'Durante la producción debe verificar:',
            items: [
              { text: 'Peso de las empanadas: Realizar controles de peso frecuentes para asegurar el cumplimiento de las especificaciones.', icon: '⚖️' },
              { text: 'Estado general: Controlar que las empanadas estén correctamente cerradas, no estén abiertas, no estén manchadas, no presenten daños y cumplan con el peso establecido.', icon: '🥟' },
              { text: 'Bandejas: Verificar que estén completas, se encuentren limpias y contengan papel en buen estado.', icon: '📥' },
            ],
          },
        },
        {
          id: 'checker-etiquetas',
          title: 'Control de Etiquetas',
          type: 'bullet-list',
          content: {
            title: 'Control de Etiquetas',
            description: 'Las etiquetas son fundamentales para la trazabilidad. Debe verificar que:',
            items: [
              { text: 'Correspondan al producto elaborado', icon: '🏷️' },
              { text: 'Sean legibles', icon: '👀' },
              { text: 'Contengan la información correcta', icon: '✅' },
              { text: 'Estén correctamente colocadas', icon: '📍' },
            ],
          },
        },
        {
          id: 'checker-contramuestras',
          title: 'Contramuestras',
          type: 'bullet-list',
          content: {
            title: 'Contramuestras',
            description: 'El Checker debe realizar las siguientes acciones:',
            items: [
              { text: 'Colocar la etiqueta de contramuestra', icon: '🏷️' },
              { text: 'Guardar las empanadas destinadas a contramuestra', icon: '📦' },
              { text: 'Preparar muestras para evaluación sensorial cuando corresponda', icon: '👅' },
            ],
            highlight: 'Estas muestras permiten realizar verificaciones posteriores sobre el producto elaborado.',
            highlightVariant: 'info',
          },
        },
        {
          id: 'checker-materias',
          title: 'Control de Materias Primas',
          type: 'bullet-list',
          content: {
            title: 'Materias Primas y Producción',
            description: 'Debe controlar:',
            items: [
              { text: 'Uso correcto del sistema "Usar Primero"', icon: '🔄' },
              { text: 'Estado de los rellenos', icon: '🍲' },
              { text: 'Cantidad de bateas utilizadas por gusto', icon: '🔢' },
              { text: 'Correcta identificación de ayudantes cuando corresponda', icon: '👷🏻' },
            ],
          },
        },
        {
          id: 'checker-anomalias',
          title: 'Gestión de Anomalías',
          type: 'alert',
          content: {
            title: 'Gestión de Anomalías',
            description: 'Toda anomalía detectada debe ser comunicada y registrada. Por ejemplo:',
            items: [
              { text: 'Cuerpos extraños o seguros encontrados en el producto', icon: '⚠️' },
              { text: 'Tapas defectuosas o bateas rotas', icon: '❌' },
              { text: 'Problemas de máquina o rellenos fuera de especificación', icon: '⚙️' },
            ],
            highlight: 'Detectar una anomalía y no informarla puede generar problemas mayores en etapas posteriores.',
            highlightVariant: 'danger',
          },
        },
        {
          id: 'checker-limpieza',
          title: 'Orden y Limpieza',
          type: 'bullet-list',
          content: {
            title: 'Orden y Limpieza',
            description: 'El Checker también debe verificar:',
            items: [
              { text: 'Limpieza de la máquina y de la mesa', icon: '🧼' },
              { text: 'Correcto guardado de bateas en cámara', icon: '❄️' },
              { text: 'Correcta identificación de scrap y desperdicios', icon: '♻️' },
              { text: 'Lavado de matrices', icon: '🧽' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 2: TAPERO ──────────────────────────────────────────────
    {
      id: 'tapero',
      number: 2,
      title: 'Tapero',
      description: 'Suministro y manipulación de tapas.',
      icon: '🥯',
      color: 'amber-500',
      colorHex: '#f59e0b',
      lessons: [
        {
          id: 'tapero-hero',
          title: 'Módulo 2: Tapero',
          type: 'module-hero',
          content: {
            title: 'El Tapero',
            subtitle: 'Módulo 2',
            description: 'El Tapero es responsable de garantizar el correcto suministro y manipulación de tapas.',
            tagline: '4 lecciones',
          },
        },
        {
          id: 'tapero-operacion',
          title: 'Temperatura y Torres',
          type: 'steps',
          content: {
            title: 'Control de Temperatura y Torres',
            subtitle: 'Condiciones y organización',
            steps: [
              { number: 1, title: 'Control de temperatura', description: 'Las tapas deben mantenerse dentro de las condiciones establecidas para asegurar un correcto funcionamiento durante el armado. Por ello debe controlar periódicamente su temperatura.' },
              { number: 2, title: 'Armado de torres', description: 'Las torres deben realizarse utilizando un cajón vacío como base. Esto evita deformaciones y facilita la manipulación segura del producto.' },
            ],
          },
        },
        {
          id: 'tapero-manipulacion',
          title: 'Manipulación Correcta',
          type: 'compare',
          content: {
            title: 'Manipulación Correcta',
            description: 'Durante la tarea, siga las pautas de manipulación:',
            compareColumns: [
              {
                label: 'Prácticas Prohibidas ❌',
                variant: 'incorrect',
                items: ['Estirar la masa con el codo', 'Arrojar desperdicios por la cadena'],
              },
              {
                label: 'Prácticas Correctas ✅',
                variant: 'correct',
                items: ['Utilizar guantes', 'Manipular las tapas cuidadosamente'],
              },
            ],
            highlight: 'Estas prácticas pueden afectar la calidad del producto y generar riesgos de contaminación.',
            highlightVariant: 'warning',
          },
        },
        {
          id: 'tapero-visual',
          title: 'Control Visual',
          type: 'alert',
          content: {
            title: 'Control Visual',
            description: 'Debe verificar continuamente:',
            items: [
              { text: 'Estado de las tapas y presencia de roturas', icon: '🔍' },
              { text: 'Defectos y cambios de color', icon: '🎨' },
              { text: 'Cualquier anomalía', icon: '⚠️' },
            ],
            highlight: 'Ante cualquier desvío debe informar inmediatamente.',
            highlightVariant: 'danger',
          },
        },
      ],
    },

    // ─── MÓDULO 3: SACADOR ─────────────────────────────────────────────
    {
      id: 'sacador',
      number: 3,
      title: 'Sacador',
      description: 'Último control visual directo.',
      icon: '🤲',
      color: 'purple-500',
      colorHex: '#a855f7',
      lessons: [
        {
          id: 'sacador-hero',
          title: 'Módulo 3: Sacador',
          type: 'module-hero',
          content: {
            title: 'El Sacador',
            subtitle: 'Módulo 3',
            description: 'El Sacador es el último control visual directo sobre las empanadas.',
            tagline: '4 lecciones',
          },
        },
        {
          id: 'sacador-controles',
          title: 'Peso y Marcación',
          type: 'steps',
          content: {
            title: 'Peso y Marcación',
            subtitle: 'Controles críticos',
            steps: [
              { number: 1, title: 'Control de peso', description: 'Debe realizar verificaciones en balanza para asegurar que el producto se encuentra dentro de especificación. Debe dar aviso al cargador del peso de las empanadas.' },
              { number: 2, title: 'Control de marcación', description: 'Debe verificar que la marcación corresponda al gusto elaborado y que sea legible. Una marcación incorrecta puede provocar errores de identificación en etapas posteriores.' },
            ],
          },
        },
        {
          id: 'sacador-defectuosos',
          title: 'Separación de Productos Defectuosos',
          type: 'alert',
          content: {
            title: 'Separación de Productos Defectuosos',
            description: 'Debe retirar inmediatamente empanadas que presenten:',
            items: [
              { text: 'Bajo peso', icon: '⚖️' },
              { text: 'Aperturas', icon: '💥' },
              { text: 'Roturas', icon: '❌' },
              { text: 'Manchas', icon: '🎨' },
              { text: 'Pinchaduras', icon: '📍' },
              { text: 'Defectos visibles', icon: '👀' },
            ],
            highlight: 'Ningún producto defectuoso debe continuar en el proceso.',
            highlightVariant: 'danger',
          },
        },
        {
          id: 'sacador-bandejas',
          title: 'Armado de Bandejas',
          type: 'bullet-list',
          content: {
            title: 'Armado de Bandejas',
            description: 'Debe verificar:',
            items: [
              { text: 'Cantidad correcta de unidades', icon: '🔢' },
              { text: 'Correcta ubicación de las empanadas', icon: '📐' },
              { text: 'Que el papel sulfito cubra completamente la bandeja', icon: '📄' },
              { text: 'Que las empanadas no se dañen durante el guardado', icon: '🛡️' },
            ],
          },
        },
      ],
    },

    // ─── MÓDULO 4: CARGADOR ────────────────────────────────────────────
    {
      id: 'cargador',
      number: 4,
      title: 'Cargador',
      description: 'Abastecimiento de máquina y comunicación.',
      icon: '⚙️',
      color: 'amber-500',
      colorHex: '#f59e0b',
      lessons: [
        {
          id: 'cargador-hero',
          title: 'Módulo 4: Cargador',
          type: 'module-hero',
          content: {
            title: 'El Cargador',
            subtitle: 'Módulo 4',
            description: 'El Cargador es responsable del abastecimiento adecuado de la máquina.',
            tagline: '4 lecciones',
          },
        },
        {
          id: 'cargador-matrices',
          title: 'Matrices y Limpieza',
          type: 'steps',
          content: {
            title: 'Matrices y Limpieza',
            subtitle: 'Preparación',
            steps: [
              { number: 1, title: 'Cambio de matrices', description: 'Debe realizar los cambios necesarios según el producto a elaborar. Una matriz incorrecta puede generar defectos en el producto final y perdidas productivas.' },
              { number: 2, title: 'Limpieza de máquina', description: 'Debe mantener la máquina limpia utilizando IAC según corresponda. La limpieza continua ayuda a prevenir contaminación y acumulación de residuos.' },
            ],
          },
        },
        {
          id: 'cargador-carga',
          title: 'Carga de Relleno',
          type: 'bullet-list',
          content: {
            title: 'Carga de Relleno',
            description: 'Debe verificar que el relleno sea cargado correctamente. Una carga incorrecta puede afectar:',
            items: [
              { text: 'Peso', icon: '⚖️' },
              { text: 'Uniformidad', icon: '📐' },
              { text: 'Rendimiento', icon: '📈' },
              { text: 'Calidad del producto', icon: '⭐' },
            ],
          },
        },
        {
          id: 'cargador-desvios',
          title: 'Comunicación de Desvíos',
          type: 'alert',
          content: {
            title: 'Comunicación de Desvíos',
            description: 'Debe informar al Checker cuando detecte situaciones especiales durante la producción.',
            highlight: 'La comunicación rápida permite corregir problemas antes de que afecten grandes cantidades de producto.',
            highlightVariant: 'warning',
          },
        },
      ],
    },

    // ─── MÓDULO 5: LIBERO ──────────────────────────────────────────────
    {
      id: 'libero',
      number: 5,
      title: 'Libero',
      description: 'Soporte operativo, orden y organización.',
      icon: '🏃',
      color: 'brand-600',
      colorHex: '#2d6a4f',
      lessons: [
        {
          id: 'libero-hero',
          title: 'Módulo 5: Libero',
          type: 'module-hero',
          content: {
            title: 'El Libero',
            subtitle: 'Módulo 5',
            description: 'El Libero es el soporte operativo de la línea y contribuye al orden general del sector.',
            tagline: '4 lecciones',
          },
        },
        {
          id: 'libero-soporte',
          title: 'Soporte y Materiales',
          type: 'steps',
          content: {
            title: 'Soporte y Materiales',
            subtitle: 'Asistencia operativa',
            steps: [
              { number: 1, title: 'Soporte a producción', description: 'Debe mantenerse atento a las necesidades de las máquinas y operarios. Su respuesta rápida permite mantener la continuidad de la producción.' },
              { number: 2, title: 'Manejo de materiales', description: 'Entre sus tareas se encuentran: abrir tapas, retirar bateas vacías, llevar carros con bateas sucias a bacha (controlando que no contengan restos de productos) y transportar cajones vacíos usando el carro correspondiente. Todo traslado debe realizarse de manera ordenada y segura.' },
            ],
          },
        },
        {
          id: 'libero-orden',
          title: 'Orden y Organización',
          type: 'bullet-list',
          content: {
            title: 'Orden y Organización',
            description: 'Debe mantener:',
            items: [
              { text: 'Orden en el sector', icon: '🧹' },
              { text: 'Orden en cámaras', icon: '❄️' },
              { text: 'Correcto almacenamiento de materiales', icon: '📦' },
            ],
            highlight: 'El orden reduce riesgos y mejora la eficiencia.',
            highlightVariant: 'info',
          },
        },
        {
          id: 'libero-preparacion',
          title: 'Preparación de Máquinas',
          type: 'alert',
          content: {
            title: 'Preparación de Máquinas',
            description: 'Antes de iniciar la producción debe verificar:',
            items: [
              { text: 'Correcto armado de las máquinas', icon: '🔧' },
              { text: 'Ausencia de restos de masa', icon: '🧹' },
              { text: 'Ausencia de materias primas remanentes', icon: '🍲' },
              { text: 'Estado general de limpieza', icon: '✨' },
            ],
            highlight: 'Una máquina mal preparada puede afectar toda la producción del turno.',
            highlightVariant: 'danger',
          },
        },
      ],
    },

    // ─── MÓDULO 6: CONCLUSIÓN ──────────────────────────────────────────
    {
      id: 'cierre',
      number: 6,
      title: 'Compromiso',
      description: 'Todos compartimos el mismo objetivo.',
      icon: '🤝🏻',
      color: 'brand-600',
      colorHex: '#2d6a4f',
      lessons: [
        {
          id: 'cierre-objetivo',
          title: 'Objetivo Común',
          type: 'alert',
          content: {
            title: 'Objetivo Común',
            description: 'Cada puesto dentro del sector Armado tiene responsabilidades específicas, pero todos comparten un mismo objetivo:',
            highlight: 'Producir empanadas seguras, de calidad y conforme a los estándares de la empresa.',
            highlightVariant: 'success',
            mobileItemsGrid: true,
            items: [
              { text: 'Atención a detalles', icon: '👀' },
              { text: 'Cumplir controles', icon: '✅' },
              { text: 'Reportar anomalías', icon: '📞' },
              { text: 'Trabajar en equipo', icon: '🤝' },
            ],
          },
        },
        {
          id: 'cierre-compromiso',
          title: 'Mi Compromiso',
          type: 'commitment',
          content: {
            title: 'Mi Compromiso',
            quote: '"La atención a los detalles, el cumplimiento de los controles y la comunicación inmediata de anomalías son fundamentales para lograr empanadas seguras y de calidad."',
            description: 'Al completar esta capacitación, me comprometo a cumplir con los roles y controles establecidos en mi puesto del sector Armado.',
          },
        },
        {
          id: 'evaluacion-test',
          title: 'Evaluación de Armado',
          type: 'evaluation',
          content: {
            title: 'Evaluación de Armado',
            description: 'Completá la evaluación obligatoria de 22 preguntas de opción múltiple.',
          },
        },
        {
          id: 'cierre-equipo',
          title: 'Trabajemos en Equipo',
          type: 'closing',
          content: {
            title: '¡Gracias por capacitarte!',
            subtitle: 'Trabajemos en Equipo',
            description: 'La calidad y la inocuidad la hacemos entre todos.',
            tagline: 'Mi Gusto · Armado',
          },
        },
      ],
    }
  ],
}

export const COURSES_DATA: Record<string, Course> = {
  calidad: COURSE_CALIDAD,
  armado: COURSE_ARMADO,
}

/** Retorna el total de lecciones del curso */
export const getTotalLessons = (course: Course): number =>
  course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

/** Retorna la lista plana de todas las lecciones con su moduleId */
export const getFlatLessons = (course: Course) =>
  course.modules.flatMap(m =>
    m.lessons.map(l => ({ ...l, moduleId: m.id, moduleNumber: m.number }))
  )

/** Retorna la lección siguiente a la actual */
export const getNextLesson = (course: Course, moduleId: string, lessonId: string) => {
  const flat = getFlatLessons(course)
  const idx = flat.findIndex(l => l.moduleId === moduleId && l.id === lessonId)
  return flat[idx + 1] ?? null
}

/** Retorna la lección anterior a la actual */
export const getPrevLesson = (course: Course, moduleId: string, lessonId: string) => {
  const flat = getFlatLessons(course)
  const idx = flat.findIndex(l => l.moduleId === moduleId && l.id === lessonId)
  return flat[idx - 1] ?? null
}
