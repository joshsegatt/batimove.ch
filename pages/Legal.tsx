import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Button, buttonClass } from '../components/UIComponents';
import { SEO } from '../components/SEO';
import { defineCopy, useLang, type Lang } from '../i18n';

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

const COPY = defineCopy(
  {
    lastUpdated: '31 octobre 2026',
    lastUpdatedLabel: 'Dernière mise à jour :',
    back: 'Retour',
    seeAlso: 'Voir également notre',
    privacyLink: 'politique de protection des données',
    bindingNotice: null as string | null,
  },
  {
    lastUpdated: '31 October 2026',
    lastUpdatedLabel: 'Last updated:',
    back: 'Back',
    seeAlso: 'See also our',
    privacyLink: 'privacy policy',
    bindingNotice: 'This English translation is provided for convenience; the French version is legally binding.',
  }
);

const DOCUMENTS: Record<Lang, Record<LegalProps['type'], LegalDocument>> = {
  fr: {
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
  },
  en: {
    privacy: {
      title: 'Privacy policy (nFADP)',
      icon: Shield,
      intro:
        "This policy explains which personal data Batimove Sàrl processes when you use batimove.ch, for what purposes, with which service providers, and which rights you can exercise. It has been drawn up in accordance with the Swiss Federal Act on Data Protection (nFADP) and, for visitors based in the European Union, with the GDPR.",
      sections: [
        {
          heading: '1. Controller',
          paragraphs: [
            "BATIMOVE Sàrl, c/o Fiduciaire Fidulex Sàrl, Rue De-Monthoux 64, 1201 Genève, Switzerland. UID: CHE-143.091.230.",
            "For any question about your data: info@batimove.ch or 0800 825 925."
          ]
        },
        {
          heading: '2. Data we process',
          paragraphs: [
            "We only collect the data needed to handle your request:"
          ],
          bullets: [
            "Data you send us through our quote and contact forms: first and last name, phone number, email address, departure and destination towns or postcodes, preferred date, and any details you choose to add (volume, floor, lift, special items).",
            "Data from your volume estimate: the furniture selected in the calculator is kept in your browser's local storage so that your entries are not lost. It is only sent to us if you confirm sending the quote request.",
            "Browsing data: if you consent, audience measurement and advertising cookies tell us through which channel you arrived on the site. None of this data allows us to identify you by name."
          ]
        },
        {
          heading: '3. Purposes and legal bases',
          bullets: [
            "Preparing your quote and getting back to you: carrying out pre-contractual measures at your request.",
            "Performing the removal service and invoicing: performance of the contract and legal obligations.",
            "Measuring the effectiveness of our advertising campaigns: your consent, which you may refuse without any consequence for your browsing."
          ]
        },
        {
          heading: '4. Recipients and processors',
          paragraphs: [
            "We neither sell nor rent out your data. It is passed only to the technical service providers needed for the site to operate:"
          ],
          bullets: [
            "EmailJS: routing of forms to our info@batimove.ch inbox. Servers located in the United States. This is the only channel through which your request reaches us.",
            "Vercel: website hosting.",
            "Google Ireland Ltd. / Google LLC: audience measurement and advertising tracking via Google Ads, only if you have accepted cookies.",
            "Our delivery partners (transport, cleaning or storage subcontractors), where carrying out your move requires it, and limited to the information needed for that purpose."
          ]
        },
        {
          heading: '5. Transfers outside Switzerland',
          paragraphs: [
            "Some of the providers mentioned above process data outside Switzerland, in particular in the United States and the European Union. These transfers are based on standard contractual clauses and on the data protection commitments entered into by these providers."
          ]
        },
        {
          heading: '6. Retention period',
          bullets: [
            "Quote requests that are not followed up: 12 months from the last contact, then deleted.",
            "Client files, contracts and accounting records: 10 years, in accordance with Art. 958f of the Swiss Code of Obligations.",
            "Advertising measurement data: according to Google Ads' own retention periods."
          ]
        },
        {
          heading: '7. Your rights',
          paragraphs: [
            "You may at any time request access to your data, its rectification, its erasure or the restriction of its processing, or object to processing based on your consent. A request to info@batimove.ch is sufficient; we will reply as quickly as possible and within 30 days at the latest.",
            "If you believe that your rights are not being respected, you may refer the matter to the Federal Data Protection and Information Commissioner (FDPIC) or to the supervisory authority in your country of residence."
          ]
        },
        {
          heading: '8. Cookies and trackers',
          paragraphs: [
            "No measurement or advertising cookie is set before you have made your choice: consent is refused by default and is only activated if you click “Accept” in the banner.",
            "To change your choice, clear your browser's site data for batimove.ch: the banner will reappear on your next visit and you will be able to choose again."
          ]
        },
        {
          heading: '9. Security',
          paragraphs: [
            "The site is served exclusively over HTTPS. Your requests reach us by email, and access to them is restricted to authorised persons at Batimove Sàrl."
          ]
        }
      ]
    },
    terms: {
      title: 'General terms and conditions',
      icon: FileText,
      intro:
        "These terms govern the removal, transport, storage, house clearance and cleaning services provided by Batimove Sàrl. The commercial terms specific to your case (price, deposit, timescales, cancellation arrangements) are set out in the quote sent to you and take precedence over the general provisions below.",
      sections: [
        {
          heading: '1. Scope',
          paragraphs: [
            "These terms apply to any service ordered from Batimove Sàrl, whether the request is made via the website, by telephone or through direct contact. Any departure from these terms must be agreed in writing."
          ]
        },
        {
          heading: '2. Quotes and prices',
          paragraphs: [
            "The quote is free and without obligation. It is based on the information you provide to us (volume, access, floors, lift, distance, services chosen). Its period of validity is stated on the quote itself.",
            "The price becomes firm once the quote has been accepted. It may only be revised if the actual conditions differ significantly from those stated (larger volume, impracticable access, undeclared floor, parking unavailable). In that case, the additional charge will be submitted to you before any work is carried out.",
            "All prices are stated in Swiss francs (CHF). The applicable VAT is shown on the invoice."
          ]
        },
        {
          heading: '3. Client obligations',
          bullets: [
            "Provide accurate and complete information about the volume, access and constraints at both addresses.",
            "Ensure access to the premises on the agreed dates and at the agreed times.",
            "Inform us of any items of particular value, fragile items or non-standard items before the job.",
            "Not hand over any dangerous, illegal or perishable goods for transport.",
            "Empty and disconnect household appliances, unless otherwise agreed."
          ]
        },
        {
          heading: '4. Parking permits',
          paragraphs: [
            "Where the service includes it, Batimove Sàrl takes care of reserving a parking space with the relevant authorities. Fees and charges invoiced by the municipality or the police are passed on to the client at actual cost, unless otherwise stated on the quote."
          ]
        },
        {
          heading: '5. Insurance and liability',
          paragraphs: [
            "Every transport carried out by Batimove Sàrl is covered by professional liability insurance up to CHF 5,000,000.",
            "Any damage must be reported on delivery and recorded on the handover document, or notified in writing to info@batimove.ch as soon as possible, so that it can be assessed.",
            "We accept no liability for damage resulting from packing carried out by the client, from an inherent defect in the item, or from inaccurate information that led to an incorrect assessment of the service."
          ]
        },
        {
          heading: '6. Invoicing and payment',
          paragraphs: [
            "The following payment methods are accepted: cash, credit card, bank transfer and TWINT. Payment terms and arrangements, as well as any deposit, are stated on the quote and on the invoice."
          ]
        },
        {
          heading: '7. Changes and cancellation',
          paragraphs: [
            "Any change of date or scope must be notified to us as soon as possible so that we can reorganise our teams. The cancellation terms and any applicable fees are set out in the accepted quote."
          ]
        },
        {
          heading: '8. Complaints',
          paragraphs: [
            "Any complaint may be sent to info@batimove.ch or made by calling 0800 825 925. We undertake to respond and to seek an amicable solution before taking any other action."
          ]
        },
        {
          heading: '9. Governing law and place of jurisdiction',
          paragraphs: [
            "These terms are governed by Swiss law. The place of jurisdiction is Geneva, subject to any mandatory places of jurisdiction provided for by law."
          ]
        }
      ]
    },
    impressum: {
      title: 'Legal notice',
      icon: Scale,
      intro: "Legal information about the publisher and the hosting of the batimove.ch website.",
      sections: [
        {
          heading: 'Website publisher',
          bullets: [
            'Company name: BATIMOVE Sàrl (limited liability company)',
            'Registered office: c/o Fiduciaire Fidulex Sàrl, Rue De-Monthoux 64, 1201 Genève, Switzerland',
            'UID: CHE-143.091.230',
            'Registered in the commercial register of the Canton of Geneva',
            'Phone: 0800 825 925 (free from within Switzerland)',
            'Email: info@batimove.ch'
          ]
        },
        {
          heading: 'Responsible for publication',
          paragraphs: ['The management of Batimove Sàrl, at the registered office address given above.']
        },
        {
          heading: 'Hosting',
          paragraphs: [
            "The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States."
          ]
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            "The texts, photographs, logos and graphic elements on this site are the property of Batimove Sàrl or are used with the permission of their owners. Any reproduction without prior written consent is prohibited."
          ]
        },
        {
          heading: 'Data protection',
          paragraphs: [
            "The processing of personal data is described in our privacy policy."
          ]
        }
      ]
    }
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
  const { lang, lp } = useLang();
  const c = COPY[lang];
  const doc = DOCUMENTS[lang][type];
  const Icon = doc.icon;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <SEO title={TITLES[type]} description={DESCRIPTIONS[type]} canonical={PATHS[type]} />
      <div className="max-w-3xl mx-auto px-6">
        <Link to={lp('/')} className={buttonClass('ghost', 'sm', '-ml-3.5 mb-8 text-slate-600')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {c.back}
        </Link>

        <div className="bg-white rounded-2xl shadow-rest border border-slate-200 p-8 md:p-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
            <Icon className="w-8 h-8 text-batimove-blue" />
          </div>

          <h1 className="font-display text-3xl font-medium text-slate-900 mb-5">{doc.title}</h1>

          {c.bindingNotice && (
            <p className="text-slate-500 text-sm leading-relaxed italic mb-4">{c.bindingNotice}</p>
          )}

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
              {c.seeAlso}{' '}
              <Link to={lp('/privacy')} className="text-batimove-blue underline underline-offset-2 hover:text-sky-700">
                {c.privacyLink}
              </Link>
              .
            </p>
          )}

          <p className="text-slate-400 text-sm mt-10 pt-8 border-t border-slate-100">
            {c.lastUpdatedLabel} {c.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};
