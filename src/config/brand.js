import { images } from '../images/index.js'

export const brand = {
  name: 'BluePeak Realty',
  tagline: 'International Realty',
  logoUrl: images.logo,
  images: {
    homeHero: images.bco[0],
    propertiesHero: images.bco[1],
    aboutBanner: images.bco[2],
    contactBanner: images.bco[3],
    propertyFallback: images.download,
  },
}
