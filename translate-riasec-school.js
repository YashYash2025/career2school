const fs = require('fs');

// الترجمات الفرنسية
const frenchTranslations = {
  'R01': "J'aime réparer ou assembler des appareils.",
  'R02': "J'aime construire des choses avec des outils ou des kits.",
  'R03': "J'aime installer des équipements de jeux ou de réalité virtuelle.",
  'R04': "J'aime faire du sport ou de l'entraînement physique.",
  'R05': "J'aime cuisiner ou faire de la pâtisserie avec de nouvelles recettes.",
  'R06': "J'aime planter, jardiner ou m'occuper d'animaux de compagnie.",
  'R07': "J'aime utiliser des kits de robotique ou d'électronique.",
  'R08': "J'aime aider à installer la scène ou à l'entretien de l'école.",
  'R09': "J'aime les activités de plein air (randonnée, vélo, camping).",
  'R10': "J'aime apprendre à utiliser des outils électriques en toute sécurité.",
  'I01': "J'aime résoudre des problèmes de sciences ou de mathématiques.",
  'I02': "J'aime programmer de petites applications ou des jeux.",
  'I03': "J'aime faire des expériences pour tester des idées.",
  'I04': "J'aime découvrir comment les choses fonctionnent.",
  'I05': "J'aime analyser des données dans des feuilles de calcul.",
  'I06': "J'aime lire sur l'IA, l'espace ou la médecine.",
  'I07': "J'aime les énigmes logiques et les casse-têtes.",
  'I08': "J'aime utiliser des simulations ou des outils de laboratoire.",
  'I09': "J'aime poser des questions profondes et rechercher des réponses.",
  'I10': "J'aime les foires scientifiques ou les clubs STEM.",
  'A01': "J'aime dessiner ou créer de l'art numérique.",
  'A02': "J'aime créer et monter des vidéos.",
  'A03': "J'aime écrire des histoires, des poèmes ou des blogs.",
  'A04': "J'aime composer de la musique ou des rythmes.",
  'A05': "J'aime concevoir des affiches, des logos ou des sites web.",
  'A06': "J'aime jouer, improviser ou me produire sur scène.",
  'A07': "J'aime décorer des espaces avec une belle esthétique.",
  'A08': "J'aime la photographie ou la retouche photo.",
  'A09': "J'aime le design de mode ou la création de tenues.",
  'A10': "J'aime les projets créatifs pour les réseaux sociaux.",
  'S01': "J'aime aider mes camarades à comprendre les leçons.",
  'S02': "J'aime donner des cours ou encadrer les élèves plus jeunes.",
  'S03': "J'aime faire du bénévolat dans des activités communautaires.",
  'S04': "J'aime écouter et soutenir les sentiments de mes amis.",
  'S05': "J'aime organiser des groupes d'étude.",
  'S06': "J'aime planifier des événements caritatifs ou scolaires.",
  'S07': "J'aime expliquer des idées de manière simple.",
  'S08': "J'aime les sujets de santé ou de premiers secours.",
  'S09': "J'aime collaborer pour résoudre des problèmes en équipe.",
  'S10': "J'aime accueillir les nouveaux élèves et les aider à s'adapter.",
  'E01': "J'aime diriger des projets de groupe.",
  'E02': "J'aime présenter des idées aux autres.",
  'E03': "J'aime planifier des événements ou des collectes de fonds.",
  'E04': "J'aime convaincre les gens de soutenir une cause.",
  'E05': "J'aime lancer de petites idées d'entreprise en ligne.",
  'E06': "J'aime débattre et parler en public.",
  'E07': "J'aime promouvoir du contenu sur les réseaux sociaux.",
  'E08': "J'aime être le capitaine ou le coordinateur d'une équipe.",
  'E09': "J'aime négocier et conclure des accords.",
  'E10': "J'aime fixer des objectifs et motiver les autres.",
  'C01': "J'aime organiser des fichiers, des notes ou des applications.",
  'C02': "J'aime suivre les tâches et les échéances.",
  'C03': "J'aime travailler avec des feuilles de calcul ou des formulaires.",
  'C04': "J'aime suivre des règles et des instructions claires.",
  'C05': "J'aime vérifier les détails pour éviter les erreurs.",
  'C06': "J'aime saisir des données avec précision.",
  'C07': "J'aime étiqueter et catégoriser les choses.",
  'C08': "J'aime gérer des budgets ou des points/scores.",
  'C09': "J'aime utiliser des planificateurs et des listes de tâches.",
  'C10': "J'aime garder les endroits propres et ordonnés."
};

// قراءة الملف
const content = fs.readFileSync('New RIASEC/02-RIASEC_60_School.csv', 'utf8');
const lines = content.split('\n');

// معالجة كل سطر
const newLines = lines.map((line, index) => {
  if (index === 0) {
    // السطر الأول (العناوين)
    return line;
  }
  
  // استخراج ID من السطر
  const id = line.split(',')[0];
  
  if (frenchTranslations[id]) {
    // إضافة الترجمة الفرنسية في النهاية
    return line.trimEnd() + frenchTranslations[id];
  }
  
  return line;
});

// كتابة الملف الجديد
fs.writeFileSync('New RIASEC/02-RIASEC_60_School.csv', newLines.join('\n'), 'utf8');

console.log('✅ تم إضافة الترجمة الفرنسية بنجاح!');
console.log(`📊 عدد الأسئلة المترجمة: ${Object.keys(frenchTranslations).length}`);
