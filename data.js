/* Site content for GB Realty · Opus One — taken from the project brochure. */
window.SITE = {
  /* Fill these in to switch on the WhatsApp button and form delivery. */
  whatsapp: '',          // e.g. '919876543210' (country code + number, digits only)
  enquiryEmail: '',      // e.g. 'sales@gbrealty.com' — form opens a pre-filled email

  /* Houses, left → right across the tower image. `x` is the beam position (% of image width). */
  houses: [
    { name: 'Vidalia House', type: '3+1 BHK', x: 18, units: [
      { label: 'Typical unit', img: 'plan-vidalia-3', carpet: 2066, covered: 2685, superA: 3544 }] },
    { name: 'Evalia House', type: '3+1 BHK', x: 28, units: [
      { label: 'Typical unit', img: 'plan-evalia-3', carpet: 1765, covered: 2555, superA: 3305, note: 'Shared with Cecilia House & Amelia House' }] },
    { name: 'Cecilia House', type: '3+1 BHK', x: 38, units: [
      { label: 'Typical unit', img: 'plan-evalia-3', carpet: 1765, covered: 2555, superA: 3305, note: 'Shared with Evalia House & Amelia House' }] },
    { name: 'Amelia House', type: '3+1 & 4+1 BHK', x: 50, units: [
      { label: 'Unit 1 · 3+1', img: 'plan-amelia-3', carpet: 1751, covered: 2805, superA: 5323 },
      { label: 'Unit 2 · 4+1', img: 'plan-amelia-4', carpet: 2206, covered: 3266, superA: 4016 }] },
    { name: 'Ezalia House', type: '4+1 BHK', x: 60, units: [
      { label: 'Unit 1', img: 'plan-ezalia-4a', carpet: 2869, covered: 4050, superA: 5007 },
      { label: 'Unit 2', img: 'plan-ezalia-4b', carpet: 2869, covered: 4100, superA: 5058 }] },
    { name: 'Zenelia House', type: '5+1 BHK', x: 69, floorplate: true, units: [
      { label: 'Unit 1', img: 'plan-zenelia-5a', carpet: 3533, covered: 5242, superA: 6041 },
      { label: 'Unit 2', img: 'plan-zenelia-5b', carpet: 3533, covered: 5187, superA: 5985 }] },
    { name: 'Miralia House', type: '5+1 BHK', x: 79, floorplate: true, units: [
      { label: 'Unit 1', img: 'plan-miralia-5a', carpet: 3533, covered: 5243, superA: 6041 },
      { label: 'Unit 2', img: 'plan-miralia-5b', carpet: 3533, covered: 5243, superA: 6041 }] }
  ],

  amenities: [
    { name: 'All-Weather Swimming Pool', line: 'Lengths at any hour, in any season.', tag: 'Water', img: 'pool' },
    { name: 'World-Class Luxury Spa', line: 'Warmth, steam and somewhere to leave the day.', tag: 'Stillness', img: 'spa' },
    { name: 'Well-Equipped Fitness Centre', line: 'Strength and conditioning above the treetops.', tag: 'Movement', img: 'gym' },
    { name: 'Yoga & Meditation Studio', line: 'A quiet hour, held by green.', tag: 'Stillness', img: 'woman-garden' },
    { name: 'Lazy River & Crossing Bridge', line: 'A slow current through the gardens.', tag: 'Water', img: 'lazy-river' },
    { name: 'Piano Bar & Cigar Bar', line: 'Walnut, brass and a late conversation.', tag: 'Together', img: 'piano-bar' },
    { name: 'Amphitheatre & Great Lawns', line: 'Open-air evenings for the whole community.', tag: 'Together', img: 'amphitheatre' },
    { name: 'Artisanal Landscapes', line: 'Native flora, reflective pools and tree courts.', tag: 'Nature', img: 'garden' },
    { name: 'Grand Arrival Lobby', line: 'Double-height timber, marble and light.', tag: 'Arrival', img: 'lobby' },
    { name: 'Signature Aqua Concepts', line: 'Water that mirrors the sky and calms the senses.', tag: 'Water', img: 'pool-woman' }
  ],

  moreAmenities: [
    'Lobby Lounge / Café', 'All-Day Dining', 'Banquet Hall', 'Private Theatre', 'Bowling Alley', 'Gaming Lounge',
    'Cards Room', 'Karaoke Room', 'Kids’ Club & Indoor Play', 'Pet Care Centre', 'Tuition Centre', 'Guest Rooms',
    'Basketball Court', 'Badminton Court Plaza', 'Cricket Practice Pitch', 'Skating Rink', 'Outdoor Gymnasium',
    'Jogging / Walking Trail', 'Reflexology Path', 'Elevated Walkway & Viewing Deck', 'Senior Citizen Zone',
    'Pet Park', 'Retail Plaza', 'EV Charging Stations', 'Butler on Call', '24×7 Ambulance Service',
    '24×7 Laundry Service', 'Home Automation', 'Video Door Phone', 'Swipe-Card Access to Lobby & Lifts'
  ],

  legend: [
    'Club Entry', 'Residence Entry', 'Basement Car Park', 'Tower Entry', 'Lobby', 'Swimming Pool', 'Kid Pool',
    'Spa Pavilion', 'Multi-Court', 'Resting Garden', 'Playground', 'Elderly Park', 'Great Lawn', 'Foot Massage Corner',
    'Terrace Garden', 'Amphitheatre', 'Waterfall', 'Event Lawn', 'Multipurpose Lawn', 'Gathering Plaza', 'Dry Court'
  ],

  specs: [
    ['Lounge, Dining & Family Lounge', 'Italian marble flooring'],
    ['Entrance Foyer', 'Italian marble flooring'],
    ['Bedrooms', 'Laminate wooden & Italian marble flooring'],
    ['Toilets', 'Imported Italian tile flooring'],
    ['Kitchen', 'Italian marble floor & marble counters; modular cabinets with Häfele fittings or eqv.'],
    ['Doors & Frames', 'Teakwood frames, flush doors with teakwood veneer'],
    ['External Joinery', 'High-performance aluminium with toughened glass — Schüco, Hindalco or eqv.'],
    ['False Ceiling & Lighting', 'POP with cove (Saint-Gobain, USG Boral or eqv.); COB downlighters — Philips, Havells'],
    ['CP Fittings & Chinaware', 'Hansgrohe / TOTO; Duravit / Villeroy & Boch or eqv.'],
    ['Air Conditioning', 'Mitsubishi, Daikin or eqv.'],
    ['White Goods', 'Bosch, Siemens, Häfele or eqv.'],
    ['Lifts', 'Mitsubishi, Kone, Otis or eqv.'],
    ['Locks & Switches', 'Video door locks — Yale, Dorma, Godrej; Norisys, Schneider, Legrand'],
    ['Home Automation', 'Schneider, Lutron, Panasonic or eqv.'],
    ['Wardrobes & Balconies', 'Modular wardrobes as per design; glass railings, anti-skid tiles'],
    ['Finishes', 'Gypsum plaster; premium emulsion — Asian, Dulux']
  ]
};
