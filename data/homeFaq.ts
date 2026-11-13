/**
 * FAQ visible de la page d'accueil.
 *
 * Doit rester identique, mot pour mot, au bloc FAQPage (JSON-LD) de
 * index.html : Google exige que les questions balisées soient visibles sur la
 * page. Modifier l'un sans l'autre fait diverger les deux.
 */
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
