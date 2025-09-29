export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  points: string[];
}

export interface Contact {
  label: string;
  phone?: string;
  email: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  postcode: string;
  notes: string;
}

export const servicesData: Service[] = [
  {
    id: "maintenance",
    name: "Machinery Maintenance",
    icon: "🔧",
    description: "Keep your equipment running at peak performance with our comprehensive maintenance services.",
    points: [
      "Scheduled services per Operator's Manual or dealer recommendations",
      "Minor to medium repairs, coordinate major repairs with dealer",
      "Goal: ensure your machine is ready when you need it"
    ]
  },
  {
    id: "consultancy",
    name: "Consultancy Services",
    icon: "📋",
    description: "Expert guidance for maintenance planning and machinery management.",
    points: [
      "Maintenance planning & documentation",
      "Inspect, assess, test & report on machinery condition",
      "Coordinate warranty repairs; field & remote support"
    ]
  },
  {
    id: "training",
    name: "Training & Development",
    icon: "🎓",
    description: "Empower your team with proper machinery operation and maintenance skills.",
    points: [
      "Develop & deliver tailored training programs",
      "Train staff in safe operation & daily maintenance",
      "Customized to your specific equipment and needs"
    ]
  }
];

export const contactsData = {
  office: {
    label: "Office (General Enquiries)",
    phone: "+61448620568",
    email: "admin@readytoruncq.com.au"
  },
  jed: {
    label: "Jed Orr — Managing Director",
    phone: "+61448620568",
    email: "jed@readytoruncq.com.au"
  },
  maggie: {
    label: "Maggie Orr — Administration",
    email: "maggie@readytoruncq.com.au"
  }
};

export const addressData: Address = {
  line1: "5 Rivoli Place",
  city: "Emerald",
  state: "Queensland",
  postcode: "4720",
  notes: "By appointment only"
};

export const heroData = {
  title: "Specialising in the Agricultural Industry",
  subtitle: "Supporting Central Highlands farmers so equipment is ready for planting, spraying and harvesting."
};

export interface Supplier {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
}

export const suppliersData: Supplier[] = [
  {
    id: "ag-leader",
    name: "Ag Leader",
    description: "Precision farming tools and technologies. Provides year-round tools to enhance efficiency and profitability, supported by local experts and dependable support.",
    logo: "",
    website: "https://www.agleader.com"
  },
  {
    id: "gps-solutions-mackay",
    name: "GPS Solutions Mackay (GSM)",
    description: "Partnership with Ready to Run Machinery Maintenance to supply Ag Leader Technologies and precision agriculture solutions.",
    logo: ""
  },
  {
    id: "homburg-holland",
    name: "Homburg Holland",
    description: "Developers of SmartSTEER (RTK implement steering kit) and SmartLEVEL (GPS leveling kit) for Ag Leader GPS displays.",
    logo: ""
  },
  {
    id: "arag",
    name: "Arag",
    description: "Established 1976. Recognized worldwide as a main reference in spraying accessories and precision farming components. Offers a comprehensive range of spraying accessories.",
    logo: ""
  },
  {
    id: "hi-tec-oils",
    name: "Hi-Tec Oils",
    description: "Australian owned, one of Australia's largest independent oil manufacturers. Oils for automotive, industrial, agricultural, transport, and heavy equipment applications.",
    logo: ""
  },
  {
    id: "hi-tec-batteries",
    name: "Hi-Tec Batteries",
    description: "Over 30 years in the industry. Batteries for all applications, from portable to industrial sizes.",
    logo: ""
  },
  {
    id: "dpchip",
    name: "DPCHIP",
    description: "Agricultural technology solutions and precision farming components.",
    logo: ""
  }
];

export const aboutData = {
  overview: "Ready to Run CQ was founded in 2011 as a family-owned business dedicated to supporting Central Queensland's agricultural industry, with a history of over 40 years of combined experience. We specialise in tractors, harvesters, cultivators, sprayers and precision agriculture - from self-steer systems to spatial management solutions.",
  team: [
    {
      id: "jed-orr",
      name: "Jed Orr",
      role: "Director, Service & Precision Agriculture",
      bio: "With extensive experience in agricultural machinery and precision farming technologies, Jed leads our team in delivering exceptional service and innovative solutions to Central Queensland farmers."
    }
  ]
};