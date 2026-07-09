export interface Gift {
  id: number
  name: string
  icon: string
  color: string
}

export const gifts: readonly Gift[] = [
  { id: 0,  name: 'Profecia',                      icon: 'mdi-bullhorn',          color: '#1B5438' },
  { id: 1,  name: 'Pastoreio',                    icon: 'mdi-account-heart',     color: '#1B5438' },
  { id: 2,  name: 'Ensino',                       icon: 'mdi-school',            color: '#1B5438' },
  { id: 3,  name: 'Sabedoria',                    icon: 'mdi-lightbulb',         color: '#1B5438' },
  { id: 4,  name: 'Conhecimento',                 icon: 'mdi-book-open-variant', color: '#1B5438' },
  { id: 5,  name: 'Exortação',                    icon: 'mdi-hand-heart',        color: '#1B5438' },
  { id: 6,  name: 'Discernimento de Espíritos',   icon: 'mdi-eye',               color: '#1B5438' },
  { id: 7,  name: 'Contribuição',                 icon: 'mdi-cash-multiple',     color: '#1B5438' },
  { id: 8,  name: 'Socorro',                      icon: 'mdi-lifebuoy',          color: '#1B5438' },
  { id: 9,  name: 'Misericórdia',                 icon: 'mdi-heart',             color: '#1B5438' },
  { id: 10, name: 'Evangelismo Transcultural',    icon: 'mdi-earth',             color: '#1B5438' },
  { id: 11, name: 'Evangelista',                  icon: 'mdi-share-variant',     color: '#1B5438' },
  { id: 12, name: 'Hospitalidade',                icon: 'mdi-home-heart',        color: '#1B5438' },
  { id: 13, name: 'Fé',                           icon: 'mdi-star',              color: '#1B5438' },
  { id: 14, name: 'Liderança',                    icon: 'mdi-flag',              color: '#1B5438' },
  { id: 15, name: 'Administração',                icon: 'mdi-clipboard-list',    color: '#1B5438' },
  { id: 16, name: 'Milagres',                     icon: 'mdi-weather-lightning', color: '#1B5438' },
  { id: 17, name: 'Cura',                         icon: 'mdi-medical-bag',      color: '#1B5438' },
  { id: 18, name: 'Línguas',                     icon: 'mdi-microphone',       color: '#1B5438' },
  { id: 19, name: 'Interpretação de Línguas',     icon: 'mdi-translate',        color: '#1B5438' },
  { id: 20, name: 'Simplicidade Voluntária',      icon: 'mdi-hand-extended',    color: '#1B5438' },
  { id: 21, name: 'Celibato',                     icon: 'mdi-account-outline',  color: '#1B5438' },
  { id: 22, name: 'Intercessão',                  icon: 'mdi-hands-pray',       color: '#1B5438' },
  { id: 23, name: 'Libertação',                   icon: 'mdi-shield-cross',     color: '#1B5438' },
  { id: 24, name: 'Serviço',                      icon: 'mdi-tools',            color: '#1B5438' },
  { id: 25, name: 'Apóstolo',                     icon: 'mdi-crown',            color: '#1B5438' },
  { id: 26, name: 'Liderança em Adoração',        icon: 'mdi-music-note',       color: '#1B5438' },
]

export const GIFT_COUNT = gifts.length
export const giftNames: readonly string[] = gifts.map(g => g.name)

export function giftById(id: number): Gift | undefined {
  return gifts[id]
}
