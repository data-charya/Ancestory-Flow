// Demo data for testing the application

export const DEMO_MEMBERS = [
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
    name: 'Michael Smith', 
    relation: 'Self', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=68' 
  },
  { 
    name: 'Emily Smith', 
    relation: 'Sister', 
    generation: 0, 
    imageUrl: 'https://i.pravatar.cc/150?img=5' 
  },
];

// Define parent-child relationships by name
export const DEMO_RELATIONSHIPS = {
  'Robert Smith': ['William Johnson', 'Eleanor Johnson'],
  'James Smith': ['Robert Smith', 'Margaret Smith'],
  'Michael Smith': ['James Smith', 'Sarah Smith'],
  'Emily Smith': ['James Smith', 'Sarah Smith'],
};

