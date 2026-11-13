import { CalculatorItem } from '../types/calculator';
import type { Lang } from '../i18n';

/** Meuble du calculateur avec son nom anglais (l'id reste la clé stable). */
export type CalculatorItemData = CalculatorItem & { nameEn: string };

// Volume data for all items (in m³)
export const CALCULATOR_ITEMS: CalculatorItemData[] = [
    // SALON & SALLE À MANGER
    { id: 'salon-1', name: "Canapé d'angle", nameEn: "Corner sofa", volume: 2.5, category: 'salon' },
    { id: 'salon-2', name: 'Table (8 pers.)', nameEn: "Table (seats 8)", volume: 1.8, category: 'salon' },
    { id: 'salon-3', name: 'Canapé 3 places', nameEn: "3-seater sofa", volume: 2.0, category: 'salon' },
    { id: 'salon-4', name: 'Canapé 2 places', nameEn: "2-seater sofa", volume: 1.5, category: 'salon' },
    { id: 'salon-5', name: 'Bibliothèque grande', nameEn: "Bookcase (large)", volume: 1.2, category: 'salon' },
    { id: 'salon-6', name: 'Table (4 pers.)', nameEn: "Table (seats 4)", volume: 1.0, category: 'salon' },
    { id: 'salon-7', name: 'Bureau (grand)', nameEn: "Desk (large)", volume: 1.0, category: 'salon' },
    { id: 'salon-8', name: 'Commode', nameEn: "Chest of drawers", volume: 0.8, category: 'salon' },
    { id: 'salon-9', name: 'Bibliothèque medium', nameEn: "Bookcase (medium)", volume: 0.8, category: 'salon' },
    { id: 'salon-10', name: 'Enfilade / Buffet bas', nameEn: "Sideboard / low cabinet", volume: 1.2, category: 'salon' },
    { id: 'salon-11', name: 'Bureau (petit)', nameEn: "Desk (small)", volume: 0.6, category: 'salon' },
    { id: 'salon-12', name: 'Secrétaire', nameEn: "Writing bureau", volume: 0.7, category: 'salon' },
    { id: 'salon-13', name: 'Lampadaire', nameEn: "Floor lamp", volume: 0.1, category: 'salon' },
    { id: 'salon-14', name: 'Bibliothèque petite', nameEn: "Bookcase (small)", volume: 0.5, category: 'salon' },
    { id: 'salon-15', name: 'Meuble TV', nameEn: "TV unit", volume: 0.6, category: 'salon' },
    { id: 'salon-16', name: 'Fauteuil', nameEn: "Armchair", volume: 0.8, category: 'salon' },
    { id: 'salon-17', name: 'Fauteuil de bureau', nameEn: "Office chair", volume: 0.5, category: 'salon' },
    { id: 'salon-18', name: 'Table basse', nameEn: "Coffee table", volume: 0.4, category: 'salon' },
    { id: 'salon-19', name: 'Chaise de bureau', nameEn: "Desk chair", volume: 0.3, category: 'salon' },
    { id: 'salon-20', name: 'Tapis', nameEn: "Rug", volume: 0.2, category: 'salon' },
    { id: 'salon-21', name: 'Plante', nameEn: "Plant", volume: 0.1, category: 'salon' },

    // CUISINE & ÉLECTROMÉNAGER
    { id: 'cuisine-1', name: 'Réfrigérateur américain', nameEn: "American-style fridge freezer", volume: 1.5, category: 'cuisine' },
    { id: 'cuisine-2', name: 'Table (4 pers.)', nameEn: "Table (seats 4)", volume: 1.0, category: 'cuisine' },
    { id: 'cuisine-3', name: 'Réfrigérateur haut', nameEn: "Tall fridge", volume: 1.0, category: 'cuisine' },
    { id: 'cuisine-4', name: 'Réfrigérateur bas', nameEn: "Under-counter fridge", volume: 0.6, category: 'cuisine' },
    { id: 'cuisine-5', name: 'Élément bas cuisine, sdb', nameEn: "Base unit (kitchen, bathroom)", volume: 0.8, category: 'cuisine' },
    { id: 'cuisine-6', name: 'Colonne cuisine, sdb', nameEn: "Tall unit (kitchen, bathroom)", volume: 1.0, category: 'cuisine' },
    { id: 'cuisine-7', name: 'Chaise haute bébé', nameEn: "High chair", volume: 0.3, category: 'cuisine' },
    { id: 'cuisine-8', name: 'Four', nameEn: "Oven", volume: 0.5, category: 'cuisine' },
    { id: 'cuisine-9', name: 'Lave vaisselle', nameEn: "Dishwasher", volume: 0.6, category: 'cuisine' },
    { id: 'cuisine-10', name: 'Lave linge', nameEn: "Washing machine", volume: 0.7, category: 'cuisine' },
    { id: 'cuisine-11', name: 'Sèche linge', nameEn: "Tumble dryer", volume: 0.7, category: 'cuisine' },
    { id: 'cuisine-12', name: 'Cuisinière', nameEn: "Cooker", volume: 0.6, category: 'cuisine' },
    { id: 'cuisine-13', name: 'Élément haut cuisine, sdb', nameEn: "Wall unit (kitchen, bathroom)", volume: 0.5, category: 'cuisine' },
    { id: 'cuisine-14', name: 'Plante', nameEn: "Plant", volume: 0.1, category: 'cuisine' },
    { id: 'cuisine-15', name: 'Aspirateur', nameEn: "Vacuum cleaner", volume: 0.2, category: 'cuisine' },
    { id: 'cuisine-16', name: 'Four micro-onde', nameEn: "Microwave", volume: 0.2, category: 'cuisine' },
    { id: 'cuisine-17', name: 'Petit électroménager', nameEn: "Small appliance", volume: 0.1, category: 'cuisine' },
    { id: 'cuisine-18', name: 'Chaise', nameEn: "Chair", volume: 0.3, category: 'cuisine' },
    { id: 'cuisine-19', name: 'Tabouret', nameEn: "Stool", volume: 0.2, category: 'cuisine' },
    { id: 'cuisine-20', name: 'Lampe à poser', nameEn: "Table lamp", volume: 0.1, category: 'cuisine' },
    { id: 'cuisine-21', name: 'Table à repasser', nameEn: "Ironing board", volume: 0.3, category: 'cuisine' },

    // CHAMBRE(S) & BUREAU
    { id: 'chambre-1', name: 'Armoire 3 portes', nameEn: "3-door wardrobe", volume: 2.5, category: 'chambre' },
    { id: 'chambre-2', name: 'Lit 160', nameEn: "Bed (160 cm)", volume: 1.5, category: 'chambre' },
    { id: 'chambre-3', name: 'Lit 140', nameEn: "Bed (140 cm)", volume: 1.3, category: 'chambre' },
    { id: 'chambre-4', name: 'Armoire 2 portes', nameEn: "2-door wardrobe", volume: 1.8, category: 'chambre' },
    { id: 'chambre-5', name: 'Bibliothèque grande', nameEn: "Bookcase (large)", volume: 1.2, category: 'chambre' },
    { id: 'chambre-6', name: 'Bureau (grand)', nameEn: "Desk (large)", volume: 1.0, category: 'chambre' },
    { id: 'chambre-7', name: 'Commode', nameEn: "Chest of drawers", volume: 0.8, category: 'chambre' },
    { id: 'chambre-8', name: 'Armoire 1 porte', nameEn: "Single-door wardrobe", volume: 1.0, category: 'chambre' },
    { id: 'chambre-9', name: 'Lit bébé', nameEn: "Cot", volume: 0.8, category: 'chambre' },
    { id: 'chambre-10', name: 'Lit enfant', nameEn: "Child's bed", volume: 1.0, category: 'chambre' },
    { id: 'chambre-11', name: 'Sommier', nameEn: "Bed base", volume: 0.8, category: 'chambre' },
    { id: 'chambre-12', name: 'Bibliothèque medium', nameEn: "Bookcase (medium)", volume: 0.8, category: 'chambre' },
    { id: 'chambre-13', name: 'Lit 1 place', nameEn: "Single bed", volume: 1.0, category: 'chambre' },
    { id: 'chambre-14', name: 'Matelas', nameEn: "Mattress", volume: 0.5, category: 'chambre' },
    { id: 'chambre-15', name: 'Bureau (petit)', nameEn: "Desk (small)", volume: 0.6, category: 'chambre' },
    { id: 'chambre-16', name: 'Secrétaire', nameEn: "Writing bureau", volume: 0.7, category: 'chambre' },
    { id: 'chambre-17', name: 'Lampadaire', nameEn: "Floor lamp", volume: 0.1, category: 'chambre' },
    { id: 'chambre-18', name: 'Bibliothèque petite', nameEn: "Bookcase (small)", volume: 0.5, category: 'chambre' },
    { id: 'chambre-19', name: 'Fauteuil', nameEn: "Armchair", volume: 0.8, category: 'chambre' },
    { id: 'chambre-20', name: 'Fauteuil de bureau', nameEn: "Office chair", volume: 0.5, category: 'chambre' },
    { id: 'chambre-21', name: 'Coiffeuse', nameEn: "Dressing table", volume: 0.6, category: 'chambre' },
    { id: 'chambre-22', name: 'Chevet', nameEn: "Bedside table", volume: 0.3, category: 'chambre' },
    { id: 'chambre-23', name: 'Tapis', nameEn: "Rug", volume: 0.2, category: 'chambre' },

    // DIVERS (GARAGE, CAVE...)
    { id: 'divers-1', name: 'Lit superposé', nameEn: "Bunk bed", volume: 1.8, category: 'divers' },
    { id: 'divers-2', name: 'Table de jardin', nameEn: "Garden table", volume: 1.0, category: 'divers' },
    { id: 'divers-3', name: "Vélo d'appartement", nameEn: "Exercise bike", volume: 0.8, category: 'divers' },
    { id: 'divers-4', name: 'Vélo enfant', nameEn: "Child's bike", volume: 0.4, category: 'divers' },
    { id: 'divers-5', name: 'Vélo adulte', nameEn: "Adult bike", volume: 0.5, category: 'divers' },
    { id: 'divers-6', name: 'Transat', nameEn: "Sun lounger", volume: 0.6, category: 'divers' },
    { id: 'divers-7', name: 'Aspirateur', nameEn: "Vacuum cleaner", volume: 0.2, category: 'divers' },
    { id: 'divers-8', name: 'Barbecue', nameEn: "Barbecue", volume: 0.8, category: 'divers' },
    { id: 'divers-9', name: 'Tricycle', nameEn: "Tricycle", volume: 0.3, category: 'divers' },
    { id: 'divers-10', name: 'Cartons penderie', nameEn: "Wardrobe boxes", volume: 0.5, category: 'divers' },
    { id: 'divers-11', name: 'Coffre fort', nameEn: "Safe", volume: 0.4, category: 'divers' },
    { id: 'divers-12', name: 'Imprimante bureau', nameEn: "Office printer", volume: 0.2, category: 'divers' },
    { id: 'divers-13', name: 'Escabeau', nameEn: "Stepladder", volume: 0.3, category: 'divers' },
    { id: 'divers-14', name: 'Chaise de jardin', nameEn: "Garden chair", volume: 0.3, category: 'divers' },
    { id: 'divers-15', name: 'Parasol', nameEn: "Parasol", volume: 0.2, category: 'divers' },
    { id: 'divers-16', name: 'Tondeuse', nameEn: "Lawnmower", volume: 0.5, category: 'divers' },
    { id: 'divers-17', name: 'Table à repasser', nameEn: "Ironing board", volume: 0.3, category: 'divers' },
    { id: 'divers-18', name: 'Boite à outils', nameEn: "Toolbox", volume: 0.2, category: 'divers' },
    { id: 'divers-19', name: 'Valise', nameEn: "Suitcase", volume: 0.2, category: 'divers' },
];

// Libellés des catégories, dans l'ordre d'affichage du calculateur.
export const CALCULATOR_CATEGORIES = [
    { id: 'salon', label: 'Salon et séjour', short: 'Salon', labelEn: 'Living and dining room', shortEn: 'Living room' },
    { id: 'chambre', label: 'Chambres et bureau', short: 'Chambres', labelEn: 'Bedrooms and study', shortEn: 'Bedrooms' },
    { id: 'cuisine', label: 'Cuisine et électroménager', short: 'Cuisine', labelEn: 'Kitchen and appliances', shortEn: 'Kitchen' },
    { id: 'divers', label: 'Cave, garage et divers', short: 'Cave et divers', labelEn: 'Cellar, garage and other', shortEn: 'Cellar and other' },
] as const;

const ITEM_BY_ID = new Map(CALCULATOR_ITEMS.map((i) => [i.id, i]));

/**
 * Nom d'un meuble dans la langue demandée, à partir de son id. Le brouillon et
 * l'inventaire passé au checkout gardent l'id : un inventaire fait en français
 * s'affiche en anglais (et inversement). `fallback` sert pour un id inconnu.
 */
export const itemName = (id: string, lang: Lang, fallback = id): string => {
    const item = ITEM_BY_ID.get(id);
    if (!item) return fallback;
    return lang === 'en' ? item.nameEn : item.name;
};
