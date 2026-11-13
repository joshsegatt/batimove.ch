import type { CountrySlug } from './countries';

// Conteúdo próprio de cada página de país (/demenagement-france…). O resto da
// página (etapas, alfândega, FAQ comum) é montado em pages/International.tsx.
// Só geografia e fatos públicos; nenhuma regra de alfândega por país: isso é
// visto com o escritório da Batimove depois do pedido de devis.

export interface CountryText {
  /** "la France", "les Pays-Bas" / "France", "the Netherlands" */
  art: string;
  /** "en France", "aux Pays-Bas" / "to France" */
  dest: string;
  citiesTitle?: string;
  cities: string[];
  /** Parágrafo próprio do país, abaixo do título "Où nous allons" */
  intro: string;
  /** Dois pontos curtos de "Bon à savoir" */
  notes: [string, string];
  faq?: { q: string; a: string };
}

export interface CountryPageData {
  fr: CountryText;
  en: CountryText;
  /** Países vizinhos para os links "À voir aussi" */
  related: CountrySlug[];
  /** Link extra no bloco de destinos (ex. página Genève – Londres) */
  extraLink?: { fr: string; en: string; to: string };
}

export const COUNTRY_PAGES: Record<CountrySlug, CountryPageData> = {
  france: {
    fr: {
      art: 'la France',
      dest: 'en France',
      cities: ['Paris', 'Lyon', 'Annecy', 'Annemasse', 'Pays de Gex', 'Grenoble', 'Marseille', 'Nice'],
      intro:
        "Le Grand Genève s'étend des deux côtés de la frontière : nous déménageons vers Annemasse, Saint-Julien-en-Genevois ou le Pays de Gex comme vers Lyon, Paris ou la Côte d'Azur.",
      notes: ['Genevois français et Pays de Gex', 'Toute la France métropolitaine'],
      faq: {
        q: 'Déménagez-vous aussi dans le Genevois français ?',
        a: "Oui : Annemasse, Saint-Julien-en-Genevois, Thonon-les-Bains, le Pays de Gex et le reste de la Haute-Savoie et de l'Ain.",
      },
    },
    en: {
      art: 'France',
      dest: 'to France',
      cities: ['Paris', 'Lyon', 'Annecy', 'Annemasse', 'Pays de Gex', 'Grenoble', 'Marseille', 'Nice'],
      intro:
        'Greater Geneva spans both sides of the border: we move people to Annemasse, Saint-Julien-en-Genevois or the Pays de Gex just as we do to Lyon, Paris or the Riviera.',
      notes: ['French Geneva area and Pays de Gex', 'All of mainland France'],
      faq: {
        q: 'Do you also move people within the French Geneva area?',
        a: 'Yes: Annemasse, Saint-Julien-en-Genevois, Thonon-les-Bains, the Pays de Gex and the rest of Haute-Savoie and the Ain.',
      },
    },
    related: ['italie', 'belgique'],
  },
  italie: {
    fr: {
      art: "l'Italie",
      dest: 'en Italie',
      cities: ['Milan', 'Turin', 'Aoste', 'Côme', 'Gênes', 'Rome', 'Florence', 'Venise'],
      intro:
        "Par le tunnel du Mont-Blanc, le Grand-Saint-Bernard ou le Simplon, l'Italie du Nord est proche de Genève, de Vaud et du Valais. Nous allons aussi jusqu'à Rome, Florence et au reste du pays.",
      notes: ['Milan, Turin, Aoste et les lacs', 'Rome, Florence et le reste du pays'],
      faq: {
        q: 'Par où passe le camion ?',
        a: "Selon le point de départ et la destination : tunnel du Mont-Blanc, Grand-Saint-Bernard ou Simplon. L'itinéraire est choisi avec le devis.",
      },
    },
    en: {
      art: 'Italy',
      dest: 'to Italy',
      cities: ['Milan', 'Turin', 'Aosta', 'Como', 'Genoa', 'Rome', 'Florence', 'Venice'],
      intro:
        'Through the Mont Blanc tunnel, the Great St Bernard or the Simplon, northern Italy is close to Geneva, Vaud and Valais. We also go as far as Rome, Florence and the rest of the country.',
      notes: ['Milan, Turin, Aosta and the lakes', 'Rome, Florence and the rest of the country'],
      faq: {
        q: 'Which way does the lorry go?',
        a: 'It depends on where you leave from and where you are going: the Mont Blanc tunnel, the Great St Bernard or the Simplon. The route is chosen with the quote.',
      },
    },
    related: ['france', 'autriche'],
  },
  portugal: {
    fr: {
      art: 'le Portugal',
      dest: 'au Portugal',
      cities: ['Lisbonne', 'Porto', 'Braga', 'Coimbra', 'Viseu', 'Aveiro', 'Guimarães', 'Faro'],
      intro:
        "La communauté portugaise est l'une des plus grandes de Suisse romande. Pour un retour au pays comme pour une installation en Suisse, nous transportons vos biens jusqu'à la nouvelle adresse.",
      notes: ['Nord et centre : Porto, Braga, Viseu, Coimbra', "Lisbonne et l'Algarve"],
      faq: {
        q: 'Transportez-vous aussi ma voiture ?',
        a: 'Oui, nous transportons voitures et motos en Suisse et en Europe. Indiquez-le dans votre demande de devis.',
      },
    },
    en: {
      art: 'Portugal',
      dest: 'to Portugal',
      cities: ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Viseu', 'Aveiro', 'Guimarães', 'Faro'],
      intro:
        'The Portuguese community is one of the largest in French-speaking Switzerland. Whether you are going home or settling in Switzerland, we take your belongings all the way to your new address.',
      notes: ['North and centre: Porto, Braga, Viseu, Coimbra', 'Lisbon and the Algarve'],
      faq: {
        q: 'Do you also move my car?',
        a: 'Yes, we transport cars and motorbikes in Switzerland and across Europe. Mention it in your quote request.',
      },
    },
    related: ['espagne', 'france'],
  },
  espagne: {
    fr: {
      art: "l'Espagne",
      dest: 'en Espagne',
      cities: ['Barcelone', 'Madrid', 'Valence', 'Alicante', 'Malaga', 'Séville', 'Bilbao', 'Saragosse'],
      intro:
        "Par la vallée du Rhône et la côte méditerranéenne, nous déménageons vers toute l'Espagne continentale, de la Catalogne à l'Andalousie.",
      notes: ['Catalogne et côte méditerranéenne', 'Madrid, Andalousie et Pays basque'],
      faq: {
        q: 'Transportez-vous aussi ma voiture ?',
        a: 'Oui, nous transportons voitures et motos en Suisse et en Europe. Indiquez-le dans votre demande de devis.',
      },
    },
    en: {
      art: 'Spain',
      dest: 'to Spain',
      cities: ['Barcelona', 'Madrid', 'Valencia', 'Alicante', 'Málaga', 'Seville', 'Bilbao', 'Zaragoza'],
      intro:
        'Down the Rhône valley and along the Mediterranean coast, we move people to all of mainland Spain, from Catalonia to Andalusia.',
      notes: ['Catalonia and the Mediterranean coast', 'Madrid, Andalusia and the Basque Country'],
      faq: {
        q: 'Do you also move my car?',
        a: 'Yes, we transport cars and motorbikes in Switzerland and across Europe. Mention it in your quote request.',
      },
    },
    related: ['portugal', 'france'],
  },
  allemagne: {
    fr: {
      art: "l'Allemagne",
      dest: 'en Allemagne',
      cities: ['Munich', 'Stuttgart', 'Fribourg-en-Brisgau', 'Francfort', 'Cologne', 'Düsseldorf', 'Berlin', 'Hambourg'],
      intro:
        "Par Bâle ou par le lac de Constance, nous déménageons vers toutes les régions d'Allemagne, du Bade-Wurtemberg et de la Bavière jusqu'à Berlin et Hambourg.",
      notes: ['Sud : Munich, Stuttgart, Fribourg-en-Brisgau', 'Francfort, Cologne, Berlin, Hambourg'],
    },
    en: {
      art: 'Germany',
      dest: 'to Germany',
      cities: ['Munich', 'Stuttgart', 'Freiburg', 'Frankfurt', 'Cologne', 'Düsseldorf', 'Berlin', 'Hamburg'],
      intro:
        'Via Basel or Lake Constance, we move people to every region of Germany, from Baden-Württemberg and Bavaria to Berlin and Hamburg.',
      notes: ['The south: Munich, Stuttgart, Freiburg', 'Frankfurt, Cologne, Berlin, Hamburg'],
    },
    related: ['autriche', 'pays-bas'],
  },
  belgique: {
    fr: {
      art: 'la Belgique',
      dest: 'en Belgique',
      cities: ['Bruxelles', 'Anvers', 'Gand', 'Liège', 'Namur', 'Louvain', 'Bruges', 'Charleroi'],
      intro:
        'Bruxelles accueille, comme Genève, des institutions et des organisations internationales. Nous déménageons entre les deux villes comme vers toute la Belgique.',
      notes: ['Bruxelles et sa région', 'Wallonie et Flandre'],
      faq: {
        q: 'Faut-il réserver le stationnement à Bruxelles ?',
        a: 'Les communes bruxelloises demandent en général une réservation de stationnement pour un déménagement. Nous voyons ce point avec vous au moment du devis.',
      },
    },
    en: {
      art: 'Belgium',
      dest: 'to Belgium',
      cities: ['Brussels', 'Antwerp', 'Ghent', 'Liège', 'Namur', 'Leuven', 'Bruges', 'Charleroi'],
      intro:
        'Like Geneva, Brussels is home to international institutions and organisations. We move people between the two cities and to the rest of Belgium.',
      notes: ['Brussels and the surrounding region', 'Wallonia and Flanders'],
      faq: {
        q: 'Do I need to reserve parking in Brussels?',
        a: 'Brussels municipalities generally ask for a parking reservation for a move. We go over this with you when we prepare the quote.',
      },
    },
    related: ['pays-bas', 'luxembourg'],
  },
  'pays-bas': {
    fr: {
      art: 'les Pays-Bas',
      dest: 'aux Pays-Bas',
      cities: ['Amsterdam', 'Rotterdam', 'La Haye', 'Utrecht', 'Eindhoven', 'Leyde', 'Delft', 'Groningue'],
      intro:
        'Les maisons anciennes des Pays-Bas ont souvent des escaliers très raides, et les meubles passent alors par la façade. Nous voyons les accès de votre nouvelle adresse avec vous dès le devis.',
      notes: ['Amsterdam, La Haye, Rotterdam, Utrecht', 'Eindhoven et le reste du pays'],
    },
    en: {
      art: 'the Netherlands',
      dest: 'to the Netherlands',
      cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Leiden', 'Delft', 'Groningen'],
      intro:
        'Older Dutch houses often have very steep staircases, so furniture goes in through the façade. We go over the access at your new address with you when we prepare the quote.',
      notes: ['Amsterdam, The Hague, Rotterdam, Utrecht', 'Eindhoven and the rest of the country'],
    },
    related: ['belgique', 'allemagne'],
  },
  luxembourg: {
    fr: {
      art: 'le Luxembourg',
      dest: 'au Luxembourg',
      cities: ['Luxembourg-ville', 'Kirchberg', 'Strassen', 'Bertrange', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck'],
      intro:
        'Place financière et européenne comme Genève, le Luxembourg attire de nombreux expatriés. Nous déménageons vers la capitale et tout le Grand-Duché.',
      notes: ['Luxembourg-ville et Kirchberg', 'Tout le Grand-Duché'],
    },
    en: {
      art: 'Luxembourg',
      dest: 'to Luxembourg',
      cities: ['Luxembourg City', 'Kirchberg', 'Strassen', 'Bertrange', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck'],
      intro:
        'A financial and European centre like Geneva, Luxembourg attracts many expatriates. We move people to the capital and the whole Grand Duchy.',
      notes: ['Luxembourg City and Kirchberg', 'The whole Grand Duchy'],
    },
    related: ['belgique', 'allemagne'],
  },
  autriche: {
    fr: {
      art: "l'Autriche",
      dest: 'en Autriche',
      cities: ['Vienne', 'Innsbruck', 'Salzbourg', 'Graz', 'Linz', 'Bregenz', 'Feldkirch', 'Klagenfurt'],
      intro:
        "Par la Suisse orientale et le Vorarlberg, nous déménageons vers le Tyrol, Salzbourg et jusqu'à Vienne.",
      notes: ['Vorarlberg et Tyrol', 'Salzbourg, Linz, Graz et Vienne'],
    },
    en: {
      art: 'Austria',
      dest: 'to Austria',
      cities: ['Vienna', 'Innsbruck', 'Salzburg', 'Graz', 'Linz', 'Bregenz', 'Feldkirch', 'Klagenfurt'],
      intro: 'Through eastern Switzerland and Vorarlberg, we move people to Tyrol, Salzburg and all the way to Vienna.',
      notes: ['Vorarlberg and Tyrol', 'Salzburg, Linz, Graz and Vienna'],
    },
    related: ['allemagne', 'italie'],
  },
  monaco: {
    fr: {
      art: 'Monaco',
      dest: 'à Monaco',
      citiesTitle: 'Quartiers et environs',
      cities: ['Monte-Carlo', 'Fontvieille', 'La Condamine', 'Monaco-Ville', 'Larvotto', 'Beausoleil', "Cap-d'Ail", 'Menton'],
      intro:
        'Rues en pente, immeubles en hauteur et stationnement limité : un déménagement à Monaco se prépare avec précision. Nous voyons les accès avec vous dès le devis.',
      notes: ['Monte-Carlo, Fontvieille, La Condamine', "Communes voisines de la Côte d'Azur"],
    },
    en: {
      art: 'Monaco',
      dest: 'to Monaco',
      citiesTitle: 'Districts and nearby towns',
      cities: ['Monte Carlo', 'Fontvieille', 'La Condamine', 'Monaco-Ville', 'Larvotto', 'Beausoleil', "Cap-d'Ail", 'Menton'],
      intro:
        'Steep streets, tall buildings and limited parking: a move to Monaco needs careful planning. We go over the access with you when we prepare the quote.',
      notes: ['Monte Carlo, Fontvieille, La Condamine', 'Nearby towns on the Riviera'],
    },
    related: ['france', 'italie'],
  },
  'royaume-uni': {
    fr: {
      art: 'le Royaume-Uni',
      dest: 'au Royaume-Uni',
      cities: ['Londres', 'Oxford', 'Cambridge', 'Brighton', 'Bristol', 'Birmingham', 'Manchester', 'Édimbourg'],
      intro:
        'Depuis le Brexit, un déménagement vers le Royaume-Uni demande des documents de douane des deux côtés. Nous allons à Londres comme dans le reste de la Grande-Bretagne.',
      notes: ['Londres et le sud de l’Angleterre', 'Le reste de l’Angleterre, l’Écosse et le pays de Galles'],
    },
    en: {
      art: 'the United Kingdom',
      dest: 'to the UK',
      cities: ['London', 'Oxford', 'Cambridge', 'Brighton', 'Bristol', 'Birmingham', 'Manchester', 'Edinburgh'],
      intro:
        'Since Brexit, a move to the United Kingdom needs customs paperwork on both sides. We go to London and to the rest of Great Britain.',
      notes: ['London and the south of England', 'The rest of England, Scotland and Wales'],
    },
    related: ['france', 'belgique'],
    extraLink: { fr: 'Déménagement Genève – Londres', en: 'Removals Geneva – London', to: '/demenagement-londres' },
  },
};
