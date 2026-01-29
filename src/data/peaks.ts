export interface MountainPeak {
  id: string;
  name: string;
  elevation: number; // in meters
  latitude: number;
  longitude: number;
  dateCollected: string;
  country: string;
  range: string;
}

export const mockPeaks: MountainPeak[] = [
  {
    id: "1",
    name: "Mount Everest",
    elevation: 8849,
    latitude: 27.9881,
    longitude: 86.925,
    dateCollected: "2024-05-15",
    country: "Nepal/China",
    range: "Himalayas"
  },
  {
    id: "2",
    name: "K2",
    elevation: 8611,
    latitude: 35.8825,
    longitude: 76.5133,
    dateCollected: "2024-07-20",
    country: "Pakistan/China",
    range: "Karakoram"
  },
  {
    id: "3",
    name: "Denali",
    elevation: 6190,
    latitude: 63.069,
    longitude: -151.0063,
    dateCollected: "2024-06-10",
    country: "USA",
    range: "Alaska Range"
  },
  {
    id: "4",
    name: "Mont Blanc",
    elevation: 4808,
    latitude: 45.8326,
    longitude: 6.8652,
    dateCollected: "2024-08-05",
    country: "France/Italy",
    range: "Alps"
  },
  {
    id: "5",
    name: "Mount Kilimanjaro",
    elevation: 5895,
    latitude: -3.0674,
    longitude: 37.3556,
    dateCollected: "2024-09-12",
    country: "Tanzania",
    range: "Kilimanjaro"
  },
  {
    id: "6",
    name: "Mount Fuji",
    elevation: 3776,
    latitude: 35.3606,
    longitude: 138.7274,
    dateCollected: "2024-04-22",
    country: "Japan",
    range: "Japanese Alps"
  },
  {
    id: "7",
    name: "Matterhorn",
    elevation: 4478,
    latitude: 45.9763,
    longitude: 7.6586,
    dateCollected: "2024-07-30",
    country: "Switzerland/Italy",
    range: "Alps"
  },
  {
    id: "8",
    name: "Mount Rainier",
    elevation: 4392,
    latitude: 46.8523,
    longitude: -121.7603,
    dateCollected: "2024-08-18",
    country: "USA",
    range: "Cascade Range"
  }
];
