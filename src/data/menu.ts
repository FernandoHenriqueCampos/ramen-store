export type FeatureCard = {
  badge: string
  title: string
  description: string
  price: string
  image: string
}

export type MenuItem = {
  name: string
  description: string
  price: string
  tags: string[]
  image: string
}

export type AdminItem = {
  name: string
  category: string
  price: string
  status: 'Active' | 'Low Stock'
}

export const featureCards: FeatureCard[] = [
  {
    badge: 'Spec 01',
    title: 'The Nebula',
    description: 'Black garlic tonkotsu, smoked wood ear mushrooms, 48-hour cured chashu.',
    price: '$24.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACg452f7xDe5EtFwZ6KIdRUfPGtWo5_NLOUtoYbfxm8VSnezq0bydo59Ik95_wNTW58LHEoXOz7-vd5i-qRjECLoHKGJ_OtuA434pWbrVVMi-tEM3SQY1Z6tscGRE4oY8B1nvovGVTYif2nFLDPA8WFV3Uv_Lqx0VV6vagvEg5-IvRunzup1hIgGFihRpD8PMsWf0-JMKcSoZ-5jKuI5G1-1DMjEe9o9-hNoDr_HF8tZKTSn2vLK4dtuNu9SU0DyMsIEEH-1kBkLRx'
  },
  {
    badge: 'Core',
    title: 'Core Tonkotsu',
    description: 'Classic marrow broth with calibrated noodle geometry and ash oil finish.',
    price: '$18.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoe57P-C-YkIOX4fTmgsjJDAbsgHwlYUbRpPfwMmoSmvQn1b-bFKf3xt-5BuMfvQNDmWFJ1NwKgecgH-8es3CW9RPinj_DvWD2AxEmZUTZ2fpkhLBQ_ReuBcDdF6-EkEBrGqt8gd-ODj4IOMLaTzVvO4J5nqLgRRmbJsdPyx-5HNC33QVANg-fu0cvP9bHRIOvV0r02YpK57VsmWNyoeZOQm11tD5QOivL6dHjyJC0cvOb4Gf8bx0VyHz8eXRvfXL2i82BbyGL5-_b'
  },
  {
    badge: 'Hot',
    title: 'Kinetic Miso',
    description: 'Fermented miso heat profile with balanced acidity and charred corn.',
    price: '$19.50',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRm-77a5Nu3kynNVzLdeF_r8fzvo5uaemsUgxq02Dm7-PubdWalCljbUVWOG0bg4_Q1pKdtW1OJnlHp8otJOX-e-bPMkW6WKvcdZFiKD1j3l8trk7SgeXNWihy_ScAXjm4dKXUOkZWCJR9yKpYOm7DH3ZdrBS__SxqsxehhD2RTsO-NkTNOWLFJvOkcjvg8GQv-7l7BD8G_ZuLL15YxFUabwSV6tu-qEfLuHwDOFncZu4ynuv35N1_IvR_foEihTyRYlzWRnCsHmJh'
  }
]

export const menuItems: MenuItem[] = [
  {
    name: 'The Monolith Tonkotsu',
    description: '48-hour bone marrow reduction, triple-pressed noodles, precision-cured pork.',
    price: '$24.00',
    tags: ['Signature', 'Intense Umami'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtB1HJmldUjRzMDCYcyFOQiz286YcCkcv70ujKS1DY7idE9q7dHp0kMSPRyxj9WS3Ml6OqVPvo3rG4SU3_FemPlcX73IpWKVAQmflwnBzMOiMjV2Gr6fvxFBWmzbDy2rjYY6JZJFlXohUkBREWgywXZKOxQNoS9B9Nq4nlTEbxg36y3_kgQcJTsbdyYWXvh9Fdvf1zGPSKsAA5FGwcFprKq9WNobfUl4sybFGxd7Dro_BILdyem3MzhIwr9OEzADZO_E3V7VNAYC-T'
  },
  {
    name: 'Thermal Miso',
    description: 'Fermented chili paste, charred corn and high-tensile rye noodles.',
    price: '$21.00',
    tags: ['Spicy', 'Experimental'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBuA3W86iN724lapyqX4zJbwaHwVATapoxcZ3HOBG59260p5Ta_16O5bKnnwAaPs-znZxhvAfqIjpRS769w4lqtQtLp8sOz8dKSTEu85PN7VFIgsbZENv5tqc2KOy-VUlW05pHF8dOAYRtTYCl8pLxNAclKvaUvlg9jiqGT58iz7ufh0AHeyugDtO42JGrZuDZ1a26u1gubiGN5ADuuKfk5bG3gHigQOSkEp7KXv0LNmiTj7fAnv_lPnb35J5OoNDRR0R_av3OLNXfU'
  },
  {
    name: 'Synthetic Clear',
    description: 'Double-filtered kombu and shiitake broth with minimalist aromatic finish.',
    price: '$19.00',
    tags: ['Vegan', 'Clean'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAb2S_6f0bOcgNbqzDgrT7zWwtHJbUndO_PjFApeMVe3pzA9DXxKJA7IBQhvDMGoAZuyxz-YjrS2qW4b5z82CtOuyoMtAHETlDDVCYV9myHvazLdi27tm5KnPORmWQsnl6LErAOiFuyoN4LwDQGQFpbFQ_jfP_lVdvn4AnCVa6-cTi5bl3E5JWtiO79eiF1MkaMkxf3_GAgyreA57c7JTQVfO72YGLi-4V-GDXKiIXISgm9-LkyXSi_Njw4045FZkw7fBxkcKuNbK5T'
  },
  {
    name: 'Obsidian Shoyu',
    description: 'Burnt garlic oil, aged soy reduction and duck confit.',
    price: '$22.00',
    tags: ['Dark Broth', 'Rich'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEHu6ZEpESFBgsXU3pRWksSsEV81igZaWo7WEApYEW8MFIY_8CmgHCfwQ9xUR0oVvjI1h9cd4vBRNesWP17HLHAfTh8I6feegtulkQf2w0seKmZ6bT4OxXTO9t3XZY0m7cqmGlXB9LXj1hxqZRlgU9dMsCQIQoxFe9bkUM_gZWkhtZK86OQZBH2WGNIr1vplpz-m5L9NEuxw4f3-tr_MV8jTevfmaSX-VY7xVMoSUHqTh77VdBmGPcVMP0OVJceVobpaUhe8cdLq3f'
  }
]

export const adminItems: AdminItem[] = [
  { name: 'The Nebula', category: 'Ramen', price: '$24.00', status: 'Active' },
  { name: 'Core Tonkotsu', category: 'Ramen', price: '$18.00', status: 'Active' },
  { name: 'Kinetic Miso', category: 'Ramen', price: '$19.50', status: 'Low Stock' },
  { name: 'Seared Gyoza', category: 'Side', price: '$9.00', status: 'Active' }
]
