export interface Training {
  id: string
  title: string
  shortTitle: string
  icon: string
  description: string
  active: boolean
  tagline: string
}

export const TRAININGS: Training[] = [
  {
    id: 'calidad',
    title: 'Calidad (BPM)',
    shortTitle: 'BPM',
    icon: '🛡️',
    active: true,
    tagline: 'Obligatorio y Disponible',
    description: 'Buenas Prácticas de Manufactura en elaboración de alimentos.',
  },
  {
    id: 'armado',
    title: 'Armado',
    shortTitle: 'Armado',
    icon: '🥟',
    active: true,
    tagline: 'Disponible',
    description: 'Técnicas de armado, repulgue y control de calidad de empanadas.',
  },
  {
    id: 'seguridad',
    title: 'Seguridad e Higiene',
    shortTitle: 'Seguridad',
    icon: '🦺',
    active: false,
    tagline: 'Próximamente',
    description: 'Prevención de riesgos laborales y uso de elementos de protección.',
  },
  {
    id: 'operaciones',
    title: 'Operaciones de Planta',
    shortTitle: 'Operaciones',
    icon: '⚙️',
    active: false,
    tagline: 'Próximamente',
    description: 'Uso eficiente de maquinarias, hornos y equipos productivos.',
  },
  {
    id: 'logistica',
    title: 'Logística y Despacho',
    shortTitle: 'Logística',
    icon: '📦',
    active: false,
    tagline: 'Próximamente',
    description: 'Preparación de pedidos, almacenamiento y cadena de frío.',
  },
  {
    id: 'atencion',
    title: 'Atención al Cliente',
    shortTitle: 'Atención',
    icon: '🤝🏻',
    active: false,
    tagline: 'Próximamente',
    description: 'Estándares de servicio en sucursales y experiencia de marca.',
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento Preventivo',
    shortTitle: 'Mantenimiento',
    icon: '🔧',
    active: false,
    tagline: 'Próximamente',
    description: 'Limpieza técnica, calibración y conservación de activos.',
  },
]
