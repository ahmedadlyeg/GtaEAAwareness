/* =====================================================================
   EA for Non-IT — bilingual (English / Arabic) executive-facing content.
   Business-language explanation of Enterprise Architecture: outcomes,
   executive benefits, the EA building blocks in plain terms, and one
   worked example (the Pillar Two global minimum tax impact analysis).
   Arabic terms mirror the GTA "EA Impact Analysis" slide.
   ===================================================================== */
window.EA_NONIT = {
  en: {
    dir: "ltr", lang: "en", other: "ar", otherLabel: "العربية",
    eyebrow: "EA for Non-IT · Executive view",
    title: "Enterprise Architecture, in business terms",
    sub: "What EA is, why it matters to the people who run the Authority, and how it turns a new law or a major investment from a six-week scramble into a question you can answer in minutes.",
    what: {
      h: "What Enterprise Architecture really is",
      paras: [
        "Enterprise Architecture (EA) is a shared, living map of how the Authority works — how its goals connect to the services it runs, the systems that support them, and the technology underneath. It is not an IT diagram; it is the link between strategy and delivery, kept current so leaders can see the whole picture in one place.",
        "Think of it the way an architect's plans describe a building. You would not add a floor, move a wall or re-route the plumbing without the plans. EA is those plans for the organisation — so any change can be understood before money is spent.",
        "Its real power is traceability: every goal links down to the capabilities, processes, systems and technology that deliver it. So the question every leader asks — what will this change affect? — becomes a query, not weeks of meetings."
      ]
    },
    why: {
      h: "Why it matters to executives",
      lead: "EA is not overhead. It is how leadership gets faster change, fewer surprises and better decisions.",
      items: [
        { t: "Change becomes faster and cheaper", d: "Impact is read from the model in minutes, before any design or build. Teams stop rediscovering how everything connects every time something changes." },
        { t: "Fewer costly surprises", d: "Nothing important is missed. Impacts that would otherwise surface late — as defects, audit findings and rework — are caught up front." },
        { t: "Smarter investment decisions", d: "Duplication, gaps and risky dependencies become visible, so the portfolio funds what matters and retires what does not." },
        { t: "Regulatory and market agility", d: "When a new law or mandate lands, you can trace exactly what it touches and respond with confidence instead of guesswork." },
        { t: "Strategy that actually executes", d: "Every initiative traces back to a business goal, so leadership can see whether the roadmap really delivers the strategy." }
      ]
    },
    components: {
      h: "The building blocks, in plain language",
      lead: "EA describes the organisation in six connected layers. Each answers a simple business question, and each links to the one above and below it — which is what makes impact traceable.",
      layers: [
        { name: "Motivation", q: "The why", plain: "The drivers, goals and laws that shape the Authority.", ex: "Diversify revenue · broaden the tax base · comply with the global minimum tax.", c: "#7B6FD6" },
        { name: "Strategy", q: "What we must be able to do", plain: "The capabilities the organisation needs to have.", ex: "Taxpayer Services · Risk & Compliance · Revenue Collection.", c: "#C98E1E" },
        { name: "Business", q: "How we operate day to day", plain: "The services and processes people actually experience.", ex: "Registering a multinational group · filing a top-up tax return · payments & refunds.", c: "#B39A00" },
        { name: "Application & Data", q: "The systems and information", plain: "The software and data that run the work.", ex: "Core Tax System · Taxpayer Portal · Risk Engine · taxpayer master data.", c: "#1F9AA8" },
        { name: "Technology", q: "What it all runs on", plain: "The platforms and infrastructure underneath.", ex: "Private cloud · integration bus · API gateway · identity & access.", c: "#4E9A3A" },
        { name: "Implementation & Migration", q: "The change roadmap", plain: "How you get from today to the target state.", ex: "Fundable work packages and milestones that sequence the change.", c: "#D0617A" }
      ]
    },
    example: {
      h: "One real decision: the global minimum tax",
      lead: "A new rule — Pillar Two, a 15% global minimum tax on large multinational groups — has to be absorbed. Every executive asks the same thing: what will this change affect, and what will it cost us? Here is the difference EA makes.",
      withTitle: "With EA",
      withText: "The law is placed in the model. Traceability shows, layer by layer, exactly what it touches — the capabilities, the processes, the systems, the technology — and every gap becomes a work package on the roadmap. The impact is assessed before any design or build begins.",
      withKpis: [["Minutes", "to assess the impact"], ["6", "layers traced end to end"], ["Complete", "picture, nothing missed"]],
      withoutTitle: "Without EA",
      withoutText: "The same knowledge is scattered across slides, spreadsheets, emails and people's memory, with no documented links. Each impact is hunted by hand, file by file.",
      withoutKpis: [["6 weeks", "of manual searching"], ["7", "impacts found"], ["11", "impacts missed"]],
      close: "Same law, same organisation. The only difference is whether the map exists. The missed impacts do not disappear — they resurface later as defects, audit findings and rework.",
      embed: {
        heading: "See it for yourself",
        lead: "Pick a scenario, then step through it or press Play to watch the impact trace itself.",
        full: "Open full screen ↗",
        links: [["without", "The 6-week manual search"], ["with", "Impact traced in minutes"]]
      }
    },
    realize: {
      h: "How executives realise the benefit",
      items: [
        { t: "Ask for the architecture view first", d: "Before approving a major change or investment, what does this touch? should have an answer on day one — not after it ships." },
        { t: "Fund keeping the model current", d: "An out-of-date map is exactly why the without-EA story happens. A living model is a small cost against weeks of rework." },
        { t: "Use it for portfolio decisions", d: "Let dependencies, duplication and gaps guide what you start, stop and sequence." },
        { t: "Make it the common language", d: "Strategy, business and IT reading the same picture is how big change stays aligned." }
      ]
    },
    slide: { text: "Open the interactive impact-analysis slide", url: "https://claude.ai/artifact/QFhg8WXtysjKpidGTDLt4a" }
  },

  ar: {
    dir: "rtl", lang: "ar", other: "en", otherLabel: "English",
    eyebrow: "البنية المؤسسية لغير المختصين · منظور تنفيذي",
    title: "البنية المؤسسية بلغة الأعمال",
    sub: "ما هي البنية المؤسسية، ولماذا تهمّ من يقودون الهيئة، وكيف تحوّل صدور قانون جديد أو قرارًا استثماريًا كبيرًا من بحثٍ يستغرق ستة أسابيع إلى سؤالٍ تُجيب عنه خلال دقائق.",
    what: {
      h: "ما هي البنية المؤسسية حقًّا",
      paras: [
        "البنية المؤسسية (EA) خريطة حيّة ومشتركة لكيفية عمل الهيئة — كيف ترتبط أهدافها بالخدمات التي تقدّمها، والأنظمة التي تدعمها، والتقنية التي تقوم عليها. إنها ليست رسمًا تقنيًا، بل هي الجسر بين الاستراتيجية والتنفيذ، تُحدَّث باستمرار ليرى القادة الصورة كاملة في مكان واحد.",
        "تخيّلها كما تصف مخططات المهندس المعماري مبنى. لن تضيف طابقًا أو تنقل جدارًا أو تعيد توجيه السباكة دون الرجوع إلى المخططات. البنية المؤسسية هي تلك المخططات للمؤسسة — حتى يُفهَم أثر أي تغيير قبل إنفاق المال.",
        "قوّتها الحقيقية في قابلية التتبّع: كل هدف يرتبط نزولًا بالقدرات والإجراءات والأنظمة والتقنية التي تحققه. وهكذا يصبح السؤال الذي يطرحه كل قائد — ما الذي سيتأثر بهذا التغيير؟ — استعلامًا سريعًا بدلًا من أسابيع من الاجتماعات."
      ]
    },
    why: {
      h: "لماذا تهمّ القيادة التنفيذية",
      lead: "البنية المؤسسية ليست عبئًا إداريًا، بل هي وسيلة القيادة إلى تغييرٍ أسرع، ومفاجآتٍ أقل، وقراراتٍ أفضل.",
      items: [
        { t: "التغيير يصبح أسرع وأقل كلفة", d: "يُقرأ الأثر من النموذج خلال دقائق، قبل أي تصميم أو تطوير. وتتوقف الفرق عن إعادة اكتشاف كيفية ترابط الأمور مع كل تغيير." },
        { t: "مفاجآت أقل وأقل كلفة", d: "لا يفوت شيء مهم. فالآثار التي كانت ستظهر متأخرة — كأعطال وملاحظات تدقيق وإعادة عمل — تُكتشَف مبكرًا." },
        { t: "قرارات استثمار أذكى", d: "يصبح الازدواج والفجوات والاعتماديات الخطرة مرئية، فتموّل المحفظة ما يهم وتتخلى عمّا لا يهم." },
        { t: "مرونة تنظيمية وتشريعية", d: "عند صدور قانون أو تكليف جديد، يمكنك تتبّع ما يتأثر بدقة والاستجابة بثقة بدلًا من التخمين." },
        { t: "استراتيجية تُنفَّذ فعلًا", d: "كل مبادرة ترتبط بهدف أعمال، فترى القيادة ما إذا كانت خارطة الطريق تحقق الاستراتيجية فعلًا." }
      ]
    },
    components: {
      h: "اللبنات الأساسية بلغةٍ مبسّطة",
      lead: "تصف البنية المؤسسية المنظمة في ست طبقات مترابطة. كل طبقة تجيب عن سؤال أعمال بسيط، وترتبط بالطبقة التي فوقها وتحتها — وهذا ما يجعل الأثر قابلًا للتتبّع.",
      layers: [
        { name: "الدوافع", q: "لماذا", plain: "المحركات والأهداف والقوانين التي تشكّل الهيئة.", ex: "تنويع الإيرادات · توسيع القاعدة الضريبية · الامتثال للحد الأدنى العالمي للضريبة.", c: "#7B6FD6" },
        { name: "الاستراتيجية", q: "ما يجب أن نكون قادرين عليه", plain: "القدرات التي تحتاج المنظمة إلى امتلاكها.", ex: "خدمات المكلفين · المخاطر والامتثال · تحصيل الإيرادات.", c: "#C98E1E" },
        { name: "الأعمال", q: "كيف نعمل يوميًا", plain: "الخدمات والإجراءات التي يختبرها الناس فعلًا.", ex: "تسجيل مجموعة دولية · تقديم إقرار الضريبة التكميلية · المدفوعات والاسترداد.", c: "#B39A00" },
        { name: "التطبيقات والبيانات", q: "الأنظمة والمعلومات", plain: "البرمجيات والبيانات التي تدير العمل.", ex: "النظام الضريبي الأساسي · بوابة المكلفين · محرك المخاطر · البيانات الرئيسية للمكلفين.", c: "#1F9AA8" },
        { name: "التقنية", q: "ما يقوم عليه كل ذلك", plain: "المنصات والبنية التحتية الأساسية.", ex: "السحابة الخاصة · ناقل التكامل · بوابة واجهات API · الهوية والصلاحيات.", c: "#4E9A3A" },
        { name: "التنفيذ والانتقال", q: "خارطة طريق التغيير", plain: "كيف تنتقل من الوضع الحالي إلى الوضع المستهدف.", ex: "حزم عمل قابلة للتمويل ومراحل زمنية تنظّم التغيير.", c: "#D0617A" }
      ]
    },
    example: {
      h: "قرار واقعي واحد: الحد الأدنى العالمي للضريبة",
      lead: "لا بد من استيعاب قاعدة جديدة — الركيزة الثانية، حد أدنى عالمي للضريبة بنسبة 15% على المجموعات متعددة الجنسيات الكبرى. يطرح كل تنفيذي السؤال نفسه: ما الذي سيتأثر بهذا التغيير، وكم سيكلّفنا؟ وهذا هو الفرق الذي تصنعه البنية المؤسسية.",
      withTitle: "مع البنية المؤسسية",
      withText: "يوضَع القانون في النموذج. وتُظهر قابلية التتبّع، طبقةً طبقة، ما يتأثر بالضبط — القدرات والإجراءات والأنظمة والتقنية — وتتحول كل فجوة إلى حزمة عمل في خارطة الطريق. يُقيَّم الأثر قبل البدء بأي تصميم أو تطوير.",
      withKpis: [["دقائق", "لتقييم الأثر"], ["٦", "طبقات مترابطة بالكامل"], ["كاملة", "صورة دون أي إغفال"]],
      withoutTitle: "بدون البنية المؤسسية",
      withoutText: "المعرفة نفسها مبعثرة بين العروض والجداول والبريد وذاكرة الموظفين، دون روابط موثّقة. ويُبحَث عن كل أثر يدويًا، ملفًا تلو الآخر.",
      withoutKpis: [["٦ أسابيع", "من البحث اليدوي"], ["٧", "آثار مكتشفة"], ["١١", "أثرًا مفقودًا"]],
      close: "القانون نفسه، والمنظمة نفسها. الفرق الوحيد هو وجود الخريطة من عدمه. والآثار المفقودة لا تختفي — بل تعود لاحقًا كأعطال وملاحظات تدقيق وإعادة عمل.",
      embed: {
        heading: "شاهدها بنفسك",
        lead: "اختر سيناريو، ثم تنقّل بين خطواته أو اضغط «تشغيل» لمشاهدة تتبّع الأثر.",
        full: "ملء الشاشة ↗",
        links: [["without", "البحث اليدوي الذي يستغرق ٦ أسابيع"], ["with", "تتبّع الأثر خلال دقائق"]]
      }
    },
    realize: {
      h: "كيف تحقّق القيادة التنفيذية الفائدة",
      items: [
        { t: "اطلب منظور البنية المؤسسية أولًا", d: "قبل اعتماد أي تغيير أو استثمار كبير، ينبغي أن يكون للسؤال «ما الذي يتأثر بهذا؟» إجابة من اليوم الأول — لا بعد التنفيذ." },
        { t: "موّل إبقاء النموذج محدّثًا", d: "الخريطة غير المحدّثة هي بالضبط سبب سيناريو «بدون البنية المؤسسية». والنموذج الحي كلفته زهيدة مقابل أسابيع من إعادة العمل." },
        { t: "استخدمها في قرارات المحفظة", d: "دع الاعتماديات والازدواج والفجوات توجّه ما تبدؤه وما توقفه وكيف ترتّبه." },
        { t: "اجعلها اللغة المشتركة", d: "أن تقرأ الاستراتيجية والأعمال وتقنية المعلومات الصورة نفسها هو ما يُبقي التغيير الكبير متسقًا." }
      ]
    },
    slide: { text: "افتح شريحة تحليل الأثر التفاعلية", url: "https://claude.ai/artifact/QFhg8WXtysjKpidGTDLt4a" }
  }
};
