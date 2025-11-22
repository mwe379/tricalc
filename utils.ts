import { TimeComponents } from './types';

export const formatTime = (totalSeconds: number): string => {
    if (!isFinite(totalSeconds) || isNaN(totalSeconds)) return "0:00:00";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    const pad = (num: number) => num.toString().padStart(2, '0');
    // Format h:mm:ss (h is not padded if it's single digit, matching 0:15:00)
    return `${h}:${pad(m)}:${pad(s)}`;
};

export const formatSingleDigit = (num: number): string => {
    return num.toString().padStart(2, '0');
};

export const calculateSwimTime = (distanceMeters: number, paceMin: number, paceSec: number): number => {
    const paceInSeconds = (paceMin * 60) + paceSec;
    // Pace is per 100m
    const timeInSeconds = (distanceMeters / 100) * paceInSeconds;
    return timeInSeconds;
};

export const calculateBikeTime = (distanceKm: number, speedKmh: number): number => {
    if (speedKmh === 0) return 0;
    // Time = Distance / Speed (Hours) -> Convert to seconds
    return (distanceKm / speedKmh) * 3600;
};

export const calculateRunTime = (distanceKm: number, paceMin: number, paceSec: number): number => {
    const paceInSeconds = (paceMin * 60) + paceSec;
    // Pace is per Km
    return distanceKm * paceInSeconds;
};

export const toTimeComponents = (totalSeconds: number): TimeComponents => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return { hours: h, minutes: m, seconds: s };
};

export const calculateAgeGroup = (birthDateString: string): string => {
    if (!birthDateString) return '';

    const birthYear = new Date(birthDateString).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Triathlon AK logic: 5 year steps usually starting around 20. 
    const lowerBound = Math.floor(age / 5) * 5;
    const upperBound = lowerBound + 4;

    return `AK ${lowerBound}-${upperBound}`;
};

// --- BENCHMARK DATABASE AND LOGIC ---

type DistanceType = 'Sprint' | 'Olympisch' | '70.3' | '140.6' | null;
type Discipline = 'swim' | 'bike' | 'run';
type Gender = 'male' | 'female';

// Base times (in seconds) for an Average "Young" Male (Age 25-29)
// These are 50th percentile approximations for active triathletes
const BASE_TIMES: Record<string, Record<Discipline, number>> = {
    'Sprint': {
        swim: 15 * 60, // 750m @ 2:00/100m
        bike: 40 * 60, // 20km @ 30km/h
        run: 25 * 60   // 5km @ 5:00/km
    },
    'Olympisch': {
        swim: 30 * 60, // 1500m @ 2:00/100m
        bike: 80 * 60, // 40km @ 30km/h
        run: 52 * 60   // 10km @ 5:12/km
    },
    '70.3': {
        swim: 40 * 60, // 1.9km @ 2:06/100m
        bike: 3 * 3600 + 10 * 60, // 90km @ 28.5km/h
        run: 2 * 3600     // 21.1km @ 5:41/km
    },
    '140.6': {
        swim: 80 * 60, // 3.8km @ 2:06/100m
        bike: 6 * 3600 + 30 * 60, // 180km @ 27.7km/h
        run: 4 * 3600 + 15 * 60 // 42.2km @ 6:00/km
    }
};

const BASE_TRANSITIONS: Record<string, number> = {
    'Sprint': 3 * 60,
    'Olympisch': 5 * 60,
    '70.3': 8 * 60,
    '140.6': 12 * 60
};

const GENDER_FACTOR = {
    male: 1.0,
    female: 1.12 // Females generally 12% slower in mass stats (varies by discipline but using global avg)
};

// Age Factors (Multiplier on time) relative to 25-29
const getAgeFactor = (age: number): number => {
    if (age < 25) return 1.02; // Juniors
    if (age <= 29) return 1.0; // Peak
    if (age <= 34) return 1.01;
    if (age <= 39) return 1.03;
    if (age <= 44) return 1.06;
    if (age <= 49) return 1.10;
    if (age <= 54) return 1.16;
    if (age <= 59) return 1.24;
    if (age <= 64) return 1.35;
    return 1.50; // 65+
};

export const identifyDistance = (
    discipline: Discipline,
    value: number // meters for swim, km for bike/run
): DistanceType => {
    // Fuzzy matching with tolerance
    if (discipline === 'swim') {
        if (Math.abs(value - 750) < 100) return 'Sprint';
        if (Math.abs(value - 1500) < 200) return 'Olympisch';
        if (Math.abs(value - 1900) < 200) return '70.3';
        if (Math.abs(value - 3800) < 300) return '140.6';
    } else if (discipline === 'bike') {
        if (Math.abs(value - 20) < 5) return 'Sprint';
        if (Math.abs(value - 40) < 5) return 'Olympisch';
        if (Math.abs(value - 90) < 5) return '70.3';
        if (Math.abs(value - 180) < 5) return '140.6';
    } else { // run
        if (Math.abs(value - 5) < 1) return 'Sprint';
        if (Math.abs(value - 10) < 1) return 'Olympisch';
        if (Math.abs(value - 21.1) < 2) return '70.3';
        if (Math.abs(value - 42.2) < 2) return '140.6';
    }
    return null;
};

export const identifyRaceType = (swimMeters: number, bikeKm: number, runKm: number): DistanceType => {
    // Check against Sprint (750m, 20km, 5km)
    if (Math.abs(swimMeters - 750) < 250 && Math.abs(bikeKm - 20) < 5 && Math.abs(runKm - 5) < 1.5) return 'Sprint';
    // Check against Olympic (1.5k, 40k, 10k)
    if (Math.abs(swimMeters - 1500) < 400 && Math.abs(bikeKm - 40) < 5 && Math.abs(runKm - 10) < 2) return 'Olympisch';
    // Check against 70.3 (1.9k, 90k, 21.1k)
    if (Math.abs(swimMeters - 1900) < 400 && Math.abs(bikeKm - 90) < 5 && Math.abs(runKm - 21.1) < 2) return '70.3';
    // Check against 140.6 (3.8k, 180k, 42.2k)
    if (Math.abs(swimMeters - 3800) < 600 && Math.abs(bikeKm - 180) < 10 && Math.abs(runKm - 42.2) < 4) return '140.6';

    return null;
};

const calculatePercentileFromStats = (
    seconds: number,
    expectedAverageSeconds: number
): number => {
    // Standard Deviation approximation (roughly 15% of time for mass field)
    const stdDev = expectedAverageSeconds * 0.15;

    // Z-Score: How many SDs away from mean?
    const zScore = (seconds - expectedAverageSeconds) / stdDev;

    // Approximation of Error Function (CDF of Normal Distribution)
    const cdf = (z: number) => {
        return 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)));
    };

    // Invert zScore because lower time is better
    const percentileDecimal = cdf(-zScore);
    return Math.round(percentileDecimal * 100);
};

export const calculatePerformancePercentile = (
    seconds: number,
    discipline: Discipline,
    distanceValue: number,
    gender: Gender,
    birthDate: string
): { percentile: number, akLabel: string, valid: boolean } => {

    const distType = identifyDistance(discipline, distanceValue);
    if (!distType) return { percentile: 0, akLabel: '', valid: false };

    const birthYear = new Date(birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const akLabel = calculateAgeGroup(birthDate);

    const baseTime = BASE_TIMES[distType][discipline];
    const ageMod = getAgeFactor(age);
    const genderMod = GENDER_FACTOR[gender];

    const expectedAverageSeconds = baseTime * ageMod * genderMod;
    const percentile = calculatePercentileFromStats(seconds, expectedAverageSeconds);

    return {
        percentile: Math.min(99, Math.max(1, percentile)),
        akLabel,
        valid: true
    };
};

export const calculateTotalPerformancePercentile = (
    totalSeconds: number,
    swimMeters: number,
    bikeKm: number,
    runKm: number,
    gender: Gender,
    birthDate: string
): { percentile: number, akLabel: string, valid: boolean } => {

    const distType = identifyRaceType(swimMeters, bikeKm, runKm);
    if (!distType) return { percentile: 0, akLabel: '', valid: false };

    const birthYear = new Date(birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const akLabel = calculateAgeGroup(birthDate);

    const baseTimes = BASE_TIMES[distType];
    const baseTotal = baseTimes.swim + baseTimes.bike + baseTimes.run + BASE_TRANSITIONS[distType];

    const ageMod = getAgeFactor(age);
    const genderMod = GENDER_FACTOR[gender];

    const expectedAverageSeconds = baseTotal * ageMod * genderMod;
    const percentile = calculatePercentileFromStats(totalSeconds, expectedAverageSeconds);

    return {
        percentile: Math.min(99, Math.max(1, percentile)),
        akLabel,
        valid: true
    };
};

export const parseManualInput = (val: string): number => {
    const normalized = val.replace(',', '.');
    const floatVal = parseFloat(normalized);
    return isNaN(floatVal) ? 0 : floatVal;
};