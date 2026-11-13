/**
 * FAQ visible de la page d'accueil.
 *
 * Doit rester identique, mot pour mot, au bloc FAQPage (JSON-LD) de
 * index.html : Google exige que les questions balisées soient visibles sur la
 * page. Modifier l'un sans l'autre fait diverger les deux.
 */
import type { Lang } from '../i18n';

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQ: HomeFaqItem[] = [
  {
    question: "Combien coûte un déménagement à Genève ou dans le canton de Vaud ?",
    answer:
      "Le tarif d'un déménagement dépend du volume en m³, des accès (étages, ascenseur) et des prestations choisies (emballage, monte-meubles). Nos déménagements démarrent dès CHF 550 ; le prix exact vous est donné dans un devis gratuit et ferme sous 30 min, sans aucun frais caché."
  },
  {
    question: "Comment s'organise l'autorisation de stationnement à Genève ?",
    answer:
      "Batimove prend en charge l'ensemble des démarches auprès de la Ville de Genève et de la police pour réserver et poser les panneaux d'interdiction de stationnement temporaires devant votre logement."
  },
  {
    question: "Le nettoyage de fin de bail inclut-il une garantie pour l'état des lieux ?",
    answer:
      "Oui, notre service de nettoyage de fin de bail inclut une garantie remise de clés 100% conforme aux exigences des régies immobilières suisses. En cas de remarque lors de l'état des lieux, nous réintervenons gratuitement."
  },
  {
    question: "Vos services de déménagement sont-ils assurés ?",
    answer:
      "Absolument. Chaque transport et déménagement opéré par Batimove Sàrl est couvert par une assurance Responsabilité Civile professionnelle (RC) jusqu'à CHF 5'000'000. Vos biens bénéficient en complément d'une couverture All Risk."
  },
  {
    question: "Comment obtenir une estimation rapide de volume ?",
    answer:
      "Vous pouvez utiliser gratuitement notre calculateur de volume 3D en ligne pour estimer vos mètres cubes en 2 minutes, ou demander un devis par téléphone gratuit au 0800 825 925."
  }
];

/**
 * Version anglaise (pages /en). Le JSON-LD de index.html reste en français :
 * il décrit la page d'accueil française.
 */
export const HOME_FAQ_EN: HomeFaqItem[] = [
  {
    question: "How much does a removal cost in Geneva or the canton of Vaud?",
    answer:
      "The cost of a removal depends on the volume in m³, access (floors, lift) and the services you choose (packing, furniture lift). Our removals start from CHF 550; you receive the exact price in a free, fixed quote within 30 min, with no hidden costs whatsoever."
  },
  {
    question: "How is the parking permit arranged in Geneva?",
    answer:
      "Batimove handles all the formalities with the City of Geneva and the police to reserve and put up the temporary no-parking signs outside your home."
  },
  {
    question: "Does end of tenancy cleaning include a guarantee for the check-out inspection?",
    answer:
      "Yes, our end of tenancy cleaning service includes a key handover guarantee, 100% compliant with the requirements of Swiss letting agencies. If anything is raised at the check-out inspection, we come back free of charge."
  },
  {
    question: "Are your removal services insured?",
    answer:
      "Absolutely. Every transport and removal carried out by Batimove Sàrl is covered by professional liability insurance (RC) up to CHF 5,000,000. Your belongings also benefit from additional All Risk cover."
  },
  {
    question: "How can I get a quick volume estimate?",
    answer:
      "You can use our free online 3D volume calculator to estimate your cubic metres in 2 minutes, or ask for a quote by calling our freephone number, 0800 825 925."
  }
];

/** FAQ de l'accueil par langue. */
export const HOME_FAQ_BY_LANG: Record<Lang, HomeFaqItem[]> = { fr: HOME_FAQ, en: HOME_FAQ_EN };
