import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, ChevronRight, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { QuoteWizard } from '../components/quote/QuoteWizard';
import { defineCopy, useLang, type Lang } from '../i18n';
import { COUNTRIES, type CountrySlug } from '../data/countries';
import { COUNTRY_PAGES } from '../data/countryPages';

// Páginas de mudança para fora da Suíça: Internacional (Europa), Londres e uma
// página por país (/demenagement-france…, conteúdo em data/countryPages.ts).
// Destinos confirmados pela Batimove: países vizinhos, resto da UE e Reino Unido.
// As regras de alfândega citadas são as oficiais (formulário 18.44 suíço,
// franquia da UE do Regulamento (CE) 1186/2009, ToR1 do HMRC britânico);
// a página diz que a situação de cada cliente é verificada no devis.

interface Faq {
  q: string;
  a: string;
}

/** Item de lista: texto simples ou link para outra página (caminho francês). */
type ListItem = string | { label: string; to: string };

interface AbroadCopy {
  breadcrumb: string;
  /** Nível intermediário do fil d'Ariane (ex. Déménagement international) */
  parent?: { label: string; to: string };
  h1: string;
  lead: string;
  checks: string[];
  callLabel: string;
  wizardTo?: string;
  hero: { src: string; srcSmall: string; alt: string; position: string };
  /** Bloco principal: destinos (internacional) ou o que está incluído (Londres) */
  main: { title: string; intro?: string; groups: { title: string; items: ListItem[]; link?: { label: string; to: string } }[] };
  customs: { title: string; intro: string; items: { title: string; text: string }[]; note: string };
  steps: { title: string; text: string }[];
  stepsTitle: string;
  faqTitle: string;
  faq: Faq[];
  related: { label: string; to: string }[];
  relatedTitle: string;
  band: { title: string; text: string; cta: string };
}

const CUSTOMS_CH_FR = {
  title: 'Arrivée en Suisse',
  text: "Vos effets de déménagement entrent en franchise s'ils ont été utilisés au moins six mois et le restent en Suisse. Ils se déclarent avec le formulaire 18.44 de l'Office fédéral de la douane.",
};
const CUSTOMS_CH_EN = {
  title: 'Moving into Switzerland',
  text: 'Household effects enter duty-free if you have used them for at least six months and keep using them in Switzerland. They are declared on form 18.44 of the Swiss customs administration.',
};

/** Links "France", "Italie"… para as páginas de país. */
const countryLinks = (lang: Lang, slugs: CountrySlug[]): ListItem[] =>
  slugs.map((slug) => {
    const p = COUNTRIES.find((x) => x.slug === slug)!;
    return { label: lang === 'en' ? p.nameEn : p.name, to: p.path };
  });

const INTERNATIONAL = defineCopy<AbroadCopy>(
  {
    breadcrumb: 'Déménagement international',
    h1: 'Déménagement international depuis la Suisse',
    lead: "De Genève et du canton de Vaud vers la France, l'Italie, l'Allemagne, l'Autriche, le reste de l'Union européenne et le Royaume-Uni, et dans l'autre sens. Une seule équipe de l'emballage à la livraison, et de l'aide pour les documents de douane.",
    checks: ['Devis gratuit sous 30 min', 'Prix ferme, aucun surcoût', 'Joignable 7j/7'],
    callLabel: 'appel gratuit',
    hero: {
      src: '/hero-international.jpg',
      srcSmall: '/hero-international-sm.jpg',
      alt: 'Camion de déménagement sur une autoroute des Alpes suisses',
      position: '70% 50%',
    },
    main: {
      title: 'Où nous allons',
      intro: "Départ de Genève ou du canton de Vaud, ou arrivée en Suisse romande depuis l'étranger.",
      groups: [
        { title: 'Pays voisins', items: [...countryLinks('fr', ['france', 'italie', 'allemagne', 'autriche']), 'Liechtenstein'] },
        {
          // Monaco não é da UE: o título fala da Europa.
          title: "Reste de l'Europe",
          items: [
            ...countryLinks('fr', ['portugal', 'espagne', 'belgique', 'pays-bas', 'luxembourg', 'monaco']),
            'et les autres pays de l’UE',
          ],
        },
        {
          title: 'Royaume-Uni',
          items: [...countryLinks('fr', ['royaume-uni']), 'Londres et toute l’Angleterre', 'Documents de douane depuis le Brexit'],
          link: { label: 'Déménagement Genève – Londres', to: '/demenagement-londres' },
        },
      ],
    },
    customs: {
      title: 'La douane, sans mauvaise surprise',
      intro: 'La Suisse ne fait pas partie de l’Union européenne : chaque déménagement passe une frontière douanière. Les règles de base :',
      items: [
        {
          title: "Départ vers l'Union européenne",
          text: "Vos biens personnels entrent en franchise s'ils vous appartiennent et sont utilisés depuis au moins six mois, et si vous résidiez hors de l'UE depuis au moins douze mois (règlement (CE) n° 1186/2009).",
        },
        CUSTOMS_CH_FR,
        {
          title: 'Départ vers le Royaume-Uni',
          text: "La franchise « Transfer of Residence » se demande en ligne auprès du HMRC (formulaire ToR1), avant le déménagement.",
        },
      ],
      note: 'Nous vous aidons à préparer ces documents. Votre situation est vérifiée dans le devis, car les règles peuvent changer.',
    },
    stepsTitle: 'Comment ça se passe',
    steps: [
      { title: 'Devis gratuit', text: 'Vous décrivez le logement et la destination ; nous répondons sous 30 min de 8h à 19h, avec un prix ferme.' },
      { title: 'Emballage et documents', text: 'Nos équipes emballent et protègent vos biens, et nous préparons avec vous les documents de douane.' },
      { title: 'Transport et livraison', text: 'Chargement, transport et livraison à la nouvelle adresse, avec un interlocuteur joignable 7j/7.' },
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      {
        q: 'Quels documents faut-il pour la douane ?',
        a: "Cela dépend du pays d'arrivée : demande de franchise pour l'Union européenne, formulaire ToR1 pour le Royaume-Uni, formulaire 18.44 pour entrer en Suisse. Nous vous indiquons la liste exacte avec le devis et vous aidons à la remplir.",
      },
      {
        q: 'Le prix est-il ferme ?',
        a: 'Oui. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
      {
        q: 'Pouvez-vous stocker mes affaires entre deux logements ?',
        a: 'Oui, dans notre garde-meubles à Genève : dépôt ventilé sous vidéosurveillance, pour quelques semaines ou plusieurs mois.',
      },
      {
        q: 'Transportez-vous aussi ma voiture ?',
        a: 'Oui, nous transportons voitures et motos en Suisse et en Europe. Indiquez-le dans votre demande de devis.',
      },
    ],
    relatedTitle: 'À voir aussi',
    related: [
      { label: 'Déménagement Genève – Londres', to: '/demenagement-londres' },
      { label: 'Garde-meubles à Genève', to: '/garde-meubles' },
      { label: 'Déménagement à Genève', to: '/demenagement-geneve' },
      { label: 'Déménagement dans le canton de Vaud', to: '/demenagement-vaud' },
    ],
    band: {
      title: 'Vous partez à l’étranger ?',
      text: 'Décrivez votre déménagement en deux minutes : réponse sous 30 min, de 8h à 19h.',
      cta: 'Demander un devis',
    },
  },
  {
    breadcrumb: 'International removals',
    h1: 'International removals from Switzerland',
    lead: 'From Geneva and the canton of Vaud to France, Italy, Germany, Austria, the rest of the European Union and the United Kingdom, and back again. One team from packing to delivery, with help on the customs paperwork.',
    checks: ['Free quote within 30 min', 'Fixed price, no extra charges', 'Reachable 7 days a week'],
    callLabel: 'freephone',
    hero: {
      src: '/hero-international.jpg',
      srcSmall: '/hero-international-sm.jpg',
      alt: 'Removal lorry on a motorway in the Swiss Alps',
      position: '70% 50%',
    },
    main: {
      title: 'Where we go',
      intro: 'Leaving from Geneva or the canton of Vaud, or moving into French-speaking Switzerland from abroad.',
      groups: [
        { title: 'Neighbouring countries', items: [...countryLinks('en', ['france', 'italie', 'allemagne', 'autriche']), 'Liechtenstein'] },
        {
          title: 'The rest of Europe',
          items: [
            ...countryLinks('en', ['portugal', 'espagne', 'belgique', 'pays-bas', 'luxembourg', 'monaco']),
            'and the other EU countries',
          ],
        },
        {
          title: 'United Kingdom',
          items: [...countryLinks('en', ['royaume-uni']), 'London and the rest of England', 'Customs paperwork since Brexit'],
          link: { label: 'Removals Geneva – London', to: '/demenagement-londres' },
        },
      ],
    },
    customs: {
      title: 'Customs, without surprises',
      intro: 'Switzerland is not part of the European Union, so every international move crosses a customs border. The basic rules:',
      items: [
        {
          title: 'Moving to the European Union',
          text: 'Your personal belongings enter duty-free if you own them and have used them for at least six months, and you have lived outside the EU for at least twelve months (Regulation (EC) No 1186/2009).',
        },
        CUSTOMS_CH_EN,
        {
          title: 'Moving to the United Kingdom',
          text: 'Transfer of Residence relief is claimed online from HMRC (form ToR1) before you move.',
        },
      ],
      note: 'We help you prepare these documents. Your situation is checked in the quote, as the rules can change.',
    },
    stepsTitle: 'How it works',
    steps: [
      { title: 'Free quote', text: 'Tell us about the property and the destination; we reply within 30 min between 8am and 7pm, with a fixed price.' },
      { title: 'Packing and paperwork', text: 'Our teams pack and protect your belongings, and we prepare the customs documents with you.' },
      { title: 'Transport and delivery', text: 'Loading, transport and delivery to your new address, with a contact you can reach 7 days a week.' },
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'Which customs documents do I need?',
        a: 'It depends on where you are moving to: a relief claim for the European Union, form ToR1 for the United Kingdom, form 18.44 to move into Switzerland. We give you the exact list with the quote and help you fill it in.',
      },
      {
        q: 'Is the price fixed?',
        a: 'Yes. Once you accept the quote the price is fixed: you will not be charged anything extra.',
      },
      {
        q: 'Can you store my belongings between two homes?',
        a: 'Yes, in our storage facility in Geneva: a ventilated, CCTV-monitored depot, for a few weeks or several months.',
      },
      {
        q: 'Do you also move my car?',
        a: 'Yes, we transport cars and motorbikes in Switzerland and across Europe. Mention it in your quote request.',
      },
    ],
    relatedTitle: 'See also',
    related: [
      { label: 'Removals Geneva – London', to: '/demenagement-londres' },
      { label: 'Furniture storage in Geneva', to: '/garde-meubles' },
      { label: 'Removals in Geneva', to: '/demenagement-geneve' },
      { label: 'Removals in the canton of Vaud', to: '/demenagement-vaud' },
    ],
    band: {
      title: 'Moving abroad?',
      text: 'Describe your move in two minutes: we reply within 30 min, between 8am and 7pm.',
      cta: 'Request a quote',
    },
  }
);

const LONDON = defineCopy<AbroadCopy>(
  {
    breadcrumb: 'Genève – Londres',
    h1: 'Déménagement entre Genève et Londres',
    lead: 'De Genève, de Lausanne ou de tout le canton de Vaud vers Londres, et de Londres vers la Suisse : emballage, transport, documents de douane et livraison à votre nouvelle adresse.',
    checks: ['Devis gratuit sous 30 min', 'Prix ferme, aucun surcoût', 'Joignable 7j/7'],
    callLabel: 'appel gratuit',
    wizardTo: 'Londres',
    hero: {
      src: '/hero-londres.jpg',
      srcSmall: '/hero-londres-sm.jpg',
      alt: 'Déménageurs portant un meuble emballé devant une maison londonienne',
      position: '70% 50%',
    },
    main: {
      title: 'Ce qui est compris',
      groups: [
        {
          title: 'Au départ',
          items: ['Emballage et protection de vos biens', 'Chargement par nos équipes', 'Garde-meubles à Genève si besoin'],
        },
        {
          title: 'Entre les deux pays',
          items: ['Transport jusqu’à Londres', 'Aide aux documents de douane', 'Transport de votre voiture ou moto sur demande'],
        },
        {
          title: 'À l’arrivée',
          items: ['Livraison à la nouvelle adresse', 'Un interlocuteur joignable 7j/7', 'Le même service dans le sens Londres – Suisse'],
        },
      ],
    },
    customs: {
      title: 'La douane depuis le Brexit',
      intro: 'Entre la Suisse et le Royaume-Uni, il y a deux déclarations : une à la sortie, une à l’entrée. Les règles de base :',
      items: [
        {
          title: 'Vers Londres',
          text: 'La franchise « Transfer of Residence » se demande en ligne auprès du HMRC (formulaire ToR1), avant le déménagement. Elle couvre les biens que vous possédez et utilisez depuis au moins six mois, si vous viviez hors du Royaume-Uni depuis au moins douze mois.',
        },
        {
          title: 'De Londres vers la Suisse',
          text: CUSTOMS_CH_FR.text,
        },
      ],
      note: 'Nous vous aidons à préparer ces documents. Votre situation est vérifiée dans le devis, car les règles peuvent changer.',
    },
    stepsTitle: 'Comment ça se passe',
    steps: [
      { title: 'Devis gratuit', text: 'Vous décrivez le logement et l’adresse à Londres ; nous répondons sous 30 min de 8h à 19h, avec un prix ferme.' },
      { title: 'Emballage et documents', text: 'Nos équipes emballent et protègent vos biens, et nous préparons avec vous la demande ToR1.' },
      { title: 'Transport et livraison', text: 'Chargement à Genève ou dans le canton de Vaud, transport et livraison à votre adresse à Londres.' },
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      {
        q: 'Faut-il payer des droits de douane au Royaume-Uni ?',
        a: "Pas si vous obtenez la franchise « Transfer of Residence » (formulaire ToR1) : elle couvre les biens que vous possédez et utilisez depuis au moins six mois. Nous vous aidons à la demander avant le départ.",
      },
      {
        q: 'Déménagez-vous aussi de Londres vers la Suisse ?',
        a: 'Oui. Vos effets de déménagement entrent en Suisse en franchise avec le formulaire 18.44, s’ils ont été utilisés au moins six mois.',
      },
      {
        q: 'Le prix est-il ferme ?',
        a: 'Oui. Une fois le devis accepté, le prix est ferme : aucun surcoût ne vous sera facturé.',
      },
      {
        q: 'Pouvez-vous garder mes affaires si mon logement à Londres n’est pas encore prêt ?',
        a: 'Oui, dans notre garde-meubles à Genève : dépôt ventilé sous vidéosurveillance, pour quelques semaines ou plusieurs mois.',
      },
    ],
    relatedTitle: 'À voir aussi',
    related: [
      { label: 'Déménagement international', to: '/demenagement-international' },
      { label: 'Garde-meubles à Genève', to: '/garde-meubles' },
      { label: 'Déménagement à Genève', to: '/demenagement-geneve' },
      { label: 'Déménagement à Lausanne', to: '/demenagement-lausanne' },
    ],
    band: {
      title: 'Vous partez pour Londres ?',
      text: 'Décrivez votre déménagement en deux minutes : réponse sous 30 min, de 8h à 19h.',
      cta: 'Demander un devis',
    },
  },
  {
    breadcrumb: 'Geneva – London',
    h1: 'Removals between Geneva and London',
    lead: 'From Geneva, Lausanne or anywhere in the canton of Vaud to London, and from London to Switzerland: packing, transport, customs paperwork and delivery to your new address.',
    checks: ['Free quote within 30 min', 'Fixed price, no extra charges', 'Reachable 7 days a week'],
    callLabel: 'freephone',
    wizardTo: 'London',
    hero: {
      src: '/hero-londres.jpg',
      srcSmall: '/hero-londres-sm.jpg',
      alt: 'Movers carrying a wrapped piece of furniture into a London townhouse',
      position: '70% 50%',
    },
    main: {
      title: 'What is included',
      groups: [
        {
          title: 'Before you leave',
          items: ['Packing and protection of your belongings', 'Loading by our teams', 'Storage in Geneva if needed'],
        },
        {
          title: 'Between the two countries',
          items: ['Transport to London', 'Help with the customs paperwork', 'Transport of your car or motorbike on request'],
        },
        {
          title: 'On arrival',
          items: ['Delivery to your new address', 'A contact you can reach 7 days a week', 'The same service from London to Switzerland'],
        },
      ],
    },
    customs: {
      title: 'Customs since Brexit',
      intro: 'Between Switzerland and the United Kingdom there are two declarations: one on leaving, one on arrival. The basic rules:',
      items: [
        {
          title: 'Moving to London',
          text: 'Transfer of Residence relief is claimed online from HMRC (form ToR1) before you move. It covers belongings you have owned and used for at least six months, if you have lived outside the UK for at least twelve months.',
        },
        {
          title: 'From London to Switzerland',
          text: CUSTOMS_CH_EN.text,
        },
      ],
      note: 'We help you prepare these documents. Your situation is checked in the quote, as the rules can change.',
    },
    stepsTitle: 'How it works',
    steps: [
      { title: 'Free quote', text: 'Tell us about the property and the London address; we reply within 30 min between 8am and 7pm, with a fixed price.' },
      { title: 'Packing and paperwork', text: 'Our teams pack and protect your belongings, and we prepare the ToR1 claim with you.' },
      { title: 'Transport and delivery', text: 'Loading in Geneva or the canton of Vaud, transport and delivery to your address in London.' },
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        q: 'Do I have to pay import duty in the UK?',
        a: 'Not if you get Transfer of Residence relief (form ToR1): it covers belongings you have owned and used for at least six months. We help you claim it before you leave.',
      },
      {
        q: 'Do you also move people from London to Switzerland?',
        a: 'Yes. Your household effects enter Switzerland duty-free on form 18.44, provided you have used them for at least six months.',
      },
      {
        q: 'Is the price fixed?',
        a: 'Yes. Once you accept the quote the price is fixed: you will not be charged anything extra.',
      },
      {
        q: 'Can you keep my things if my London home is not ready yet?',
        a: 'Yes, in our storage facility in Geneva: a ventilated, CCTV-monitored depot, for a few weeks or several months.',
      },
    ],
    relatedTitle: 'See also',
    related: [
      { label: 'International removals', to: '/demenagement-international' },
      { label: 'Furniture storage in Geneva', to: '/garde-meubles' },
      { label: 'Removals in Geneva', to: '/demenagement-geneve' },
      { label: 'Removals in Lausanne', to: '/demenagement-lausanne' },
    ],
    band: {
      title: 'Moving to London?',
      text: 'Describe your move in two minutes: we reply within 30 min, between 8am and 7pm.',
      cta: 'Request a quote',
    },
  }
);

const COUNTRY_COMMON = defineCopy(
  {
    parent: { label: 'Déménagement international', to: '/demenagement-international' },
    h1: (art: string) => `Déménagement entre la Suisse et ${art}`,
    lead: (art: string) =>
      `Depuis Genève et toute la Suisse romande vers ${art}, et dans l'autre sens : emballage, transport, livraison à la nouvelle adresse et aide pour les documents de douane.`,
    citiesTitle: 'Principales destinations',
    mainTitle: 'Où nous allons',
    includedTitle: 'Ce qui est compris',
    included: ['Emballage et protection de vos biens', 'Démontage des meubles', 'Transport et livraison à la nouvelle adresse', 'Aide pour les documents de douane'],
    notesTitle: 'Bon à savoir',
    bothWays: 'Dans les deux sens, vers la Suisse aussi',
    customs: (art: string, dest: string) => ({
      title: 'La douane, vue avec notre bureau',
      intro: `Entre la Suisse et ${art}, un déménagement passe par la douane. Chaque situation est différente : les formalités sont vues directement avec notre bureau, après votre demande de devis.`,
      items: [
        { title: 'Votre demande de devis', text: `Vous décrivez le logement, la date et votre future adresse ${dest}.` },
        { title: 'Un échange avec notre bureau', text: 'Notre bureau vous contacte pour faire le point sur votre situation et les documents de douane nécessaires.' },
        { title: 'Les documents préparés avec vous', text: 'Nous vous aidons à les préparer avant le départ, pour passer la frontière sans mauvaise surprise.' },
      ],
      note: 'Les règles peuvent changer : votre situation est toujours vérifiée avec vous au moment du devis.',
    }),
    reverseQ: (art: string) => `Faites-vous aussi le déménagement depuis ${art} vers la Suisse ?`,
    reverseA: 'Oui, dans les deux sens et avec le même service : emballage, transport, aide pour la douane et livraison.',
    docsQ: 'Quels documents faut-il pour la douane ?',
    docsA: 'Cela dépend de votre situation. Notre bureau vous donne la liste après votre demande de devis et vous aide à préparer les documents.',
    relatedCountry: (name: string) => `Déménagement ${name}`,
    band: (dest: string) => ({
      title: `Vous partez ${dest} ?`,
      text: 'Décrivez votre déménagement en deux minutes : réponse sous 30 min, de 8h à 19h.',
      cta: 'Demander un devis',
    }),
  },
  {
    parent: { label: 'International removals', to: '/demenagement-international' },
    h1: (art: string) => `Removals between Switzerland and ${art}`,
    lead: (art: string) =>
      `From Geneva and the rest of French-speaking Switzerland to ${art}, and back again: packing, transport, delivery to your new address and help with the customs paperwork.`,
    citiesTitle: 'Main destinations',
    mainTitle: 'Where we go',
    includedTitle: 'What’s included',
    included: ['Packing and protection of your belongings', 'Furniture dismantling', 'Transport and delivery to your new address', 'Help with the customs paperwork'],
    notesTitle: 'Good to know',
    bothWays: 'Both ways, into Switzerland as well',
    customs: (art: string) => ({
      title: 'Customs, handled with our office',
      intro: `Moving between Switzerland and ${art} means crossing a customs border. Every situation is different, so the formalities are handled directly with our office once you have requested a quote.`,
      items: [
        { title: 'Your quote request', text: 'Tell us about the property, the date and your new address.' },
        { title: 'A conversation with our office', text: 'Our office gets in touch to go over your situation and the customs documents you need.' },
        { title: 'Paperwork prepared with you', text: 'We help you prepare them before you leave, so the border crossing holds no surprises.' },
      ],
      note: 'The rules can change: your situation is always checked with you when we prepare the quote.',
    }),
    reverseQ: (art: string) => `Do you also move people from ${art} to Switzerland?`,
    reverseA: 'Yes, both ways and with the same service: packing, transport, help with customs and delivery.',
    docsQ: 'Which customs documents do I need?',
    docsA: 'It depends on your situation. Our office gives you the list once you have requested a quote and helps you prepare the documents.',
    relatedCountry: (name: string) => `Removals to ${name}`,
    band: (dest: string) => ({
      title: `Moving ${dest}?`,
      text: 'Describe your move in two minutes: we reply within 30 min, between 8am and 7pm.',
      cta: 'Request a quote',
    }),
  }
);

/** Monta a página de um país a partir do texto próprio (data/countryPages.ts) e do comum. */
const countryCopy = (slug: CountrySlug): Record<Lang, AbroadCopy> => {
  const data = COUNTRY_PAGES[slug];
  const country = COUNTRIES.find((x) => x.slug === slug)!;
  const build = (lang: Lang): AbroadCopy => {
    const t = data[lang];
    const k = COUNTRY_COMMON[lang];
    const base = INTERNATIONAL[lang];
    const name = lang === 'en' ? country.nameEn : country.name;
    return {
      breadcrumb: name,
      parent: k.parent,
      h1: k.h1(t.art),
      lead: k.lead(t.art),
      checks: base.checks,
      callLabel: base.callLabel,
      wizardTo: name,
      hero: base.hero,
      main: {
        title: k.mainTitle,
        intro: t.intro,
        groups: [
          { title: t.citiesTitle ?? k.citiesTitle, items: t.cities },
          { title: k.includedTitle, items: k.included },
          {
            title: k.notesTitle,
            items: [...t.notes, k.bothWays],
            link: data.extraLink && { label: data.extraLink[lang], to: data.extraLink.to },
          },
        ],
      },
      customs: k.customs(t.art, t.dest),
      stepsTitle: base.stepsTitle,
      steps: base.steps,
      faqTitle: base.faqTitle,
      faq: [
        ...(t.faq ? [t.faq] : []),
        { q: k.reverseQ(t.art), a: k.reverseA },
        { q: k.docsQ, a: k.docsA },
        // Preço ferme e garde-meubles: mesmas respostas da página internacional.
        base.faq[1],
        base.faq[2],
      ],
      relatedTitle: base.relatedTitle,
      related: [
        { label: k.parent.label, to: k.parent.to },
        ...data.related.map((r) => {
          const p = COUNTRIES.find((x) => x.slug === r)!;
          return { label: k.relatedCountry(lang === 'en' ? p.enTo : p.name), to: p.path };
        }),
        base.related[1],
      ],
      band: k.band(t.dest),
    };
  };
  return { fr: build('fr'), en: build('en') };
};

const UI = defineCopy(
  { home: 'Accueil', breadcrumbLabel: "Fil d'Ariane", call: 'Appeler le 0800 825 925' },
  { home: 'Home', breadcrumbLabel: 'Breadcrumb', call: 'Call 0800 825 925' }
);

const FaqItem: React.FC<Faq> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  const id = React.useId();
  return (
    <li className="border-b border-slate-200">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-[#0B1E33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
        >
          {q}
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-5 text-lg leading-relaxed text-slate-600">
        {a}
      </div>
    </li>
  );
};

const AbroadPage: React.FC<{ copy: Record<'fr' | 'en', AbroadCopy> }> = ({ copy }) => {
  const { lang, lp } = useLang();
  const c = copy[lang];
  const ui = UI[lang];

  return (
    <div className="bg-white font-sans text-slate-900">
      <SEO />

      <section className="relative isolate overflow-hidden bg-[#0B1E33]">
        <picture>
          <source media="(max-width: 767px)" srcSet={c.hero.srcSmall} />
          <img
            src={c.hero.src}
            width={1920}
            height={1072}
            alt={c.hero.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            style={{ objectPosition: c.hero.position }}
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#0B1E33]/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0B1E33]/95 lg:via-[#0B1E33]/75 lg:to-[#0B1E33]/40"
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-6 lg:pt-4 xl:col-span-7">
            <nav aria-label={ui.breadcrumbLabel} className="text-sm text-slate-300">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to={lp('/')} className="underline-offset-4 hover:text-white hover:underline">
                    {ui.home}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                {c.parent && (
                  <>
                    <li>
                      <Link to={lp(c.parent.to)} className="underline-offset-4 hover:text-white hover:underline">
                        {c.parent.label}
                      </Link>
                    </li>
                    <li aria-hidden="true">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </li>
                  </>
                )}
                <li aria-current="page" className="font-medium text-white">
                  {c.breadcrumb}
                </li>
              </ol>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl">{c.h1}</h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-slate-200 sm:text-xl">{c.lead}</p>
            <ul className="mt-7 flex flex-col gap-2.5 text-base text-white sm:flex-row sm:flex-wrap sm:gap-x-6">
              {c.checks.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-sky-300" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="tel:0800825925"
              aria-label={ui.call}
              className="mt-8 inline-flex items-center gap-2 py-2 text-lg font-semibold text-white transition-colors hover:text-sky-300"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span className="tabular-nums">0800 825 925</span>
              <span className="font-normal text-slate-300">{c.callLabel}</span>
            </a>
          </div>

          <div id="devis" className="scroll-mt-32 lg:col-span-6 xl:col-span-5">
            <QuoteWizard key={`${lang}-${c.breadcrumb}`} urlService="prive" initialTo={c.wizardTo} elevated />
          </div>
        </div>
      </section>

      {/* Destinos (internacional) ou o que está incluído (Londres) */}
      <section aria-labelledby="main-title" className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 id="main-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
              {c.main.title}
            </h2>
            {c.main.intro && <p className="mt-4 text-lg leading-relaxed text-slate-600">{c.main.intro}</p>}
          </div>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-3 lg:col-span-8">
            {c.main.groups.map((g) => (
              <div key={g.title} className="border-t-2 border-[#0B1E33] pb-8 pt-5">
                <h3 className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">{g.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((item) => (
                    <li key={typeof item === 'string' ? item : item.to} className="flex items-start gap-2.5 text-lg leading-snug text-slate-700">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#0B1E33]" strokeWidth={2.5} aria-hidden="true" />
                      {typeof item === 'string' ? (
                        item
                      ) : (
                        <Link
                          to={lp(item.to)}
                          className="font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                {g.link && (
                  <Link
                    to={lp(g.link.to)}
                    className="mt-5 inline-flex items-center gap-1.5 py-1 text-lg font-semibold text-[#0B1E33] underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-[#0B1E33]"
                  >
                    {g.link.label}
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alfândega */}
      <section aria-labelledby="customs-title" className="border-t border-slate-200 bg-[#F8FAFC] py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 id="customs-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
              {c.customs.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{c.customs.intro}</p>
          </div>
          <div className="lg:col-span-8">
            <dl className={`grid grid-cols-1 gap-x-8 ${c.customs.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {c.customs.items.map((it) => (
                <div key={it.title} className="border-t-2 border-[#0B1E33] pb-6 pt-5">
                  <dt className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">{it.title}</dt>
                  <dd className="mt-2 text-lg leading-relaxed text-slate-600">{it.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-slate-600">{c.customs.note}</p>
          </div>
        </div>
      </section>

      {/* Etapas */}
      <section aria-labelledby="steps-title" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="steps-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
            {c.stepsTitle}
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {c.steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-[#0B1E33] pt-5">
                <span className="font-display text-base font-semibold tabular-nums text-slate-500">{i + 1}</span>
                <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-[#0B1E33]">{s.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ + links relacionados */}
      <section aria-labelledby="faq-title" className="border-t border-slate-200 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <h2 id="faq-title" className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-[#0B1E33] lg:text-4xl">
              {c.faqTitle}
            </h2>
            <ul className="mt-6 border-t border-slate-200">
              {c.faq.map((f) => (
                <FaqItem key={f.q} {...f} />
              ))}
            </ul>
          </div>
          <nav aria-labelledby="related-title" className="lg:col-span-4">
            <h2 id="related-title" className="font-display text-xl font-medium tracking-tight text-[#0B1E33]">
              {c.relatedTitle}
            </h2>
            <ul className="mt-4 border-t border-slate-200">
              {c.related.map((r) => (
                <li key={r.to} className="border-b border-slate-200">
                  <Link
                    to={lp(r.to)}
                    className="group flex items-center justify-between gap-3 py-4 text-lg font-semibold text-[#0B1E33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0284c7]"
                  >
                    {r.label}
                    <ChevronRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-slate-400 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-[#0B1E33]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Faixa final */}
      <section className="bg-[#0B1E33] py-14 text-white lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight">{c.band.title}</h2>
            <p className="mt-2 text-lg text-slate-300">{c.band.text}</p>
          </div>
          <a href="#devis" className="btn btn-lg btn-inverse shrink-0">
            {c.band.cta}
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
};

export const International: React.FC = () => <AbroadPage copy={INTERNATIONAL} />;
export const London: React.FC = () => <AbroadPage copy={LONDON} />;
export const CountryPage: React.FC<{ slug: CountrySlug }> = ({ slug }) => {
  const copy = useMemo(() => countryCopy(slug), [slug]);
  return <AbroadPage copy={copy} />;
};
