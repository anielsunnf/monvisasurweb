export const services = [
  {
    id: 'visa-schengen',
    name: 'Visa Schengen',
    category: 'Visa',
    price: 220,
    delay: '8 jours',
    description: 'Accompagnement complet pour votre demande de visa Schengen. Vérification des pièces, constitution du dossier et suivi jusqu\'à l\'obtention.',
    documents: ['Passeport valide (6 mois min)', 'Photo d\'identité récente', 'Lettre d\'invitation ou réservation hôtel', 'Justificatif de ressources', 'Assurance voyage'],
    popular: true,
  },
  {
    id: 'titre-sejour',
    name: 'Titre de séjour',
    category: 'Administration',
    price: 310,
    delay: '12 jours',
    description: 'Suivi administratif complet pour une première demande ou un renouvellement de titre de séjour.',
    documents: ['Carte d\'identité ou passeport', 'Justificatif de domicile', 'Relevé d\'activité ou contrat de travail', '3 derniers bulletins de salaire'],
    popular: false,
  },
  {
    id: 'traduction',
    name: 'Traduction assermentée',
    category: 'Documents',
    price: 95,
    delay: '3 jours',
    description: 'Traductions certifiées de documents officiels (acte de naissance, diplôme, casier judiciaire) en français, anglais et russe.',
    documents: ['Document original', 'Copie numérique lisible', 'Coordonnées de contact'],
    popular: true,
  },
  {
    id: 'lettre-invitation',
    name: 'Lettre d\'invitation',
    category: 'Documents',
    price: 60,
    delay: '2 jours',
    description: 'Rédaction et certification d\'une lettre d\'invitation conforme aux exigences consulaires.',
    documents: ['Pièce d\'identité de l\'invitant', 'Justificatif de domicile', 'Informations sur l\'invité'],
    popular: false,
  },
  {
    id: 'apostille',
    name: 'Légalisation et apostille',
    category: 'Documents',
    price: 140,
    delay: '5 jours',
    description: 'Légalisation de documents officiels et obtention de l\'apostille pour une reconnaissance internationale.',
    documents: ['Document original à légaliser', 'Copie certifiée conforme'],
    popular: false,
  },
  {
    id: 'equivalence',
    name: 'Équivalence de diplôme',
    category: 'Éducation',
    price: 180,
    delay: '15 jours',
    description: 'Accompagnement pour la reconnaissance et l\'équivalence de vos diplômes étrangers auprès des autorités compétentes.',
    documents: ['Diplôme original', 'Relevés de notes', 'Traduction certifiée', 'CV détaillé'],
    popular: false,
  },
]

const serviceTranslations = {
  en: {
    'visa-schengen': { category: 'Visa', delay: '8 days', description: 'Full support for your Schengen visa application. We check your documents, prepare your file and follow it through to approval.', documents: ['Valid passport (minimum 6 months)', 'Recent identity photo', 'Invitation letter or hotel reservation', 'Proof of financial resources', 'Travel insurance'] },
    'titre-sejour': { name: 'Residence permit', category: 'Administration', delay: '12 days', description: 'Complete administrative support for a first residence permit application or a renewal.', documents: ['Identity card or passport', 'Proof of address', 'Employment record or work contract', 'Last 3 payslips'] },
    traduction: { name: 'Certified translation', category: 'Documents', delay: '3 days', description: 'Certified translations of official documents, including birth certificates, diplomas and criminal records, into French, English and Russian.', documents: ['Original document', 'Readable digital copy', 'Contact details'] },
    'lettre-invitation': { name: 'Invitation letter', category: 'Documents', delay: '2 days', description: 'Drafting and certification of an invitation letter that meets consular requirements.', documents: ['Inviter identity document', 'Proof of address', 'Guest information'] },
    apostille: { name: 'Legalisation and apostille', category: 'Documents', delay: '5 days', description: 'Legalisation of official documents and obtaining an apostille for international recognition.', documents: ['Original document to legalise', 'Certified true copy'] },
    equivalence: { name: 'Diploma equivalency', category: 'Education', delay: '15 days', description: 'Support for the recognition and equivalency of your foreign qualifications with the relevant authorities.', documents: ['Original diploma', 'Academic transcripts', 'Certified translation', 'Detailed CV'] },
  },
  ru: {
    'visa-schengen': { category: 'Виза', delay: '8 дней', description: 'Полное сопровождение при подаче заявления на шенгенскую визу. Проверка документов, подготовка дела и отслеживание до получения результата.', documents: ['Действующий паспорт (минимум 6 месяцев)', 'Недавняя фотография', 'Пригласительное письмо или бронь отеля', 'Подтверждение финансовых средств', 'Туристическая страховка'] },
    'titre-sejour': { name: 'Вид на жительство', category: 'Администрация', delay: '12 дней', description: 'Полное административное сопровождение для первого заявления на вид на жительство или его продления.', documents: ['Удостоверение личности или паспорт', 'Подтверждение адреса', 'Трудовой договор или справка о занятости', 'Последние 3 расчётных листка'] },
    traduction: { name: 'Заверенный перевод', category: 'Документы', delay: '3 дня', description: 'Заверенные переводы официальных документов, включая свидетельства о рождении, дипломы и справки о несудимости, на французский, английский и русский языки.', documents: ['Оригинал документа', 'Чёткая цифровая копия', 'Контактные данные'] },
    'lettre-invitation': { name: 'Пригласительное письмо', category: 'Документы', delay: '2 дня', description: 'Подготовка и заверение пригласительного письма в соответствии с консульскими требованиями.', documents: ['Документ, удостоверяющий личность приглашающего', 'Подтверждение адреса', 'Информация о приглашённом'] },
    apostille: { name: 'Легализация и апостиль', category: 'Документы', delay: '5 дней', description: 'Легализация официальных документов и получение апостиля для международного признания.', documents: ['Оригинал документа для легализации', 'Заверенная копия'] },
    equivalence: { name: 'Признание диплома', category: 'Образование', delay: '15 дней', description: 'Сопровождение для признания и подтверждения эквивалентности ваших иностранных дипломов в компетентных органах.', documents: ['Оригинал диплома', 'Выписки с оценками', 'Заверенный перевод', 'Подробное резюме'] },
  },
}

export function localizeService(service, language = 'fr') {
  const locale = language?.split('-')[0]
  return { ...service, ...(serviceTranslations[locale]?.[service.id] || {}) }
}
