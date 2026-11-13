import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Button, buttonClass } from '../components/UIComponents';
import { SEO } from '../components/SEO';

interface LegalProps {
  type: 'privacy' | 'terms' | 'impressum';
}

interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalDocument {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  intro: string;
  sections: LegalSection[];
}

const LAST_UPDATED = '31 octobre 2026';

const DOCUMENTS: Record<LegalProps['type'], LegalDocument> = {
  privacy: {
    title: 'Protection des données (nLPD)',
    icon: Shield,
    intro:
      "La présente politique explique quelles données personnelles Batimove Sàrl traite lorsque vous utilisez batimove.ch, à quelles fins, avec quels prestataires, et quels droits vous pouvez exercer. Elle est établie conformément à la Loi fédérale sur la protection des données (nLPD) et, pour les visiteurs établis dans l'Union européenne, au RGPD.",
    sections: [
      {
        heading: '1. Responsable du traitement',
        paragraphs: [
          "BATIMOVE Sàrl, c/o Fiduciaire Fidulex Sàrl, Rue De-Monthoux 64, 1201 Genève, Suisse. IDE : CHE-143.091.230.",
          "Pour toute question relative à vos données : info@batimove.ch ou 0800 825 925."
        ]
      },
      {
        heading: '2. Données que nous traitons',
        paragraphs: [
          "Nous ne collectons que les données nécessaires au traitement de votre demande :"
        ],
        bullets: [
          "Données que vous nous transmettez via nos formulaires de devis et de contact : nom et prénom, numéro de téléphone, adresse e-mail, villes ou codes postaux de départ et d'arrivée, date souhaitée, et les précisions que vous choisissez d'ajouter (volume, étage, ascenseur, objets particuliers).",
          "Données de votre estimation de volume : les meubles sélectionnés dans le calculateur sont conservés dans le stockage local de votre navigateur afin de ne pas perdre votre saisie. Ils ne nous sont transmis que si vous validez l'envoi du devis.",
          "Données de navigation : si vous y consentez, des cookies de mesure d'audience et de publicité nous indiquent par quel canal vous êtes arrivé sur le site. Aucune de ces données ne nous permet de vous identifier nominativement."
        ]
      },
      {
        heading: '3. Finalités et bases légales',
        bullets: [
          "Établir votre devis et vous recontacter : exécution de mesures précontractuelles à votre demande.",
          "Exécuter la prestation de déménagement et établir la facturation : exécution du contrat et obligations légales.",
          "Mesurer l'efficacité de nos campagnes publicitaires : votre consentement, que vous pouvez refuser sans aucune conséquence sur votre navigation."
        ]
      },
      {
        heading: '4. Destinataires et sous-traitants',
        paragraphs: [
          "Nous ne vendons ni ne louons vos données. Elles sont transmises uniquement aux prestataires techniques nécessaires au fonctionnement du site :"
        ],
        bullets: [
          "EmailJS : acheminement des formulaires vers notre boîte info@batimove.ch. Serveurs situés aux États-Unis. C'est par ce seul canal que votre demande nous parvient.",
          "Vercel : hébergement du site internet.",
          "Google Ireland Ltd. / Google LLC : mesure d'audience et suivi publicitaire via Google Ads, uniquement si vous avez accepté les cookies.",
          "Nos partenaires d'exécution (sous-traitants de transport, de nettoyage ou de stockage), lorsque la réalisation de votre déménagement l'exige, et limités aux informations nécessaires à cette exécution."
        ]
      },
      {
        heading: '5. Transferts hors de Suisse',
        paragraphs: [
          "Certains prestataires mentionnés ci-dessus traitent les données en dehors de la Suisse, notamment aux États-Unis et dans l'Union européenne. Ces transferts reposent sur les clauses contractuelles types et les engagements de protection des données souscrits par ces prestataires."
        ]
      },
      {
        heading: '6. Durée de conservation',
        bullets: [
          "Demandes de devis restées sans suite : 12 mois à compter du dernier contact, puis suppression.",
          "Dossiers clients, contrats et pièces comptables : 10 ans, conformément à l'art. 958f du Code des obligations.",
          "Données de mesure publicitaire : selon les durées de rétention propres à Google Ads."
        ]
      },
      {
        heading: '7. Vos droits',
        paragraphs: [
          "Vous pouvez à tout moment demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement, ou vous opposer à un traitement fondé sur votre consentement. Une demande à info@batimove.ch suffit ; nous y répondons dans les meilleurs délais et au plus tard sous 30 jours.",
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir le Préposé fédéral à la protection des données et à la transparence (PFPDT), ou l'autorité de contrôle de votre pays de résidence."
        ]
      },
      {
        heading: '8. Cookies et traceurs',
        paragraphs: [
          "Aucun cookie de mesure ou de publicité n'est déposé avant votre choix : le consentement est refusé par défaut et n'est activé que si vous cliquez sur « Accepter » dans la bannière.",
          "Pour revenir sur votre choix, effacez les données de site de votre navigateur pour batimove.ch : la bannière réapparaîtra lors de votre prochaine visite et vous pourrez choisir à nouveau."
        ]
      },
      {
        heading: '9. Sécurité',
        paragraphs: [
          "Le site est servi exclusivement en HTTPS. Vos demandes nous parviennent par courrier électronique et leur accès est réservé aux personnes autorisées de Batimove Sàrl."
        ]
      }
    ]
  },
  terms: {
    title: 'Conditions générales (CGV)',
    icon: FileText,
    intro:
      "Les présentes conditions régissent les prestations de déménagement, transport, garde-meubles, débarras et nettoyage fournies par Batimove Sàrl. Les conditions commerciales propres à votre dossier (prix, acompte, délais, modalités d'annulation) figurent sur le devis qui vous est adressé et prévalent sur les dispositions générales ci-dessous.",
    sections: [
      {
        heading: '1. Champ d\'application',
        paragraphs: [
          "Ces conditions s'appliquent à toute prestation commandée auprès de Batimove Sàrl, que la demande provienne du site internet, du téléphone ou d'un échange direct. Toute dérogation doit être convenue par écrit."
        ]
      },
      {
        heading: '2. Devis et prix',
        paragraphs: [
          "Le devis est gratuit et sans engagement. Il est établi sur la base des informations que vous nous communiquez (volume, accès, étages, ascenseur, distance, prestations choisies). Sa durée de validité est indiquée sur le devis lui-même.",
          "Le prix devient ferme dès acceptation du devis. Il ne peut être revu que si les conditions réelles diffèrent sensiblement de celles annoncées (volume supérieur, accès impraticable, étage non signalé, stationnement indisponible). Dans ce cas, le supplément vous est soumis avant toute exécution.",
          "Tous les prix sont exprimés en francs suisses (CHF). La TVA applicable est mentionnée sur la facture."
        ]
      },
      {
        heading: '3. Obligations du client',
        bullets: [
          "Communiquer des informations exactes et complètes sur le volume, les accès et les contraintes des deux adresses.",
          "Assurer l'accès aux locaux aux dates et heures convenues.",
          "Signaler les objets de valeur particulière, fragiles ou hors normes avant l'intervention.",
          "Ne pas remettre au transport des marchandises dangereuses, illicites ou périssables.",
          "Vider et débrancher les appareils électroménagers, sauf prestation contraire convenue."
        ]
      },
      {
        heading: '4. Autorisations de stationnement',
        paragraphs: [
          "Lorsque la prestation le prévoit, Batimove Sàrl prend en charge les démarches de réservation d'emplacement auprès des autorités compétentes. Les taxes et émoluments facturés par la commune ou la police sont refacturés au client à leur coût effectif, sauf mention contraire sur le devis."
        ]
      },
      {
        heading: '5. Assurance et responsabilité',
        paragraphs: [
          "Chaque transport réalisé par Batimove Sàrl est couvert par une assurance responsabilité civile professionnelle à hauteur de CHF 5'000'000.",
          "Tout dommage doit être signalé lors de la livraison et mentionné sur le document de prise en charge, ou par écrit à info@batimove.ch dans les meilleurs délais, afin de permettre son constat.",
          "Notre responsabilité n'est pas engagée pour les dommages résultant d'un emballage effectué par le client, d'un vice propre du bien, ou d'informations inexactes ayant conduit à une mauvaise évaluation de la prestation."
        ]
      },
      {
        heading: '6. Facturation et paiement',
        paragraphs: [
          "Les moyens de paiement acceptés sont les suivants : espèces, carte de crédit, virement bancaire et TWINT. Les délais et modalités de paiement, ainsi que l'acompte éventuel, sont indiqués sur le devis et sur la facture."
        ]
      },
      {
        heading: '7. Modification et annulation',
        paragraphs: [
          "Toute modification de date ou de périmètre doit nous être communiquée dès que possible afin que nous puissions réorganiser les équipes. Les conditions d'annulation et les éventuels frais applicables figurent sur le devis accepté."
        ]
      },
      {
        heading: '8. Réclamations',
        paragraphs: [
          "Toute réclamation peut être adressée à info@batimove.ch ou au 0800 825 925. Nous nous engageons à y répondre et à rechercher une solution amiable avant toute autre démarche."
        ]
      },
      {
        heading: '9. Droit applicable et for',
        paragraphs: [
          "Les présentes conditions sont soumises au droit suisse. Le for est à Genève, sous réserve des fors impératifs prévus par la loi."
        ]
      }
    ]
  },
  impressum: {
    title: 'Mentions légales',
    icon: Scale,
    intro: "Informations légales relatives à l'éditeur et à l'hébergement du site batimove.ch.",
    sections: [
      {
        heading: 'Éditeur du site',
        bullets: [
          'Raison sociale : BATIMOVE Sàrl (société à responsabilité limitée)',
          'Siège : c/o Fiduciaire Fidulex Sàrl, Rue De-Monthoux 64, 1201 Genève, Suisse',
          'IDE : CHE-143.091.230',
          'Inscrite au registre du commerce du canton de Genève',
          'Téléphone : 0800 825 925 (gratuit depuis la Suisse)',
          'E-mail : info@batimove.ch'
        ]
      },
      {
        heading: 'Responsable de la publication',
        paragraphs: ['La direction de Batimove Sàrl, à l\'adresse du siège indiquée ci-dessus.']
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."
        ]
      },
      {
        heading: 'Propriété intellectuelle',
        paragraphs: [
          "Les textes, photographies, logos et éléments graphiques présents sur ce site sont la propriété de Batimove Sàrl ou utilisés avec l'autorisation de leurs titulaires. Toute reproduction sans accord écrit préalable est interdite."
        ]
      },
      {
        heading: 'Protection des données',
        paragraphs: [
          "Le traitement des données personnelles est décrit dans notre politique de protection des données."
        ]
      }
    ]
  }
};

const TITLES: Record<LegalProps['type'], string> = {
  privacy: 'Protection des Données (nLPD) | Batimove Sàrl',
  terms: 'Conditions Générales de Vente (CGV) | Batimove Sàrl',
  impressum: 'Mentions Légales & Impressum | Batimove Sàrl'
};

const DESCRIPTIONS: Record<LegalProps['type'], string> = {
  privacy:
    "Quelles données Batimove Sàrl traite, avec quels prestataires, combien de temps et comment exercer vos droits selon la nLPD.",
  terms:
    "Conditions générales de Batimove Sàrl : devis, prix, obligations, assurance RC 5M CHF, annulation et for juridique.",
  impressum:
    "Mentions légales de Batimove Sàrl : éditeur, siège à Genève, IDE CHE-143.091.230 et hébergement du site."
};

const PATHS: Record<LegalProps['type'], string> = {
  privacy: 'https://www.batimove.ch/privacy',
  terms: 'https://www.batimove.ch/terms',
  impressum: 'https://www.batimove.ch/legal'
};

export const Legal: React.FC<LegalProps> = ({ type }) => {
  const doc = DOCUMENTS[type];
  const Icon = doc.icon;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <SEO title={TITLES[type]} description={DESCRIPTIONS[type]} canonical={PATHS[type]} />
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className={buttonClass('ghost', 'sm', '-ml-3.5 mb-8 text-slate-600')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour
        </Link>

        <div className="bg-white rounded-2xl shadow-rest border border-slate-200 p-8 md:p-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
            <Icon className="w-8 h-8 text-batimove-blue" />
          </div>

          <h1 className="font-display text-3xl font-medium text-slate-900 mb-5">{doc.title}</h1>

          <p className="text-slate-600 text-base leading-relaxed">{doc.intro}</p>

          <div className="mt-10 space-y-9">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">{section.heading}</h2>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-slate-600 text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-3 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-slate-600 text-sm leading-relaxed">
                        <span aria-hidden="true" className="mt-2 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {type !== 'privacy' && (
            <p className="text-sm text-slate-500 mt-10">
              Voir également notre{' '}
              <Link to="/privacy" className="text-batimove-blue underline underline-offset-2 hover:text-sky-700">
                politique de protection des données
              </Link>
              .
            </p>
          )}

          <p className="text-slate-400 text-sm mt-10 pt-8 border-t border-slate-100">
            Dernière mise à jour : {LAST_UPDATED}
          </p>
        </div>
      </div>
    </div>
  );
};
