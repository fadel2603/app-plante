export type Plant = {
  id: string;
  name: string;
  species: string;
  image: string;
  careStatus?: string;
  waterFrequency: string;
  lastWatered: string;
  health: 'good' | 'warning' | 'critical';
};

export type Task = {
  id: string;
  plantId: string;
  plantName: string;
  type: 'water' | 'observe' | 'fertilize' | 'repot';
  done: boolean;
  time?: string;
};

export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600',
    careStatus: 'Soin en cours',
    waterFrequency: 'Tous les 7 jours',
    lastWatered: 'Il y a 5 jours',
    health: 'warning',
  },
  {
    id: '2',
    name: 'Pothos',
    species: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=600',
    waterFrequency: 'Tous les 5 jours',
    lastWatered: 'Il y a 2 jours',
    health: 'good',
  },
  {
    id: '3',
    name: 'Ficus',
    species: 'Ficus lyrata',
    image: 'https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=600',
    waterFrequency: 'Tous les 10 jours',
    lastWatered: 'Il y a 1 jour',
    health: 'good',
  },
  {
    id: '4',
    name: 'Cactus',
    species: 'Cereus peruvianus',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600',
    careStatus: 'Soin en cours',
    waterFrequency: 'Tous les 14 jours',
    lastWatered: 'Il y a 12 jours',
    health: 'critical',
  },
];

export const TODAY_TASKS: Task[] = [
  { id: 't1', plantId: '1', plantName: 'Monstera', type: 'water', done: false, time: '08:00' },
  { id: 't2', plantId: '4', plantName: 'Cactus', type: 'water', done: false, time: '08:00' },
  { id: 't3', plantId: '2', plantName: 'Pothos', type: 'observe', done: true, time: '12:00' },
  { id: 't4', plantId: '3', plantName: 'Ficus', type: 'observe', done: false, time: '12:00' },
];
