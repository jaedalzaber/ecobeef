import type { Block } from 'payload'

export const Home: Block = {
  slug: 'home',
  fields: [
    {
      name: 'missionImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Mission Image',
      required: false, 
    },
  ],
  interfaceName: 'Home',
}
