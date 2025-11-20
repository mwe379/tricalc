export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface SwimState {
  distanceMeters: number;
  paceMinPer100m: number;
  paceSecPer100m: number;
}

export interface BikeState {
  distanceKm: number;
  speedKmh: number;
}

export interface RunState {
  distanceKm: number;
  paceMinPerKm: number;
  paceSecPerKm: number;
}

export interface TransitionState {
  t1Minutes: number;
  t1Seconds: number;
  t2Minutes: number;
  t2Seconds: number;
}

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'male' | 'female';
  isPro?: boolean;
}

export enum Tab {
  Swim = 'Swim',
  Bike = 'Bike',
  Run = 'Run',
  Total = 'Total',
  Settings = 'Settings'
}