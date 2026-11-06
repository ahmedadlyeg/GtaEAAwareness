(function(){
const stage=document.getElementById('stage');
const $=id=>document.getElementById(id);
function fit(){
  const s=Math.min(innerWidth/1920, innerHeight/1080);
  stage.style.transform=`translate(${(innerWidth-1920*s)/2}px,${(innerHeight-1080*s)/2}px) scale(${s})`;
}
addEventListener('resize',fit); fit();
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const T=RM?0.25:1;
const NS='http://www.w3.org/2000/svg';

/* =================== TEXT =================== */
const TX={
en:{
  eyebrow:'General Tax Authority · EA Program Kick-off', lang:'عربي',
  tabs:['Without EA','With EA'],
  layers:[['Motivation','Why: drivers, goals, laws'],['Strategy','What we must be able to do'],['Business','Processes & services'],['Application & Data','Systems & information'],['Technology','Platforms & infrastructure'],['Implementation & Migration','The change roadmap']],
  types:{drv:'Driver',pri:'Principle',req:'Requirement',goal:'Goal',law:'Constraint · Law',cap:'Capability',svc:'Service',proc:'Process',app:'App Component',data:'Data Object',tsvc:'Tech Service',node:'Node',plat:'Plateau',prog:'Program',wp:'Work Package'},
  names:{m_drv:'Revenue diversification',m_pri:'Digital-first services',m_priv:'Taxpayer data privacy',m_goal:'Broaden the tax base',m_nreq:'Top up MNE groups to 15%',m_law:'Pillar Two: Global Minimum Tax',
    s_svc:'Taxpayer Services',s_ana:'Analytics & Reporting',s_reg:'Taxpayer Registration',s_ret:'Return Processing',s_risk:'Risk & Compliance',s_col:'Revenue Collection',
    b_call:'Contact Center Support',b_obj:'Objections & Appeals',b_onb:'MNE Group Registration',b_file:'Top-up Tax Return Filing',b_aud:'Audit Case Selection',b_pay:'Payment & Refunds',
    a_crm:'CRM',a_md:'Taxpayer Master Data',a_portal:'Taxpayer Portal',a_core:'Core Tax System',a_risk:'Risk Engine',a_pg:'Payment Gateway',
    t_net:'Network & Security',t_cloud:'Private Cloud',t_iam:'Identity & Access',t_esb:'Integration Bus',t_db:'Database Platform',t_api:'API Gateway',
    i_base:'Baseline (current state)',i_prog:'Digital Transformation',i_wp1:'MNE group registration',i_wp2:'GloBE & top-up returns',i_wp3:'ETR risk rules & data',i_wp4:'Top-up tax payments'},
  badge:{hit:'IMPACTED',nw:'NEW',found:'FOUND',dead:'DEAD END',miss:'MISSED'},
  pill:{asis:'As-is',result:'Result',step:(a,b)=>`Step ${a} of ${b}`},
  play:'▶ Play',pause:'❚❚ Pause',replay:'↻ Replay',prev:'◀',next:'▶',
  hint:'← → navigate · Space play/pause · R reset · F full screen · L language',
  with:{
    title:'With EA: tracing the <span>impact</span> of Pillar Two, layer by layer',
    chip:['As-is baseline','Change in progress','Impact assessed'],
    pTitle:'Impact analysis',
    intro:'The as-is model connects motivation, strategy, business, applications, technology and the change portfolio. When something changes, the links show exactly what it touches.',
    legend:['Unchanged','Impacted','New element','Impact path'],
    totals:['blocks impacted','new elements','work packages'],
    steps:[
      ['<b>Pillar Two</b>, a 15% global minimum tax for groups with revenue of €750M or more, is enacted. We model it in the Motivation layer: it adds a requirement and changes a goal.','Pillar Two law, new requirement, goal changed'],
      ['Traceability shows which <b>strategic capabilities</b> must deliver the new requirement.','Capabilities must change'],
      ['Each capability is enabled by <b>business processes</b>, and these need redesign.','Processes to redesign'],
      ['Those processes are supported by <b>applications and data</b>, which must be changed.','Applications & data affected'],
      ['The applications run on <b>technology services</b> that need new capacity and integrations.','Tech services to extend'],
      ['Every gap becomes a <b>work package</b> in the Implementation & Migration layer: the roadmap for the change.','Work packages on the roadmap']],
    asis:"Today's architecture: every building block is linked to the layers above and below it.",
    final:'Impact assessed from the model in minutes, before any design or build work starts.'
  },
  without:{
    title:'Without EA: chasing the <span>impact</span> of Pillar Two',
    chip:['Scattered knowledge','Searching…','Partial picture'],
    pTitle:'Manual impact search',
    intro:'The same building blocks live in slides, spreadsheets, emails and people\'s memory. The links between them are undocumented, so every impact has to be found by hand.',
    legend:['Building block','Found impact','Dead end','Missed impact'],
    totals:['impacts found','impacts missed','weeks spent'],
    silos:{mail:'Email inbox',deck:'Strategy deck · PowerPoint',policy:'Policy folder · shared drive',proc:'Process docs · SharePoint (2021)',xls:'Application list · Excel',contract:'Vendor contracts · PDF',visio:'Network diagrams · Visio',heads:"In people's heads"},
    notes:['Who owns this?','Last updated 2019','final_v7_REAL.xlsx'],
    steps:[
      ['<b>Pillar Two</b> arrives as a PDF in someone\'s inbox. There is no model to place it in, so the team starts asking around.','Email inbox','Law arrives as a PDF','Day 1'],
      ['Policy folders and the strategy deck: two dead ends, then <b>one goal</b> is found. The new requirement is never written down.','Policies & strategy','1 goal found, 2 dead ends','Week 1'],
      ['Process documents date from 2021. After wrong turns, <b>Return Filing</b> and <b>Return Processing</b> are found.','Processes','2 found, 2 dead ends','Week 2'],
      ['The Excel application list has no links to processes. Someone remembers the <b>Core Tax System</b> and the <b>Portal</b>.','Applications','2 found from memory','Week 3'],
      ['Network diagrams in Visio were last updated in 2019. The trail goes cold: <b>no technology impacts found</b>.','Technology','0 found, 3 dead ends','Week 5'],
      ['A vendor contract reveals the <b>Payment Gateway</b> and <b>Revenue Collection</b>. Then the deadline arrives.','Contracts','2 found','Week 6']],
    asis:'No architecture model: the same building blocks are scattered across files, servers and people, joined by undocumented links.',
    final:'After 6 weeks: 7 impacts found, 11 missed. The missed ones surface later as defects, audit findings and rework.'
  }
},
ar:{
  eyebrow:'الهيئة العامة للضرائب · إطلاق برنامج البنية المؤسسية', lang:'English',
  tabs:['بدون البنية المؤسسية','مع البنية المؤسسية'],
  layers:[['الدوافع','لماذا: المحركات والأهداف والقوانين'],['الاستراتيجية','ما يجب أن نكون قادرين عليه'],['الأعمال','الإجراءات والخدمات'],['التطبيقات والبيانات','الأنظمة والمعلومات'],['التقنية','المنصات والبنية التحتية'],['التنفيذ والانتقال','خارطة طريق التغيير']],
  types:{drv:'محرّك',pri:'مبدأ',req:'متطلب',goal:'هدف',law:'قيد · قانون',cap:'قدرة',svc:'خدمة',proc:'إجراء',app:'مكوّن تطبيقي',data:'كيان بيانات',tsvc:'خدمة تقنية',node:'عقدة',plat:'مرحلة',prog:'برنامج',wp:'حزمة عمل'},
  names:{m_drv:'تنويع مصادر الإيرادات',m_pri:'الخدمات الرقمية أولاً',m_priv:'خصوصية بيانات المكلفين',m_goal:'توسيع القاعدة الضريبية',m_nreq:'ضريبة تكميلية حتى 15%',m_law:'الركيزة الثانية: حد أدنى 15%',
    s_svc:'خدمات المكلفين',s_ana:'التحليلات والتقارير',s_reg:'تسجيل المكلفين',s_ret:'معالجة الإقرارات',s_risk:'المخاطر والامتثال',s_col:'تحصيل الإيرادات',
    b_call:'دعم مركز الاتصال',b_obj:'الاعتراضات والتظلمات',b_onb:'تسجيل المجموعات الدولية',b_file:'تقديم إقرار الضريبة التكميلية',b_aud:'اختيار حالات التدقيق',b_pay:'المدفوعات والاسترداد',
    a_crm:'إدارة علاقات المكلفين',a_md:'البيانات الرئيسية للمكلفين',a_portal:'بوابة المكلفين',a_core:'النظام الضريبي الأساسي',a_risk:'محرك المخاطر',a_pg:'بوابة الدفع',
    t_net:'الشبكات والأمن',t_cloud:'السحابة الخاصة',t_iam:'الهوية والصلاحيات',t_esb:'ناقل التكامل',t_db:'منصة قواعد البيانات',t_api:'بوابة واجهات API',
    i_base:'خط الأساس (الوضع الحالي)',i_prog:'التحول الرقمي',i_wp1:'تسجيل المجموعات الدولية',i_wp2:'إقرارات GloBE والضريبة التكميلية',i_wp3:'قواعد مخاطر المعدل الفعلي',i_wp4:'مدفوعات الضريبة التكميلية'},
  badge:{hit:'متأثر',nw:'جديد',found:'تم إيجاده',dead:'طريق مسدود',miss:'لم يُكتشف'},
  pill:{asis:'الوضع الحالي',result:'النتيجة',step:(a,b)=>`الخطوة ${a} من ${b}`},
  play:'▶ تشغيل',pause:'❚❚ إيقاف مؤقت',replay:'↻ إعادة التشغيل',prev:'▶',next:'◀',
  hint:'← → للتنقل · مسافة تشغيل/إيقاف · R إعادة ضبط · F ملء الشاشة · L اللغة',
  with:{
    title:'مع البنية المؤسسية: تتبُّع <span>أثر</span> الركيزة الثانية عبر كل الطبقات',
    chip:['الوضع الحالي','جارٍ تطبيق التغيير','تم تقييم الأثر'],
    pTitle:'تحليل الأثر',
    intro:'يربط النموذج الحالي بين الدوافع والاستراتيجية والأعمال والتطبيقات والتقنية ومحفظة التغيير. عند حدوث أي تغيير، تُظهر الروابط بدقة ما يتأثر به.',
    legend:['دون تغيير','متأثر','عنصر جديد','مسار الأثر'],
    totals:['لبنات متأثرة','عناصر جديدة','حزم عمل'],
    steps:[
      ['صدور قانون <b>الركيزة الثانية</b>: حد أدنى عالمي للضريبة بنسبة 15% على المجموعات التي تبلغ إيراداتها 750 مليون يورو فأكثر. نمذجه في طبقة الدوافع: يضيف متطلباً جديداً ويؤثر على هدف قائم.','قانون الركيزة الثانية، متطلب جديد، هدف متأثر'],
      ['تُظهر قابلية التتبع <b>القدرات الاستراتيجية</b> التي يجب أن تحقق المتطلب الجديد.','قدرات يجب تعديلها'],
      ['كل قدرة تُمكّنها <b>إجراءات أعمال</b>، وهذه تحتاج إلى إعادة تصميم.','إجراءات تحتاج إعادة تصميم'],
      ['هذه الإجراءات تدعمها <b>تطبيقات وبيانات</b> يجب تعديلها.','تطبيقات وبيانات متأثرة'],
      ['تعمل التطبيقات على <b>خدمات تقنية</b> تحتاج إلى سعة وتكاملات جديدة.','خدمات تقنية تحتاج توسعة'],
      ['تتحول كل فجوة إلى <b>حزمة عمل</b> في طبقة التنفيذ والانتقال: خارطة طريق التغيير.','حزم عمل في خارطة الطريق']],
    asis:'البنية الحالية: كل لبنة بنائية مرتبطة بالطبقات التي فوقها وتحتها.',
    final:'تم تقييم الأثر من النموذج خلال دقائق، قبل البدء في أي تصميم أو تطوير.'
  },
  without:{
    title:'بدون البنية المؤسسية: البحث عن <span>أثر</span> الركيزة الثانية',
    chip:['معرفة مبعثرة','جارٍ البحث…','صورة ناقصة'],
    pTitle:'البحث اليدوي عن الأثر',
    intro:'اللبنات البنائية نفسها موزعة بين العروض والجداول والبريد وذاكرة الموظفين. العلاقات بينها غير موثقة، لذا يجب البحث عن كل أثر يدوياً.',
    legend:['لبنة بنائية','أثر مكتشف','طريق مسدود','أثر لم يُكتشف'],
    totals:['آثار مكتشفة','آثار مفقودة','أسابيع'],
    silos:{mail:'البريد الإلكتروني',deck:'عرض الاستراتيجية · PowerPoint',policy:'مجلد السياسات · محرك مشترك',proc:'وثائق الإجراءات · SharePoint ‏(2021)',xls:'قائمة التطبيقات · Excel',contract:'عقود الموردين · PDF',visio:'مخططات الشبكة · Visio',heads:'في أذهان الموظفين'},
    notes:['من المسؤول عن هذا؟','آخر تحديث 2019','final_v7_REAL.xlsx'],
    steps:[
      ['يصل قانون <b>الركيزة الثانية</b> كملف PDF في بريد أحد الموظفين. لا يوجد نموذج لوضعه فيه، فيبدأ الفريق بالسؤال هنا وهناك.','البريد الإلكتروني','وصول القانون كملف PDF','اليوم 1'],
      ['مجلدات السياسات وعرض الاستراتيجية: طريقان مسدودان، ثم يُعثر على <b>هدف واحد</b>. المتطلب الجديد لا يُوثَّق أبداً.','السياسات والاستراتيجية','هدف واحد، طريقان مسدودان','الأسبوع 1'],
      ['وثائق الإجراءات تعود إلى 2021. بعد منعطفات خاطئة، يُعثر على <b>تقديم الإقرار</b> و<b>معالجة الإقرارات</b>.','الإجراءات','2 مكتشفة، طريقان مسدودان','الأسبوع 2'],
      ['قائمة التطبيقات في Excel لا ترتبط بالإجراءات. يتذكر أحدهم <b>النظام الضريبي الأساسي</b> و<b>البوابة</b>.','التطبيقات','2 مكتشفة من الذاكرة','الأسبوع 3'],
      ['آخر تحديث لمخططات الشبكة في Visio كان عام 2019. ينقطع الأثر: <b>لم يُعثر على أي أثر تقني</b>.','التقنية','0 مكتشفة، 3 طرق مسدودة','الأسبوع 5'],
      ['يكشف عقد أحد الموردين عن <b>بوابة الدفع</b> و<b>تحصيل الإيرادات</b>. ثم يحين الموعد النهائي.','العقود','2 مكتشفة','الأسبوع 6']],
    asis:'لا يوجد نموذج للبنية: اللبنات نفسها مبعثرة بين الملفات والخوادم والأشخاص، وتربطها علاقات غير موثقة.',
    final:'بعد 6 أسابيع: 7 آثار مكتشفة و11 أثراً مفقوداً، تظهر لاحقاً كأعطال وملاحظات تدقيق وإعادة عمل.'
  }
}};

/* =================== SHARED MODEL =================== */
const LAYERS=[
  {fill:'#E9E7FB',c:'#7B6FD6'},{fill:'#FBF0D9',c:'#C98E1E'},{fill:'#FCF8D2',c:'#B39A00'},
  {fill:'#DDF4F6',c:'#1F9AA8'},{fill:'#E3F1DA',c:'#4E9A3A'},{fill:'#FBE4E7',c:'#D0617A'}];
const B=[
  ['m_drv',0,0,'drv'],['m_pri',0,1,'pri'],['m_priv',0,2,'req'],['m_goal',0,3,'goal'],['m_nreq',0,4,'req',1],['m_law',0,5,'law',1],
  ['s_svc',1,0,'cap'],['s_ana',1,1,'cap'],['s_reg',1,2,'cap'],['s_ret',1,3,'cap'],['s_risk',1,4,'cap'],['s_col',1,5,'cap'],
  ['b_call',2,0,'svc'],['b_obj',2,1,'proc'],['b_onb',2,2,'proc'],['b_file',2,3,'proc'],['b_aud',2,4,'proc'],['b_pay',2,5,'proc'],
  ['a_crm',3,0,'app'],['a_md',3,1,'data'],['a_portal',3,2,'app'],['a_core',3,3,'app'],['a_risk',3,4,'app'],['a_pg',3,5,'app'],
  ['t_net',4,0,'tsvc'],['t_cloud',4,1,'node'],['t_iam',4,2,'tsvc'],['t_esb',4,3,'tsvc'],['t_db',4,4,'tsvc'],['t_api',4,5,'tsvc'],
  ['i_base',5,0,'plat'],['i_prog',5,1,'prog'],['i_wp1',5,2,'wp',1],['i_wp2',5,3,'wp',1],['i_wp3',5,4,'wp',1],['i_wp4',5,5,'wp',1]];
const BI={}; B.forEach(b=>BI[b[0]]=b);

/* =================== STATE =================== */
let lang='en', view='without', cur=0, busy=false, run=0, playing=false;
try{
  const h=location.hash.replace('#','');
  if(h.startsWith('ar')) lang='ar';
  if(h.endsWith('with')&&!h.endsWith('without')) view='with';
}catch(e){}
const L=()=>TX[lang];
const mx=(x,w)=>lang==='ar'?1920-x-w:x;
const sleep=ms=>new Promise(r=>setTimeout(r,ms*T));
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

function blockEl(pre,id,x,y,cls){
  const t=L(), b=BI[id];
  const d=document.createElement('div');
  d.className='blk'+(cls||'')+(b[4]?' isnew':''); d.id=pre+id;
  d.style.cssText=`left:${x}px;top:${y}px;--c:${LAYERS[b[1]].c}`;
  d.innerHTML=`<span class="tp caps">${t.types[b[3]]}</span><span class="nm">${t.names[id]}</span><span class="badge caps" data-hit="${cls?t.badge.found:t.badge.hit}" data-new="${t.badge.nw}" data-dead="${t.badge.dead}" data-miss="${t.badge.miss}"></span>`;
  return d;
}
function mark(pre,id,cls,pulse){
  const el=$(pre+id); if(!el) return;
  if(cls==='hit'&&el.classList.contains('isnew')) el.classList.add('show'); else el.classList.add(cls);
  if(pulse){ el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }
}
function makeAnchor(g){
  const a=document.createElementNS(NS,'g');
  a.innerHTML='<circle r="20" fill="#E0482A" opacity=".35" filter="url(#glow)"/>'+
    '<circle r="15" fill="none" stroke="#E0482A" stroke-width="2" opacity=".5"><animate attributeName="r" values="10;20;10" dur="0.9s" repeatCount="indefinite"/></circle>'+
    '<circle r="8" fill="#E0482A" stroke="#fff" stroke-width="3"/>';
  g.appendChild(a); return a;
}
function addPath(g,d,marker){
  const p=document.createElementNS(NS,'path'); p.setAttribute('d',d); if(marker) p.setAttribute('marker-end',marker); g.appendChild(p); return p;
}
/* animate an anchor along a path; draws the path behind it */
function travel(hotG,anchG,d,dur,token,marker){
  return new Promise(res=>{
    const p=addPath(hotG,d), len=p.getTotalLength();
    p.style.strokeDasharray=len; p.style.strokeDashoffset=len;
    const anc=makeAnchor(anchG), t0=performance.now(); dur*=T;
    (function f(now){
      if(token!==run){anc.remove();return res(false);}
      const t=Math.min(1,(now-t0)/dur), e=ease(t), pt=p.getPointAtLength(e*len);
      anc.setAttribute('transform',`translate(${pt.x},${pt.y})`);
      p.style.strokeDashoffset=len*(1-e);
      if(t<1) requestAnimationFrame(f);
      else{ p.style.strokeDasharray='none'; if(marker) p.setAttribute('marker-end',marker); anc.remove(); res(true); }
    })(t0);
  });
}
function rng(seed){ let s=seed>>>0||1; return ()=>((s=Math.imul(s^(s>>>15),2246822507)^Math.imul(s^(s>>>13),3266489909),s^=s>>>16)>>>0)/4294967296; }
function hashStr(str){ let h=2166136261; for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619);} return h>>>0; }

/* =================== SCENARIO: WITH EA =================== */
const W=(function(){
  const G={y0:176,rowStep:134,bx0:276,colW:182,colStep:196.4,bH:86,bTop:20};
  const pos={};
  const FAINT=[
    ['m_drv','s_svc'],['m_pri','s_ana'],['m_priv','s_reg'],['m_goal','s_ret'],
    ['s_svc','b_call'],['s_ret','b_obj'],['s_reg','b_onb'],['s_ret','b_file'],['s_risk','b_aud'],['s_col','b_pay'],
    ['b_call','a_crm'],['b_obj','a_crm'],['b_onb','a_portal'],['b_onb','a_md'],['b_file','a_core'],['b_aud','a_risk'],['b_pay','a_pg'],
    ['a_crm','t_cloud'],['a_md','t_cloud'],['a_portal','t_iam'],['a_core','t_esb'],['a_risk','t_db'],['a_pg','t_api'],
    ['t_cloud','i_prog'],['t_net','i_base']];
  const STEPS=[
    {row:0,pre:'m_law',edges:[['m_law','m_nreq'],['m_law','m_goal']]},
    {row:1,edges:[['m_nreq','s_reg'],['m_nreq','s_ret'],['m_nreq','s_risk'],['m_nreq','s_col']]},
    {row:2,edges:[['s_reg','b_onb'],['s_ret','b_file'],['s_risk','b_aud'],['s_col','b_pay']]},
    {row:3,edges:[['b_onb','a_portal'],['b_onb','a_md'],['b_file','a_core'],['b_aud','a_risk'],['b_pay','a_pg']]},
    {row:4,edges:[['a_portal','t_iam'],['a_core','t_esb'],['a_risk','t_db'],['a_pg','t_api']]},
    {row:5,edges:[['t_iam','i_wp1'],['t_esb','i_wp2'],['t_db','i_wp3'],['t_api','i_wp4']]}];
  function pathFor(a,b){
    const A=pos[a],Bp=pos[b],w=G.colW,h=G.bH;
    if(A.row===Bp.row){
      if(Math.abs(A.col-Bp.col)===1){
        const toLeft=Bp.x<A.x, x1=toLeft?A.x:A.x+w, x2=toLeft?Bp.x+w+4:Bp.x-4, y=A.y+h/2;
        return `M${x1},${y} L${x2},${y}`;
      }
      const x1=A.x+w/2,x2=Bp.x+w/2,y=A.y;
      return `M${x1},${y} C${x1},${y-52} ${x2},${y-52} ${x2},${y-4}`;
    }
    const x1=A.x+w/2,y1=A.y+h,x2=Bp.x+w/2,y2=Bp.y-4,m=(y2-y1)*.55;
    return `M${x1},${y1} C${x1},${y1+m} ${x2},${y2-m} ${x2},${y2}`;
  }
  const hotG=$('hotW'), anchG=$('anchW');
  function activeBand(row){ document.querySelectorAll('.band').forEach((b,i)=>b.classList.toggle('active',i===row)); }
  return {
    key:'with', N:STEPS.length,
    build(){
      const t=L(), bands=$('bands'); bands.innerHTML='';
      LAYERS.forEach((ly,i)=>{
        const d=document.createElement('div'); d.className='band';
        d.style.cssText=`left:${mx(56,1400)}px;top:${G.y0+i*G.rowStep}px;background:${ly.fill};--c:${ly.c}`;
        d.innerHTML=`<div class="lbl"><b>${t.layers[i][0]}</b><small>${t.layers[i][1]}</small></div>`;
        bands.appendChild(d);
      });
      const blocks=$('blocksW'); blocks.innerHTML='';
      B.forEach(([id,row,col])=>{
        const x=mx(G.bx0+col*G.colStep,G.colW), y=G.y0+row*G.rowStep+G.bTop;
        pos[id]={x,y,row,col}; blocks.appendChild(blockEl('w-',id,x,y,''));
      });
      const fg=$('faintW'); fg.innerHTML='';
      FAINT.forEach(([a,b])=>addPath(fg,pathFor(a,b),'url(#ahF)'));
    },
    clear(){
      $('blocksW').querySelectorAll('.blk').forEach(b=>b.classList.remove('hit','show','pulse'));
      hotG.innerHTML=''; anchG.innerHTML=''; activeBand(-1);
    },
    focus(i){ activeBand(i<0?-1:STEPS[i].row); },
    apply(i){
      const S=STEPS[i];
      if(S.pre) mark('w-',S.pre,'hit');
      S.edges.forEach(([a,b])=>{ addPath(hotG,pathFor(a,b),'url(#ahH)'); mark('w-',b,'hit'); });
    },
    async animate(i,token){
      const S=STEPS[i];
      if(S.pre){ mark('w-',S.pre,'hit',true); await sleep(900); if(token!==run) return false; }
      await Promise.all(S.edges.map(([a,b],k)=>sleep(k*120).then(()=>token===run&&travel(hotG,anchG,pathFor(a,b),1300,token,'url(#ahH)').then(ok=>{ if(ok) mark('w-',b,'hit',true); }))));
      return token===run;
    },
    log(i){
      const S=STEPS[i], t=L();
      return {c:LAYERS[S.row].c,label:t.layers[S.row][0],detail:t.with.steps[i][1],em:new Set(S.edges.map(e=>e[1])).size+(S.pre?1:0)};
    },
    result(){
      const v=$('vWith');
      return [v.querySelectorAll('.blk.hit').length, v.querySelectorAll('.blk.isnew.show').length, v.querySelectorAll('[id^="w-i_wp"].show').length];
    }
  };
})();

/* =================== SCENARIO: WITHOUT EA =================== */
const WO=(function(){
  const BW=170,BH=70,GAP=14;
  const ICON={
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    deck:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/>',
    policy:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    proc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    xls:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14h18M9 4v16"/>',
    contract:'<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 17l2-1 2 1 2-1"/>',
    visio:'<rect x="9" y="3" width="6" height="5"/><rect x="3" y="16" width="6" height="5"/><rect x="15" y="16" width="6" height="5"/><path d="M12 8v4M6 16v-4h12v4"/>',
    heads:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'};
  const SILOS=[
    {k:'deck',x:60,y:186,cols:2,ids:['m_drv','m_goal','s_svc','s_ret']},
    {k:'mail',x:470,y:250,cols:2,ids:['m_law','b_aud','a_risk']},
    {k:'policy',x:884,y:186,cols:3,ids:['m_pri','m_priv','s_ana']},
    {k:'xls',x:1060,y:340,cols:2,ids:['a_core','a_crm','a_portal','a_md']},
    {k:'proc',x:90,y:470,cols:3,ids:['b_call','b_onb','b_file','b_obj','s_reg']},
    {k:'contract',x:720,y:500,cols:1,ids:['a_pg','s_col','b_pay']},
    {k:'heads',x:980,y:600,cols:2,ids:['s_risk','t_api','i_prog','i_base']},
    {k:'visio',x:130,y:740,cols:3,ids:['t_net','t_cloud','t_iam','t_db','t_esb']}];
  const NOTES=[[738,826,-3],[1010,836,2],[1240,850,-2]];
  const STEPS=[
    {pre:'m_law',silos:['mail'],segs:[]},
    {from:'m_law',silos:['policy','deck'],segs:[['m_priv','dead'],['m_pri','dead'],['m_goal','hit']]},
    {from:'m_goal',silos:['proc','deck'],segs:[['b_call','dead'],['s_svc','dead'],['b_file','hit'],['s_ret','hit']]},
    {from:'s_ret',silos:['xls'],segs:[['a_crm','dead'],['a_core','hit'],['a_portal','hit']]},
    {from:'a_portal',silos:['visio','heads'],segs:[['t_net','dead'],['t_cloud','dead'],['i_prog','dead']]},
    {from:'i_prog',silos:['contract'],segs:[['a_pg','hit'],['s_col','hit']]}];
  const MISSED=['s_reg','s_risk','b_onb','b_aud','b_pay','a_md','a_risk','t_iam','t_esb','t_db','t_api'];
  const pos={};
  const hotG=$('hotN'), anchG=$('anchN');
  let area;
  const ctr=id=>({x:pos[id].x+BW/2,y:pos[id].y+BH/2});
  const clampX=x=>Math.max(area.x0+20,Math.min(area.x1-20,x)), clampY=y=>Math.max(190,Math.min(960,y));
  function wander(a,b){
    const r=rng(hashStr(a+'>'+b+lang)), A=ctr(a), Bp=ctr(b);
    const P=(x,y)=>[clampX(x),clampY(y)];
    const M=P((A.x+Bp.x)/2+(r()-.5)*520,(A.y+Bp.y)/2+(r()-.5)*360);
    const c1=P(A.x+(r()-.5)*420,A.y+(r()-.5)*320);
    const c2=P(M[0]+(r()-.5)*300,M[1]+(r()-.5)*240);
    const c3=P(2*M[0]-c2[0],2*M[1]-c2[1]);
    const c4=P(Bp.x+(r()-.5)*360,Bp.y+(r()-.5)*280);
    return `M${A.x},${A.y} C${c1} ${c2} ${M} C${c3} ${c4} ${Bp.x},${Bp.y}`;
  }
  function activeSilo(keys){ document.querySelectorAll('.silo').forEach(s=>s.classList.toggle('active',keys.includes(s.dataset.k))); }
  return {
    key:'without', N:STEPS.length,
    build(){
      const t=L(), tx=t.without;
      area={x0:mx(56,1400),x1:mx(56,1400)+1400};
      const silos=$('silos'); silos.innerHTML='';
      const blocks=$('blocksN'); blocks.innerHTML='';
      SILOS.forEach(s=>{
        const rows=Math.ceil(s.ids.length/s.cols), w=s.cols*BW+(s.cols-1)*GAP+28, h=40+rows*BH+(rows-1)*GAP+14;
        const d=document.createElement('div'); d.className='silo'; d.dataset.k=s.k;
        d.style.cssText=`left:${mx(s.x,w)}px;top:${s.y}px;width:${w}px;height:${h}px`;
        d.innerHTML=`<div class="sh"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[s.k]}</svg>${tx.silos[s.k]}</div>`;
        silos.appendChild(d);
        s.ids.forEach((id,k)=>{
          const jx=((k*37+s.x)%11)-5, jy=((k*53+s.y)%9)-4;
          const x=mx(s.x+14+(k%s.cols)*(BW+GAP)+jx,BW), y=s.y+40+Math.floor(k/s.cols)*(BH+GAP)+jy;
          pos[id]={x,y}; blocks.appendChild(blockEl('n-',id,x,y,' sm'));
        });
      });
      NOTES.forEach(([x,y,r],i)=>{
        const n=document.createElement('div'); n.className='sticky';
        n.style.cssText=`left:${mx(x,210)}px;top:${y}px;transform:rotate(${lang==='ar'?-r:r}deg)`;
        n.textContent=tx.notes[i]; silos.appendChild(n);
      });
      // spaghetti
      const sg=$('spagN'); sg.innerHTML='';
      const ids=Object.keys(pos), r=rng(20261101);
      for(let k=0;k<46;k++){
        const a=ids[Math.floor(r()*ids.length)], b=ids[Math.floor(r()*ids.length)]; if(a===b) continue;
        const A=ctr(a),Bp=ctr(b);
        const d=`M${A.x},${A.y} C${clampX(A.x+(r()-.5)*600)},${clampY(A.y+(r()-.5)*500)} ${clampX(Bp.x+(r()-.5)*600)},${clampY(Bp.y+(r()-.5)*500)} ${Bp.x},${Bp.y}`;
        const p=addPath(sg,d); if(r()<.45) p.setAttribute('stroke-dasharray',r()<.5?'6 5':'2 4');
        if(k%5===0){
          const len=p.getTotalLength(), pt=p.getPointAtLength(len*(.3+r()*.4));
          const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',pt.x); c.setAttribute('cy',pt.y); c.setAttribute('r',11); sg.appendChild(c);
          const tq=document.createElementNS(NS,'text'); tq.setAttribute('x',pt.x); tq.setAttribute('y',pt.y+1); tq.textContent='?'; sg.appendChild(tq);
        }
      }
    },
    clear(){
      $('blocksN').querySelectorAll('.blk').forEach(b=>b.classList.remove('hit','show','pulse','dead','missed'));
      hotG.innerHTML=''; anchG.innerHTML=''; activeSilo([]);
    },
    focus(i){ activeSilo(i<0?[]:STEPS[i].silos); },
    apply(i){
      const S=STEPS[i];
      if(S.pre) mark('n-',S.pre,'hit');
      let prev=S.from;
      S.segs.forEach(([b,kind])=>{ addPath(hotG,wander(prev,b)); mark('n-',b,kind); prev=b; });
    },
    async animate(i,token){
      const S=STEPS[i];
      if(S.pre){ mark('n-',S.pre,'hit',true); await sleep(900); return token===run; }
      let prev=S.from;
      for(const [b,kind] of S.segs){
        const ok=await travel(hotG,anchG,wander(prev,b),1500,token);
        if(!ok||token!==run) return false;
        mark('n-',b,kind,true); prev=b;
        await sleep(kind==='dead'?450:250); if(token!==run) return false;
      }
      return true;
    },
    log(i){
      const s=L().without.steps[i];
      return {c:'#8A94A6',label:s[1],detail:s[2],em:s[3],time:true};
    },
    result(){
      MISSED.forEach(id=>mark('n-',id,'missed'));
      activeSilo([]);
      return [$('vWithout').querySelectorAll('.blk.hit:not(.isnew)').length, MISSED.length, 6];
    }
  };
})();

const SC={with:W,without:WO};
const sc=()=>SC[view];
const tx=()=>L()[view];

/* =================== ENGINE =================== */
function setNarr(pill,html,fade){
  const el=$('narrTxt'), tok=run;
  const apply=()=>{ $('stepPill').textContent=pill; el.innerHTML=html; el.style.opacity=1; };
  if(!fade){ apply(); return; }
  el.style.opacity=0; setTimeout(()=>{ if(tok===run) apply(); },180*T);
}
function addLog(i,anim){
  const e=sc().log(i);
  const li=document.createElement('li'); if(anim) li.className='anim';
  li.style.setProperty('--c',e.c);
  li.innerHTML=`<i></i><div><b class="caps">${e.label}</b><span>${e.detail}</span></div><em${e.time?' class="t"':''}>${e.em}</em>`;
  $('log').appendChild(li);
}
function showResult(){
  sc().focus(-1);
  const r=sc().result();
  $('t1').textContent=r[0]; $('t2').textContent=r[1]; $('t3').textContent=r[2];
  $('totals').className='totals show'+(view==='without'?' bad':'');
  $('t2').className=view==='without'?'m':'';
  setNarr(L().pill.result,tx().final,false);
}
function stepNarr(i,fade){ setNarr(L().pill.step(i+1,sc().N),tx().steps[i][0],fade); }

function renderTo(n){
  run++; busy=false; playing=false; cur=n;
  stage.classList.add('noanim');
  sc().clear(); $('log').innerHTML=''; $('totals').className='totals';
  for(let i=0;i<n;i++){ sc().apply(i); addLog(i,false); }
  if(n===0) setNarr(L().pill.asis,tx().asis,false);
  else if(n===sc().N) showResult();
  else { sc().focus(n-1); stepNarr(n-1,false); }
  void stage.offsetWidth; stage.classList.remove('noanim');
  ui();
}
async function animateNext(token){
  const i=cur; busy=true; cur=i+1; ui();
  sc().focus(i); stepNarr(i,true);
  await sleep(450); if(token!==run) return false;
  if(!await sc().animate(i,token)) return false;
  addLog(i,true);
  busy=false;
  if(cur===sc().N){ await sleep(500); if(token!==run) return false; showResult(); }
  ui(); return true;
}
async function play(){
  if(cur===sc().N) renderTo(0);
  if(busy) renderTo(cur);
  playing=true; const token=++run; ui();
  while(cur<sc().N){
    if(!await animateNext(token)) return;
    if(cur<sc().N){ await sleep(800); if(token!==run) return; }
  }
  playing=false; ui();
}
function pause(){ renderTo(cur); }
function togglePlay(){ playing?pause():play(); }
async function next(){
  if(playing||busy){ renderTo(cur); return; }
  if(cur>=sc().N) return;
  await animateNext(++run);
}
function prev(){ renderTo(Math.max(0,cur-1)); }
function reset(){ renderTo(0); }

function setHash(){
  try{ history.replaceState(null,'','#'+(lang==='ar'?'ar-':'')+view); }catch(e){}
}
function buildAll(){
  const t=L();
  document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  $('eyebrow').textContent=t.eyebrow; $('langBtn').textContent=t.lang;
  $('tabWithoutL').textContent=t.tabs[0]; $('tabWithL').textContent=t.tabs[1];
  $('prevBtn').textContent=t.prev; $('nextBtn').textContent=t.next;
  W.build(); WO.build();
}
function showView(){
  const x=tx();
  $('vWith').classList.toggle('hide',view!=='with'); $('vWithout').classList.toggle('hide',view!=='without');
  $('tabWith').setAttribute('aria-selected',view==='with'); $('tabWithout').setAttribute('aria-selected',view==='without');
  $('title').innerHTML=x.title; $('pTitle').textContent=x.pTitle; $('intro').textContent=x.intro;
  const cls=view==='with'?['','h','n','a']:['','h','d','m'];
  $('legend').innerHTML=x.legend.map((l,k)=>`<span><i class="${cls[k]}"></i>${l}</span>`).join('');
  $('l1').textContent=x.totals[0]; $('l2').textContent=x.totals[1]; $('l3').textContent=x.totals[2];
}
function setView(v){
  if(v===view) return;
  W.clear(); WO.clear();
  view=v; setHash(); showView(); renderTo(0);
}
function setLang(l){
  lang=l; const keep=cur; run++; setHash();
  buildAll(); showView(); renderTo(keep);
}
function ui(){
  const t=L(), x=tx(), N=sc().N;
  stage.classList.toggle('changing',cur>0);
  $('intro').classList.toggle('hide',cur>0);
  const chip=$('chip');
  if(cur===0&&!busy){chip.textContent=x.chip[0];chip.className='chip caps';}
  else if(cur===N&&!busy){chip.textContent=x.chip[2];chip.className='chip caps '+(view==='without'?'warn':'done');}
  else {chip.textContent=x.chip[1];chip.className='chip caps live';}
  $('narr').classList.toggle('live',cur>0);
  $('playBtn').textContent=playing?t.pause:(cur===N?t.replay:t.play);
  $('prevBtn').disabled=cur===0&&!busy;
  $('nextBtn').disabled=cur===N&&!busy;
  $('hint').textContent=t.hint;
}

const stop=e=>e.stopPropagation();
$('playBtn').addEventListener('click',e=>{stop(e);togglePlay();});
$('nextBtn').addEventListener('click',e=>{stop(e);next();});
$('prevBtn').addEventListener('click',e=>{stop(e);prev();});
$('langBtn').addEventListener('click',e=>{stop(e);setLang(lang==='en'?'ar':'en');});
$('tabWith').addEventListener('click',e=>{stop(e);setView('with');});
$('tabWithout').addEventListener('click',e=>{stop(e);setView('without');});
$('panel').addEventListener('click',stop);
stage.addEventListener('click',()=>next());
addEventListener('keydown',e=>{
  const k=e.key;
  if(['ArrowRight','ArrowDown','PageDown','Enter'].includes(k)){ e.preventDefault(); next(); }
  else if(k==='ArrowLeft'||k==='ArrowUp'||k==='PageUp'){ e.preventDefault(); prev(); }
  else if(k===' '){ e.preventDefault(); togglePlay(); }
  else if(k==='r'||k==='R'){ reset(); }
  else if(k==='l'||k==='L'){ setLang(lang==='en'?'ar':'en'); }
  else if(k==='1'){ setView('without'); }
  else if(k==='2'){ setView('with'); }
  else if(k==='f'||k==='F'){
    try{ if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); else document.exitFullscreen(); }catch(err){}
  }
});
buildAll(); showView(); renderTo(0);
})();
