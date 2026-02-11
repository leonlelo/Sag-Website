import {defineType} from 'sanity'

export default defineType({
  name: 'openingHourEntry',
  title: 'Åpningstid',
  type: 'object',
  fields: [
    {
      name: 'day',
      title: 'Dag',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'open',
      title: 'Åpner',
      type: 'string',
      description: 'F.eks. 11:00',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'close',
      title: 'Stenger',
      type: 'string',
      description: 'F.eks. 20:00',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {day: 'day', open: 'open', close: 'close'},
    prepare: ({day, open, close}) => ({
      title: `${day}: ${open} - ${close}`,
    }),
  },
})
