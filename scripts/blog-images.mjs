// In-article images for each blog guide, placed after the named section.
// Every stock photo here was checked by eye so the alt text describes what is
// actually in the frame; stock images are always captioned "Representative
// image" so nothing implies Thamco360 captured them. The two .webp files are
// Thamco360's own capture of Streamphony Live, Bengaluru.

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const OWN_STITCHED = {
  src: '/assets/img/stitched-360-streamphony.webp',
  alt: 'Stitched 360° panorama of Streamphony Live in Bengaluru, captured by Thamco360',
};
const OWN_RAW = {
  src: '/assets/img/raw-capture-streamphony.webp',
  alt: 'Raw dual-fisheye 360° capture of Streamphony Live before stitching, by Thamco360',
};

const IMG = {
  suite: { src: U('photo-1616594039964-ae9021a400a0'), alt: 'Representative photo of a luxury hotel-style bedroom' },
  poolTerrace: { src: U('photo-1571896349842-33c89424de2d'), alt: 'Representative photo of a hotel pool terrace at dusk' },
  banquet: { src: U('photo-1519167758481-83f550bb49b3'), alt: 'Representative photo of a banquet hall with round tables and chandeliers' },
  restaurant: { src: U('photo-1517248135467-4c7edcad34c4'), alt: 'Representative photo of a modern restaurant interior with set tables' },
  reception: { src: U('photo-1519494026892-80bbd2d6fd0d'), alt: 'Representative photo of a hospital reception desk' },
  villa: { src: U('photo-1512917774080-9991f1c4c750'), alt: 'Representative photo of a white villa with a private pool' },
  apartment: { src: U('photo-1522708323590-d24dbb6b0267'), alt: 'Representative photo of a bright furnished apartment with an open kitchen' },
  salon: { src: U('photo-1560066984-138dadb4c035'), alt: 'Representative photo of a salon with styling chairs and mirrors' },
  showroom: { src: U('photo-1492144534655-ae79c964c9d7'), alt: 'Representative photo of sports cars displayed in a dark showroom' },
};

export const galleries = {
  'google-business-profile-360-virtual-tour-benefits': [
    { ...OWN_RAW, after: 'what-is-it', caption: 'Straight off the camera: two circular fisheye frames, before they are stitched into one seamless sphere.' },
    { ...IMG.restaurant, after: 'comparison', caption: 'Representative image — the kind of interior a Google Business Profile tour lets customers explore before they visit.' },
  ],
  '360-virtual-tour-resorts-hotels-bangalore': [
    { ...IMG.suite, after: 'what-to-capture', caption: 'Representative image — room categories are the single most-viewed part of a resort tour.' },
    { ...IMG.poolTerrace, after: 'where-it-works', caption: 'Representative image — pool and dining terraces are what weekend guests want to see at dusk.' },
    { ...IMG.banquet, after: 'offsites-weddings', caption: 'Representative image — banquet and conference halls help offsite and wedding planners shortlist remotely.' },
  ],
  'virtual-tour-coworking-office-spaces-bangalore': [
    { ...OWN_STITCHED, after: 'what-a-tour-shows', caption: 'A Thamco360 stitched panorama: every direction of a room in a single image, which a viewer turns into a walkable tour.' },
    { ...IMG.apartment, after: 'use-cases', caption: 'Representative image — furnished and managed spaces benefit from the same self-guided tour.' },
  ],
  '360-virtual-tour-restaurants-cafes-bangalore': [
    { ...IMG.banquet, after: 'groups-and-events', caption: 'Representative image — private dining and event seating are what party planners ask about first.' },
    { ...OWN_STITCHED, after: 'real-examples', caption: 'Streamphony Live, Bengaluru — stitched from Thamco360’s own on-site capture.' },
  ],
  'virtual-tour-hospitals-dental-clinics-bangalore': [
    { ...IMG.reception, after: 'what-to-show', caption: 'Representative image — reception and waiting areas are the first spaces a patient wants to see.' },
  ],
  '360-virtual-tour-real-estate-bangalore': [
    { ...IMG.suite, after: 'who-uses-it', caption: 'Representative image — bedrooms and their natural light are hard to judge from a floor plan.' },
    { ...IMG.villa, after: 'what-to-capture', caption: 'Representative image — outdoor areas, pools and views belong in a villa tour.' },
    { ...IMG.apartment, after: 'publishing', caption: 'Representative image — rentals and service apartments can be shown to tenants before a visit.' },
  ],
  'virtual-tour-schools-colleges-bangalore': [
    { ...OWN_STITCHED, after: 'admissions', caption: 'A Thamco360 stitched panorama — the raw material every campus tour is built from.' },
  ],
  '360-virtual-tour-wedding-event-venues-bangalore': [
    { ...IMG.villa, after: 'what-to-capture', caption: 'Representative image — open-air and poolside spaces used for receptions and sangeet.' },
    { ...IMG.poolTerrace, after: 'where-it-works', caption: 'Representative image — resort venues can show halls, lawns and rooms in one tour.' },
  ],
  'virtual-tour-gyms-salons-showrooms-bangalore': [
    { ...IMG.salon, after: 'salons-spas', caption: 'Representative image — styling stations and hygiene are what first-time salon clients look for.' },
    { ...IMG.showroom, after: 'showrooms', caption: 'Representative image — showroom tours let customers check the range before driving across the city.' },
  ],
};
