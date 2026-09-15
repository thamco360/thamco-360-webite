// Content for /blog/locations/ and /blog/locations/<slug>/.
// Rendered by scripts/render-locations.mjs (called from build-blog.mjs).
//
// Ground rules, so these stay useful pages rather than doorway pages:
// - Every area has its own reasoning, planning notes, business mix and FAQs;
//   only the "do you serve" and "price" questions are shared.
// - No claim that Thamco360 has shot in a given area. The copy says the crew
//   serves the area, which is true of all of Bangalore.
// - Landmarks are well-known public places, named only to orient the reader.
// - Price is the owner-supplied basic package: from ₹7,999.

export const PRICE_FROM = 7999;
export const PRICE_TAGLINE_HTML = 'Explore localized destinations with basic packages starting from just <strong>₹7,999</strong>!';

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const IMG = {
  restaurant: { src: U('photo-1517248135467-4c7edcad34c4'), alt: 'Representative photo of a modern restaurant interior with set tables' },
  cowork: { src: U('photo-1497366216548-37526070297c'), alt: 'Representative photo of a modern office corridor with glass-walled rooms' },
  gym: { src: U('photo-1534438327276-14e5300c3a48'), alt: 'Representative photo of a gym with dumbbell racks' },
  reception: { src: U('photo-1519494026892-80bbd2d6fd0d'), alt: 'Representative photo of a hospital reception desk' },
  salon: { src: U('photo-1560066984-138dadb4c035'), alt: 'Representative photo of a salon with styling chairs and mirrors' },
  banquet: { src: U('photo-1519167758481-83f550bb49b3'), alt: 'Representative photo of a banquet hall with round tables and chandeliers' },
  showroom: { src: U('photo-1492144534655-ae79c964c9d7'), alt: 'Representative photo of sports cars displayed in a dark showroom' },
  suite: { src: U('photo-1616594039964-ae9021a400a0'), alt: 'Representative photo of a luxury hotel-style bedroom' },
  villa: { src: U('photo-1512917774080-9991f1c4c750'), alt: 'Representative photo of a white villa with a private pool' },
  resort: { src: U('photo-1571003123894-1f0594d2b5d9'), alt: 'Representative photo of an infinity pool with cabanas at sunset' },
  apartment: { src: U('photo-1522708323590-d24dbb6b0267'), alt: 'Representative photo of a bright furnished apartment with an open kitchen' },
  poolTerrace: { src: U('photo-1571896349842-33c89424de2d'), alt: 'Representative photo of a hotel pool terrace at dusk' },
  house: { src: U('photo-1600585154340-be6161a56a0c'), alt: 'Representative photo of a modern two-storey house exterior at dusk' },
};

// Guide slugs in scripts/blog-posts.mjs.
const G = {
  gmb: 'google-business-profile-360-virtual-tour-benefits',
  resorts: '360-virtual-tour-resorts-hotels-bangalore',
  cowork: 'virtual-tour-coworking-office-spaces-bangalore',
  restaurants: '360-virtual-tour-restaurants-cafes-bangalore',
  health: 'virtual-tour-hospitals-dental-clinics-bangalore',
  realEstate: '360-virtual-tour-real-estate-bangalore',
  schools: 'virtual-tour-schools-colleges-bangalore',
  venues: '360-virtual-tour-wedding-event-venues-bangalore',
  retail: 'virtual-tour-gyms-salons-showrooms-bangalore',
};

// Indiranagar already has its own page at the site root; the hub links to it.
export const INDIRANAGAR = {
  slug: 'indiranagar',
  name: 'Indiranagar',
  zone: 'East Bangalore',
  path: '/360-virtual-tour-indiranagar-bengaluru/',
  cardText: 'Cafés, retail boutiques, clinics and commercial spaces.',
  image: IMG.salon,
};

export const locations = [
  {
    slug: 'koramangala',
    name: 'Koramangala',
    zone: 'South-East Bangalore',
    title: '360° Virtual Tours in Koramangala, Bangalore | Thamco360',
    description: '360° virtual tours and Google Street View photography for Koramangala cafés, pubs, co-working spaces and startups. Basic packages from ₹7,999.',
    dek: 'Koramangala moves fast — new cafés, microbreweries and startup offices open every month. A 360° tour lets people step inside your space before they decide where to go.',
    cardText: 'Cafés, pubs, co-working spaces and startup offices.',
    image: { ...IMG.restaurant, caption: 'Representative image — restaurants, cafés and pubs are Koramangala’s most searched spaces.' },
    sections: [
      { id: 'why-koramangala', h2: 'Why virtual tours work in Koramangala', html: `
<p>From the restaurants along 80 Feet Road to the offices tucked into 5th and 6th Block, Koramangala is one of Bangalore’s most searched neighbourhoods for places to eat, drink and work. With so many options a few hundred metres apart, people decide on Google Maps in seconds.</p>
<p>A 360° tour shows the ambiance, the seating and the layout honestly, so the people who walk in are the ones who already liked what they saw.</p>` },
      { id: 'shoot-koramangala', h2: 'Getting the shoot right in a busy neighbourhood', html: `
<p>Koramangala outlets are rarely quiet, so capture is planned for before opening or a slow weekday window. Parking and building access are sorted in advance, and most spaces under 5,000 sq ft are captured in a single 2-to-4 hour visit.</p>` },
    ],
    businesses: [
      { label: 'Restaurants, cafés and microbreweries', guide: G.restaurants },
      { label: 'Co-working spaces and startup offices', guide: G.cowork },
      { label: 'Gyms, salons and boutiques', guide: G.retail },
      { label: 'Clinics and wellness centres', guide: G.health },
    ],
    faqs: [
      { q: 'Can you shoot a Koramangala café or pub before it opens?', a: 'Yes. Most restaurant and pub shoots are done before opening, with tables set and lights on as they are for service, so the tour shows the real ambiance with no guests in frame.' },
      { q: 'Will a tour help my Koramangala business on Google Maps?', a: 'The tour is published to your Google Business Profile, so it opens from your listing on Google Maps and Search. Google does not publish a ranking boost for 360° imagery, but a complete, engaging profile helps people choose you once they find you.' },
    ],
    nearby: ['indiranagar', 'hsr-layout', 'jayanagar', 'mg-road-brigade-road'],
    guides: [G.restaurants, G.cowork, G.gmb],
  },
  {
    slug: 'whitefield',
    name: 'Whitefield',
    zone: 'East Bangalore',
    title: '360° Virtual Tours in Whitefield, Bangalore | Thamco360',
    description: '360° virtual tours for Whitefield offices, tech parks, hotels, apartment projects and schools, on Google and your website. From ₹7,999.',
    dek: 'Whitefield is Bangalore’s eastern tech corridor — offices, hotels, gated communities and international schools. A 360° tour lets clients, tenants and families explore from anywhere.',
    cardText: 'Tech parks, hotels, apartment projects and schools.',
    image: { ...IMG.cowork, caption: 'Representative image — office floors and tech-park spaces.' },
    sections: [
      { id: 'why-whitefield', h2: 'Why virtual tours work in Whitefield', html: `
<p>Around ITPL, the tech parks and Phoenix Marketcity, many of the people choosing a Whitefield office, hotel or home are not in Bangalore yet — relocating employees, visiting clients and NRI buyers. A shareable 360° tour gives them the same view as a site visit, without the drive across the city.</p>` },
      { id: 'shoot-whitefield', h2: 'Planning a Whitefield shoot', html: `
<p>Offices and tech-park floors are best captured early in the morning or at a weekend, and apartment show flats on weekdays when there are fewer visitors. Large campuses are planned floor by floor or building by building.</p>` },
    ],
    businesses: [
      { label: 'Offices, tech parks and co-working spaces', guide: G.cowork },
      { label: 'Hotels and serviced apartments', guide: G.resorts },
      { label: 'Apartment projects, villas and show flats', guide: G.realEstate },
      { label: 'International schools and colleges', guide: G.schools },
      { label: 'Hospitals and clinics', guide: G.health },
    ],
    faqs: [
      { q: 'Can you capture a full office floor in a Whitefield tech park?', a: 'Yes. Bare-shell and furnished floors can both be captured, usually early in the morning or at a weekend so no employees are in frame. Large floors and multi-building campuses are planned floor by floor.' },
      { q: 'Are tours useful for relocating employees and NRI buyers?', a: 'Yes. A 360° tour link lets people who are not yet in Bangalore walk through an office, hotel room or apartment from anywhere and share it with family or colleagues before visiting.' },
    ],
    nearby: ['marathahalli', 'indiranagar', 'sarjapur-road', 'hsr-layout'],
    guides: [G.cowork, G.realEstate, G.resorts],
  },
  {
    slug: 'hsr-layout',
    name: 'HSR Layout',
    zone: 'South-East Bangalore',
    title: '360° Virtual Tours in HSR Layout, Bangalore | Thamco360',
    description: '360° virtual tours for HSR Layout startups, cafés, gyms, preschools and co-working spaces, on your Google Business Profile. From ₹7,999.',
    dek: 'HSR Layout blends startup offices, busy cafés and quiet residential sectors. A 360° tour helps neighbourhood businesses stand out to the people searching right around them.',
    cardText: 'Startups, cafés, gyms, preschools and co-working.',
    image: { ...IMG.gym, caption: 'Representative image — gyms and fitness studios.' },
    sections: [
      { id: 'why-hsr', h2: 'Why virtual tours work in HSR Layout', html: `
<p>HSR Layout’s sectors are full of businesses that serve the people living and working nearby — cafés on 27th Main, gyms, salons, preschools and co-working spaces. Most of their customers find them by searching “near me” on Google Maps.</p>
<p>A 360° tour on your Google Business Profile turns that quick search into a confident visit: parents can see a preschool’s classrooms, members can check a gym’s equipment, and teams can walk a co-working floor.</p>` },
      { id: 'shoot-hsr', h2: 'Shoots that fit around your day', html: `
<p>Capture is scheduled before opening or after closing, so classes, members and customers are never disturbed. Smaller gyms, salons and studios are usually done in a couple of hours.</p>` },
    ],
    businesses: [
      { label: 'Cafés and restaurants', guide: G.restaurants },
      { label: 'Co-working spaces and startup offices', guide: G.cowork },
      { label: 'Gyms, salons and studios', guide: G.retail },
      { label: 'Preschools and daycare centres', guide: G.schools },
    ],
    faqs: [
      { q: 'Can you shoot a preschool or daycare in HSR Layout?', a: 'Yes. Preschool shoots are scheduled on holidays, weekends or after hours so no children are captured, and parents can then explore classrooms, play areas and hygiene facilities from home.' },
      { q: 'How long does a small HSR Layout gym or salon shoot take?', a: 'Smaller gyms, salons and studios are usually captured in a couple of hours before opening, so equipment and stations are shown clearly with no members in frame.' },
    ],
    nearby: ['koramangala', 'sarjapur-road', 'jp-nagar', 'electronic-city'],
    guides: [G.retail, G.schools, G.cowork],
  },
  {
    slug: 'jayanagar',
    name: 'Jayanagar',
    zone: 'South Bangalore',
    title: '360° Virtual Tours in Jayanagar, Bangalore | Thamco360',
    description: '360° virtual tours for Jayanagar clinics, diagnostic centres, jewellery and saree stores, restaurants and schools. Basic packages from ₹7,999.',
    dek: 'Jayanagar is one of Bangalore’s most established neighbourhoods, known for its shopping streets, clinics and family-run businesses. A 360° tour brings that trust online.',
    cardText: 'Clinics, family stores, restaurants and schools.',
    image: { ...IMG.reception, caption: 'Representative image — clinic and hospital reception areas.' },
    sections: [
      { id: 'why-jayanagar', h2: 'Why virtual tours work in Jayanagar', html: `
<p>Around the 4th Block shopping complex and the neighbourhood’s busy main roads, Jayanagar customers are loyal but careful. They compare clinics, stores and restaurants closely before they visit — often as a family.</p>
<p>A 360° tour lets them see a clinic’s waiting area, a store’s full range or a restaurant’s seating in advance, which is the same reassurance a personal recommendation gives.</p>` },
      { id: 'shoot-jayanagar', h2: 'Respecting patients and customers', html: `
<p>Healthcare spaces are captured outside consultation hours so no patients appear, and retail stores before opening so displays are shown in full. Sensitive areas are left out unless you want them included.</p>` },
    ],
    businesses: [
      { label: 'Clinics and diagnostic centres', guide: G.health },
      { label: 'Jewellery, saree and retail stores', guide: G.retail },
      { label: 'Restaurants and sweet shops', guide: G.restaurants },
      { label: 'Schools and tuition centres', guide: G.schools },
    ],
    faqs: [
      { q: 'How do you protect patient privacy when shooting a Jayanagar clinic?', a: 'Clinic shoots are scheduled outside consultation hours so no patients are captured, screens and records are kept out of frame, and anything sensitive is removed before the tour is published.' },
      { q: 'Can a retail store in Jayanagar show its full range in a tour?', a: 'Yes. Each section of the store is captured, so customers can look around the displays and plan what to see before they visit.' },
    ],
    nearby: ['jp-nagar', 'koramangala', 'bannerghatta-road', 'hsr-layout'],
    guides: [G.health, G.retail, G.restaurants],
  },
  {
    slug: 'jp-nagar',
    name: 'JP Nagar',
    zone: 'South Bangalore',
    title: '360° Virtual Tours in JP Nagar, Bangalore | Thamco360',
    description: '360° virtual tours for JP Nagar hospitals, clinics, schools, apartments and restaurants, published to Google and your website. From ₹7,999.',
    dek: 'JP Nagar’s residential phases are home to hospitals, schools, restaurants and new apartment projects. A 360° tour helps families and patients choose with confidence.',
    cardText: 'Hospitals, schools, apartments and restaurants.',
    image: { ...IMG.apartment, caption: 'Representative image — apartments, show flats and rentals.' },
    sections: [
      { id: 'why-jp-nagar', h2: 'Why virtual tours work in JP Nagar', html: `
<p>JP Nagar is a family neighbourhood, and the decisions made here are family decisions — which school, which hospital, which apartment. Those choices are researched online long before anyone visits.</p>
<p>A 360° tour gives parents, patients and home buyers a clear look inside, so the site visit confirms what they already expect.</p>` },
      { id: 'shoot-jp-nagar', h2: 'From one clinic to an entire campus', html: `
<p>A single clinic or restaurant is usually captured in one visit. Hospitals, schools and apartment projects are planned area by area, around patient hours, school holidays or show-flat timings.</p>` },
    ],
    businesses: [
      { label: 'Hospitals and clinics', guide: G.health },
      { label: 'Schools and preschools', guide: G.schools },
      { label: 'Apartment projects and rentals', guide: G.realEstate },
      { label: 'Restaurants and cafés', guide: G.restaurants },
    ],
    faqs: [
      { q: 'Can you capture an apartment show flat in JP Nagar?', a: 'Yes. Finished show flats, model apartments and rentals can be captured room by room, including balconies and shared amenities, and embedded on your project website.' },
      { q: 'Do you shoot school campuses in JP Nagar?', a: 'Yes. Campus shoots are scheduled on holidays, weekends or after school hours so no students are captured, and large campuses are planned building by building.' },
    ],
    nearby: ['jayanagar', 'bannerghatta-road', 'hsr-layout', 'koramangala'],
    guides: [G.health, G.schools, G.realEstate],
  },
  {
    slug: 'malleshwaram',
    name: 'Malleshwaram',
    zone: 'North-West Bangalore',
    title: '360° Virtual Tours in Malleshwaram, Bangalore | Thamco360',
    description: '360° virtual tours for Malleshwaram heritage stores, silk and saree shops, eateries, kalyana mantapas and clinics. Basic packages from ₹7,999.',
    dek: 'Malleshwaram carries old Bangalore’s charm — heritage stores, classic eateries and busy wedding halls. A 360° tour lets new customers experience that character before they visit.',
    cardText: 'Heritage stores, eateries and kalyana mantapas.',
    image: { ...IMG.banquet, caption: 'Representative image — wedding halls and event venues.' },
    sections: [
      { id: 'why-malleshwaram', h2: 'Why virtual tours work in Malleshwaram', html: `
<p>Along Sampige Road and the 8th Cross market, many Malleshwaram businesses have served families for generations. Their next customers, though, are searching on Google — and often from other parts of the city.</p>
<p>A 360° tour shows the character that makes these places special: a silk store’s shelves, a classic eatery’s hall, a kalyana mantapa’s stage and dining area.</p>` },
      { id: 'shoot-malleshwaram', h2: 'Wedding halls and busy markets', html: `
<p>Kalyana mantapas are best captured empty between bookings, with an optional decorated capture during an event setup. Market-street stores are shot before opening, when the shelves are full and the aisles are clear.</p>` },
    ],
    businesses: [
      { label: 'Kalyana mantapas and event halls', guide: G.venues },
      { label: 'Silk, saree and traditional stores', guide: G.retail },
      { label: 'Classic eateries and restaurants', guide: G.restaurants },
      { label: 'Clinics', guide: G.health },
    ],
    faqs: [
      { q: 'Can you shoot a kalyana mantapa in Malleshwaram between bookings?', a: 'Yes. Halls are usually captured empty between bookings, and a decorated capture can be added during an event setup with the organiser’s permission, before guests arrive.' },
      { q: 'Will a tour help families outside Bangalore choose our hall?', a: 'Yes. Relatives in other cities or abroad can walk through the hall, stage and dining area from their phones and join the decision without travelling.' },
    ],
    nearby: ['hebbal', 'mg-road-brigade-road', 'yelahanka'],
    guides: [G.venues, G.restaurants, G.retail],
  },
  {
    slug: 'mg-road-brigade-road',
    name: 'MG Road & Brigade Road',
    zone: 'Central Bangalore',
    title: '360° Virtual Tours on MG Road & Brigade Road | Thamco360',
    description: '360° virtual tours for retail stores, pubs, restaurants, hotels and offices around MG Road, Brigade Road and Church Street. From ₹7,999.',
    dek: 'Central Bangalore is where the city shops, dines and does business. Around MG Road, Brigade Road and Church Street, a 360° tour helps your space stand out in a crowded search.',
    cardText: 'Retail, pubs, restaurants, hotels and offices.',
    image: { ...IMG.restaurant, caption: 'Representative image — central Bangalore’s restaurants, pubs and bars.' },
    sections: [
      { id: 'why-central', h2: 'Why virtual tours work in central Bangalore', html: `
<p>MG Road, Brigade Road, Church Street and the streets around UB City draw shoppers, visitors and office workers from across the city. With so many stores, pubs and restaurants side by side, people rely on Google Maps to decide where to go.</p>
<p>A 360° tour lets them see the store floor, the bar or the dining room before they arrive — and helps visitors find an entrance tucked into a busy street or up a flight of stairs.</p>` },
      { id: 'shoot-central', h2: 'Capturing high-footfall spaces', html: `
<p>Central locations are busiest in the evenings and at weekends, so capture happens early in the day with displays set and lights on. Hotels and offices are planned around guests and working hours.</p>` },
    ],
    businesses: [
      { label: 'Retail stores and showrooms', guide: G.retail },
      { label: 'Pubs, bars and restaurants', guide: G.restaurants },
      { label: 'Hotels', guide: G.resorts },
      { label: 'Offices and co-working spaces', guide: G.cowork },
    ],
    faqs: [
      { q: 'Can a tour help customers find a first-floor store or pub on Brigade Road?', a: 'Yes. Panoramas of the approach and entrance can be included, so visitors recognise the building and the right staircase or lift when they arrive.' },
      { q: 'When do you shoot a busy pub or store in central Bangalore?', a: 'Early in the day, before opening, with the space set up as it is for customers. That gives a clear, accurate tour with no crowds in frame.' },
    ],
    nearby: ['indiranagar', 'koramangala', 'malleshwaram'],
    guides: [G.restaurants, G.retail, G.resorts],
  },
  {
    slug: 'electronic-city',
    name: 'Electronic City',
    zone: 'South Bangalore',
    title: '360° Virtual Tours in Electronic City, Bangalore | Thamco360',
    description: '360° virtual tours for Electronic City tech campuses, offices, hotels, serviced apartments, PGs and colleges. Basic packages from ₹7,999.',
    dek: 'Electronic City is one of Bangalore’s biggest technology hubs. A 360° tour helps offices, hotels, colleges and accommodation providers reach people moving here for work or study.',
    cardText: 'Tech campuses, hotels, PGs and colleges.',
    image: { ...IMG.suite, caption: 'Representative image — hotel rooms and serviced apartments.' },
    sections: [
      { id: 'why-electronic-city', h2: 'Why virtual tours work in Electronic City', html: `
<p>Home to large technology campuses and a steady stream of new joiners, Electronic City has constant demand for office space, hotels, serviced apartments, PG accommodation and colleges. Many of the people choosing are still in another city.</p>
<p>A 360° tour lets them compare rooms, facilities and workspaces remotely, so enquiries come from people who have already seen what they are getting.</p>` },
      { id: 'shoot-electronic-city', h2: 'Accommodation and campus shoots', html: `
<p>Serviced apartments and PGs are captured room type by room type, along with shared areas such as dining and laundry. Office floors and college campuses are planned around working hours and holidays.</p>` },
    ],
    businesses: [
      { label: 'Offices and tech campuses', guide: G.cowork },
      { label: 'Hotels, serviced apartments and PGs', guide: G.resorts },
      { label: 'Colleges and training institutes', guide: G.schools },
      { label: 'Apartment projects', guide: G.realEstate },
    ],
    faqs: [
      { q: 'Can you create a tour for a PG or serviced apartment in Electronic City?', a: 'Yes. Each room type is captured along with shared spaces such as dining, laundry and common areas, so tenants and new joiners can compare options before they move.' },
      { q: 'Can colleges in Electronic City use tours for admissions?', a: 'Yes. Classrooms, labs, libraries, hostels and sports facilities can be captured on holidays or after hours and embedded on the admissions page of the college website.' },
    ],
    nearby: ['hsr-layout', 'bannerghatta-road', 'sarjapur-road'],
    guides: [G.cowork, G.schools, G.resorts],
  },
  {
    slug: 'hebbal',
    name: 'Hebbal',
    zone: 'North Bangalore',
    title: '360° Virtual Tours in Hebbal, Bangalore | Thamco360',
    description: '360° virtual tours for Hebbal offices, hotels, residential towers and restaurants on the airport side of Bangalore. Basic packages from ₹7,999.',
    dek: 'On the road between the city and the airport, Hebbal has grown into a hub of tech parks, hotels and high-rise homes. A 360° tour meets visitors and buyers where they are searching.',
    cardText: 'Tech parks, hotels, towers and restaurants.',
    image: { ...IMG.poolTerrace, caption: 'Representative image — business hotels and their amenities.' },
    sections: [
      { id: 'why-hebbal', h2: 'Why virtual tours work in Hebbal', html: `
<p>With Manyata Tech Park, business hotels and new residential towers close to Bellary Road, Hebbal serves travellers, professionals and home buyers who value their time. Few of them want to make a trip just to check whether a space is right.</p>
<p>A 360° tour answers that question from a phone — for a hotel room, an office floor or an apartment with a view.</p>` },
      { id: 'shoot-hebbal', h2: 'Views, towers and business hotels', html: `
<p>Residential towers and hotels are captured on clear days, so windows and balconies show the real view outside. Office floors are captured early or at weekends.</p>` },
    ],
    businesses: [
      { label: 'Hotels and business stays', guide: G.resorts },
      { label: 'Offices and tech parks', guide: G.cowork },
      { label: 'Residential towers and apartments', guide: G.realEstate },
      { label: 'Restaurants and cafés', guide: G.restaurants },
    ],
    faqs: [
      { q: 'Can the tour show the view from a Hebbal apartment or hotel room?', a: 'Yes. Balconies and windows are captured on clear days with the exposure balanced by hand, so the view outside is visible rather than washed out.' },
      { q: 'Do you cover areas further north, towards the airport?', a: 'Yes. The crew travels across north Bangalore, including Yelahanka and properties towards Devanahalli, and travel is planned into the quote.' },
    ],
    nearby: ['yelahanka', 'malleshwaram', 'mg-road-brigade-road'],
    guides: [G.resorts, G.realEstate, G.cowork],
  },
  {
    slug: 'sarjapur-road',
    name: 'Sarjapur Road',
    zone: 'South-East Bangalore',
    title: '360° Virtual Tours on Sarjapur Road, Bangalore | Thamco360',
    description: '360° virtual tours for Sarjapur Road apartment projects, villas, international schools, clubhouses and co-working spaces. From ₹7,999.',
    dek: 'Sarjapur Road is one of Bangalore’s fastest-growing residential corridors. A 360° tour helps builders, schools and communities show families exactly what they are choosing.',
    cardText: 'Apartment projects, villas, schools and clubhouses.',
    image: { ...IMG.villa, caption: 'Representative image — villas and residential communities.' },
    sections: [
      { id: 'why-sarjapur', h2: 'Why virtual tours work on Sarjapur Road', html: `
<p>New apartment projects, villa communities and international schools line the Sarjapur Road corridor, and many of the families considering them are relocating from other cities or from abroad. They shortlist online and visit only a few.</p>
<p>A 360° tour of a show flat, a villa or a school campus lets them walk through first and share the link with family before deciding.</p>` },
      { id: 'shoot-sarjapur', h2: 'Show flats, amenities and campuses', html: `
<p>Show flats and villas are captured room by room, with clubhouses, pools and landscaped areas included. School campuses are captured on holidays or weekends so no students appear.</p>` },
    ],
    businesses: [
      { label: 'Apartment projects and villas', guide: G.realEstate },
      { label: 'International schools and preschools', guide: G.schools },
      { label: 'Clubhouses and community event spaces', guide: G.venues },
      { label: 'Co-working spaces and offices', guide: G.cowork },
    ],
    faqs: [
      { q: 'Can you capture the clubhouse and amenities of a Sarjapur Road project?', a: 'Yes. Clubhouses, pools, gyms, play areas and landscaped gardens can be captured alongside the show flat, so buyers see the whole community in one tour.' },
      { q: 'Are tours useful for NRI buyers looking at Sarjapur Road?', a: 'Yes. NRI buyers and relocating families can walk through a home from anywhere and share the tour with family before deciding whether to visit.' },
    ],
    nearby: ['hsr-layout', 'whitefield', 'electronic-city', 'koramangala'],
    guides: [G.realEstate, G.schools, G.cowork],
  },
  {
    slug: 'marathahalli',
    name: 'Marathahalli',
    zone: 'East Bangalore',
    title: '360° Virtual Tours in Marathahalli, Bangalore | Thamco360',
    description: '360° virtual tours for Marathahalli showrooms, retail stores, restaurants, PGs and offices along the Outer Ring Road. Basic packages from ₹7,999.',
    dek: 'Marathahalli sits on the Outer Ring Road, surrounded by tech parks, showrooms and busy retail streets. A 360° tour helps your business get noticed by the crowd passing every day.',
    cardText: 'Showrooms, retail, restaurants and PGs.',
    image: { ...IMG.showroom, caption: 'Representative image — vehicle and product showrooms.' },
    sections: [
      { id: 'why-marathahalli', h2: 'Why virtual tours work in Marathahalli', html: `
<p>Along the Outer Ring Road and around the Marathahalli bridge, car and bike showrooms, electronics and furniture stores, restaurants and PG accommodation all compete for the same busy crowd of professionals.</p>
<p>A 360° tour lets customers check a showroom’s range, a restaurant’s seating or a PG’s rooms before they brave the traffic to get there.</p>` },
      { id: 'shoot-marathahalli', h2: 'Showrooms and stores', html: `
<p>Showrooms and stores are captured before opening, with every section of the floor covered, so customers can plan a focused visit instead of a long browse.</p>` },
    ],
    businesses: [
      { label: 'Car, bike and furniture showrooms', guide: G.retail },
      { label: 'Restaurants and cafés', guide: G.restaurants },
      { label: 'PGs and serviced apartments', guide: G.resorts },
      { label: 'Offices and co-working spaces', guide: G.cowork },
    ],
    faqs: [
      { q: 'Can a Marathahalli showroom show its full range in a 360° tour?', a: 'Yes. Each section of the showroom floor is captured, so customers can look around the displays and decide what to see before they visit.' },
      { q: 'Is a tour worth it for a PG in Marathahalli?', a: 'Yes. Tenants, many of them relocating for work, can compare rooms and shared facilities from anywhere, which cuts down on wasted visits.' },
    ],
    nearby: ['whitefield', 'indiranagar', 'sarjapur-road', 'hsr-layout'],
    guides: [G.retail, G.restaurants, G.cowork],
  },
  {
    slug: 'yelahanka',
    name: 'Yelahanka',
    zone: 'North Bangalore',
    title: '360° Virtual Tours in Yelahanka, Bangalore | Thamco360',
    description: '360° virtual tours for Yelahanka resorts, event venues, villa projects and colleges in north Bangalore near the airport. From ₹7,999.',
    dek: 'North of the city and close to the airport, Yelahanka and its surroundings are home to resorts, event venues, villa communities and colleges. A 360° tour brings them within a click.',
    cardText: 'Resorts, event venues, villas and colleges.',
    image: { ...IMG.resort, caption: 'Representative image — resorts and weekend getaways.' },
    sections: [
      { id: 'why-yelahanka', h2: 'Why virtual tours work in Yelahanka', html: `
<p>Yelahanka and the stretch towards Devanahalli attract weekend travellers, wedding families, corporate offsite planners and home buyers — almost all of them coming from elsewhere in Bangalore or beyond. None of them wants a long drive just to see whether a place is right.</p>
<p>A 360° tour of a resort’s rooms and lawns, a venue’s hall or a villa’s interiors helps them shortlist confidently from home.</p>` },
      { id: 'shoot-yelahanka', h2: 'Large properties and outdoor spaces', html: `
<p>Resorts and venues are captured around bookings and occupancy, often over a full day for larger properties. Outdoor lawns and pools are shot when the light is at its best.</p>` },
    ],
    businesses: [
      { label: 'Resorts and farm stays', guide: G.resorts },
      { label: 'Wedding and event venues', guide: G.venues },
      { label: 'Villa and plotted projects', guide: G.realEstate },
      { label: 'Colleges', guide: G.schools },
    ],
    faqs: [
      { q: 'Can you shoot a large resort near Yelahanka in one day?', a: 'A boutique property is usually covered in a day. Larger resorts with many villas and outdoor areas can take one to two days, scheduled around guest occupancy.' },
      { q: 'Do you travel to venues beyond Yelahanka, towards Devanahalli?', a: 'Yes. The crew travels to properties across north Bangalore and around the airport, and travel is planned into the quote.' },
    ],
    nearby: ['hebbal', 'malleshwaram'],
    guides: [G.resorts, G.venues, G.realEstate],
  },
  {
    slug: 'bannerghatta-road',
    name: 'Bannerghatta Road',
    zone: 'South Bangalore',
    title: '360° Virtual Tours, Bannerghatta Road | Thamco360',
    description: '360° virtual tours for Bannerghatta Road hospitals, apartment projects, malls, schools and restaurants in south Bangalore. From ₹7,999.',
    dek: 'Bannerghatta Road runs from the city’s hospital belt out towards green, open south Bangalore. A 360° tour helps hospitals, homes, schools and stores welcome people before they arrive.',
    cardText: 'Hospitals, apartments, schools and malls.',
    image: { ...IMG.house, caption: 'Representative image — homes and residential communities.' },
    sections: [
      { id: 'why-bannerghatta', h2: 'Why virtual tours work on Bannerghatta Road', html: `
<p>Large multi-speciality hospitals, apartment communities, schools and shopping centres make Bannerghatta Road one of south Bangalore’s busiest corridors. Patients often travel from other cities, and families moving in compare several options at once.</p>
<p>A 360° tour of a hospital’s entrance and departments, an apartment or a school campus helps them understand the space and find their way before the visit.</p>` },
      { id: 'shoot-bannerghatta', h2: 'Hospitals and large campuses', html: `
<p>Hospital shoots are planned department by department in cleared areas with no patients in frame, and panoramas of entrances and parking help visitors navigate large campuses.</p>` },
    ],
    businesses: [
      { label: 'Hospitals and diagnostic centres', guide: G.health },
      { label: 'Apartment communities', guide: G.realEstate },
      { label: 'Schools', guide: G.schools },
      { label: 'Malls, stores and restaurants', guide: G.restaurants },
    ],
    faqs: [
      { q: 'Can a tour help patients find their way around a large hospital on Bannerghatta Road?', a: 'Yes. Panoramas of the main entrance, departments and parking can be included and linked from your website, so patients and families can orient themselves before arriving.' },
      { q: 'Do you shoot apartment communities on Bannerghatta Road?', a: 'Yes. Show flats, rentals and shared amenities such as clubhouses and play areas can be captured and embedded on your project or listing pages.' },
    ],
    nearby: ['jp-nagar', 'jayanagar', 'electronic-city'],
    guides: [G.health, G.realEstate, G.schools],
  },
];
