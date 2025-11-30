import { useEffect } from 'react';
import { Theme } from '../types';

export const useTheme = (theme: Theme, deps: any[] = []) => {
    useEffect(() => {
        const root = window.document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            if (theme === 'dark') {
                root.classList.add('dark');
            } else if (theme === 'light') {
                root.classList.remove('dark');
            } else {
                // System
                if (systemTheme.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyTheme();

        // Listen for system changes if theme is 'system'
        if (theme === 'system') {
            systemTheme.addEventListener('change', applyTheme);
            return () => systemTheme.removeEventListener('change', applyTheme);
        }
    }, [theme, ...deps]);
};
