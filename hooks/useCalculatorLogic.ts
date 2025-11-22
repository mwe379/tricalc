import { useState } from 'react';

export const useTargetTime = (initialHours = 0, initialMinutes = 0, initialSeconds = 0) => {
    const [hours, setHours] = useState(initialHours);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);

    const updateTime = (h: number, m: number, s: number) => {
        let nh = h;
        let nm = m;
        let ns = s;

        // Rollover seconds
        if (ns >= 60) { nm++; ns = 0; }
        if (ns < 0) { nm--; ns = 59; }

        // Rollover minutes
        if (nm >= 60) { nh++; nm = 0; }
        if (nm < 0) { nh--; nm = 59; }

        // Clamp hours
        if (nh < 0) { nh = 0; nm = 0; ns = 0; }

        setHours(nh);
        setMinutes(nm);
        setSeconds(ns);
    };

    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    return {
        hours,
        minutes,
        seconds,
        updateTime,
        setHours,
        setMinutes,
        setSeconds,
        totalSeconds
    };
};

export const usePace = (initialMin = 0, initialSec = 0) => {
    // We don't keep local state here because pace is usually part of the parent's data object.
    // Instead, we provide the update logic.

    const calculateNewPace = (min: number, sec: number) => {
        let newMin = min;
        let newSec = sec;

        if (newSec >= 60) { newMin++; newSec = 0; }
        if (newSec < 0) { newMin--; newSec = 59; }
        if (newMin < 0) { newMin = 0; newSec = 0; }

        return { min: newMin, sec: newSec };
    };

    return {
        calculateNewPace
    };
};
