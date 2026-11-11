/** Client copy from GoTechnologies Website Content Revised v2.pdf, with the
 * 13 wording changes in Fashion Designers Title and Body New.pdf (13 October 2026).
 * Layout line breaks are normalized; long dashes replaced with commas at the owner's request. */
export const copy = {
  hero: {
    title: "Everything begins with Go.",
    subtitle: "Technology for journeys that matter.",
    body: "Go Technologies builds digital products that simplify travel and mobility, connecting people, services and experiences, starting with GoChauffeur.",
    signature: "Built in Sri Lanka. Designed for the world.",
  },
  about: {
    title: "Building technology around the way the world moves.",
    paragraphs: [
      "Go Technologies builds digital products around the way people move, travel and experience the world.",
      "We combine technology, thoughtful product design and an understanding of real-world conditions to make fragmented experiences easier to coordinate.",
      "We begin with travel and mobility through GoChauffeur, while building Go Technologies with room to grow beyond a single platform.",
    ],
    motto: "Built to Move. Made to Connect.",
  },
  product: {
    title: "Meet GoChauffeur.",
    body: "GoChauffeur is a digital booking platform connecting travellers with professional chauffeurs for private journeys across Sri Lanka, from airport transfers and day trips to flexible, multi-day travel experiences.",
    travellerTitle: "Your journey, thoughtfully handled.",
    travellerBody:
      "From airport transfers and point-to-point travel to day journeys and multi-day trips, GoChauffeur helps travellers plan private journeys with greater clarity.",
    chauffeurTitle: "Drive with GoChauffeur.",
    chauffeurBody:
      "Join a mobility platform designed to connect professional chauffeurs with travellers seeking private journeys across Sri Lanka.",
    journeysTitle: "What travellers can plan",
    journeys: [
      "Airport transfers",
      "Point-to-point travel",
      "Full-day chauffeur service",
      "Multi-day chauffeur journeys",
      "Flexible trip planning",
    ],
  },
  principles: {
    title: "Technology that feels human.",
    subtitle:
      "The best technology does not demand attention. It removes friction.",
    items: [
      {
        title: "Designed around people",
        body: "We start with real needs and real conditions, not features for their own sake.",
      },
      {
        title: "Built to connect",
        body: "We bring people, services and technology into one clearer experience.",
      },
      {
        title: "Made for movement",
        body: "We design technology for real-world journeys, making movement and coordination simpler beyond the screen.",
      },
      {
        title: "Ready for what is next",
        body: "We build with the ability to grow across products, categories and borders.",
      },
    ],
  },
  vision: {
    title: "Starting with mobility. Building what comes next.",
    subtitle:
      "GoChauffeur is our first product, not the limit of our ambition.",
    paragraphs: [
      "Go Technologies is working towards a connected ecosystem of digital products that simplify travel, mobility and everyday experiences, from discovering destinations to accessing services along the way.",
      "Our journey begins in Sri Lanka, where unique travel needs and real-world challenges offer opportunities to build practical, meaningful solutions.",
      "Our ambition is to take what we learn here and develop products that can serve people and businesses across borders.",
    ],
    signature: "Sri Lankan beginnings. Global possibilities.",
  },
  partnerships: {
    title: "Better journeys are built together.",
    body: "We believe meaningful innovation happens through collaboration. Go Technologies welcomes partnerships with businesses, service providers and technology innovators who share our vision of making travel and mobility more connected, accessible and seamless.",
    items: [
      {
        title: "Technology partners",
        body: "Collaborate on integrations and technologies that enhance our products and services.",
      },
      {
        title: "Travel and hospitality businesses",
        body: "Explore opportunities to connect travellers with accommodation, experiences and complementary travel services.",
      },
      {
        title: "Mobility partners",
        body: "Work with us to develop reliable, flexible and accessible chauffeur-led travel experiences.",
      },
      {
        title: "Strategic partners",
        body: "Explore opportunities to develop new products, enter markets and create lasting value together.",
      },
    ],
  },
  router: {
    title: "Where do you want to Go next?",
    items: [
      {
        title: "I'M TRAVELLING",
        body: "Discover private chauffeur-led journeys with GoChauffeur.",
        action: "EXPLORE",
        href: "#travellers",
      },
      {
        title: "I'M A CHAUFFEUR",
        body: "Explore opportunities to join the GoChauffeur platform.",
        action: "REGISTER",
        href: "#chauffeurs",
      },
      {
        title: "I WANT TO WORK WITH GO",
        body: "Explore partnership opportunities with Go Technologies.",
        action: "PARTNER",
        href: "#partnerships",
      },
    ],
  },
  closing: {
    title: "Everything begins with Go.",
    lines: [
      "One idea can become a product.",
      "One product can become an ecosystem.",
      "And one journey can lead somewhere completely new.",
    ],
    body: "We are starting in Sri Lanka. We are building for what comes next.",
    question: "Where does Go go next?",
  },
  actions: {
    explore: "EXPLORE GOCHAUFFEUR",
    discover: "DISCOVER GO TECHNOLOGIES",
    register: "REGISTER AS A CHAUFFEUR",
    partner: "PARTNER WITH GO",
    contact: "START A CONVERSATION",
  },
} as const;

// Until separate product destinations are confirmed, keep discovery within this
// corporate frontend. Enquiries use the existing corporate site's contact address.
export const destinations = {
  explore: "#journeys",
  register:
    "mailto:hello@gotechnologies.lk?subject=GoChauffeur%20chauffeur%20registration",
  partner:
    "mailto:hello@gotechnologies.lk?subject=Go%20Technologies%20partnership",
  contact: "mailto:hello@gotechnologies.lk",
};
