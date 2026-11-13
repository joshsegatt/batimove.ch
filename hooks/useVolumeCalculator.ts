import { useState, useMemo, useCallback, useEffect } from 'react';
import { CalculatorItemState, CalculatorSummary } from '../types/calculator';
import { CALCULATOR_ITEMS } from '../data/calculatorItems';
import { LOCALE, type Lang } from '../i18n';

/** Ligne d'inventaire avec le nom anglais (venu de CALCULATOR_ITEMS). */
export type CalculatorRow = CalculatorItemState & { nameEn: string };

// Logements types : point de départ de l'inventaire. Le volume affiché est
// calculé à partir de cette liste (pas de chiffre écrit à la main).
export const HOUSING_PRESETS = [
    {
        id: 'studio',
        name: 'Studio',
        rooms: '1 à 1,5 pièce',
        nameEn: 'Studio', roomsEn: '1 to 1.5 rooms',
        defaultItems: {
            'salon-4': 1, 'salon-18': 1, 'salon-15': 1, 'chambre-3': 1, 'chambre-7': 1,
            'chambre-22': 1, 'cuisine-4': 1, 'cuisine-18': 2, 'cuisine-2': 1, 'divers-10': 6,
        },
    },
    {
        id: '2pieces',
        name: '2 pièces',
        rooms: '2 à 2,5 pièces',
        nameEn: '2-room flat', roomsEn: '2 to 2.5 rooms',
        defaultItems: {
            'salon-3': 1, 'salon-18': 1, 'salon-15': 1, 'salon-6': 1, 'cuisine-18': 4, 'chambre-2': 1,
            'chambre-4': 1, 'chambre-7': 1, 'chambre-22': 2, 'cuisine-3': 1, 'cuisine-10': 1, 'divers-10': 12,
        },
    },
    {
        id: '3pieces',
        name: '3 pièces',
        rooms: '3 à 3,5 pièces',
        nameEn: '3-room flat', roomsEn: '3 to 3.5 rooms',
        defaultItems: {
            'salon-1': 1, 'salon-18': 1, 'salon-15': 1, 'salon-2': 1, 'cuisine-18': 6, 'salon-5': 1,
            'chambre-2': 1, 'chambre-1': 1, 'chambre-7': 2, 'chambre-22': 2, 'chambre-13': 1, 'chambre-8': 1,
            'chambre-6': 1, 'cuisine-1': 1, 'cuisine-10': 1, 'cuisine-9': 1, 'divers-10': 16,
        },
    },
    {
        id: '4pieces',
        name: '4 pièces',
        rooms: '4 à 4,5 pièces',
        nameEn: '4-room flat', roomsEn: '4 to 4.5 rooms',
        defaultItems: {
            'salon-1': 1, 'salon-18': 1, 'salon-15': 1, 'salon-2': 1, 'cuisine-18': 6, 'salon-5': 2,
            'chambre-2': 1, 'chambre-1': 1, 'chambre-7': 2, 'chambre-22': 4, 'chambre-13': 2, 'chambre-4': 1,
            'chambre-6': 2, 'cuisine-1': 1, 'cuisine-10': 1, 'cuisine-9': 1, 'cuisine-11': 1, 'divers-5': 2,
            'divers-10': 24,
        },
    },
    {
        id: 'maison',
        name: 'Maison',
        rooms: '5 pièces et plus',
        nameEn: 'House', roomsEn: '5 rooms or more',
        defaultItems: {
            'salon-1': 1, 'salon-3': 1, 'salon-18': 2, 'salon-15': 2, 'salon-2': 1, 'cuisine-18': 8,
            'salon-5': 2, 'chambre-2': 2, 'chambre-1': 2, 'chambre-7': 3, 'chambre-22': 4, 'chambre-13': 2,
            'chambre-4': 2, 'chambre-6': 2, 'cuisine-1': 1, 'cuisine-10': 1, 'cuisine-9': 1, 'cuisine-11': 1,
            'divers-2': 1, 'divers-8': 1, 'divers-5': 2, 'divers-10': 32,
        },
    },
] as const;

const VOLUME_BY_ID = new Map(CALCULATOR_ITEMS.map((i) => [i.id, i.volume]));

/** Volume d'un logement type, calculé à partir de son inventaire. */
export const presetVolume = (defaults: Readonly<Record<string, number>>) =>
    Math.round(Object.entries(defaults).reduce((sum, [id, q]) => sum + (VOLUME_BY_ID.get(id) ?? 0) * q, 0) * 10) / 10;

/** Formate un volume selon la langue : « 18,4 » (fr-CH), « 18.4 » (en-GB). */
export const formatVolume = (m3: number, lang: Lang = 'fr') =>
    m3.toLocaleString(LOCALE[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Brouillon de l'inventaire : survit à un rechargement et au retour depuis la
// page de demande. Effacé après un envoi réussi.
export const CALCULATOR_DRAFT_KEY = 'batimove.calculator.v1';

interface Draft {
    quantities: Record<string, number>;
    disassemble: string[];
    preset: string | null;
}

const readDraft = (): Draft | null => {
    try {
        const raw = window.localStorage.getItem(CALCULATOR_DRAFT_KEY);
        if (!raw) return null;
        const d = JSON.parse(raw) as Partial<Draft> | null;
        if (!d || typeof d.quantities !== 'object' || d.quantities === null || Array.isArray(d.quantities)) return null;
        // Le brouillon garde des ids (pas de noms) : il se recharge dans les deux langues.
        // Un id inconnu est ignoré par buildItems ; on ne garde que des chaînes ici.
        return {
            quantities: d.quantities,
            disassemble: Array.isArray(d.disassemble) ? d.disassemble.filter((x): x is string => typeof x === 'string') : [],
            preset: typeof d.preset === 'string' ? d.preset : null,
        };
    } catch {
        return null;
    }
};

const buildItems = (quantities: Record<string, number> = {}, disassemble: string[] = []): CalculatorRow[] =>
    CALCULATOR_ITEMS.map((item) => {
        const quantity = Math.max(0, Math.min(99, Math.floor(Number(quantities[item.id]) || 0)));
        return { ...item, quantity, disassemble: quantity > 0 && disassemble.includes(item.id) };
    });

export function useVolumeCalculator() {
    const [initialDraft] = useState(() => (typeof window !== 'undefined' ? readDraft() : null));
    const [items, setItems] = useState<CalculatorRow[]>(() =>
        buildItems(initialDraft?.quantities, initialDraft?.disassemble)
    );
    const [activePreset, setActivePreset] = useState<string | null>(initialDraft?.preset ?? null);

    useEffect(() => {
        try {
            const quantities: Record<string, number> = {};
            const disassemble: string[] = [];
            for (const item of items) {
                if (item.quantity > 0) quantities[item.id] = item.quantity;
                if (item.quantity > 0 && item.disassemble) disassemble.push(item.id);
            }
            if (Object.keys(quantities).length === 0) window.localStorage.removeItem(CALCULATOR_DRAFT_KEY);
            else window.localStorage.setItem(CALCULATOR_DRAFT_KEY, JSON.stringify({ quantities, disassemble, preset: activePreset }));
        } catch {
            /* stockage bloqué : le calculateur fonctionne sans brouillon */
        }
    }, [items, activePreset]);

    const summary: CalculatorSummary = useMemo(() => {
        const totalVolume = items.reduce((sum, item) => sum + item.volume * item.quantity, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const disassembleCount = items.reduce((sum, item) => sum + (item.disassemble && item.quantity > 0 ? item.quantity : 0), 0);

        // Estimation interne uniquement : jamais affichée au client. Elle part dans
        // l'e-mail adressé à Batimove et sert de valeur de conversion Google Ads.
        let estimatedPrice = 0;
        if (totalVolume > 0) {
            if (totalVolume <= 8) estimatedPrice = 550;
            else if (totalVolume <= 18) estimatedPrice = 550 + (totalVolume - 8) * 55;
            else if (totalVolume <= 30) estimatedPrice = 1100 + (totalVolume - 18) * 45;
            else estimatedPrice = 1640 + (totalVolume - 30) * 40;
            estimatedPrice += disassembleCount * 25;
        }

        return {
            totalVolume: Math.round(totalVolume * 10) / 10,
            totalItems,
            estimatedPrice: Math.round(estimatedPrice),
            disassembleCount,
        };
    }, [items]);

    const updateQuantity = useCallback((itemId: string, delta: number) => {
        setActivePreset(null);
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;
                const quantity = Math.max(0, Math.min(99, item.quantity + delta));
                return { ...item, quantity, disassemble: quantity > 0 ? item.disassemble : false };
            })
        );
    }, []);

    const toggleDisassemble = useCallback((itemId: string) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, disassemble: !item.disassemble } : item)));
    }, []);

    const applyPreset = useCallback((presetId: string) => {
        const preset = HOUSING_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        setActivePreset(presetId);
        setItems(buildItems(preset.defaultItems as Record<string, number>));
    }, []);

    const resetCalculator = useCallback(() => {
        setActivePreset(null);
        setItems(buildItems());
    }, []);

    const getItemsByCategory = useCallback((category: string) => items.filter((item) => item.category === category), [items]);

    const getAllItems = useCallback(() => items, [items]);

    return {
        items,
        summary,
        activePreset,
        applyPreset,
        updateQuantity,
        toggleDisassemble,
        resetCalculator,
        getItemsByCategory,
        getAllItems,
    };
}
