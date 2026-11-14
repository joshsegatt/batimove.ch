import type { Lang } from '../i18n';

// Guides & conseils: artigos longos para quem pesquisa antes de pedir devis.
// Cada fato legal ou administrativo vem de uma fonte oficial listada em
// `sources` (consultadas em 14.11.2026). Valores em CHF são indicativos e
// datados; o texto manda o leitor conferir na fonte. Nada de prazo ou valor que
// a pesquisa não confirmou em página oficial.

export type GuideBlock =
  | { t: 'h2'; id: string; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'check'; items: string[] }
  | { t: 'note'; title: string; text: string; tone?: 'info' | 'warn' }
  | { t: 'table'; head: string[]; rows: string[][] };

export interface GuideContent {
  h1: string;
  /** Resumo do cartão e linha de abertura */
  lead: string;
  /** Pontos-chave mostrados no topo */
  takeaways: string[];
  blocks: GuideBlock[];
  faq: { q: string; a: string }[];
  /** Serviço Batimove ligado ao tema */
  cta: { title: string; text: string; label: string; to: string };
}

export interface Guide {
  slug: string;
  /** Caminho francês (o inglês vem de data/i18nRoutes.json) */
  path: string;
  updated: string;
  minutes: number;
  category: { fr: string; en: string };
  sources: { label: string; url: string }[];
  fr: GuideContent;
  en: GuideContent;
}

export const GUIDES: Guide[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'demenager-suisse-france-douane',
    path: '/guides/demenager-suisse-france-douane',
    updated: '2026-11-14',
    minutes: 9,
    category: { fr: 'International', en: 'International' },
    sources: [
      { label: 'OFDF – Formulaire 18.44, effets de déménagement', url: 'https://www.bazg.admin.ch/dam/fr/sd-web/lokVGdOnQG-l/18_44_uebersiedlungsgut_f.pdf' },
      { label: 'OFDF – Questions fréquentes sur le déménagement', url: 'https://www.bazg.admin.ch/fr/faq-demenagement' },
      { label: 'OFDF – Dédouanement des véhicules en cas de déménagement', url: 'https://www.bazg.admin.ch/fr/dedouanement-vehicules-demenagement' },
      { label: 'OFDF – Déménagement de Suisse vers l’étranger', url: 'https://www.bazg.admin.ch/fr/demenagement-exportation-de-suisse' },
      { label: 'Service-Public.fr – Biens personnels lors d’un emménagement en France', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F818' },
      { label: 'Service-Public.fr – Immatriculer un véhicule importé', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F10519' },
      { label: 'OSAV – Voyager avec chiens, chats ou furets', url: 'https://www.blv.admin.ch/fr/voyager-avec-chiens-chats-ou-furets' },
    ],
    fr: {
      h1: 'Déménager entre la Suisse et la France : le guide de la douane',
      lead: "Vos meubles passent la frontière sans taxe si vous respectez quelques règles simples : des biens utilisés depuis au moins 6 mois, un inventaire bien fait et le bon formulaire. Voici ce qu'il faut préparer, dans les deux sens.",
      takeaways: [
        'Entrée en Suisse : formulaire 18.44 en deux exemplaires et inventaire complet.',
        'Les biens doivent avoir été utilisés au moins 6 mois ; les achats plus récents sont taxés.',
        'Vers la France : 12 mois de résidence hors UE, biens possédés depuis 6 mois, pas de revente pendant 12 mois.',
        "On ne dédouane pas le week-end : choisissez un jour ouvrable et un bureau qui traite les marchandises commerciales.",
      ],
      blocks: [
        { t: 'h2', id: 'entrer-en-suisse', text: 'Vous vous installez en Suisse' },
        {
          t: 'p',
          text: "Vos effets de déménagement entrent en franchise, c'est-à-dire sans droits de douane ni TVA, si vous transférez votre domicile en Suisse. Ils doivent avoir été utilisés personnellement pendant au moins 6 mois à l'étranger, et vous devez continuer à les utiliser en Suisse.",
        },
        { t: 'p', text: 'Le document clé est le formulaire 18.44 « Demande/Déclaration d’admission en franchise d’effets de déménagement ». Vous pouvez le remplir en ligne, mais il faut l’imprimer et le signer : la douane le demande en deux exemplaires, avec une signature originale.' },
        { t: 'h2', id: 'documents-suisse', text: 'Les documents à présenter à la frontière' },
        {
          t: 'check',
          items: [
            'Le formulaire 18.44, en deux exemplaires signés',
            'La liste complète de vos biens (inventaire)',
            'Le titre de séjour suisse, sauf si vous êtes ressortissant de l’UE ou de l’AELE',
            'Le permis de circulation étranger de chaque véhicule',
            'La preuve d’achat ou de location du logement en Suisse',
          ],
        },
        { t: 'p', text: 'La douane peut aussi demander un contrat de travail, une attestation de départ de votre ancien pays ou l’attestation d’annonce à votre nouvelle commune. Si un justificatif manque, elle peut taxer provisoirement contre une caution, remboursée si vous apportez les pièces dans les 6 mois.' },
        { t: 'h2', id: 'inventaire', text: 'Faire un bon inventaire' },
        { t: 'p', text: 'L’inventaire peut être fait sur papier libre. Vous pouvez regrouper les petits objets (« 25 cartons de livres »), mais listez individuellement les meubles, les objets de valeur, les gros appareils, l’alcool et les armes. Le poids et la valeur peuvent être estimés.' },
        { t: 'note', title: 'Conseil Batimove', text: 'Numérotez vos cartons et reportez les numéros dans l’inventaire. Au contrôle, vous montrez exactement le carton demandé sans rien déballer.' },
        { t: 'h2', id: 'limites', text: 'Achats récents, alcool et tabac' },
        {
          t: 'table',
          head: ['Bien', 'Règle à l’entrée en Suisse'],
          rows: [
            ['Biens achetés moins de 6 mois avant le déménagement', 'Taxés : gardez les factures'],
            ['Boissons jusqu’à 25 % vol.', '200 litres en franchise'],
            ['Boissons de plus de 25 % vol.', '12 litres en franchise'],
            ['Tabac et provisions', 'En quantité usuelle pour un ménage'],
          ],
        },
        { t: 'h2', id: 'delais', text: 'Délais et envois en plusieurs fois' },
        { t: 'p', text: 'Vos effets doivent être importés au plus tard dans les 2 ans qui suivent votre transfert de domicile. Si une partie arrive plus tard, annoncez-la dès le premier passage, sur une liste séparée : un envoi ultérieur non annoncé perd la franchise.' },
        { t: 'h2', id: 'vehicules-animaux', text: 'Véhicules et animaux' },
        {
          t: 'ul',
          items: [
            'Déclarez le véhicule dès le premier passage de la frontière. Selon les circonstances, il entre en franchise s’il a été utilisé plus de 6 mois avant le déménagement.',
            'La douane remet le rapport d’expertise 13.20 A, nécessaire pour l’immatriculation. Demandez les plaques suisses dans l’année qui suit le changement de domicile.',
            'Chiens, chats et furets venant de l’UE : puce électronique, vaccin contre la rage valable (il faut attendre 21 jours après la première injection) et passeport pour animaux. Cinq animaux au maximum par véhicule privé.',
          ],
        },
        { t: 'h2', id: 'jour-j-suisse', text: 'Le jour du passage' },
        { t: 'p', text: 'Le dédouanement se fait les jours ouvrables, aux heures d’ouverture pour les marchandises commerciales ; seuls quelques grands bureaux ouvrent le samedi matin. Il n’y a pas de rendez-vous à prendre, mais appelez le bureau de douane choisi pour vérifier ses horaires. La centrale d’information de l’OFDF répond au +41 58 467 15 15.' },
        { t: 'h2', id: 'partir-en-france', text: 'Vous quittez la Suisse pour la France' },
        { t: 'p', text: 'Côté suisse, la sortie est simple : un inventaire avec votre adresse en Suisse et votre adresse à l’étranger suffit. Les véhicules se déclarent à l’exportation avec une copie du permis de circulation suisse.' },
        { t: 'p', text: 'Côté français, la franchise s’applique si vous remplissez toutes ces conditions :' },
        {
          t: 'check',
          items: [
            'Au moins 12 mois de résidence hors de l’Union européenne',
            'Transfert de votre résidence principale en France',
            'Biens possédés ou utilisés depuis au moins 6 mois',
            'Importation dans les 12 mois suivant l’installation, en un ou plusieurs envois',
            'Pas de vente, location, prêt ou mise en gage de ces biens pendant 12 mois',
          ],
        },
        { t: 'p', text: 'Préparez le formulaire Cerfa n° 10070, un inventaire détaillé, estimatif, daté et signé en deux exemplaires, des justificatifs de votre ancienne résidence et de votre installation en France, et le certificat d’immatriculation de vos véhicules. La douane vous rend l’inventaire visé et le certificat 846 A, indispensable pour immatriculer la voiture.' },
        { t: 'note', tone: 'warn', title: 'Exclus de la franchise française', text: 'Alcool, tabac, véhicules utilitaires ou mixtes, caravanes, matériel professionnel et mobilier d’une résidence secondaire.' },
        { t: 'h2', id: 'voiture-france', text: 'Immatriculer votre voiture en France' },
        { t: 'p', text: 'Vous avez 1 mois après votre installation, uniquement en ligne sur le site de l’ANTS. Il faut notamment le certificat 846 A, un justificatif de conformité, un contrôle technique de moins de 6 mois si le véhicule a plus de 4 ans, et un justificatif de domicile. Pour une voiture qui vient de Suisse, le quitus fiscal ne figure pas dans la liste : il concerne les véhicules venant de l’UE.' },
      ],
      faq: [
        { q: 'Dois-je payer la TVA suisse sur mes meubles ?', a: 'Non, si ce sont des effets de déménagement utilisés depuis au moins 6 mois et que vous transférez votre domicile en Suisse. Les biens plus récents sont taxés.' },
        { q: 'Mes meubles peuvent-ils arriver après moi ?', a: 'Oui, dans les 2 ans qui suivent votre transfert de domicile, à condition d’annoncer les envois ultérieurs dès le premier passage, sur une liste séparée.' },
        { q: 'Combien de vin puis-je importer avec mon déménagement ?', a: 'En entrant en Suisse : 200 litres de boissons jusqu’à 25 % vol. et 12 litres au-delà, en franchise. En entrant en France, l’alcool est exclu de la franchise.' },
        { q: 'Le déménageur peut-il s’occuper de la douane ?', a: 'Il peut préparer le dossier et l’inventaire avec vous et présenter les biens. Les documents personnels et la signature du formulaire restent les vôtres.' },
      ],
      cta: { title: 'Un déménagement Suisse – France ?', text: 'Inventaire numéroté, emballage et passage en douane : nous organisons le transport de bout en bout.', label: 'Déménagement en France', to: '/demenagement-france' },
    },
    en: {
      h1: 'Moving between Switzerland and France: the customs guide',
      lead: 'Your furniture crosses the border duty-free if you follow a few simple rules: items used for at least 6 months, a proper inventory and the right form. Here is what to prepare, in both directions.',
      takeaways: [
        'Entering Switzerland: form 18.44 in two copies and a complete inventory.',
        'Items must have been used for at least 6 months; more recent purchases are taxed.',
        'Into France: 12 months’ residence outside the EU, items owned for 6 months, no resale for 12 months.',
        'No customs clearance at weekends: pick a working day and an office that handles commercial goods.',
      ],
      blocks: [
        { t: 'h2', id: 'entering-switzerland', text: 'You are moving to Switzerland' },
        { t: 'p', text: 'Your household effects enter duty-free, with no customs duty or VAT, if you are moving your residence to Switzerland. They must have been in your personal use for at least 6 months abroad, and you must keep using them in Switzerland.' },
        { t: 'p', text: 'The key document is form 18.44, the application for duty-free admission of household effects. You can fill it in online, but it has to be printed and signed: customs asks for two copies with an original signature.' },
        { t: 'h2', id: 'documents-switzerland', text: 'Documents to show at the border' },
        {
          t: 'check',
          items: [
            'Form 18.44, two signed copies',
            'A complete list of your belongings (inventory)',
            'Your Swiss residence permit, unless you are an EU or EFTA national',
            'The foreign registration document of each vehicle',
            'Proof of purchase or rental of your home in Switzerland',
          ],
        },
        { t: 'p', text: 'Customs may also ask for an employment contract, a deregistration certificate from your previous country or proof of registration with your new commune. If a document is missing, they can clear the goods provisionally against a deposit, refunded if you provide the papers within 6 months.' },
        { t: 'h2', id: 'inventory', text: 'Making a good inventory' },
        { t: 'p', text: 'The inventory can be on plain paper. You may group small items (“25 boxes of books”), but list furniture, valuables, large appliances, alcohol and weapons individually. Weight and value can be estimated.' },
        { t: 'note', title: 'Batimove tip', text: 'Number your boxes and put the numbers in the inventory. At an inspection you can show exactly the box requested without unpacking anything.' },
        { t: 'h2', id: 'limits', text: 'Recent purchases, alcohol and tobacco' },
        {
          t: 'table',
          head: ['Item', 'Rule when entering Switzerland'],
          rows: [
            ['Items bought less than 6 months before the move', 'Taxed: keep the receipts'],
            ['Drinks up to 25% ABV', '200 litres duty-free'],
            ['Drinks over 25% ABV', '12 litres duty-free'],
            ['Tobacco and provisions', 'Usual household quantities'],
          ],
        },
        { t: 'h2', id: 'deadlines', text: 'Deadlines and several shipments' },
        { t: 'p', text: 'Your effects must be imported within 2 years of moving your residence. If part of them arrives later, declare it on the first crossing on a separate list: a later shipment that was not declared loses the exemption.' },
        { t: 'h2', id: 'vehicles-pets', text: 'Vehicles and pets' },
        {
          t: 'ul',
          items: [
            'Declare the vehicle on the first border crossing. Depending on the circumstances, it enters duty-free if it was used for more than 6 months before the move.',
            'Customs issues test report 13.20 A, needed for registration. Apply for Swiss plates within a year of moving your residence.',
            'Dogs, cats and ferrets from the EU: microchip, valid rabies vaccination (wait 21 days after the first injection) and pet passport. Five animals at most per private vehicle.',
          ],
        },
        { t: 'h2', id: 'crossing-day', text: 'On the day of the crossing' },
        { t: 'p', text: 'Clearance takes place on working days, during the opening hours for commercial goods; only a few large offices open on Saturday mornings. No appointment is needed, but call the chosen customs office to check its hours. The FOCBS information line is +41 58 467 15 15.' },
        { t: 'h2', id: 'moving-to-france', text: 'You are leaving Switzerland for France' },
        { t: 'p', text: 'On the Swiss side, leaving is simple: an inventory with your Swiss address and your address abroad is enough. Vehicles are declared for export with a copy of the Swiss registration document.' },
        { t: 'p', text: 'On the French side, the exemption applies if you meet all of these conditions:' },
        {
          t: 'check',
          items: [
            'At least 12 months’ residence outside the European Union',
            'Your main residence is moving to France',
            'Items owned or used for at least 6 months',
            'Imported within 12 months of settling in, in one or several shipments',
            'No selling, renting, lending or pledging of these items for 12 months',
          ],
        },
        { t: 'p', text: 'Prepare Cerfa form no. 10070, a detailed, valued, dated and signed inventory in two copies, proof of your previous residence and of your settlement in France, and your vehicles’ registration certificates. Customs returns the stamped inventory and certificate 846 A, which you need to register the car.' },
        { t: 'note', tone: 'warn', title: 'Not covered by the French exemption', text: 'Alcohol, tobacco, commercial or dual-purpose vehicles, caravans, professional equipment and furniture for a second home.' },
        { t: 'h2', id: 'car-france', text: 'Registering your car in France' },
        { t: 'p', text: 'You have 1 month after settling in, online only on the ANTS website. You need certificate 846 A, proof of conformity, a roadworthiness test under 6 months old if the vehicle is over 4 years old, and proof of address. For a car coming from Switzerland, the “quitus fiscal” is not on the list: it applies to vehicles from the EU.' },
      ],
      faq: [
        { q: 'Do I pay Swiss VAT on my furniture?', a: 'No, if these are household effects used for at least 6 months and you are moving your residence to Switzerland. More recent items are taxed.' },
        { q: 'Can my furniture arrive after me?', a: 'Yes, within 2 years of moving your residence, as long as later shipments are declared on the first crossing on a separate list.' },
        { q: 'How much wine can I bring with my move?', a: 'Entering Switzerland: 200 litres of drinks up to 25% ABV and 12 litres above that, duty-free. Entering France, alcohol is excluded from the exemption.' },
        { q: 'Can the removal company handle customs?', a: 'It can prepare the file and inventory with you and present the goods. Personal documents and signing the form remain yours.' },
      ],
      cta: { title: 'Moving between Switzerland and France?', text: 'Numbered inventory, packing and customs crossing: we organise the transport from start to finish.', label: 'Removals to France', to: '/demenagement-france' },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'annonces-demenagement-geneve-vaud',
    path: '/guides/annonces-demenagement-geneve-vaud',
    updated: '2026-11-14',
    minutes: 8,
    category: { fr: 'Démarches', en: 'Formalities' },
    sources: [
      { label: 'État de Genève – Annoncer un changement d’adresse', url: 'https://www.ge.ch/annoncer-changement-adresse-geneve/comment-annoncer-votre-changement-adresse' },
      { label: 'État de Genève – Annoncer mon arrivée (OCPM)', url: 'https://www.ge.ch/annoncer-mon-arrivee-office-cantonal-population-migrations' },
      { label: 'État de Genève – Annoncer mon départ', url: 'https://www.ge.ch/annoncer-mon-depart-ocpm/annoncer-mon-depart' },
      { label: 'État de Genève – Je quitte Genève pour un autre canton (impôts)', url: 'https://www.ge.ch/annoncer-mon-arrivee-mon-depart-aux-impots/je-quitte-geneve-autre-canton' },
      { label: 'Canton de Vaud – Changement d’adresse', url: 'https://www.vd.ch/population/controle-des-habitants/changement-dadresse' },
      { label: 'Ville de Lausanne – Arrivée et inscription', url: 'https://www.lausanne.ch/prestations/controle-des-habitants/arrivee-inscription-suisse.html' },
      { label: 'La Poste – Changement d’adresse avec réexpédition', url: 'https://www.post.ch/en/receiving-mail/relocation/change-of-address-with-forwarding' },
      { label: 'Priminfo (OFSP) – Changer d’assurance-maladie', url: 'https://www.priminfo.admin.ch/fr/zahlen-und-fakten/wechsel' },
    ],
    fr: {
      h1: 'Déménager à Genève ou dans le canton de Vaud : toutes les démarches à annoncer',
      lead: "Commune, impôts, véhicule, énergie, courrier : un déménagement se prépare aussi sur le papier. Voici qui prévenir, dans quel délai, avec les liens officiels pour Genève et Vaud.",
      takeaways: [
        'Genève : changement d’adresse à l’OCPM dans les 14 jours, gratuit en ligne.',
        'Vaud : la loi cantonale prévoit 8 jours ; certaines communes, comme Lausanne, indiquent 14 jours. Vérifiez auprès de la vôtre.',
        'Le canton où vous habitez le 31 décembre vous impose pour toute l’année.',
        'Serafe n’a pas besoin d’être prévenue : elle reçoit les données du contrôle des habitants.',
      ],
      blocks: [
        { t: 'h2', id: 'geneve', text: 'Vous habitez ou arrivez à Genève' },
        {
          t: 'table',
          head: ['Démarche', 'Délai', 'À savoir'],
          rows: [
            ['Changement d’adresse dans le canton (OCPM)', '14 jours', 'Gratuit en ligne avec un compte e-démarches ; joindre le bail'],
            ['Arrivée à Genève (OCPM)', '14 jours', 'Démarche différente selon la nationalité et la provenance'],
            ['Départ du canton ou de Suisse (OCPM)', 'Au plus tard 2 semaines avant', 'Annonce gratuite ; attestation de départ CHF 25 par personne (tarif indiqué par l’OCPM)'],
            ['Impôts, départ vers un autre canton', 'Au plus tard 15 jours avant', 'Passer à l’administration fiscale'],
            ['Électricité, eau, gaz (SIG)', 'Au moins 4 jours ouvrés avant', 'Frais de dossier réduits en ligne'],
          ],
        },
        { t: 'p', text: 'Pour un changement d’adresse en ligne, il faut un compte e-démarches vérifié et votre numéro AVS ; la lettre d’activation arrive en quelques jours ouvrables. Anticipez si vous n’avez pas encore de compte.' },
        { t: 'h2', id: 'vaud', text: 'Vous habitez ou arrivez dans le canton de Vaud' },
        { t: 'p', text: 'La loi vaudoise sur le contrôle des habitants demande d’annoncer une arrivée ou un changement d’adresse dans les 8 jours, même pour un déménagement dans le même immeuble. Un départ s’annonce sans délai. Certaines communes affichent un délai plus long : Lausanne indique 14 jours. Le plus sûr est de suivre ce qu’indique votre commune.' },
        {
          t: 'ul',
          items: [
            'eDéménagement : possible en ligne si votre ancienne et votre nouvelle commune y participent ; sinon, au guichet.',
            'Arrivée à Lausanne depuis un autre canton ou l’étranger : en personne, sur rendez-vous, avec pièce d’identité, bail et acte d’origine.',
            'Véhicule : nouvelle adresse au service des automobiles (SAN) dans les 14 jours.',
            'Électricité à Lausanne (SiL) : annonce au moins 15 jours ouvrables avant, en ligne.',
          ],
        },
        { t: 'h2', id: 'impots', text: 'Impôts : le jour qui compte est le 31 décembre' },
        { t: 'p', text: 'Si vous changez de canton en cours d’année, c’est le canton où vous habitez au 31 décembre qui vous impose pour toute l’année. Les acomptes versés à l’ancien canton vous sont remboursés. Un déménagement de Genève à Lausanne en octobre, par exemple, vous rend contribuable vaudois pour toute l’année.' },
        { t: 'h2', id: 'autres', text: 'Les autres organismes à prévenir' },
        {
          t: 'check',
          items: [
            'La Poste : réexpédition du courrier, à commander de préférence 4 jours ouvrables avant',
            'Votre assurance-maladie et vos assurances ménage et RC',
            'Votre employeur et votre banque',
            'L’école ou la crèche des enfants',
            'Les abonnements : internet, téléphone, transports',
          ],
        },
        { t: 'note', title: 'Serafe et assurance-maladie', text: 'Serafe reçoit votre nouvelle adresse du contrôle des habitants : rien à faire de votre côté. Pour l’assurance-maladie, un changement de caisse se fait jusqu’au 30 novembre pour le 1er janvier ; un déménagement ne permet d’en changer en cours d’année que si votre caisse n’est pas active dans le nouveau canton.' },
        { t: 'h2', id: 'poste', text: 'Réexpédition du courrier' },
        { t: 'p', text: 'La Poste propose une réexpédition de 6, 12 ou 18 mois, moins chère en ligne qu’au guichet (à titre indicatif : de CHF 35 à 55 en ligne pour la Suisse). Pour un départ à l’étranger, comptez environ CHF 90 en ligne pour 12 mois. Vérifiez le tarif actuel sur le site de La Poste.' },
        { t: 'h2', id: 'calendrier', text: 'Le calendrier en un coup d’œil' },
        {
          t: 'ol',
          items: [
            'Un mois avant : résiliation du bail confirmée, devis de déménagement, autorisation de stationnement si nécessaire.',
            'Deux semaines avant : annonce de départ si vous quittez le canton, impôts, énergie, réexpédition du courrier.',
            'Le jour J : relevés des compteurs, photos du logement vide.',
            'Dans les 8 à 14 jours : annonce d’arrivée ou de changement d’adresse, puis véhicule.',
          ],
        },
      ],
      faq: [
        { q: 'En combien de jours dois-je annoncer mon déménagement ?', a: 'À Genève, 14 jours auprès de l’OCPM. Dans le canton de Vaud, la loi prévoit 8 jours, mais certaines communes comme Lausanne indiquent 14 jours : suivez la règle de votre commune.' },
        { q: 'Dois-je prévenir Serafe ?', a: 'Non. Serafe reçoit les données du contrôle des habitants. Si l’adresse ou la composition du ménage est fausse, adressez-vous à votre commune.' },
        { q: 'Quel canton me taxe si je déménage en cours d’année ?', a: 'Celui où vous habitez le 31 décembre, pour toute l’année.' },
        { q: 'Le changement d’adresse est-il payant à Genève ?', a: 'Non, il est gratuit. Des frais s’appliquent seulement si votre permis doit être refait avec données biométriques.' },
      ],
      cta: { title: 'Le déménagement, on s’en charge.', text: 'Vous gérez les démarches, nous gérons les cartons, le transport et le nettoyage de fin de bail.', label: 'Demander un devis', to: '/quote' },
    },
    en: {
      h1: 'Moving in Geneva or the canton of Vaud: every formality to report',
      lead: 'Commune, taxes, car, energy, post: a move also happens on paper. Here is who to tell and when, with the official links for Geneva and Vaud.',
      takeaways: [
        'Geneva: change of address with the OCPM within 14 days, free online.',
        'Vaud: cantonal law says 8 days; some communes, such as Lausanne, state 14 days. Check with yours.',
        'The canton you live in on 31 December taxes you for the whole year.',
        'No need to tell Serafe: it receives the data from the residents’ office.',
      ],
      blocks: [
        { t: 'h2', id: 'geneva', text: 'You live in or are moving to Geneva' },
        {
          t: 'table',
          head: ['Formality', 'Deadline', 'Good to know'],
          rows: [
            ['Change of address within the canton (OCPM)', '14 days', 'Free online with an e-démarches account; attach the lease'],
            ['Arrival in Geneva (OCPM)', '14 days', 'The procedure depends on nationality and where you come from'],
            ['Leaving the canton or Switzerland (OCPM)', 'At least 2 weeks before', 'Free notice; departure certificate CHF 25 per person (OCPM rate)'],
            ['Taxes, moving to another canton', 'At least 15 days before', 'Visit the tax administration'],
            ['Electricity, water, gas (SIG)', 'At least 4 working days before', 'Lower handling fee online'],
          ],
        },
        { t: 'p', text: 'To change your address online you need a verified e-démarches account and your AHV number; the activation letter takes a few working days. Plan ahead if you do not have an account yet.' },
        { t: 'h2', id: 'vaud', text: 'You live in or are moving to the canton of Vaud' },
        { t: 'p', text: 'The Vaud law on residents’ registration requires you to report an arrival or a change of address within 8 days, even for a move within the same building. A departure is reported without delay. Some communes show a longer deadline: Lausanne states 14 days. The safest is to follow what your commune says.' },
        {
          t: 'ul',
          items: [
            'eDéménagement: possible online if both your old and new communes take part; otherwise at the counter.',
            'Arriving in Lausanne from another canton or abroad: in person, by appointment, with ID, lease and certificate of origin.',
            'Car: new address to the vehicle office (SAN) within 14 days.',
            'Electricity in Lausanne (SiL): notify at least 15 working days before, online.',
          ],
        },
        { t: 'h2', id: 'taxes', text: 'Taxes: the day that counts is 31 December' },
        { t: 'p', text: 'If you change canton during the year, the canton where you live on 31 December taxes you for the whole year. Instalments paid to the previous canton are refunded. Moving from Geneva to Lausanne in October, for example, makes you a Vaud taxpayer for the full year.' },
        { t: 'h2', id: 'others', text: 'Other organisations to inform' },
        {
          t: 'check',
          items: [
            'Swiss Post: mail forwarding, ideally ordered 4 working days before',
            'Your health insurer and your household and liability insurers',
            'Your employer and your bank',
            'Your children’s school or nursery',
            'Subscriptions: internet, phone, public transport',
          ],
        },
        { t: 'note', title: 'Serafe and health insurance', text: 'Serafe gets your new address from the residents’ office: nothing to do on your side. For health insurance, switching provider is possible until 30 November for 1 January; a move only lets you switch mid-year if your insurer is not active in the new canton.' },
        { t: 'h2', id: 'post', text: 'Mail forwarding' },
        { t: 'p', text: 'Swiss Post offers forwarding for 6, 12 or 18 months, cheaper online than at the counter (as a guide: CHF 35 to 55 online within Switzerland). For a move abroad, expect around CHF 90 online for 12 months. Check the current rate on the Swiss Post website.' },
        { t: 'h2', id: 'timeline', text: 'The timeline at a glance' },
        {
          t: 'ol',
          items: [
            'One month before: lease termination confirmed, removal quote, parking permit if needed.',
            'Two weeks before: departure notice if you are leaving the canton, taxes, energy, mail forwarding.',
            'Moving day: meter readings, photos of the empty home.',
            'Within 8 to 14 days: report your arrival or change of address, then your car.',
          ],
        },
      ],
      faq: [
        { q: 'How many days do I have to report my move?', a: 'In Geneva, 14 days with the OCPM. In Vaud, the law says 8 days, but some communes such as Lausanne state 14 days: follow your commune’s rule.' },
        { q: 'Do I need to tell Serafe?', a: 'No. Serafe receives the data from the residents’ office. If the address or household is wrong, contact your commune.' },
        { q: 'Which canton taxes me if I move mid-year?', a: 'The one you live in on 31 December, for the whole year.' },
        { q: 'Does a change of address cost anything in Geneva?', a: 'No, it is free. Fees only apply if your permit has to be reissued with biometric data.' },
      ],
      cta: { title: 'We take care of the move.', text: 'You handle the formalities, we handle the boxes, the transport and the end of tenancy cleaning.', label: 'Request a quote', to: '/quote' },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'resilier-bail-geneve-vaud',
    path: '/guides/resilier-bail-geneve-vaud',
    updated: '2026-11-14',
    minutes: 7,
    category: { fr: 'Bail', en: 'Lease' },
    sources: [
      { label: 'Code des obligations, art. 264, 266a, 266c, 266l, 266m et 266o (Fedlex)', url: 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr' },
      { label: 'Canton de Vaud – Règles et usages locatifs (RULV)', url: 'https://www.vd.ch/territoire-et-construction/logement/droit-du-bail' },
      { label: 'OFL – Le logement en Suisse (guide, 2022)', url: 'https://www.bwo.admin.ch/dam/fr/sd-web/91P4EJuLuPSK/franzoesisch.pdf' },
      { label: 'ASLOCA Genève – Résiliation du bail', url: 'https://geneve.asloca.ch/faq/resiliation-bail' },
    ],
    fr: {
      h1: 'Résilier son bail à Genève ou dans le canton de Vaud',
      lead: 'Trois mois de préavis, un terme à respecter, une lettre signée par les bonnes personnes : une résiliation mal faite peut vous coûter des mois de loyer. Voici comment faire juste, et comment partir plus tôt.',
      takeaways: [
        'Préavis légal : 3 mois, pour un terme prévu par l’usage local ou par votre bail.',
        'Vaud : termes usuels au 1er avril, 1er juillet et 1er octobre, à midi.',
        'Logement de la famille : la lettre doit être signée par les deux époux ou partenaires.',
        'Un congé envoyé trop tard n’est pas nul : il vaut pour le terme suivant.',
      ],
      blocks: [
        { t: 'h2', id: 'delai', text: 'Le délai et le terme' },
        { t: 'p', text: 'Pour un logement, le Code des obligations prévoit un délai de congé de 3 mois, pour le terme fixé par l’usage local ou, à défaut, pour la fin d’un trimestre de bail (art. 266c). Votre contrat peut prévoir un délai plus long ou d’autres termes : c’est donc lui qu’il faut lire en premier.' },
        {
          t: 'table',
          head: ['Canton', 'Ce qui fixe les dates possibles'],
          rows: [
            ['Vaud', 'Règles et usages locatifs : 1er avril, 1er juillet et 1er octobre, à midi (pas de terme en janvier), sauf clause contraire du bail'],
            ['Genève', 'Les échéances prévues par votre bail et ses conditions générales ; à défaut, la fin d’un trimestre de bail'],
          ],
        },
        { t: 'note', title: 'Exemple vaudois', text: 'Pour quitter au 1er juillet, votre lettre doit être reçue par la régie au plus tard le 1er avril. Si elle arrive le 2 avril, le congé vaut pour le 1er octobre.' },
        { t: 'h2', id: 'forme', text: 'La forme : écrite et signée' },
        { t: 'p', text: 'Le congé se donne par écrit (art. 266l). Contrairement au bailleur, le locataire n’a pas de formulaire officiel à utiliser : une lettre suffit. Indiquez l’adresse du logement, la date de fin souhaitée et signez.' },
        { t: 'p', text: 'S’il s’agit du logement de la famille, un époux ou un partenaire enregistré ne peut résilier sans le consentement exprès de l’autre (art. 266m). Faites signer la lettre par les deux : un congé sans ce consentement est nul (art. 266o).' },
        { t: 'h2', id: 'reception', text: 'Quand la lettre compte-t-elle comme reçue ?' },
        { t: 'p', text: 'Ce qui compte, c’est la date à laquelle la lettre arrive chez la régie ou le bailleur, pas la date d’envoi. Le recommandé n’est pas obligatoire, mais il vous donne une preuve : envoyez-le avec une bonne marge, une à deux semaines avant la date limite.' },
        { t: 'h2', id: 'partir-plus-tot', text: 'Partir avant le terme : le locataire de remplacement' },
        { t: 'p', text: 'Vous pouvez être libéré plus tôt si vous présentez un nouveau locataire solvable, que le bailleur ne peut raisonnablement refuser, et qui est prêt à reprendre le bail aux mêmes conditions (art. 264). Sinon, vous restez redevable du loyer jusqu’au prochain terme.' },
        {
          t: 'check',
          items: [
            'Écrivez à la régie la date à laquelle vous rendez le logement',
            'Présentez au moins un candidat avec un dossier complet (plusieurs, c’est mieux)',
            'Gardez une copie de tout ce que vous envoyez',
            'Si la régie refuse un candidat acceptable, vous êtes libéré',
          ],
        },
        { t: 'p', text: 'Dans le canton de Vaud, les règles et usages locatifs précisent qu’en cas d’objection fondée du bailleur, le locataire respecte un préavis d’au moins un mois pour le 15 ou la fin d’un mois. Pendant cette période, les visites peuvent être annoncées 24 heures à l’avance.' },
        { t: 'h2', id: 'apres', text: 'Après la résiliation' },
        { t: 'p', text: 'Demandez à la régie une confirmation écrite de la date de sortie et fixez le rendez-vous de l’état des lieux. Réservez ensuite le déménagement et le nettoyage : les créneaux de fin de mois partent vite, surtout aux termes vaudois.' },
      ],
      faq: [
        { q: 'Quel est le préavis pour quitter mon appartement ?', a: '3 mois au minimum, pour un terme prévu par l’usage local ou par votre bail. Votre contrat peut prévoir plus long.' },
        { q: 'Ma résiliation est-elle valable sans la signature de mon conjoint ?', a: 'Non, s’il s’agit du logement de la famille : il faut le consentement exprès de l’autre époux ou partenaire, sinon le congé est nul.' },
        { q: 'Si j’envoie la lettre en retard, le congé est-il nul ?', a: 'Non. Il est valable pour le prochain terme possible.' },
        { q: 'Existe-t-il un formulaire officiel pour résilier ?', a: 'Pas pour le locataire, ni à Genève ni dans le canton de Vaud. Une lettre signée suffit.' },
      ],
      cta: { title: 'Votre date de sortie est fixée ?', text: 'Réservez le déménagement et le nettoyage de fin de bail en même temps, avec un seul interlocuteur.', label: 'Demander un devis', to: '/quote' },
    },
    en: {
      h1: 'Ending your lease in Geneva or the canton of Vaud',
      lead: 'Three months’ notice, a termination date to respect, a letter signed by the right people: a badly given notice can cost you months of rent. Here is how to do it right, and how to leave earlier.',
      takeaways: [
        'Legal notice: 3 months, for a date set by local custom or by your lease.',
        'Vaud: usual dates are 1 April, 1 July and 1 October, at noon.',
        'Family home: the letter must be signed by both spouses or partners.',
        'A notice sent too late is not void: it applies to the next possible date.',
      ],
      blocks: [
        { t: 'h2', id: 'notice', text: 'Notice period and termination date' },
        { t: 'p', text: 'For a home, the Code of Obligations sets a 3-month notice period, for the date set by local custom or, failing that, for the end of a quarter of the lease (art. 266c). Your contract may set a longer period or other dates, so read it first.' },
        {
          t: 'table',
          head: ['Canton', 'What sets the possible dates'],
          rows: [
            ['Vaud', 'Rental rules and customs: 1 April, 1 July and 1 October, at noon (no date in January), unless the lease says otherwise'],
            ['Geneva', 'The dates in your lease and its general conditions; failing that, the end of a quarter of the lease'],
          ],
        },
        { t: 'note', title: 'Vaud example', text: 'To leave on 1 July, the letting agency must receive your letter by 1 April at the latest. If it arrives on 2 April, the notice applies to 1 October.' },
        { t: 'h2', id: 'form', text: 'The form: written and signed' },
        { t: 'p', text: 'Notice is given in writing (art. 266l). Unlike the landlord, the tenant has no official form to use: a letter is enough. State the address, the end date you want and sign it.' },
        { t: 'p', text: 'If it is the family home, a spouse or registered partner cannot give notice without the other’s express consent (art. 266m). Have both sign the letter: a notice without this consent is void (art. 266o).' },
        { t: 'h2', id: 'receipt', text: 'When does the letter count as received?' },
        { t: 'p', text: 'What counts is when the letter reaches the letting agency or landlord, not when you send it. Registered post is not required, but it gives you proof: send it with a good margin, one to two weeks before the deadline.' },
        { t: 'h2', id: 'leaving-early', text: 'Leaving early: the replacement tenant' },
        { t: 'p', text: 'You can be released early if you present a new tenant who is solvent, whom the landlord cannot reasonably refuse, and who is willing to take over the lease on the same terms (art. 264). Otherwise you owe the rent until the next termination date.' },
        {
          t: 'check',
          items: [
            'Write to the letting agency with the date you will hand back the flat',
            'Present at least one candidate with a complete file (several is better)',
            'Keep a copy of everything you send',
            'If the agency refuses an acceptable candidate, you are released',
          ],
        },
        { t: 'p', text: 'In the canton of Vaud, the rental rules specify that if the landlord has a well-founded objection, the tenant gives at least one month’s notice for the 15th or the end of a month. During this period, viewings can be announced 24 hours ahead.' },
        { t: 'h2', id: 'after', text: 'After giving notice' },
        { t: 'p', text: 'Ask the letting agency for written confirmation of the move-out date and book the inspection appointment. Then book the removal and the cleaning: end-of-month slots go quickly, especially around the Vaud termination dates.' },
      ],
      faq: [
        { q: 'How much notice do I need to give?', a: '3 months at least, for a date set by local custom or your lease. Your contract may require more.' },
        { q: 'Is my notice valid without my spouse’s signature?', a: 'Not for the family home: the other spouse or partner must expressly consent, otherwise the notice is void.' },
        { q: 'If I send the letter late, is the notice void?', a: 'No. It is valid for the next possible termination date.' },
        { q: 'Is there an official form to give notice?', a: 'Not for tenants, in Geneva or in Vaud. A signed letter is enough.' },
      ],
      cta: { title: 'Move-out date confirmed?', text: 'Book the removal and the end of tenancy cleaning together, with one point of contact.', label: 'Request a quote', to: '/quote' },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'etat-des-lieux-sortie',
    path: '/guides/etat-des-lieux-sortie',
    updated: '2026-11-14',
    minutes: 8,
    category: { fr: 'Bail', en: 'Lease' },
    sources: [
      { label: 'Code des obligations, art. 257e, 267 et 267a (Fedlex)', url: 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/fr' },
      { label: 'Canton de Vaud – Règles et usages locatifs (RULV)', url: 'https://www.vd.ch/territoire-et-construction/logement/droit-du-bail' },
      { label: 'Genève – Règles et usages locatifs, annexe au RSG I 4 05.01', url: 'https://silgeneve.ch/legis/program/books/rsg/htm/I405p01_annexe1.pdf' },
      { label: 'OFL – Le logement en Suisse (guide, 2022)', url: 'https://www.bwo.admin.ch/dam/fr/sd-web/91P4EJuLuPSK/franzoesisch.pdf' },
    ],
    fr: {
      h1: 'État des lieux de sortie et nettoyage de fin de bail : le guide complet',
      lead: "Le jour de l'état des lieux décide du sort de votre garantie de loyer. Ce que vous devez rendre, ce que la régie peut vous facturer, et comment préparer le rendez-vous pour que tout se passe bien.",
      takeaways: [
        'Vous rendez le logement dans l’état qui résulte d’un usage normal : l’usure normale n’est pas à votre charge.',
        'La régie doit signaler les défauts immédiatement, sinon vous êtes déchargé (sauf défauts cachés).',
        'Ne signez rien qui reconnaisse une dette : inscrivez votre désaccord sur le document.',
        'La garantie (3 mois de loyer au maximum) est libérée si aucune procédure n’est ouverte dans l’année.',
      ],
      blocks: [
        { t: 'h2', id: 'usure', text: 'Usure normale ou dégât ?' },
        { t: 'p', text: 'Vous devez restituer le logement dans l’état qui résulte d’un usage conforme au contrat (art. 267 CO). Les traces d’un usage normal, comme une peinture qui a vieilli, ne sont pas à votre charge. Les dégâts, comme une brûlure, des griffures profondes ou des taches importantes, le sont.' },
        { t: 'p', text: 'Pour un élément à remplacer, vous ne payez au plus que sa valeur restante, calculée selon sa durée de vie. En Suisse romande, les régies et les associations de locataires utilisent pour cela un tableau paritaire des amortissements : il donne des durées de vie indicatives, sans force de loi.' },
        { t: 'note', title: 'Exemple', text: 'Une moquette prévue pour durer 10 ans, abîmée après 8 ans : vous ne payez au plus que les 2 années restantes, pas une moquette neuve.' },
        { t: 'h2', id: 'nettoyage', text: 'Ce que le nettoyage doit couvrir' },
        { t: 'p', text: 'Le logement doit être rendu propre et vide. Dans le canton de Vaud, les règles et usages locatifs précisent qu’en plus des nettoyages usuels il faut faire le filtre de ventilation, les stores à lamelles, les jalousies, les écoulements accessibles et les radiateurs. Le bouilleur non détartré depuis 3 ans est aussi à la charge du locataire sortant.' },
        {
          t: 'check',
          items: [
            'Cuisine : four, plaques, hotte et son filtre, frigo dégivré, armoires intérieur et extérieur',
            'Salle de bain : calcaire, joints, siphons, miroir, ventilation',
            'Fenêtres, cadres, stores et volets, intérieur et extérieur',
            'Sols contrôlables partout, y compris sous les meubles fixes',
            'Radiateurs, prises, interrupteurs, portes et plinthes',
            'Cave, galetas et boîte aux lettres vidés',
          ],
        },
        { t: 'note', title: 'Garantie de réception', text: 'Beaucoup d’entreprises de nettoyage proposent une « garantie de réception » : si la régie conteste la propreté, elles reviennent gratuitement. C’est une pratique commerciale, pas une règle de droit : lisez ce qu’elle couvre et ce qu’elle exclut.' },
        { t: 'h2', id: 'jour-j', text: 'Le jour du rendez-vous' },
        {
          t: 'check',
          items: [
            'Apportez l’état des lieux d’entrée, des photos datées et les factures de travaux',
            'Préparez toutes les clés et badges, doubles compris',
            'Relevez les compteurs',
            'Lisez chaque remarque avant de signer ; écrivez votre désaccord sur le document',
            'Ne signez aucune reconnaissance de dette ni aucun montant',
            'Demandez une copie sur place et donnez votre nouvelle adresse',
          ],
        },
        { t: 'p', text: 'Dans le canton de Vaud, l’état des lieux signé sur place ne vaut pas reconnaissance de dette. Une clé perdue n’oblige à payer le changement de cylindre que pour une serrure de sécurité.' },
        { t: 'h2', id: 'defauts', text: 'Les défauts découverts après coup' },
        { t: 'p', text: 'Le bailleur doit vérifier le logement et vous signaler immédiatement les défauts dont vous répondez (art. 267a). S’il ne le fait pas, vous êtes déchargé. Seuls les défauts cachés, qu’une vérification normale ne permettait pas de voir, peuvent être signalés plus tard, dès leur découverte.' },
        { t: 'h2', id: 'garantie', text: 'Récupérer votre garantie de loyer' },
        { t: 'p', text: 'La garantie est de 3 mois de loyer au maximum, déposée sur un compte bloqué à votre nom (art. 257e). Elle est libérée avec l’accord des deux parties ou par décision de justice. Si le bailleur n’a ouvert aucune procédure ni poursuite dans l’année qui suit la fin du bail, vous pouvez exiger sa restitution.' },
      ],
      faq: [
        { q: 'Dois-je repeindre en partant ?', a: 'Pas si la peinture a simplement vieilli : c’est de l’usure normale. Les dégâts au-delà de l’usage normal sont à réparer ou à payer, au plus à leur valeur restante.' },
        { q: 'Dois-je signer l’état des lieux si je ne suis pas d’accord ?', a: 'Vous pouvez signer en inscrivant votre désaccord sur le document. Ne signez jamais une reconnaissance de dette ni un montant.' },
        { q: 'La régie peut-elle me facturer un défaut découvert après ?', a: 'Seulement un défaut caché, signalé dès sa découverte. Les défauts visibles doivent être signalés immédiatement après l’état des lieux.' },
        { q: 'Quand vais-je récupérer ma garantie ?', a: 'Dès que les deux parties sont d’accord. Sans procédure ouverte par le bailleur dans l’année qui suit la fin du bail, vous pouvez exiger sa restitution.' },
      ],
      cta: { title: 'Un nettoyage prêt pour la régie.', text: 'Nettoyage de fin de bail avec retouche gratuite si la régie fait une remarque, réservé avec votre déménagement.', label: 'Nettoyage de fin de bail', to: '/nettoyage-fin-de-bail' },
    },
    en: {
      h1: 'Move-out inspection and end of tenancy cleaning: the complete guide',
      lead: 'The day of the move-out inspection decides what happens to your rental deposit. What you must hand back, what the letting agency can charge, and how to prepare so it goes smoothly.',
      takeaways: [
        'You return the home in the condition that results from normal use: normal wear and tear is not your cost.',
        'The agency must report defects immediately, otherwise you are released (except hidden defects).',
        'Do not sign anything acknowledging a debt: write your disagreement on the document.',
        'The deposit (3 months’ rent at most) is released if no proceedings are started within a year.',
      ],
      blocks: [
        { t: 'h2', id: 'wear', text: 'Normal wear or damage?' },
        { t: 'p', text: 'You must return the home in the condition that results from use in line with the contract (art. 267 CO). Signs of normal use, such as paint that has aged, are not your cost. Damage, such as a burn, deep scratches or large stains, is.' },
        { t: 'p', text: 'For an item that has to be replaced, you pay at most its remaining value, based on its lifespan. In French-speaking Switzerland, agencies and tenants’ associations use a joint depreciation table for this: it gives indicative lifespans, without force of law.' },
        { t: 'note', title: 'Example', text: 'A carpet expected to last 10 years, damaged after 8: you pay at most the 2 remaining years, not a new carpet.' },
        { t: 'h2', id: 'cleaning', text: 'What the cleaning must cover' },
        { t: 'p', text: 'The home must be returned clean and empty. In the canton of Vaud, the rental rules add the ventilation filter, slatted blinds, shutters, accessible drains and radiators to the usual cleaning. A water heater not descaled in the last 3 years is also the outgoing tenant’s cost.' },
        {
          t: 'check',
          items: [
            'Kitchen: oven, hob, hood and filter, defrosted fridge, cupboards inside and out',
            'Bathroom: limescale, grout, traps, mirror, ventilation',
            'Windows, frames, blinds and shutters, inside and out',
            'All floors accessible, including under fixed furniture',
            'Radiators, sockets, switches, doors and skirting boards',
            'Cellar, attic and letterbox emptied',
          ],
        },
        { t: 'note', title: 'Handover guarantee', text: 'Many cleaning companies offer a “handover guarantee”: if the agency disputes the cleanliness, they come back free of charge. It is a market practice, not a legal rule: check what it covers and excludes.' },
        { t: 'h2', id: 'day', text: 'On the day of the appointment' },
        {
          t: 'check',
          items: [
            'Bring the move-in report, dated photos and invoices for any work',
            'Have all keys and badges ready, including copies',
            'Read the meters',
            'Read every comment before signing; write your disagreement on the document',
            'Do not sign any acknowledgement of debt or any amount',
            'Ask for a copy on the spot and give your new address',
          ],
        },
        { t: 'p', text: 'In the canton of Vaud, the inspection report signed on site is not an acknowledgement of debt. A lost key only makes you pay for a new cylinder if it is a security lock.' },
        { t: 'h2', id: 'later', text: 'Defects found afterwards' },
        { t: 'p', text: 'The landlord must check the home and report the defects you are liable for immediately (art. 267a). If not, you are released. Only hidden defects, which a normal check could not reveal, can be reported later, as soon as they are found.' },
        { t: 'h2', id: 'deposit', text: 'Getting your deposit back' },
        { t: 'p', text: 'The deposit is at most 3 months’ rent, held in a blocked account in your name (art. 257e). It is released with both parties’ agreement or by a court decision. If the landlord has started no legal proceedings or debt collection within a year of the end of the lease, you can demand its return.' },
      ],
      faq: [
        { q: 'Do I have to repaint when I leave?', a: 'Not if the paint has simply aged: that is normal wear. Damage beyond normal use must be repaired or paid for, at most at its remaining value.' },
        { q: 'Should I sign the report if I disagree?', a: 'You can sign while writing your disagreement on the document. Never sign an acknowledgement of debt or an amount.' },
        { q: 'Can the agency charge me for a defect found later?', a: 'Only a hidden defect, reported as soon as it is found. Visible defects must be reported immediately after the inspection.' },
        { q: 'When will I get my deposit back?', a: 'As soon as both parties agree. If the landlord starts no proceedings within a year of the end of the lease, you can demand its return.' },
      ],
      cta: { title: 'Cleaning ready for the letting agency.', text: 'End of tenancy cleaning with a free touch-up if the agency flags anything, booked together with your removal.', label: 'End of tenancy cleaning', to: '/nettoyage-fin-de-bail' },
    },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'autorisation-stationnement-demenagement',
    path: '/guides/autorisation-stationnement-demenagement',
    updated: '2026-11-14',
    minutes: 6,
    category: { fr: 'Démarches', en: 'Formalities' },
    sources: [
      { label: 'Ville de Genève – Autorisation d’utiliser l’espace public pour un déménagement', url: 'https://www.geneve.ch/demarches/demander-autorisation-utilisation-espace-public-effectuer-demenagement' },
      { label: 'État de Genève – Réserver des places de stationnement sur la voie publique', url: 'https://www.ge.ch/stationner-geneve/reserver-places-stationnement-voie-publique' },
      { label: 'Ville de Lausanne – Réservation de place de parc pour un déménagement', url: 'https://www.lausanne.ch/prestations/police/reservation-place-de-parc-demenagement.html' },
      { label: 'Ville de Lausanne – Permis d’utilisation temporaire du domaine public', url: 'https://www.lausanne.ch/prestations/police/demande-permis-utilisation-temporaire-domaine-public.html' },
    ],
    fr: {
      h1: 'Réserver une place pour le camion de déménagement à Genève et Lausanne',
      lead: "Un camion garé loin de l'entrée, c'est des heures de portage en plus. Réserver l'emplacement est en principe la démarche du locataire, et elle se prépare au moins 10 jours ouvrables à l'avance. Voici la marche à suivre.",
      takeaways: [
        'Ville de Genève : demande en ligne au moins 10 jours ouvrables avant, permission et taxe d’utilisation du domaine public.',
        'Autres communes genevoises : la demande se fait auprès de la commune où se trouvent les places.',
        'Lausanne : formulaire en ligne avec un compte myLausanne, au moins 7 jours ouvrables avant.',
        'Un monte-meubles demande, à Lausanne, un permis séparé.',
      ],
      blocks: [
        { t: 'h2', id: 'geneve', text: 'En Ville de Genève' },
        { t: 'p', text: 'Toute utilisation du domaine public pour un déménagement est soumise à une permission et à une redevance. La demande se fait en ligne sur le portail des démarches de la Ville, au minimum 10 jours ouvrables avant la date. La prestation elle-même est gratuite, mais la taxe d’utilisation du domaine public reste due.' },
        { t: 'h2', id: 'canton-geneve', text: 'Dans les autres communes genevoises' },
        { t: 'p', text: 'Selon l’État de Genève, l’autorisation se demande à la commune où se trouvent les places, pour 8 jours au maximum. Les panneaux doivent être posés au moins 3 jours avant le début de la réservation, dimanches et jours fériés non compris ; selon la commune, c’est elle qui les pose ou une entreprise privée. La liste des plaques des voitures déjà garées au moment de la pose doit être transmise à la police.' },
        { t: 'note', title: 'Carouge, Lancy, Vernier…', text: 'Chaque commune a sa propre procédure et ses tarifs. Appelez la police municipale de votre commune deux semaines avant le déménagement.' },
        { t: 'h2', id: 'lausanne', text: 'À Lausanne' },
        {
          t: 'ul',
          items: [
            'Formulaire en ligne, avec un compte myLausanne.',
            'Au moins 7 jours ouvrables avant, le temps de poser la signalisation.',
            'Les places doivent déjà être marquées au sol ; sinon, contactez l’Office de la circulation et du stationnement.',
            'Prix indiqué par la Ville : CHF 130 + TVA pour la pose et la dépose des panneaux, plus les taxes de stationnement de la zone.',
          ],
        },
        { t: 'h2', id: 'monte-meubles', text: 'Et pour un monte-meubles ?' },
        { t: 'p', text: 'À Lausanne, un monte-meubles ou un monte-charge demande un permis d’utilisation temporaire du domaine public séparé, au moins 10 jours ouvrables avant. À Genève, mentionnez-le dans votre demande d’occupation du domaine public.' },
        { t: 'h2', id: 'jour-j', text: 'Si une voiture occupe la place le jour J' },
        { t: 'p', text: 'Ne la déplacez pas vous-même. Relevez la plaque et appelez la police (à Lausanne, le numéro est indiqué sur la page de la Ville). Gardez l’autorisation sous la main pour la montrer.' },
        { t: 'h2', id: 'checklist', text: 'Votre checklist' },
        {
          t: 'check',
          items: [
            'Mesurer la longueur nécessaire : camion, rampe ou monte-meubles',
            'Faire la demande 2 semaines avant pour avoir de la marge',
            'Prévoir les deux adresses : départ et arrivée',
            'Vérifier la pose des panneaux 3 jours avant',
            'Garder l’autorisation imprimée ou sur le téléphone le jour J',
          ],
        },
      ],
      faq: [
        { q: 'Faut-il une autorisation pour garer un camion devant chez moi ?', a: 'Oui, dès que le déménagement utilise des places ou le trottoir sur le domaine public. En Ville de Genève, c’est une permission avec redevance.' },
        { q: 'Combien de temps à l’avance faire la demande ?', a: 'Au moins 10 jours ouvrables en Ville de Genève et au moins 7 jours ouvrables à Lausanne. Comptez deux semaines pour être tranquille.' },
        { q: 'Le déménageur peut-il s’en occuper ?', a: 'C’est en principe la démarche du locataire. Chez Batimove, nous pouvons nous en charger sur demande.' },
        { q: 'Faut-il une autorisation séparée pour un monte-meubles ?', a: 'À Lausanne, oui : un permis d’utilisation temporaire du domaine public. À Genève, indiquez-le dans votre demande.' },
      ],
      cta: { title: 'Pas le temps pour la démarche ?', text: 'Sur demande, nous demandons l’autorisation pour vous et organisons le camion et le monte-meubles.', label: 'Demander un devis', to: '/quote' },
    },
    en: {
      h1: 'Reserving a space for the removal truck in Geneva and Lausanne',
      lead: 'A truck parked far from the entrance means hours of extra carrying. Reserving the space is normally the tenant’s job, and it needs at least 10 working days’ notice. Here is how to do it.',
      takeaways: [
        'City of Geneva: online request at least 10 working days ahead, permission plus a public-space fee.',
        'Other Geneva communes: apply to the commune where the spaces are.',
        'Lausanne: online form with a myLausanne account, at least 7 working days ahead.',
        'In Lausanne, a furniture lift needs a separate permit.',
      ],
      blocks: [
        { t: 'h2', id: 'geneva', text: 'In the City of Geneva' },
        { t: 'p', text: 'Any use of public space for a move requires a permission and a fee. You apply online on the City’s e-services portal, at least 10 working days before the date. The service itself is free, but the public-space usage fee is still due.' },
        { t: 'h2', id: 'canton-geneva', text: 'In other Geneva communes' },
        { t: 'p', text: 'According to the State of Geneva, you apply to the commune where the spaces are, for 8 days at most. Signs must be put up at least 3 days before the reservation starts, not counting Sundays and public holidays; depending on the commune, it puts them up itself or a private company does. The registration numbers of cars already parked when the signs go up must be sent to the police.' },
        { t: 'note', title: 'Carouge, Lancy, Vernier…', text: 'Each commune has its own procedure and fees. Call your commune’s municipal police two weeks before the move.' },
        { t: 'h2', id: 'lausanne', text: 'In Lausanne' },
        {
          t: 'ul',
          items: [
            'Online form, with a myLausanne account.',
            'At least 7 working days ahead, to allow time for the signs.',
            'The spaces must already be marked on the ground; otherwise, contact the traffic and parking office.',
            'Price given by the City: CHF 130 + VAT for putting up and removing the signs, plus the parking charges for the zone.',
          ],
        },
        { t: 'h2', id: 'lift', text: 'What about a furniture lift?' },
        { t: 'p', text: 'In Lausanne, a furniture lift or hoist needs a separate temporary public-space permit, at least 10 working days ahead. In Geneva, mention it in your public-space request.' },
        { t: 'h2', id: 'day', text: 'If a car is in the space on the day' },
        { t: 'p', text: 'Do not move it yourself. Note the registration and call the police (in Lausanne, the number is on the City’s page). Keep the permit at hand to show.' },
        { t: 'h2', id: 'checklist', text: 'Your checklist' },
        {
          t: 'check',
          items: [
            'Measure the length needed: truck, ramp or furniture lift',
            'Apply 2 weeks ahead to keep a margin',
            'Plan for both addresses: departure and arrival',
            'Check the signs are up 3 days before',
            'Keep the permit printed or on your phone on the day',
          ],
        },
      ],
      faq: [
        { q: 'Do I need a permit to park a truck outside my home?', a: 'Yes, as soon as the move uses parking spaces or the pavement on public land. In the City of Geneva, it is a permission with a fee.' },
        { q: 'How far ahead should I apply?', a: 'At least 10 working days in the City of Geneva and at least 7 working days in Lausanne. Allow two weeks to be safe.' },
        { q: 'Can the removal company do it?', a: 'It is normally the tenant’s job. At Batimove, we can take care of it on request.' },
        { q: 'Do I need a separate permit for a furniture lift?', a: 'In Lausanne, yes: a temporary public-space permit. In Geneva, include it in your request.' },
      ],
      cta: { title: 'No time for the paperwork?', text: 'On request, we apply for the permit for you and organise the truck and the furniture lift.', label: 'Request a quote', to: '/quote' },
    },
  },
];

export const GUIDES_COPY: Record<Lang, {
  hubTitle: string;
  hubLead: string;
  updated: string;
  minutes: (n: number) => string;
  takeaways: string;
  toc: string;
  faq: string;
  sources: string;
  sourcesNote: string;
  read: string;
  crumb: string;
  home: string;
  others: string;
  author: string;
}> = {
  fr: {
    hubTitle: 'Guides & conseils pour votre déménagement',
    hubLead: 'Douane, bail, état des lieux, démarches : des guides vérifiés sur les sources officielles, écrits par l’équipe Batimove pour Genève et le canton de Vaud.',
    updated: 'Mis à jour le',
    minutes: (n) => `${n} min de lecture`,
    takeaways: 'L’essentiel',
    toc: 'Dans ce guide',
    faq: 'Questions fréquentes',
    sources: 'Sources officielles',
    sourcesNote: 'Consultées le 14 novembre 2026. Les montants sont indicatifs : vérifiez-les sur la source avant de vous engager.',
    read: 'Lire le guide',
    crumb: 'Guides',
    home: 'Accueil',
    others: 'Autres guides',
    author: 'Équipe Batimove',
  },
  en: {
    hubTitle: 'Guides & advice for your move',
    hubLead: 'Customs, leases, move-out inspections, formalities: guides checked against official sources, written by the Batimove team for Geneva and the canton of Vaud.',
    updated: 'Updated on',
    minutes: (n) => `${n} min read`,
    takeaways: 'Key points',
    toc: 'In this guide',
    faq: 'Frequently asked questions',
    sources: 'Official sources',
    sourcesNote: 'Checked on 14 November 2026. Amounts are indicative: check them at the source before committing.',
    read: 'Read the guide',
    crumb: 'Guides',
    home: 'Home',
    others: 'Other guides',
    author: 'Batimove team',
  },
};
