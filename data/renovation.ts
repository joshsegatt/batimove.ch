import type { LucideIcon } from 'lucide-react';
import { Bath, Building, Building2, CookingPot, Droplets, House, LayoutGrid, PaintRoller, Umbrella } from 'lucide-react';
import type { Lang } from '../i18n';

// Batimove Rénovation: segunda atividade da empresa, com área própria em
// /renovation (menu, rodapé e devis próprios), separada da mudança.
// Só afirmações confirmadas pela Batimove: rénovation e étanchéité residencial
// e predial; Genève em prioridade, Vaud conforme o serviço; obras feitas com
// artisans parceiros, qualificados e assegurados; a Batimove coordena.
// Sem preços, prazos garantidos, anos de experiência nem números de obras.

export type RenovationId =
  | 'appartement-maison'
  | 'salle-de-bain'
  | 'cuisine'
  | 'peinture'
  | 'sols'
  | 'etancheite-toiture-terrasse'
  | 'etancheite-sous-sol'
  | 'facades'
  | 'immeubles';

export type RenovationGroup = 'interieur' | 'batiment';

export interface FaqItem {
  q: string;
  a: string;
}

export interface RenovationContent {
  /** Nome curto (menu, cartões) */
  name: string;
  /** Linha de apoio no menu e nos cartões */
  hint: string;
  /** Uma frase para o cartão do serviço */
  summary: string;
  h1: string;
  lead: string;
  includes: string[];
  signs: string[];
  faq: FaqItem[];
}

export interface RenovationService {
  id: RenovationId;
  group: RenovationGroup;
  icon: LucideIcon;
  /** Caminho francês (o inglês vem de data/i18nRoutes.json) */
  path: string;
  fr: RenovationContent;
  en: RenovationContent;
}

export const RENOVATION_SERVICES: RenovationService[] = [
  {
    id: 'appartement-maison',
    group: 'interieur',
    icon: House,
    path: '/renovation/appartement-maison',
    fr: {
      name: 'Rénovation complète',
      hint: 'Appartement ou maison',
      summary: "Tous les corps de métier coordonnés pour rendre un logement prêt à habiter.",
      h1: "Rénovation d'appartement et de maison à Genève",
      lead: "Vous achetez, héritez ou remettez un logement en état ? Nous planifions l'ensemble des travaux, coordonnons chaque corps de métier et vous rendons un logement prêt à habiter.",
      includes: [
        'Visite sur place et relevé des travaux',
        'Démolition, évacuation et tri des gravats',
        'Coordination des corps de métier : maçon, plâtrier, électricien, sanitaire, carreleur, peintre',
        'Sols, murs et plafonds remis à neuf',
        'Suivi de chantier et points réguliers avec vous',
        'Nettoyage de fin de chantier',
      ],
      signs: [
        "Avant d'emménager dans un logement acheté ou hérité",
        'Entre deux locataires, pour remettre un bien en location',
        'Quand plusieurs pièces sont à refaire en même temps',
        "Pour changer la distribution d'un logement",
      ],
      faq: [
        {
          q: 'Faut-il quitter le logement pendant les travaux ?',
          a: "Pas toujours. Pour une rénovation complète, c'est souvent plus rapide et plus propre. Nous pouvons alors déménager vos meubles et les garder en garde-meubles le temps du chantier.",
        },
        {
          q: 'Combien de temps dure une rénovation complète ?',
          a: "Cela dépend de la surface et des travaux. Le planning figure dans le devis, établi après la visite sur place.",
        },
        {
          q: 'Faut-il une autorisation ?',
          a: "Certains travaux, comme une modification de structure, demandent une autorisation ou l'accord de la régie ou de la PPE. Nous vous indiquons lesquels lors de la visite.",
        },
      ],
    },
    en: {
      name: 'Full renovation',
      hint: 'Flat or house',
      summary: "Every trade coordinated to hand you back a home ready to live in.",
      h1: 'Flat and house renovation in Geneva',
      lead: 'Buying, inheriting or refreshing a property? We plan the whole job, coordinate every trade and hand you back a home that is ready to live in.',
      includes: [
        'Site visit and survey of the work',
        'Demolition, removal and sorting of rubble',
        'Coordination of every trade: mason, plasterer, electrician, plumber, tiler, painter',
        'Floors, walls and ceilings restored',
        'Site supervision and regular updates',
        'Post-construction cleaning',
      ],
      signs: [
        'Before moving into a property you bought or inherited',
        'Between two tenants, to let a property again',
        'When several rooms need work at the same time',
        'To change the layout of a home',
      ],
      faq: [
        {
          q: 'Do I need to move out during the work?',
          a: 'Not always. For a full renovation it is often faster and cleaner. We can then move your furniture and keep it in storage for the duration of the work.',
        },
        {
          q: 'How long does a full renovation take?',
          a: 'It depends on the size of the property and the work involved. The schedule is set out in the quote, drawn up after the site visit.',
        },
        {
          q: 'Do I need a permit?',
          a: 'Some work, such as structural changes, requires a permit or the approval of the letting agency or the co-owners. We tell you which during the visit.',
        },
      ],
    },
  },
  {
    id: 'salle-de-bain',
    group: 'interieur',
    icon: Bath,
    path: '/renovation/salle-de-bain',
    fr: {
      name: 'Salle de bain',
      hint: 'Complète ou partielle',
      summary: "Douche à l'italienne, carrelage, plomberie et étanchéité sous carrelage.",
      h1: 'Rénovation de salle de bain à Genève',
      lead: "Remplacer une baignoire par une douche à l'italienne, refaire le carrelage ou toute la pièce : nous gérons la plomberie, l'étanchéité sous carrelage et les finitions.",
      includes: [
        'Dépose des anciens sanitaires et du carrelage',
        'Plomberie et évacuations adaptées',
        'Étanchéité sous carrelage dans les zones de douche',
        'Carrelage, faïence et joints',
        'Pose des sanitaires, du meuble vasque et des accessoires',
        'Ventilation et éclairage selon la pièce',
      ],
      signs: [
        'Joints noircis ou moisissures qui reviennent',
        "Traces d'humidité chez le voisin du dessous",
        'Baignoire à remplacer par une douche de plain-pied',
        'Sanitaires anciens ou carrelage fissuré',
      ],
      faq: [
        {
          q: 'Combien de temps sans salle de bain ?',
          a: "Le délai dépend de l'ampleur des travaux. Nous le fixons dans le devis et organisons le chantier pour le réduire au minimum.",
        },
        {
          q: "Pouvez-vous transformer une baignoire en douche à l'italienne ?",
          a: "Oui, quand l'évacuation le permet. Nous le vérifions lors de la visite : pente, hauteur disponible et type de sol.",
        },
        {
          q: 'Et si je suis locataire ?',
          a: "Des travaux dans un logement loué demandent l'accord écrit du propriétaire ou de la régie. Nous pouvons leur transmettre le devis.",
        },
      ],
    },
    en: {
      name: 'Bathroom',
      hint: 'Full or partial',
      summary: "Walk-in shower, tiling, plumbing and waterproofing under the tiles.",
      h1: 'Bathroom renovation in Geneva',
      lead: 'Swapping a bath for a walk-in shower, retiling or redoing the whole room: we handle the plumbing, the waterproofing under the tiles and the finishes.',
      includes: [
        'Removal of the old fittings and tiles',
        'Plumbing and drainage adapted to the new layout',
        'Waterproofing under the tiles in shower areas',
        'Floor and wall tiling and grouting',
        'Installation of sanitary ware, vanity unit and accessories',
        'Ventilation and lighting as the room requires',
      ],
      signs: [
        'Blackened grout or mould that keeps coming back',
        'Damp marks in the flat below',
        'A bath to replace with a level-access shower',
        'Old fittings or cracked tiles',
      ],
      faq: [
        {
          q: 'How long will I be without a bathroom?',
          a: 'It depends on the scope of the work. We set the timing in the quote and organise the job to keep it as short as possible.',
        },
        {
          q: 'Can you turn a bath into a walk-in shower?',
          a: 'Yes, when the drainage allows it. We check this during the visit: fall, available height and floor type.',
        },
        {
          q: 'What if I am a tenant?',
          a: 'Work in a rented home needs the written approval of the landlord or letting agency. We can send them the quote.',
        },
      ],
    },
  },
  {
    id: 'cuisine',
    group: 'interieur',
    icon: CookingPot,
    path: '/renovation/cuisine',
    fr: {
      name: 'Cuisine',
      hint: 'Rénovation et pose',
      summary: "Dépose de l'ancienne, adaptations techniques et pose de la nouvelle.",
      h1: 'Rénovation de cuisine à Genève',
      lead: "Nouvelle cuisine ou rafraîchissement : démontage de l'ancienne, adaptation de l'électricité et des arrivées d'eau, pose des meubles, du plan de travail et des appareils.",
      includes: [
        "Démontage et évacuation de l'ancienne cuisine",
        'Adaptations électriques et sanitaires par des artisans qualifiés',
        'Pose des meubles, du plan de travail et de la crédence',
        'Raccordement des appareils encastrables',
        'Peinture, carrelage ou sol si nécessaire',
        'Nettoyage de fin de chantier',
      ],
      signs: [
        "Meubles abîmés ou plan de travail gonflé par l'humidité",
        'Appareils à remplacer qui ne rentrent plus dans les niches',
        'Nouvelle distribution : îlot, cuisine ouverte sur le séjour',
        'Cuisine achetée en magasin à faire poser',
      ],
      faq: [
        {
          q: 'Posez-vous une cuisine achetée ailleurs ?',
          a: 'Oui. Envoyez-nous le plan du fournisseur : nous vérifions les raccordements et chiffrons la pose.',
        },
        {
          q: 'Combien de temps dure la pose ?',
          a: 'Selon la cuisine et les adaptations nécessaires. Le délai est fixé dans le devis.',
        },
        {
          q: "Vous occupez-vous de l'ancienne cuisine ?",
          a: "Oui, la dépose et l'évacuation sont comprises, avec tri et recyclage des matériaux.",
        },
      ],
    },
    en: {
      name: 'Kitchen',
      hint: 'Renovation and fitting',
      summary: "Removal of the old one, technical changes and fitting of the new one.",
      h1: 'Kitchen renovation in Geneva',
      lead: 'A new kitchen or a refresh: removal of the old one, changes to the electrics and water supply, fitting of units, worktop and appliances.',
      includes: [
        'Removal and disposal of the old kitchen',
        'Electrical and plumbing changes by qualified tradespeople',
        'Fitting of units, worktop and splashback',
        'Connection of built-in appliances',
        'Painting, tiling or flooring if needed',
        'Post-construction cleaning',
      ],
      signs: [
        'Damaged units or a worktop swollen by moisture',
        'New appliances that no longer fit the spaces',
        'A new layout: island, kitchen open to the living room',
        'A kitchen bought in a shop that needs fitting',
      ],
      faq: [
        {
          q: 'Do you fit kitchens bought elsewhere?',
          a: "Yes. Send us the supplier's plan: we check the connections and price the fitting.",
        },
        {
          q: 'How long does fitting take?',
          a: 'It depends on the kitchen and the changes needed. The timing is set in the quote.',
        },
        {
          q: 'Do you take care of the old kitchen?',
          a: 'Yes, removal and disposal are included, with sorting and recycling of the materials.',
        },
      ],
    },
  },
  {
    id: 'peinture',
    group: 'interieur',
    icon: PaintRoller,
    path: '/renovation/peinture',
    fr: {
      name: 'Peinture & plâtrerie',
      hint: 'Murs, plafonds, boiseries',
      summary: "Murs, plafonds et boiseries, avec réparation des fissures.",
      h1: 'Peinture et plâtrerie à Genève',
      lead: "Murs, plafonds, boiseries et cages d'escalier : préparation soignée des supports, réparation des fissures et peinture adaptée à chaque pièce.",
      includes: [
        'Protection des sols et du mobilier',
        'Rebouchage, enduits et ponçage',
        'Réparation des fissures et du plâtre abîmé',
        'Peinture des murs, plafonds et boiseries',
        'Peintures adaptées aux pièces humides',
        'Nettoyage et évacuation en fin de chantier',
      ],
      signs: [
        "Remise en état avant l'état des lieux de sortie",
        "Taches d'humidité ou peinture qui cloque",
        'Fissures au plafond ou dans les angles',
        "Cage d'escalier ou parties communes défraîchies",
      ],
      faq: [
        {
          q: 'Pouvez-vous repeindre avant un état des lieux ?',
          a: 'Oui, et enchaîner avec le nettoyage de fin de bail. Vérifiez d\'abord votre bail : certaines régies imposent la teinte ou le type de peinture.',
        },
        {
          q: 'Peignez-vous des logements occupés ?',
          a: 'Oui, pièce par pièce, en protégeant le mobilier.',
        },
        {
          q: "Une tache d'humidité revient après la peinture. Pourquoi ?",
          a: "Parce que la cause n'est pas traitée : infiltration, remontée capillaire ou condensation. Nous la cherchons d'abord, c'est le rôle de notre service étanchéité.",
        },
      ],
    },
    en: {
      name: 'Painting & plastering',
      hint: 'Walls, ceilings, woodwork',
      summary: "Walls, ceilings and woodwork, with crack repair.",
      h1: 'Painting and plastering in Geneva',
      lead: 'Walls, ceilings, woodwork and stairwells: careful surface preparation, crack repair and the right paint for each room.',
      includes: [
        'Protection of floors and furniture',
        'Filling, skimming and sanding',
        'Repair of cracks and damaged plaster',
        'Painting of walls, ceilings and woodwork',
        'Paints suited to damp rooms',
        'Cleaning and disposal at the end of the job',
      ],
      signs: [
        'Making good before the move-out inspection',
        'Damp stains or blistering paint',
        'Cracks in the ceiling or in corners',
        'A tired stairwell or common areas',
      ],
      faq: [
        {
          q: 'Can you repaint before a move-out inspection?',
          a: 'Yes, and follow on with the end of tenancy cleaning. Check your lease first: some letting agencies specify the colour or type of paint.',
        },
        {
          q: 'Do you paint occupied homes?',
          a: 'Yes, room by room, with the furniture protected.',
        },
        {
          q: 'A damp stain comes back after painting. Why?',
          a: 'Because the cause has not been treated: water ingress, rising damp or condensation. We look for it first; that is what our waterproofing service is for.',
        },
      ],
    },
  },
  {
    id: 'sols',
    group: 'interieur',
    icon: LayoutGrid,
    path: '/renovation/sols',
    fr: {
      name: 'Sols',
      hint: 'Parquet, carrelage, vinyle',
      summary: "Parquet, carrelage, vinyle ou stratifié, posé sur un support préparé.",
      h1: 'Pose et rénovation de sols à Genève',
      lead: "Parquet, carrelage, vinyle ou stratifié : dépose de l'ancien revêtement, préparation du support et pose soignée, plinthes comprises.",
      includes: [
        "Dépose de l'ancien revêtement et évacuation",
        'Ragréage et préparation du support',
        'Pose de parquet, carrelage, vinyle ou stratifié',
        'Ponçage et vitrification de parquet existant',
        'Plinthes, seuils et finitions',
        "Isolation phonique selon le règlement de l'immeuble",
      ],
      signs: [
        'Parquet usé, rayé ou grisé',
        'Carrelage fissuré ou qui se décolle',
        'Changement de revêtement avant un emménagement',
        'Bruits de pas signalés par les voisins',
      ],
      faq: [
        {
          q: 'Peut-on poncer un parquet plutôt que le remplacer ?',
          a: "Souvent, oui, si la couche d'usure est suffisante. Nous le vérifions sur place.",
        },
        {
          q: 'Y a-t-il des règles en immeuble ?',
          a: "Oui. Le règlement de l'immeuble ou de la PPE impose souvent une isolation phonique sous les sols durs. Nous le vérifions avant de commander les matériaux.",
        },
        {
          q: 'Faut-il vider la pièce ?',
          a: 'Oui. Nous pouvons déplacer vos meubles, ou les garder en garde-meubles le temps des travaux.',
        },
      ],
    },
    en: {
      name: 'Flooring',
      hint: 'Parquet, tiles, vinyl',
      summary: "Parquet, tiles, vinyl or laminate, laid on a prepared subfloor.",
      h1: 'Flooring installation and renovation in Geneva',
      lead: 'Parquet, tiles, vinyl or laminate: removal of the old covering, preparation of the subfloor and careful laying, skirting boards included.',
      includes: [
        'Removal and disposal of the old floor covering',
        'Levelling and preparation of the subfloor',
        'Laying of parquet, tiles, vinyl or laminate',
        'Sanding and sealing of existing parquet',
        'Skirting boards, thresholds and finishes',
        'Sound insulation as the building rules require',
      ],
      signs: [
        'Worn, scratched or greyed parquet',
        'Cracked or loose tiles',
        'A new floor covering before moving in',
        'Footstep noise reported by neighbours',
      ],
      faq: [
        {
          q: 'Can parquet be sanded instead of replaced?',
          a: 'Often, yes, if the wear layer is thick enough. We check on site.',
        },
        {
          q: 'Are there rules in apartment buildings?',
          a: 'Yes. The building or co-ownership rules often require sound insulation under hard floors. We check before ordering materials.',
        },
        {
          q: 'Does the room need to be emptied?',
          a: 'Yes. We can move your furniture, or keep it in storage for the duration of the work.',
        },
      ],
    },
  },
  {
    id: 'etancheite-toiture-terrasse',
    group: 'batiment',
    icon: Umbrella,
    path: '/renovation/etancheite-toiture-terrasse',
    fr: {
      name: 'Toits plats, terrasses & balcons',
      hint: 'Étanchéité et réfection',
      summary: "Recherche de fuite, réparation ou réfection complète de l'étanchéité.",
      h1: 'Étanchéité de toit plat, terrasse et balcon à Genève',
      lead: "Une infiltration par le toit ou la terrasse abîme vite les plafonds et la structure. Nous localisons la fuite, réparons ou refaisons l'étanchéité et traitons les relevés, les évacuations et les joints.",
      includes: [
        "Diagnostic et recherche de l'origine de l'infiltration",
        "Réparation ponctuelle ou réfection complète de l'étanchéité",
        'Traitement des relevés, seuils et raccords',
        "Contrôle et remise en état des évacuations d'eau",
        'Étanchéité de balcons et loggias sous carrelage',
        'Protection et remise en place des revêtements',
      ],
      signs: [
        'Taches ou auréoles au plafond sous une terrasse',
        'Eau stagnante sur le toit plat après la pluie',
        'Carrelage de balcon qui se soulève ou joints qui s\'effritent',
        'Coulures de rouille ou de calcaire sous le balcon',
      ],
      faq: [
        {
          q: 'Que faire en attendant votre passage ?',
          a: "Protégez les zones touchées, coupez l'électricité si l'eau approche d'une installation et prévenez votre régie ou votre assurance bâtiment. Puis appelez-nous pour fixer la visite.",
        },
        {
          q: 'Faut-il refaire toute la terrasse ?',
          a: "Pas forcément. Si l'étanchéité est saine et la fuite localisée, une réparation suffit. Le diagnostic le dit.",
        },
        {
          q: 'Travaillez-vous pour les régies et les PPE ?',
          a: "Oui. Toitures et terrasses relèvent souvent des parties communes : nous établissons le devis pour la régie ou l'administrateur de la PPE.",
        },
      ],
    },
    en: {
      name: 'Flat roofs, terraces & balconies',
      hint: 'Waterproofing and repair',
      summary: "Leak tracing, repair or full renewal of the waterproofing.",
      h1: 'Flat roof, terrace and balcony waterproofing in Geneva',
      lead: 'A leak through the roof or terrace quickly damages ceilings and the structure. We find the source, repair or redo the waterproofing and treat the upstands, drains and joints.',
      includes: [
        'Diagnosis and tracing of the source of the leak',
        'Local repair or complete renewal of the waterproofing',
        'Treatment of upstands, thresholds and junctions',
        'Inspection and repair of rainwater drainage',
        'Waterproofing of balconies and loggias under tiles',
        'Protection and reinstatement of finishes',
      ],
      signs: [
        'Stains or rings on the ceiling below a terrace',
        'Standing water on the flat roof after rain',
        'Balcony tiles lifting or crumbling joints',
        'Rust or limescale streaks under the balcony',
      ],
      faq: [
        {
          q: 'What should I do until you arrive?',
          a: 'Protect the affected areas, switch off the electricity if water is near an installation and inform your letting agency or building insurer. Then call us to arrange the visit.',
        },
        {
          q: 'Does the whole terrace need redoing?',
          a: 'Not necessarily. If the waterproofing is sound and the leak is localised, a repair is enough. The diagnosis tells you which.',
        },
        {
          q: 'Do you work for letting agencies and co-owners?',
          a: 'Yes. Roofs and terraces are often common parts: we draw up the quote for the letting agency or the building manager.',
        },
      ],
    },
  },
  {
    id: 'etancheite-sous-sol',
    group: 'batiment',
    icon: Droplets,
    path: '/renovation/etancheite-sous-sol',
    fr: {
      name: 'Caves & sous-sols',
      hint: 'Humidité et infiltrations',
      summary: "Diagnostic de l'humidité, puis traitement de la vraie cause.",
      h1: 'Étanchéité de cave et sous-sol à Genève',
      lead: "Murs humides, salpêtre, eau qui entre par le sol : nous identifions la cause, infiltration, remontée capillaire ou condensation, avant de choisir le traitement adapté.",
      includes: [
        "Diagnostic de l'humidité et de son origine",
        'Traitement des infiltrations par les murs enterrés',
        'Traitement des remontées capillaires',
        "Cuvelage et revêtements d'étanchéité intérieurs",
        'Reprise des fissures et des joints',
        'Conseils de ventilation contre la condensation',
      ],
      signs: [
        'Odeur de moisi et taches noires',
        'Salpêtre : dépôts blancs au bas des murs',
        "Peinture ou enduit qui s'écaille",
        'Eau au sol après de fortes pluies',
      ],
      faq: [
        {
          q: 'Un déshumidificateur suffit-il ?',
          a: "Il aide contre la condensation, pas contre une infiltration ni une remontée capillaire. D'où l'intérêt d'un diagnostic.",
        },
        {
          q: 'Peut-on aménager une cave humide ?',
          a: "Seulement après avoir traité l'humidité. Sinon, les revêtements et le mobilier s'abîment.",
        },
        {
          q: "Traitement par l'intérieur ou par l'extérieur ?",
          a: "Les deux existent. L'extérieur est souvent plus durable mais demande d'excaver ; l'intérieur est plus simple d'accès. Nous vous présentons les options et leur coût.",
        },
      ],
    },
    en: {
      name: 'Cellars & basements',
      hint: 'Damp and water ingress',
      summary: "Diagnosis of the damp, then treatment of the real cause.",
      h1: 'Cellar and basement waterproofing in Geneva',
      lead: 'Damp walls, saltpetre, water coming up through the floor: we identify the cause, whether water ingress, rising damp or condensation, before choosing the right treatment.',
      includes: [
        'Diagnosis of the damp and its source',
        'Treatment of water ingress through buried walls',
        'Treatment of rising damp',
        'Tanking and internal waterproof coatings',
        'Repair of cracks and joints',
        'Ventilation advice against condensation',
      ],
      signs: [
        'Musty smell and black stains',
        'Saltpetre: white deposits at the base of walls',
        'Flaking paint or render',
        'Water on the floor after heavy rain',
      ],
      faq: [
        {
          q: 'Is a dehumidifier enough?',
          a: 'It helps against condensation, not against water ingress or rising damp. That is why a diagnosis matters.',
        },
        {
          q: 'Can a damp cellar be converted?',
          a: 'Only once the damp has been treated. Otherwise finishes and furniture will deteriorate.',
        },
        {
          q: 'Treatment from inside or outside?',
          a: 'Both exist. Outside is often more durable but means excavating; inside is easier to access. We present the options and their cost.',
        },
      ],
    },
  },
  {
    id: 'facades',
    group: 'batiment',
    icon: Building,
    path: '/renovation/facades',
    fr: {
      name: 'Façades',
      hint: 'Réfection et protection',
      summary: "Fissures, enduits et protection contre l'eau, échafaudage compris.",
      h1: 'Rénovation de façades à Genève',
      lead: "Fissures, enduit qui se décolle, traces d'eau : nous réparons et protégeons les façades de maisons et d'immeubles, échafaudage compris.",
      includes: [
        "Diagnostic de l'état de la façade",
        'Nettoyage et préparation du support',
        "Réparation des fissures et de l'enduit",
        "Traitement hydrofuge et protection contre l'eau",
        'Peinture de façade',
        "Coordination de l'échafaudage et des démarches nécessaires",
      ],
      signs: [
        "Fissures visibles dans l'enduit",
        'Enduit qui sonne creux ou se détache',
        'Traînées noires sous les fenêtres',
        'Peinture farineuse ou délavée',
      ],
      faq: [
        {
          q: 'Faut-il une autorisation pour refaire une façade ?',
          a: 'Cela dépend des travaux et de la zone, notamment si l\'aspect ou la teinte change. Nous le vérifions avec vous avant de commencer.',
        },
        {
          q: 'Travaillez-vous sur des immeubles habités ?',
          a: "Oui. Nous organisons le chantier et l'information des occupants avec la régie.",
        },
        {
          q: 'Quelle saison pour les travaux ?',
          a: 'Les enduits et peintures demandent une température et une météo adaptées. Le planning en tient compte.',
        },
      ],
    },
    en: {
      name: 'Façades',
      hint: 'Repair and protection',
      summary: "Cracks, render and water protection, scaffolding included.",
      h1: 'Façade renovation in Geneva',
      lead: 'Cracks, render coming away, water streaks: we repair and protect the façades of houses and apartment buildings, scaffolding included.',
      includes: [
        'Survey of the façade',
        'Cleaning and preparation of the surface',
        'Repair of cracks and render',
        'Water-repellent treatment and protection',
        'Façade painting',
        'Coordination of scaffolding and the necessary formalities',
      ],
      signs: [
        'Visible cracks in the render',
        'Render that sounds hollow or comes away',
        'Black streaks below windows',
        'Chalky or faded paint',
      ],
      faq: [
        {
          q: 'Do I need a permit to redo a façade?',
          a: 'It depends on the work and the area, especially if the appearance or colour changes. We check with you before starting.',
        },
        {
          q: 'Do you work on occupied buildings?',
          a: 'Yes. We organise the site and keep the occupants informed together with the letting agency.',
        },
        {
          q: 'What season suits the work?',
          a: 'Renders and paints need the right temperature and weather. The schedule takes this into account.',
        },
      ],
    },
  },
  {
    id: 'immeubles',
    group: 'batiment',
    icon: Building2,
    path: '/renovation/immeubles',
    fr: {
      name: 'Immeubles, régies & PPE',
      hint: 'Parties communes et entretien',
      summary: "Parties communes, logements à relouer, toitures et façades.",
      h1: "Rénovation d'immeubles pour régies et PPE à Genève",
      lead: "Cages d'escalier, caves, toitures, façades ou appartements entre deux locataires : un seul interlocuteur pour vos travaux, avec des devis clairs pour le propriétaire ou l'assemblée de PPE.",
      includes: [
        'Remise en état des appartements entre deux locataires',
        "Rénovation des cages d'escalier et parties communes",
        'Étanchéité des toitures, terrasses et sous-sols',
        'Réfection de façades',
        'Coordination avec la régie et information des occupants',
        'Débarras de caves et greniers, nettoyage de fin de chantier',
      ],
      signs: [
        'Un logement à relouer rapidement après un départ',
        'Des infiltrations signalées par plusieurs locataires',
        'Une assemblée de PPE qui doit voter des travaux',
        'Des parties communes défraîchies',
      ],
      faq: [
        {
          q: 'Pouvez-vous fournir plusieurs variantes de devis ?',
          a: "Oui, pour aider le propriétaire ou l'assemblée de PPE à décider : réparation ou réfection, finitions standard ou supérieures.",
        },
        {
          q: "Gérez-vous l'information des locataires ?",
          a: 'Nous préparons avec la régie les avis aux occupants et organisons le chantier pour limiter la gêne.',
        },
        {
          q: 'Intervenez-vous dans les logements vides à relouer ?',
          a: 'Oui : débarras, petites réparations, peinture, sols et nettoyage, pour remettre le logement en location au plus vite.',
        },
      ],
    },
    en: {
      name: 'Buildings & letting agencies',
      hint: 'Common parts and upkeep',
      summary: "Common parts, flats to relet, roofs and façades.",
      h1: 'Building renovation for letting agencies and co-owners in Geneva',
      lead: 'Stairwells, cellars, roofs, façades or flats between two tenants: one point of contact for your work, with clear quotes for the owner or the co-owners’ meeting.',
      includes: [
        'Making good flats between two tenants',
        'Renovation of stairwells and common parts',
        'Waterproofing of roofs, terraces and basements',
        'Façade repair',
        'Coordination with the letting agency and information for occupants',
        'Cellar and attic clearance, post-construction cleaning',
      ],
      signs: [
        'A flat to relet quickly after a tenant leaves',
        'Leaks reported by several tenants',
        'A co-owners’ meeting that has to vote on works',
        'Tired common areas',
      ],
      faq: [
        {
          q: 'Can you provide several versions of the quote?',
          a: 'Yes, to help the owner or co-owners decide: repair or full renewal, standard or higher-end finishes.',
        },
        {
          q: 'Do you handle informing the tenants?',
          a: 'We prepare the notices to occupants with the letting agency and organise the site to keep disruption low.',
        },
        {
          q: 'Do you work in empty flats that need reletting?',
          a: 'Yes: clearance, small repairs, painting, flooring and cleaning, to get the flat back on the market quickly.',
        },
      ],
    },
  },
];

export const renovationById = (id: RenovationId) => RENOVATION_SERVICES.find((s) => s.id === id)!;

/** Textos comuns da área Rénovation. */
export const RENOVATION_COMMON = {
  fr: {
    brand: 'Batimove Rénovation',
    groups: { interieur: 'Rénovation intérieure', batiment: 'Bâtiment & étanchéité' } as Record<RenovationGroup, string>,
    trust: [
      { title: 'Un seul interlocuteur', text: 'Du devis à la réception des travaux, Batimove coordonne chaque corps de métier.' },
      { title: 'Artisans qualifiés et assurés', text: 'Chaque partenaire travaille dans son métier, avec les assurances requises.' },
      { title: 'Genève en priorité', text: 'Canton de Vaud selon la prestation : décrivez votre projet, nous vous répondons.' },
      { title: 'Déménagement et stockage', text: "Nous vidons, stockons et réinstallons vos meubles si les travaux l'exigent." },
    ],
    steps: [
      { title: 'Visite sur place', text: 'Nous constatons, mesurons et cherchons la cause avant de proposer une solution.' },
      { title: 'Devis détaillé', text: 'Chaque poste est chiffré séparément, avec le planning et les variantes possibles.' },
      { title: 'Chantier coordonné', text: 'Un responsable Batimove suit les artisans et vous tient informé.' },
      { title: 'Réception et nettoyage', text: 'Nous vérifions les travaux avec vous et rendons les lieux propres.' },
    ],
  },
  en: {
    brand: 'Batimove Renovation',
    groups: { interieur: 'Interior renovation', batiment: 'Building & waterproofing' } as Record<RenovationGroup, string>,
    trust: [
      { title: 'One point of contact', text: 'From the quote to the final handover, Batimove coordinates every trade.' },
      { title: 'Qualified, insured tradespeople', text: 'Each partner works in their own trade, with the required insurance.' },
      { title: 'Geneva first', text: 'Canton of Vaud depending on the service: describe your project and we will reply.' },
      { title: 'Removals and storage', text: 'We empty, store and bring back your furniture if the work requires it.' },
    ],
    steps: [
      { title: 'Site visit', text: 'We inspect, measure and look for the cause before proposing a solution.' },
      { title: 'Detailed quote', text: 'Each item is priced separately, with the schedule and possible options.' },
      { title: 'Coordinated works', text: 'A Batimove supervisor oversees the tradespeople and keeps you informed.' },
      { title: 'Handover and cleaning', text: 'We check the work with you and leave the place clean.' },
    ],
  },
} satisfies Record<Lang, unknown>;

/** Perguntas da página principal da Rénovation. */
export const RENOVATION_FAQ: Record<Lang, FaqItem[]> = {
  fr: [
    {
      q: 'Dans quelles régions intervenez-vous ?',
      a: 'À Genève en priorité. Dans le canton de Vaud, selon la prestation : décrivez votre projet et nous vous répondons rapidement.',
    },
    {
      q: 'Qui réalise les travaux ?',
      a: 'Batimove coordonne le chantier avec des artisans partenaires qualifiés et assurés, chacun dans son métier. Vous gardez un seul interlocuteur, du devis à la réception.',
    },
    {
      q: 'Comment se passe le devis ?',
      a: 'Vous décrivez le projet en ligne ou par téléphone, puis nous visitons les lieux pour chiffrer précisément. Le devis détaille chaque poste.',
    },
    {
      q: 'Pouvez-vous vider et stocker mes meubles pendant les travaux ?',
      a: "Oui, c'est notre premier métier : déménagement, garde-meubles, puis réinstallation une fois les travaux terminés.",
    },
    {
      q: 'Travaillez-vous pour les régies et les PPE ?',
      a: 'Oui : remise en état entre deux locataires, parties communes, toitures, façades et sous-sols, avec des devis clairs pour la décision.',
    },
  ],
  en: [
    {
      q: 'Which areas do you cover?',
      a: 'Geneva first. In the canton of Vaud, depending on the service: describe your project and we will reply quickly.',
    },
    {
      q: 'Who carries out the work?',
      a: 'Batimove coordinates the site with qualified, insured partner tradespeople, each in their own trade. You keep one point of contact from the quote to the handover.',
    },
    {
      q: 'How does the quote work?',
      a: 'You describe the project online or by phone, then we visit to price it precisely. The quote itemises every part of the work.',
    },
    {
      q: 'Can you empty and store my furniture during the work?',
      a: 'Yes, it is our core business: removals, storage, then moving everything back once the work is done.',
    },
    {
      q: 'Do you work for letting agencies and co-owners?',
      a: 'Yes: making good between tenants, common parts, roofs, façades and basements, with clear quotes to support the decision.',
    },
  ],
};
