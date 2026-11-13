/**
 * Avis clients — source unique.
 *
 * Ces avis proviennent de notre profil Google et concernent des personnes
 * identifiables, avec leur nom et leur photo de profil.
 *
 * Deux règles à respecter en modifiant ce fichier :
 *  - `quote` doit rester le texte littéral de l'avis publié, sans coupe ni
 *    reformulation.
 *  - `location` est la localisation réelle du client. Elle ne doit jamais être
 *    adaptée à la page sur laquelle l'avis s'affiche : écrire « Lausanne » sous
 *    l'avis d'un client genevois pour renforcer une page régionale attribue à
 *    une personne réelle un propos qu'elle n'a pas tenu.
 *
 * Pour choisir quels avis apparaissent sur une page, utilisez `getReviews()`
 * avec les identifiants voulus — pas une copie modifiée des textes.
 */

/**
 * Note et nombre d'avis du profil Google Business, à tenir à jour.
 *
 * Ces valeurs sont affichées sur le site ET déclarées en données structurées
 * (aggregateRating). Annoncer un chiffre supérieur à celui du profil public
 * expose à une action manuelle « spam de données structurées » qui retire les
 * résultats enrichis de tout le site. Vérifié le 31.10.2026 : 4,7 / 12 avis.
 */
export const GOOGLE_RATING = {
  value: 4.7,
  count: 12
} as const;

export interface CustomerReview {
  id: string;
  name: string;
  /** Prestation concernée. */
  role: string;
  /** Localisation réelle du client. */
  location: string;
  /** Texte littéral de l'avis. */
  quote: string;
  avatar: string;
  rating: number;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'andressa',
    name: 'Andressa Segat',
    role: 'Déménagement international',
    location: 'Londres vers Suisse',
    quote:
      "Excellente expérience avec BATIMOVE ! Ils ont fait mon déménagement de Londres vers la Suisse et tout s’est parfaitement déroulé. Équipe organisée, ponctuelle, très professionnelle et soigneuse avec les meubles. La communication a également été irréprochable tout au long du transfert.",
    avatar: '/reviews/andressa.png',
    rating: 5
  },
  {
    id: 'julien',
    name: 'Julien B.',
    role: 'Partenaire certifié MOVU',
    location: 'Lausanne & Canton de Vaud',
    quote:
      "Une entreprise de déménagement au Top ! Réservé via MOVU, prix très compétitif pour un travail très qualitatif ! Rapidité et qualité, deux mots désignant parfaitement l’équipe ! Je recommande vivement !",
    avatar: '/reviews/julien.png',
    rating: 5
  },
  {
    id: 'wagner',
    name: 'Wagner Custódio',
    role: 'Déménagement résidentiel clés en main',
    location: 'Genève',
    quote:
      "Batimove est une entreprise merveilleuse ! Tout s’est très bien passé du début à la fin. L’équipe est professionnelle, efficace et très sympathique. Mon déménagement s’est déroulé sans aucun problème. Je recommande cette entreprise les yeux fermés !",
    avatar: '/reviews/wagner.png',
    rating: 5
  },
  {
    id: 'pedro',
    name: 'Pedro Silva',
    role: 'Transport et déménagement privé',
    location: 'Genève & Environs',
    quote:
      "Une entreprise sérieuse avec d'excellents professionnels ! Félicitations pour le travail accompli ! Je recommande vivement !",
    avatar: '/reviews/pedro.png',
    rating: 5
  }
];

/** Retourne les avis demandés, dans l'ordre fourni. */
export const getReviews = (ids: string[]): CustomerReview[] =>
  ids
    .map((id) => CUSTOMER_REVIEWS.find((review) => review.id === id))
    .filter((review): review is CustomerReview => Boolean(review));
