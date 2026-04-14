import menuMonolithTonkotsu from '@/assets/images/menu-monolith-tonkotsu.png'
import menuThermalMiso from '@/assets/images/menu-thermal-miso.png'
import menuSyntheticClear from '@/assets/images/menu-synthetic-clear.png'
import menuObsidianShoyu from '@/assets/images/menu-obsidian-shoyu.png'
import menuGyoza from '@/assets/images/menu-gyoza.png'
import menuKaraage from '@/assets/images/menu-karaage.png'
import menuEdamame from '@/assets/images/menu-edamame.png'
import homeKineticMiso from '@/assets/images/home-kinetic-miso.png'
import menuChefSignature from '@/assets/images/menu-chef-signature.png'

export type CatalogCategory = 'Ramen' | 'Drinks' | 'Sides'

export type UserCatalogItem = {
  id: string
  name: string
  description: string
  price: string
  category: CatalogCategory
  image: string
}

export const defaultUserCatalogItems: UserCatalogItem[] = [
  {
    id: 'ramen-monolith-tonkotsu',
    name: 'Monolith Tonkotsu',
    description: '48-hour broth, cured chashu, spring onions and calibrated alkaline noodles.',
    price: '$24.00',
    category: 'Ramen',
    image: menuMonolithTonkotsu,
  },
  {
    id: 'ramen-thermal-miso',
    name: 'Thermal Miso',
    description: 'Spicy miso base with charred corn, bamboo shoots and aromatic oil.',
    price: '$21.00',
    category: 'Ramen',
    image: menuThermalMiso,
  },
  {
    id: 'drink-yuzu-spark',
    name: 'Yuzu Spark Highball',
    description: 'Sparkling yuzu soda with ginger syrup and citrus zest finish.',
    price: '$11.00',
    category: 'Drinks',
    image: homeKineticMiso,
  },
  {
    id: 'side-seared-gyoza',
    name: 'Seared Gyoza',
    description: 'Pan-seared dumplings with crispy base and black vinegar reduction.',
    price: '$9.00',
    category: 'Sides',
    image: menuGyoza,
  },
  {
    id: 'ramen-synthetic-clear',
    name: 'Synthetic Clear',
    description: 'Light kombu and shiitake broth with tofu and delicate noodles.',
    price: '$19.00',
    category: 'Ramen',
    image: menuSyntheticClear,
  },
  {
    id: 'drink-matcha-cold-brew',
    name: 'Matcha Cold Brew',
    description: 'Ceremonial matcha, cold whisked with vanilla foam.',
    price: '$8.00',
    category: 'Drinks',
    image: menuChefSignature,
  },
  {
    id: 'ramen-obsidian-shoyu',
    name: 'Obsidian Shoyu',
    description: 'Dark shoyu broth with burnt garlic oil and duck confit notes.',
    price: '$22.00',
    category: 'Ramen',
    image: menuObsidianShoyu,
  },
  {
    id: 'side-atomic-karaage',
    name: 'Atomic Karaage',
    description: 'Crispy chicken bites with yuzu mayo and chili flakes.',
    price: '$12.00',
    category: 'Sides',
    image: menuKaraage,
  },
  {
    id: 'side-smoked-edamame',
    name: 'Smoked Edamame',
    description: 'Edamame pods with sea salt, sesame and subtle smoke.',
    price: '$7.00',
    category: 'Sides',
    image: menuEdamame,
  },
]
