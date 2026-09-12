export const services = [
  {
    id: 'visa-schengen',
    name: 'Visa Schengen',
    category: 'Visa',
    price: 145000,
    delay: '8 jours',
    description: 'Accompagnement complet pour votre demande de visa Schengen. Vérification des pièces, constitution du dossier et suivi jusqu\'à l\'obtention.',
    documents: ['Passeport valide (6 mois min)', 'Photo d\'identité récente', 'Lettre d\'invitation ou réservation hôtel', 'Justificatif de ressources', 'Assurance voyage'],
    popular: true,
  },
  {
    id: 'titre-sejour',
    name: 'Titre de séjour',
    category: 'Administration',
    price: 205000,
    delay: '12 jours',
    description: 'Suivi administratif complet pour une première demande ou un renouvellement de titre de séjour.',
    documents: ['Carte d\'identité ou passeport', 'Justificatif de domicile', 'Relevé d\'activité ou contrat de travail', '3 derniers bulletins de salaire'],
    popular: false,
  },
  {
    id: 'traduction',
    name: 'Traduction assermentée',
    category: 'Documents',
    price: 62500,
    delay: '3 jours',
    description: 'Traductions certifiées de documents officiels (acte de naissance, diplôme, casier judiciaire) en français, anglais et russe.',
    documents: ['Document original', 'Copie numérique lisible', 'Coordonnées de contact'],
    popular: true,
  },
  {
    id: 'lettre-invitation',
    name: 'Lettre d\'invitation',
    category: 'Documents',
    price: 39500,
    delay: '2 jours',
    description: 'Rédaction et certification d\'une lettre d\'invitation conforme aux exigences consulaires.',
    documents: ['Pièce d\'identité de l\'invitant', 'Justificatif de domicile', 'Informations sur l\'invité'],
    popular: false,
  },
  {
    id: 'apostille',
    name: 'Légalisation et apostille',
    category: 'Documents',
    price: 92000,
    delay: '5 jours',
    description: 'Légalisation de documents officiels et obtention de l\'apostille pour une reconnaissance internationale.',
    documents: ['Document original à légaliser', 'Copie certifiée conforme'],
    popular: false,
  },
  {
    id: 'equivalence',
    name: 'Équivalence de diplôme',
    category: 'Éducation',
    price: 118500,
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

  es: {
    'visa-schengen': { category: 'Visa', delay: '8 días', description: 'Acompañamiento completo para su solicitud de visa Schengen. Verificación de documentos, preparación del expediente y seguimiento hasta la obtención.', documents: ['Pasaporte válido (mínimo 6 meses)', 'Fotografía reciente', 'Carta de invitación o reserva de hotel', 'Justificante de recursos', 'Seguro de viaje'] },
    'titre-sejour': { name: 'Permiso de residencia', category: 'Administración', delay: '12 días', description: 'Seguimiento administrativo completo para una primera solicitud o una renovación de permiso de residencia.', documents: ['Documento de identidad o pasaporte', 'Justificante de domicilio', 'Contrato de trabajo o certificado de actividad', 'Últimas 3 nóminas'] },
    traduction: { name: 'Traducción certificada', category: 'Documentos', delay: '3 días', description: 'Traducciones certificadas de documentos oficiales (acta de nacimiento, diploma, certificado judicial) al francés, inglés y ruso.', documents: ['Documento original', 'Copia digital legible', 'Datos de contacto'] },
    'lettre-invitation': { name: 'Carta de invitación', category: 'Documentos', delay: '2 días', description: 'Redacción y certificación de una carta de invitación conforme a los requisitos consulares.', documents: ['Documento de identidad del anfitrión', 'Justificante de domicilio', 'Información sobre el invitado'] },
    apostille: { name: 'Legalización y apostilla', category: 'Documentos', delay: '5 días', description: 'Legalización de documentos oficiales y obtención de la apostilla para su reconocimiento internacional.', documents: ['Documento original a legalizar', 'Copia certificada conforme'] },
    equivalence: { name: 'Equivalencia de diploma', category: 'Educación', delay: '15 días', description: 'Acompañamiento para el reconocimiento y la equivalencia de sus diplomas extranjeros ante las autoridades competentes.', documents: ['Diploma original', 'Expedientes académicos', 'Traducción certificada', 'CV detallado'] },
  },
  hi: {
    'visa-schengen': { category: 'वीज़ा', delay: '8 दिन', description: 'आपके शेंगेन वीज़ा आवेदन के लिए पूर्ण सहायता। दस्तावेज़ों की जाँच, फ़ाइल की तैयारी और स्वीकृति तक अनुगमन।', documents: ['वैध पासपोर्ट (न्यूनतम 6 महीने)', 'हालिया पहचान फोटो', 'आमंत्रण पत्र या होटल बुकिंग', 'वित्तीय संसाधनों का प्रमाण', 'यात्रा बीमा'] },
    'titre-sejour': { name: 'निवास परमिट', category: 'प्रशासन', delay: '12 दिन', description: 'निवास परमिट के पहले आवेदन या नवीनीकरण के लिए पूर्ण प्रशासनिक सहायता।', documents: ['पहचान पत्र या पासपोर्ट', 'पते का प्रमाण', 'रोज़गार विवरण या कार्य अनुबंध', 'अंतिम 3 वेतन पर्चियाँ'] },
    traduction: { name: 'प्रमाणित अनुवाद', category: 'दस्तावेज़', delay: '3 दिन', description: 'आधिकारिक दस्तावेज़ों (जन्म प्रमाणपत्र, डिप्लोमा, आपराधिक रिकॉर्ड) के फ्रेंच, अंग्रेज़ी और रूसी में प्रमाणित अनुवाद।', documents: ['मूल दस्तावेज़', 'स्पष्ट डिजिटल प्रति', 'संपर्क विवरण'] },
    'lettre-invitation': { name: 'आमंत्रण पत्र', category: 'दस्तावेज़', delay: '2 दिन', description: 'कांसुलर आवश्यकताओं के अनुरूप आमंत्रण पत्र का मसौदा और प्रमाणीकरण।', documents: ['आमंत्रित करने वाले का पहचान दस्तावेज़', 'पते का प्रमाण', 'अतिथि की जानकारी'] },
    apostille: { name: 'लीगलाइज़ेशन और अपोस्टिल', category: 'दस्तावेज़', delay: '5 दिन', description: 'आधिकारिक दस्तावेज़ों का लीगलाइज़ेशन और अंतर्राष्ट्रीय मान्यता के लिए अपोस्टिल प्राप्ति।', documents: ['लीगलाइज़ करने के लिए मूल दस्तावेज़', 'प्रमाणित प्रति'] },
    equivalence: { name: 'डिप्लोमा समतुल्यता', category: 'शिक्षा', delay: '15 दिन', description: 'सक्षम प्राधिकरणों के समक्ष आपके विदेशी डिप्लोमा की मान्यता और समतुल्यता के लिए सहायता।', documents: ['मूल डिप्लोमा', 'अंकसूचियाँ', 'प्रमाणित अनुवाद', 'विस्तृत CV'] },
  },
  zh: {
    'visa-schengen': { category: '签证', delay: '8 天', description: '为您的申根签证申请提供全程协助：核对材料、准备档案并跟进至获批。', documents: ['有效护照（至少6个月）', '近期证件照', '邀请函或酒店预订', '资金证明', '旅行保险'] },
    'titre-sejour': { name: '居留许可', category: '行政', delay: '12 天', description: '首次申请或续期居留许可的完整行政跟进。', documents: ['身份证或护照', '住址证明', '工作合同或就业证明', '最近3张工资单'] },
    traduction: { name: '认证翻译', category: '文件', delay: '3 天', description: '官方文件（出生证明、文凭、司法记录）的法语、英语和俄语认证翻译。', documents: ['原始文件', '清晰的电子副本', '联系方式'] },
    'lettre-invitation': { name: '邀请函', category: '文件', delay: '2 天', description: '按照领事要求起草并认证邀请函。', documents: ['邀请人身份证件', '住址证明', '被邀请人信息'] },
    apostille: { name: '认证与附加证明书', category: '文件', delay: '5 天', description: '官方文件认证及获得国际认可的附加证明书（Apostille）。', documents: ['需认证的原始文件', '核证副本'] },
    equivalence: { name: '文凭等效认证', category: '教育', delay: '15 天', description: '协助您的外国文凭获得主管机构的认可与等效认证。', documents: ['原始文凭', '成绩单', '认证翻译', '详细简历'] },
  },
}

export function localizeService(service, language = 'fr') {
  const locale = language?.split('-')[0]
  return { ...service, ...(serviceTranslations[locale]?.[service.id] || {}) }
}
