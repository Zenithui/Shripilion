// SHRIMPLION — Deep-Sea Reverse Trivia Prompt & Rarity Database
// 28 meticulously curated prompts across 4 expedition packs (~2,600+ canonical answers + aliases)
// Pipe syntax: "Canonical Name|Alias 1|Alias 2"

window.SHRIMPLION_PACKS = {
  mixed: {
    id: 'mixed',
    name: 'Open Ocean',
    subtitle: 'All categories mixed',
    icon: '🌊'
  },
  world: {
    id: 'world',
    name: "Cartographer's Trench",
    subtitle: 'Countries, capitals, states & seas',
    icon: '🧭'
  },
  science: {
    id: 'science',
    name: 'Hadal Lab',
    subtitle: 'Elements, space, nature & dinos',
    icon: '🔬'
  },
  culture: {
    id: 'culture',
    name: 'Sunken Archive',
    subtitle: 'History, myth, music, games & code',
    icon: '🏛️'
  },
  everyday: {
    id: 'everyday',
    name: 'Submarine Galley',
    subtitle: 'Food, breeds, sports & currencies',
    icon: '🧀'
  }
};

window.SHRIMPLION_TIERS = {
  0: {
    id: 0,
    name: 'Surfaced',
    points: 0,
    meters: 0,
    emoji: '⚪',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.18)',
    tagline: 'Out of oxygen — zero depth gained.',
    quips: [
      'beep... oxygen tank ran dry! Staying at current depth.',
      'No signal locked! Floating steady where we are.'
    ]
  },
  1: {
    id: 1,
    name: 'Plankton',
    points: 10,
    meters: 100,
    emoji: '🟢',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.18)',
    tagline: 'The obvious first choice everyone thinks of.',
    quips: [
      'Surface plankton! Everyone on Earth typed that first.',
      'Valid, sure — if you enjoy sunbathing near the boat!'
    ]
  },
  2: {
    id: 2,
    name: 'Too Clever',
    points: 15,
    meters: 150,
    emoji: '🩵',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.18)',
    tagline: 'The "clever" dodge thousands of others also guessed!',
    quips: [
      'Too clever! Thousands of trivia nerds had that exact same "unique" idea.',
      'Classic crowd bottleneck — you dodged #1 right into #2!'
    ]
  },
  3: {
    id: 3,
    name: 'Schooler',
    points: 30,
    meters: 300,
    emoji: '🔵',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.2)',
    tagline: 'Swimming safely with a respectable school.',
    quips: [
      'Solid Schooler! Sinking cleanly into darker water.',
      'Not bad, diver — leaving the surface splashes behind!'
    ]
  },
  4: {
    id: 4,
    name: 'Rare',
    points: 60,
    meters: 600,
    emoji: '🟣',
    color: '#c084fc',
    bg: 'rgba(192,132,252,0.22)',
    tagline: 'Now you’re thinking. Dodged the crowd!',
    quips: [
      'Now we’re diving! Big 600-meter drop past the crowd!',
      'beep! Rare signal locked — watch the pressure gauge!'
    ]
  },
  5: {
    id: 5,
    name: 'Deep Cut',
    points: 85,
    meters: 850,
    emoji: '🟠',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.22)',
    tagline: 'Genuinely obscure specialist knowledge!',
    quips: [
      'WHOA! Deep Cut!! Hull bolts rattling — 850m plunge!',
      'Serious abyssal recall! Almost nobody pulls that one!'
    ]
  },
  6: {
    id: 6,
    name: 'One in a Shrimplion',
    points: 100,
    meters: 1000,
    emoji: '💎',
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.26)',
    tagline: 'ULTIMATE ABYSSAL TREASURE (<1% RARITY)!',
    quips: [
      'BEEP BEEP!! ONE IN A SHRIMPLION!! FULL KILOMETER PLUNGE!!',
      'LEGENDARY TRENCH PEARL!! Straight toward the 7,000m floor!!'
    ]
  }
};

window.SHRIMPLION_ZONES = [
  { min: 0, max: 700, name: 'Sunlight Zone', sci: 'Epipelagic', badge: '☀️', desc: 'Bright coastal waters teeming with plankton.' },
  { min: 700, max: 1800, name: 'Twilight Zone', sci: 'Mesopelagic', badge: '🪼', desc: 'Fading sunbeams where lanternfish flicker.' },
  { min: 1800, max: 3500, name: 'Midnight Zone', sci: 'Bathypelagic', badge: '🦑', desc: 'Pitch-black water lit only by bioluminescence.' },
  { min: 3500, max: 5500, name: 'The Abyss', sci: 'Abyssopelagic', badge: '🐡', desc: 'Crushing pressure above hydrothermal vents.' },
  { min: 5500, max: 7001, name: 'Hadal Trench', sci: 'Hadalpelagic', badge: '👑', desc: 'The deepest ocean floor — realm of legends.' }
];

window.SHRIMPLION_PROMPTS = [
  // =========================================================================
  // PACK 1: WORLD (Cartographer's Trench)
  // =========================================================================
  {
    id: 'us-states',
    pack: 'world',
    prompt: 'Name a U.S. State',
    hint: 'Any of the 50 states (D.C. & territories do not count!)',
    tiers: {
      1: ['California', 'Texas', 'New York', 'Florida', 'Hawaii', 'Alaska'],
      2: ['Washington', 'Illinois', 'Colorado', 'Ohio', 'Georgia', 'Nevada', 'Massachusetts', 'Pennsylvania', 'Arizona', 'Michigan'],
      3: ['Oregon', 'Virginia', 'North Carolina', 'Tennessee', 'New Jersey', 'Louisiana', 'Utah', 'Minnesota', 'Wisconsin', 'Alabama', 'Kentucky'],
      4: ['Maryland', 'Indiana', 'Missouri', 'South Carolina', 'Connecticut', 'Maine', 'Montana', 'New Mexico', 'Oklahoma', 'Kansas'],
      5: ['Iowa', 'Arkansas', 'Mississippi', 'Idaho', 'West Virginia', 'New Hampshire', 'Nebraska', 'Vermont'],
      6: ['Delaware', 'Rhode Island', 'Wyoming', 'North Dakota', 'South Dakota']
    }
  },
  {
    id: 'european-countries',
    pack: 'world',
    prompt: 'Name a country in Europe',
    hint: 'Sovereign European nations, including microstates & transcontinental states',
    tiers: {
      1: ['France', 'Italy', 'Spain', 'Germany', 'United Kingdom|UK|Great Britain|Britain', 'Greece'],
      2: ['Ireland|Republic of Ireland', 'Portugal', 'Switzerland', 'Netherlands|Holland', 'Sweden', 'Norway', 'Poland', 'Russia', 'Ukraine'],
      3: ['Austria', 'Belgium', 'Denmark', 'Finland', 'Iceland', 'Czechia|Czech Republic', 'Hungary', 'Croatia', 'Turkey|Turkiye', 'Romania'],
      4: ['Serbia', 'Bulgaria', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus'],
      5: ['Albania', 'Bosnia and Herzegovina|Bosnia', 'Montenegro', 'North Macedonia|Macedonia', 'Belarus', 'Moldova', 'Monaco', 'Vatican City|Vatican|Holy See', 'Georgia', 'Armenia'],
      6: ['Andorra', 'Liechtenstein', 'San Marino', 'Kosovo', 'Azerbaijan']
    }
  },
  {
    id: 'african-countries',
    pack: 'world',
    prompt: 'Name a country in Africa',
    hint: 'Any of the 54 African nations',
    tiers: {
      1: ['Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Madagascar'],
      2: ['Ethiopia', 'Ghana', 'Tanzania', 'Algeria', 'Tunisia', 'Uganda', 'Zimbabwe', 'Somalia', 'Rwanda'],
      3: ['Senegal', 'Cameroon', 'Ivory Coast|Cote d Ivoire', 'Democratic Republic of the Congo|DR Congo|DRC', 'Sudan', 'Libya', 'Botswana', 'Namibia', 'Zambia', 'Angola', 'Mali'],
      4: ['Mozambique', 'Malawi', 'Niger', 'Chad', 'Burkina Faso', 'Sierra Leone', 'Liberia', 'Mauritius', 'Seychelles', 'South Sudan'],
      5: ['Togo', 'Benin', 'Guinea', 'Gabon', 'Republic of the Congo|Congo Republic|Congo-Brazzaville|Congo', 'Mauritania', 'Eritrea', 'Djibouti', 'Gambia|The Gambia', 'Burundi', 'Lesotho'],
      6: ['Eswatini|Swaziland', 'Cabo Verde|Cape Verde', 'Comoros', 'Sao Tome and Principe|Sao Tome', 'Equatorial Guinea', 'Guinea-Bissau', 'Central African Republic|CAR']
    }
  },
  {
    id: 'asian-countries',
    pack: 'world',
    prompt: 'Name a country in Asia',
    hint: 'East, South, Southeast, Central, or West Asia',
    tiers: {
      1: ['Japan', 'China', 'India', 'South Korea|Korea', 'Thailand', 'Vietnam'],
      2: ['Philippines', 'Indonesia', 'Singapore', 'Malaysia', 'Saudi Arabia', 'Israel', 'Iran', 'Pakistan', 'United Arab Emirates|UAE'],
      3: ['Taiwan', 'North Korea', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Cambodia', 'Myanmar|Burma', 'Iraq', 'Qatar', 'Jordan', 'Turkey|Turkiye'],
      4: ['Mongolia', 'Laos', 'Afghanistan', 'Lebanon', 'Syria', 'Kuwait', 'Oman', 'Yemen', 'Kazakhstan', 'Uzbekistan', 'Maldives'],
      5: ['Bhutan', 'Brunei', 'Bahrain', 'Palestine', 'Georgia', 'Armenia', 'Azerbaijan', 'Cyprus'],
      6: ['Timor-Leste|East Timor', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan']
    }
  },
  {
    id: 'americas-countries',
    pack: 'world',
    prompt: 'Name a country in the Americas or Caribbean',
    hint: 'North, Central, South America, or Caribbean island nations',
    tiers: {
      1: ['United States|USA|US|United States of America|America', 'Canada', 'Mexico', 'Brazil', 'Argentina'],
      2: ['Colombia', 'Peru', 'Chile', 'Cuba', 'Jamaica', 'Costa Rica', 'Venezuela'],
      3: ['Panama', 'Ecuador', 'Bolivia', 'Uruguay', 'Dominican Republic', 'Haiti', 'Bahamas|The Bahamas', 'Guatemala', 'Honduras'],
      4: ['Paraguay', 'El Salvador', 'Nicaragua', 'Trinidad and Tobago|Trinidad', 'Barbados', 'Belize'],
      5: ['Guyana', 'Suriname', 'Grenada', 'Saint Lucia|St Lucia', 'Antigua and Barbuda|Antigua'],
      6: ['Dominica', 'Saint Kitts and Nevis|St Kitts and Nevis|St Kitts', 'Saint Vincent and the Grenadines|St Vincent and the Grenadines|St Vincent']
    }
  },
  {
    id: 'world-capitals',
    pack: 'world',
    prompt: 'Name a national capital city',
    hint: 'Sovereign country capitals around the globe',
    tiers: {
      1: ['Paris', 'London', 'Tokyo', 'Rome', 'Washington D.C.|Washington DC|Washington', 'Beijing', 'Berlin', 'Madrid', 'Moscow', 'Cairo'],
      2: ['Ottawa', 'Mexico City', 'Seoul', 'Athens', 'Dublin', 'Amsterdam', 'Bangkok', 'New Delhi|Delhi', 'Canberra', 'Lisbon', 'Vienna', 'Brussels', 'Stockholm', 'Oslo', 'Havana', 'Buenos Aires'],
      3: ['Warsaw', 'Prague', 'Budapest', 'Copenhagen', 'Helsinki', 'Reykjavik', 'Bern', 'Brasilia', 'Lima', 'Santiago', 'Bogota', 'Nairobi', 'Jakarta', 'Manila', 'Hanoi', 'Singapore', 'Taipei', 'Jerusalem', 'Riyadh', 'Ankara', 'Kyiv|Kiev', 'Wellington'],
      4: ['Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Bratislava', 'Ljubljana', 'Tallinn', 'Riga', 'Vilnius', 'Kuala Lumpur', 'Kathmandu', 'Dhaka', 'Islamabad', 'Tehran', 'Baghdad', 'Doha', 'Abu Dhabi', 'Amman', 'Beirut', 'Addis Ababa', 'Accra', 'Abuja', 'Pretoria', 'Cape Town', 'Rabat', 'Algiers', 'Tunis', 'Caracas', 'Quito', 'Montevideo', 'Panama City', 'San Jose', 'Kingston'],
      5: ['Tirana', 'Sarajevo', 'Skopje', 'Podgorica', 'Chisinau', 'Minsk', 'Tbilisi', 'Yerevan', 'Baku', 'Nicosia', 'Valletta', 'Phnom Penh', 'Vientiane', 'Naypyidaw', 'Ulaanbaatar', 'Kabul', 'Muscat', 'Kuwait City', 'Manama', 'Damascus', 'Sanaa', 'Astana|Nur-Sultan', 'Tashkent', 'Colombo', 'Male', 'Dakar', 'Kampala', 'Kigali', 'Harare', 'Lusaka', 'Luanda', 'Maputo', 'Antananarivo', 'Windhoek', 'Gaborone', 'La Paz', 'Sucre', 'Asuncion', 'Georgetown', 'San Salvador', 'Tegucigalpa', 'Managua', 'Guatemala City', 'Port-au-Prince', 'Santo Domingo', 'Nassau', 'Bridgetown', 'Port of Spain', 'Suva'],
      6: ['Ngerulmud', 'Sri Jayawardenepura Kotte|Kotte', 'Yamoussoukro', 'Bandar Seri Begawan', 'Thimphu', 'Dili', 'Ashgabat', 'Dushanbe', 'Bishkek', 'Vaduz', 'San Marino', 'Andorra la Vella', 'Monaco', 'Dodoma', 'Gitega', 'Juba', 'Asmara', 'Djibouti', 'Nouakchott', 'Bamako', 'Niamey', 'Ouagadougou', 'N Djamena|Ndjamena', 'Bangui', 'Libreville', 'Brazzaville', 'Kinshasa', 'Yaounde', 'Malabo', 'Sao Tome', 'Praia', 'Banjul', 'Bissau', 'Conakry', 'Freetown', 'Monrovia', 'Lome', 'Porto-Novo', 'Lilongwe', 'Mbabane', 'Lobamba', 'Maseru', 'Moroni', 'Victoria', 'Port Louis', 'Paramaribo', 'Belmopan', 'Basseterre', 'Castries', 'Kingstown', 'Roseau', 'Saint Georges|St Georges', 'Saint Johns|St Johns', 'Funafuti', 'Tarawa|South Tarawa', 'Majuro', 'Palikir', 'Yaren', 'Apia', 'Nukualofa', 'Port Vila', 'Honiara', 'Port Moresby']
    }
  },
  {
    id: 'oceans-seas-gulfs',
    pack: 'world',
    prompt: 'Name an ocean, sea, bay, or gulf',
    hint: 'Major or minor marine bodies of water around the world',
    tiers: {
      1: ['Pacific Ocean|Pacific', 'Atlantic Ocean|Atlantic', 'Indian Ocean|Indian', 'Arctic Ocean|Arctic', 'Mediterranean Sea|Mediterranean', 'Caribbean Sea|Caribbean'],
      2: ['Southern Ocean|Antarctic Ocean', 'Red Sea', 'Dead Sea', 'Black Sea', 'Gulf of Mexico', 'North Sea', 'Baltic Sea', 'South China Sea', 'Bering Sea'],
      3: ['Coral Sea', 'Persian Gulf', 'Aegean Sea', 'Adriatic Sea', 'Caspian Sea', 'Arabian Sea', 'Tasman Sea', 'Sea of Japan|East Sea', 'Hudson Bay', 'Bay of Bengal'],
      4: ['Yellow Sea', 'East China Sea', 'Java Sea', 'Andaman Sea', 'Barents Sea', 'Irish Sea', 'Norwegian Sea', 'Greenland Sea', 'Bay of Biscay', 'Gulf of Alaska', 'Chesapeake Bay', 'San Francisco Bay'],
      5: ['Sargasso Sea', 'Weddell Sea', 'Ross Sea', 'Sea of Okhotsk', 'Aral Sea', 'Ionian Sea', 'Tyrrhenian Sea', 'Sea of Marmara', 'Sea of Azov', 'Celtic Sea', 'Beaufort Sea', 'Gulf of Aden', 'Gulf of Oman', 'Gulf of Guinea', 'Gulf of Thailand', 'Baffin Bay'],
      6: ['Chukchi Sea', 'Laptev Sea', 'Kara Sea', 'White Sea', 'East Siberian Sea', 'Celebes Sea|Sulawesi Sea', 'Sulu Sea', 'Banda Sea', 'Arafura Sea', 'Timor Sea', 'Flores Sea', 'Molucca Sea', 'Ceram Sea', 'Halmahera Sea', 'Savu Sea', 'Solomon Sea', 'Bismarck Sea', 'Philippine Sea', 'Scotia Sea', 'Bellingshausen Sea', 'Amundsen Sea', 'Lincoln Sea', 'Wandel Sea', 'Pechora Sea', 'Ligurian Sea', 'Alboran Sea', 'Balearic Sea', 'Sea of Crete', 'Myrtoan Sea', 'Thracian Sea', 'Levantine Sea', 'Salton Sea', 'Sea of Cortez|Gulf of California', 'Gulf of Aqaba', 'Gulf of Suez', 'Gulf of Bothnia', 'Gulf of Finland', 'Gulf of Riga', 'Gulf of Tonkin', 'Gulf of Carpentaria', 'Great Australian Bight']
    }
  },

  // =========================================================================
  // PACK 2: SCIENCE (Hadal Lab)
  // =========================================================================
  {
    id: 'periodic-elements',
    pack: 'science',
    prompt: 'Name an element on the Periodic Table',
    hint: 'Any of the 118 confirmed chemical elements',
    tiers: {
      1: ['Oxygen', 'Hydrogen', 'Gold', 'Silver', 'Carbon', 'Iron', 'Helium', 'Nitrogen', 'Copper', 'Sodium'],
      2: ['Aluminum|Aluminium', 'Calcium', 'Chlorine', 'Neon', 'Lead', 'Zinc', 'Mercury', 'Uranium', 'Platinum', 'Potassium', 'Tin', 'Nickel', 'Silicon', 'Lithium', 'Magnesium', 'Sulfur|Sulphur'],
      3: ['Argon', 'Titanium', 'Cobalt', 'Phosphorus', 'Fluorine', 'Bromine', 'Iodine', 'Arsenic', 'Krypton', 'Xenon', 'Radon', 'Plutonium', 'Tungsten|Wolfram', 'Chromium', 'Manganese', 'Barium', 'Boron', 'Beryllium'],
      4: ['Bismuth', 'Cesium|Caesium', 'Francium', 'Gallium', 'Germanium', 'Selenium', 'Strontium', 'Zirconium', 'Palladium', 'Cadmium', 'Antimony', 'Tellurium', 'Radium', 'Thorium', 'Vanadium', 'Molybdenum', 'Rhodium', 'Indium', 'Iridium', 'Osmium'],
      5: ['Rubidium', 'Yttrium', 'Niobium', 'Technetium', 'Ruthenium', 'Hafnium', 'Tantalum', 'Rhenium', 'Thallium', 'Polonium', 'Astatine', 'Actinium', 'Protactinium', 'Neptunium', 'Americium', 'Curium', 'Californium', 'Einsteinium', 'Lanthanum', 'Cerium', 'Neodymium', 'Europium', 'Gadolinium', 'Scandium'],
      6: ['Praseodymium', 'Promethium', 'Samarium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Berkelium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson']
    }
  },
  {
    id: 'solar-system-worlds',
    pack: 'science',
    prompt: 'Name a planet, dwarf planet, or moon in our Solar System',
    hint: 'From Mercury and the Moon out to Kuiper Belt dwarf planets & outer moons',
    tiers: {
      1: ['Earth', 'Mars', 'Jupiter', 'Saturn', 'Venus', 'Mercury', 'Neptune', 'Uranus', 'Pluto', 'The Moon|Moon|Luna'],
      2: ['Titan', 'Europa', 'Io', 'Ganymede', 'Callisto', 'Ceres', 'Enceladus', 'Phobos', 'Deimos'],
      3: ['Triton', 'Charon', 'Eris', 'Makemake', 'Haumea', 'Mimas', 'Rhea', 'Iapetus', 'Dione', 'Tethys'],
      4: ['Miranda', 'Oberon', 'Titania', 'Umbriel', 'Ariel', 'Hyperion', 'Phoebe', 'Sedna', 'Quaoar', 'Orcus', 'Amalthea'],
      5: ['Nereid', 'Proteus', 'Larissa', 'Galatea', 'Despina', 'Puck', 'janus|Janus', 'Epimetheus', 'Pan', 'Daphnis', 'Atlas', 'Prometheus', 'Pandora', 'Himalia', 'Thebe', 'Metis', 'Adrastea', 'Nix', 'Hydra', 'Gonggong', 'Hygeia'],
      6: ['Kerberos', 'Styx', 'Dysnomia', 'Hi iaka|Hiiaka', 'Namaka', 'Vanth', 'Weywot', 'Actaea', 'Salacia', 'Varuna', 'Ixion', 'Cordelia', 'Ophelia', 'Bianca', 'Cressida', 'Desdemona', 'Juliet', 'Portia', 'Rosalind', 'Belinda', 'Perdita', 'Mab', 'Cupid', 'Caliban', 'Sycorax', 'Prospero', 'Setebos', 'Stephano', 'Trinculo', 'Naiad', 'Thalassa', 'Halimede', 'Sao', 'Laomedeia', 'Psamathe', 'Neso', 'Hippocamp', 'Elara', 'Pasiphae', 'Sinope', 'Lysithea', 'Carme', 'Ananke', 'Leda', 'Callirrhoe', 'Themisto', 'Methone', 'Pallene', 'Telesto', 'Calypso', 'Helene', 'Polydeuces', 'Siarnaq', 'Albiorix', 'Ymir']
    }
  },
  {
    id: 'constellations',
    pack: 'science',
    prompt: 'Name an official constellation',
    hint: 'Any of the 88 official IAU constellations',
    tiers: {
      1: ['Orion', 'Ursa Major|Big Dipper|Great Bear', 'Ursa Minor|Little Dipper|Little Bear', 'Leo', 'Scorpius|Scorpio', 'Taurus', 'Gemini', 'Cassiopeia'],
      2: ['Aries', 'Cancer', 'Virgo', 'Libra', 'Sagittarius', 'Capricornus|Capricorn', 'Aquarius', 'Pisces', 'Andromeda', 'Pegasus', 'Cygnus', 'Lyra'],
      3: ['Centaurus', 'Crux|Southern Cross', 'Canis Major', 'Canis Minor', 'Perseus', 'Draco', 'Hercules', 'Aquila', 'Hydra', 'Ophiuchus'],
      4: ['Auriga', 'Bootes', 'Carina', 'Cetus', 'Eridanus', 'vela|Vela', 'Puppis', 'Cepheus', 'Corona Borealis', 'Corvus', 'Delphinus', 'Lepus', 'Monoceros', 'Phoenix', 'Sagitta', 'Triangulum'],
      5: ['Ara', 'Canes Venatici', 'Columba', 'Coma Berenices', 'Crater', 'Dorado', 'Grus', 'Indus', 'Leo Minor', 'Lupus', 'Lynx', 'Pavo', 'Piscis Austrinus', 'Serpens', 'Sextans', 'Tucana', 'Vulpecula', 'Lacerta', 'Scutum'],
      6: ['Antlia', 'Apus', 'Caelum', 'Camelopardalis', 'Chamaeleon', 'Circinus', 'Corona Australis', 'Equuleus', 'Fornax', 'Horologium', 'Hydrus', 'Mensa', 'Microscopium', 'Musca', 'Norma', 'Octans', 'Pictor', 'Pyxis', 'Reticulum', 'Sculptor', 'Telescopium', 'Triangulum Australe', 'Volans']
    }
  },
  {
    id: 'dinosaurs',
    pack: 'science',
    prompt: 'Name a dinosaur',
    hint: 'True non-avian dinosaur genera (sorry Pterodactyl & Plesiosaur!)',
    tiers: {
      1: ['Tyrannosaurus Rex|T-Rex|T Rex|Tyrannosaurus', 'Triceratops', 'Velociraptor', 'Stegosaurus', 'Brachiosaurus', 'Brontosaurus'],
      2: ['Spinosaurus', 'Ankylosaurus', 'Allosaurus', 'Diplodocus', 'Apatosaurus', 'Iguanodon', 'Pachycephalosaurus', 'Parasaurolophus'],
      3: ['Dilophosaurus', 'Carnotaurus', 'Gallimimus', 'Archaeopteryx', 'Deinonychus', 'Utahraptor', 'Giganotosaurus', 'Compsognathus', 'Oviraptor', 'Baryonyx'],
      4: ['Therizinosaurus', 'Styracosaurus', 'Argentinosaurus', 'Microraptor', 'Corythosaurus', 'Maiasaura', 'Carcharodontosaurus', 'Ceratosaurus', 'Protoceratops', 'Coelophysis', 'Plateosaurus', 'Edmontosaurus'],
      5: ['Deinocheirus', 'Amargasaurus', 'Acrocanthosaurus', 'Suchomimus', 'Majungasaurus', 'Cryolophosaurus', 'Dreadnoughtus', 'Patagotitan', 'Kentrosaurus', 'Pachyrhinosaurus', 'Psittacosaurus', 'Herrerasaurus', 'Eoraptor', 'Albertosaurus', 'Tarbosaurus', 'Troodon'],
      6: ['Yi Qi|Yi', 'Nigersaurus', 'Kosmoceratops', 'Qianzhousaurus', 'Yutyrannus', 'Concavenator', 'Irritator', 'Mononykus', 'Sinosauropteryx', 'Anchiornis', 'Citipati', 'Lambeosaurus', 'Ouranosaurus', 'Muttaburrasaurus', 'Leaellynasaura', 'Minmi', 'Miragaia', 'Saltasaurus', 'Sauroposeidon', 'Mamenchisaurus', 'Shunosaurus', 'abrictosaurus|Abrictosaurus', 'Heterodontosaurus', 'Scelidosaurus', 'Polacanthus', 'Nodosaurus', 'Borealopelta', 'Zuul', 'nanuqsaurus|Nanuqsaurus', 'Australovenator', 'Megaraptor', 'Maip', 'Torvosaurus', 'Megalosaurus', 'Halszkaraptor', 'Balaur']
    }
  },
  {
    id: 'bird-species',
    pack: 'science',
    prompt: 'Name a type of bird',
    hint: 'Common bird families or specific wild/domesticated bird species',
    tiers: {
      1: ['Eagle|Bald Eagle', 'Pigeon|Dove', 'Penguin', 'Owl', 'Robin', 'Crow|Raven', 'Chicken', 'Duck', 'Parrot', 'Sparrow'],
      2: ['Flamingo', 'Peacock|Peafowl', 'Swan', 'Hummingbird', 'Seagull|Gull', 'Hawk', 'Falcon|Peregrine Falcon', 'Ostrich', 'Turkey', 'Goose', 'Blue Jay', 'Cardinal', 'Woodpecker', 'Pelican', 'Toucan'],
      3: ['Albatross', 'Puffin', 'Emu', 'Kiwi', 'Heron', 'Stork', 'Crane', 'Vulture|Condor', 'Canary', 'Finch', 'Magpie', 'Starling', 'Swallow', 'Kingfisher', 'Kookaburra', 'Cockatoo', 'Macaw', 'Pheasant', 'Quail'],
      4: ['Cassowary', 'Cormorant', 'Osprey', 'Kestrel', 'Kite', 'Mockingbird', 'Oriole', 'Wren', 'Chickadee', 'Nightingale', 'Lark', 'Thrush', 'Blackbird', 'Cuckoo', 'Roadrunner', 'Sandpiper', 'Plover', 'Loon', 'Grebe', 'Ibis', 'Egret', 'Spoonbill', 'Parakeet|Budgie|Budgerigar'],
      5: ['Shoebill', 'Kakapo', 'Secretarybird|Secretary Bird', 'Quetzal|Resplendent Quetzal', 'Lyrebird', 'Bowerbird', 'Booby|Blue-Footed Booby', 'Frigatebird', 'Gannet', 'Petrel', 'Shearwater', 'Tern', 'Curlew', 'Avocet', 'Oystercatcher', 'Bittern', 'Moorhen', 'Coot', 'Grouse', 'Partridge', 'Ptarmigan', 'Hornbill', 'Hoopoe', 'Bee-Eater', 'Roller', 'Swift', 'Nightjar', 'Whip-poor-will', 'Nuthatch', 'Creeper', 'Waxwing', 'Shrike', 'Tanager', 'Bunting', 'Grackle', 'Cowbird', 'Jackdaw', 'Rook'],
      6: ['Hoatzin', 'Potoo', 'Tawny Frogmouth|Frogmouth', 'Oilbird', 'Lammergeier|Bearded Vulture', 'Kea', 'Takahe', 'Huia', 'Rhea', 'Tinamou', 'Megapode|Malleefowl', 'Capercaillie', 'Bustard|Kori Bustard', 'Seriema', 'Sunbittern', 'Kagu', 'Jacana', 'Skimmer', 'Murrelet', 'Auklet', 'Guillemot', 'Sandgrouse', 'Turaco', 'Coucal', 'Ani', 'Trogon', 'Motmot', 'Tody', 'Jacamar', 'Puffbird', 'Barbet', 'Honeyguide', 'Caracara', 'Pitta', 'Broadbill', 'Cotinga|Cock-of-the-Rock', 'Manakin', 'Antbird', 'Ovenbird|Hornero', 'dipper|Dipper', 'Wallcreeper', 'Picathartes|Rockfowl', 'Vanga', 'Drongo', 'Fantail', 'Riflebird', 'Bird-of-Paradise']
    }
  },
  {
    id: 'gemstones-minerals',
    pack: 'science',
    prompt: 'Name a gemstone or crystal mineral',
    hint: 'Precious stones, semi-precious gems, or collectible crystals',
    tiers: {
      1: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Quartz|Rose Quartz', 'Amethyst', 'Pearl'],
      2: ['Opal', 'Jade', 'Topaz', 'Garnet', 'Turquoise', 'Onyx', 'Amber', 'Obsidian'],
      3: ['Aquamarine', 'Peridot', 'Citrine', 'Moonstone', 'Lapis Lazuli|Lapis', 'Malachite', 'Agate', 'Jasper', 'Pyrite|Fools Gold', 'Tourmaline'],
      4: ['Tanzanite', 'Alexandrite', 'Morganite', 'Zircon', 'Spinel', 'Labradorite', 'Tiger Eye|Tigers Eye', 'Bloodstone', 'Carnelian', 'Chalcedony', 'Fluorite', 'Selenite', 'Calcite', 'Hematite', 'Sunstone', 'Amazonite', 'Aventurine', 'Beryl'],
      5: ['Kunzite', 'Chrysoberyl', 'Moldavite', 'Larimar', 'Rhodochrosite', 'Rhodonite', 'Charoite', 'Sodalite', 'Azurite', 'Chrysocolla', 'Kyanite', 'Iolite', 'Andalusite', 'Apatite', 'Sphene|Titanite', 'Epidote', 'Zoisite', 'Tsavorite', 'Demantoid', 'Spessartine', 'celestite|Celestite|Celestine'],
      6: ['Painite', 'Benitoite', 'Bixbite|Red Beryl', 'Taaffeite', 'Musgravite', 'Grandidierite', 'Jeremejevite', 'Serendibite', 'Poudretteite', 'Hibonite', 'Paraiba Tourmaline', 'Padparadscha', 'Sphalerite', 'Kornerupine', 'Scapolite', 'Danburite', 'Phenakite', 'Euclase', 'Petalite', 'hiddenite|Hiddenite', 'Hackmanite', 'Tugtupite', 'Sugilite', 'Pietersite', 'Shattuckite', 'Dioptase', 'Crocoite', 'Wulfenite', 'Vanadinite', 'Cavansite', 'Baryte|Barite', 'Scheelite', 'Cassiterite', 'Hauyne', 'Lazurite', 'Staurolite']
    }
  },
  {
    id: 'trees',
    pack: 'science',
    prompt: 'Name a type of tree',
    hint: 'Deciduous, evergreen, fruit, or tropical trees',
    tiers: {
      1: ['Oak', 'Pine', 'Maple', 'Palm', 'Birch', 'Apple|Apple Tree', 'Cherry|Cherry Blossom', 'Willow|Weeping Willow'],
      2: ['Redwood', 'Sequoia|Giant Sequoia', 'Cedar', 'Spruce', 'Fir|Douglas Fir', 'Elm', 'Walnut', 'Eucalyptus', 'Magnolia', 'Cypress'],
      3: ['Ash', 'Beech', 'Sycamore', 'Poplar', 'Aspen', 'Chestnut', 'Hickory', 'Pecan', 'Mahogany', 'Teak', 'Baobab', 'Banyan', 'Olive', 'Lemon', 'Orange', 'Peach', 'Pear'],
      4: ['Ginkgo|Gingko|Ginkgo Biloba', 'Jacaranda', 'Acacia', 'Ebony', 'Alder', 'Larch', 'Hemlock', 'Juniper', 'Yew', 'Dogwood', 'Hawthorn', 'Linden|Basswood|Lime Tree', 'Hazel|Hazelnut', 'Fig', 'Avocado', 'Mango', 'Coconut', 'Bonsai', 'Cottonwood', 'Mulberry', 'Persimmon'],
      5: ['Monkey Puzzle', 'Bristlecone Pine', 'Kapok', 'Mangrove', 'Tamarind', 'Neem', 'Moringa', 'Catalpa', 'Sassafras', 'Hornbeam', 'Rowan|Mountain Ash', 'Tupelo|Black Gum', 'Sweetgum', 'Buckeye|Horse Chestnut', 'Locust|Black Locust|Honey Locust', 'Mimosa|Silk Tree', 'Balsa', 'Rosewood', 'Sandalwood', 'Cork Oak', 'Joshua Tree', 'Plumeria|Frangipani', 'Cacao', 'Cinnamon', 'Rubber Tree'],
      6: ['Dragon Blood Tree|Socotra Dragon Tree', 'Wollemi Pine', 'Lignum Vitae', 'Pau Brasil|Pernambuco|Brazilwood', 'Quiver Tree', 'Pohutukawa', 'Kauri', 'Totara', 'Rimu', 'Jarrah', 'Karri', 'Huon Pine', 'Marula', 'Mopane', 'Fever Tree', 'Sausage Tree|Kigelia', 'Travellers Tree|Travellers Palm', 'Cannonball Tree', 'Rainbow Eucalyptus', 'Sandbox Tree|Dynamite Tree', 'Manchineel', 'Paulownia|Empress Tree', 'Osage Orange|Bois d Arc', 'Kentucky Coffeetree', 'Katsura', 'Dawn Redwood|Metasequoia', 'Tamarack', 'Medlar', 'Serviceberry|Amelanchier', 'Laburnum', 'Franklinia', 'Stewartia', 'Zelkova', 'Hackberry', 'plane tree|London Plane', 'Araucaria', 'Podocarpus']
    }
  },

  // =========================================================================
  // PACK 3: CULTURE (Sunken Archive)
  // =========================================================================
  {
    id: 'shakespeare-plays',
    pack: 'culture',
    prompt: 'Name a play written by William Shakespeare',
    hint: 'Any of Shakespeare’s 38 tragedies, comedies, histories, or romances',
    tiers: {
      1: ['Romeo and Juliet', 'Hamlet', 'Macbeth', 'Othello', 'A Midsummer Nights Dream|Midsummer Nights Dream', 'Julius Caesar'],
      2: ['King Lear', 'The Tempest|Tempest', 'The Merchant of Venice|Merchant of Venice', 'Much Ado About Nothing', 'Twelfth Night', 'The Taming of the Shrew|Taming of the Shrew'],
      3: ['Richard III', 'Henry V', 'As You Like It', 'Antony and Cleopatra', 'The Comedy of Errors|Comedy of Errors', 'Titus Andronicus'],
      4: ['Measure for Measure', 'The Winters Tale|Winters Tale', 'Coriolanus', 'Alls Well That Ends Well', 'Loves Labours Lost', 'The Merry Wives of Windsor|Merry Wives of Windsor', 'Richard II', 'Henry IV Part 1|Henry IV'],
      5: ['Cymbeline', 'Troilus and Cressida', 'The Two Gentlemen of Verona|Two Gentlemen of Verona', 'King John', 'Henry VIII', 'Henry IV Part 2', 'Henry VI Part 1|Henry VI'],
      6: ['Timon of Athens', 'Pericles|Pericles Prince of Tyre', 'The Two Noble Kinsmen|Two Noble Kinsmen', 'Henry VI Part 2', 'Henry VI Part 3']
    }
  },
  {
    id: 'us-presidents',
    pack: 'culture',
    prompt: 'Name a U.S. President',
    hint: 'Any of the 45 individuals who served as President of the United States',
    tiers: {
      1: ['George Washington|Washington', 'Abraham Lincoln|Lincoln', 'Barack Obama|Obama', 'Donald Trump|Trump', 'Joe Biden|Biden', 'John F. Kennedy|JFK|Kennedy', 'Thomas Jefferson|Jefferson'],
      2: ['Franklin D. Roosevelt|FDR', 'Theodore Roosevelt|Teddy Roosevelt|Roosevelt', 'Ronald Reagan|Reagan', 'Bill Clinton|Clinton', 'George W. Bush|Bush', 'Richard Nixon|Nixon', 'Jimmy Carter|Carter'],
      3: ['John Adams|Adams', 'Andrew Jackson|Jackson', 'Ulysses S. Grant|Grant', 'Woodrow Wilson|Wilson', 'Dwight D. Eisenhower|Eisenhower', 'Harry S. Truman|Truman', 'Lyndon B. Johnson|LBJ', 'George H. W. Bush|George HW Bush', 'Gerald Ford|Ford'],
      4: ['James Madison|Madison', 'James Monroe|Monroe', 'John Quincy Adams', 'Andrew Johnson|Johnson', 'Herbert Hoover|Hoover', 'Calvin Coolidge|Coolidge', 'William Howard Taft|Taft', 'William McKinley|McKinley', 'Grover Cleveland|Cleveland', 'James K. Polk|Polk'],
      5: ['Martin Van Buren|Van Buren', 'William Henry Harrison', 'John Tyler|Tyler', 'Zachary Taylor|Taylor', 'James Buchanan|Buchanan', 'Rutherford B. Hayes|Hayes', 'James A. Garfield|Garfield', 'Benjamin Harrison|Harrison', 'Warren G. Harding|Harding'],
      6: ['Millard Fillmore|Fillmore', 'Franklin Pierce|Pierce', 'Chester A. Arthur|Arthur']
    }
  },
  {
    id: 'programming-languages',
    pack: 'culture',
    prompt: 'Name a programming language',
    hint: 'Mainstream, systems, academic, historical, or esoteric languages (not HTML/CSS)',
    tiers: {
      1: ['Python', 'JavaScript|JS', 'Java', 'C++', 'C', 'C#|C Sharp'],
      2: ['TypeScript|TS', 'Rust', 'Go|Golang', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'SQL', 'R'],
      3: ['Dart', 'Scala', 'Perl', 'Lua', 'Haskell', 'Elixir', 'Objective-C', 'MATLAB', 'Bash|Shell', 'Assembly|ASM', 'Visual Basic|VBA|VB'],
      4: ['Clojure', 'Erlang', 'F#|F Sharp', 'OCaml', 'Julia', 'Zig', 'Nim', 'Fortran', 'COBOL', 'Pascal|Delphi', 'Lisp|Common Lisp', 'Scheme', 'Racket', 'Prolog', 'Groovy', 'Scratch', 'Solidity', 'GDScript', 'PowerShell', 'Apex'],
      5: ['Ada', 'APL', 'Smalltalk', 'Forth', 'D|Dlang', 'Crystal', 'Gleam', 'V|Vlang', 'Odin', 'Mojo', 'Verilog', 'VHDL', 'Tcl', 'AWK', 'ActionScript', 'ColdFusion', 'ABAP', 'SAS', 'FoxPro', 'Logo', 'BASIC|QBasic', 'PureScript', 'Elm', 'ReasonML|ReScript', 'Hack', 'Chapel'],
      6: ['Brainfuck', 'Malbolge', 'Piet', 'Whitespace', 'Befunge', 'INTERCAL', 'LOLCODE', 'Shakespeare|SPL', 'Rockstar', 'HolyC', 'Idris', 'Agda', 'Coq|Rocq', 'Lean', 'Mercury', 'BQN', 'J', 'K', 'Q|kdb', 'Factor', 'Joy', 'Unison', 'Pony', 'Red', 'Rebol', 'Io', 'Self', 'Eiffel', 'Modula-2', 'Oberon', 'ALGOL', 'Simula', 'SNOBOL', 'Icon', 'PL/I', 'MUMPS', 'RPG', 'Haxe', 'Vala', 'Ballerina', 'Ring', 'Wren', 'Fennel', 'Janet']
    }
  },
  {
    id: 'web-browsers',
    pack: 'culture',
    prompt: 'Name a web browser',
    hint: 'Desktop, mobile, indie, terminal, or classic historical browsers',
    tiers: {
      1: ['Google Chrome|Chrome', 'Safari', 'Firefox|Mozilla Firefox', 'Microsoft Edge|Edge'],
      2: ['Internet Explorer|IE', 'Opera|Opera GX', 'Brave', 'Tor Browser|Tor', 'DuckDuckGo'],
      3: ['Arc', 'Vivaldi', 'Samsung Internet', 'Chromium', 'Netscape|Netscape Navigator', 'UC Browser'],
      4: ['Zen|Zen Browser', 'Ladybird', 'Orion', 'Waterfox', 'Pale Moon', 'LibreWolf', 'Mullvad Browser', 'Yandex Browser', 'Maxthon', 'Silk|Amazon Silk', 'Dolphin', 'Puffin', 'Aloha'],
      5: ['Mosaic|NCSA Mosaic', 'Lynx', 'Konqueror', 'Epiphany|GNOME Web', 'SeaMonkey', 'Floorp', 'Midori', 'Falkon|QupZilla', 'qutebrowser', 'Min', 'Phoenix', 'Camino', 'OmniWeb', 'iCab', 'RockMelt', 'Flock'],
      6: ['WorldWideWeb|Nexus', 'ViolaWWW', 'Erwise', 'Cello', 'Arena', 'Amaya', 'w3m', 'elinks|ELinks', 'Links', 'Browsh', 'Dillo', 'NetSurf', 'Nyxt', 'Uzbl', 'Luakit', 'Surf', 'K-Meleon', 'Avant Browser', 'SlimBrowser', 'Basilisk', 'Otter Browser', 'Dooble', 'Galeon', 'Arora', 'Rekonq', 'HotJava', 'Cyberdog', 'Classilla', 'TenFourFox', 'Polypane', 'SigmaOS', 'Sidekick']
    }
  },
  {
    id: 'musical-instruments',
    pack: 'culture',
    prompt: 'Name a musical instrument',
    hint: 'Strings, woodwinds, brass, percussion, keyboards, or world instruments',
    tiers: {
      1: ['Piano', 'Guitar|Acoustic Guitar|Electric Guitar', 'Violin|Fiddle', 'Drums|Drum Kit|Drum Set', 'Flute', 'Trumpet'],
      2: ['Cello', 'Saxophone', 'Clarinet', 'Bass Guitar|Bass', 'Harp', 'Ukulele', 'Trombone', 'Harmonica', 'Tambourine', 'Xylophone'],
      3: ['Viola', 'Double Bass|Upright Bass', 'Oboe', 'Bassoon', 'French Horn', 'Tuba', 'Banjo', 'Mandolin', 'Accordion', 'Bagpipes', 'Organ|Pipe Organ', 'Synthesizer|Synth', 'Triangle', 'Bongos', 'Maracas', 'Recorder'],
      4: ['Piccolo', 'Cornet', 'Euphonium', 'Baritone', 'Harpsichord', 'Marimba', 'Vibraphone', 'Glockenspiel', 'Timpani|Kettledrum', 'Snare Drum', 'Cymbals', 'Gong', 'Cowbell', 'Congas', 'Djembe', 'Cajon', 'Kalimba|Thumb Piano', 'Sitar', 'Tabla', 'Didgeridoo', 'Theremin', 'Ocarina', 'Pan Flute|Panpipes', 'Kazoo', 'Lute', 'Zither', 'Dulcimer', 'Steelpan|Steel Drum', 'Melodica'],
      5: ['English Horn|Cor Anglais', 'Contrabassoon', 'Sousaphone', 'Flugelhorn', 'Bugle', 'Celesta', 'Clavichord', 'Concertina', 'Bandoneon', 'Balalaika', 'Bouzouki', 'Oud', 'Koto', 'Shamisen', 'Erhu', 'Guzheng', 'Pipa', 'Shakuhachi', 'Taiko', 'Gamelan', 'Mbira', 'Berimbau', 'Charango', 'Cuatro', 'Guiro', 'Claves', 'Castanets', 'Bodhran', 'Tin Whistle|Pennywhistle', 'Autoharp', 'Hurdy-Gurdy', 'Hang|Handpan', 'Jaw Harp|Jews Harp', 'vuvuzela|Vuvuzela', 'Otamatone', 'Stylophone'],
      6: ['Nyckelharpa', 'Glass Armonica|Glass Harmonica', 'Ondes Martenot', 'Trautonium', 'Waterphone', 'Pyrophone', 'Zeusaphone', 'yaybahar|Yaybahar', 'Wheelharp', 'Chapman Stick', 'Harpejji', 'Theorbo', 'Archlute', 'Viola da Gamba|Viol', 'Baryton', 'Crwth', 'Rebec', 'Vihuela', 'Hardanger Fiddle', 'Crumhorn', 'Shawm', 'Rackett', 'Cornett|Zink', 'Serpent', 'Ophicleide', 'Sarrusophone', 'Heckelphone', 'Subcontrabass Flute', 'Octobass', 'Daxophone', 'Duduk', 'Ney', 'Kaval', 'Fujara', 'Bansuri', 'Shehnai', 'Sarangi', 'Sarod', 'Veena', 'Mridangam', 'Ghatam', 'Santoor|Santur', 'Qanun', 'Kora', 'Ngoni', 'Balafon', 'Talking Drum', 'Udu', 'Txalaparta', 'Alboka', 'Gaita', 'Uilleann Pipes', 'Northumbrian Smallpipes', 'Morin Khuur', 'Gayageum', 'Haegeum', 'Dan Bau', 'Khene', 'Angklung', 'Kulintang', 'Nose Flute']
    }
  },
  {
    id: 'greek-mythology',
    pack: 'culture',
    prompt: 'Name a Greek god, goddess, or Titan',
    hint: 'Olympians, primordial deities, minor gods, or Titans (Greek names!)',
    tiers: {
      1: ['Zeus', 'Poseidon', 'Hades', 'Athena', 'Apollo', 'Aphrodite', 'Ares', 'Hermes'],
      2: ['Hera', 'Artemis', 'Demeter', 'Dionysus', 'Hephaestus', 'Persephone', 'Cronus|Kronos', 'Atlas'],
      3: ['Hestia', 'Hecate', 'Nike', 'Eros', 'Pan', 'Gaia|Gaea', 'Nyx', 'Prometheus', 'Helios', 'Nemesis', 'Thanatos', 'Hypnos', 'Morpheus', 'Iris'],
      4: ['Uranus|Ouranos', 'Rhea', 'Selene', 'Eos', 'Eris', 'Tyche', 'Asclepius', 'Triton', 'Oceanus', 'Themis', 'Mnemosyne', 'Hyperion', 'Phoebe', 'Tethys', 'Epimetheus', 'Leto', 'Hebe', 'Phobos', 'Deimos', 'Chaos', 'Tartarus', 'Erebus'],
      5: ['Coeus|Koios', 'Crius|Krios', 'Iapetus', 'Theia', 'Amphitrite', 'Proteus', 'Nereus', 'Styx', 'Boreas', 'Zephyrus', 'Notus', 'Eurus', 'Hygieia', 'Harmonia', 'Eileithyia', 'Kratos|Cratus', 'Bia', 'Zelus', 'Plutus', 'Priapus', 'Momus', 'charon|Charon', 'Aeolus', 'Circe'],
      6: ['Asteria', 'Lelantos', 'Pallas', 'Perses', 'Astraeus', 'Clymene', 'Asia', 'Dione', 'Metis', 'Eurynome', 'Ophion', 'Ananke', 'Chronos', 'Phanes', 'Aether', 'Hemera', 'Pontus', 'Thalassa', 'Ourea', 'Nesoi', 'Thaumas', 'Phorcys', 'Ceto', 'Eurybia', 'Leucothea', 'Palaemon', 'Glaucus', 'Doris', 'Electra', 'galatea|Galatea', 'Thetis', 'Achelous', 'Alpheus', 'Asopus', 'Aristaeus', 'Britomartis', 'Zagreus', 'Melinoe', 'Macaria', 'Despoina', 'angelos|Angelos', 'Peitho', 'Eunomia', 'Dike', 'Eirene', 'Aglaea', 'Euphrosyne', 'Thalia', 'Clotho', 'Lachesis', 'Atropos', 'Alecto', 'Megaera', 'Tisiphone', 'Geras', 'Apate', 'Oizys', 'Philotes', 'komos|Comus', 'Hymenaios|Hymenaeus', 'Ganymede', 'Iacchus', 'Triptolemus', 'Enialius|Enyalius', 'Enyo']
    }
  },
  {
    id: 'board-games',
    pack: 'culture',
    prompt: 'Name a classic or modern board game',
    hint: 'Tabletop board games (excluding standard playing-card games like Poker)',
    tiers: {
      1: ['Monopoly', 'Chess', 'Checkers|Draughts', 'Scrabble', 'Clue|Cluedo', 'Risk', 'Connect Four|Connect 4'],
      2: ['Catan|Settlers of Catan', 'Battleship', 'The Game of Life|Life', 'Sorry', 'Candy Land|Candyland', 'Chutes and Ladders|Snakes and Ladders', 'Trivial Pursuit', 'Backgammon', 'Yahtzee', 'Operation', 'Jenga', 'Twister'],
      3: ['Ticket to Ride', 'Pandemic', 'Pictionary', 'Boggle', 'Trouble', 'Mouse Trap|Mousetrap', 'Guess Who', 'Mastermind', 'Othello|Reversi', 'Go|Weiqi|Baduk', 'Mahjong', 'Stratego', 'Chinese Checkers', 'Parcheesi|Ludo', 'Cranium', 'Scattergories', 'Taboo', 'Balderdash', 'Axis and Allies'],
      4: ['Carcassonne', 'Codenames', 'Azul', 'Wingspan', 'Terraforming Mars', 'Gloomhaven', 'Scythe', 'Root', 'Splendor', 'Dominion', '7 Wonders', 'Dixit', 'King of Tokyo', 'Betrayal at House on the Hill', 'Secret Hitler', 'Mancala', 'Dominoes', 'Rummikub', 'Sequence', 'Blokus', 'Quirkle|Qwirkle', 'Bananagrams', 'Coup', 'The Resistance|Avalon', 'Sheriff of Nottingham', 'Munchkin'],
      5: ['Twilight Imperium', 'Spirit Island', 'Brass Birmingham|Brass', 'Ark Nova', 'Dune Imperium|Dune', 'Everdell', 'Agricola', 'Puerto Rico', 'The Castles of Burgundy|Castles of Burgundy', 'Patchwork', 'Cascadia', 'Calico', 'Flamecraft', 'Heat Pedal to the Metal', 'Clank', 'Cosmic Encounter', 'Diplomacy', 'Power Grid', 'Small World', 'Sushi Go', 'Love Letter', 'Hive', 'Santorini', 'Quoridor', 'Tak', 'Crokinole', 'Subbuteo', 'Blood Bowl', 'HeroQuest', 'Scotland Yard', 'Labyrinth', 'Survive Escape from Atlantis'],
      6: ['Tigris and Euphrates', 'El Grande', 'Hansa Teutonica', 'Concordia', 'Great Western Trail', 'A Feast for Odin', 'Caverna', 'Le Havre', 'Tzolkin', 'Teotihuacan', 'Barrage', 'Gaia Project', 'Terra Mystica', 'Through the Ages', 'Mage Knight', 'Twilight Struggle', 'War of the Ring', 'Star Wars Rebellion', 'Eclipse', 'Nemesis', 'Kingdom Death Monster', 'Frosthaven', 'Oath', 'Pax Pamir', 'John Company', 'Food Chain Magnate', '1830', 'Acquire', 'Ra', 'Modern Art', 'Inis', 'Kemet', 'Cyclades', 'Blood Rage', 'Rising Sun', 'Ankh', 'Viticulture', 'Lost Ruins of Arnak', 'Sky Team', 'Dorfromantik', 'Senet', 'Royal Game of Ur', 'Hnefatafl', 'Nine Mens Morris', 'Fanorona', 'Bagh-Chal', 'Shogi', 'Xiangqi']
    }
  },

  // =========================================================================
  // PACK 4: EVERYDAY (Submarine Galley)
  // =========================================================================
  {
    id: 'fruits',
    pack: 'everyday',
    prompt: 'Name a fruit',
    hint: 'Common grocery fruits, berries, citrus, melons, or exotic tropical fruits',
    tiers: {
      1: ['Apple', 'Banana', 'Orange', 'Strawberry', 'Grape', 'Watermelon', 'Lemon', 'Blueberry', 'Pineapple', 'Mango'],
      2: ['Peach', 'Pear', 'Cherry', 'Raspberry', 'Blackberry', 'Lime', 'Kiwi|Kiwifruit', 'Plum', 'Coconut', 'Avocado', 'Tomato', 'Cantaloupe', 'Pomegranate', 'Grapefruit'],
      3: ['Apricot', 'Nectarine', 'Papaya', 'Cranberry', 'Fig', 'Date', 'Tangerine', 'Mandarin', 'Clementine', 'Honeydew', 'Passionfruit|Passion Fruit', 'Dragonfruit|Dragon Fruit|Pitaya', 'Guava', 'Lychee', 'Blackcurrant'],
      4: ['Persimmon', 'Starfruit|Carambola', 'Durian', 'Jackfruit', 'Plantain', 'Kumquat', 'Quince', 'Mulberry', 'Gooseberry', 'Elderberry', 'Boysenberry', 'Acai', 'Prune', 'Raisin', 'Blood Orange', 'Pomelo', 'Yuzu', 'Key Lime', 'Breadfruit', 'Prickly Pear', 'Olive'],
      5: ['Rambutan', 'Mangosteen', 'Cherimoya', 'Soursop|Guanabana', 'Loquat', 'Jujube', 'Longan', 'Cloudberry', 'Lingonberry', 'Huckleberry', 'Marionberry', 'Loganberry', 'Tayberry', 'Salmonberry', 'Redcurrant', 'Pawpaw', 'Feijoa|Pineapple Guava', 'Tamarind', 'Ugli Fruit', 'Kiwano|Horned Melon', 'Physalis|Cape Gooseberry|Goldenberry', 'Calamansi', 'Bergamot', 'Citron', 'Damson', 'Greengage'],
      6: ['Jabuticaba', 'Salak|Snake Fruit', 'Sapodilla', 'Mamey Sapote|Sapote', 'Black Sapote', 'Canistel|Eggfruit', 'Lucuma', 'Cupuacu', 'Camu Camu', 'Guarana', 'Ackee', 'Miracle Fruit|Miracle Berry', 'Buddhas Hand', 'Finger Lime', 'Amanatsu', 'Sudachi', 'Kabosu', 'Tamarillo', 'Pepino', 'Naranjilla|Lulo', 'Babaco', 'Marang', 'Cempedak', 'Langsat|Lanzones', 'Santol', 'pulasan|Pulasan', 'Rose Apple|Jambu', 'Wax Apple', 'Surinam Cherry|Pitanga', 'Acerola', 'Medlar', 'Rowanberry', 'Sea Buckthorn', 'Saskatoon Berry|Juneberry', 'Aronia|Chokeberry', 'Maypop', 'Monstera Deliciosa', 'Hala Fruit', 'Noni', 'Bael', 'Wood Apple', 'Kokum', 'bilimbi|Bilimbi', 'Jostaberry']
    }
  },
  {
    id: 'pasta-shapes',
    pack: 'everyday',
    prompt: 'Name a pasta shape or type',
    hint: 'Italian long, short, tube, stuffed, or regional pasta shapes',
    tiers: {
      1: ['Spaghetti', 'Penne', 'Macaroni|Elbow Macaroni', 'Fettuccine', 'Lasagna|Lasagne', 'Ravioli', 'Linguine'],
      2: ['Rigatoni', 'Fusilli', 'Rotini', 'Farfalle|Bowtie|Bow Tie', 'Tortellini', 'Orzo', 'Angel Hair|Capellini', 'Gnocchi', 'Ziti'],
      3: ['Tagliatelle', 'Pappardelle', 'Bucatini', 'Orecchiette', 'Cavatappi', 'Shells|Conchiglie', 'Cannelloni', 'Manicotti', 'Ditalini', 'Vermicelli', 'Alphabet Pasta|Alfabeto'],
      4: ['Tortelloni', 'Agnolotti', 'Paccheri', 'Gemelli', 'Campanelle|Gigli', 'Radiatori', 'Casarecce', 'Strozzapreti', 'Cavatelli', 'Trofie', 'Mafaldine|Mafalde', 'Pastina', 'Acini di Pepe', 'Stelline', 'wagon wheels|Ruote|Rotelle', 'Mostaccioli'],
      5: ['Pici', 'Bigoli', 'Garganelli', 'Busiate', 'Malloreddus|Gnocchetti Sardi', 'Fregola|Fregula', 'Pizzoccheri', 'Tagliolini', 'Trenette', 'Bavette', 'Spaghettoni', 'Mezze Maniche', 'Calamarata', 'Lumache|Lumaconi', 'Pipe Rigate', 'Anelletti', 'Fideo', 'Cappelletti', 'Mezzelune', 'Pansotti', 'Fagottini'],
      6: ['Su Filindeu', 'Corzetti|Croxetti', 'Culurgiones', 'Lorighittas', 'Scialatielli', 'Stringozzi|Strangozzi', 'Ciriole', 'Umbricelli', 'Tajarin', 'Plin|Agnolotti del Plin', 'Anolini', 'Casoncelli', 'Tortelli', 'Marubini', 'Passatelli', 'Strascinati', 'Capunti', 'Foglie d Ulivo', 'Sagne', 'Lagane', 'Fileja', 'Maccheroni alla Chitarra|Spaghetti alla Chitarra', 'Testaroli', 'Panigacci', 'Cencioni', 'Maltagliati', 'Quadrucci', 'Risoni', 'Tempestina', 'Gramigna', 'Torchietti|Torchio', 'Sachettoni', 'Caramelle', 'Casunziei', 'Canederli']
    }
  },
  {
    id: 'cheeses',
    pack: 'everyday',
    prompt: 'Name a type of cheese',
    hint: 'Cheeses from any country or milk tradition',
    tiers: {
      1: ['Cheddar', 'Mozzarella', 'Parmesan|Parmigiano-Reggiano|Parmigiano', 'Swiss', 'Brie', 'Gouda', 'American|American Cheese'],
      2: ['Feta', 'Provolone', 'Cream Cheese', 'Blue Cheese', 'Goat Cheese|Chevre', 'Monterey Jack', 'Pepper Jack', 'Ricotta', 'Cottage Cheese', 'Camembert', 'Colby|Colby Jack'],
      3: ['Gruyere', 'Gorgonzola', 'Havarti', 'Muenster', 'Manchego', 'Pecorino|Pecorino Romano', 'Halloumi', 'Burrata', 'Mascarpone', 'Roquefort', 'Stilton', 'Edam', 'Emmental|Emmentaler', 'Asiago', 'Fontina', 'Paneer', 'Velveeta'],
      4: ['Raclette', 'Comte', 'Jarlsberg', 'Cotija', 'Oaxaca', 'Queso Fresco', 'Queso Blanco', 'Panela', 'String Cheese', 'Limburger', 'Red Leicester', 'Wensleydale', 'Double Gloucester', 'cheshire|Cheshire', 'Caerphilly', 'Taleggio', 'Grana Padano', 'Scamorza', 'Provolone Piccante', 'Neufchatel', 'Port Salut', 'Boursin', 'Babybel'],
      5: ['Epoisses', 'Mimolette', 'Reblochon', 'Morbier', 'Beaufort', 'Cantal', 'Saint-Nectaire', 'Tomme de Savoie', 'Ossau-Iraty', 'Vacherin Mont d Or|Mont d Or', 'Appenzeller', 'Tete de Moine', 'Sbrinz', 'Brunost|Gjetost', 'Danablu', 'Cabrales', 'Idiazabal', 'Mahon', 'Tetilla', 'Robiola', 'Stracchino|Crescenza', 'Caciocavallo', 'bocconcini|Bocconcini', 'Kasseri', 'Kefalotyri', 'Graviera', 'Mizithra', 'Labneh', 'Nabulsi', 'Ackawi', 'Humboldt Fog', 'clothbound cheddar|tickler'],
      6: ['Casu Marzu|Casu Martzu', 'Milbenkase', 'Pule', 'Stinking Bishop', 'Cornish Yarg', 'Shropshire Blue', 'Dorset Blue Vinney', 'Swaledale', 'Stichelton', 'Cashel Blue', 'Gubbeen', 'bitto|Bitto|Storico Ribelle', 'Castelmagno', 'Raschera', 'Bra', 'bagoss|Bagoss', 'Piave', 'Montasio', 'Puzzone di Moena', 'Squacquerone', 'Ragusano', 'Fiore Sardo', 'Livarot', 'Pont-l Eveque', 'Maroilles', 'Langres', 'Chaource', 'Brillat-Savarin', 'Saint-Andre', 'Selles-sur-Cher', 'Valencay', 'Crottin de Chavignol', 'Pouligny-Saint-Pierre', 'Sainte-Maure de Touraine', 'Rocamadour', 'Bleu d Auvergne', 'Fourme d Ambert', 'Salers', 'Laguiole', 'Abondance', 'Roncal', 'Zamorano', 'Torta del Casar', 'Garrotxa', 'Majorero', 'Queijo Serra da Estrela', 'Sao Jorge', 'Tilsit|Tilsiter', 'Handkase', 'Quargel', 'Bryndza', 'Oscypek', 'Parenica', 'Sirene', 'Kashkaval', 'Sulguni', 'Chechil', 'Rushan', 'Sakura Cheese', 'Chhurpi']
    }
  },
  {
    id: 'dog-breeds',
    pack: 'everyday',
    prompt: 'Name a dog breed',
    hint: 'Recognized purebred dogs or iconic breeds',
    tiers: {
      1: ['Labrador Retriever|Labrador|Lab', 'Golden Retriever', 'German Shepherd', 'Poodle', 'Bulldog|English Bulldog', 'French Bulldog|Frenchie', 'Beagle', 'Chihuahua', 'Pug', 'Siberian Husky|Husky'],
      2: ['Dachshund|Wiener Dog|Sausage Dog', 'Corgi|Pembroke Welsh Corgi|Cardigan Welsh Corgi', 'Rottweiler', 'Boxer', 'Doberman|Doberman Pinscher', 'Great Dane', 'Shih Tzu', 'Yorkshire Terrier|Yorkie', 'Dalmatian', 'Pomeranian', 'Border Collie', 'Shiba Inu'],
      3: ['Australian Shepherd', 'pit bull|Pitbull|American Pit Bull Terrier', 'Cavalier King Charles Spaniel', 'Cocker Spaniel', 'Springer Spaniel', 'Saint Bernard|St Bernard', 'Bernese Mountain Dog', 'Mastiff|English Mastiff', 'Greyhound', 'Basset Hound', 'Bloodhound', 'Boston Terrier', 'Jack Russell Terrier|Parson Russell Terrier', 'Bull Terrier', 'Maltese', 'Bichon Frise', 'Chow Chow', 'Akita', 'Samoyed', 'Alaskan Malamute', 'Shetland Sheepdog|Sheltie', 'Collie|Rough Collie'],
      4: ['Whippet', 'Italian Greyhound', 'Weimaraner', 'Vizsla', 'German Shorthaired Pointer|Pointer', 'Irish Setter', 'English Setter', 'Newfoundland', 'Great Pyrenees', 'Cane Corso', 'Rhodesian Ridgeback', 'Basenji', 'Shar-Pei|Chinese Shar-Pei', 'Pekingese', 'Lhasa Apso', 'Havanese', 'Papillon', 'Miniature Pinscher', 'Miniature Schnauzer|Schnauzer|Giant Schnauzer', 'Scottish Terrier|Scottie', 'West Highland White Terrier|Westie', 'Airedale Terrier', 'Staffordshire Bull Terrier|Staffy', 'Australian Cattle Dog|Blue Heeler', 'Belgian Malinois|Malinois', 'Afghan Hound', 'Irish Wolfhound'],
      5: ['Borzoi', 'Saluki', 'Leonberger', 'komondor|Komondor', 'Puli', 'Old English Sheepdog', 'Briard', 'Bouvier des Flandres', 'Keeshond', 'Schipperke', 'American Eskimo Dog', 'Finnish Spitz', 'Norwegian Elkhound', 'Pharaoh Hound', 'Ibizan Hound', 'Coonhound|Black and Tan Coonhound|Redbone Coonhound|Bluetick Coonhound', 'Foxhound', 'Harrier', 'Brittany', 'Chesapeake Bay Retriever', 'Flat-Coated Retriever', 'Nova Scotia Duck Tolling Retriever|Toller', 'Bullmastiff', 'Neapolitan Mastiff', 'Dogue de Bordeaux', 'Tibetan Mastiff', 'Anatolian Shepherd', 'Kuvasz', 'Bedlington Terrier', 'Cairn Terrier', 'Fox Terrier|Wire Fox Terrier', 'Kerry Blue Terrier', 'Soft Coated Wheaten Terrier', 'Chinese Crested', 'Brussels Griffon', 'Japanese Chin', 'Cotons de Tulear|Coton de Tulear'],
      6: ['Xoloitzcuintli|Xolo|Mexican Hairless', 'Norwegian Lundehund', 'Azawakh', 'Sloughi', 'Scottish Deerhound', 'Otterhound', 'Lagotto Romagnolo', 'Barbet', 'Portuguese Water Dog', 'Spanish Water Dog', 'Irish Water Spaniel', 'Clumber Spaniel', 'Sussex Spaniel', 'Field Spaniel', 'Welsh Springer Spaniel', 'Boykin Spaniel', 'Kooikerhondje', 'Stabyhoun', 'Drentsche Patrijshond', 'Spinone Italiano', 'Bracco Italiano', 'Wirehaired Pointing Griffon', 'Pudelpointer', 'Munsterlander', 'Bergamasco|Bergamasco Sheepdog', 'Mudi', 'Pumi', 'Beauceron', 'Berger Picard', 'Pyrenean Shepherd', 'Catalan Sheepdog', 'Polish Lowland Sheepdog', 'icelandic sheepdog|Icelandic Sheepdog', 'Swedish Vallhund', 'Lancashire Heeler', 'Entlebucher Mountain Dog', 'Appenzeller Sennenhund', 'Greater Swiss Mountain Dog', 'Boerboel', 'Tosa|Tosa Inu', 'Dogo Argentino', 'Fila Brasileiro', 'Thai Ridgeback', 'Jindo|Korean Jindo', 'Kai Ken', 'Kishu Ken', 'Shikoku', 'Hokkaido', 'canaan dog|Canaan Dog', 'Carolina Dog', 'New Guinea Singing Dog', 'Chinook', 'Plott Hound', 'Petit Basset Griffon Vendeen|PBGV', 'Dandie Dinmont Terrier', 'Sealyham Terrier', 'Skye Terrier', 'Glen of Imaal Terrier', 'Manchester Terrier', 'Norfolk Terrier', 'Norwich Terrier', 'Lakeland Terrier', 'Welsh Terrier', 'Affenpinscher', 'Lowchen', 'Bolognese', 'Russian Toy', 'Peruvian Inca Orchid']
    }
  },
  {
    id: 'olympic-sports',
    pack: 'everyday',
    prompt: 'Name an Olympic sport or event',
    hint: 'Current or historical Summer & Winter Olympic sports and disciplines',
    tiers: {
      1: ['Swimming', 'Gymnastics|Artistic Gymnastics', 'Basketball', 'Soccer|Football', 'Track and Field|Athletics|Sprinting', 'Tennis', 'Volleyball', 'Boxing'],
      2: ['Diving', 'Figure Skating', 'Ice Hockey', 'Skiing|Alpine Skiing', 'Snowboarding', 'Wrestling', 'Weightlifting', 'Cycling', 'Rowing', 'Archery', 'Fencing', 'Golf', 'Badminton', 'Table Tennis|Ping Pong'],
      3: ['Curling', 'Bobsleigh|Bobsled', 'Luge', 'Skeleton', 'Speed Skating|Short Track Speed Skating', 'Water Polo', 'Handball', 'Rugby|Rugby Sevens', 'Surfing', 'Skateboarding', 'Sport Climbing|Rock Climbing', 'Judo', 'Taekwondo', 'Karate', 'Triathlon', 'Marathon', 'Beach Volleyball', 'Baseball', 'Softball', 'Equestrian|Show Jumping'],
      4: ['Biathlon', 'Cross-Country Skiing', 'Ski Jumping', 'Freestyle Skiing', 'Artistic Swimming|Synchronized Swimming', 'Rhythmic Gymnastics', 'Trampoline', 'Canoeing|Kayaking|Canoe Sprint', 'Sailing', 'Shooting', 'Field Hockey', 'BMX|BMX Racing|BMX Freestyle', 'Mountain Biking', 'Track Cycling', 'Breaking|Breakdancing', 'Pole Vault', 'High Jump', 'Long Jump', 'Triple Jump', 'Shot Put', 'Discus', 'Javelin', 'Hammer Throw', 'Hurdles', 'Decathlon', 'Heptathlon', 'Dressage', 'Eventing'],
      5: ['Modern Pentathlon', 'Nordic Combined', 'Ski Mountaineering|Skimo', 'Canoe Slalom', 'Flag Football', 'Lacrosse', 'Squash', 'Cricket', 'Tug of War', 'Race Walking', 'Steeplechase', '3x3 Basketball', 'Coastal Rowing', 'Open Water Swimming|Marathon Swimming', 'Greco-Roman Wrestling', 'Freestyle Wrestling', 'Epee', 'Foil', 'Sabre'],
      6: ['Roque', 'Jeu de Paume', 'Basque Pelota|Pelota', 'Croquet', 'Polo', 'Rackets', 'Water Motorsports|Motorboating', 'Live Pigeon Shooting', 'Plunge for Distance', 'Standing High Jump', 'Standing Long Jump', 'Solo Synchronized Swimming', 'Rope Climbing', 'Club Swinging', 'Dueling Pistol', 'Running Deer Shooting', 'Military Patrol', 'Skijoring', 'Ice Stock Sport|Eisstockschiessen', 'Bandy', 'Winter Pentathlon', 'Speed Skiing', 'Ski Ballet|Acroski', 'Keirin', 'Madison', 'Omnium', 'Finn', 'Laser|ILCA', 'Nacra 17', 'Rink Hockey|Roller Hockey', 'Korfball', 'Savate']
    }
  },
  {
    id: 'martial-arts',
    pack: 'everyday',
    prompt: 'Name a martial art or combat sport',
    hint: 'Traditional martial arts, grappling styles, weapon arts, or ring sports',
    tiers: {
      1: ['Karate', 'Kung Fu|Wushu', 'Judo', 'Taekwondo', 'Boxing', 'Wrestling', 'Jiu-Jitsu|Brazilian Jiu-Jitsu|BJJ', 'MMA|Mixed Martial Arts'],
      2: ['Muay Thai', 'Kickboxing', 'Krav Maga', 'Tai Chi|Taijiquan', 'Aikido', 'Sumo', 'Capoeira', 'Fencing', 'Kendo'],
      3: ['Wing Chun', 'Jeet Kune Do', 'Sambo', 'Hapkido', 'Ninjutsu', 'Jujutsu|Japanese Jujutsu', 'Eskrima|Kali|Arnis', 'Silat|Pencak Silat', 'Savate', 'Kyokushin', 'Greco-Roman Wrestling', 'Freestyle Wrestling'],
      4: ['Tang Soo Do', 'Shotokan', 'Kenpo|Kempo', 'Sanda|Sanshou', 'Lethwei', 'Catch Wrestling', 'Lucha Libre', 'Iaido', 'Kenjutsu', 'Shaolin Kung Fu', 'Drunken Boxing|Zui Quan', 'Systema', 'vale tudo|Vale Tudo', 'Shootfighting', 'Pankration'],
      5: ['Baguazhang', 'Xingyiquan', 'Bajiquan', 'Hung Gar', 'Choy Li Fut', 'Shuai Jiao', 'Shorinji Kempo', 'Goju-Ryu', 'Wado-Ryu', 'Shito-Ryu', 'Naginatajutsu', 'Bojutsu', 'Kyudo', 'Jodo', 'Kalaripayattu', 'Gatka', 'Vovinam', 'Bokator', 'Krabi-Krabong', 'Ssireum', 'Bartitsu', 'HEMA|Historical European Martial Arts'],
      6: ['Dambe', 'Laamb|Senegalese Wrestling', 'Bokh|Mongolian Wrestling', 'Schwingen', 'Yagli Gures|Turkish Oil Wrestling', 'Pehlwani|Kushti', 'Glima', 'Collar-and-Elbow', 'Cornish Wrestling', 'Lancashire Wrestling', 'Backhold', 'Gouren', 'Chidaoba', 'kokh|Kokh', 'Kurash', 'Alysh', 'Belt Wrestling', 'Malla-Yuddha', 'Vajra-Mushti', 'Silambam', 'Mardani Khel', 'Thang-Ta', 'Angampora', 'Bando', 'Banshay', 'Lerdrit', 'Muay Boran', 'Pradal Serey', 'Tomoi', 'Kuntao', 'Yaw-Yan', 'Sikaran', 'Buno', 'Dumog', 'Lua|Kapu Kuialua', 'Mau Rakau', 'Taiaha', 'Jogo do Pau', 'Canne de Combat|La Canne', 'Quarterstaff', 'Singlestick', 'Destreza', ' Kapap', 'Keysi|KFM', 'Okichitaw', 'Rough and Tumble', 'huka-huka|Huka-Huka', 'Tinku', 'Moraingy', 'Nguni Stick Fighting', 'Tahtib']
    }
  },
  {
    id: 'world-currencies',
    pack: 'everyday',
    prompt: 'Name a currency used in the world today',
    hint: 'Active official currencies (e.g., Yen, Euro, Baht, Zloty)',
    tiers: {
      1: ['Dollar|US Dollar|Canadian Dollar|Australian Dollar', 'Euro', 'Pound|Pound Sterling|British Pound', 'Yen|Japanese Yen', 'Peso|Mexican Peso'],
      2: ['Yuan|Renminbi|RMB', 'Franc|Swiss Franc', 'Rupee|Indian Rupee', 'Won|South Korean Won', 'Ruble|Russian Ruble', 'Krone|Danish Krone|Norwegian Krone', 'Krona|Swedish Krona|Icelandic Krona', 'Lira|Turkish Lira', 'Real|Brazilian Real'],
      3: ['Rand|South African Rand', 'Baht|Thai Baht', 'Dirham|UAE Dirham|Moroccan Dirham', 'Dinar|Kuwaiti Dinar|Jordanian Dinar', 'Riyal|Saudi Riyal|Qatari Riyal', 'Shekel|New Israeli Shekel', 'Dong|Vietnamese Dong', 'Ringgit|Malaysian Ringgit', 'Rupiah|Indonesian Rupiah', 'Zloty|Polish Zloty'],
      4: ['Forint|Hungarian Forint', 'Koruna|Czech Koruna', 'Hryvnia|Ukrainian Hryvnia', 'Leu|Romanian Leu|Moldovan Leu', 'Lev|Bulgarian Lev', 'Sol|Peruvian Sol', 'Boliviano', 'Guarani', 'Quetzal', 'Colon|Costa Rican Colon', 'Cordoba', 'Balboa', 'Naira|Nigerian Naira', 'Shilling|Kenyan Shilling|Tanzanian Shilling|Ugandan Shilling', 'Cedi|Ghanaian Cedi', 'Birr|Ethiopian Birr', 'Taka|Bangladeshi Taka', 'Tenge|Kazakhstani Tenge'],
      5: ['Lari|Georgian Lari', 'Dram|Armenian Dram', 'Manat|Azerbaijani Manat|Turkmenistani Manat', 'Lek|Albanian Lek', 'Denar|Macedonian Denar', 'Convertible Mark|Bosnian Mark', 'Rial|Iranian Rial|Omani Rial|Yemeni Rial', 'Afghani', 'Riel|Cambodian Riel', 'Kip|Lao Kip', 'Kyat|Myanmar Kyat', 'Tugrik|Togrog|Mongolian Togrog', 'Som|Kyrgyzstani Som|Uzbekistani Som', 'Lempira', 'Gourde', 'Pula|Botswana Pula', 'Kwacha|Zambian Kwacha|Malawian Kwacha', 'Kwanza', 'Metical', 'Ariary|Malagasy Ariary'],
      6: ['Ngultrum|Bhutanese Ngultrum', 'Rufiyaa|Maldivian Rufiyaa', 'Pataca|Macanese Pataca', 'Somoni|Tajikistani Somoni', 'Kina|Papua New Guinean Kina', 'Vatu|Vanuatu Vatu', 'Tala|Samoan Tala', 'Pa anga|Tongan Paanga', 'Dalasi|Gambian Dalasi', 'Ouguiya|Mauritanian Ouguiya', 'Nakfa|Eritrean Nakfa', 'Lilangeni|Swazi Lilangeni', 'Loti|Lesotho Loti', 'Leone|Sierra Leonean Leone', 'Dobra|Sao Tome Dobra', 'Escudo|Cape Verdean Escudo', 'Florin|Aruban Florin', 'Guilder|Antillean Guilder']
    }
  }
];
