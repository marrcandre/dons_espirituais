export interface Gift {
  id: number
  name: string
  icon: string
}

export const gifts: readonly Gift[] = [
  { id: 0,  name: 'Profecia',                   icon: 'mdi-bullhorn' },
  { id: 1,  name: 'Pastoreio',                  icon: 'mdi-account-heart' },
  { id: 2,  name: 'Ensino',                     icon: 'mdi-school' },
  { id: 3,  name: 'Sabedoria',                  icon: 'mdi-lightbulb' },
  { id: 4,  name: 'Conhecimento',               icon: 'mdi-book-open-variant' },
  { id: 5,  name: 'Exortação',                  icon: 'mdi-hand-heart' },
  { id: 6,  name: 'Discernimento de Espíritos', icon: 'mdi-eye' },
  { id: 7,  name: 'Contribuição',               icon: 'mdi-cash-multiple' },
  { id: 8,  name: 'Socorro',                    icon: 'mdi-lifebuoy' },
  { id: 9,  name: 'Misericórdia',               icon: 'mdi-heart' },
  { id: 10, name: 'Evangelismo Transcultural',  icon: 'mdi-earth' },
  { id: 11, name: 'Evangelista',                icon: 'mdi-share-variant' },
  { id: 12, name: 'Hospitalidade',              icon: 'mdi-home-heart' },
  { id: 13, name: 'Fé',                         icon: 'mdi-star' },
  { id: 14, name: 'Liderança',                  icon: 'mdi-flag' },
  { id: 15, name: 'Administração',              icon: 'mdi-clipboard-list' },
  { id: 16, name: 'Milagres',                   icon: 'mdi-weather-lightning' },
  { id: 17, name: 'Cura',                       icon: 'mdi-medical-bag' },
  { id: 18, name: 'Línguas',                    icon: 'mdi-microphone' },
  { id: 19, name: 'Interpretação de Línguas',   icon: 'mdi-translate' },
  { id: 20, name: 'Simplicidade Voluntária',    icon: 'mdi-hand-extended' },
  { id: 21, name: 'Celibato',                   icon: 'mdi-account-outline' },
  { id: 22, name: 'Intercessão',                icon: 'mdi-hands-pray' },
  { id: 23, name: 'Libertação',                 icon: 'mdi-shield-cross' },
  { id: 24, name: 'Serviço',                    icon: 'mdi-tools' },
  { id: 25, name: 'Apóstolo',                   icon: 'mdi-crown' },
  { id: 26, name: 'Liderança em Adoração',      icon: 'mdi-music-note' },
]

export const GIFT_COUNT = gifts.length
export const giftNames: readonly string[] = gifts.map(g => g.name)

export function giftById(id: number): Gift | undefined {
  return gifts[id]
}
