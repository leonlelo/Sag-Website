import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Sideinnstillinger',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Forside'},
    {name: 'hours', title: 'Åpningstider'},
    {name: 'contact', title: 'Kontakt'},
    {name: 'sections', title: 'Seksjonstitler'},
  ],
  fields: [
    // Hero
    {
      name: 'heroTitle',
      title: 'Hovedtittel (forside)',
      type: 'string',
      group: 'hero',
      initialValue: 'SAGPARKEN Pizzeria',
    },
    {
      name: 'heroDescription',
      title: 'Beskrivelse (forside)',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue:
        'Velkommen til S.A.G. – hvor håndverk møter autentisk smak. Opplev vår unike kombinasjon av pizzeria, syatelier, bakeri og gaveshop på Harestua.',
    },
    // Hours section
    {
      name: 'hoursTitle',
      title: 'Tittel åpningstider',
      type: 'string',
      group: 'hours',
      initialValue: 'Åpningstider',
    },
    {
      name: 'hoursSubtitle',
      title: 'Undertittel åpningstider',
      type: 'string',
      group: 'hours',
      initialValue: 'Velkommen til oss på Harestua',
    },
    {
      name: 'openingHours',
      title: 'Åpningstider',
      type: 'array',
      group: 'hours',
      of: [{type: 'openingHourEntry'}],
    },
    // Contact section
    {
      name: 'contactTitle',
      title: 'Tittel kontakt',
      type: 'string',
      group: 'contact',
      initialValue: 'Kontakt oss',
    },
    {
      name: 'contactSubtitle',
      title: 'Undertittel kontakt',
      type: 'string',
      group: 'contact',
      initialValue: 'Ta kontakt for bestillinger av bord eller spørsmål',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'instagramHandle',
      title: 'Instagram (brukernavn)',
      type: 'string',
      description: 'F.eks. s.a.g_no uten @',
      group: 'contact',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram (lenke)',
      type: 'url',
      group: 'contact',
    },
    {
      name: 'addressLine1',
      title: 'Adresse linje 1',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'addressLine2',
      title: 'Adresse linje 2',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'mapLink',
      title: 'Google Maps-lenke',
      type: 'url',
      group: 'contact',
    },
  ],
})
