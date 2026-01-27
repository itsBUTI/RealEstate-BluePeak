// Demo agents dataset (CMS-ready placeholder).
// Replace this module with API/CMS calls when integrating a backend.
// Schema:
// { id, name, title, phone, email, bio, image, languages[] }
import { makeAvatarDataUri } from '../utils/generatedImages.js'

export const agents = [
  {
    id: 'agent-ava-carter',
    name: 'Ava Carter',
    title: 'Senior Property Advisor',
    phone: '+1 (212) 555-0142',
    email: 'ava.carter@bluepeakrealty.com',
    bio: 'Ava specializes in luxury apartments and investment-grade properties, guiding clients through valuation, negotiation, and closing with clarity and discretion.',
    image: makeAvatarDataUri('agent-ava-carter', 'Ava Carter'),
    languages: ['English', 'French'],
  },
  {
    id: 'agent-noah-ramirez',
    name: 'Noah Ramirez',
    title: 'Global Buyer Specialist',
    phone: '+1 (212) 555-0187',
    email: 'noah.ramirez@bluepeakrealty.com',
    bio: 'Noah supports international buyers with end-to-end relocation expertise, including market research, viewings, and paperwork coordination.',
    image: makeAvatarDataUri('agent-noah-ramirez', 'Noah Ramirez'),
    languages: ['English', 'Spanish'],
  },
  {
    id: 'agent-lina-hassan',
    name: 'Lina Hassan',
    title: 'Residential Listings Director',
    phone: '+1 (212) 555-0111',
    email: 'lina.hassan@bluepeakrealty.com',
    bio: 'Lina curates high-performing listings with professional marketing and hands-on seller support, focused on premium presentation and strong outcomes.',
    image: makeAvatarDataUri('agent-lina-hassan', 'Lina Hassan'),
    languages: ['English', 'Arabic'],
  },
]
