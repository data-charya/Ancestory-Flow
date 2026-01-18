// Demo data for testing the application
// Extended family tree with various relationships

export const DEMO_MEMBERS = [
  // Generation 4 - Great Great Grandparents
  { 
    name: 'Henry Williams', 
    relation: 'Great Great Grandfather', 
    generation: 4, 
    imageUrl: 'https://i.pravatar.cc/150?img=60' 
  },
  { 
    name: 'Florence Williams', 
    relation: 'Great Great Grandmother', 
    generation: 4, 
    imageUrl: 'https://i.pravatar.cc/150?img=44' 
  },

  // Generation 3 - Great Grandparents
  { 
    name: 'William Johnson', 
    relation: 'Great Grandfather', 
    generation: 3, 
    imageUrl: 'https://i.pravatar.cc/150?img=70' 
  },
  { 
    name: 'Eleanor Johnson', 
    relation: 'Great Grandmother', 
    generation: 3, 
    imageUrl: 'https://i.pravatar.cc/150?img=47' 
  },
  { 
    name: 'Thomas Brown', 
    relation: 'Great Grandfather', 
    generation: 3, 
    imageUrl: 'https://i.pravatar.cc/150?img=52' 
  },
  { 
    name: 'Mary Brown', 
    relation: 'Great Grandmother', 
    generation: 3, 
    imageUrl: 'https://i.pravatar.cc/150?img=48' 
  },

  // Generation 2 - Grandparents
  { 
    name: 'Robert Smith', 
    relation: 'Grandfather', 
    generation: 2, 
    imageUrl: 'https://i.pravatar.cc/150?img=12' 
  },
  { 
    name: 'Margaret Smith', 
    relation: 'Grandmother', 
    generation: 2, 
    imageUrl: 'https://i.pravatar.cc/150?img=49' 
  },
  { 
    name: 'George Davis', 
    relation: 'Grandfather (Maternal)', 
    generation: 2, 
    imageUrl: 'https://i.pravatar.cc/150?img=53' 
  },
  { 
    name: 'Elizabeth Davis', 
    relation: 'Grandmother (Maternal)', 
    generation: 2, 
    imageUrl: 'https://i.pravatar.cc/150?img=32' 
  },

  // Generation 1 - Parents, Aunts, Uncles
  { 
    name: 'James Smith', 
    relation: 'Father', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=33' 
  },
  { 
    name: 'Sarah Smith', 
    relation: 'Mother', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=45' 
  },
  { 
    name: 'Richard Smith', 
    relation: 'Uncle', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=51' 
  },
  { 
    name: 'Patricia Smith', 
    relation: 'Aunt', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=25' 
  },
  { 
    name: 'David Wilson', 
    relation: 'Uncle (by marriage)', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=57' 
  },
  { 
    name: 'Linda Davis', 
    relation: 'Aunt (Maternal)', 
    generation: 1, 
    imageUrl: 'https://i.pravatar.cc/150?img=26' 
  },

  // Generation 0 - Self, Siblings, Cousins, Spouses
  { 
    name: 'Michael Smith', 
    relation: 'Self', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=68' 
  },
  { 
    name: 'Jennifer Smith', 
    relation: 'Wife', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=5' 
  },
  { 
    name: 'Emily Smith', 
    relation: 'Sister', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=9' 
  },
  { 
    name: 'Daniel Martinez', 
    relation: 'Brother-in-law', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=59' 
  },
  { 
    name: 'Christopher Smith', 
    relation: 'Brother', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=11' 
  },
  { 
    name: 'Amanda Lee', 
    relation: 'Sister-in-law', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=20' 
  },
  { 
    name: 'Matthew Smith', 
    relation: 'Cousin', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=14' 
  },
  { 
    name: 'Jessica Wilson', 
    relation: 'Cousin', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=23' 
  },

  // Generation -1 - Children, Nieces, Nephews
  { 
    name: 'Sophia Smith', 
    relation: 'Daughter', 
    generation: -1, 
    imageUrl: 'https://i.pravatar.cc/150?img=38' 
  },
  { 
    name: 'Ethan Smith', 
    relation: 'Son', 
    generation: -1, 
    imageUrl: 'https://i.pravatar.cc/150?img=59' 
  },
  { 
    name: 'Olivia Martinez', 
    relation: 'Niece', 
    generation: -1, 
    imageUrl: 'https://i.pravatar.cc/150?img=35' 
  },
  { 
    name: 'Noah Martinez', 
    relation: 'Nephew', 
    generation: -1, 
    imageUrl: 'https://i.pravatar.cc/150?img=56' 
  },
  { 
    name: 'Emma Smith', 
    relation: 'Niece', 
    generation: -1, 
    imageUrl: 'https://i.pravatar.cc/150?img=36' 
  },

  // Generation -2 - Grandchildren
  { 
    name: 'Ava Johnson', 
    relation: 'Granddaughter', 
    generation: -2, 
    imageUrl: 'https://i.pravatar.cc/150?img=37' 
  },
  { 
    name: 'Liam Johnson', 
    relation: 'Grandson', 
    generation: -2, 
    imageUrl: 'https://i.pravatar.cc/150?img=58' 
  },
];

// Define parent-child relationships by name
// Format: 'Child Name': ['Parent1 Name', 'Parent2 Name']
export const DEMO_RELATIONSHIPS = {
  // Great Grandparents from Great Great Grandparents
  'William Johnson': ['Henry Williams', 'Florence Williams'],
  
  // Grandparents from Great Grandparents  
  'Robert Smith': ['William Johnson', 'Eleanor Johnson'],
  'Margaret Smith': ['Thomas Brown', 'Mary Brown'],
  
  // Parents/Aunts/Uncles from Grandparents
  'James Smith': ['Robert Smith', 'Margaret Smith'],
  'Richard Smith': ['Robert Smith', 'Margaret Smith'],
  'Patricia Smith': ['Robert Smith', 'Margaret Smith'],
  'Sarah Smith': ['George Davis', 'Elizabeth Davis'],
  'Linda Davis': ['George Davis', 'Elizabeth Davis'],
  
  // Self/Siblings/Cousins from Parents
  'Michael Smith': ['James Smith', 'Sarah Smith'],
  'Emily Smith': ['James Smith', 'Sarah Smith'],
  'Christopher Smith': ['James Smith', 'Sarah Smith'],
  'Matthew Smith': ['Richard Smith', 'Patricia Smith'],
  'Jessica Wilson': ['David Wilson', 'Linda Davis'],
  
  // Children from Self/Siblings
  'Sophia Smith': ['Michael Smith', 'Jennifer Smith'],
  'Ethan Smith': ['Michael Smith', 'Jennifer Smith'],
  'Olivia Martinez': ['Emily Smith', 'Daniel Martinez'],
  'Noah Martinez': ['Emily Smith', 'Daniel Martinez'],
  'Emma Smith': ['Christopher Smith', 'Amanda Lee'],
  
  // Grandchildren
  'Ava Johnson': ['Sophia Smith'],
  'Liam Johnson': ['Sophia Smith'],
};

// Spouse pairs for visual reference (not used in linking, but could be)
export const SPOUSE_PAIRS = [
  ['Henry Williams', 'Florence Williams'],
  ['William Johnson', 'Eleanor Johnson'],
  ['Thomas Brown', 'Mary Brown'],
  ['Robert Smith', 'Margaret Smith'],
  ['George Davis', 'Elizabeth Davis'],
  ['James Smith', 'Sarah Smith'],
  ['Richard Smith', 'Patricia Smith'],
  ['David Wilson', 'Linda Davis'],
  ['Michael Smith', 'Jennifer Smith'],
  ['Emily Smith', 'Daniel Martinez'],
  ['Christopher Smith', 'Amanda Lee'],
];
