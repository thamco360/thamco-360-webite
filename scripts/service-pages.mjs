// Content for /services/<slug>/. Rendered by scripts/build-blog.mjs.
//
// Same ground rules as the blog: no invented statistics or timelines. Prices,
// shoot times and turnaround are the figures the site already states; website
// and web 3D work is quoted per project because no figure exists for it.
// FAQ answers are plain text and render into both the page and FAQPage schema.

const U = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const GMB = '/blog/google-business-profile-360-virtual-tour-benefits/';

export const services = [
  // ───────────────────────────────────────────────────────────────────────
  {
    slug: '360-virtual-tours-bengaluru',
    navLabel: '360° Virtual Tours',
    cardText: 'On-site capture stitched into a walkable tour for Google and your website.',
    serviceName: '360° Virtual Tour',
    serviceType: 'Virtual tour production',
    priceFrom: 7999,
    title: '360° Virtual Tours in Bengaluru | Thamco360',
    description: 'Professional 360° virtual tours in Bengaluru: on-site capture, hand-refined stitching and a walkable tour on Google and your website. From ₹7,999.',
    kicker: 'Service · Bengaluru',
    h1Html: '360° Virtual Tours That Let Customers <span class="gradient-text">Step Inside</span>',
    dek: 'We capture your space on site, stitch every angle into a seamless sphere, and deliver a tour your customers can walk through from Google, your website or a WhatsApp link.',
    heroImage: '/assets/img/stitched-360-streamphony.webp',
    heroAlt: 'Stitched 360° panorama of Streamphony Live in Bengaluru, captured by Thamco360',
    pointsTitle: 'What a Thamco360 tour gives you',
    points: [
      { h3: 'A self-guided walkthrough', p: 'Visitors look in every direction and move between spots at their own pace, instead of scrolling past a few fixed photos.' },
      { h3: 'Live on Google', p: 'As a Google Trusted photography provider, we publish the tour to your Google Business Profile so it opens from Search and Maps.' },
      { h3: 'On your own website', p: 'The same tour embeds on your site, so interested visitors stay with you rather than leaving for a third-party link.' },
      { h3: 'Shareable anywhere', p: 'One link works on WhatsApp, email and social media — the fastest answer to “can you send more photos?”.' },
      { h3: 'Refined by hand', p: 'Exposure, vertical alignment and fine detail are corrected by hand after stitching, so the tour looks as good as the space.' },
      { h3: 'Quick turnaround', p: 'A crew within 48 hours of booking, most spaces under 5,000 sq ft captured in 2 to 4 hours, and publishing within 48 hours of capture.' },
    ],
    bandWords: ['Capture', 'Stitch', 'Experience'],
    pano: {
      src: '/assets/img/stitched-360-streamphony.webp',
      h2: 'Drag to look around a real Thamco360 capture',
      p: 'This is Streamphony Live in Bengaluru, stitched from our own on-site capture. Drag or swipe sideways to turn the room.',
      alt: 'Interactive 360-degree panorama of Streamphony Live, Bengaluru. Drag to look around.',
    },
    stepsTitle: 'From booking to a live tour',
    steps: [
      { h3: 'Book & plan', p: 'Share your space and timings on WhatsApp. We agree the areas to cover and a quiet time to shoot.' },
      { h3: 'Capture', p: 'A panoramic head sweeps every angle of each spot. Most spaces under 5,000 sq ft take a single 2-to-4 hour visit.' },
      { h3: 'Stitch & refine', p: 'Overlapping frames become one seamless sphere, then exposure and verticals are corrected by hand.' },
      { h3: 'Publish', p: 'The tour goes live on your Google Business Profile and is ready to embed on your website.' },
    ],
    galleryTitle: 'Spaces we bring online',
    gallery: [
      { src: U('photo-1616594039964-ae9021a400a0', 1000), alt: 'Representative photo of a luxury hotel-style bedroom', caption: 'Representative image — hotels, homes and service apartments.' },
      { src: U('photo-1519167758481-83f550bb49b3', 1000), alt: 'Representative photo of a banquet hall with round tables and chandeliers', caption: 'Representative image — banquet halls and event venues.' },
      { src: U('photo-1517248135467-4c7edcad34c4', 1000), alt: 'Representative photo of a modern restaurant interior with set tables', caption: 'Representative image — restaurants, cafés and pubs.' },
    ],
    sections: [
      {
        id: 'what-is-a-tour',
        h2: 'What is a 360° virtual tour?',
        html: `
<p>A 360° virtual tour is a walkthrough built from high-resolution panoramic photography. At each spot in your space, the camera captures every direction at once. Those captures come off the camera as circular fisheye frames; stitching joins them into a single seamless sphere, and a viewer lets a visitor look around inside it and step to the next spot.</p>
<p>You can see the difference between a raw capture and a stitched panorama in the comparison slider on our <a href="/#process">homepage</a>, and explore live tours we have published in our <a href="/#portfolio">portfolio</a>.</p>`,
      },
      {
        id: 'who-its-for',
        h2: 'Who it is for',
        html: `
<p>Any business whose space helps customers decide. We have written detailed guides for <a href="/blog/360-virtual-tour-resorts-hotels-bangalore/">resorts and hotels</a>, <a href="/blog/virtual-tour-coworking-office-spaces-bangalore/">co-working spaces</a>, <a href="/blog/360-virtual-tour-restaurants-cafes-bangalore/">restaurants and cafés</a>, <a href="/blog/virtual-tour-hospitals-dental-clinics-bangalore/">clinics and hospitals</a>, <a href="/blog/360-virtual-tour-real-estate-bangalore/">real estate</a>, <a href="/blog/virtual-tour-schools-colleges-bangalore/">schools and colleges</a>, <a href="/blog/360-virtual-tour-wedding-event-venues-bangalore/">wedding venues</a> and <a href="/blog/virtual-tour-gyms-salons-showrooms-bangalore/">gyms, salons and showrooms</a>.</p>`,
      },
      {
        id: 'pricing',
        h2: 'Pricing',
        html: `
<p>Basic Thamco360 virtual tour packages start from just <strong>₹7,999</strong>. The final price depends on the size of the space, the number of scan points needed, and whether you want extras such as a website embed or custom 3D features. Send us your space details on WhatsApp for an exact quote.</p>`,
      },
    ],
    faqs: [
      { q: 'How much does a 360° virtual tour cost in Bengaluru?', a: 'Basic Thamco360 packages start from just ₹7,999, and the final price depends on the size of the space, the number of scan points and any extras such as a website embed or custom 3D features.' },
      { q: 'How long does a virtual tour shoot take?', a: 'Most spaces under 5,000 sq ft are captured in a single 2-to-4 hour visit. Larger properties are planned area by area and can take longer.' },
      { q: 'How soon will my tour be live?', a: 'Thamco360 deploys a crew within 48 hours of booking and typically publishes the finished tour within 48 hours of capture.' },
      { q: 'Where can customers see the tour?', a: 'On your Google Business Profile in Google Search and Maps, embedded on your website, and anywhere you share the link, such as WhatsApp or social media.' },
      { q: 'Do I need to close my business for the shoot?', a: 'No. Shoots are scheduled before opening, after closing or during a quiet window so daily operations continue as normal.' },
    ],
    cta: { title: 'Ready to let customers step inside?', text: 'Share your space size and location — we will confirm timing and a price.', wa: 'Hi Thamco360! I would like to book a 360° virtual tour.', button: 'Book a 360° shoot' },
    relatedPosts: ['google-business-profile-360-virtual-tour-benefits', '360-virtual-tour-resorts-hotels-bangalore', 'virtual-tour-coworking-office-spaces-bangalore'],
  },

  // ───────────────────────────────────────────────────────────────────────
  {
    slug: 'google-street-view-photography-bengaluru',
    navLabel: 'Google Street View Photography',
    cardText: 'Publish 360° imagery of your premises to your Google Business Profile.',
    serviceName: 'Google Trusted Photography',
    serviceType: '360° photography for Google Business Profile',
    priceFrom: 7999,
    title: 'Google Street View Photography in Bengaluru | Thamco360',
    description: 'Google Trusted 360° photography in Bengaluru: we capture your premises and publish a walk-in view to your Google Business Profile for Maps and Search.',
    kicker: 'Google Business Profile · Bengaluru',
    h1Html: 'Google Street View Photography for Your <span class="gradient-text">Business Profile</span>',
    dek: 'Customers find you on Google Maps before they find your door. We capture your premises in 360° and publish it to your Google Business Profile so they can walk in first.',
    heroImage: U('photo-1517248135467-4c7edcad34c4'),
    heroAlt: 'Representative photo of a modern restaurant interior with set tables',
    pointsTitle: 'What changes on your Google listing',
    points: [
      { h3: 'Seen on Maps and Search', p: 'Your 360° imagery sits on your Google Business Profile, alongside your reviews, hours and photos.' },
      { h3: 'A walk-in view', p: 'Customers look around inside your premises instead of guessing from a few photos.' },
      { h3: 'The entrance, found', p: 'Panoramas of the approach help people recognise a first-floor or lane-side business when they arrive.' },
      { h3: 'A more complete profile', p: 'Google recommends complete, accurate profiles with photos. A tour is one of the richest ways to fill that in.' },
      { h3: 'Professional capture', p: 'Hand-refined stitching and exposure, not a phone panorama — the difference shows in a crowded Maps result.' },
      { h3: 'Reusable everywhere', p: 'The same tour embeds on your website and shares as a link on WhatsApp and social media.' },
    ],
    bandWords: ['Search', 'Maps', 'Walk in'],
    stepsTitle: 'How we publish to Google',
    steps: [
      { h3: 'Check your profile', p: 'We confirm your Google Business Profile is verified and that the tour can be linked to it.' },
      { h3: 'Capture', p: 'Our crew captures the entrance and every key area, usually before opening or after closing.' },
      { h3: 'Stitch & refine', p: 'Panoramas are stitched and corrected by hand for exposure and vertical alignment.' },
      { h3: 'Publish to Google', p: 'The finished tour goes live on your profile, typically within 48 hours of capture.' },
    ],
    galleryTitle: 'Businesses that benefit most',
    gallery: [
      { src: U('photo-1519494026892-80bbd2d6fd0d', 1000), alt: 'Representative photo of a hospital reception desk', caption: 'Representative image — clinics and hospitals.' },
      { src: U('photo-1560066984-138dadb4c035', 1000), alt: 'Representative photo of a salon with styling chairs and mirrors', caption: 'Representative image — salons and spas.' },
      { src: U('photo-1534438327276-14e5300c3a48', 1000), alt: 'Representative photo of a gym with dumbbell racks', caption: 'Representative image — gyms and fitness studios.' },
    ],
    sections: [
      {
        id: 'what-customers-see',
        h2: 'What customers see',
        html: `
<p>When someone opens your listing on Google Maps or Search, your 360° imagery appears with your other photos. Opening it lets them look around your premises and move between the spots we captured — the same kind of experience as Street View on a road, but inside your business.</p>
<p>See real examples: our <a href="/#portfolio">portfolio</a> embeds live Google-hosted tours Thamco360 has published in Bengaluru.</p>`,
      },
      {
        id: 'ranking',
        h2: 'Will it improve my Google ranking?',
        html: `
<p>We will be straight with you: Google does not publish a ranking boost for 360° imagery, and nobody can promise one. What a tour reliably does is make your profile more complete and more convincing, which helps customers choose you once they find you. For the full picture, read our guide on <a href="${GMB}">how a Google Business Profile tour helps Bangalore businesses</a>.</p>`,
      },
      {
        id: 'pricing',
        h2: 'Pricing',
        html: `
<p>Basic Google Business Profile tours start from just <strong>₹7,999</strong>; the final price depends on the size of your premises and the number of areas covered.</p>`,
      },
    ],
    faqs: [
      { q: 'What is Google Street View photography for businesses?', a: 'It is 360° photography of the inside of your premises, published to your Google Business Profile so customers can look around your business from Google Maps and Search.' },
      { q: 'Does my Google Business Profile need to be verified?', a: 'Yes. The imagery is linked to your business listing, so the profile should be verified. Thamco360 checks this with you before the shoot.' },
      { q: 'Will 360° photos increase my Google Maps ranking?', a: 'Google does not publish a direct ranking boost for 360° imagery. The benefit is a more complete, more engaging profile that helps customers choose your business once they find it.' },
      { q: 'How long until the tour appears on Google?', a: 'Thamco360 typically publishes the finished tour to your Google Business Profile within 48 hours of capture.' },
      { q: 'How much does Google 360° photography cost in Bengaluru?', a: 'Basic Thamco360 packages start from just ₹7,999, and the final price depends on the size of the premises and the number of areas covered.' },
    ],
    cta: { title: 'Let customers walk in from Google Maps', text: 'Send your business name and area — we will check your profile and quote.', wa: 'Hi Thamco360! I would like Google Street View photography for my business.', button: 'Get on Google in 360°' },
    relatedPosts: ['google-business-profile-360-virtual-tour-benefits', '360-virtual-tour-restaurants-cafes-bangalore', 'virtual-tour-gyms-salons-showrooms-bangalore'],
  },

  // ───────────────────────────────────────────────────────────────────────
  {
    slug: '3d-websites-web-walkthroughs-bengaluru',
    navLabel: 'Websites & Web 3D',
    cardText: 'A fast website built around your tour, with immersive 3D in the browser.',
    serviceName: 'Website & Web 3D Development',
    serviceType: 'Web development',
    title: 'Websites & Web 3D Walkthroughs in Bengaluru | Thamco360',
    description: 'Custom websites built around your 360° virtual tour, plus immersive browser-based 3D experiences — fast, mobile-first and search-ready. Thamco360, Bengaluru.',
    kicker: 'Web development · Bengaluru',
    h1Html: 'Websites and Web 3D Walkthroughs Built Around <span class="gradient-text">Your Space</span>',
    dek: 'A tour is most powerful on your own domain. We build fast, modern websites around your virtual tour, with immersive 3D and motion that make visitors stay.',
    heroImage: U('photo-1600585154340-be6161a56a0c'),
    heroAlt: 'Representative photo of a modern two-storey house exterior at dusk',
    pointsTitle: 'What we build',
    points: [
      { h3: 'Your tour, on your domain', p: 'The virtual tour is embedded in your own site, so visitors explore and enquire without leaving you.' },
      { h3: 'Immersive web 3D', p: 'Interactive, in-browser 3D and drag-to-look panoramas — no app or plugin for the visitor to install.' },
      { h3: 'Scroll-driven motion', p: 'Considered animation and 3D text effects, like the ones on this page, that guide attention instead of distracting from it.' },
      { h3: 'Mobile-first and fast', p: 'Built for phones first, with off-screen 3D paused so pages stay light on real devices.' },
      { h3: 'Search-ready', p: 'Clean structure, schema markup and a sitemap, so search and AI answer engines understand your business.' },
      { h3: 'Enquiries that arrive', p: 'Contact forms that deliver straight to your inbox, plus WhatsApp buttons where your customers already are.' },
    ],
    bandWords: ['Design', 'Build', 'Immerse'],
    stepsTitle: 'How a website project runs',
    steps: [
      { h3: 'Discovery', p: 'We learn your business, customers and the enquiries you want the site to bring in.' },
      { h3: 'Design', p: 'Layout, look and motion are designed around your space and your tour.' },
      { h3: 'Build', p: 'The site is built, the tour and any 3D experiences integrated, and forms connected.' },
      { h3: 'Launch', p: 'We launch on your domain with search basics in place — schema, sitemap and page titles.' },
    ],
    galleryTitle: 'Made for spaces like these',
    gallery: [
      { src: U('photo-1512917774080-9991f1c4c750', 1000), alt: 'Representative photo of a white villa with a private pool', caption: 'Representative image — villas and real estate projects.' },
      { src: U('photo-1522708323590-d24dbb6b0267', 1000), alt: 'Representative photo of a bright furnished apartment with an open kitchen', caption: 'Representative image — service apartments and rentals.' },
      { src: U('photo-1518998053901-5348d3961a04', 1000), alt: 'Representative photo of an art gallery with white walls and framed works', caption: 'Representative image — galleries and showrooms.' },
    ],
    sections: [
      {
        id: 'why-own-site',
        h2: 'Why your tour belongs on your own website',
        html: `
<p>A tour on Google brings people to your listing. A tour on your own website keeps them with you: the booking button, the enquiry form and your WhatsApp number are one tap away, and nothing on the page is pointing them to a competitor.</p>
<p>We design the site around the tour rather than bolting it onto an existing page, so it is the centrepiece a visitor meets, not a link they have to find.</p>`,
      },
      {
        id: 'web-3d',
        h2: 'What “web 3D” means',
        html: `
<p>Web 3D is interactive 3D that runs directly in the browser. It can be a drag-to-look panorama like the one on our <a href="/services/360-virtual-tours-bengaluru/">360° virtual tours page</a>, a scroll-driven scene, or 3D motion in text and images. Done well, it makes a site memorable; done badly, it makes it slow — so we build it to pause when off screen and stay light on phones.</p>`,
      },
      {
        id: 'pricing',
        h2: 'Pricing',
        html: `
<p>Website and web 3D projects vary widely in scope, so they are quoted per project after a short discovery call. Tell us what you have in mind on WhatsApp and we will come back with a proposal.</p>`,
      },
    ],
    faqs: [
      { q: 'Can you build a website around my existing virtual tour?', a: 'Yes. Thamco360 can design and build a website with your tour as the centrepiece, whether the tour was captured by us or is already published.' },
      { q: 'What is web 3D development?', a: 'It is interactive 3D that runs directly in the browser, such as drag-to-look panoramas, scroll-driven scenes and 3D motion in text and images, with nothing for the visitor to install.' },
      { q: 'Will a 3D website be slow on phones?', a: 'It does not have to be. Thamco360 builds mobile-first and pauses 3D rendering when it is off screen, so pages stay light on real devices.' },
      { q: 'Do you handle SEO basics?', a: 'Yes. Sites launch with clean page titles and descriptions, schema markup and a sitemap so search engines can understand your business.' },
      { q: 'How much does a website with a virtual tour cost?', a: 'Website and web 3D projects are quoted per project based on scope. Share your requirements on WhatsApp and Thamco360 will send a proposal.' },
    ],
    cta: { title: 'Give your space a website to match', text: 'Tell us about your business and what you want the site to do.', wa: 'Hi Thamco360! I would like a website / web 3D experience built around my space.', button: 'Start a website project' },
    relatedPosts: ['360-virtual-tour-real-estate-bangalore', '360-virtual-tour-resorts-hotels-bangalore', 'google-business-profile-360-virtual-tour-benefits'],
  },
];
