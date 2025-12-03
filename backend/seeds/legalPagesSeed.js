const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const LegalPage = require('../models/LegalPage');

// ============================================
// PRIVACY POLICY - All Languages
// ============================================
const privacyPolicyData = {
  en: {
    pageType: 'privacy-policy',
    language: 'en',
    pageTitle: 'Privacy Policy - Zenyourlife',
    lastUpdated: 'December 2024',
    introduction: 'Zenyourlife ("we", "our", or "us") operates the website zenyourlife.be and provides wellness services, coaching, massage therapy, and holiday rentals in Lanzarote. We are committed to protecting your privacy and complying with the EU GDPR and Belgian data-protection laws.',
    sections: [
      {
        key: 'personalData',
        title: 'Personal Data We Collect',
        content: `1.1 Data you provide directly
• Name, surname
• Email address
• Phone number
• Billing details (for bookings or service payments)
• Booking information (dates, preferences, number of guests)
• Messages sent through contact forms, email, WhatsApp
• Newsletter sign-up information

1.2 Data collected automatically
• IP address
• Device and browser information
• Usage and analytics data
• Cookies (see Cookie Policy)

1.3 Data from third parties
• Booking platforms (Booking.com, Airbnb)
• Google My Business / Google Maps
• Payment processors (e.g., Stripe / Mollie if used)`
      },
      {
        key: 'purpose',
        title: 'Purpose of Data Processing',
        content: `We use your data to:
• Manage and confirm bookings
• Communicate with you regarding your stay or services
• Provide personalised wellness services
• Improve the website and user experience
• Send newsletters (only with explicit consent)
• Fulfill legal and accounting obligations`
      },
      {
        key: 'legalBasis',
        title: 'Legal Basis (GDPR)',
        content: `We process your data on the following bases:
• Performance of a contract (bookings and services)
• Consent (newsletter, cookies, marketing)
• Legitimate interest (site security, analytics)
• Legal obligation (invoices, financial records)`
      },
      {
        key: 'storage',
        title: 'Data Storage & Security',
        content: `We use industry-standard measures to secure your data.

Your information is stored in:
• Secure hosting servers
• Booking platforms
• Google Workspace (email, file storage)

Data is only accessible to authorized staff.`
      },
      {
        key: 'sharing',
        title: 'Data Sharing',
        content: `We do not sell your data.

We only share data with:
• Booking platforms (Booking.com, Airbnb)
• Payment processors
• IT/hosting partners
• Google services (Analytics, Maps, Gmail)
• Professional partners strictly necessary to provide services

All partners are GDPR-compliant.`
      },
      {
        key: 'international',
        title: 'International Transfers',
        content: `Some partners (e.g., Google) may store data outside the EU.

Transfers only occur under GDPR-approved mechanisms (SCCs / adequacy decisions).`
      },
      {
        key: 'retention',
        title: 'Data Retention',
        content: `We keep data only as long as necessary:
• Booking data: 7 years (legal requirement)
• Newsletter data: until consent is withdrawn
• Contact form: 12 months
• Cookie data: according to cookie type`
      },
      {
        key: 'rights',
        title: 'Your Rights (GDPR)',
        content: `You have the right to:
• Access your data
• Correct or update your data
• Request deletion ("right to be forgotten")
• Restrict processing
• Object to processing
• Data portability
• Withdraw consent at any time

To exercise your rights, contact: info@zenyourlife.be`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
Email: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  },
  fr: {
    pageType: 'privacy-policy',
    language: 'fr',
    pageTitle: 'Politique de Confidentialité - Zenyourlife',
    lastUpdated: 'Décembre 2024',
    introduction: 'Zenyourlife ("nous", "notre" ou "nos") exploite le site web zenyourlife.be et fournit des services de bien-être, coaching, massothérapie et locations de vacances à Lanzarote. Nous nous engageons à protéger votre vie privée et à respecter le RGPD européen et les lois belges sur la protection des données.',
    sections: [
      {
        key: 'personalData',
        title: 'Données Personnelles Collectées',
        content: `1.1 Données que vous fournissez directement
• Nom, prénom
• Adresse e-mail
• Numéro de téléphone
• Détails de facturation (pour réservations ou paiements)
• Informations de réservation (dates, préférences, nombre d'invités)
• Messages envoyés via formulaires de contact, e-mail, WhatsApp
• Informations d'inscription à la newsletter

1.2 Données collectées automatiquement
• Adresse IP
• Informations sur l'appareil et le navigateur
• Données d'utilisation et d'analyse
• Cookies (voir Politique de Cookies)

1.3 Données de tiers
• Plateformes de réservation (Booking.com, Airbnb)
• Google My Business / Google Maps
• Processeurs de paiement (ex: Stripe / Mollie)`
      },
      {
        key: 'purpose',
        title: 'Finalité du Traitement des Données',
        content: `Nous utilisons vos données pour :
• Gérer et confirmer les réservations
• Communiquer avec vous concernant votre séjour ou services
• Fournir des services de bien-être personnalisés
• Améliorer le site web et l'expérience utilisateur
• Envoyer des newsletters (uniquement avec consentement explicite)
• Remplir les obligations légales et comptables`
      },
      {
        key: 'legalBasis',
        title: 'Base Juridique (RGPD)',
        content: `Nous traitons vos données sur les bases suivantes :
• Exécution d'un contrat (réservations et services)
• Consentement (newsletter, cookies, marketing)
• Intérêt légitime (sécurité du site, analyses)
• Obligation légale (factures, registres financiers)`
      },
      {
        key: 'storage',
        title: 'Stockage et Sécurité des Données',
        content: `Nous utilisons des mesures standard de l'industrie pour sécuriser vos données.

Vos informations sont stockées dans :
• Serveurs d'hébergement sécurisés
• Plateformes de réservation
• Google Workspace (e-mail, stockage de fichiers)

Les données ne sont accessibles qu'au personnel autorisé.`
      },
      {
        key: 'sharing',
        title: 'Partage des Données',
        content: `Nous ne vendons pas vos données.

Nous partageons les données uniquement avec :
• Plateformes de réservation (Booking.com, Airbnb)
• Processeurs de paiement
• Partenaires IT/hébergement
• Services Google (Analytics, Maps, Gmail)
• Partenaires professionnels strictement nécessaires

Tous les partenaires sont conformes au RGPD.`
      },
      {
        key: 'international',
        title: 'Transferts Internationaux',
        content: `Certains partenaires (ex: Google) peuvent stocker des données hors de l'UE.

Les transferts n'ont lieu que sous des mécanismes approuvés par le RGPD (CCT / décisions d'adéquation).`
      },
      {
        key: 'retention',
        title: 'Conservation des Données',
        content: `Nous conservons les données uniquement le temps nécessaire :
• Données de réservation : 7 ans (exigence légale)
• Données newsletter : jusqu'au retrait du consentement
• Formulaire de contact : 12 mois
• Données cookies : selon le type de cookie`
      },
      {
        key: 'rights',
        title: 'Vos Droits (RGPD)',
        content: `Vous avez le droit de :
• Accéder à vos données
• Corriger ou mettre à jour vos données
• Demander la suppression ("droit à l'oubli")
• Limiter le traitement
• Vous opposer au traitement
• Portabilité des données
• Retirer votre consentement à tout moment

Pour exercer vos droits, contactez : info@zenyourlife.be`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail : info@zenyourlife.be
Site web : www.zenyourlife.be`
      }
    ]
  },
  de: {
    pageType: 'privacy-policy',
    language: 'de',
    pageTitle: 'Datenschutzrichtlinie - Zenyourlife',
    lastUpdated: 'Dezember 2024',
    introduction: 'Zenyourlife ("wir", "unser" oder "uns") betreibt die Website zenyourlife.be und bietet Wellness-Dienstleistungen, Coaching, Massagetherapie und Ferienvermietungen auf Lanzarote an. Wir verpflichten uns, Ihre Privatsphäre zu schützen und die EU-DSGVO sowie die belgischen Datenschutzgesetze einzuhalten.',
    sections: [
      {
        key: 'personalData',
        title: 'Personenbezogene Daten, die wir erheben',
        content: `1.1 Daten, die Sie direkt angeben
• Name, Vorname
• E-Mail-Adresse
• Telefonnummer
• Rechnungsdetails (für Buchungen oder Zahlungen)
• Buchungsinformationen (Daten, Präferenzen, Gästeanzahl)
• Nachrichten über Kontaktformulare, E-Mail, WhatsApp
• Newsletter-Anmeldeinformationen

1.2 Automatisch erhobene Daten
• IP-Adresse
• Geräte- und Browserinformationen
• Nutzungs- und Analysedaten
• Cookies (siehe Cookie-Richtlinie)

1.3 Daten von Dritten
• Buchungsplattformen (Booking.com, Airbnb)
• Google My Business / Google Maps
• Zahlungsdienstleister (z.B. Stripe / Mollie)`
      },
      {
        key: 'purpose',
        title: 'Zweck der Datenverarbeitung',
        content: `Wir verwenden Ihre Daten um:
• Buchungen zu verwalten und zu bestätigen
• Mit Ihnen bezüglich Ihres Aufenthalts oder Dienstleistungen zu kommunizieren
• Personalisierte Wellness-Dienstleistungen anzubieten
• Die Website und Benutzererfahrung zu verbessern
• Newsletter zu senden (nur mit ausdrücklicher Zustimmung)
• Gesetzliche und buchhalterische Pflichten zu erfüllen`
      },
      {
        key: 'legalBasis',
        title: 'Rechtsgrundlage (DSGVO)',
        content: `Wir verarbeiten Ihre Daten auf folgenden Grundlagen:
• Vertragserfüllung (Buchungen und Dienstleistungen)
• Einwilligung (Newsletter, Cookies, Marketing)
• Berechtigtes Interesse (Website-Sicherheit, Analysen)
• Rechtliche Verpflichtung (Rechnungen, Finanzunterlagen)`
      },
      {
        key: 'storage',
        title: 'Datenspeicherung & Sicherheit',
        content: `Wir verwenden branchenübliche Maßnahmen zur Sicherung Ihrer Daten.

Ihre Informationen werden gespeichert in:
• Sicheren Hosting-Servern
• Buchungsplattformen
• Google Workspace (E-Mail, Dateispeicher)

Daten sind nur für autorisiertes Personal zugänglich.`
      },
      {
        key: 'sharing',
        title: 'Datenweitergabe',
        content: `Wir verkaufen Ihre Daten nicht.

Wir teilen Daten nur mit:
• Buchungsplattformen (Booking.com, Airbnb)
• Zahlungsdienstleistern
• IT-/Hosting-Partnern
• Google-Diensten (Analytics, Maps, Gmail)
• Professionellen Partnern, die für Dienstleistungen notwendig sind

Alle Partner sind DSGVO-konform.`
      },
      {
        key: 'international',
        title: 'Internationale Übertragungen',
        content: `Einige Partner (z.B. Google) können Daten außerhalb der EU speichern.

Übertragungen erfolgen nur unter DSGVO-genehmigten Mechanismen (SCCs / Angemessenheitsbeschlüsse).`
      },
      {
        key: 'retention',
        title: 'Datenspeicherung',
        content: `Wir bewahren Daten nur so lange wie nötig auf:
• Buchungsdaten: 7 Jahre (gesetzliche Anforderung)
• Newsletter-Daten: bis zur Widerrufung der Einwilligung
• Kontaktformular: 12 Monate
• Cookie-Daten: je nach Cookie-Typ`
      },
      {
        key: 'rights',
        title: 'Ihre Rechte (DSGVO)',
        content: `Sie haben das Recht auf:
• Zugang zu Ihren Daten
• Berichtigung oder Aktualisierung Ihrer Daten
• Löschung ("Recht auf Vergessenwerden")
• Einschränkung der Verarbeitung
• Widerspruch gegen die Verarbeitung
• Datenübertragbarkeit
• Widerruf der Einwilligung jederzeit

Zur Ausübung Ihrer Rechte kontaktieren Sie: info@zenyourlife.be`
      },
      {
        key: 'contact',
        title: 'Kontakt',
        content: `Zenyourlife
E-Mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  },
  nl: {
    pageType: 'privacy-policy',
    language: 'nl',
    pageTitle: 'Privacybeleid - Zenyourlife',
    lastUpdated: 'December 2024',
    introduction: 'Zenyourlife ("wij", "ons" of "onze") exploiteert de website zenyourlife.be en biedt wellness-diensten, coaching, massagetherapie en vakantieverhuur op Lanzarote. Wij zijn toegewijd aan het beschermen van uw privacy en het naleven van de EU AVG en Belgische gegevensbeschermingswetten.',
    sections: [
      {
        key: 'personalData',
        title: 'Persoonsgegevens die wij verzamelen',
        content: `1.1 Gegevens die u rechtstreeks verstrekt
• Naam, achternaam
• E-mailadres
• Telefoonnummer
• Facturatiegegevens (voor boekingen of betalingen)
• Boekingsinformatie (data, voorkeuren, aantal gasten)
• Berichten via contactformulieren, e-mail, WhatsApp
• Nieuwsbrief aanmeldingsgegevens

1.2 Automatisch verzamelde gegevens
• IP-adres
• Apparaat- en browserinformatie
• Gebruiks- en analysegegevens
• Cookies (zie Cookiebeleid)

1.3 Gegevens van derden
• Boekingsplatforms (Booking.com, Airbnb)
• Google Mijn Bedrijf / Google Maps
• Betalingsverwerkers (bijv. Stripe / Mollie)`
      },
      {
        key: 'purpose',
        title: 'Doel van Gegevensverwerking',
        content: `Wij gebruiken uw gegevens om:
• Boekingen te beheren en te bevestigen
• Met u te communiceren over uw verblijf of diensten
• Gepersonaliseerde wellness-diensten te bieden
• De website en gebruikerservaring te verbeteren
• Nieuwsbrieven te versturen (alleen met expliciete toestemming)
• Wettelijke en boekhoudkundige verplichtingen na te komen`
      },
      {
        key: 'legalBasis',
        title: 'Rechtsgrondslag (AVG)',
        content: `Wij verwerken uw gegevens op basis van:
• Uitvoering van een overeenkomst (boekingen en diensten)
• Toestemming (nieuwsbrief, cookies, marketing)
• Gerechtvaardigd belang (websitebeveiliging, analyses)
• Wettelijke verplichting (facturen, financiële administratie)`
      },
      {
        key: 'storage',
        title: 'Gegevensopslag & Beveiliging',
        content: `Wij gebruiken industriestandaard maatregelen om uw gegevens te beveiligen.

Uw informatie wordt opgeslagen in:
• Beveiligde hostingservers
• Boekingsplatforms
• Google Workspace (e-mail, bestandsopslag)

Gegevens zijn alleen toegankelijk voor geautoriseerd personeel.`
      },
      {
        key: 'sharing',
        title: 'Gegevens Delen',
        content: `Wij verkopen uw gegevens niet.

Wij delen gegevens alleen met:
• Boekingsplatforms (Booking.com, Airbnb)
• Betalingsverwerkers
• IT-/hostingpartners
• Google-diensten (Analytics, Maps, Gmail)
• Professionele partners strikt noodzakelijk voor dienstverlening

Alle partners zijn AVG-conform.`
      },
      {
        key: 'international',
        title: 'Internationale Overdrachten',
        content: `Sommige partners (bijv. Google) kunnen gegevens buiten de EU opslaan.

Overdrachten vinden alleen plaats onder AVG-goedgekeurde mechanismen (SCC's / adequaatheidsbesluiten).`
      },
      {
        key: 'retention',
        title: 'Gegevensretentie',
        content: `Wij bewaren gegevens alleen zo lang als nodig:
• Boekingsgegevens: 7 jaar (wettelijke vereiste)
• Nieuwsbriefgegevens: tot intrekking van toestemming
• Contactformulier: 12 maanden
• Cookiegegevens: afhankelijk van cookietype`
      },
      {
        key: 'rights',
        title: 'Uw Rechten (AVG)',
        content: `U heeft het recht om:
• Toegang tot uw gegevens te krijgen
• Uw gegevens te corrigeren of bij te werken
• Verwijdering te verzoeken ("recht om vergeten te worden")
• Verwerking te beperken
• Bezwaar te maken tegen verwerking
• Gegevensoverdraagbaarheid
• Toestemming op elk moment in te trekken

Om uw rechten uit te oefenen, neem contact op: info@zenyourlife.be`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  }
};

// ============================================
// TERMS AND CONDITIONS - All Languages
// ============================================
const termsData = {
  en: {
    pageType: 'terms-and-conditions',
    language: 'en',
    pageTitle: 'Terms & Conditions - Zenyourlife',
    lastUpdated: 'December 2024',
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        content: `These Terms and Conditions apply to your use of the website zenyourlife.be and all services provided by Zenyourlife, including massages, coaching, and holiday rental accommodations.

By using the Site or booking a service, you agree to these Terms.`
      },
      {
        key: 'services',
        title: 'Services',
        content: `Zenyourlife provides:
• Wellness and massage treatments
• Coaching sessions
• Retreat and wellness programs
• Holiday rental accommodations in Lanzarote

Descriptions may vary slightly depending on availability or provider updates.`
      },
      {
        key: 'bookings',
        title: 'Bookings & Payments',
        content: `• Bookings require accurate information.
• Payments may be made via bank transfer, cash, or supported payment gateway (if integrated).
• For holiday rentals, bookings made on Booking.com or Airbnb follow their platform rules.`
      },
      {
        key: 'cancellation',
        title: 'Cancellations & Refunds',
        content: `Wellness Services
• Cancellations 24 hours before: free
• Less than 24 hours: the full service may be charged

Holiday Rentals
• Follow the cancellation terms of the booking platform
• Direct bookings follow the cancellation policy communicated in writing`
      },
      {
        key: 'responsibilities',
        title: 'Client Responsibilities',
        content: `Clients agree to:
• Provide accurate information
• Respect appointment times
• Use accommodations and facilities responsibly
• Follow health & safety guidelines during wellness sessions

We reserve the right to refuse service in case of inappropriate behavior.`
      },
      {
        key: 'liability',
        title: 'Liability',
        content: `Zenyourlife is not responsible for:
• Loss of personal belongings
• Damages caused by misuse of facilities
• Injuries resulting from ignoring safety instructions

Holiday rental guests are responsible for any damages caused during their stay.`
      },
      {
        key: 'website',
        title: 'Website Use',
        content: `You agree not to:
• Copy or reproduce website content without permission
• Misuse the website (attempt hacking, inject scripts, etc.)`
      },
      {
        key: 'modifications',
        title: 'Modifications',
        content: `We may update these Terms at any time.

The latest version is always available on the website.`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
Email: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  },
  fr: {
    pageType: 'terms-and-conditions',
    language: 'fr',
    pageTitle: 'Conditions Générales - Zenyourlife',
    lastUpdated: 'Décembre 2024',
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        content: `Ces Conditions Générales s'appliquent à votre utilisation du site web zenyourlife.be et à tous les services fournis par Zenyourlife, y compris les massages, le coaching et les locations de vacances.

En utilisant le Site ou en réservant un service, vous acceptez ces Conditions.`
      },
      {
        key: 'services',
        title: 'Services',
        content: `Zenyourlife propose :
• Soins de bien-être et massages
• Séances de coaching
• Programmes de retraite et de bien-être
• Locations de vacances à Lanzarote

Les descriptions peuvent varier légèrement selon la disponibilité ou les mises à jour.`
      },
      {
        key: 'bookings',
        title: 'Réservations & Paiements',
        content: `• Les réservations nécessitent des informations exactes.
• Les paiements peuvent être effectués par virement bancaire, espèces ou passerelle de paiement.
• Pour les locations de vacances, les réservations sur Booking.com ou Airbnb suivent les règles de leur plateforme.`
      },
      {
        key: 'cancellation',
        title: 'Annulations & Remboursements',
        content: `Services de Bien-être
• Annulations 24 heures avant : gratuit
• Moins de 24 heures : le service complet peut être facturé

Locations de Vacances
• Suivez les conditions d'annulation de la plateforme de réservation
• Les réservations directes suivent la politique d'annulation communiquée par écrit`
      },
      {
        key: 'responsibilities',
        title: 'Responsabilités du Client',
        content: `Les clients acceptent de :
• Fournir des informations exactes
• Respecter les horaires de rendez-vous
• Utiliser les hébergements et installations de manière responsable
• Suivre les consignes de santé et sécurité lors des séances de bien-être

Nous nous réservons le droit de refuser le service en cas de comportement inapproprié.`
      },
      {
        key: 'liability',
        title: 'Responsabilité',
        content: `Zenyourlife n'est pas responsable de :
• Perte d'effets personnels
• Dommages causés par une mauvaise utilisation des installations
• Blessures résultant du non-respect des consignes de sécurité

Les locataires de vacances sont responsables des dommages causés pendant leur séjour.`
      },
      {
        key: 'website',
        title: 'Utilisation du Site Web',
        content: `Vous acceptez de ne pas :
• Copier ou reproduire le contenu du site sans autorisation
• Abuser du site (tentatives de piratage, injection de scripts, etc.)`
      },
      {
        key: 'modifications',
        title: 'Modifications',
        content: `Nous pouvons mettre à jour ces Conditions à tout moment.

La dernière version est toujours disponible sur le site.`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail : info@zenyourlife.be
Site web : www.zenyourlife.be`
      }
    ]
  },
  de: {
    pageType: 'terms-and-conditions',
    language: 'de',
    pageTitle: 'Allgemeine Geschäftsbedingungen - Zenyourlife',
    lastUpdated: 'Dezember 2024',
    sections: [
      {
        key: 'introduction',
        title: 'Einleitung',
        content: `Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website zenyourlife.be und aller von Zenyourlife angebotenen Dienstleistungen, einschließlich Massagen, Coaching und Ferienwohnungen.

Durch die Nutzung der Website oder die Buchung einer Dienstleistung stimmen Sie diesen Bedingungen zu.`
      },
      {
        key: 'services',
        title: 'Dienstleistungen',
        content: `Zenyourlife bietet:
• Wellness- und Massagebehandlungen
• Coaching-Sitzungen
• Retreat- und Wellness-Programme
• Ferienwohnungen auf Lanzarote

Beschreibungen können je nach Verfügbarkeit oder Anbieter-Updates leicht variieren.`
      },
      {
        key: 'bookings',
        title: 'Buchungen & Zahlungen',
        content: `• Buchungen erfordern genaue Angaben.
• Zahlungen können per Überweisung, bar oder über unterstützte Zahlungsgateways erfolgen.
• Für Ferienwohnungen gelten bei Buchungen über Booking.com oder Airbnb deren Plattformregeln.`
      },
      {
        key: 'cancellation',
        title: 'Stornierungen & Rückerstattungen',
        content: `Wellness-Dienstleistungen
• Stornierung 24 Stunden vorher: kostenlos
• Weniger als 24 Stunden: volle Servicegebühr kann berechnet werden

Ferienwohnungen
• Es gelten die Stornierungsbedingungen der Buchungsplattform
• Direktbuchungen folgen den schriftlich mitgeteilten Stornierungsbedingungen`
      },
      {
        key: 'responsibilities',
        title: 'Kundenpflichten',
        content: `Kunden verpflichten sich:
• Genaue Informationen anzugeben
• Terminzeiten einzuhalten
• Unterkünfte und Einrichtungen verantwortungsvoll zu nutzen
• Gesundheits- und Sicherheitsrichtlinien während der Wellness-Sitzungen zu befolgen

Wir behalten uns das Recht vor, bei unangemessenem Verhalten den Service zu verweigern.`
      },
      {
        key: 'liability',
        title: 'Haftung',
        content: `Zenyourlife haftet nicht für:
• Verlust persönlicher Gegenstände
• Schäden durch Missbrauch von Einrichtungen
• Verletzungen durch Missachtung von Sicherheitsanweisungen

Ferienwohnungsgäste sind für während ihres Aufenthalts verursachte Schäden verantwortlich.`
      },
      {
        key: 'website',
        title: 'Website-Nutzung',
        content: `Sie stimmen zu, nicht:
• Website-Inhalte ohne Genehmigung zu kopieren oder zu reproduzieren
• Die Website zu missbrauchen (Hacking-Versuche, Skript-Injektionen usw.)`
      },
      {
        key: 'modifications',
        title: 'Änderungen',
        content: `Wir können diese Bedingungen jederzeit aktualisieren.

Die neueste Version ist immer auf der Website verfügbar.`
      },
      {
        key: 'contact',
        title: 'Kontakt',
        content: `Zenyourlife
E-Mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  },
  nl: {
    pageType: 'terms-and-conditions',
    language: 'nl',
    pageTitle: 'Algemene Voorwaarden - Zenyourlife',
    lastUpdated: 'December 2024',
    sections: [
      {
        key: 'introduction',
        title: 'Inleiding',
        content: `Deze Algemene Voorwaarden zijn van toepassing op uw gebruik van de website zenyourlife.be en alle diensten van Zenyourlife, inclusief massages, coaching en vakantieverhuur.

Door de Site te gebruiken of een dienst te boeken, gaat u akkoord met deze Voorwaarden.`
      },
      {
        key: 'services',
        title: 'Diensten',
        content: `Zenyourlife biedt:
• Wellness- en massagebehandelingen
• Coachingsessies
• Retreat- en wellnessprogramma's
• Vakantieverhuur op Lanzarote

Beschrijvingen kunnen licht variëren afhankelijk van beschikbaarheid of updates.`
      },
      {
        key: 'bookings',
        title: 'Boekingen & Betalingen',
        content: `• Boekingen vereisen nauwkeurige informatie.
• Betalingen kunnen worden gedaan via bankoverschrijving, contant of ondersteunde betaalmethoden.
• Voor vakantieverhuur gelden bij boekingen via Booking.com of Airbnb hun platformregels.`
      },
      {
        key: 'cancellation',
        title: 'Annuleringen & Terugbetalingen',
        content: `Wellness Diensten
• Annulering 24 uur van tevoren: gratis
• Minder dan 24 uur: volledige service kan in rekening worden gebracht

Vakantieverhuur
• Volg de annuleringsvoorwaarden van het boekingsplatform
• Directe boekingen volgen het schriftelijk meegedeelde annuleringsbeleid`
      },
      {
        key: 'responsibilities',
        title: 'Verantwoordelijkheden van de Klant',
        content: `Klanten stemmen ermee in om:
• Accurate informatie te verstrekken
• Afspraaktijden te respecteren
• Accommodaties en faciliteiten verantwoordelijk te gebruiken
• Gezondheids- en veiligheidsrichtlijnen te volgen tijdens wellness-sessies

Wij behouden ons het recht voor om service te weigeren bij ongepast gedrag.`
      },
      {
        key: 'liability',
        title: 'Aansprakelijkheid',
        content: `Zenyourlife is niet verantwoordelijk voor:
• Verlies van persoonlijke bezittingen
• Schade veroorzaakt door misbruik van faciliteiten
• Letsel als gevolg van het negeren van veiligheidsinstructies

Vakantiegasten zijn verantwoordelijk voor schade veroorzaakt tijdens hun verblijf.`
      },
      {
        key: 'website',
        title: 'Website Gebruik',
        content: `U stemt ermee in om niet:
• Website-inhoud te kopiëren of reproduceren zonder toestemming
• De website te misbruiken (hackpogingen, script-injecties, enz.)`
      },
      {
        key: 'modifications',
        title: 'Wijzigingen',
        content: `Wij kunnen deze Voorwaarden op elk moment bijwerken.

De laatste versie is altijd beschikbaar op de website.`
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ]
  }
};

// ============================================
// COOKIE POLICY - All Languages
// ============================================
const cookiePolicyData = {
  en: {
    pageType: 'cookie-policy',
    language: 'en',
    pageTitle: 'Cookie Policy - Zenyourlife',
    lastUpdated: 'December 2024',
    sections: [
      {
        key: 'what',
        title: 'What Are Cookies?',
        content: 'Cookies are small files stored on your device when visiting our website.'
      },
      {
        key: 'types',
        title: 'Types of Cookies We Use',
        content: `• Strictly necessary cookies (site functioning)
• Analytics cookies (Google Analytics)
• Performance cookies
• Marketing cookies (if using ads, remarketing, or social media pixels)`
      },
      {
        key: 'thirdparty',
        title: 'Third-Party Cookies',
        content: `We may use:
• Google Analytics
• Google Maps
• Booking.com widgets

Each provider has its own cookie policies.`
      },
      {
        key: 'consent',
        title: 'Consent',
        content: `You can accept or refuse cookies through the cookie banner.

Necessary cookies cannot be disabled.`
      },
      {
        key: 'managing',
        title: 'Managing Cookies',
        content: 'You can configure or delete cookies through browser settings.'
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
Email: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ],
    disclaimer: {
      title: 'Website Disclaimer - Zenyourlife',
      content: `The content of this website is provided for general information purposes only.

Wellness advice, massage information, or coaching insights do not replace professional medical advice.

Zenyourlife is not liable for decisions taken based on website content.`
    }
  },
  fr: {
    pageType: 'cookie-policy',
    language: 'fr',
    pageTitle: 'Politique de Cookies - Zenyourlife',
    lastUpdated: 'Décembre 2024',
    sections: [
      {
        key: 'what',
        title: 'Que sont les Cookies ?',
        content: 'Les cookies sont de petits fichiers stockés sur votre appareil lors de la visite de notre site web.'
      },
      {
        key: 'types',
        title: 'Types de Cookies que nous utilisons',
        content: `• Cookies strictement nécessaires (fonctionnement du site)
• Cookies analytiques (Google Analytics)
• Cookies de performance
• Cookies marketing (si utilisation de publicités, remarketing ou pixels de réseaux sociaux)`
      },
      {
        key: 'thirdparty',
        title: 'Cookies Tiers',
        content: `Nous pouvons utiliser :
• Google Analytics
• Google Maps
• Widgets Booking.com

Chaque fournisseur a sa propre politique de cookies.`
      },
      {
        key: 'consent',
        title: 'Consentement',
        content: `Vous pouvez accepter ou refuser les cookies via la bannière de cookies.

Les cookies nécessaires ne peuvent pas être désactivés.`
      },
      {
        key: 'managing',
        title: 'Gestion des Cookies',
        content: 'Vous pouvez configurer ou supprimer les cookies via les paramètres de votre navigateur.'
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail : info@zenyourlife.be
Site web : www.zenyourlife.be`
      }
    ],
    disclaimer: {
      title: 'Avertissement du Site Web - Zenyourlife',
      content: `Le contenu de ce site web est fourni à titre d'information générale uniquement.

Les conseils de bien-être, les informations sur les massages ou les conseils de coaching ne remplacent pas les conseils médicaux professionnels.

Zenyourlife n'est pas responsable des décisions prises sur la base du contenu du site.`
    }
  },
  de: {
    pageType: 'cookie-policy',
    language: 'de',
    pageTitle: 'Cookie-Richtlinie - Zenyourlife',
    lastUpdated: 'Dezember 2024',
    sections: [
      {
        key: 'what',
        title: 'Was sind Cookies?',
        content: 'Cookies sind kleine Dateien, die beim Besuch unserer Website auf Ihrem Gerät gespeichert werden.'
      },
      {
        key: 'types',
        title: 'Arten von Cookies, die wir verwenden',
        content: `• Unbedingt erforderliche Cookies (Website-Funktion)
• Analyse-Cookies (Google Analytics)
• Leistungs-Cookies
• Marketing-Cookies (bei Verwendung von Werbung, Remarketing oder Social-Media-Pixeln)`
      },
      {
        key: 'thirdparty',
        title: 'Drittanbieter-Cookies',
        content: `Wir können verwenden:
• Google Analytics
• Google Maps
• Booking.com Widgets

Jeder Anbieter hat seine eigene Cookie-Richtlinie.`
      },
      {
        key: 'consent',
        title: 'Einwilligung',
        content: `Sie können Cookies über das Cookie-Banner akzeptieren oder ablehnen.

Notwendige Cookies können nicht deaktiviert werden.`
      },
      {
        key: 'managing',
        title: 'Cookies verwalten',
        content: 'Sie können Cookies über die Browsereinstellungen konfigurieren oder löschen.'
      },
      {
        key: 'contact',
        title: 'Kontakt',
        content: `Zenyourlife
E-Mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ],
    disclaimer: {
      title: 'Website-Haftungsausschluss - Zenyourlife',
      content: `Der Inhalt dieser Website dient nur allgemeinen Informationszwecken.

Wellness-Ratschläge, Massage-Informationen oder Coaching-Einblicke ersetzen keine professionelle medizinische Beratung.

Zenyourlife haftet nicht für Entscheidungen, die auf Grundlage des Website-Inhalts getroffen werden.`
    }
  },
  nl: {
    pageType: 'cookie-policy',
    language: 'nl',
    pageTitle: 'Cookiebeleid - Zenyourlife',
    lastUpdated: 'December 2024',
    sections: [
      {
        key: 'what',
        title: 'Wat zijn Cookies?',
        content: 'Cookies zijn kleine bestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt.'
      },
      {
        key: 'types',
        title: 'Soorten Cookies die wij gebruiken',
        content: `• Strikt noodzakelijke cookies (website-functionaliteit)
• Analytische cookies (Google Analytics)
• Prestatiecookies
• Marketingcookies (bij gebruik van advertenties, remarketing of social media pixels)`
      },
      {
        key: 'thirdparty',
        title: 'Cookies van Derden',
        content: `Wij kunnen gebruiken:
• Google Analytics
• Google Maps
• Booking.com widgets

Elke aanbieder heeft zijn eigen cookiebeleid.`
      },
      {
        key: 'consent',
        title: 'Toestemming',
        content: `U kunt cookies accepteren of weigeren via de cookiebanner.

Noodzakelijke cookies kunnen niet worden uitgeschakeld.`
      },
      {
        key: 'managing',
        title: 'Cookies beheren',
        content: 'U kunt cookies configureren of verwijderen via uw browserinstellingen.'
      },
      {
        key: 'contact',
        title: 'Contact',
        content: `Zenyourlife
E-mail: info@zenyourlife.be
Website: www.zenyourlife.be`
      }
    ],
    disclaimer: {
      title: 'Website Disclaimer - Zenyourlife',
      content: `De inhoud van deze website wordt alleen verstrekt voor algemene informatiedoeleinden.

Wellnessadvies, massage-informatie of coaching-inzichten vervangen geen professioneel medisch advies.

Zenyourlife is niet aansprakelijk voor beslissingen die worden genomen op basis van website-inhoud.`
    }
  }
};

// ============================================
// DPA (Data Processing Agreement) - All Languages
// ============================================
const dpaData = {
  en: {
    pageType: 'dpa',
    language: 'en',
    pageTitle: 'Data Processing Agreement (DPA)',
    lastUpdated: 'December 2024',
    parties: {
      controller: { name: 'Zenyourlife', role: 'Data Controller', email: 'info@zenyourlife.be' },
      processor: { name: 'Hostinger', role: 'Data Processor' }
    },
    sections: [
      {
        key: 'subject',
        title: 'Subject of the Agreement',
        content: `The Processor processes personal data on behalf of Zenyourlife strictly for providing:
• IT services
• Booking management
• Hosting
• Communication tools`
      },
      {
        key: 'duration',
        title: 'Duration',
        content: 'This Agreement remains valid for the duration of the collaboration.'
      },
      {
        key: 'obligations',
        title: 'Processor Obligations',
        content: `The Processor shall:
• Process data only on documented instructions of Zenyourlife
• Ensure confidentiality
• Protect data with adequate security measures
• Notify Zenyourlife of any data breach within 24 hours
• Assist with GDPR rights requests
• Allow audits if necessary`
      },
      {
        key: 'subprocessors',
        title: 'Sub-Processors',
        content: 'The Processor must request written approval before engaging any sub-processor.'
      },
      {
        key: 'transfers',
        title: 'International Transfers',
        content: 'Any transfer outside the EU must comply with GDPR safeguards (SCCs, adequacy decisions).'
      },
      {
        key: 'endcontract',
        title: 'End of Contract',
        content: 'All personal data must be deleted or returned to Zenyourlife.'
      },
      {
        key: 'liability',
        title: 'Liability',
        content: 'Each party is liable for its own GDPR compliance.'
      }
    ],
    additionalSections: [
      {
        key: 'licence',
        title: 'Tourist Licence',
        content: 'The property is operated under the licence number [add licence number – Vv or similar] required by the Government of Canarias.'
      },
      {
        key: 'rules',
        title: 'Rental Rules (as required by Canary Islands law)',
        content: `Guests must:
• Provide identification (passport or ID) for police registration
• Respect maximum occupancy
• Respect local noise regulations (22:00–08:00)
• Use the property responsibly
• Report damages immediately`
      },
      {
        key: 'complaints',
        title: 'Complaint Forms',
        content: 'Official complaint forms ("hojas de reclamaciones") are available upon request.'
      },
      {
        key: 'insurance',
        title: 'Insurance',
        content: 'Zenyourlife maintains mandatory liability insurance as required by Canarias tourism law.'
      },
      {
        key: 'checkin',
        title: 'Check-in Requirements',
        content: 'Guest identity must be recorded and transmitted to Guardia Civil via the "parte de viajeros" system.'
      }
    ]
  },
  fr: {
    pageType: 'dpa',
    language: 'fr',
    pageTitle: 'Accord de Traitement des Données (DPA)',
    lastUpdated: 'Décembre 2024',
    parties: {
      controller: { name: 'Zenyourlife', role: 'Responsable du Traitement', email: 'info@zenyourlife.be' },
      processor: { name: 'Hostinger', role: 'Sous-traitant' }
    },
    sections: [
      {
        key: 'subject',
        title: 'Objet de l\'Accord',
        content: `Le Sous-traitant traite les données personnelles pour le compte de Zenyourlife strictement pour fournir :
• Services informatiques
• Gestion des réservations
• Hébergement
• Outils de communication`
      },
      {
        key: 'duration',
        title: 'Durée',
        content: 'Cet Accord reste valide pour la durée de la collaboration.'
      },
      {
        key: 'obligations',
        title: 'Obligations du Sous-traitant',
        content: `Le Sous-traitant doit :
• Traiter les données uniquement selon les instructions documentées de Zenyourlife
• Assurer la confidentialité
• Protéger les données avec des mesures de sécurité adéquates
• Notifier Zenyourlife de toute violation de données dans les 24 heures
• Aider avec les demandes de droits RGPD
• Permettre les audits si nécessaire`
      },
      {
        key: 'subprocessors',
        title: 'Sous-traitants Ultérieurs',
        content: 'Le Sous-traitant doit demander une approbation écrite avant d\'engager tout sous-traitant.'
      },
      {
        key: 'transfers',
        title: 'Transferts Internationaux',
        content: 'Tout transfert hors de l\'UE doit respecter les garanties RGPD (CCT, décisions d\'adéquation).'
      },
      {
        key: 'endcontract',
        title: 'Fin du Contrat',
        content: 'Toutes les données personnelles doivent être supprimées ou retournées à Zenyourlife.'
      },
      {
        key: 'liability',
        title: 'Responsabilité',
        content: 'Chaque partie est responsable de sa propre conformité au RGPD.'
      }
    ],
    additionalSections: [
      {
        key: 'licence',
        title: 'Licence Touristique',
        content: 'La propriété est exploitée sous le numéro de licence [ajouter le numéro de licence – Vv ou similaire] requis par le Gouvernement des Canaries.'
      },
      {
        key: 'rules',
        title: 'Règles de Location (selon la loi des Îles Canaries)',
        content: `Les clients doivent :
• Fournir une pièce d'identité (passeport ou carte d'identité) pour l'enregistrement policier
• Respecter l'occupation maximale
• Respecter les règlements locaux sur le bruit (22:00–08:00)
• Utiliser la propriété de manière responsable
• Signaler immédiatement les dommages`
      },
      {
        key: 'complaints',
        title: 'Formulaires de Réclamation',
        content: 'Les formulaires de réclamation officiels ("hojas de reclamaciones") sont disponibles sur demande.'
      },
      {
        key: 'insurance',
        title: 'Assurance',
        content: 'Zenyourlife maintient une assurance responsabilité obligatoire comme exigé par la loi touristique des Canaries.'
      },
      {
        key: 'checkin',
        title: 'Exigences d\'Enregistrement',
        content: 'L\'identité des clients doit être enregistrée et transmise à la Guardia Civil via le système "parte de viajeros".'
      }
    ]
  },
  de: {
    pageType: 'dpa',
    language: 'de',
    pageTitle: 'Auftragsverarbeitungsvertrag (AVV)',
    lastUpdated: 'Dezember 2024',
    parties: {
      controller: { name: 'Zenyourlife', role: 'Verantwortlicher', email: 'info@zenyourlife.be' },
      processor: { name: 'Hostinger', role: 'Auftragsverarbeiter' }
    },
    sections: [
      {
        key: 'subject',
        title: 'Gegenstand der Vereinbarung',
        content: `Der Auftragsverarbeiter verarbeitet personenbezogene Daten im Auftrag von Zenyourlife ausschließlich für:
• IT-Dienstleistungen
• Buchungsverwaltung
• Hosting
• Kommunikationstools`
      },
      {
        key: 'duration',
        title: 'Dauer',
        content: 'Diese Vereinbarung bleibt für die Dauer der Zusammenarbeit gültig.'
      },
      {
        key: 'obligations',
        title: 'Pflichten des Auftragsverarbeiters',
        content: `Der Auftragsverarbeiter muss:
• Daten nur nach dokumentierten Anweisungen von Zenyourlife verarbeiten
• Vertraulichkeit gewährleisten
• Daten mit angemessenen Sicherheitsmaßnahmen schützen
• Zenyourlife über Datenschutzverletzungen innerhalb von 24 Stunden informieren
• Bei DSGVO-Rechtsanfragen unterstützen
• Audits bei Bedarf ermöglichen`
      },
      {
        key: 'subprocessors',
        title: 'Unterauftragsverarbeiter',
        content: 'Der Auftragsverarbeiter muss vor der Beauftragung von Unterauftragsverarbeitern eine schriftliche Genehmigung einholen.'
      },
      {
        key: 'transfers',
        title: 'Internationale Übermittlungen',
        content: 'Jede Übermittlung außerhalb der EU muss den DSGVO-Garantien entsprechen (SCCs, Angemessenheitsbeschlüsse).'
      },
      {
        key: 'endcontract',
        title: 'Vertragsende',
        content: 'Alle personenbezogenen Daten müssen gelöscht oder an Zenyourlife zurückgegeben werden.'
      },
      {
        key: 'liability',
        title: 'Haftung',
        content: 'Jede Partei haftet für ihre eigene DSGVO-Konformität.'
      }
    ],
    additionalSections: [
      {
        key: 'licence',
        title: 'Touristenlizenz',
        content: 'Die Unterkunft wird unter der Lizenznummer [Lizenznummer hinzufügen – Vv oder ähnlich] betrieben, die von der Regierung der Kanarischen Inseln verlangt wird.'
      },
      {
        key: 'rules',
        title: 'Mietregeln (gemäß kanarischem Recht)',
        content: `Gäste müssen:
• Identifikation (Reisepass oder Ausweis) für die Polizeiregistrierung vorlegen
• Die maximale Belegung einhalten
• Lokale Lärmvorschriften beachten (22:00–08:00)
• Die Unterkunft verantwortungsvoll nutzen
• Schäden sofort melden`
      },
      {
        key: 'complaints',
        title: 'Beschwerdeformulare',
        content: 'Offizielle Beschwerdeformulare ("hojas de reclamaciones") sind auf Anfrage erhältlich.'
      },
      {
        key: 'insurance',
        title: 'Versicherung',
        content: 'Zenyourlife unterhält eine obligatorische Haftpflichtversicherung gemäß kanarischem Tourismusrecht.'
      },
      {
        key: 'checkin',
        title: 'Check-in-Anforderungen',
        content: 'Die Identität der Gäste muss erfasst und über das "parte de viajeros"-System an die Guardia Civil übermittelt werden.'
      }
    ]
  },
  nl: {
    pageType: 'dpa',
    language: 'nl',
    pageTitle: 'Gegevensverwerkingsovereenkomst (GVO)',
    lastUpdated: 'December 2024',
    parties: {
      controller: { name: 'Zenyourlife', role: 'Verwerkingsverantwoordelijke', email: 'info@zenyourlife.be' },
      processor: { name: 'Hostinger', role: 'Verwerker' }
    },
    sections: [
      {
        key: 'subject',
        title: 'Onderwerp van de Overeenkomst',
        content: `De Verwerker verwerkt persoonsgegevens namens Zenyourlife strikt voor het leveren van:
• IT-diensten
• Boekingsbeheer
• Hosting
• Communicatietools`
      },
      {
        key: 'duration',
        title: 'Duur',
        content: 'Deze Overeenkomst blijft geldig voor de duur van de samenwerking.'
      },
      {
        key: 'obligations',
        title: 'Verplichtingen van de Verwerker',
        content: `De Verwerker zal:
• Gegevens alleen verwerken volgens gedocumenteerde instructies van Zenyourlife
• Vertrouwelijkheid waarborgen
• Gegevens beschermen met adequate beveiligingsmaatregelen
• Zenyourlife binnen 24 uur op de hoogte stellen van datalekken
• Assisteren bij AVG-rechtenverzoeken
• Audits toestaan indien nodig`
      },
      {
        key: 'subprocessors',
        title: 'Subverwerkers',
        content: 'De Verwerker moet schriftelijke goedkeuring vragen voordat subverwerkers worden ingeschakeld.'
      },
      {
        key: 'transfers',
        title: 'Internationale Overdrachten',
        content: 'Elke overdracht buiten de EU moet voldoen aan AVG-waarborgen (SCC\'s, adequaatheidsbesluiten).'
      },
      {
        key: 'endcontract',
        title: 'Einde van Contract',
        content: 'Alle persoonsgegevens moeten worden verwijderd of teruggestuurd naar Zenyourlife.'
      },
      {
        key: 'liability',
        title: 'Aansprakelijkheid',
        content: 'Elke partij is aansprakelijk voor haar eigen AVG-naleving.'
      }
    ],
    additionalSections: [
      {
        key: 'licence',
        title: 'Toeristenvergunning',
        content: 'Het pand wordt geëxploiteerd onder het vergunningsnummer [voeg vergunningsnummer toe – Vv of vergelijkbaar] vereist door de Regering van de Canarische Eilanden.'
      },
      {
        key: 'rules',
        title: 'Huurregels (volgens Canarisch recht)',
        content: `Gasten moeten:
• Identificatie verstrekken (paspoort of ID) voor politieregistratie
• Maximale bezetting respecteren
• Lokale geluidsvoorschriften respecteren (22:00–08:00)
• Het pand verantwoordelijk gebruiken
• Schade onmiddellijk melden`
      },
      {
        key: 'complaints',
        title: 'Klachtenformulieren',
        content: 'Officiële klachtenformulieren ("hojas de reclamaciones") zijn op verzoek beschikbaar.'
      },
      {
        key: 'insurance',
        title: 'Verzekering',
        content: 'Zenyourlife onderhoudt verplichte aansprakelijkheidsverzekering zoals vereist door Canarische toerismewetgeving.'
      },
      {
        key: 'checkin',
        title: 'Check-in Vereisten',
        content: 'De identiteit van gasten moet worden geregistreerd en doorgegeven aan de Guardia Civil via het "parte de viajeros" systeem.'
      }
    ]
  }
};

// Seed function
async function seedLegalPages() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenyourlife';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing legal pages
    await LegalPage.deleteMany({});
    console.log('🗑️ Cleared existing legal pages');

    // Insert all legal pages
    const allPages = [
      ...Object.values(privacyPolicyData),
      ...Object.values(termsData),
      ...Object.values(cookiePolicyData),
      ...Object.values(dpaData)
    ];

    await LegalPage.insertMany(allPages);
    console.log(`✅ Inserted ${allPages.length} legal pages (4 pages × 4 languages)`);

    console.log('\n📄 Legal pages seeded successfully!');
    console.log('   - Privacy Policy: EN, FR, DE, NL');
    console.log('   - Terms & Conditions: EN, FR, DE, NL');
    console.log('   - Cookie Policy: EN, FR, DE, NL');
    console.log('   - DPA: EN, FR, DE, NL');

  } catch (error) {
    console.error('❌ Error seeding legal pages:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedLegalPages().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedLegalPages, privacyPolicyData, termsData, cookiePolicyData, dpaData };
