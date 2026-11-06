/* GTA EA Awareness Hub - Knowledge Base articles (generated). */
window.KB_ARTICLES = [
 {
  "id": "what-is-ea",
  "title": "What Enterprise Architecture Is (and Is Not)",
  "cat": "Foundations",
  "level": "Foundation",
  "tags": [
   "enterprise architecture",
   "definition",
   "purpose",
   "strategy execution"
  ],
  "summary": "Enterprise Architecture is the discipline that describes how an organisation is structured and how it must change, so that strategy, operations and technology investments stay coherent.",
  "minutes": 6,
  "body": "<p>Enterprise Architecture (EA) is the practice of describing the fundamental structure of an enterprise &mdash; its capabilities, processes, information, applications and technology &mdash; and of guiding how that structure changes over time. Its purpose is not to produce diagrams; it is to make change <strong>deliberate, coherent and traceable</strong> to strategy.</p>\n<h4>Two complementary roles</h4>\n<div class=\"grid2\">\n<div class=\"mini\"><h5>EA as a description</h5><p>A set of models and views of the current (baseline) and future (target) states, shared across the organisation so that people reason from the same facts: which systems hold taxpayer data, which processes depend on them, which contracts expire next year.</p></div>\n<div class=\"mini\"><h5>EA as a management discipline</h5><p>Principles, standards, reviews and roadmaps that steer investment decisions, so that hundreds of individual projects add up to the intended target state rather than to accidental complexity.</p></div>\n</div>\n<h4>What EA is for</h4>\n<ul>\n<li><strong>Strategy translation</strong> &mdash; turning objectives into capability changes, then into funded work packages.</li>\n<li><strong>Portfolio rationalisation</strong> &mdash; reducing duplicate applications, data stores and integration paths.</li>\n<li><strong>Risk reduction</strong> &mdash; exposing single points of failure, unsupported technology and unmanaged data flows.</li>\n<li><strong>Interoperability</strong> &mdash; agreeing common data definitions, APIs and identity so systems can work together.</li>\n<li><strong>Faster, safer delivery</strong> &mdash; reusable building blocks and pre-approved patterns shorten design time.</li>\n</ul>\n<h4>Common misconceptions</h4>\n<table class=\"tbl\"><thead><tr><th>Misconception</th><th>Reality</th></tr></thead><tbody>\n<tr><td>EA is an IT documentation exercise.</td><td>EA spans business, data, application and technology; its primary customers are decision-makers.</td></tr>\n<tr><td>EA means a big upfront design.</td><td>Modern EA is iterative: just enough architecture, just in time, with clear guardrails.</td></tr>\n<tr><td>EA is owned by the EA team.</td><td>The EA team curates; business owners, product teams and data stewards own their parts of the architecture.</td></tr>\n<tr><td>The repository is the deliverable.</td><td>The deliverable is better decisions. The repository is only valuable if it is current and used.</td></tr>\n</tbody></table>\n<div class=\"callout note\"><b>Note</b> The Open Group defines architecture in two senses: a formal description of a system, and the structure of components, their inter-relationships, and the principles and guidelines governing their design and evolution over time. Keep both meanings in mind &mdash; the thing itself and the description of it.</div>\n<div class=\"callout gta\"><b>At GTA</b> A typical EA question is: &ldquo;If we introduce a new excise-tax product, which capabilities change, which systems are touched, and which data must be shared with other government entities?&rdquo; EA should be able to answer that with traceable models rather than with tribal knowledge.</div>",
  "related": [
   "bdat-domains",
   "ea-levels-and-scope",
   "iso-42010",
   "ea-value-maturity"
  ],
  "refs": [
   {
    "t": "The TOGAF Standard (The Open Group)",
    "u": "https://www.opengroup.org/togaf"
   }
  ]
 },
 {
  "id": "iso-42010",
  "title": "Architecture vs Architecture Description (ISO/IEC/IEEE 42010:2022)",
  "cat": "Foundations",
  "level": "Practitioner",
  "tags": [
   "iso 42010",
   "viewpoints",
   "views",
   "stakeholders",
   "concerns"
  ],
  "summary": "ISO/IEC/IEEE 42010:2022 separates the architecture of an entity of interest from the architecture description (AD) that expresses it, and defines how stakeholders, concerns, viewpoints, views and model kinds fit together.",
  "minutes": 8,
  "diagram": "iso42010",
  "body": "<p>ISO/IEC/IEEE 42010:2022 (second edition, November 2022), <em>Software, systems and enterprise &mdash; Architecture description</em>, is the vocabulary that most frameworks, including TOGAF and ArchiMate, implicitly rely on. Its central idea is simple but often ignored: the <strong>architecture</strong> of an entity of interest exists whether or not anyone writes it down; an <strong>architecture description (AD)</strong> is a work product that expresses it for particular stakeholders.</p>\n<h4>Key terms</h4>\n<dl class=\"defs\">\n<dt>Entity of interest</dt><dd>The thing whose architecture is described: a system, a software product, a system of systems, or an enterprise. The 2022 edition widened the scope from &ldquo;systems&rdquo; to include enterprises explicitly.</dd>\n<dt>Stakeholder</dt><dd>An individual, group or organisation with an interest in the entity, e.g. the Taxpayer Service director, the security officer, an operations team.</dd>\n<dt>Concern</dt><dd>A matter of interest to a stakeholder: cost, availability, data privacy, ease of filing, auditability.</dd>\n<dt>Architecture viewpoint</dt><dd>A specification of conventions for constructing and using a view to frame specific concerns: which model kinds, notations, analysis methods.</dd>\n<dt>Architecture view</dt><dd>An information item that expresses the architecture from the perspective of specific concerns, governed by a viewpoint.</dd>\n<dt>Model kind</dt><dd>Conventions for one type of model, e.g. a capability map, a data-flow diagram, a deployment diagram.</dd>\n<dt>AD element</dt><dd>Any construct in an AD: stakeholders, concerns, viewpoints, views, models, decisions, rationale and correspondences.</dd>\n<dt>Correspondence</dt><dd>A relation between AD elements, used to express consistency or traceability (e.g. every application in the deployment view must appear in the application portfolio view).</dd>\n<dt>Architecture decision and rationale</dt><dd>Recorded choices with their justification, alternatives and consequences.</dd>\n</dl>\n<h4>What the standard specifies</h4>\n<p>It sets requirements for four kinds of things: architecture descriptions, <strong>architecture description frameworks</strong> (e.g. TOGAF content framework, NAF), <strong>architecture description languages</strong> (e.g. ArchiMate, SysML), and the viewpoints and model kinds those frameworks and languages provide. It does not prescribe a method or a notation.</p>\n<h4>Practical checklist for any AD</h4>\n<ol>\n<li>Identify the entity of interest and its boundary.</li>\n<li>List stakeholders and their concerns explicitly; every concern must be framed by at least one viewpoint.</li>\n<li>Declare the viewpoints used (or reference them from a framework) before drawing views.</li>\n<li>State correspondence rules between views and check them.</li>\n<li>Record significant decisions with rationale (see the ADR template).</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Drawing &ldquo;the architecture diagram&rdquo; without naming its audience. One diagram cannot answer a CFO, a network engineer and a data protection officer at once; that is exactly why viewpoints exist.</div>\n<div class=\"callout gta\"><b>At GTA</b> For a refunds modernisation, a viewpoint list might include: capability impact (for business owners), information flow and classification (for data governance and security), integration (for developers), and deployment and resilience (for infrastructure). Each is a separate view of one architecture.</div>",
  "related": [
   "what-is-ea",
   "archimate-viewpoints-conventions",
   "stakeholder-management",
   "tpl-adr"
  ],
  "refs": [
   {
    "t": "ISO/IEC/IEEE 42010:2022 (ISO catalogue)",
    "u": "https://www.iso.org/standard/74393.html"
   },
   {
    "t": "ISO/IEC/IEEE 42010 information site",
    "u": "http://www.iso-architecture.org/42010/"
   }
  ]
 },
 {
  "id": "bdat-domains",
  "title": "The BDAT Architecture Domains",
  "cat": "Foundations",
  "level": "Foundation",
  "tags": [
   "business architecture",
   "data architecture",
   "application architecture",
   "technology architecture",
   "domains"
  ],
  "summary": "EA is conventionally partitioned into Business, Data, Application and Technology (BDAT) domains, with security and governance as cross-cutting concerns.",
  "minutes": 6,
  "diagram": "ea-domains",
  "body": "<p>Most frameworks, including TOGAF, partition architecture work into four domains. The partitioning is a convenience for analysis and ownership; the value comes from the <strong>relationships across</strong> domains.</p>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Core question</th><th>Typical content</th><th>Typical artifacts</th></tr></thead><tbody>\n<tr><td><strong>Business</strong></td><td>What does the organisation do and how?</td><td>Capabilities, value streams, processes, organisation units, roles, business services, policies</td><td>Capability map, value stream map, organisation/actor catalog, process models</td></tr>\n<tr><td><strong>Data</strong></td><td>What information is needed, who owns it, how is it governed?</td><td>Data entities, conceptual/logical models, master and reference data, classification, lineage</td><td>Data entity catalog, data entity/business function matrix, conceptual data model</td></tr>\n<tr><td><strong>Application</strong></td><td>Which systems support the business and how do they interact?</td><td>Application components, services, interfaces, integrations, lifecycle status</td><td>Application portfolio catalog, application communication diagram, interface catalog</td></tr>\n<tr><td><strong>Technology</strong></td><td>What platforms host and connect the applications?</td><td>Infrastructure, platforms, networks, hosting models, standards</td><td>Technology standards catalog, environments and locations diagram, platform decomposition</td></tr>\n</tbody></table>\n<h4>Cross-cutting concerns</h4>\n<ul>\n<li><strong>Security</strong> &mdash; classification, identity, controls and threat exposure apply in every domain; TOGAF addresses it through a dedicated Series Guide rather than as a fifth phase.</li>\n<li><strong>Governance</strong> &mdash; principles, standards and compliance reviews constrain all domains.</li>\n<li><strong>Interoperability</strong> &mdash; especially important in government, where data sharing crosses organisational boundaries.</li>\n</ul>\n<h4>Traceability across domains</h4>\n<p>A well-formed repository lets you navigate: <em>strategic objective &rarr; capability &rarr; process &rarr; data entity &rarr; application &rarr; platform</em>. Breaks in this chain are where waste and risk hide: applications that support no capability, capabilities with no system support, data entities with no owner.</p>\n<h4>BDAT and the Qatar GEA dimensions</h4>\n<p>The Qatar GEA uses the same four layers under different names &mdash; Business (BRM), Information (IRM), Application (ARM) and Infrastructure (TRM) &mdash; and makes Governance, Security Management and Service Management explicit cross-cutting dimensions. GTA artefacts should therefore be organised so that each BDAT domain maps one-to-one to a GEA reference model and its taxonomy.</p>\n<div class=\"callout note\"><b>Note</b> TOGAF groups Data and Application into a single ADM phase, C (Information Systems Architectures), but treats them as separate architecture domains with their own deliverables.</div>\n<div class=\"callout gta\"><b>At GTA</b> Taking &ldquo;Refunds &amp; Credits&rdquo; as an example: the business domain describes the refund value stream and approval roles; the data domain defines the refund claim, bank account and taxpayer entities and their classification; the application domain shows the tax administration system, payment interfaces and case management; the technology domain shows where these run and how they are secured.</div>",
  "related": [
   "what-is-ea",
   "capability-mapping",
   "qatar-gea",
   "technology-reference-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "ea-levels-and-scope",
  "title": "Levels of Architecture: Strategic, Segment, Capability, Solution",
  "cat": "Foundations",
  "level": "Foundation",
  "tags": [
   "scope",
   "solution architecture",
   "segment architecture",
   "roles"
  ],
  "summary": "Architecture work is done at different levels of breadth and detail. Knowing which level you are working at determines the right depth, audience and governance.",
  "minutes": 7,
  "body": "<p>TOGAF describes the Architecture Landscape at three levels of granularity &mdash; <strong>Strategic</strong>, <strong>Segment</strong> and <strong>Capability</strong> architectures. In practice, organisations add a fourth, delivery-facing level: <strong>Solution</strong> architecture. Each level has a different horizon, audience and level of detail.</p>\n<table class=\"tbl\"><thead><tr><th>Level</th><th>Scope</th><th>Horizon</th><th>Audience</th><th>Example output</th></tr></thead><tbody>\n<tr><td>Strategic</td><td>Whole enterprise</td><td>3&ndash;5 years</td><td>Executives, steering committees</td><td>Target-state vision, capability map with heat, principles, multi-year roadmap</td></tr>\n<tr><td>Segment</td><td>A line of business or portfolio (e.g. all excise tax)</td><td>1&ndash;3 years</td><td>Portfolio owners, programme boards</td><td>Segment target architecture, transition architectures, investment cases</td></tr>\n<tr><td>Capability</td><td>One capability increment (e.g. risk scoring)</td><td>6&ndash;18 months</td><td>Programme and product leads</td><td>Detailed target design, building blocks, work packages</td></tr>\n<tr><td>Solution</td><td>One system or project</td><td>Project lifetime</td><td>Delivery teams, TRB</td><td>Solution Architecture Document, ADRs, NFRs, interface specs</td></tr>\n</tbody></table>\n<h4>Architecture roles compared</h4>\n<dl class=\"defs\">\n<dt>Enterprise architect</dt><dd>Breadth over depth. Owns principles, target states, roadmaps and the coherence of the portfolio. Asks &ldquo;should we build this at all, and where does it fit?&rdquo;</dd>\n<dt>Solution architect</dt><dd>Designs a specific solution end-to-end across business, data, application and technology, within enterprise guardrails. Asks &ldquo;how do we deliver this requirement well?&rdquo;</dd>\n<dt>Technical / domain architect</dt><dd>Deep specialist in one area &mdash; security, data, integration, cloud, network. Asks &ldquo;what is the right design and configuration for this component?&rdquo;</dd>\n<dt>Business architect</dt><dd>Models capabilities, value streams and organisation; connects strategy to change initiatives.</dd>\n</dl>\n<h4>Choosing the right level</h4>\n<ul>\n<li>If the decision affects more than one segment or sets a precedent, escalate to enterprise level (principle, standard or reference architecture).</li>\n<li>If it affects one solution only and stays within existing standards, decide at solution level and record an ADR.</li>\n<li>If a solution needs to deviate from a standard, it becomes a governance matter (waiver or dispensation).</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Enterprise architects drifting into detailed solution design for one project, leaving the enterprise view stale; or solution architects making enterprise-level decisions (e.g. a new integration platform) inside a single project.</div>\n<div class=\"callout gta\"><b>At GTA</b> &ldquo;Become a National Hub for Economic and Financial Data&rdquo; is a strategic-level objective; a data-sharing segment architecture would define the target for all outbound data exchanges; a capability architecture would detail the data-sharing platform increment; and each new exchange with a partner entity would get a solution-level design.</div>",
  "related": [
   "what-is-ea",
   "enterprise-continuum-repository",
   "tpl-solution-architecture-document",
   "arb-operating-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "ea-value-maturity",
  "title": "Measuring EA Value and Maturity",
  "cat": "Foundations",
  "level": "Practitioner",
  "tags": [
   "maturity",
   "kpi",
   "metrics",
   "value",
   "capability"
  ],
  "summary": "EA earns its place by measurable outcomes. Combine outcome metrics, practice metrics and a maturity model to show progress and direct improvement.",
  "minutes": 8,
  "diagram": "maturity-model",
  "body": "<p>EA functions are often challenged with &ldquo;what value do you add?&rdquo;. The answer must be expressed in outcomes the organisation already cares about &mdash; cost, risk, speed and service quality &mdash; supported by evidence from the repository and governance logs.</p>\n<h4>Three families of metrics</h4>\n<table class=\"tbl\"><thead><tr><th>Family</th><th>Example metric</th><th>How to measure</th></tr></thead><tbody>\n<tr><td><strong>Outcome</strong></td><td>Application portfolio reduction</td><td>Count of active applications and annual run cost, year on year</td></tr>\n<tr><td>Outcome</td><td>Share of spend on unsupported technology</td><td>Technology lifecycle status joined with cost data</td></tr>\n<tr><td>Outcome</td><td>Reuse rate of approved building blocks</td><td>Solutions using shared services (identity, notification, payment) / total new solutions</td></tr>\n<tr><td><strong>Practice</strong></td><td>TRB cycle time</td><td>Median days from complete submission to decision</td></tr>\n<tr><td>Practice</td><td>Repository currency</td><td>% of applications with owner, lifecycle status and review date within 12 months</td></tr>\n<tr><td>Practice</td><td>Waivers expired without remediation</td><td>Count from the dispensation register</td></tr>\n<tr><td><strong>Adoption</strong></td><td>Projects engaging EA before funding</td><td>% of initiatives with an architecture review at concept stage</td></tr>\n<tr><td>Adoption</td><td>Repository usage</td><td>Unique users / queries per month outside the EA team</td></tr>\n</tbody></table>\n<h4>Maturity models</h4>\n<p>Maturity models describe the capability of the EA practice on an ordinal scale, typically five levels. Well-known examples include the US Department of Commerce ACMM (Architecture Capability Maturity Model), NASCIO&rsquo;s EA maturity model, and the maturity guidance referenced in the TOGAF EA Capability material.</p>\n<ol>\n<li><strong>Initial</strong> &mdash; ad hoc, person-dependent; architecture happens inside projects.</li>\n<li><strong>Developing / Repeatable</strong> &mdash; basic method, some templates, partial inventory.</li>\n<li><strong>Defined</strong> &mdash; documented framework, TRB operating, repository with agreed metamodel.</li>\n<li><strong>Managed</strong> &mdash; metrics collected; architecture informs portfolio and funding decisions.</li>\n<li><strong>Optimising</strong> &mdash; continuous improvement; architecture embedded in planning and delivery pipelines.</li>\n</ol>\n<p>Assess across dimensions rather than producing a single number: method, governance, repository and tooling, skills, business participation, links to portfolio and investment management, communication.</p>\n<h4>The GEA EA Maturity Model (EAMM) for Qatar</h4>\n<p>For Qatari agencies the reference scale is the GEA EAMM (Governance Model, Appendix 2), a customisation of the US Department of Commerce ACMM with six levels:</p>\n<table class=\"tbl\"><thead><tr><th>Level</th><th>Name</th><th>Description</th></tr></thead><tbody>\n<tr><td>0</td><td>None</td><td>No enterprise architecture</td></tr>\n<tr><td>1</td><td>Initial</td><td>Informal EA process under way</td></tr>\n<tr><td>2</td><td>Under Development</td><td>EA practice under development: basic documented process, baseline and target identified, standards exist</td></tr>\n<tr><td>3</td><td>Defined</td><td>Detailed reference models, catalogues, methods and standards; gap analysis and migration plan; architecture board operational; compliance reviews started</td></tr>\n<tr><td>4</td><td>Managed</td><td>Managed and measured practice; senior management involved in reviews; governance of all IT investments</td></tr>\n<tr><td>5</td><td>Optimized</td><td>Continuous improvement; architecture used for every IT decision; EA value built into investment management</td></tr>\n</tbody></table>\n<p>Levels are assessed on seven characteristics: EA framework; development method; business requirements process; stakeholder participation; enterprise continuum, tools and repository; governance; benefits realisation. The GEA self-assessment score also maps to maturity: above 85 = 4, 60&ndash;85 = 3, 45&ndash;60 = 2, below 45 = 0 or 1.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Using maturity as the goal. A level-4 score with no measurable outcome change is a vanity metric. Use maturity to identify the next practical improvement, then report outcome metrics.</div>\n<div class=\"callout gta\"><b>At GTA</b> The April 2025 baseline assessed Enterprise Architecture Management at the lowest level of its four-point scale, with core architecture blueprints absent &mdash; broadly GEA EAMM level 0&ndash;1. A realistic first target is EAMM level 2, then level 3 once the Technical Review Board operates and catalogues are published. Pair maturity with outcome metrics such as the &ldquo;percentage of processes digitised or automated&rdquo; KPI in the refreshed strategy.</div>",
  "related": [
   "gea-governance",
   "gta-gea-readiness",
   "repository-governance",
   "ea-governance-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "frameworks-comparison",
  "title": "EA Frameworks Compared: TOGAF, Zachman, FEAF, DoDAF/MODAF/NAF, Gartner",
  "cat": "Foundations",
  "level": "Practitioner",
  "tags": [
   "frameworks",
   "zachman",
   "feaf",
   "naf",
   "togaf"
  ],
  "summary": "Frameworks differ in what they provide: a method, a taxonomy, a reference model set or a viewpoint catalogue. Most organisations combine them rather than choosing one.",
  "minutes": 8,
  "diagram": "zachman-grid",
  "body": "<p>No single framework covers everything. It helps to classify frameworks by what they actually give you: a <strong>process</strong> (how to do architecture), a <strong>taxonomy</strong> (how to organise descriptions), <strong>reference models</strong> (common vocabularies), or <strong>viewpoint sets</strong> (what to model for whom).</p>\n<table class=\"tbl\"><thead><tr><th>Framework</th><th>Primary nature</th><th>Strengths</th><th>Limitations</th></tr></thead><tbody>\n<tr><td><strong>TOGAF</strong> (The Open Group)</td><td>Method + content framework + capability guidance</td><td>Comprehensive ADM; widely known; large body of Series Guides; tool and certification ecosystem</td><td>Generic; requires tailoring; can be applied bureaucratically</td></tr>\n<tr><td><strong>Zachman Framework</strong></td><td>Ontology / classification schema</td><td>Rigorous 6&times;6 grid (What, How, Where, Who, When, Why &times; perspectives from executive to implementer); good for completeness checks</td><td>No method; says nothing about how to move from current to target state</td></tr>\n<tr><td><strong>FEAF</strong> (US Federal)</td><td>Reference models + planning approach for government</td><td>Consolidated reference models (performance, business, data, application, infrastructure, security) enable cross-agency comparison</td><td>US-government specific; reference models need localisation</td></tr>\n<tr><td><strong>DoDAF / MODAF / NAF</strong></td><td>Viewpoint and model catalogue (defence)</td><td>Precise viewpoints for capability, operational and system views; strong for systems-of-systems</td><td>Heavy; designed for defence acquisition</td></tr>\n<tr><td><strong>Qatar GEA</strong> (MoTC, now MCIT)</td><td>National reference models + standards + governance for Qatari agencies</td><td>Based on US-FEAF; BRM, IRM, ARM, TRM with taxonomies and rated standards; WoG shared services; self-assessment and maturity model; legally mandated (Resolution 18/2010)</td><td>No method of its own for developing architectures; standards lists date from c. 2018 and omit some modern API standards</td></tr>\n<tr><td><strong>Gartner approach</strong></td><td>Practitioner guidance, business-outcome driven</td><td>Pragmatic, focused on business outcomes and lightweight deliverables</td><td>Not an open standard; proprietary guidance</td></tr>\n</tbody></table>\n<h4>A common combination</h4>\n<ul>\n<li><strong>TOGAF ADM</strong> as the method, tailored to the organisation&rsquo;s planning cycle.</li>\n<li><strong>ArchiMate</strong> as the modelling language for the repository.</li>\n<li><strong>National reference models</strong> (in Qatar, the GEA reference models, taxonomies, standards and governance) for classification, compliance and comparability across entities.</li>\n<li><strong>C4</strong> and UML at solution level for software teams.</li>\n<li><strong>Zachman</strong> as a completeness checklist when reviewing an architecture description.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> NAF (NATO Architecture Framework) version 4 absorbed much of MODAF; organisations rarely start new work in MODAF today.</div>\n<div class=\"callout gta\"><b>At GTA</b> GEA compliance is mandatory for GTA, not optional. GEA supplies the <em>what</em> (taxonomies, standards, catalogues, governance bodies); TOGAF supplies the <em>how</em> (ADM, gap analysis, roadmaps); ArchiMate 3.x in Archi is the notation GEA itself uses. Tailor TOGAF to produce GEA artefacts rather than parallel ones.</div>",
  "related": [
   "togaf-10-structure",
   "qatar-gea",
   "gea-metamodel-archi",
   "tailoring-togaf-agile"
  ],
  "refs": [
   {
    "t": "The TOGAF Standard (The Open Group)",
    "u": "https://www.opengroup.org/togaf"
   },
   {
    "t": "Zachman International",
    "u": "https://www.zachman.com"
   }
  ]
 },
 {
  "id": "gta-strategy-to-solution",
  "title": "From GTA Strategy to Solutions: The Traceability Chain",
  "cat": "Qatar & GTA Context",
  "level": "Practitioner",
  "tags": [
   "gta",
   "strategy",
   "traceability",
   "objectives",
   "kpi"
  ],
  "summary": "How GTA's refreshed strategic objectives translate, through capabilities and work packages, into solutions and measurable KPIs.",
  "minutes": 8,
  "diagram": "traceability-chain",
  "body": "<p>The General Tax Authority was established by Emiri Decision No. 77 of 2018. Its refreshed strategy (June 2025) sets the vision of being <strong>a leading, trusted and innovative tax authority enabling Qatar&rsquo;s economic growth through transparency, service excellence and data-driven insights</strong>. EA&rsquo;s job is to make the path from that vision to individual systems explicit and traceable.</p>\n<h4>The chain</h4>\n<p><em>Vision &rarr; Strategic objective &rarr; Outcome / KPI &rarr; Capability (change) &rarr; Work package / initiative &rarr; Solution building blocks &rarr; Applications, data and platforms.</em></p>\n<h4>Illustrative mapping</h4>\n<table class=\"tbl\"><thead><tr><th>Strategic objective</th><th>Capabilities most affected</th><th>Example architecture response</th></tr></thead><tbody>\n<tr><td>Enhance Taxpayer Services and Satisfaction</td><td>Taxpayer registration, return filing, taxpayer support, guidance &amp; education</td><td>Pre-filled returns, omnichannel support with shared case history, consistent digital identity via the National Authentication System (NAS, a WoG shared service)</td></tr>\n<tr><td>Strengthen Compliance and Enforcement</td><td>Risk scoring, assessment &amp; verification, audit management</td><td>Risk engine fed by third-party data; audit case management integrated with assessment</td></tr>\n<tr><td>Support Business Growth and Economic Diversification</td><td>Guidance &amp; education, excise tax (incl. warehouse licensing), refunds &amp; credits</td><td>Faster refunds through automated verification; self-service licensing</td></tr>\n<tr><td>Increase Operational Efficiency and Innovation</td><td>Cross-cutting</td><td>Process automation, application rationalisation; KPI: percentage of processes digitised or automated</td></tr>\n<tr><td>Become a National Hub for Economic and Financial Data</td><td>Revenue analytics, exchange of information / tax treaties</td><td>Governed analytics platform, data-sharing APIs, data catalogue and stewardship</td></tr>\n<tr><td>Build a High-Performing, Engaged Workforce</td><td>Support capabilities (HR, learning)</td><td>Skills data, architecture literacy programmes such as this hub</td></tr>\n<tr><td>Optimise Stakeholder Engagement</td><td>Exchange of information, stakeholder management</td><td>Standardised partner integration patterns and agreements</td></tr>\n<tr><td>Promote Transparency and Trust in the Tax System</td><td>Objections &amp; appeals, guidance, payment &amp; collection</td><td>Auditable decision trails, published service standards, data quality controls</td></tr>\n</tbody></table>\n<h4>Aligning the chain with GEA</h4>\n<p>GEA&rsquo;s BRM provides the national vocabulary for the first links of the chain: GTA strategic objectives are catalogued as <strong>2 Agency strategic goals</strong>, each KPI is tied to a <strong>measurement area</strong> (for example, revenue-collection efficiency under 5 Operations efficiency, taxpayer satisfaction under 2 Customer relationship), and each service is classified under <strong>14.1 Taxes</strong>. The GEA Governance Model requires every new IT investment to show this alignment with measurable KPIs (policy 5.2.1).</p>\n<table class=\"tbl\"><thead><tr><th>Chain link</th><th>GEA artefact</th></tr></thead><tbody>\n<tr><td>Strategic objective</td><td>Goal (agency strategic goals catalogue)</td></tr>\n<tr><td>KPI</td><td>Outcome linked to a BRM measurement area</td></tr>\n<tr><td>Service / capability change</td><td>Business service in the services catalogue (BRM functional area, e-service maturity)</td></tr>\n<tr><td>Data</td><td>Information asset (IRM taxonomy, e.g. 1.02.02.03 Tax)</td></tr>\n<tr><td>Application</td><td>Application service (ARM category)</td></tr>\n<tr><td>Platform</td><td>Infrastructure asset (TRM area)</td></tr>\n</tbody></table>\n<h4>Values as architecture principles</h4>\n<p>Four of GTA&rsquo;s seven values translate naturally into architecture principles: <strong>Data Leadership</strong> (data is an asset with named owners), <strong>Transparency</strong> (decisions and data lineage are traceable), <strong>Efficiency</strong> (reuse before buy, buy before build), and <strong>Customer-Centricity</strong> (design journeys from the taxpayer&rsquo;s perspective, once-only data collection).</p>\n<h4>Organisational anchors</h4>\n<p>Under Cabinet Decision 38 of 2019, Planning &amp; Quality (Article 10) is mandated to verify alignment of work systems and methods with the Authority&rsquo;s competencies and objectives, and Information Technology (Article 14) is responsible for planning computer use, developing information systems and databases, maintaining networks and the Authority&rsquo;s website. Traceability gives both units a shared evidence base.</p>\n<div class=\"callout gta\"><b>At GTA</b> The 2025 baseline found a draft IT strategy not yet formalised and no IT KPIs cascaded, and no annual portfolio planning for the 38 IT projects under way. A practical test for any new initiative: can its sponsor name the strategic objective, the capability it changes, the BRM measurement area and the KPI it moves? If not, it is not yet ready for TRB review.</div>",
  "related": [
   "gea-brm",
   "capability-based-planning",
   "capability-mapping",
   "architecture-principles"
  ],
  "refs": [
   {
    "t": "General Tax Authority",
    "u": "https://www.gta.gov.qa"
   }
  ]
 },
 {
  "id": "gta-reference-architecture",
  "title": "GTA Reference Architecture: GEA-Aligned Target Thinking vs the 2025 Baseline",
  "cat": "Qatar & GTA Context",
  "level": "Advanced",
  "tags": [
   "reference architecture",
   "gta",
   "gea",
   "baseline",
   "dhareeba"
  ],
  "summary": "The diagram shows GTA's real baseline landscape (April 2025). This article sets it against GEA's reference architectures layer by layer to describe the target shape GTA solutions should take, and the reference rules that follow.",
  "minutes": 10,
  "diagram": "reference-arch-gta",
  "body": "<p>A reference architecture is the agreed <strong>shape</strong> that new solutions instantiate; a baseline is what exists today. The diagram shows GTA&rsquo;s <strong>baseline</strong> technology landscape from the April 2025 current state report: users, channels, core and support applications, integration, external government systems, data platforms and hosting. GTA does not yet have an approved target architecture (it is part of the Digital Strategy target state design, D2). Until then, GEA&rsquo;s reference architectures are the authoritative target shape, and the table below shows how the baseline maps to them.</p>\n<table class=\"tbl\"><thead><tr><th>Layer</th><th>GEA reference</th><th>GTA baseline (report pages)</th><th>Target direction</th></tr></thead><tbody>\n<tr><td><strong>Channels</strong></td><td>ARM systems of engagement; BRM channel types; reuse WoG channels</td><td>Dhareeba portal, mobile apps (Hayaatna / Dhareeba), intranet, email, SMS gateway, social media, Gov. Call Center</td><td>Channel catalogue and channel&ndash;service matrix; consistent design; WCAG AA externally</td></tr>\n<tr><td><strong>Identity</strong></td><td>ARM shared service National Authentication; QeAF</td><td>NAS for taxpayers; Active Directory for the workforce</td><td>Delegation and representative model as a GTA core domain on top of NAS</td></tr>\n<tr><td><strong>Business services and APIs</strong></td><td>ARM services layer: process services, business APIs, analytics APIs</td><td>Logic largely inside Dhareeba; IBM API Connect present</td><td>Managed business APIs and events around Dhareeba and Tabadol</td></tr>\n<tr><td><strong>Core tax systems</strong></td><td>ARM systems of record; BRM 14.1 Taxes</td><td>Dhareeba (SAP TRM), Tabadol (NewGen), Tax Support Management, legacy TAS</td><td>Dhareeba 2.0; Tabadol ready for the Pillar Two GIR schema by 2027; TAS history accessible, then retired</td></tr>\n<tr><td><strong>Integration</strong></td><td>IRM GDX exchange architecture and intra-agency minimum set; ARM application integration</td><td>Point-to-point internally; GDX for MoI; point-to-point external APIs; file transfer for treaty exchange</td><td>Integration strategy and platform; GDX first for government partners</td></tr>\n<tr><td><strong>Shared applications</strong></td><td>ARM WoG business applications and platforms; Resolution 18/2010</td><td>Mandated Mawared, Tawasul, Maliya; payment gateway; about 25 SharePoint apps</td><td>WoG shared services first; rationalised SharePoint estate; GRC and PMO capability</td></tr>\n<tr><td><strong>Data and analytics</strong></td><td>ARM data integration and data stores; IRM; Smart Qatar data standards</td><td>SAP BW and Azure Synapse warehouses, SAP Data Services, SAP Analytics Cloud, Power BI</td><td>Governed data with owners, catalogue, quality rules and a shared KPI semantic layer</td></tr>\n<tr><td><strong>Hosting</strong></td><td>TRM reference architecture and cloud controls; Cloud Security Policy</td><td>Azure West Europe (primary), Azure North Europe (DR), Meeza data centre, Government Network WAN</td><td>Multi-cloud strategy, tested DR, documented placement decision per workload (Qatar Central under review)</td></tr>\n<tr><td><strong>Security</strong></td><td>NIA policy and GEA security management</td><td>ISO 27001 certified; five security layers</td><td>Layer-to-NIA-domain mapping; classification-driven controls</td></tr>\n</tbody></table>\n<h4>Reference rules for new GTA solutions</h4>\n<ol>\n<li>Channels never call core systems directly; they go through managed APIs.</li>\n<li>Cross-agency exchange uses GDX where the counterpart is available on it (IRM; Resolution 18/2010).</li>\n<li>No new point-to-point integration to Dhareeba without a time-boxed TRB exception.</li>\n<li>WoG shared services (authentication, payment, SMS, e-correspondence, contact centre) are evaluated before any alternative is built or bought.</li>\n<li>Core tax services own their data; others read it through APIs or events, not shared databases.</li>\n<li>Every information asset has a steward, an IRM taxonomy code and a classification before it is shared.</li>\n<li>Analytics consumes governed pipelines; no reporting queries against production transactional databases.</li>\n<li>Hosting location is a documented decision against policy and classification, not an assumption.</li>\n</ol>\n<div class=\"callout gta\"><b>At GTA</b> Use this table in Design Authority checkpoints: for each component of a new design, identify its layer, its GEA reference and whether it moves the baseline towards the target direction. Deviations become explicit TRB exceptions rather than accidents.</div>",
  "related": [
   "gta-application-landscape",
   "gea-arm",
   "building-blocks",
   "gta-integration-baseline"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "togaf-10-structure",
  "title": "TOGAF 10th Edition: How the Standard Is Organised",
  "cat": "TOGAF",
  "level": "Foundation",
  "tags": [
   "togaf",
   "fundamental content",
   "series guides",
   "togaf library"
  ],
  "summary": "The TOGAF Standard, 10th Edition splits stable Fundamental Content from topic-specific Series Guides, with the TOGAF Library holding additional and emerging material.",
  "minutes": 6,
  "body": "<p>The TOGAF Standard, 10th Edition (released 2022) restructured the standard to make it easier to navigate and to evolve. The key change versus 9.2 is the separation of a stable, universal core from guidance that can be updated more frequently. The Open Group has since published a pocket guide reflecting a 2025 update.</p>\n<h4>Fundamental Content</h4>\n<table class=\"tbl\"><thead><tr><th>Document</th><th>What it covers</th></tr></thead><tbody>\n<tr><td>Introduction and Core Concepts</td><td>Definitions, the role of EA, core concepts such as architecture domains, building blocks, the Enterprise Continuum and the Architecture Repository</td></tr>\n<tr><td>Architecture Development Method</td><td>The ADM phases, their objectives, inputs, steps and outputs</td></tr>\n<tr><td>ADM Techniques</td><td>Techniques used within the ADM: stakeholder management, architecture principles, gap analysis, migration planning techniques, business scenarios, capability-based planning, risk management and others</td></tr>\n<tr><td>Applying the ADM</td><td>Iteration, levels of the architecture landscape, applying the ADM across the enterprise and in different styles</td></tr>\n<tr><td>Architecture Content</td><td>The content framework and metamodel, deliverables, artifacts and building blocks</td></tr>\n<tr><td>Enterprise Architecture Capability and Governance</td><td>Establishing the EA capability, governance, the Architecture Board, compliance, contracts and skills</td></tr>\n</tbody></table>\n<h4>TOGAF Series Guides</h4>\n<p>Series Guides provide deeper, context-specific guidance that builds on the Fundamental Content. Topics include Business Architecture (capabilities, value streams, business models), Security Architecture, Information and Data Architecture, Agile and Digital enterprise, Risk, and guides for specific sectors and government topics. They are designed to be updated independently of the core.</p>\n<h4>TOGAF Library</h4>\n<p>The wider library holds white papers, case studies and emerging material that is not yet (or will not become) part of the standard.</p>\n<h4>How to use the structure</h4>\n<ul>\n<li>Use the <strong>Fundamental Content</strong> as the stable reference for terminology, method and governance in internal policies.</li>\n<li>Pull in <strong>Series Guides</strong> selectively for the problems you actually have, e.g. Business Architecture guides for capability mapping, the Security guide for security architecture integration.</li>\n<li>Record in your tailored framework which documents and versions are adopted.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> Most 9.2 concepts survive in the 10th Edition; what changed most is packaging and the explicit modularity. Practitioners certified on 9.x will recognise the ADM, the content framework and governance concepts.</div>\n<div class=\"callout gta\"><b>At GTA</b> A tailored GTA framework document would state: which ADM phases are mandatory for which project sizes, which artifacts are required at each gate, and which Series Guides are adopted as internal guidance.</div>",
  "related": [
   "adm-overview",
   "tailoring-togaf-agile",
   "content-framework-metamodel",
   "frameworks-comparison"
  ],
  "refs": [
   {
    "t": "The TOGAF Standard (The Open Group)",
    "u": "https://www.opengroup.org/togaf"
   },
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "adm-overview",
  "title": "The Architecture Development Method (ADM)",
  "cat": "TOGAF",
  "level": "Foundation",
  "tags": [
   "adm",
   "togaf",
   "phases",
   "requirements management"
  ],
  "summary": "The ADM is TOGAF's iterative method for developing and managing architecture, from Preliminary and Vision through to Change Management, with Requirements Management at the centre.",
  "minutes": 9,
  "diagram": "adm-cycle",
  "body": "<p>The ADM is a tested, repeatable process for developing architectures. It is drawn as a cycle, but in practice it is iterated at several levels and scaled to the size of the problem.</p>\n<table class=\"tbl\"><thead><tr><th>Phase</th><th>Purpose</th><th>Key outputs</th></tr></thead><tbody>\n<tr><td>Preliminary</td><td>Prepare the organisation: scope, principles, framework tailoring, governance</td><td>Organisational Model for EA, Tailored Architecture Framework, Architecture Principles</td></tr>\n<tr><td>A. Architecture Vision</td><td>Agree scope, stakeholders, high-level target and value; obtain approval</td><td>Statement of Architecture Work, Architecture Vision</td></tr>\n<tr><td>B. Business Architecture</td><td>Baseline and target business architecture; gap analysis</td><td>Draft Architecture Definition Document and Architecture Requirements Specification (business sections)</td></tr>\n<tr><td>C. Information Systems Architectures</td><td>Data and application architectures</td><td>Data and application sections of the ADD and ARS</td></tr>\n<tr><td>D. Technology Architecture</td><td>Platforms, infrastructure and technology services</td><td>Technology sections of the ADD and ARS</td></tr>\n<tr><td>E. Opportunities &amp; Solutions</td><td>Consolidate gaps, identify work packages and Transition Architectures</td><td>Draft Architecture Roadmap, Implementation and Migration Strategy</td></tr>\n<tr><td>F. Migration Planning</td><td>Prioritise and sequence; finalise roadmap with costs and benefits</td><td>Implementation and Migration Plan, finalised Architecture Roadmap</td></tr>\n<tr><td>G. Implementation Governance</td><td>Ensure projects conform to the architecture</td><td>Architecture Contracts, Compliance Assessments</td></tr>\n<tr><td>H. Architecture Change Management</td><td>Monitor change drivers; decide whether a new cycle is needed</td><td>Change Requests, updated architecture</td></tr>\n<tr><td>Requirements Management</td><td>Central, continuous process managing requirements across all phases</td><td>Requirements Impact Assessment, updated Architecture Requirements Specification</td></tr>\n</tbody></table>\n<h4>Within phases B, C and D</h4>\n<p>The steps follow a consistent pattern: select reference models, viewpoints and tools; develop the baseline description; develop the target description; perform gap analysis; define candidate roadmap components; resolve impacts across the landscape; conduct formal stakeholder review; finalise; create the architecture definition.</p>\n<h4>Requirements Management</h4>\n<p>Requirements are not captured once. Phase H and delivery feedback continually generate new or changed requirements; the Requirements Management process identifies them, assesses impact on the current phase and earlier phases, and records decisions. A <strong>Requirements Impact Assessment</strong> documents which architecture elements and work packages are affected.</p>\n<h4>Iteration</h4>\n<ul>\n<li><strong>Architecture Capability iteration</strong>: Preliminary and Phase A to establish or adjust the practice.</li>\n<li><strong>Architecture Development iteration</strong>: cycling B&ndash;D to converge on a target.</li>\n<li><strong>Transition Planning iteration</strong>: E and F to build the roadmap.</li>\n<li><strong>Architecture Governance iteration</strong>: G and H to steer implementation and change.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Running every phase fully for every project. The ADM is meant to be tailored; a small change might need a short Vision, an impact check in C/D and a compliance review in G.</div>\n<div class=\"callout gta\"><b>At GTA</b> A typical scaling rule: strategic programmes (e.g. a core tax system replacement) run the full ADM; medium projects produce a Vision and a Solution Architecture Document; small changes complete a TRB checklist only.</div>",
  "related": [
   "togaf-10-structure",
   "gap-analysis",
   "migration-planning",
   "tailoring-togaf-agile"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "enterprise-continuum-repository",
  "title": "The Enterprise Continuum",
  "cat": "TOGAF",
  "level": "Practitioner",
  "tags": [
   "enterprise continuum",
   "reuse",
   "reference models",
   "togaf"
  ],
  "summary": "The Enterprise Continuum classifies architecture and solution assets from generic to organisation-specific, making reuse and reference-model alignment explicit.",
  "minutes": 7,
  "diagram": "enterprise-continuum",
  "body": "<p>The Enterprise Continuum is TOGAF&rsquo;s way of classifying assets by how generic or specific they are. It answers a practical question: <em>before designing something, what already exists that we can reuse or specialise?</em></p>\n<h4>Two parallel continua</h4>\n<table class=\"tbl\"><thead><tr><th>Architecture Continuum</th><th>Solutions Continuum</th><th>Example</th></tr></thead><tbody>\n<tr><td>Foundation Architectures</td><td>Foundation Solutions</td><td>Generic computing concepts; programming languages, operating systems, generic cloud services</td></tr>\n<tr><td>Common Systems Architectures</td><td>Common Systems Solutions</td><td>Security, identity, network, integration architectures; packaged IAM or messaging products</td></tr>\n<tr><td>Industry Architectures</td><td>Industry Solutions</td><td>Tax administration or government reference models; commercial tax administration packages</td></tr>\n<tr><td>Organisation-Specific Architectures</td><td>Organisation-Specific Solutions</td><td>GTA target architecture; GTA&rsquo;s configured and integrated systems</td></tr>\n</tbody></table>\n<p>Moving left to right (generic to specific) is <strong>specialisation</strong>; moving right to left is <strong>generalisation</strong> &mdash; harvesting reusable patterns from specific work. Each architecture in the Architecture Continuum guides, and is realised by, the corresponding level in the Solutions Continuum.</p>\n<h4>Why it matters</h4>\n<ul>\n<li>Encourages starting from reference architectures instead of blank pages.</li>\n<li>Makes explicit where national standards (e.g. GEA) sit relative to entity-specific designs.</li>\n<li>Gives a structure for the Reference Library in the Architecture Repository.</li>\n<li>Supports communication: stakeholders can see whether a design is innovative or a standard instantiation.</li>\n</ul>\n<h4>Relationship to the Architecture Repository</h4>\n<p>The Continuum is a <strong>classification</strong>; the Architecture Repository is the <strong>store</strong>. Reference models and patterns sit in the Reference Library; GTA-specific baselines and targets sit in the Architecture Landscape; adopted technology standards sit in the Standards area.</p>\n<div class=\"callout note\"><b>Note</b> A good test of reuse culture is the generalisation direction: how often does a project-specific design get promoted into a reusable pattern or reference architecture? If never, the continuum exists only on paper.</div>\n<div class=\"callout gta\"><b>At GTA</b> National GEA reference models sit roughly at the industry (government) level; a GTA tax-administration reference architecture is organisation-specific; and a pattern such as &ldquo;secure partner data exchange&rdquo; can be generalised from one project and reused across many exchange-of-information integrations.</div>",
  "related": [
   "repository-governance",
   "building-blocks",
   "gta-reference-architecture",
   "qatar-gea"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "content-framework-metamodel",
  "title": "Content Framework, Metamodel and Artifacts",
  "cat": "TOGAF",
  "level": "Practitioner",
  "tags": [
   "content metamodel",
   "deliverables",
   "artifacts",
   "catalogs",
   "matrices"
  ],
  "summary": "TOGAF distinguishes deliverables, artifacts and building blocks, and defines a metamodel and a set of catalogs, matrices and diagrams that structure architecture content.",
  "minutes": 9,
  "diagram": "content-metamodel",
  "body": "<p>The content framework tells you <strong>what</strong> to produce; the ADM tells you <strong>when</strong>. Its central structure is a metamodel of entities (actor, capability, process, data entity, application component, technology component and so on) and their relationships.</p>\n<h4>Three kinds of work product</h4>\n<dl class=\"defs\">\n<dt>Deliverable</dt><dd>A contractually specified work product, formally reviewed and signed off (e.g. Architecture Definition Document, Statement of Architecture Work). Deliverables are typically archived at project completion or become reference material.</dd>\n<dt>Artifact</dt><dd>A more granular work product describing an aspect of the architecture. Artifacts are classified as <strong>catalogs</strong> (lists of things), <strong>matrices</strong> (relationships between things) or <strong>diagrams</strong> (pictures of things).</dd>\n<dt>Building block</dt><dd>A potentially reusable component of business, IT or architectural capability (ABB or SBB).</dd>\n</dl>\n<p>Deliverables contain artifacts; artifacts describe building blocks.</p>\n<h4>Frequently used artifacts by phase</h4>\n<table class=\"tbl\"><thead><tr><th>Phase</th><th>Catalogs</th><th>Matrices</th><th>Diagrams</th></tr></thead><tbody>\n<tr><td>Preliminary / A</td><td>Principles catalog</td><td>Stakeholder map matrix</td><td>Value chain, solution concept, business model</td></tr>\n<tr><td>B</td><td>Organization/actor, role, business service/function, process/event/control/product, contract/measure</td><td>Business interaction, actor/role</td><td>Business footprint, organisation decomposition, process flow, capability map, value stream map</td></tr>\n<tr><td>C &ndash; Data</td><td>Data entity/data component</td><td>Data entity/business function, application/data</td><td>Conceptual and logical data diagrams, data dissemination, data lifecycle, data security</td></tr>\n<tr><td>C &ndash; Application</td><td>Application portfolio, interface</td><td>Application/organisation, role/application, application/function, application interaction</td><td>Application communication, process/application realisation, application migration</td></tr>\n<tr><td>D</td><td>Technology standards, technology portfolio</td><td>Application/technology</td><td>Environments and locations, platform decomposition, network computing/hardware</td></tr>\n<tr><td>E / F</td><td>&mdash;</td><td>&mdash;</td><td>Project context, benefits diagram</td></tr>\n<tr><td>Requirements</td><td>Requirements catalog</td><td>&mdash;</td><td>&mdash;</td></tr>\n</tbody></table>\n<h4>Core metamodel vs extensions</h4>\n<p>The core metamodel is deliberately minimal. Extensions (governance, services, process modelling, data, infrastructure consolidation, motivation) add entities when needed. Tailor deliberately: every entity you add must be maintained.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Producing all artifacts because they are listed. Choose artifacts that answer stakeholder concerns (see ISO 42010 viewpoints), and record the selection in the tailored framework.</div>\n<div class=\"callout gta\"><b>At GTA</b> A minimum viable GTA artifact set could be: capability map, application portfolio catalog, application/function matrix, data entity catalog with owners and classification, interface catalog, technology standards catalog and an application communication diagram per segment.</div>",
  "related": [
   "building-blocks",
   "repository-governance",
   "iso-42010",
   "archimate-core-elements"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "building-blocks",
  "title": "Building Blocks: ABBs and SBBs",
  "cat": "TOGAF",
  "level": "Practitioner",
  "tags": [
   "building blocks",
   "abb",
   "sbb",
   "reuse",
   "togaf"
  ],
  "summary": "Architecture Building Blocks describe required capability in a technology-neutral way; Solution Building Blocks are the concrete products or components that realise them.",
  "minutes": 7,
  "diagram": "building-blocks",
  "body": "<p>A building block is a package of functionality defined to meet business needs, with defined boundaries and interfaces, that can potentially be reused. TOGAF distinguishes two kinds.</p>\n<div class=\"grid2\">\n<div class=\"mini\"><h5>Architecture Building Block (ABB)</h5><p>Captures requirements and specifications: what capability is needed, its functions, interfaces, standards and quality attributes. Vendor- and product-neutral. Directs and guides SBB selection.</p></div>\n<div class=\"mini\"><h5>Solution Building Block (SBB)</h5><p>A concrete component: a commercial product, a cloud service, an in-house service or a configured package. Has a procurement or development route, costs, a lifecycle and an owner.</p></div>\n</div>\n<h4>Characteristics of a good building block</h4>\n<ul>\n<li>Clear boundary and published interfaces (APIs, events, files).</li>\n<li>Interoperable with other building blocks via standards.</li>\n<li>Considers implementation and usage, and evolves to exploit technology and standards.</li>\n<li>May be assembled from other building blocks, and may be a subassembly of others.</li>\n<li>Ideally reusable and replaceable.</li>\n</ul>\n<h4>Specification template (ABB)</h4>\n<table class=\"tbl\"><thead><tr><th>Field</th><th>Example: Notification Service ABB</th></tr></thead><tbody>\n<tr><td>Purpose</td><td>Send transactional notifications to taxpayers and staff across channels</td></tr>\n<tr><td>Functions</td><td>Template management, multilingual (Arabic/English) rendering, SMS, email, in-portal inbox, delivery tracking</td></tr>\n<tr><td>Interfaces</td><td>REST API for send requests; event subscription for status; admin UI</td></tr>\n<tr><td>Standards</td><td>OpenAPI 3.x contract; enterprise event envelope; UTF-8, right-to-left support</td></tr>\n<tr><td>Quality attributes</td><td>99.9% availability; p95 enqueue latency &lt; 200 ms; 7-year delivery log retention (illustrative)</td></tr>\n<tr><td>Security</td><td>OAuth 2.0 client credentials; no full tax data in message bodies; PII masked in logs</td></tr>\n<tr><td>Candidate SBBs</td><td>WoG SMS Gateway (GEA shared service); existing GTA SMS gateway and email; commercial communication platform; in-house service</td></tr>\n</tbody></table>\n<h4>From ABB to SBB</h4>\n<p>In Phases B&ndash;D, ABBs are defined to close gaps. In Phase E, candidate SBBs are evaluated against ABB specifications (fit, cost, risk, lifecycle, national standards), and the selected SBBs become work packages on the roadmap.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Starting from a product (SBB) and reverse-engineering the requirement. Write the ABB first; otherwise you lock in vendor-specific capabilities you never needed.</div>\n<div class=\"callout gta\"><b>At GTA</b> The diagram maps ABBs to the SBBs in GTA&rsquo;s 2025 baseline: core tax and revenue management &rarr; Dhareeba (SAP TRM); taxpayer authentication &rarr; NAS; cross-government exchange &rarr; GDX; international exchange &rarr; Tabadol; API management &rarr; IBM API Connect; enterprise data warehouse &rarr; Azure Synapse plus SAP BW. Under GEA Resolution 18/2010, WoG shared services (authentication, payment, SMS, contact centre, e-correspondence) should be evaluated first as SBBs for any new ABB.</div>",
  "related": [
   "content-framework-metamodel",
   "gta-reference-architecture",
   "enterprise-continuum-repository",
   "technology-reference-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "architecture-principles",
  "title": "Architecture Principles",
  "cat": "TOGAF",
  "level": "Foundation",
  "tags": [
   "principles",
   "governance",
   "decision making",
   "togaf"
  ],
  "summary": "Principles are enduring rules and guidelines that inform how an organisation uses and deploys its IT resources. Good principles are few, testable and have explicit implications.",
  "minutes": 7,
  "body": "<p>Architecture principles are general rules and guidelines, intended to be enduring and seldom amended, that inform and support the way an organisation sets about fulfilling its mission. They sit in a hierarchy: <strong>enterprise principles</strong> (corporate values and policies), <strong>IT principles</strong>, and <strong>architecture principles</strong> that govern the architecture process and its products.</p>\n<h4>Standard structure</h4>\n<dl class=\"defs\">\n<dt>Name</dt><dd>Short, memorable, captures the essence. Avoid product names.</dd>\n<dt>Statement</dt><dd>Succinct and unambiguous expression of the rule.</dd>\n<dt>Rationale</dt><dd>Business benefits of adhering to the principle, in business language; relationship to other principles.</dd>\n<dt>Implications</dt><dd>Requirements for business and IT to carry out the principle: resources, costs, activities, and what will be done differently.</dd>\n</dl>\n<h4>Qualities of a good principle set</h4>\n<table class=\"tbl\"><thead><tr><th>Criterion</th><th>Meaning</th><th>Test</th></tr></thead><tbody>\n<tr><td>Understandable</td><td>Readily grasped by any stakeholder</td><td>Could a project manager explain it without an architect present?</td></tr>\n<tr><td>Robust</td><td>Enables good decisions in ambiguous cases</td><td>Does it discriminate between real design options?</td></tr>\n<tr><td>Complete</td><td>Covers every situation that matters</td><td>Are data, security, integration, sourcing and user experience all addressed?</td></tr>\n<tr><td>Consistent</td><td>Principles do not contradict without guidance on precedence</td><td>Is there a stated way to resolve conflicts?</td></tr>\n<tr><td>Stable</td><td>Enduring, but amendable through governance</td><td>Have they survived at least one strategy refresh?</td></tr>\n</tbody></table>\n<h4>Typical principle themes</h4>\n<ul>\n<li><strong>Business</strong>: primacy of principles, maximise benefit to the enterprise, service orientation, compliance with law.</li>\n<li><strong>Data</strong>: data is an asset, data is shared, data is accessible, data trustee, common vocabulary, data security.</li>\n<li><strong>Application</strong>: technology independence, ease of use, reuse before buy before build.</li>\n<li><strong>Technology</strong>: requirements-based change, responsive change management, control technical diversity, interoperability.</li>\n</ul>\n<h4>Principles in a Qatar government context</h4>\n<p>For a Qatari agency the hierarchy starts above the enterprise: the <strong>seven GEA principles</strong> (Customer centricity; Promote reuse; Share information by default; Enable co-creation through a collaborative environment; Trust and confidence; Interoperable; Design for future) apply to every agency. GTA&rsquo;s architecture principles should refine them in TOGAF format, adding the GTA-specific rationale and implications, and must not contradict them.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Platitudes such as &ldquo;systems shall be secure&rdquo;. If nobody could ever disagree with a principle, it gives no guidance. A real principle closes off options, e.g. &ldquo;No new point-to-point integrations to the core tax system&rdquo;.</div>\n<div class=\"callout gta\"><b>At GTA</b> Aim for 10&ndash;15 principles, each traceable to a GEA principle and to a strategic objective or value (e.g. GEA <em>Share information by default</em> + value Customer-Centricity &rarr; &ldquo;Once-only data collection&rdquo;). See the principle template article for a fully worked example.</div>",
  "related": [
   "tpl-architecture-principle",
   "gea-principles",
   "gta-strategy-to-solution",
   "ea-governance-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "stakeholder-management",
  "title": "Stakeholder Management and Business Scenarios",
  "cat": "TOGAF",
  "level": "Practitioner",
  "tags": [
   "stakeholders",
   "power grid",
   "business scenarios",
   "communication"
  ],
  "summary": "Identify stakeholders early, classify them by power and interest, map their concerns to viewpoints, and use business scenarios to surface real requirements.",
  "minutes": 7,
  "body": "<p>Architecture fails more often for political and communication reasons than technical ones. TOGAF&rsquo;s stakeholder management technique is applied from the Preliminary phase and Phase A onwards, and revisited as the work evolves.</p>\n<h4>Four steps</h4>\n<ol>\n<li><strong>Identify stakeholders</strong> &mdash; including those who will lose something (budgets, systems, control).</li>\n<li><strong>Classify positions</strong> &mdash; current and required level of commitment and support.</li>\n<li><strong>Determine management approach</strong> &mdash; using a power/interest grid.</li>\n<li><strong>Tailor engagement deliverables</strong> &mdash; select viewpoints and artifacts that frame each stakeholder&rsquo;s concerns.</li>\n</ol>\n<h4>Power/interest grid</h4>\n<table class=\"tbl\"><thead><tr><th></th><th>Low interest</th><th>High interest</th></tr></thead><tbody>\n<tr><td><strong>High power</strong></td><td>Keep Satisfied</td><td>Key Players &mdash; manage closely</td></tr>\n<tr><td><strong>Low power</strong></td><td>Minimal Effort &mdash; monitor</td><td>Keep Informed</td></tr>\n</tbody></table>\n<h4>Stakeholder map matrix (extract)</h4>\n<table class=\"tbl\"><thead><tr><th>Stakeholder</th><th>Key concerns</th><th>Class</th><th>Viewpoints / artifacts</th></tr></thead><tbody>\n<tr><td>Assistant President for Tax Affairs</td><td>Revenue, compliance outcomes, service quality</td><td>Key Player</td><td>Capability heat map, roadmap, benefits diagram</td></tr>\n<tr><td>Information Technology director</td><td>Delivery capacity, operational risk, cost</td><td>Key Player</td><td>Application portfolio, technology lifecycle, roadmap</td></tr>\n<tr><td>Information security</td><td>Classification, threats, identity</td><td>Keep Satisfied</td><td>Data security diagram, trust boundaries, threat model</td></tr>\n<tr><td>Delivery teams</td><td>Clear standards, fast decisions</td><td>Keep Informed</td><td>Patterns, ADRs, interface specifications</td></tr>\n</tbody></table>\n<h4>Business scenarios</h4>\n<p>A business scenario is a technique for discovering and documenting business requirements by describing a problem, its environment, objectives, human and computer actors, and desired outcomes. It follows a cycle of <em>Problem &rarr; Environment &rarr; Objectives &rarr; Human actors &rarr; Computer actors &rarr; Roles and responsibilities &rarr; Refine</em>. Objectives should be SMART.</p>\n<div class=\"callout gta\"><b>At GTA</b> Example business scenario: &ldquo;A newly registered excise-goods importer applies for a tax warehouse licence, is risk-assessed, inspected and licensed, and from then on files periodic returns.&rdquo; Walking through it with Excise, Compliance, Taxpayer Service and IT surfaces requirements no single unit would have listed.</div>",
  "related": [
   "iso-42010",
   "architecture-principles",
   "adm-overview",
   "archimate-viewpoints-conventions"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "gap-analysis",
  "title": "Gap Analysis",
  "cat": "TOGAF",
  "level": "Foundation",
  "tags": [
   "gap analysis",
   "baseline",
   "target",
   "togaf"
  ],
  "summary": "Gap analysis compares baseline and target architectures to identify what must be added, removed, changed or kept, and is the bridge from design to roadmap.",
  "minutes": 6,
  "diagram": "gap-analysis",
  "body": "<p>Gap analysis is used in Phases B, C and D and consolidated in Phase E. It validates the architecture by highlighting shortfalls between baseline and target, and produces the raw material for work packages.</p>\n<h4>The gap matrix</h4>\n<p>List baseline building blocks as rows, target building blocks as columns, add a final &ldquo;New&rdquo; row and &ldquo;Eliminated&rdquo; column, then mark each intersection.</p>\n<table class=\"tbl\"><thead><tr><th>Baseline \\ Target</th><th>Integration platform</th><th>Rationalised applications</th><th>Unified taxpayer data</th><th>Self-service BI</th><th>Eliminated</th></tr></thead><tbody>\n<tr><td>Point-to-point integrations</td><td>Replaced</td><td></td><td></td><td></td><td>Yes &mdash; progressively</td></tr>\n<tr><td>About 25 SharePoint applications</td><td></td><td>Consolidated</td><td></td><td></td><td>Partly</td></tr>\n<tr><td>TAS + Dhareeba data split</td><td></td><td></td><td>Migrated</td><td></td><td>TAS (after migration)</td></tr>\n<tr><td>Excel / manual reporting</td><td></td><td></td><td></td><td>Replaced</td><td>Yes</td></tr>\n<tr><td>New</td><td></td><td>Gap: GRC and PMO tools</td><td></td><td></td><td></td></tr>\n</tbody></table>\n<p>The rows come from GTA&rsquo;s April 2025 baseline; the target columns are indicative until the target state design (D2) is approved.</p>\n<h4>Interpreting results</h4>\n<dl class=\"defs\">\n<dt>Included in both</dt><dd>Carried forward, possibly enhanced.</dd>\n<dt>Baseline only (eliminated)</dt><dd>Check: intentional retirement, or accidentally omitted from target? Accidental omissions are a common source of lost functionality.</dd>\n<dt>Target only (new)</dt><dd>A gap to be filled by build, buy or reuse.</dd>\n</dl>\n<h4>Gaps to look for beyond components</h4>\n<ul>\n<li>People: skills, roles, organisational responsibilities.</li>\n<li>Process: manual steps, missing controls.</li>\n<li>Data: missing entities, ownership, quality, integration.</li>\n<li>Tools and technology: unsupported platforms, missing environments.</li>\n<li>Security and compliance: missing controls for classification levels.</li>\n<li>Performance, availability, and cost.</li>\n</ul>\n<h4>Step by step</h4>\n<ol>\n<li>Agree the scope and the level of granularity (capability, application, building block) with stakeholders.</li>\n<li>Populate baseline and target lists from the repository; validate them with owners.</li>\n<li>Build the matrix and classify every cell; challenge every &ldquo;eliminated&rdquo; item.</li>\n<li>Describe each gap: what is missing, why it matters, which requirement or objective it serves.</li>\n<li>Record gaps in the Architecture Definition Document and carry them into the Phase E consolidated gaps, solutions and dependencies matrix.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Performing gap analysis only at component level. A system can be &ldquo;unchanged&rdquo; while its owning team, operating model or data quality represents the real gap.</div>",
  "related": [
   "migration-planning",
   "adm-overview",
   "capability-mapping",
   "tpl-time-rubric"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "migration-planning",
  "title": "Migration Planning and Transition Architectures",
  "cat": "TOGAF",
  "level": "Practitioner",
  "tags": [
   "roadmap",
   "transition architecture",
   "migration",
   "phase e",
   "phase f"
  ],
  "summary": "Phases E and F turn gaps into a sequenced, costed roadmap of work packages and Transition Architectures, each delivering business value.",
  "minutes": 8,
  "diagram": "transition-roadmap",
  "body": "<p>A target architecture that cannot be reached incrementally is a wish list. TOGAF Phases E and F provide techniques to group gaps into work packages, define intermediate stable states and sequence delivery.</p>\n<h4>Key concepts</h4>\n<dl class=\"defs\">\n<dt>Work package</dt><dd>A set of actions to achieve one or more objectives; becomes a project or part of a programme.</dd>\n<dt>Transition Architecture</dt><dd>A formal description of the enterprise at an intermediate state: stable, operable, delivering measurable value. In ArchiMate, modelled as a Plateau.</dd>\n<dt>Architecture Roadmap</dt><dd>Lists work packages and transition architectures over time, with dependencies and value.</dd>\n</dl>\n<h4>Migration planning techniques</h4>\n<table class=\"tbl\"><thead><tr><th>Technique</th><th>Use</th></tr></thead><tbody>\n<tr><td>Implementation Factor Assessment and Deduction Matrix</td><td>Records factors that affect migration (risks, issues, assumptions, dependencies) and the deductions drawn</td></tr>\n<tr><td>Consolidated Gaps, Solutions and Dependencies Matrix</td><td>Groups gaps across domains, proposes solutions and records dependencies</td></tr>\n<tr><td>Architecture Definition Increments Table</td><td>Plans a series of transition architectures and what each delivers</td></tr>\n<tr><td>Transition Architecture State Evolution Table</td><td>Shows the state of each building block in each transition architecture</td></tr>\n<tr><td>Business Value Assessment Technique</td><td>Plots work packages on a value/risk matrix to prioritise</td></tr>\n</tbody></table>\n<h4>Sequencing heuristics</h4>\n<ul>\n<li>Foundations first: identity, master data and integration platforms unblock many later work packages.</li>\n<li>Deliver visible value in every transition; avoid long &ldquo;plumbing-only&rdquo; phases.</li>\n<li>Respect fiscal and tax calendar constraints &mdash; avoid cutovers during peak filing periods.</li>\n<li>Retire legacy explicitly; every transition should list what is switched off.</li>\n<li>Limit concurrent change on the same business unit.</li>\n</ul>\n<h4>Example transition sequence (indicative, from the GTA baseline themes)</h4>\n<ol>\n<li><strong>Foundation</strong> (journey stage 1): IT/digital strategy and KPIs, data management framework, integration strategy, multi-cloud and IT DR strategy, EA Office with TRB.</li>\n<li><strong>Strengthen</strong> (stage 2): integration platform with GDX-first external exchange and the Dhareeba&ndash;Tabadol link; Dhareeba 2.0, GRC and PMO tooling; tested DR.</li>\n<li><strong>Target</strong>: rationalised portfolio, governed and quality-assured data, self-service executive dashboards.</li>\n</ol>\n<p>Stages follow the transformation journey in the current state report; the actual roadmap is deliverable D3.</p>\n<div class=\"callout gta\"><b>At GTA</b> Transition architectures are also governance checkpoints: TRB reviews whether each plateau was actually reached (including legacy retirements) before funding the next.</div>",
  "related": [
   "gap-analysis",
   "capability-based-planning",
   "legacy-modernization-7rs",
   "adm-overview"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "tailoring-togaf-agile",
  "title": "Tailoring TOGAF and Working with Agile Delivery",
  "cat": "TOGAF",
  "level": "Advanced",
  "tags": [
   "tailoring",
   "agile",
   "togaf",
   "guardrails",
   "intentional architecture"
  ],
  "summary": "TOGAF is designed to be tailored. In agile environments, EA provides intentional architecture and guardrails while teams own emergent design within them.",
  "minutes": 8,
  "body": "<p>The TOGAF Standard explicitly expects tailoring: terminology, process, content and governance should fit the organisation. The 10th Edition and its Agile-related Series Guides describe how the ADM can operate at different speeds and levels, including within agile delivery.</p>\n<h4>What to tailor</h4>\n<table class=\"tbl\"><thead><tr><th>Area</th><th>Tailoring decisions</th></tr></thead><tbody>\n<tr><td>Process</td><td>Which phases are mandatory per initiative size; how phases map to the organisation&rsquo;s investment gates</td></tr>\n<tr><td>Content</td><td>Minimum artifact set; metamodel entities actually maintained</td></tr>\n<tr><td>Governance</td><td>TRB tiers, decision rights, SLA for decisions, waiver process</td></tr>\n<tr><td>Terminology</td><td>Align with existing vocabulary (e.g. national GEA terms, internal project terms)</td></tr>\n<tr><td>Tools</td><td>Repository tool, modelling notation (ArchiMate version), integration with project and CMDB tools</td></tr>\n</tbody></table>\n<h4>EA in an agile delivery model</h4>\n<div class=\"grid2\">\n<div class=\"mini\"><h5>Intentional architecture (EA)</h5><p>Target states, principles, standards, shared platforms and reference architectures. Slow-changing; decided collectively; published as guardrails.</p></div>\n<div class=\"mini\"><h5>Emergent design (teams)</h5><p>Detailed design decisions inside a product, made by the team just in time and recorded as ADRs. Fast-changing; reviewed only if they cross guardrails.</p></div>\n</div>\n<h4>Practical mechanisms</h4>\n<ul>\n<li><strong>Architecture runway</strong>: enabler work (APIs, platforms) prioritised in the backlog ahead of feature need.</li>\n<li><strong>Guardrails, not gates</strong>: publish what is pre-approved (patterns, standards); review only exceptions.</li>\n<li><strong>Architecture in the backlog</strong>: NFRs and architecture enablers become backlog items with acceptance criteria.</li>\n<li><strong>Fitness functions</strong>: automated checks in pipelines (dependency rules, API linting, security scans) to verify architectural characteristics continuously.</li>\n<li><strong>Lightweight ADRs</strong> in source repositories, harvested into the enterprise repository.</li>\n<li><strong>Embedded architects</strong>: architects participate in PI or quarterly planning, not only formal reviews.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Treating agile as a reason to skip architecture, or treating EA as a reason to impose waterfall. The aim is fast flow with coherent outcomes; both extremes fail.</div>\n<div class=\"callout gta\"><b>At GTA</b> A pragmatic split: the TRB approves product-level architecture at inception (context, key decisions, integration, data classification); after that, teams record ADRs and only escalate decisions that breach a standard or introduce new technology.</div>",
  "related": [
   "togaf-10-structure",
   "arb-operating-model",
   "tpl-adr",
   "platform-engineering-observability"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   },
   {
    "t": "Software Architecture Guide (martinfowler.com)",
    "u": "https://martinfowler.com/architecture/"
   }
  ]
 },
 {
  "id": "archimate-4-whats-new",
  "title": "ArchiMate 4: What Changed",
  "cat": "ArchiMate & Modelling",
  "level": "Practitioner",
  "tags": [
   "archimate",
   "archimate 4",
   "modelling language",
   "common domain"
  ],
  "summary": "ArchiMate 4 (April 2026) simplifies the language: about 30% fewer concepts, layers renamed to domains, and a new Common Domain for generic behaviour elements.",
  "minutes": 7,
  "diagram": "archimate-hexagon",
  "body": "<p>The Open Group released the <strong>ArchiMate 4 Specification</strong> in April 2026, succeeding version 3.2 (October 2022). The headline is simplification: the number of concepts is reduced by roughly 30% (from about 60 to 42), making the language easier to learn and models easier to keep consistent.</p>\n<h4>Main changes</h4>\n<table class=\"tbl\"><thead><tr><th>Area</th><th>ArchiMate 3.2</th><th>ArchiMate 4</th></tr></thead><tbody>\n<tr><td>Structuring</td><td>Layers (Business, Application, Technology) plus aspects and extension elements</td><td><strong>Domains</strong>: Business, Application, Technology, plus Motivation, Strategy, Implementation &amp; Migration</td></tr>\n<tr><td>Generic behaviour</td><td>Separate Business Process, Application Process, Technology Process (similarly for function, interaction, event, service)</td><td>A <strong>Common Domain</strong> holds generic elements, e.g. a single Process usable in any domain</td></tr>\n<tr><td>Generalised structure</td><td>Role and Path tied to particular layers</td><td>Role and Path generalised</td></tr>\n<tr><td>Framework picture</td><td>Layered grid of layers and aspects</td><td>New framework picture nicknamed the &ldquo;hexagonion&rdquo;</td></tr>\n<tr><td>Concept count</td><td>About 60</td><td>42</td></tr>\n</tbody></table>\n<h4>Why it matters for practitioners</h4>\n<ul>\n<li><strong>Less duplication</strong>: modellers no longer debate whether something is a &ldquo;business process&rdquo; or an &ldquo;application process&rdquo; when the distinction carries little meaning; the context (what performs it) says it.</li>\n<li><strong>Easier onboarding</strong>: business analysts and developers can learn a smaller core set.</li>\n<li><strong>Cleaner viewpoints</strong>: fewer near-identical element types makes viewpoint definitions and model queries simpler.</li>\n</ul>\n<h4>Migration considerations</h4>\n<ul>\n<li>Many repository tools and existing models are still on 3.2. Conversion options exist, but check how your tool maps 3.2 layer-specific elements onto ArchiMate 4 common elements before converting.</li>\n<li>Preserve layer information as properties or via the performing element so that queries such as &ldquo;all application behaviour&rdquo; still work.</li>\n<li>Update modelling conventions, viewpoint definitions and training material together; mixed-version repositories are confusing.</li>\n<li>Do not convert mid-programme without a plan; agree a cut-over date and freeze period.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> Always consult the official specification for the precise element and relationship lists; this article summarises the direction of change, not every detail.</div>\n<div class=\"callout gta\"><b>At GTA</b> GEA publishes its taxonomies and shared-service catalogues as an ArchiMate 3.0 model built in Archi, and requires agencies to plan EA tooling on ArchiMate 3.0. Build GTA&rsquo;s first GEA catalogues in ArchiMate 3.x so they exchange cleanly with the GEA model, and pilot ArchiMate 4 on one segment only once tool support and an export path back to 3.x are confirmed.</div>",
  "related": [
   "archimate-core-elements",
   "archimate-relationships",
   "archimate-viewpoints-conventions",
   "notations-compared"
  ],
  "refs": [
   {
    "t": "ArchiMate Forum (The Open Group)",
    "u": "https://www.opengroup.org/archimate-forum"
   }
  ]
 },
 {
  "id": "archimate-core-elements",
  "title": "ArchiMate Core Elements",
  "cat": "ArchiMate & Modelling",
  "level": "Foundation",
  "tags": [
   "archimate",
   "elements",
   "active structure",
   "behaviour",
   "passive structure"
  ],
  "summary": "ArchiMate elements are organised by aspect: active structure (who/what acts), behaviour (what is done) and passive structure (what is acted upon), across domains.",
  "minutes": 8,
  "body": "<p>ArchiMate&rsquo;s generic metamodel distinguishes three aspects. Understanding them matters more than memorising element names, because the same pattern repeats in every domain.</p>\n<dl class=\"defs\">\n<dt>Active structure</dt><dd>Things that perform behaviour: actors, roles, collaborations, application components, nodes, devices, system software. Interfaces are the external access points of active structure.</dd>\n<dt>Behaviour</dt><dd>What is performed: processes, functions, interactions, events and services. <em>Internal</em> behaviour (process, function) is distinguished from <em>external</em> behaviour (service), which is what others can use.</dd>\n<dt>Passive structure</dt><dd>Objects on which behaviour is performed: business objects, contracts, representations, data objects, artifacts.</dd>\n</dl>\n<h4>Elements by domain (common usage)</h4>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Active structure</th><th>Behaviour</th><th>Passive structure</th></tr></thead><tbody>\n<tr><td>Business</td><td>Business actor, role, collaboration, interface</td><td>Process, function, interaction, event, business service</td><td>Business object, contract, representation, product</td></tr>\n<tr><td>Application</td><td>Application component, interface, collaboration</td><td>Process, function, event, application service</td><td>Data object</td></tr>\n<tr><td>Technology</td><td>Node, device, system software, communication network, path, technology interface</td><td>Process, function, event, technology service</td><td>Artifact</td></tr>\n<tr><td>Strategy</td><td colspan=\"3\">Resource, capability, value stream, course of action</td></tr>\n<tr><td>Motivation</td><td colspan=\"3\">Stakeholder, driver, assessment, goal, outcome, principle, requirement, constraint, meaning, value</td></tr>\n<tr><td>Implementation &amp; Migration</td><td colspan=\"3\">Work package, deliverable, implementation event, plateau, gap</td></tr>\n</tbody></table>\n<p>In ArchiMate 4, generic behaviour such as process, function, event and service is defined once in the Common Domain and used in any domain; in 3.2 these exist as layer-specific variants (Business Process, Application Process, and so on). Check your tool&rsquo;s version.</p>\n<h4>Modelling a tax example</h4>\n<ul>\n<li><em>Taxpayer</em> (business actor) is assigned to the <em>Filer</em> role.</li>\n<li>The <em>File Excise Tax Return</em> process (behaviour) accesses the <em>Tax Return</em> business object.</li>\n<li>The <em>Return Submission</em> application service is realised by the <em>Tax Administration System</em> application component and serves the filing process.</li>\n<li>The <em>Tax Return</em> data object realises the <em>Tax Return</em> business object.</li>\n<li>The application component is deployed on a container platform node.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Modelling everything as an application component and drawing association lines. Use services and the proper relationship types; otherwise the model cannot be analysed.</div>\n<div class=\"callout gta\"><b>At GTA</b> Capabilities (Strategy domain) such as &ldquo;Refunds &amp; Credits&rdquo; should be realised by business behaviour and supported by application services. This chain is what lets the repository answer impact questions.</div>",
  "related": [
   "archimate-relationships",
   "archimate-4-whats-new",
   "capability-mapping",
   "content-framework-metamodel"
  ],
  "refs": [
   {
    "t": "ArchiMate Forum (The Open Group)",
    "u": "https://www.opengroup.org/archimate-forum"
   }
  ]
 },
 {
  "id": "archimate-relationships",
  "title": "ArchiMate Relationships",
  "cat": "ArchiMate & Modelling",
  "level": "Practitioner",
  "tags": [
   "archimate",
   "relationships",
   "serving",
   "realization",
   "derivation"
  ],
  "summary": "ArchiMate relationships carry the semantics of a model. Choosing the right one (serving vs realisation vs assignment) is what makes models analysable.",
  "minutes": 8,
  "body": "<p>Relationships are grouped into structural, dependency, dynamic and other categories. Each has precise meaning; the specification defines which relationships are allowed between which elements.</p>\n<table class=\"tbl\"><thead><tr><th>Category</th><th>Relationship</th><th>Meaning</th><th>Example</th></tr></thead><tbody>\n<tr><td rowspan=\"4\">Structural</td><td>Composition</td><td>Whole consists of parts; parts cannot exist without the whole</td><td>Tax Admin System composed of Returns module</td></tr>\n<tr><td>Aggregation</td><td>Whole groups parts; parts may belong to several wholes</td><td>Excise product group aggregates product categories</td></tr>\n<tr><td>Assignment</td><td>Allocation of responsibility, performance or execution</td><td>Role assigned to process; component assigned to function</td></tr>\n<tr><td>Realisation</td><td>An entity plays a critical role in creating or achieving a more abstract one</td><td>Application component realises application service; data object realises business object</td></tr>\n<tr><td rowspan=\"4\">Dependency</td><td>Serving</td><td>An element provides its functionality to another</td><td>Application service serves business process</td></tr>\n<tr><td>Access</td><td>Behaviour or active structure observes or acts on passive structure (read/write)</td><td>Assessment process reads Tax Return</td></tr>\n<tr><td>Influence</td><td>Affects motivation elements, optionally with +/- strength</td><td>Driver influences goal</td></tr>\n<tr><td>Association</td><td>Unspecified relationship; optionally directed</td><td>Use sparingly</td></tr>\n<tr><td rowspan=\"2\">Dynamic</td><td>Triggering</td><td>Temporal or causal precedence</td><td>Return submitted triggers assessment</td></tr>\n<tr><td>Flow</td><td>Transfer of information, goods or value</td><td>Risk score flows to audit selection</td></tr>\n<tr><td>Other</td><td>Specialisation, junction</td><td>Kind-of; and/or combination of relationships</td><td>Excise return is a specialisation of tax return</td></tr>\n</tbody></table>\n<h4>Derivation</h4>\n<p>ArchiMate defines derivation rules to infer indirect relationships from chains. For example, if a component realises a service that serves a process, one can derive that the component serves the process. Derivation powers impact analysis, but potential derivations should be validated; the specification distinguishes valid from potential derivations.</p>\n<h4>Common confusions</h4>\n<ul>\n<li><strong>Serving vs realisation</strong>: realisation goes from the concrete to the abstract (component &rarr; service); serving goes from the provider to the consumer (service &rarr; process).</li>\n<li><strong>Flow vs triggering</strong>: flow carries something; triggering just says what comes next.</li>\n<li><strong>Composition vs aggregation</strong>: if deleting the whole deletes the part, use composition.</li>\n<li><strong>Access direction</strong>: the arrow shows the direction of data (read: from object to behaviour), but the relationship is always modelled from behaviour to object.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Using association as a universal connector. A model full of associations cannot be queried for impact and conveys almost no information.</div>",
  "related": [
   "archimate-core-elements",
   "archimate-viewpoints-conventions",
   "archimate-4-whats-new",
   "notations-compared"
  ],
  "refs": [
   {
    "t": "ArchiMate Forum (The Open Group)",
    "u": "https://www.opengroup.org/archimate-forum"
   }
  ]
 },
 {
  "id": "archimate-viewpoints-conventions",
  "title": "Viewpoints and Modelling Conventions",
  "cat": "ArchiMate & Modelling",
  "level": "Practitioner",
  "tags": [
   "viewpoints",
   "conventions",
   "modelling standards",
   "repository quality"
  ],
  "summary": "Viewpoints control what each diagram shows for whom; modelling conventions keep a shared repository consistent and queryable as many people contribute.",
  "minutes": 8,
  "body": "<p>A shared repository modelled by many people will degrade without explicit conventions. Viewpoints define what each view contains; conventions define how elements are named, structured and maintained.</p>\n<h4>Commonly used viewpoints</h4>\n<table class=\"tbl\"><thead><tr><th>Viewpoint</th><th>Stakeholders</th><th>Typical content</th></tr></thead><tbody>\n<tr><td>Capability map</td><td>Executives, business architects</td><td>Capabilities, levels, heat colouring</td></tr>\n<tr><td>Strategy / motivation</td><td>Executives, planners</td><td>Drivers, goals, outcomes, courses of action, principles</td></tr>\n<tr><td>Business process cooperation</td><td>Process owners</td><td>Processes, events, roles, business objects, serving application services</td></tr>\n<tr><td>Application cooperation</td><td>Architects, integration teams</td><td>Components, interfaces, flows, data objects</td></tr>\n<tr><td>Application usage</td><td>Business and IT owners</td><td>Which processes use which application services</td></tr>\n<tr><td>Technology usage / deployment</td><td>Infrastructure, operations</td><td>Nodes, system software, artifacts, networks</td></tr>\n<tr><td>Implementation &amp; migration</td><td>Programme managers, TRB</td><td>Plateaus, gaps, work packages, deliverables</td></tr>\n</tbody></table>\n<h4>Modelling conventions checklist</h4>\n<ul>\n<li><strong>Naming</strong>: capabilities as nouns (&ldquo;Refund Management&rdquo;); processes as verb-noun (&ldquo;Assess Refund Claim&rdquo;); application components by product-neutral logical name plus property for product.</li>\n<li><strong>Language</strong>: one primary language for element names (e.g. English) with an Arabic name property where needed for business audiences.</li>\n<li><strong>Single source</strong>: one element per real-world thing; reuse elements across views rather than redrawing them.</li>\n<li><strong>Mandatory properties</strong>: owner, lifecycle status, classification, last reviewed date, source.</li>\n<li><strong>Folder structure</strong>: by domain and by landscape (baseline, transition, target).</li>\n<li><strong>Relationship discipline</strong>: no undirected association unless justified in documentation.</li>\n<li><strong>View hygiene</strong>: every view states its viewpoint, purpose, audience and status (draft/approved).</li>\n<li><strong>Colour</strong>: use the standard domain colours; reserve additional colour for heat maps with a legend.</li>\n</ul>\n<h4>Quality checks to automate</h4>\n<ol>\n<li>Elements not used in any view, or with no relationships (orphans).</li>\n<li>Duplicate names within the same element type.</li>\n<li>Applications without owner or lifecycle status.</li>\n<li>Capabilities with no realising behaviour or supporting application.</li>\n<li>Relationship types not allowed by the specification (tools usually enforce this).</li>\n</ol>\n<div class=\"callout gta\"><b>At GTA</b> Publish the conventions as a short modelling guide with a one-page visual cheat sheet, and run the quality queries monthly; report results as part of repository currency KPIs.</div>",
  "related": [
   "iso-42010",
   "repository-governance",
   "archimate-core-elements",
   "archimate-relationships"
  ],
  "refs": [
   {
    "t": "ArchiMate Forum (The Open Group)",
    "u": "https://www.opengroup.org/archimate-forum"
   }
  ]
 },
 {
  "id": "notations-compared",
  "title": "ArchiMate vs UML vs BPMN vs C4",
  "cat": "ArchiMate & Modelling",
  "level": "Practitioner",
  "tags": [
   "c4 model",
   "uml",
   "bpmn",
   "archimate",
   "notation"
  ],
  "summary": "Each notation serves a different audience and level of detail. Use ArchiMate for enterprise relationships, BPMN for executable process detail, C4 and UML for software design.",
  "minutes": 7,
  "diagram": "c4-levels",
  "body": "<p>Notation debates waste time when the real question is: <em>which stakeholders and which concerns?</em> Most mature architecture practices use several notations, linked by consistent naming.</p>\n<table class=\"tbl\"><thead><tr><th>Notation</th><th>Steward</th><th>Best for</th><th>Not ideal for</th></tr></thead><tbody>\n<tr><td><strong>ArchiMate</strong></td><td>The Open Group</td><td>Cross-domain enterprise models: capabilities to applications to technology; impact analysis; roadmaps</td><td>Detailed process logic or class-level software design</td></tr>\n<tr><td><strong>BPMN 2.0</strong></td><td>OMG</td><td>Detailed business processes, exceptions, events, executable workflows</td><td>Application landscapes and infrastructure</td></tr>\n<tr><td><strong>UML</strong></td><td>OMG</td><td>Software design: classes, sequences, states, components, deployments</td><td>Business-facing communication</td></tr>\n<tr><td><strong>C4 model</strong></td><td>Simon Brown (community)</td><td>Software architecture at four zoom levels: System Context, Containers, Components, Code</td><td>Enterprise-wide portfolio analysis</td></tr>\n</tbody></table>\n<h4>C4 in brief</h4>\n<dl class=\"defs\">\n<dt>Level 1 &ndash; System Context</dt><dd>The system, its users and the external systems it interacts with. Audience: everyone.</dd>\n<dt>Level 2 &ndash; Container</dt><dd>Separately deployable or runnable units (web app, API, database, queue) and their interactions. Audience: technical staff.</dd>\n<dt>Level 3 &ndash; Component</dt><dd>Major structural building blocks inside a container. Audience: developers and architects.</dd>\n<dt>Level 4 &ndash; Code</dt><dd>Classes and similar; usually generated by tools rather than drawn.</dd>\n</dl>\n<p>C4 also includes supplementary diagrams: system landscape, dynamic and deployment diagrams.</p>\n<h4>Linking notations</h4>\n<ul>\n<li>An ArchiMate application component corresponds to a C4 software system (or container); keep the same name and identifier.</li>\n<li>An ArchiMate process that needs detail links to a BPMN model.</li>\n<li>ArchiMate deployment views at enterprise level; C4 deployment diagrams at solution level.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> A practical rule: EA repository in ArchiMate; Solution Architecture Documents use C4 context and container diagrams plus a deployment view; process owners use BPMN; identifiers link them all.</div>",
  "related": [
   "archimate-4-whats-new",
   "tpl-solution-architecture-document",
   "iso-42010",
   "business-services-process"
  ],
  "refs": [
   {
    "t": "The C4 model for visualising software architecture",
    "u": "https://c4model.com"
   },
   {
    "t": "OMG BPMN specification",
    "u": "https://www.omg.org/spec/BPMN/"
   },
   {
    "t": "ArchiMate Forum (The Open Group)",
    "u": "https://www.opengroup.org/archimate-forum"
   }
  ]
 },
 {
  "id": "ea-governance-model",
  "title": "EA Governance Model",
  "cat": "Governance",
  "level": "Practitioner",
  "tags": [
   "governance",
   "decision rights",
   "standards",
   "compliance"
  ],
  "summary": "Architecture governance is the practice by which architectures are managed and controlled at enterprise level: who decides, on what, using which criteria, with what evidence.",
  "minutes": 8,
  "diagram": "governance-flow",
  "body": "<p>TOGAF describes architecture governance as the practice and orientation by which enterprise architectures and other architectures are managed and controlled at an enterprise-wide level. It operates within corporate and IT governance, not in parallel to them.</p>\n<h4>Governance characteristics (TOGAF)</h4>\n<p>Discipline, transparency, independence, accountability, responsibility and fairness. In practice: decisions are documented, criteria are published, conflicts of interest are managed, and every decision has a named owner.</p>\n<h4>Components of a governance model</h4>\n<table class=\"tbl\"><thead><tr><th>Component</th><th>Description</th></tr></thead><tbody>\n<tr><td>Structures</td><td>Steering committee (strategy, funding), architecture board (at GTA the Technical Review Board, TRB), project Design Authorities, domain working groups (data, security, integration)</td></tr>\n<tr><td>Decision rights</td><td>Who approves principles, standards, target architectures, solution designs, waivers</td></tr>\n<tr><td>Processes</td><td>Review at investment gates, compliance assessment, dispensation, standards lifecycle, escalation</td></tr>\n<tr><td>Artifacts</td><td>Principles, standards catalog, reference architectures, architecture contracts, decision log, waiver register</td></tr>\n<tr><td>Metrics</td><td>Cycle time, compliance level distribution, waivers outstanding, reuse rate</td></tr>\n</tbody></table>\n<h4>Decision rights (RACI extract)</h4>\n<table class=\"tbl\"><thead><tr><th>Decision</th><th>Steering</th><th>TRB</th><th>EA team</th><th>Project</th></tr></thead><tbody>\n<tr><td>Architecture principles</td><td>A</td><td>R</td><td>R</td><td>C</td></tr>\n<tr><td>Technology standards</td><td>I</td><td>A</td><td>R</td><td>C</td></tr>\n<tr><td>Solution architecture approval</td><td>I</td><td>A</td><td>C</td><td>R</td></tr>\n<tr><td>Waiver/dispensation (time-boxed)</td><td>I (C if high risk)</td><td>A</td><td>R</td><td>R</td></tr>\n<tr><td>Target architecture and roadmap</td><td>A</td><td>R</td><td>R</td><td>C</td></tr>\n</tbody></table>\n<h4>Fitting the model to Qatar GEA</h4>\n<table class=\"tbl\"><thead><tr><th>Generic structure</th><th>GEA body</th><th>GTA status (2025 baseline)</th></tr></thead><tbody>\n<tr><td>National strategy and high-impact exceptions</td><td>ICT Governance Board (QDG Steering Committee)</td><td>External to GTA</td></tr>\n<tr><td>National architecture authority, medium-impact exceptions, appeals</td><td>WoG Architecture Review Board (ARB), Office of the Chief Architect</td><td>External to GTA (MCIT)</td></tr>\n<tr><td>Agency steering</td><td>Agency architecture sponsor (CIO or senior executive)</td><td>IT Steering Committee in place, meets ad hoc</td></tr>\n<tr><td>Agency architecture board, low-impact exceptions</td><td>Technical Review Board (TRB)</td><td>To be established with the planned EA Office</td></tr>\n<tr><td>Project design governance</td><td>Design Authority per solution, checkpoints Discovery / Alpha / Beta / Live</td><td>To be introduced</td></tr>\n</tbody></table>\n<h4>Integration points</h4>\n<ul>\n<li><strong>Investment management</strong>: no funding release without architecture review at concept stage.</li>\n<li><strong>Procurement</strong>: RFPs include the GEA tender compliance statement, architecture standards and NFRs; evaluation includes an architect.</li>\n<li><strong>Change management (ITSM)</strong>: production changes introducing new technology reference an approved decision.</li>\n<li><strong>Risk and audit</strong>: waivers feed the risk register.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> The organisation decision gives Planning &amp; Quality a mandate to verify alignment of work systems and methods with the Authority&rsquo;s objectives, and Information Technology responsibility for planning and developing information systems. The EA governance RACI should make these complementary roles explicit, and add the GEA roles: sponsor, agency enterprise architect, TRB and Design Authorities.</div>",
  "related": [
   "arb-operating-model",
   "gea-governance",
   "gta-it-governance-baseline",
   "architecture-contracts-waivers"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "arb-operating-model",
  "title": "Technical Review Board (TRB): Operating Model",
  "cat": "Governance",
  "level": "Practitioner",
  "tags": [
   "trb",
   "architecture board",
   "review",
   "decision",
   "gea"
  ],
  "summary": "How GTA's architecture board - the GEA agency-level Technical Review Board - should be constituted, tiered and run, and how it connects to Design Authorities and GEA exception levels.",
  "minutes": 8,
  "body": "<p>At GTA the architecture board is the <strong>Technical Review Board (TRB)</strong>, the agency-level body that the GEA Governance Model requires every agency to establish, with a &ldquo;compliance focus&rdquo;: ensuring solution architectures conform to GEA and the principles, and enforcing compliance or approving low-impact exceptions. It is the TOGAF Architecture Board applied in a GEA context.</p>\n<p>TOGAF&rsquo;s Architecture Board is responsible for consistency between sub-architectures, identifying reusable components, flexibility of the architecture, enforcing compliance, improving maturity and resolving ambiguities and conflicts. An effective TRB makes high-quality decisions quickly and visibly.</p>\n<h4>Membership</h4>\n<ul>\n<li>GEA minimum: the agency architecture sponsor, the agency-nominated enterprise architect, and invited members as required (project, integration, security).</li>\n<li>Chair: Chief/Lead Enterprise Architect (or delegated senior IT leader).</li>\n<li>Core: domain architects (business, data, application/integration, technology, security).</li>\n<li>Rotating: operations/infrastructure, service management, business representative for the segment under review.</li>\n<li>Secretariat: maintains agenda, decision log and waiver register.</li>\n</ul>\n<h4>Tiered review</h4>\n<table class=\"tbl\"><thead><tr><th>Tier</th><th>Trigger</th><th>Forum</th><th>Target SLA</th></tr></thead><tbody>\n<tr><td>0 &ndash; Self-assessment</td><td>Standard pattern, no new technology, no new external integration</td><td>Checklist submitted; spot checks</td><td>2 working days</td></tr>\n<tr><td>1 &ndash; Desk review</td><td>Minor deviations, internal integration changes</td><td>Two architects asynchronously</td><td>5 working days</td></tr>\n<tr><td>2 &ndash; Full board</td><td>New technology, external data sharing, sensitive data, significant cost or risk</td><td>Scheduled TRB session</td><td>Next session (fortnightly)</td></tr>\n<tr><td>3 &ndash; Escalation</td><td>Strategic impact, unresolved conflict, high residual risk; GEA exceptions beyond low impact</td><td>IT Steering Committee; medium-impact GEA exceptions to the WoG ARB (MCIT), high-impact to the ICT Governance Board</td><td>Per committee cycle</td></tr>\n</tbody></table>\n<h4>Decision outcomes</h4>\n<dl class=\"defs\">\n<dt>Approved</dt><dd>Proceed as designed.</dd>\n<dt>Approved with conditions</dt><dd>Proceed; conditions recorded with owners and dates, verified at the next gate.</dd>\n<dt>Deferred</dt><dd>Insufficient information; specific questions returned.</dd>\n<dt>Rejected</dt><dd>Does not meet principles or standards; rationale recorded and alternatives suggested.</dd>\n</dl>\n<h4>Running a good session</h4>\n<ol>\n<li>Pre-read distributed at least three working days ahead; incomplete submissions are not scheduled.</li>\n<li>Presenter focuses on decisions and trade-offs, not on a tour of slides.</li>\n<li>Decision and conditions stated before the item closes; logged the same day.</li>\n<li>Publish decisions so other teams can reuse them as precedents.</li>\n</ol>\n<h4>TRB and Design Authorities</h4>\n<p>GEA pairs the TRB with a <strong>Design Authority</strong> for each new solution (project manager, lead architect &mdash; possibly the vendor&rsquo;s &mdash; and the agency enterprise architect). The DA owns day-to-day design decisions; the TRB runs checkpoint reviews at <strong>Discovery, Alpha, Beta and Live</strong>, where the DA demonstrates GEA alignment, shared services and cross-agency information assets leveraged, and standards compliance. The tiers above decide how heavy each checkpoint is.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Reviewing too late &mdash; after contracts are signed. Engage at Discovery when options are still open, then verify at Alpha, Beta and Live.</div>\n<div class=\"callout gta\"><b>At GTA</b> The TRB does not yet exist: the 2025 baseline records a planned EA Office and an IT Steering Committee and CAB in place. Chartering the TRB is a GEA obligation (Governance Model, policy 5.1) and the natural first act of the EA Office.</div>",
  "related": [
   "gea-governance",
   "chk-arb-submission",
   "chk-gea-compliance",
   "architecture-contracts-waivers"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "compliance-review-levels",
  "title": "Architecture Compliance Reviews and Levels",
  "cat": "Governance",
  "level": "Practitioner",
  "tags": [
   "compliance",
   "conformance",
   "review",
   "togaf"
  ],
  "summary": "TOGAF defines graded compliance levels (from Irrelevant to Fully Conformant, plus Non-conformant) and a review process to verify that implementations follow the architecture.",
  "minutes": 7,
  "body": "<p>Compliance review is the Phase G mechanism for verifying that projects and systems actually implement the architecture. It also feeds back into the architecture: repeated non-compliance often means the standard, not the project, needs to change.</p>\n<h4>TOGAF compliance levels</h4>\n<table class=\"tbl\"><thead><tr><th>Level</th><th>Meaning</th></tr></thead><tbody>\n<tr><td><strong>Irrelevant</strong></td><td>The implementation has no features in common with the architecture specification.</td></tr>\n<tr><td><strong>Consistent</strong></td><td>Has some features in common; those features are implemented in accordance with the specification, but some specification features are not implemented and the implementation has features not covered by the specification.</td></tr>\n<tr><td><strong>Compliant</strong></td><td>Some features in the specification are not implemented, but all features implemented are covered by the specification and in accordance with it.</td></tr>\n<tr><td><strong>Conformant</strong></td><td>All features in the specification are implemented in accordance with it, but some additional features are implemented that are not in accordance with it.</td></tr>\n<tr><td><strong>Fully Conformant</strong></td><td>Full correspondence between specification and implementation.</td></tr>\n<tr><td><strong>Non-conformant</strong></td><td>Any of the above in which some features are implemented <em>not</em> in accordance with the specification.</td></tr>\n</tbody></table>\n<h4>Review process (simplified)</h4>\n<ol>\n<li>Request review (triggered by gate, contract or schedule).</li>\n<li>Identify responsible parties, scope and checklists.</li>\n<li>Gather evidence: designs, configurations, test results, scans.</li>\n<li>Conduct review; produce findings with severity.</li>\n<li>Agree remediation, waivers or architecture updates.</li>\n<li>Issue Compliance Assessment and log in the governance repository.</li>\n</ol>\n<h4>Checklist areas</h4>\n<ul>\n<li>Business: does the solution support the intended capabilities and processes?</li>\n<li>Data: owners, classification, master data usage, retention, quality controls.</li>\n<li>Application: ARM reference architecture, standard integration patterns (GDX for inter-agency exchange), API standards, reuse of WoG and GTA shared services.</li>\n<li>Technology: approved hosting, supported versions, environments, observability.</li>\n<li>Security: identity, encryption, logging, vulnerability management, threat model.</li>\n<li>Operations: runbooks, monitoring, backup and DR tested to tier.</li>\n</ul>\n<h4>Relation to the GEA self-assessment</h4>\n<p>The GEA compliance self-assessment uses a simpler scale: <strong>Fully Compliant, Partially Compliant, Not Compliant, N/A</strong> (N/A only for project-level statements; comments required for anything not fully compliant). A practical mapping: TOGAF <em>Fully Conformant</em> and <em>Conformant</em> &rarr; Fully Compliant; <em>Compliant</em> and <em>Consistent</em> &rarr; Partially Compliant; <em>Non-conformant</em> &rarr; Not Compliant unless an approved exception exists. Record both in the TRB decision log, and review at the GEA checkpoints (Discovery, Alpha, Beta, Live).</p>\n<div class=\"callout note\"><b>Note</b> Graded levels are more useful than pass/fail: they make partial adoption visible and show where a standard may be over-specified.</div>\n<div class=\"callout gta\"><b>At GTA</b> Report the distribution of compliance levels across the portfolio quarterly, and feed the same evidence into the GEA self-assessment, where project-level statements count the number of projects in each compliance category. A rising share of fully compliant projects is a credible EA outcome metric.</div>",
  "related": [
   "architecture-contracts-waivers",
   "arb-operating-model",
   "gea-governance",
   "chk-gea-compliance"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "architecture-contracts-waivers",
  "title": "Architecture Contracts, Waivers and Dispensations",
  "cat": "Governance",
  "level": "Practitioner",
  "tags": [
   "architecture contract",
   "waiver",
   "dispensation",
   "risk"
  ],
  "summary": "Architecture contracts make expectations between architecture and delivery explicit; dispensations allow controlled, time-boxed deviation with recorded risk and remediation.",
  "minutes": 7,
  "body": "<h4>Architecture contracts</h4>\n<p>In TOGAF, an Architecture Contract is a joint agreement between development partners and sponsors on the deliverables, quality and fitness-for-purpose of an architecture. Contracts are typically produced in Phase G and used to govern implementation.</p>\n<table class=\"tbl\"><thead><tr><th>Section</th><th>Content</th></tr></thead><tbody>\n<tr><td>Introduction and scope</td><td>Solution, phases covered, parties</td></tr>\n<tr><td>Architecture deliverables</td><td>Designs, ADRs, models to be maintained in the repository</td></tr>\n<tr><td>Conformance requirements</td><td>Standards, principles and reference architectures that apply; target compliance level</td></tr>\n<tr><td>Quality attributes</td><td>NFR targets (availability, performance, RPO/RTO, security)</td></tr>\n<tr><td>Review checkpoints</td><td>Design review, pre-go-live, post-implementation</td></tr>\n<tr><td>Change and dispensation process</td><td>How deviations are raised and approved</td></tr>\n<tr><td>Signatures</td><td>Sponsor, delivery lead, architecture authority</td></tr>\n</tbody></table>\n<p>For external suppliers, architecture conformance clauses belong in the commercial contract too; an internal architecture contract alone is not enforceable on a vendor. In Qatar, every ICT tender must also carry the GEA compliance statement (Governance Model, Appendix 4), which makes vendors responsible for complying with GEA reference architectures and standards.</p>\n<h4>Waivers and dispensations</h4>\n<p>A dispensation (waiver) allows a solution to deviate from a standard or principle for a defined period, because compliance is impractical now. It is a risk-acceptance decision, not a loophole.</p>\n<dl class=\"defs\">\n<dt>Requirement for a valid dispensation</dt><dd>Specific deviation stated; business justification; risk assessment; compensating controls; expiry date; remediation plan with owner and funding; approver.</dd>\n<dt>Expiry</dt><dd>Typically 6&ndash;12 months; renewal requires re-justification.</dd>\n<dt>Register</dt><dd>All dispensations are tracked in a register, reviewed periodically, and linked to the risk register.</dd>\n</dl>\n<h4>GEA exception levels</h4>\n<p>GEA does not use the word &ldquo;waiver&rdquo;; it speaks of <strong>exceptions</strong>, raised by the project Design Authority to the agency TRB with justification:</p>\n<table class=\"tbl\"><thead><tr><th>Impact</th><th>Approved by</th></tr></thead><tbody>\n<tr><td>Low</td><td>Agency Technical Review Board (TRB)</td></tr>\n<tr><td>Medium</td><td>WoG Architecture Review Board (ARB), on request from the TRB</td></tr>\n<tr><td>High</td><td>ICT Governance Board (QDG Steering Committee)</td></tr>\n</tbody></table>\n<p>GEA does not define the impact levels, so GTA must publish criteria (for example: deviation from a mandatory GEA standard or non-use of a mandated shared service is at least medium). Add the impact level and the approving body to every register entry.</p>\n<h4>Waiver register fields</h4>\n<pre class=\"code\">ID | Solution | Standard/principle deviated | Reason\nRisk rating (L/M/H) | GEA impact level | Compensating controls\nApproved by | Approval date | Expiry date\nRemediation plan | Remediation owner | Funding reference\nStatus (Active / Remediated / Expired / Renewed)</pre>\n<div class=\"callout warn\"><b>Pitfall</b> Waivers without expiry. They silently become the de facto standard and the actual architecture diverges from the documented one.</div>\n<div class=\"callout gta\"><b>At GTA</b> Realistic example from the baseline: internal integrations are point-to-point and no integration platform exists yet. A project needing a new Dhareeba interface before the platform is in place could receive a time-boxed, low-impact exception for a direct integration with mutual TLS, an interface catalogue entry and payload logging as compensating controls, conditional on migrating to the platform in the next transition architecture.</div>",
  "related": [
   "compliance-review-levels",
   "gea-governance",
   "tpl-tech-debt-register",
   "arb-operating-model"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "repository-governance",
  "title": "Architecture Repository and Its Governance",
  "cat": "Governance",
  "level": "Practitioner",
  "tags": [
   "architecture repository",
   "metamodel",
   "data quality",
   "ownership"
  ],
  "summary": "The Architecture Repository stores the landscape, standards, reference material and governance records. Without ownership and update triggers it decays quickly.",
  "minutes": 7,
  "diagram": "architecture-repository",
  "body": "<p>TOGAF describes an Architecture Repository with several classes of content. Names have varied slightly across editions; the commonly used structure is:</p>\n<table class=\"tbl\"><thead><tr><th>Area</th><th>Holds</th></tr></thead><tbody>\n<tr><td>Architecture Metamodel</td><td>The tailored metamodel, method and content framework used by the organisation</td></tr>\n<tr><td>Architecture Capability</td><td>Parameters, structures and processes of the EA practice itself (governance, skills, tooling)</td></tr>\n<tr><td>Architecture Landscape</td><td>Baseline, transition and target architectures at strategic, segment and capability levels</td></tr>\n<tr><td>Standards (Standards Information Base)</td><td>Adopted standards: legal, regulatory, industry, national (e.g. GEA), and organisational</td></tr>\n<tr><td>Reference Library</td><td>Reference models, patterns, templates and guidelines</td></tr>\n<tr><td>Governance Log</td><td>Decisions, compliance assessments, contracts, dispensations, capability assessments, calendar</td></tr>\n<tr><td>Architecture Requirements Repository</td><td>Requirements agreed with the Architecture Board</td></tr>\n<tr><td>Solutions Landscape</td><td>Solution building blocks supporting the architecture</td></tr>\n</tbody></table>\n<h4>Ownership model</h4>\n<table class=\"tbl\"><thead><tr><th>Content</th><th>Accountable owner</th><th>Update trigger</th></tr></thead><tbody>\n<tr><td>Capability map</td><td>Business architect</td><td>Strategy refresh, organisational change</td></tr>\n<tr><td>Application records</td><td>Application/product owner</td><td>Release, contract renewal, lifecycle change</td></tr>\n<tr><td>Interfaces</td><td>Integration lead</td><td>New/changed integration in change management</td></tr>\n<tr><td>Data entities</td><td>Data owner / steward</td><td>Schema change, classification review</td></tr>\n<tr><td>Technology standards</td><td>Technology architect</td><td>Vendor end-of-support announcements, TRB decisions</td></tr>\n<tr><td>Decisions and waivers</td><td>TRB secretariat</td><td>Every TRB session</td></tr>\n</tbody></table>\n<h4>Keeping it current</h4>\n<ul>\n<li>Integrate with existing processes: ITSM change records, CMDB discovery, project gates and procurement.</li>\n<li>Prefer automated feeds (cloud inventories, CMDB, API catalogue) for technology facts; reserve manual effort for meaning (capability mapping, ownership).</li>\n<li>Run monthly quality queries (missing owners, stale review dates) and publish scores per owner.</li>\n<li>Version and baseline: freeze an approved snapshot per planning cycle.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Modelling everything at high detail. Repository scope should be driven by the questions it must answer; unused detail is maintenance cost with no value.</div>",
  "related": [
   "enterprise-continuum-repository",
   "archimate-viewpoints-conventions",
   "ea-value-maturity",
   "content-framework-metamodel"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "capability-mapping",
  "title": "Business Capability Mapping and Heat Maps",
  "cat": "Business Architecture",
  "level": "Foundation",
  "tags": [
   "capability map",
   "heat map",
   "business architecture",
   "planning"
  ],
  "summary": "A capability map describes what the organisation does, independent of how or by whom. Heat mapping overlays assessments to direct investment.",
  "minutes": 8,
  "diagram": "capability-map-gta",
  "body": "<p>A business capability is a particular ability that a business may possess or exchange to achieve a specific purpose or outcome. Capabilities are stable: the way a tax authority registers taxpayers changes often; the need to register them does not. That stability makes the capability map the most useful anchor in the repository.</p>\n<h4>Rules for a good capability map</h4>\n<ul>\n<li>Named as nouns or noun phrases (&ldquo;Refund Management&rdquo;, not &ldquo;Process refunds&rdquo;).</li>\n<li>Describes <em>what</em>, not <em>how</em> or <em>who</em>; no system or unit names.</li>\n<li>Mutually exclusive and collectively exhaustive at each level.</li>\n<li>Two to three levels deep is usually enough for planning; level 1 fits on one page.</li>\n<li>Typically grouped into strategic (direction), core (customer-facing / mission) and supporting capabilities.</li>\n</ul>\n<h4>Illustrative tax-authority capability map (level 1 &rarr; level 2)</h4>\n<table class=\"tbl\"><thead><tr><th>Group</th><th>Level 1</th><th>Example level 2</th></tr></thead><tbody>\n<tr><td rowspan=\"3\">Strategic</td><td>Tax Policy &amp; Strategy</td><td>Policy analysis, revenue forecasting</td></tr>\n<tr><td>Performance &amp; Quality Management</td><td>KPI management, process quality</td></tr>\n<tr><td>Stakeholder &amp; International Relations</td><td>Exchange of information, tax treaty administration</td></tr>\n<tr><td rowspan=\"6\">Core</td><td>Taxpayer Management</td><td>Taxpayer registration, profile management, representative management</td></tr>\n<tr><td>Returns &amp; Assessment</td><td>Return filing, assessment &amp; verification</td></tr>\n<tr><td>Compliance Management</td><td>Risk scoring, audit management, investigations</td></tr>\n<tr><td>Revenue Management</td><td>Payment &amp; collection, refunds &amp; credits, debt management</td></tr>\n<tr><td>Disputes</td><td>Objections &amp; appeals</td></tr>\n<tr><td>Excise Administration</td><td>Warehouse licensing, excise goods control</td></tr>\n<tr><td rowspan=\"3\">Supporting</td><td>Taxpayer Engagement</td><td>Taxpayer support, guidance &amp; education</td></tr>\n<tr><td>Data &amp; Analytics</td><td>Revenue analytics, data management</td></tr>\n<tr><td>Corporate Support</td><td>HR, finance, procurement, legal, information systems</td></tr>\n</tbody></table>\n<h4>Heat mapping</h4>\n<p>Overlay capabilities with assessment dimensions, using a consistent 3- or 5-point scale and a written rubric:</p>\n<ul>\n<li><strong>Strategic importance</strong> &mdash; contribution to strategic objectives.</li>\n<li><strong>Performance / maturity</strong> &mdash; effectiveness, efficiency, quality today.</li>\n<li><strong>Technology support</strong> &mdash; fitness, lifecycle and risk of supporting applications.</li>\n<li><strong>Data quality</strong> of the data the capability depends on.</li>\n<li><strong>Investment</strong> &mdash; current spend versus importance.</li>\n</ul>\n<p>The most useful insight is the combination: high importance plus low performance plus weak technology support marks investment priorities; low importance plus high spend marks savings opportunities.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Heat maps based on one architect&rsquo;s opinion. Score in workshops with capability owners, record evidence, and repeat annually to show movement.</div>\n<div class=\"callout gta\"><b>At GTA</b> The heat map in the diagram is indicative: it reflects the themes of the April 2025 current state report (data quality and reporting, integration, automation gaps such as case management, GRC and PMO tooling, resilience) rather than a formal scored assessment of each capability. When GTA scores its business capabilities, link each one to its GEA BRM functional area (mostly 14.1 Taxes) so the map can be reported in national terms.</div>",
  "related": [
   "capability-based-planning",
   "gea-brm",
   "business-services-process",
   "gta-strategy-to-solution"
  ],
  "refs": [
   {
    "t": "Business Architecture Guild",
    "u": "https://www.businessarchitectureguild.org"
   },
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "value-streams",
  "title": "Value Streams",
  "cat": "Business Architecture",
  "level": "Practitioner",
  "tags": [
   "value stream",
   "stakeholder value",
   "business architecture",
   "journey"
  ],
  "summary": "A value stream is an end-to-end set of value-adding stages that deliver an outcome to a stakeholder. Mapping stages to capabilities shows where change is needed.",
  "minutes": 7,
  "body": "<p>A value stream represents an end-to-end collection of value-adding activities that create an overall result for a customer, stakeholder or end user. In business architecture practice, value streams are expressed as a sequence of <strong>stages</strong>, each producing an incremental value item, and each enabled by capabilities.</p>\n<h4>Value stream vs related concepts</h4>\n<table class=\"tbl\"><thead><tr><th>Concept</th><th>Focus</th><th>Granularity</th></tr></thead><tbody>\n<tr><td>Value stream</td><td>Stakeholder value delivered, end to end</td><td>5&ndash;10 stages; stable</td></tr>\n<tr><td>Customer journey</td><td>Experience and touchpoints from the customer&rsquo;s perspective</td><td>Emotional and channel detail</td></tr>\n<tr><td>Business process</td><td>How work is performed, with sequence, rules and roles</td><td>Detailed; changes frequently</td></tr>\n<tr><td>Lean value stream map</td><td>Flow efficiency: wait times, handoffs, waste</td><td>Operational metrics</td></tr>\n</tbody></table>\n<h4>Example: &ldquo;Obtain Tax Refund&rdquo;</h4>\n<table class=\"tbl\"><thead><tr><th>Stage</th><th>Value item</th><th>Enabling capabilities</th></tr></thead><tbody>\n<tr><td>1. Establish entitlement</td><td>Taxpayer knows a refund is due</td><td>Return filing, guidance &amp; education</td></tr>\n<tr><td>2. Submit claim</td><td>Complete claim received</td><td>Return filing, taxpayer support, identity (NAS)</td></tr>\n<tr><td>3. Verify claim</td><td>Claim validated against records and risk</td><td>Assessment &amp; verification, risk scoring</td></tr>\n<tr><td>4. Decide</td><td>Approved/adjusted amount, with reasons</td><td>Refunds &amp; credits, audit management (if selected)</td></tr>\n<tr><td>5. Pay</td><td>Funds received</td><td>Payment &amp; collection, debt offset</td></tr>\n<tr><td>6. Resolve disputes</td><td>Fair outcome</td><td>Objections &amp; appeals</td></tr>\n</tbody></table>\n<h4>How to use it</h4>\n<ul>\n<li>Attach metrics to each stage (cycle time, rework rate, satisfaction) to locate bottlenecks.</li>\n<li>Cross-map to the capability heat map: weak capabilities on critical stages are priorities.</li>\n<li>Use stages to scope initiatives so they deliver complete stakeholder value, not isolated system features.</li>\n<li>Identify the &ldquo;triggering stakeholder&rdquo; and any participating stakeholders (banks, other ministries).</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Value streams support the objective Enhance Taxpayer Services and Satisfaction directly: they express performance in terms taxpayers recognise (time to refund, number of contacts needed) rather than system uptime.</div>",
  "related": [
   "capability-mapping",
   "business-services-process",
   "capability-based-planning",
   "stakeholder-management"
  ],
  "refs": [
   {
    "t": "Business Architecture Guild",
    "u": "https://www.businessarchitectureguild.org"
   }
  ]
 },
 {
  "id": "business-services-process",
  "title": "Capabilities, Processes and Business Services",
  "cat": "Business Architecture",
  "level": "Foundation",
  "tags": [
   "process",
   "capability",
   "business service",
   "modelling"
  ],
  "summary": "Capabilities say what, processes say how, and business services say what is offered to others. Confusing them produces maps that cannot be maintained.",
  "minutes": 6,
  "body": "<p>Three concepts are frequently confused in business architecture work. They are complementary views of the same organisation.</p>\n<table class=\"tbl\"><thead><tr><th>Aspect</th><th>Capability</th><th>Process</th><th>Business service</th></tr></thead><tbody>\n<tr><td>Question</td><td>What can we do?</td><td>How is it done, step by step?</td><td>What do we offer to a consumer?</td></tr>\n<tr><td>Stability</td><td>High</td><td>Low to medium</td><td>Medium</td></tr>\n<tr><td>Viewpoint</td><td>Internal, abstract</td><td>Internal, operational</td><td>External, contract-like</td></tr>\n<tr><td>Naming</td><td>Noun (&ldquo;Taxpayer Registration&rdquo;)</td><td>Verb-noun (&ldquo;Verify registration documents&rdquo;)</td><td>Consumer-oriented (&ldquo;Register a business for tax&rdquo;)</td></tr>\n<tr><td>Measured by</td><td>Maturity, importance</td><td>Cycle time, cost, error rate</td><td>Service level, satisfaction</td></tr>\n<tr><td>Notation</td><td>Capability map (ArchiMate Strategy)</td><td>BPMN, ArchiMate process</td><td>Service catalogue, ArchiMate service</td></tr>\n</tbody></table>\n<h4>How they relate</h4>\n<ul>\n<li>A capability is <em>realised</em> by processes, people, information and technology working together.</li>\n<li>A business service is <em>realised</em> by one or more processes and is exposed through channels.</li>\n<li>A process may contribute to several capabilities; avoid forcing one-to-one mapping.</li>\n</ul>\n<h4>Business service description (template)</h4>\n<dl class=\"defs\">\n<dt>Service name</dt><dd>Apply for a tax warehouse licence</dd>\n<dt>Consumer</dt><dd>Excise goods importers and producers</dd>\n<dt>Channels</dt><dd>Dhareeba portal; assisted service</dd>\n<dt>Inputs</dt><dd>Registration details, premises information, supporting documents</dd>\n<dt>Outputs</dt><dd>Licence decision, licence certificate, conditions</dd>\n<dt>Service level</dt><dd>Decision within a published number of working days (set by policy)</dd>\n<dt>Realising processes</dt><dd>Receive application, risk assessment, inspection, decision, issue licence</dd>\n<dt>Supporting capabilities</dt><dd>Excise administration, compliance management, taxpayer management</dd>\n</dl>\n<div class=\"callout warn\"><b>Pitfall</b> Building a capability map from the organisation chart. Units change with every restructure; capabilities should not.</div>\n<div class=\"callout gta\"><b>At GTA</b> The &ldquo;percentage of processes digitised or automated&rdquo; KPI needs an agreed process inventory at a stable level of granularity. Anchoring that inventory to capabilities avoids double-counting and makes progress comparable year on year.</div>",
  "related": [
   "capability-mapping",
   "value-streams",
   "notations-compared",
   "archimate-core-elements"
  ],
  "refs": [
   {
    "t": "OMG BPMN specification",
    "u": "https://www.omg.org/spec/BPMN/"
   }
  ]
 },
 {
  "id": "capability-based-planning",
  "title": "Capability-Based Planning",
  "cat": "Business Architecture",
  "level": "Advanced",
  "tags": [
   "capability-based planning",
   "portfolio",
   "investment",
   "roadmap"
  ],
  "summary": "Capability-based planning organises investment around business capability increments rather than projects, so that delivery is measured by capabilities gained.",
  "minutes": 7,
  "body": "<p>Capability-based planning (CBP), described among TOGAF&rsquo;s ADM techniques, focuses on planning, engineering and delivering strategic business capabilities. Its premise: executives fund outcomes, and capabilities are the bridge between outcomes and projects.</p>\n<h4>Key ideas</h4>\n<dl class=\"defs\">\n<dt>Capability increment</dt><dd>A discrete, measurable improvement in a capability delivered at a point in time (e.g. &ldquo;Refund verification: automated for low-risk claims&rdquo;).</dd>\n<dt>Capability dimensions</dt><dd>A capability increment needs change across several dimensions &mdash; people, process, information, technology, facilities, governance &mdash; often delivered by different projects.</dd>\n<dt>Cross-project alignment</dt><dd>Projects are sequenced so that all dimensions of an increment land together; otherwise the capability is not actually gained.</dd>\n</dl>\n<h4>Planning steps</h4>\n<ol>\n<li>Start from strategic objectives and outcomes with KPIs.</li>\n<li>Identify the capabilities that most influence those outcomes (heat map).</li>\n<li>Define target capability levels and increments over the planning horizon.</li>\n<li>Decompose each increment into dimensions and work packages.</li>\n<li>Assemble work packages into projects and transition architectures.</li>\n<li>Track progress by increments achieved, not by project milestones alone.</li>\n</ol>\n<h4>Example increment plan (illustrative)</h4>\n<table class=\"tbl\"><thead><tr><th>Capability</th><th>Increment</th><th>People</th><th>Process</th><th>Information</th><th>Technology</th></tr></thead><tbody>\n<tr><td>Risk scoring</td><td>Inc 1: rules-based scoring for refunds</td><td>Risk analysts trained</td><td>Scoring step in refund verification</td><td>Third-party data feeds agreed</td><td>Rules engine integrated</td></tr>\n<tr><td>Risk scoring</td><td>Inc 2: model-based scoring across taxes</td><td>Data scientists; model governance board</td><td>Model review and override process</td><td>Feature store; lineage</td><td>Analytics platform, model serving</td></tr>\n<tr><td>Audit management</td><td>Inc 1: unified case management</td><td>Auditor roles redefined</td><td>Standard audit lifecycle</td><td>Case data model</td><td>Case management platform</td></tr>\n</tbody></table>\n<div class=\"callout warn\"><b>Pitfall</b> Declaring a capability &ldquo;delivered&rdquo; when only the technology dimension is live. If users are not trained and the process is not changed, the increment has not been achieved.</div>\n<div class=\"callout gta\"><b>At GTA</b> CBP is a natural fit for annual planning: each strategic objective owner agrees the capability increments expected in the year, and IT plans work packages against those increments rather than against isolated requests.</div>",
  "related": [
   "capability-mapping",
   "migration-planning",
   "gta-strategy-to-solution",
   "value-streams"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "data-model-levels",
  "title": "Conceptual, Logical and Physical Data Models",
  "cat": "Data Architecture",
  "level": "Foundation",
  "tags": [
   "data modelling",
   "conceptual model",
   "logical model",
   "physical model"
  ],
  "summary": "Data models exist at three levels of abstraction, each with a different audience and purpose. Enterprise architecture lives mostly at the conceptual level.",
  "minutes": 7,
  "body": "<p>Data modelling separates <strong>what the business means</strong> from <strong>how data is structured</strong> and from <strong>how it is stored</strong>. Keeping these levels distinct allows technology to change without redefining business meaning.</p>\n<table class=\"tbl\"><thead><tr><th>Level</th><th>Purpose</th><th>Content</th><th>Audience</th><th>Technology dependent?</th></tr></thead><tbody>\n<tr><td>Conceptual</td><td>Agree business meaning and scope</td><td>Major entities (subject areas), key relationships, definitions</td><td>Business owners, architects</td><td>No</td></tr>\n<tr><td>Logical</td><td>Precise structure, independent of DBMS</td><td>Entities, attributes, keys, normalised relationships, data types (logical), business rules</td><td>Data architects, analysts</td><td>No (but may assume relational, document, etc.)</td></tr>\n<tr><td>Physical</td><td>Implementation</td><td>Tables/collections, columns, indexes, partitions, storage, security</td><td>DBAs, developers</td><td>Yes</td></tr>\n</tbody></table>\n<h4>Illustrative conceptual model for tax administration</h4>\n<ul>\n<li><strong>Taxpayer</strong> (person or entity) has one or more <strong>Registrations</strong> (per tax type).</li>\n<li>A registration requires periodic <strong>Returns</strong>; a return produces <strong>Assessments</strong>.</li>\n<li>Assessments create <strong>Liabilities</strong> on a <strong>Taxpayer Account</strong>; <strong>Payments</strong> and <strong>Refunds</strong> post to the account.</li>\n<li>A taxpayer may be subject to <strong>Cases</strong> (audit, objection, appeal) that reference returns and assessments.</li>\n<li><strong>Representatives</strong> (tax agents) act for taxpayers under <strong>Authorisations</strong>.</li>\n<li><strong>Licences</strong> (e.g. tax warehouse) relate to registrations and premises.</li>\n</ul>\n<h4>Practices that pay off</h4>\n<ul>\n<li>A business glossary tied to the conceptual model; every entity has a definition and an owner.</li>\n<li>Logical models per bounded context, with explicit mappings where contexts share concepts.</li>\n<li>Physical models generated or reverse-engineered, kept under version control.</li>\n<li>Classification applied at logical attribute level and propagated to physical columns.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> One enterprise-wide logical model that every system must implement. In large organisations this fails; use a shared conceptual model and canonical exchange definitions instead, and let each context own its logical model.</div>\n<div class=\"callout gta\"><b>At GTA</b> Defining &ldquo;Taxpayer&rdquo; precisely (individual, entity, branch, group, non-resident) is a foundational architecture decision that affects registration, risk, analytics and exchange of information.</div>",
  "related": [
   "mdm-reference-data",
   "data-governance-stewardship",
   "microservices-ddd",
   "metadata-catalogue-lineage"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   }
  ]
 },
 {
  "id": "mdm-reference-data",
  "title": "Master Data and Reference Data Management",
  "cat": "Data Architecture",
  "level": "Practitioner",
  "tags": [
   "master data",
   "reference data",
   "mdm",
   "golden record"
  ],
  "summary": "Master data describes core business entities shared across processes; reference data is the controlled code lists that classify them. Both need ownership and a single authoritative source.",
  "minutes": 8,
  "body": "<dl class=\"defs\">\n<dt>Master data</dt><dd>Core, relatively stable entities shared across many processes: taxpayers, representatives, premises, products (e.g. excise goods), bank accounts.</dd>\n<dt>Reference data</dt><dd>Controlled value sets used to classify other data: country codes, currency codes, tax types, economic activity codes, return statuses.</dd>\n<dt>Transactional data</dt><dd>Events and records of business activity: returns, payments, assessments.</dd>\n</dl>\n<h4>MDM implementation styles</h4>\n<table class=\"tbl\"><thead><tr><th>Style</th><th>How it works</th><th>When to use</th></tr></thead><tbody>\n<tr><td>Registry</td><td>Hub stores only matching keys and cross-references; data stays in sources</td><td>Low intrusion; analytics-oriented; quick start</td></tr>\n<tr><td>Consolidation</td><td>Hub builds golden records from sources for downstream use (read-only)</td><td>Reporting and analytics single view</td></tr>\n<tr><td>Coexistence</td><td>Golden record maintained in hub and synchronised back to sources</td><td>Gradual move to authoritative hub</td></tr>\n<tr><td>Centralised (transactional)</td><td>Hub is the system of entry; sources consume</td><td>Strong governance; new landscapes</td></tr>\n</tbody></table>\n<h4>Core MDM functions</h4>\n<ul>\n<li>Matching and merging (deterministic on identifiers such as QID or commercial registration number; probabilistic on names and addresses).</li>\n<li>Survivorship rules: which source wins for which attribute.</li>\n<li>Stewardship workflows for match exceptions and corrections.</li>\n<li>Publication via APIs and change events.</li>\n<li>History and audit of golden record changes.</li>\n</ul>\n<h4>Reference data management</h4>\n<ul>\n<li>Single authoritative list per code set, versioned with effective dates.</li>\n<li>Adopt international and national standards (ISO 3166 countries, ISO 4217 currencies, national activity classifications) rather than inventing codes.</li>\n<li>Maintain crosswalks where external partners use different code sets.</li>\n<li>Distribute via API or published files; prohibit local copies that are edited independently.</li>\n</ul>\n<h4>Authoritative sources in Qatar GEA</h4>\n<p>The IRM aims to identify &ldquo;the key sources of information across the government and their authoritative owners&rdquo;; its GDX catalogue names stewards for shared assets (for example, Commercial Registration and Commercial Permit under the then Ministry of Economy and Commerce; Address under MoI). The ARM also foresees a WoG <strong>master data repository</strong> (Smart Nation initiative) for a 360-degree view of citizens and businesses. GTA should consume such authoritative data through GDX rather than maintaining its own copies, and should itself act as the authoritative steward for taxpayer tax data. Master Data Management is one of the nine Smart Qatar data management domains.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Treating MDM as a technology purchase. Without agreed definitions, owners and stewardship processes, a hub just centralises inconsistent data.</div>\n<div class=\"callout gta\"><b>At GTA</b> A taxpayer golden record that resolves identities across Dhareeba, pre-2020 history in TAS, NAS-authenticated users and third-party sources (e.g. commercial registration data) is a prerequisite for reliable risk scoring and for the National Hub for Economic and Financial Data objective. The baseline found master data and stewardship capabilities not yet in place.</div>",
  "related": [
   "data-governance-stewardship",
   "gea-irm",
   "data-quality",
   "data-sharing-apis"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   }
  ]
 },
 {
  "id": "data-governance-stewardship",
  "title": "Data Governance, Ownership and Stewardship",
  "cat": "Data Architecture",
  "level": "Practitioner",
  "tags": [
   "data governance",
   "data owner",
   "data steward",
   "dama"
  ],
  "summary": "Data governance is the exercise of authority and control over data assets. It works when roles are named, decisions are documented and policies are enforced in systems.",
  "minutes": 8,
  "diagram": "data-governance",
  "body": "<p>DAMA-DMBOK defines data governance as the exercise of authority, control and shared decision-making (planning, monitoring and enforcement) over the management of data assets. Governance is the centre of the DAMA wheel; the other knowledge areas (architecture, modelling, storage, security, integration, documents, reference and master data, warehousing and BI, metadata, quality) are what it governs.</p>\n<h4>Roles</h4>\n<table class=\"tbl\"><thead><tr><th>Role</th><th>Accountability</th><th>Typical holder</th></tr></thead><tbody>\n<tr><td>Data governance council</td><td>Policies, priorities, dispute resolution</td><td>Senior representatives of business units and IT</td></tr>\n<tr><td>Data owner</td><td>Accountable for a data domain: definitions, access approval, quality targets, classification</td><td>Business director for the domain (e.g. Taxpayer Service for taxpayer data)</td></tr>\n<tr><td>Data steward (business)</td><td>Day-to-day definitions, quality issue resolution, glossary</td><td>Subject matter expert in the business unit</td></tr>\n<tr><td>Data custodian (technical)</td><td>Implements controls, storage, backup, access mechanisms</td><td>IT/platform teams, DBAs</td></tr>\n<tr><td>Data architect</td><td>Models, standards, integration and lineage design</td><td>EA / data architecture team</td></tr>\n<tr><td>Chief Data Officer (or equivalent)</td><td>Data strategy and governance programme</td><td>Executive role</td></tr>\n</tbody></table>\n<h4>Core policies</h4>\n<ul>\n<li>Data classification and handling.</li>\n<li>Data access and sharing (internal and external).</li>\n<li>Data quality management and issue escalation.</li>\n<li>Retention and disposal.</li>\n<li>Metadata and glossary standards.</li>\n<li>Master and reference data authority.</li>\n</ul>\n<h4>National policy context (GEA IRM)</h4>\n<ul>\n<li>GEA defines information as an authoritative collection of data &ldquo;governed by a data steward&rdquo;; every catalogued asset carries a stewardship (owner) attribute.</li>\n<li>The <strong>Data Management Policy</strong> (agencies must comply) covers data governance, data administration, data protection and data sharing.</li>\n<li>The <strong>Open Data Policy</strong> requires publishing government data unless restricted by law, policy, regulation or contract.</li>\n<li>The <strong>Smart Qatar Data Management Framework</strong> defines controls across nine domains: Governance plus Data Classification, Data Structure, Data Architecture, Data Integration, Metadata Management, Master Data Management, Data Security and Data Quality.</li>\n</ul>\n<h4>Making governance real</h4>\n<ol>\n<li>Start with critical data elements (CDEs) tied to strategic KPIs and regulatory reporting.</li>\n<li>Name owners and stewards for each domain in the data catalogue.</li>\n<li>Embed controls in pipelines and applications: validation rules, access policies, masking.</li>\n<li>Measure: quality scores per CDE, open issues by age, access requests turnaround.</li>\n<li>Escalate through the council only what cannot be resolved by owners.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Assigning IT as data owner. IT is the custodian; the business unit that creates and relies on the data must own its meaning and quality.</div>\n<div class=\"callout gta\"><b>At GTA</b> The 2025 baseline found no formal data strategy, and data governance, classification, metadata, quality and stewardship capabilities still to be built; a data management framework aligned with national direction is under development. &ldquo;Data Leadership&rdquo;, one of GTA&rsquo;s values, makes this concrete: each tax data domain gets a named owner and steward, and every data-sharing agreement is approved by the owner with a recorded purpose.</div>",
  "related": [
   "gta-data-reporting-baseline",
   "gea-irm",
   "data-classification",
   "mdm-reference-data"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   }
  ]
 },
 {
  "id": "data-quality",
  "title": "Data Quality Dimensions and Management",
  "cat": "Data Architecture",
  "level": "Practitioner",
  "tags": [
   "data quality",
   "dimensions",
   "rules",
   "monitoring"
  ],
  "summary": "Data quality is fitness for use, measured along dimensions such as completeness, validity, accuracy, consistency, timeliness and uniqueness, with rules monitored continuously.",
  "minutes": 7,
  "body": "<p>Data quality is not absolute; it is fitness for a specific use. A taxpayer address good enough for statistics may be inadequate for serving legal notices. Quality management therefore starts with the uses that matter.</p>\n<h4>Common dimensions</h4>\n<table class=\"tbl\"><thead><tr><th>Dimension</th><th>Definition</th><th>Example rule (tax context)</th></tr></thead><tbody>\n<tr><td>Completeness</td><td>Required data is present</td><td>Every active registration has a contact email or mobile number</td></tr>\n<tr><td>Validity</td><td>Values conform to format, type and domain</td><td>Economic activity code exists in the current reference list</td></tr>\n<tr><td>Accuracy</td><td>Values correctly represent the real world</td><td>Registered address verified against authoritative source</td></tr>\n<tr><td>Consistency</td><td>No contradictions across datasets</td><td>Taxpayer legal name identical in registration and payment systems</td></tr>\n<tr><td>Timeliness</td><td>Available when needed; current enough</td><td>Payments visible in the taxpayer account within agreed time of receipt</td></tr>\n<tr><td>Uniqueness</td><td>No unintended duplicates</td><td>One taxpayer record per national identifier</td></tr>\n<tr><td>Integrity</td><td>Relationships are intact</td><td>Every assessment references an existing return</td></tr>\n</tbody></table>\n<h4>Quality management cycle</h4>\n<ol>\n<li><strong>Define</strong> critical data elements and their quality requirements with the data owner.</li>\n<li><strong>Measure</strong> with automated rules in pipelines and at source; profile new data sources before use.</li>\n<li><strong>Analyse</strong> root causes (form design, missing validation, integration mapping, process gaps).</li>\n<li><strong>Improve</strong> at source: validation in the portal, reference data lookups, deduplication at entry.</li>\n<li><strong>Control</strong>: dashboards, thresholds, alerts and issue workflows with stewards.</li>\n</ol>\n<h4>Architecture implications</h4>\n<ul>\n<li>Validate at the point of capture (prevention is cheaper than correction).</li>\n<li>Expose quality scores in the data catalogue alongside each dataset.</li>\n<li>Pipelines should quarantine failing records rather than silently drop or load them.</li>\n<li>Track quality trends as part of the analytics platform&rsquo;s operational metrics.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Risk scoring and revenue analytics are only as good as their inputs. Making quality scores visible for the data feeding risk models supports both the Strengthen Compliance and the Transparency objectives.</div>",
  "related": [
   "data-governance-stewardship",
   "metadata-catalogue-lineage",
   "mdm-reference-data",
   "analytics-lakehouse"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   }
  ]
 },
 {
  "id": "metadata-catalogue-lineage",
  "title": "Metadata, Data Catalogue and Lineage",
  "cat": "Data Architecture",
  "level": "Practitioner",
  "tags": [
   "metadata",
   "data catalogue",
   "lineage",
   "glossary"
  ],
  "summary": "A data catalogue makes data discoverable and understandable; lineage shows where data came from and how it was transformed. Together they make data trustworthy and auditable.",
  "minutes": 7,
  "body": "<h4>Types of metadata</h4>\n<dl class=\"defs\">\n<dt>Business metadata</dt><dd>Glossary terms, definitions, owners, stewards, classification, permitted uses.</dd>\n<dt>Technical metadata</dt><dd>Schemas, tables, columns, data types, APIs, file formats, pipeline definitions.</dd>\n<dt>Operational metadata</dt><dd>Job runs, load times, row counts, quality scores, access logs.</dd>\n</dl>\n<h4>What a good catalogue entry contains</h4>\n<table class=\"tbl\"><thead><tr><th>Field</th><th>Example</th></tr></thead><tbody>\n<tr><td>Dataset name</td><td>Excise returns - curated</td></tr>\n<tr><td>Description</td><td>Validated excise return lines, one row per product line per return</td></tr>\n<tr><td>Owner / steward</td><td>Excise unit director / named steward</td></tr>\n<tr><td>Classification</td><td>Confidential - taxpayer data</td></tr>\n<tr><td>Source and lineage</td><td>Tax administration system &rarr; ingestion &rarr; validation &rarr; curated zone</td></tr>\n<tr><td>Refresh</td><td>Daily, 02:00</td></tr>\n<tr><td>Quality score</td><td>Completeness 99.6%, validity 99.9% (last run)</td></tr>\n<tr><td>Glossary links</td><td>Excise Return, Excise Product, Taxpayer</td></tr>\n<tr><td>Access</td><td>Request via owner; role-based; masked columns listed</td></tr>\n</tbody></table>\n<h4>Lineage</h4>\n<p>Lineage traces data from origin through transformations to consumption. It answers: <em>Where did this KPI come from? Which reports break if this column changes? Which outputs contain personal data from this source?</em></p>\n<ul>\n<li><strong>Coarse-grained</strong> (dataset-to-dataset) lineage is usually sufficient for impact analysis.</li>\n<li><strong>Column-level</strong> lineage is needed for regulatory reporting, sensitive data tracking and KPI audit.</li>\n<li>Collect lineage automatically from pipeline tools and SQL parsing; manual lineage goes stale.</li>\n<li>Open standards such as OpenLineage help integrate lineage across tools.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Launching a catalogue with thousands of harvested tables and no descriptions or owners. Curate the critical datasets first; a smaller trustworthy catalogue beats a large empty one.</div>\n<div class=\"callout gta\"><b>At GTA</b> &ldquo;Transparency&rdquo; as a value applies internally too: published KPIs (e.g. refund turnaround) should be traceable via lineage to source systems, so that figures can be explained to leadership and auditors.</div>",
  "related": [
   "data-governance-stewardship",
   "data-quality",
   "analytics-lakehouse",
   "data-classification"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   },
   {
    "t": "OpenLineage",
    "u": "https://openlineage.io"
   }
  ]
 },
 {
  "id": "analytics-lakehouse",
  "title": "Analytics Architecture: Warehouse, Lake and Lakehouse",
  "cat": "Data Architecture",
  "level": "Advanced",
  "tags": [
   "lakehouse",
   "data warehouse",
   "analytics",
   "medallion",
   "data mesh"
  ],
  "summary": "Modern analytics architectures combine low-cost open storage with warehouse-grade management. The choice of pattern depends on data variety, governance needs and team model.",
  "minutes": 9,
  "body": "<table class=\"tbl\"><thead><tr><th>Pattern</th><th>Characteristics</th><th>Strengths</th><th>Weaknesses</th></tr></thead><tbody>\n<tr><td>Enterprise data warehouse</td><td>Schema-on-write, modelled (dimensional or normalised), SQL</td><td>Consistent, governed, performant BI</td><td>Rigid, slow to onboard new sources, weaker for unstructured data and ML</td></tr>\n<tr><td>Data lake</td><td>Schema-on-read on object storage, any format</td><td>Cheap, flexible, ML-friendly</td><td>Prone to becoming a &ldquo;data swamp&rdquo;; weak transactions and governance</td></tr>\n<tr><td>Lakehouse</td><td>Open table formats on object storage adding ACID transactions, schema enforcement, time travel</td><td>One copy of data for BI and ML; open formats</td><td>Requires engineering maturity; governance still must be designed</td></tr>\n<tr><td>Data mesh (organisational)</td><td>Domain-owned data products, self-serve platform, federated governance</td><td>Scales ownership; aligns data with domains</td><td>Needs mature domains and platform; overhead for small organisations</td></tr>\n</tbody></table>\n<h4>Layered (medallion) zones</h4>\n<dl class=\"defs\">\n<dt>Raw / bronze</dt><dd>Immutable landing of source data as received; restricted access.</dd>\n<dt>Cleansed / silver</dt><dd>Validated, deduplicated, conformed to reference data; quality rules applied.</dd>\n<dt>Curated / gold</dt><dd>Business-ready data products and marts: revenue by tax type, compliance indicators, risk features.</dd>\n<dt>Sandbox</dt><dd>Governed exploration space for analysts and data scientists with time-limited retention.</dd>\n</dl>\n<h4>Architecture decisions to make explicitly</h4>\n<ul>\n<li>Ingestion style per source: change data capture, batch extract, events, or APIs.</li>\n<li>Where personal and taxpayer-confidential data is masked or tokenised (as early as possible).</li>\n<li>Semantic layer: one place where KPI definitions live, so dashboards agree.</li>\n<li>ML lifecycle: feature store, model registry, monitoring and explainability for decisions affecting taxpayers.</li>\n<li>Hosting: location of sensitive datasets decided against the Cloud Security Policy, classification and applicable law, and documented.</li>\n<li>Access model: role- and attribute-based, with row/column-level security.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Direct reporting against production transactional databases. It harms performance, bypasses governance and produces inconsistent KPIs.</div>\n<div class=\"callout gta\"><b>At GTA</b> The baseline runs two warehouses (SAP BW for SAP data, Azure Synapse for non-SAP workloads) with SAP Analytics Cloud and Power BI on top, and much reporting is still manual. Becoming a National Hub for Economic and Financial Data implies curated, documented data products with clear ownership, quality and a shared KPI semantic layer, not just more storage.</div>",
  "related": [
   "gta-data-reporting-baseline",
   "metadata-catalogue-lineage",
   "data-quality",
   "data-sharing-apis"
  ],
  "refs": [
   {
    "t": "Lakehouse: A New Generation of Open Platforms (CIDR 2021)",
    "u": "https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf"
   },
   {
    "t": "Data Mesh Principles and Logical Architecture (martinfowler.com)",
    "u": "https://martinfowler.com/articles/data-mesh-principles.html"
   }
  ]
 },
 {
  "id": "data-sharing-apis",
  "title": "Data Sharing and Exchange Architecture",
  "cat": "Data Architecture",
  "level": "Advanced",
  "tags": [
   "data sharing",
   "interoperability",
   "exchange of information",
   "apis",
   "privacy"
  ],
  "summary": "Sharing data with other government entities and international partners requires purpose-bound agreements, standard interfaces, classification-aware controls and full auditability.",
  "minutes": 8,
  "body": "<p>A tax authority is both a consumer and a provider of data: it receives third-party data for compliance and provides data for national statistics, policy and international exchange of information. Each exchange is an architecture decision with legal, security and quality dimensions.</p>\n<h4>Exchange patterns</h4>\n<table class=\"tbl\"><thead><tr><th>Pattern</th><th>Use when</th><th>Considerations</th></tr></thead><tbody>\n<tr><td>Synchronous API (request/response)</td><td>Real-time verification (e.g. confirm a registration status)</td><td>Minimal data returned; rate limits; strong client authentication</td></tr>\n<tr><td>Event / notification</td><td>Partner needs to know about changes (e.g. deregistration)</td><td>Event contract, delivery guarantees, replay</td></tr>\n<tr><td>Bulk file / managed file transfer</td><td>Periodic large datasets, treaty exchanges with defined schemas</td><td>Encryption, integrity checks, schema validation, acknowledgements</td></tr>\n<tr><td>Query on aggregated data product</td><td>Statistics and policy analysis</td><td>Aggregation thresholds, disclosure control, anonymisation</td></tr>\n<tr><td>Federated query / data clean room</td><td>Joint analysis without moving raw data</td><td>Maturity of tooling; governance of queries</td></tr>\n</tbody></table>\n<h4>The Qatar GEA way: GDX and exchange packages</h4>\n<p>Under Resolution 18/2010 and the IRM, inter-agency exchange should use MCIT&rsquo;s <strong>Government Data eXchange (GDX)</strong>: a service gateway (schema validation, XML firewall, authentication/authorisation/audit, REST/SOAP bridge), mediation, registry and monitoring. Each recurring exchange is described as an IRM <strong>Exchange Package</strong>: identifier, name, description, security classification, frequency; supplier and consumer with their stewards; payload definition and business need; query point and supported query languages.</p>\n<h4>Controls per exchange</h4>\n<ul>\n<li><strong>Legal basis and purpose</strong>: documented agreement (MoU or data sharing agreement) specifying purpose, fields, retention and onward-sharing limits.</li>\n<li><strong>Data minimisation</strong>: only the fields needed; prefer verification answers (yes/no) over raw records.</li>\n<li><strong>Classification</strong>: exchange inherits the highest classification of its fields; controls applied accordingly.</li>\n<li><strong>Authentication</strong>: GDX gateway security for inter-agency exchange; otherwise mutual TLS and OAuth 2.0 client credentials.</li>\n<li><strong>Audit</strong>: who requested what, when, for which purpose; retained per policy.</li>\n<li><strong>Quality and semantics</strong>: shared definitions, code lists and versioned schemas.</li>\n</ul>\n<h4>Exchange register (fields)</h4>\n<pre class=\"code\">Exchange ID | Partner | Direction (in/out) | Purpose\nLegal basis / agreement ref | Data owner approval\nDatasets and fields | Classification | Pattern (API/event/file)\nFrequency / volume | Security controls | Retention at partner\nTechnical contact | Business contact | Review date</pre>\n<div class=\"callout gta\"><b>At GTA</b> In the baseline, Dhareeba exchanges with MoI over GDX, other external integrations are point-to-point APIs, and Tabadol exchanges with international jurisdictions (FATCA, CRS) by file transfer. A single exchange register, whose entries follow the IRM Exchange Package template and are owned jointly by data governance and the integration team, supports both the National Hub and Stakeholder Engagement objectives.</div>",
  "related": [
   "gea-irm",
   "gta-integration-baseline",
   "integration-patterns",
   "data-classification"
  ],
  "refs": [
   {
    "t": "OpenAPI Initiative",
    "u": "https://www.openapis.org"
   }
  ]
 },
 {
  "id": "application-portfolio-management",
  "title": "Application Portfolio Management",
  "cat": "Application & Integration",
  "level": "Practitioner",
  "tags": [
   "application portfolio",
   "apm",
   "rationalisation",
   "time model"
  ],
  "summary": "Application portfolio management keeps an accurate inventory of applications and assesses each for business value and technical health, to drive rationalisation and investment decisions.",
  "minutes": 7,
  "body": "<p>APM treats applications as assets to be managed through their lifecycle. Its output is not a list but a set of decisions: invest, maintain, migrate or retire.</p>\n<h4>Minimum attributes per application</h4>\n<table class=\"tbl\"><thead><tr><th>Attribute</th><th>Why it matters</th></tr></thead><tbody>\n<tr><td>Name, identifier, description</td><td>Unambiguous reference across repository, CMDB and contracts</td></tr>\n<tr><td>Business owner and IT owner</td><td>Accountability for decisions</td></tr>\n<tr><td>Capabilities supported</td><td>Links to business value and redundancy analysis</td></tr>\n<tr><td>GEA ARM category; business services realized; information assets used</td><td>Mandatory GEA application catalogue and service&ndash;information&ndash;application matrix</td></tr>\n<tr><td>Lifecycle status</td><td>Planned, active, sunset, retired</td></tr>\n<tr><td>Hosting and technology stack</td><td>Technology risk and standards compliance</td></tr>\n<tr><td>Data classification (highest)</td><td>Security and hosting constraints</td></tr>\n<tr><td>Interfaces</td><td>Change impact and integration complexity</td></tr>\n<tr><td>Users and volumes</td><td>Business criticality</td></tr>\n<tr><td>Annual cost (licence, support, infrastructure)</td><td>Rationalisation case</td></tr>\n<tr><td>Contract end date</td><td>Decision windows</td></tr>\n<tr><td>Criticality / DR tier</td><td>Resilience requirements</td></tr>\n</tbody></table>\n<h4>Assessment</h4>\n<p>Each application is scored on two axes, ideally by different people:</p>\n<ul>\n<li><strong>Business fit</strong> (business owner): functional fit, strategic alignment, user satisfaction, importance of supported capabilities.</li>\n<li><strong>Technical fit</strong> (IT): supportability, architecture quality, security posture, scalability, cost of change, lifecycle of underlying technology.</li>\n</ul>\n<p>These scores map onto the <strong>TIME</strong> model &mdash; Tolerate, Invest, Migrate, Eliminate &mdash; covered in the TIME rubric template.</p>\n<h4>Rationalisation signals</h4>\n<ul>\n<li>Several applications supporting the same capability.</li>\n<li>Applications with very few users but full support costs.</li>\n<li>Technology past vendor end-of-support.</li>\n<li>Applications that exist only to move data between two others.</li>\n<li>Shadow IT: spreadsheets and desktop tools running critical processes.</li>\n</ul>\n<h4>The GEA ARM taxonomy as the classification</h4>\n<p>Qatari agencies must maintain an application catalogue aligned to the GEA Application Reference Taxonomy: <strong>1 Business Applications</strong> (1.1 Corporate, 1.2 Common Business, 1.3 Specialist Line of Business) and <strong>2 Infrastructure Applications &amp; Platforms</strong> (2.1 Data Management, 2.2 Security Services, 2.3 Integration Services, 2.4 Network Services, 2.5 ICT Services and Tools, 2.6 End User Computing, 2.7 Platforms). Several applications in one category, or a WoG focus category where a shared service exists, are rationalisation signals in their own right.</p>\n<div class=\"callout warn\"><b>Pitfall</b> An inventory exercise that is never refreshed. Tie updates to contract renewals, releases and the annual planning cycle.</div>\n<div class=\"callout gta\"><b>At GTA</b> The 2025 baseline lists Dhareeba, Tabadol, Tax Support Management and the payment gateway as core applications, a set of support applications, about 25 in-house SharePoint applications, and the mandated government applications Mawared, Tawasul and Maliya. Classifying these against the ARM taxonomy and combining the result with the capability heat map shows where to consolidate first.</div>",
  "related": [
   "gea-arm",
   "gta-application-landscape",
   "tpl-time-rubric",
   "legacy-modernization-7rs"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "integration-patterns",
  "title": "Integration Patterns: API-led, Event-driven, ESB and Gateways",
  "cat": "Application & Integration",
  "level": "Practitioner",
  "tags": [
   "integration",
   "event-driven",
   "api gateway",
   "esb",
   "messaging"
  ],
  "summary": "Choose integration style by coupling, timing and data needs. Modern architectures combine managed APIs, an event backbone and file transfer, and avoid point-to-point sprawl.",
  "minutes": 9,
  "diagram": "integration-patterns",
  "body": "<h4>Integration styles</h4>\n<table class=\"tbl\"><thead><tr><th>Style</th><th>Coupling</th><th>Timing</th><th>Use for</th><th>Watch out for</th></tr></thead><tbody>\n<tr><td>Synchronous API (REST/gRPC)</td><td>Temporal coupling</td><td>Real time</td><td>Queries, commands needing immediate answer</td><td>Cascading failures; chatty calls; latency</td></tr>\n<tr><td>Asynchronous messaging (queues)</td><td>Loose</td><td>Near real time</td><td>Commands processed reliably later; load levelling</td><td>Poison messages; ordering; idempotency</td></tr>\n<tr><td>Event streaming / pub-sub</td><td>Very loose</td><td>Near real time</td><td>Broadcasting facts (e.g. ReturnSubmitted) to many consumers</td><td>Schema evolution; eventual consistency</td></tr>\n<tr><td>Batch / file transfer</td><td>Loose</td><td>Scheduled</td><td>Large volumes, external partners, analytics</td><td>Latency; reconciliation</td></tr>\n<tr><td>Shared database</td><td>Tight</td><td>Immediate</td><td>Avoid between separately owned systems</td><td>Hidden dependencies; blocked change</td></tr>\n</tbody></table>\n<h4>API-led connectivity</h4>\n<p>APIs are layered by purpose: <strong>system APIs</strong> expose systems of record in a stable way; <strong>process APIs</strong> compose them into business operations; <strong>experience APIs</strong> tailor data for specific channels. This reduces the impact of back-end change on channels, though it should not be applied dogmatically &mdash; three hops for a simple lookup is waste.</p>\n<h4>ESB vs API gateway vs event broker</h4>\n<dl class=\"defs\">\n<dt>Enterprise Service Bus</dt><dd>Centralised mediation: routing, transformation, orchestration, protocol bridging. Useful for legacy protocols; risk of becoming a monolith with business logic hidden in the middleware.</dd>\n<dt>API gateway</dt><dd>Edge policy enforcement for APIs: authentication, authorisation, rate limiting, quotas, routing, analytics. Should contain no business logic.</dd>\n<dt>Event broker / streaming platform</dt><dd>Durable distribution of events to many consumers, with replay. Producers do not know consumers.</dd>\n<dt>Service mesh</dt><dd>Service-to-service concerns (mTLS, retries, traffic shaping) handled in the platform for microservices inside a cluster.</dd>\n</dl>\n<h4>Qatar GEA position</h4>\n<ul>\n<li><strong>Inter-agency</strong>: use MCIT&rsquo;s Government Data eXchange (GDX), whose gateway, mediation (transformation, protocol switching, routing, publish/subscribe), registry and monitoring are existing WoG services (IRM).</li>\n<li><strong>Intra-agency</strong>: plan at least the IRM minimum set &mdash; developer portal, subscription management, API catalogue, gateway, mediation, registry, monitoring and logging.</li>\n<li><strong>Style</strong>: the ARM recommends an SOA approach and &ldquo;strongly prefer[s]&rdquo; event-based choreography (via an event hub) for multi-service and multi-agency interactions; orchestration is mainly for use within an agency.</li>\n</ul>\n<h4>Design rules</h4>\n<ul>\n<li>Smart endpoints, dumb pipes: keep business rules in services, not in the integration layer.</li>\n<li>Design all message consumers to be idempotent; use correlation IDs end to end.</li>\n<li>Use the Enterprise Integration Patterns vocabulary (content-based router, aggregator, dead letter channel, outbox) in designs.</li>\n<li>Publish every interface in a catalogue with owner, contract, version and consumers.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Baseline: no internal middleware, point-to-point internal integrations, GDX for the Dhareeba&ndash;MoI exchange, point-to-point APIs to other partners, file transfer for treaty exchange. Target direction: government partners via GDX, channels and other partners via managed APIs, core tax events (registration changed, return submitted, payment received) on an event backbone, and treaty bulk exchange via managed file transfer.</div>",
  "related": [
   "gta-integration-baseline",
   "gea-irm",
   "api-design-standards",
   "chk-integration-design"
  ],
  "refs": [
   {
    "t": "Enterprise Integration Patterns",
    "u": "https://www.enterpriseintegrationpatterns.com"
   },
   {
    "t": "AsyncAPI Initiative",
    "u": "https://www.asyncapi.com"
   }
  ]
 },
 {
  "id": "api-design-standards",
  "title": "API Design Standards: REST, Versioning and OpenAPI",
  "cat": "Application & Integration",
  "level": "Practitioner",
  "tags": [
   "api",
   "rest",
   "openapi",
   "versioning",
   "standards"
  ],
  "summary": "Consistent API standards make integrations cheaper and safer: contract-first design with OpenAPI, predictable resource naming, explicit versioning, standard errors and security.",
  "minutes": 9,
  "body": "<h4>Core standards</h4>\n<table class=\"tbl\"><thead><tr><th>Topic</th><th>Standard</th></tr></thead><tbody>\n<tr><td>Contract</td><td>OpenAPI 3.x document is the source of truth, reviewed before implementation (contract-first); AsyncAPI for event interfaces</td></tr>\n<tr><td>Resources</td><td>Plural nouns, lower-case kebab-case paths: /taxpayers/{taxpayerId}/registrations</td></tr>\n<tr><td>Methods</td><td>GET (safe), PUT (idempotent replace), PATCH (partial), POST (create/command), DELETE (idempotent)</td></tr>\n<tr><td>Status codes</td><td>200, 201 + Location, 202 for async, 204, 400, 401, 403, 404, 409, 412, 422, 429, 500, 503</td></tr>\n<tr><td>Errors</td><td>RFC 9457 Problem Details (application/problem+json) with a stable error type and correlation ID</td></tr>\n<tr><td>Pagination</td><td>Cursor-based for large or changing collections; limit with documented maximum</td></tr>\n<tr><td>Dates and money</td><td>ISO 8601 with time zone; monetary amounts as decimal string plus ISO 4217 currency</td></tr>\n<tr><td>Idempotency</td><td>Idempotency-Key header on POST commands with financial effect (payments, refunds)</td></tr>\n<tr><td>Concurrency</td><td>ETag with If-Match for updates</td></tr>\n<tr><td>Security</td><td>OAuth 2.0 / OIDC; scopes per operation; no secrets or personal data in URLs</td></tr>\n<tr><td>Observability</td><td>W3C Trace Context headers propagated; correlation ID in every response</td></tr>\n<tr><td>Language</td><td>Accept-Language for Arabic/English content; UTF-8 throughout</td></tr>\n</tbody></table>\n<h4>Versioning</h4>\n<ul>\n<li>Major version in the path (/v1/) or a media type; minor, backward-compatible changes do not change the version.</li>\n<li>Backward compatible: adding optional fields, adding endpoints, adding enum values only if consumers are told to tolerate unknown values.</li>\n<li>Breaking: removing or renaming fields, changing types or semantics, new required inputs.</li>\n<li>Deprecation policy: announce, add Deprecation and Sunset headers, support old major version for a published period (e.g. 6&ndash;12 months).</li>\n</ul>\n<h4>Example error response</h4>\n<pre class=\"code\">HTTP/1.1 422 Unprocessable Content\nContent-Type: application/problem+json\n{\n  \"type\": \"https://api.example.gov.qa/problems/return-period-closed\",\n  \"title\": \"Return period is closed\",\n  \"status\": 422,\n  \"detail\": \"The return period 2025-Q4 is closed for amendments.\",\n  \"instance\": \"/v1/returns/RT-000123/amendments\",\n  \"correlationId\": \"7f3c9a2e-1b4d-4e8a-9c11-2d5f6a7b8c90\"\n}</pre>\n<h4>Relation to GEA IRM standards</h4>\n<p>The GEA IRM rates web-service standards by usage area. <strong>SOAP</strong> and <strong>ANSI SQL</strong> are mandatory in all three usage areas; <strong>JSON, XML, WSDL, XSLT, UDDI, WS-ReliableMessaging, Dublin Core metadata and WS-SecurityPolicy</strong> are mandatory for external and cross-government use; XSD is mandatory externally. The IRM lists no REST/OpenAPI, OAuth 2.0 or OpenID Connect standard. GTA&rsquo;s REST/OpenAPI standard therefore fills a gap rather than contradicting GEA, but each external or cross-government API should state its position on the SOAP/WS-* entries (the GDX gateway offers a REST/SOAP bridge) and raise a TRB exception where a mandatory standard is not met.</p>\n<h4>Automated governance</h4>\n<p>Lint OpenAPI documents in CI against the style guide (naming, error format, security schemes); publish to an API catalogue; block deployment of APIs without a registered contract and owner.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Exposing internal database structures as APIs. Design resources around consumer needs and domain concepts, not table layouts.</div>",
  "related": [
   "integration-patterns",
   "gea-standards-compliance",
   "chk-integration-design",
   "iam-federation"
  ],
  "refs": [
   {
    "t": "OpenAPI Specification (latest)",
    "u": "https://spec.openapis.org/oas/latest.html"
   },
   {
    "t": "RFC 9457 - Problem Details for HTTP APIs",
    "u": "https://www.rfc-editor.org/rfc/rfc9457"
   },
   {
    "t": "OWASP API Security Project",
    "u": "https://owasp.org/www-project-api-security/"
   }
  ]
 },
 {
  "id": "microservices-ddd",
  "title": "Microservices, Modular Monoliths and Bounded Contexts",
  "cat": "Application & Integration",
  "level": "Advanced",
  "tags": [
   "microservices",
   "modular monolith",
   "domain-driven design",
   "bounded context"
  ],
  "summary": "Domain-driven design gives the boundaries; deployment style is a separate decision. A well-modularised monolith is often a better start than premature microservices.",
  "minutes": 9,
  "body": "<h4>Bounded contexts first</h4>\n<p>In domain-driven design (DDD), a <strong>bounded context</strong> is a boundary within which a particular model and its ubiquitous language are consistent. The same word can mean different things in different contexts: a &ldquo;case&rdquo; in audit is not the same as a &ldquo;case&rdquo; in taxpayer support. Boundaries should follow business capabilities and language, not technical layers.</p>\n<h4>Illustrative contexts for a tax authority</h4>\n<ul>\n<li><strong>Registration</strong>: taxpayer, registration, representative authorisation.</li>\n<li><strong>Returns</strong>: return, period, line items, submission.</li>\n<li><strong>Assessment</strong>: assessment, adjustment, penalty.</li>\n<li><strong>Accounting</strong>: taxpayer account, liability, payment, refund, offset.</li>\n<li><strong>Compliance</strong>: risk profile, audit case, finding.</li>\n<li><strong>Disputes</strong>: objection, appeal, decision.</li>\n<li><strong>Excise licensing</strong>: warehouse licence, premises, inspection.</li>\n</ul>\n<p>Context maps document relationships between them: customer/supplier, conformist, anti-corruption layer (to protect a new model from a legacy one), published language, shared kernel.</p>\n<h4>Deployment options</h4>\n<table class=\"tbl\"><thead><tr><th>Criterion</th><th>Modular monolith</th><th>Microservices</th></tr></thead><tbody>\n<tr><td>Deployment</td><td>One unit; modules with enforced boundaries</td><td>Independent deployment per service</td></tr>\n<tr><td>Data</td><td>One database, schema per module, no cross-module table access</td><td>Database per service</td></tr>\n<tr><td>Consistency</td><td>Local transactions possible</td><td>Eventual consistency; sagas; outbox pattern</td></tr>\n<tr><td>Operational cost</td><td>Low</td><td>High: platform, observability, on-call maturity needed</td></tr>\n<tr><td>Team scaling</td><td>Good up to a few teams</td><td>Good for many autonomous teams</td></tr>\n<tr><td>Independent scaling</td><td>Limited</td><td>Fine-grained</td></tr>\n<tr><td>Best when</td><td>Domain still being learned; small teams; strong consistency needs</td><td>Clear boundaries; mature DevOps; different scaling or release cadences</td></tr>\n</tbody></table>\n<h4>Signs you have a distributed monolith</h4>\n<ul>\n<li>Services must be deployed together.</li>\n<li>Synchronous call chains across many services for a single user request.</li>\n<li>Shared database tables between services.</li>\n<li>A change to one business rule touches several services.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> Packaged tax administration systems already define many internal boundaries. DDD is still valuable around them: anti-corruption layers and well-defined integration contracts keep the package replaceable.</div>\n<div class=\"callout gta\"><b>At GTA</b> The GEA ARM asks agencies to evaluate each application for microservices against business considerations (DevOps readiness, skills, longevity, demand peaks, size) rather than adopt them by default, and stresses loose coupling, high cohesion and bounded contexts. Start new custom solutions as modular monoliths with enforced module boundaries and an event outbox; extract services only when a measurable need is shown and recorded in an ADR.</div>",
  "related": [
   "integration-patterns",
   "data-model-levels",
   "legacy-modernization-7rs",
   "tpl-adr"
  ],
  "refs": [
   {
    "t": "Bounded Context (martinfowler.com)",
    "u": "https://martinfowler.com/bliki/BoundedContext.html"
   },
   {
    "t": "Microservices (martinfowler.com)",
    "u": "https://martinfowler.com/articles/microservices.html"
   },
   {
    "t": "Monolith First (martinfowler.com)",
    "u": "https://martinfowler.com/bliki/MonolithFirst.html"
   }
  ]
 },
 {
  "id": "legacy-modernization-7rs",
  "title": "Legacy Modernisation and the 7 Rs",
  "cat": "Application & Integration",
  "level": "Practitioner",
  "tags": [
   "modernisation",
   "7 rs",
   "migration",
   "strangler fig",
   "legacy"
  ],
  "summary": "The 7 Rs classify modernisation options from retiring to refactoring. Choosing per application, and migrating incrementally (strangler fig), reduces risk.",
  "minutes": 8,
  "body": "<h4>The 7 Rs</h4>\n<table class=\"tbl\"><thead><tr><th>Option</th><th>Description</th><th>Effort</th><th>Typical trigger</th></tr></thead><tbody>\n<tr><td>Retire</td><td>Decommission; capability no longer needed or covered elsewhere</td><td>Low</td><td>Duplicate functionality, low usage</td></tr>\n<tr><td>Retain</td><td>Keep as is for now; revisit later</td><td>None</td><td>Recently upgraded, or retirement planned soon</td></tr>\n<tr><td>Rehost (&ldquo;lift and shift&rdquo;)</td><td>Move to new infrastructure without change</td><td>Low&ndash;Medium</td><td>Data centre exit, hardware end-of-life</td></tr>\n<tr><td>Relocate</td><td>Move to a different hosting platform at the hypervisor/container level without changes</td><td>Low</td><td>Platform migration of virtualised estates</td></tr>\n<tr><td>Replatform (&ldquo;lift, tinker and shift&rdquo;)</td><td>Minor changes to use managed services (e.g. managed database)</td><td>Medium</td><td>Reduce operational burden</td></tr>\n<tr><td>Repurchase</td><td>Replace with a different product, often SaaS or a package</td><td>Medium&ndash;High</td><td>Commodity capability; vendor product end-of-life</td></tr>\n<tr><td>Refactor / re-architect</td><td>Redesign for modern architecture</td><td>High</td><td>Strategic differentiating capability; scale or agility needs</td></tr>\n</tbody></table>\n<h4>Incremental strategies</h4>\n<dl class=\"defs\">\n<dt>Strangler fig</dt><dd>Place a fa&ccedil;ade (API gateway or routing layer) in front of the legacy system; implement new functionality behind the fa&ccedil;ade and gradually route traffic away from legacy until it can be retired.</dd>\n<dt>Anti-corruption layer</dt><dd>A translation layer that keeps legacy models from leaking into new services.</dd>\n<dt>Change data capture</dt><dd>Stream changes from legacy databases to new components during coexistence.</dd>\n<dt>Parallel run</dt><dd>Run old and new side by side and reconcile outputs before cutover; essential for financial calculations such as assessments and penalties.</dd>\n</dl>\n<h4>Decision factors</h4>\n<ul>\n<li>Business value and strategic importance of the capability (from the heat map).</li>\n<li>Technical health and vendor support status.</li>\n<li>Data migration complexity and data quality.</li>\n<li>Regulatory and audit continuity (historic returns must remain accessible).</li>\n<li>Skills and capacity; calendar constraints (filing deadlines).</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Big-bang replacement of a core tax system without coexistence planning. Plan transitional states, data reconciliation and rollback explicitly.</div>\n<div class=\"callout gta\"><b>At GTA</b> Real case: pre-2020 taxpayer data is split between the legacy TAS system and Dhareeba and is hard to access. Before TAS is retired, the plan must say where historical data lives and how it stays searchable for audits and appeals; this is also the first step towards a unified taxpayer record.</div>",
  "related": [
   "application-portfolio-management",
   "tpl-time-rubric",
   "migration-planning",
   "cloud-models"
  ],
  "refs": [
   {
    "t": "Strangler Fig Application (martinfowler.com)",
    "u": "https://martinfowler.com/bliki/StranglerFigApplication.html"
   },
   {
    "t": "6 Strategies for Migrating Applications to the Cloud (AWS)",
    "u": "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/"
   }
  ]
 },
 {
  "id": "technology-reference-model",
  "title": "Technology Reference Model, Standards and Lifecycle",
  "cat": "Technology & Cloud",
  "level": "Practitioner",
  "tags": [
   "technology standards",
   "trm",
   "lifecycle",
   "tech radar"
  ],
  "summary": "A technology reference model classifies technology services; a standards catalogue states which products and versions are approved for each, and lifecycle status controls diversity and obsolescence.",
  "minutes": 7,
  "body": "<p>A Technology Reference Model (TRM) is a taxonomy of technology services &mdash; e.g. compute, storage, databases, integration, identity, observability, end-user computing &mdash; that lets you ask, for each category: <em>what is our standard, and what is its status?</em> TOGAF provides a generic TRM; for Qatari agencies the GEA <strong>Infrastructure (Technical) Reference Model</strong> provides the mandated taxonomy (5 domains, 33 areas) and network standards rated mandatory, recommended or optional per usage area.</p>\n<h4>Standards catalogue fields</h4>\n<table class=\"tbl\"><thead><tr><th>Field</th><th>Example</th></tr></thead><tbody>\n<tr><td>TRM category</td><td>Data management &gt; Relational database</td></tr>\n<tr><td>Standard (product/spec)</td><td>Relational DB engine X, version 16.x</td></tr>\n<tr><td>Lifecycle status</td><td>Emerging / Standard / Contained / Retiring / Prohibited</td></tr>\n<tr><td>Vendor support end</td><td>Date</td></tr>\n<tr><td>Usage guidance</td><td>When to use; when not to; approved patterns</td></tr>\n<tr><td>Owner</td><td>Technology architect for the category</td></tr>\n<tr><td>Decision reference</td><td>TRB decision ID</td></tr>\n<tr><td>Review date</td><td>Annual</td></tr>\n</tbody></table>\n<h4>Lifecycle statuses</h4>\n<dl class=\"defs\">\n<dt>Emerging</dt><dd>Under evaluation; allowed only in pilots with TRB approval.</dd>\n<dt>Standard (Invest)</dt><dd>Preferred for new work.</dd>\n<dt>Contained (Maintain)</dt><dd>Supported for existing use; no new deployments without waiver.</dd>\n<dt>Retiring (Sunset)</dt><dd>Migration plans required; end date published.</dd>\n<dt>Prohibited</dt><dd>Must not be used (security, legal or support reasons).</dd>\n</dl>\n<h4>GEA lifecycle and compliance ratings</h4>\n<p>GEA tags each standard with an IT industry lifecycle status &mdash; <em>emerging</em>, <em>mature</em> or <em>declining</em> &mdash; and a compliance level per usage area. Keep both GEA attributes in the catalogue next to GTA&rsquo;s own status: a GEA-mandatory standard cannot be set to Prohibited or Retiring at GTA without a recorded exception.</p>\n<h4>Controlling technical diversity</h4>\n<ul>\n<li>Aim for one or two standards per category; justify exceptions.</li>\n<li>Track version currency, not only product: unsupported versions of a standard product are a risk.</li>\n<li>Monitor end-of-support dates 18&ndash;24 months ahead and plan upgrades into roadmaps.</li>\n<li>Publish as a technology radar for developers, backed by the formal catalogue.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Standards defined but never checked. Automate checks via CMDB discovery, container image scanning and infrastructure-as-code policies.</div>\n<div class=\"callout gta\"><b>At GTA</b> The standards catalogue should record each item&rsquo;s GEA reference model, compliance level and lifecycle status, so that TRB decisions, Design Authority checkpoints and RFP specifications (which must carry the GEA tender statement) all reference the same source.</div>",
  "related": [
   "gea-trm",
   "gea-standards-compliance",
   "tpl-tech-debt-register",
   "building-blocks"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "cloud-models",
  "title": "Cloud Service and Deployment Models",
  "cat": "Technology & Cloud",
  "level": "Foundation",
  "tags": [
   "cloud",
   "iaas",
   "paas",
   "saas",
   "shared responsibility"
  ],
  "summary": "NIST defines cloud service models (IaaS, PaaS, SaaS) and deployment models (private, community, public, hybrid). Each shifts responsibilities between provider and customer.",
  "minutes": 7,
  "diagram": "cloud-models",
  "body": "<p>NIST SP 800-145 defines cloud computing by five essential characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service.</p>\n<h4>Service models and shared responsibility</h4>\n<table class=\"tbl\"><thead><tr><th>Layer</th><th>On-premises</th><th>IaaS</th><th>PaaS</th><th>SaaS</th></tr></thead><tbody>\n<tr><td>Data, classification, access policy</td><td>Customer</td><td>Customer</td><td>Customer</td><td>Customer</td></tr>\n<tr><td>Identities and user access</td><td>Customer</td><td>Customer</td><td>Customer</td><td>Customer (provider supplies mechanisms)</td></tr>\n<tr><td>Application</td><td>Customer</td><td>Customer</td><td>Customer</td><td>Provider</td></tr>\n<tr><td>Runtime, middleware</td><td>Customer</td><td>Customer</td><td>Provider</td><td>Provider</td></tr>\n<tr><td>Operating system</td><td>Customer</td><td>Customer</td><td>Provider</td><td>Provider</td></tr>\n<tr><td>Virtualisation, servers, storage, network</td><td>Customer</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>\n<tr><td>Physical facilities</td><td>Customer</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>\n</tbody></table>\n<p>Responsibility for data, identities and configuration always stays with the customer. Most cloud security incidents are misconfiguration, not provider failure.</p>\n<h4>Deployment models (NIST)</h4>\n<dl class=\"defs\">\n<dt>Private cloud</dt><dd>Provisioned for exclusive use by one organisation; may be on or off premises.</dd>\n<dt>Community cloud</dt><dd>Shared by organisations with common concerns &mdash; e.g. a government cloud serving multiple entities.</dd>\n<dt>Public cloud</dt><dd>Open use by the general public; owned and operated by a provider.</dd>\n<dt>Hybrid cloud</dt><dd>A composition of two or more distinct infrastructures bound by technology that enables data and application portability.</dd>\n</dl>\n<h4>Selection considerations</h4>\n<ul>\n<li>Data classification and the location constraints that policy and law attach to each class.</li>\n<li>National policy on government cloud use: the Cloud Security Policy applies to every agency using or planning to use cloud, and the GEA TRM cloud controls (Required / Recommended).</li>\n<li>Workload characteristics: elasticity, latency, integration with on-premises systems.</li>\n<li>Operational maturity: landing zone, identity, network, monitoring, FinOps.</li>\n<li>Exit strategy and portability.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Assuming the provider &ldquo;handles security&rdquo; for SaaS. The customer still owns identity integration, role design, configuration, data classification and monitoring of the SaaS tenant; misconfigured sharing settings are a common cause of data exposure.</div>\n<h4>Beyond the NIST three</h4>\n<p>Providers also market finer-grained models such as containers as a service, functions as a service (serverless) and database as a service. Architecturally, place each on the same responsibility spectrum: the more the provider manages, the less you operate, but the more you depend on provider-specific APIs, limits and pricing &mdash; which affects portability and exit planning.</p>\n<div class=\"callout gta\"><b>At GTA</b> GTA already runs a hybrid model: core production on Azure West Europe, DR on Azure North Europe, and on-premises services at the Meeza data centre in Qatar. Use the cloud/hosting checklist for each workload; taxpayer-confidential data drives the strictest constraints, public website content far fewer.</div>",
  "related": [
   "hybrid-sovereign-cloud",
   "gea-trm",
   "chk-cloud-hosting",
   "gta-hosting-baseline"
  ],
  "refs": [
   {
    "t": "NIST SP 800-145: The NIST Definition of Cloud Computing",
    "u": "https://csrc.nist.gov/pubs/sp/800/145/final"
   }
  ]
 },
 {
  "id": "hybrid-sovereign-cloud",
  "title": "Hybrid and Sovereign Cloud Considerations",
  "cat": "Technology & Cloud",
  "level": "Advanced",
  "tags": [
   "sovereign cloud",
   "hybrid cloud",
   "data residency",
   "landing zone"
  ],
  "summary": "Government workloads need deliberate decisions on data location, legal jurisdiction and operational control. Hybrid architectures, like GTA's Azure plus Meeza estate, must be designed deliberately, not accumulated.",
  "minutes": 8,
  "body": "<h4>Dimensions of sovereignty</h4>\n<table class=\"tbl\"><thead><tr><th>Dimension</th><th>Question</th><th>Typical controls</th></tr></thead><tbody>\n<tr><td>Data location</td><td>Where is data stored and processed, including backups and logs, and what do policy and law require for each classification?</td><td>Region selection per workload; location policies; documented decisions</td></tr>\n<tr><td>Legal jurisdiction</td><td>Which laws can compel access to data?</td><td>Contractual terms; local operating entity; legal review</td></tr>\n<tr><td>Operational sovereignty</td><td>Who operates and can access the platform?</td><td>Locally cleared operators; access transparency; customer approval for support access</td></tr>\n<tr><td>Cryptographic control</td><td>Who holds the keys?</td><td>Customer-managed keys; hardware security modules; external key management</td></tr>\n<tr><td>Continuity</td><td>Can we operate if a provider relationship ends?</td><td>Exit plans; portable formats; infrastructure as code; tested migration</td></tr>\n</tbody></table>\n<h4>Hybrid architecture building blocks</h4>\n<ul>\n<li><strong>Landing zone</strong>: account/subscription structure, network topology, identity integration, guardrail policies, logging, budgets.</li>\n<li><strong>Connectivity</strong>: private, redundant links between data centres and cloud; consistent segmentation.</li>\n<li><strong>Identity</strong>: single workforce identity provider across environments; privileged access management.</li>\n<li><strong>Platform consistency</strong>: containers and infrastructure as code to reduce environment-specific differences.</li>\n<li><strong>Unified observability and security monitoring</strong> across on-premises and cloud.</li>\n<li><strong>Data placement policy</strong>: by classification, linked to the data catalogue.</li>\n</ul>\n<h4>What Qatar GEA says</h4>\n<p>The GEA TRM does <strong>not</strong> itself mandate in-country hosting. Its cloud controls require, among others, a responsibility matrix for all cloud actors, an independent audit of providers at least annually, an inventory of assets at all locations, authorisation before data is relocated offsite, and network diagrams identifying data flows with legal compliance impacts. Location constraints come from the Cloud Security Policy, NIA controls, data classification and applicable law, and must be checked per workload.</p>\n<h4>Workload placement heuristics</h4>\n<ol>\n<li>Classify data; apply the national and internal policy for each class.</li>\n<li>Prefer managed (PaaS/SaaS) services where policy permits &mdash; less to operate.</li>\n<li>Keep tightly coupled, latency-sensitive components together.</li>\n<li>Consider data gravity: analytics should run near the data it uses.</li>\n<li>Document each placement decision as an ADR referencing the policy clause.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Accidental hybrid: workloads spread across environments without consistent identity, network and monitoring. Every additional environment multiplies security and operations effort.</div>\n<div class=\"callout gta\"><b>At GTA</b> Baseline: Azure West Europe (primary), Azure North Europe (DR), the Meeza data centre and the Government Network; no formal multi-cloud strategy; a possible move to Qatar Central is under review, with a warning that service differences could cause rework. Record the policy version and reasoning for each placement as an ADR, and check current policy with MCIT and the National Cyber Security Agency.</div>",
  "related": [
   "gta-hosting-baseline",
   "gea-trm",
   "cloud-models",
   "chk-cloud-hosting"
  ],
  "refs": [
   {
    "t": "NIST SP 800-145: The NIST Definition of Cloud Computing",
    "u": "https://csrc.nist.gov/pubs/sp/800/145/final"
   },
   {
    "t": "National Cyber Security Agency (Qatar)",
    "u": "https://www.ncsa.gov.qa"
   }
  ]
 },
 {
  "id": "platform-engineering-observability",
  "title": "Platform Engineering and Observability",
  "cat": "Technology & Cloud",
  "level": "Advanced",
  "tags": [
   "platform engineering",
   "observability",
   "devops",
   "opentelemetry",
   "slo"
  ],
  "summary": "Internal platforms provide paved roads that make the compliant way the easy way; observability provides the telemetry to run systems against measurable service objectives.",
  "minutes": 9,
  "body": "<h4>Platform engineering</h4>\n<p>A platform team builds and runs an internal developer platform (IDP) as a product, offering self-service capabilities to delivery teams. The architectural payoff: standards are embedded in templates and pipelines rather than enforced by review.</p>\n<table class=\"tbl\"><thead><tr><th>Platform capability</th><th>Embedded standard</th></tr></thead><tbody>\n<tr><td>Service templates (&ldquo;golden paths&rdquo;)</td><td>Approved language runtimes, logging, health checks, API style</td></tr>\n<tr><td>CI/CD pipelines</td><td>Tests, SAST/DAST, dependency and container scanning, OpenAPI linting, SBOM generation</td></tr>\n<tr><td>Infrastructure as code modules</td><td>Network segmentation, encryption, tagging, backup policies</td></tr>\n<tr><td>Secrets management</td><td>No credentials in code or configuration files</td></tr>\n<tr><td>Environment provisioning</td><td>Consistent dev/test/prod; production-like test data rules (masked)</td></tr>\n<tr><td>Service catalogue</td><td>Ownership, dependencies, on-call, documentation links</td></tr>\n</tbody></table>\n<h4>Observability</h4>\n<dl class=\"defs\">\n<dt>Metrics</dt><dd>Numeric time series: request rate, errors, latency (RED); utilisation, saturation, errors (USE) for resources.</dd>\n<dt>Logs</dt><dd>Structured (JSON) event records with correlation IDs; no secrets; personal data minimised and masked.</dd>\n<dt>Traces</dt><dd>End-to-end request paths across services, using W3C Trace Context; OpenTelemetry as the vendor-neutral instrumentation standard.</dd>\n</dl>\n<h4>Service level objectives</h4>\n<pre class=\"code\">Service:   Return submission API\nSLI:       Proportion of POST /v1/returns requests completing\n           successfully (non-5xx) within 2 s, measured at gateway\nSLO:       99.5% over a rolling 28 days\n           (stricter targets during filing peak periods)\nError budget: 0.5% of requests; burn-rate alerts at 2% / 1h\n              and 5% / 6h\nOwner:     Returns product team</pre>\n<h4>Delivery performance</h4>\n<p>DORA metrics &mdash; deployment frequency, lead time for changes, change failure rate and time to restore service &mdash; are widely used to measure delivery capability; the platform should make them visible automatically.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Building a platform nobody asked for. Treat delivery teams as customers, start with their biggest friction, and measure adoption.</div>\n<div class=\"callout gta\"><b>At GTA</b> Filing deadlines create predictable peaks. SLOs and capacity tests should explicitly cover peak periods, and observability dashboards should show taxpayer-facing journeys end to end, not just server health.</div>",
  "related": [
   "resilience-dr-tiers",
   "tailoring-togaf-agile",
   "tpl-nfr-catalogue",
   "technology-reference-model"
  ],
  "refs": [
   {
    "t": "OpenTelemetry",
    "u": "https://opentelemetry.io"
   },
   {
    "t": "CNCF Platforms White Paper",
    "u": "https://tag-app-delivery.cncf.io/whitepapers/platforms/"
   },
   {
    "t": "DORA research",
    "u": "https://dora.dev"
   }
  ]
 },
 {
  "id": "resilience-dr-tiers",
  "title": "Resilience and Disaster Recovery Tiers (RPO/RTO)",
  "cat": "Technology & Cloud",
  "level": "Practitioner",
  "tags": [
   "resilience",
   "disaster recovery",
   "rpo",
   "rto",
   "business continuity"
  ],
  "summary": "Define recovery objectives per business service, map them to a small set of DR tiers with standard patterns, and test them. Resilience is designed, not bought.",
  "minutes": 8,
  "body": "<dl class=\"defs\">\n<dt>RTO (Recovery Time Objective)</dt><dd>Maximum acceptable time to restore a service after disruption.</dd>\n<dt>RPO (Recovery Point Objective)</dt><dd>Maximum acceptable data loss, measured in time.</dd>\n<dt>MTPD (Maximum Tolerable Period of Disruption)</dt><dd>Time after which the impact on the organisation becomes unacceptable; set by the business impact analysis (BIA). RTO must be shorter.</dd>\n</dl>\n<h4>Illustrative tier model</h4>\n<table class=\"tbl\"><thead><tr><th>Tier</th><th>RTO</th><th>RPO</th><th>Pattern</th><th>Example services</th></tr></thead><tbody>\n<tr><td>0 &ndash; Mission critical</td><td>&lt; 1 hour</td><td>&asymp; 0 to 5 min</td><td>Active-active or hot standby across sites; synchronous or near-synchronous replication; automated failover</td><td>Identity, payment receipt, API gateway</td></tr>\n<tr><td>1 &ndash; Critical</td><td>&lt; 4 hours</td><td>&lt; 15 min</td><td>Warm standby; asynchronous replication; scripted failover</td><td>Return filing, taxpayer portal</td></tr>\n<tr><td>2 &ndash; Important</td><td>&lt; 24 hours</td><td>&lt; 4 hours</td><td>Pilot light; infrastructure as code rebuild; frequent backups</td><td>Audit case management, analytics</td></tr>\n<tr><td>3 &ndash; Standard</td><td>&lt; 72 hours</td><td>&lt; 24 hours</td><td>Backup and restore</td><td>Internal reporting, intranet tools</td></tr>\n</tbody></table>\n<p>Values are illustrative; actual targets come from the BIA and must be approved by business owners, because cost rises steeply with each tier.</p>\n<h4>Design principles</h4>\n<ul>\n<li>Tier is a property of the <strong>business service</strong>; all dependencies must meet the same tier or have a degradation plan (e.g. queue submissions if a downstream system is unavailable).</li>\n<li>Design for graceful degradation: timeouts, circuit breakers, bulkheads, retries with backoff and jitter.</li>\n<li>Backups must be immutable or logically isolated to survive ransomware; restore tests prove RPO.</li>\n<li>Failover must be tested regularly, including failback and data reconciliation.</li>\n<li>Document runbooks; automate where possible.</li>\n</ul>\n<h4>GEA expectations</h4>\n<ul>\n<li>Service Management: an <strong>IT Service Continuity Plan</strong> that meets or exceeds agreed business continuity targets; availability management built on reliability, maintainability, serviceability, performance and security.</li>\n<li>TRM business continuity and resiliency controls (Required): secured, monitored and tested data-centre utilities with automated failover; asset inventory at all sites; DR across cloud data centres; IT governance and service management based on ITIL v3 and COBIT 5.</li>\n<li>NIA domain Business Continuity Management [BC].</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> A tier-1 application depending on a tier-3 shared component (e.g. a file share or a licence server). Dependency mapping in the repository exposes these mismatches.</div>\n<div class=\"callout gta\"><b>At GTA</b> The 2025 baseline found no formal IT DR and business continuity strategy, insufficient Dhareeba DR testing and documentation, and a DR failover that depends on external entities such as authentication via MCIT. That last point is exactly the dependency mismatch above: tier the external dependencies too. Filing and payment deadlines also make some services seasonally more critical; reflect this in the BIA and maintenance windows.</div>",
  "related": [
   "gta-hosting-baseline",
   "gea-service-management",
   "tpl-nfr-catalogue",
   "chk-cloud-hosting"
  ],
  "refs": [
   {
    "t": "ISO 22301 Business continuity management systems",
    "u": "https://www.iso.org/standard/75106.html"
   },
   {
    "t": "Google SRE Book",
    "u": "https://sre.google/sre-book/table-of-contents/"
   }
  ]
 },
 {
  "id": "security-by-design",
  "title": "Security by Design and Security Architecture",
  "cat": "Security Architecture",
  "level": "Practitioner",
  "tags": [
   "security by design",
   "sabsa",
   "defence in depth",
   "secure sdlc"
  ],
  "summary": "Security architecture integrates controls into business, data, application and technology design from the start, driven by risk and traceable to business requirements.",
  "minutes": 8,
  "body": "<p>Security by design means security requirements are identified with other requirements, addressed in architecture decisions, verified in delivery and monitored in operation. Retrofitting controls after go-live is more expensive and usually less effective.</p>\n<h4>Foundational principles</h4>\n<table class=\"tbl\"><thead><tr><th>Principle</th><th>Architectural meaning</th></tr></thead><tbody>\n<tr><td>Least privilege</td><td>Identities, services and integrations receive only the access they need, for only as long as needed</td></tr>\n<tr><td>Defence in depth</td><td>Multiple independent layers of control; no single control failure exposes data</td></tr>\n<tr><td>Secure defaults</td><td>Platforms and templates are secure out of the box; insecure configuration requires explicit action</td></tr>\n<tr><td>Fail securely</td><td>Errors deny access and do not leak information</td></tr>\n<tr><td>Complete mediation</td><td>Every access request is checked; no trusted shortcuts</td></tr>\n<tr><td>Separation of duties</td><td>Critical operations (e.g. refund approval and payment release) require different people or systems</td></tr>\n<tr><td>Minimise attack surface</td><td>Fewer exposed interfaces, services and data copies</td></tr>\n<tr><td>Auditability</td><td>Security-relevant events recorded, protected and reviewable</td></tr>\n</tbody></table>\n<h4>Integrating security into the architecture lifecycle</h4>\n<ol>\n<li><strong>Vision</strong>: identify security stakeholders, regulations, data classes and risk appetite.</li>\n<li><strong>Design</strong>: classify data, define trust boundaries, threat model, select controls and patterns.</li>\n<li><strong>Build</strong>: secure coding standards, SAST, dependency scanning, secrets management.</li>\n<li><strong>Verify</strong>: DAST, penetration testing proportional to risk, configuration review.</li>\n<li><strong>Operate</strong>: logging to SIEM, vulnerability management, incident response, access recertification.</li>\n</ol>\n<h4>National baseline: NIA and GEA Security Management</h4>\n<p>In Qatar, the <strong>National Information Assurance (NIA) policy</strong> is the mandatory foundation for agency security, structured in 26 domains (e.g. Access Control [AM], Software Security [SS], Information Exchange [IE], Logging, Auditing &amp; Security Monitoring [SM]). GEA Security Management adds the Cloud Security Policy, the BYOD policy, the Qatar e-Authentication Framework and the Information Security Risk Management Framework. Security-by-design work at GTA should trace each control to its NIA domain.</p>\n<h4>SABSA in brief</h4>\n<p>SABSA (Sherwood Applied Business Security Architecture) is a business-driven, risk-based security architecture framework. Its layered model &mdash; contextual, conceptual, logical, physical, component and operational &mdash; mirrors Zachman-style perspectives and emphasises traceability from business attributes (e.g. &ldquo;confidential&rdquo;, &ldquo;available&rdquo;, &ldquo;auditable&rdquo;) to controls. TOGAF and SABSA are frequently used together; TOGAF also offers a Security Architecture Series Guide.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Security as a final sign-off gate. Late findings either delay go-live or get waived; both are bad outcomes. Involve security at concept stage.</div>\n<div class=\"callout gta\"><b>At GTA</b> GTA is ISO/IEC 27001 certified. Tax data is among the most sensitive data held by government: every Solution Architecture Document should include classification, trust boundaries, identity flows, a threat model summary and the relevant NIA domains before TRB approval.</div>",
  "related": [
   "gea-security-management",
   "threat-modelling-stride",
   "zero-trust",
   "data-classification"
  ],
  "refs": [
   {
    "t": "SABSA Institute",
    "u": "https://sabsa.org"
   },
   {
    "t": "NIST Cybersecurity Framework",
    "u": "https://www.nist.gov/cyberframework"
   }
  ]
 },
 {
  "id": "zero-trust",
  "title": "Zero Trust Architecture",
  "cat": "Security Architecture",
  "level": "Advanced",
  "tags": [
   "zero trust",
   "nist 800-207",
   "policy enforcement",
   "segmentation"
  ],
  "summary": "Zero trust removes implicit trust based on network location: every access request is authenticated, authorised and continuously evaluated against policy.",
  "minutes": 8,
  "diagram": "zero-trust",
  "body": "<p>NIST SP 800-207 describes zero trust as a set of paradigms that move defences from static, network-based perimeters to focus on users, assets and resources. No implicit trust is granted to assets or accounts based solely on physical or network location.</p>\n<h4>Logical components (NIST SP 800-207)</h4>\n<dl class=\"defs\">\n<dt>Policy Engine (PE)</dt><dd>Decides whether to grant access to a resource, using policy and inputs such as identity, device posture, threat intelligence and behaviour.</dd>\n<dt>Policy Administrator (PA)</dt><dd>Establishes or shuts down the communication path, based on the PE&rsquo;s decision.</dd>\n<dt>Policy Enforcement Point (PEP)</dt><dd>Enables, monitors and terminates connections between subject and resource (e.g. gateway, proxy, agent).</dd>\n<dt>Policy inputs</dt><dd>Identity management, CDM/device posture, SIEM, threat intelligence, data access policies, PKI, activity logs.</dd>\n</dl>\n<h4>Tenets (paraphrased)</h4>\n<ol>\n<li>All data sources and computing services are resources.</li>\n<li>All communication is secured regardless of network location.</li>\n<li>Access is granted per session.</li>\n<li>Access is determined by dynamic policy, including client identity, application, asset state and behavioural attributes.</li>\n<li>The enterprise monitors and measures the integrity and security posture of all owned and associated assets.</li>\n<li>Authentication and authorisation are dynamic and strictly enforced before access is allowed.</li>\n<li>The enterprise collects information about the current state of assets, network and communications to improve its security posture.</li>\n</ol>\n<h4>Practical adoption path</h4>\n<table class=\"tbl\"><thead><tr><th>Pillar</th><th>Step</th></tr></thead><tbody>\n<tr><td>Identity</td><td>Single workforce IdP, phishing-resistant MFA, conditional access, privileged access management</td></tr>\n<tr><td>Devices</td><td>Managed device posture as an access condition</td></tr>\n<tr><td>Networks</td><td>Micro-segmentation; remove flat internal networks; encrypt east-west traffic</td></tr>\n<tr><td>Applications and workloads</td><td>Identity-aware proxies; service-to-service mTLS and workload identities</td></tr>\n<tr><td>Data</td><td>Classification-driven access policies; encryption; DLP</td></tr>\n<tr><td>Visibility and analytics</td><td>Central logging and analytics feeding the policy engine</td></tr>\n</tbody></table>\n<div class=\"callout warn\"><b>Pitfall</b> Buying a &ldquo;zero trust product&rdquo;. Zero trust is an architecture strategy implemented across identity, network, application and data controls over several years.</div>\n<div class=\"callout gta\"><b>At GTA</b> Zero trust work maps naturally onto the five layers of the security reference architecture used in GTA&rsquo;s 2025 baseline (shared security services, users, devices, applications and data, network) and onto NIA domains such as Access Control [AM], Network Security [NS] and Gateway Security [GS]. Sequence it through the security roadmap; individual controls are not discussed in this hub.</div>",
  "related": [
   "iam-federation",
   "security-by-design",
   "hybrid-sovereign-cloud",
   "data-classification"
  ],
  "refs": [
   {
    "t": "NIST SP 800-207: Zero Trust Architecture",
    "u": "https://csrc.nist.gov/pubs/sp/800/207/final"
   }
  ]
 },
 {
  "id": "iam-federation",
  "title": "Identity and Access Management and Federation",
  "cat": "Security Architecture",
  "level": "Practitioner",
  "tags": [
   "iam",
   "federation",
   "oidc",
   "oauth",
   "nas"
  ],
  "summary": "Identity is the primary security perimeter. Separate citizen/taxpayer, workforce and machine identities, federate with national identity services, and authorise with standard protocols.",
  "minutes": 9,
  "body": "<h4>Identity populations</h4>\n<table class=\"tbl\"><thead><tr><th>Population</th><th>Source of identity</th><th>Typical protocols</th><th>Key concerns</th></tr></thead><tbody>\n<tr><td>Taxpayers (individuals, business representatives)</td><td>National identity / authentication service (in Qatar, the National Authentication System, NAS: a WoG shared service)</td><td>OIDC or SAML federation</td><td>Assurance level, delegation (acting on behalf of an entity), consent</td></tr>\n<tr><td>Tax agents and intermediaries</td><td>National identity plus authority-managed authorisations</td><td>OIDC + authorisation service</td><td>Scope and expiry of mandates; audit</td></tr>\n<tr><td>Workforce</td><td>Enterprise IdP linked to HR</td><td>OIDC, SAML, Kerberos (legacy)</td><td>Joiner-mover-leaver, MFA, privileged access</td></tr>\n<tr><td>Partners (government, banks)</td><td>Their own IdP or client certificates</td><td>OAuth 2.0 client credentials, mTLS</td><td>Trust agreements, key rotation</td></tr>\n<tr><td>Workloads / services</td><td>Platform-issued workload identity</td><td>mTLS, OAuth 2.0, token exchange</td><td>No shared static secrets</td></tr>\n</tbody></table>\n<h4>Protocol roles</h4>\n<dl class=\"defs\">\n<dt>OAuth 2.0</dt><dd>Delegated authorisation framework: issues access tokens for APIs. Use the authorisation code flow with PKCE for browser and mobile clients; client credentials for machine-to-machine.</dd>\n<dt>OpenID Connect (OIDC)</dt><dd>Identity layer on OAuth 2.0: ID tokens convey authentication results to relying parties.</dd>\n<dt>SAML 2.0</dt><dd>XML-based federation, common in older enterprise and government integrations.</dd>\n<dt>SCIM</dt><dd>Standard for provisioning identities across systems.</dd>\n</dl>\n<h4>Authorisation design</h4>\n<ul>\n<li><strong>RBAC</strong> for workforce roles (auditor, assessor, supervisor), with separation of duties rules.</li>\n<li><strong>ABAC / policy-based</strong> for fine-grained rules: e.g. an auditor may only access cases assigned to their unit; a representative may only file for taxpayers who authorised them, for the specified tax types.</li>\n<li>Externalise authorisation policy where possible so it is consistent and auditable across applications.</li>\n<li>Recertify access periodically; remove access automatically on role change.</li>\n</ul>\n<h4>National context</h4>\n<ul>\n<li>GEA lists the <strong>National Authentication Service</strong> as a WoG shared service (secure authentication, digital signing and single sign-on for government online services) and Resolution 18/2010 requires agencies to reuse the shared authentication platform rather than build their own.</li>\n<li>The <strong>Qatar e-Authentication Framework (QeAF)</strong> requires each entity to assess its e-authentication means with a risk-based approach covering assertions of identity, role, delegation and value.</li>\n<li>Access management follows least privilege per the NIA policy (GEA Service Management).</li>\n</ul>\n<h4>Assurance</h4>\n<p>NIST SP 800-63 defines identity assurance (IAL), authenticator assurance (AAL) and federation assurance (FAL) levels. Map each transaction&rsquo;s risk to required levels: viewing guidance needs none; amending bank details for refunds needs strong authentication and possibly step-up.</p>\n<div class=\"callout gta\"><b>At GTA</b> Taxpayers access Dhareeba through NAS, the WoG national authentication service. GTA systems then focus on authorisation: which entities and tax types a person may act for, and under what delegation (QeAF&rsquo;s &ldquo;delegation&rdquo; assertions). Treat the delegation model as a core domain, not as an afterthought in the portal. Note that a dependency on NAS also matters for DR planning.</div>",
  "related": [
   "gea-security-management",
   "zero-trust",
   "gta-reference-architecture",
   "api-design-standards"
  ],
  "refs": [
   {
    "t": "NIST SP 800-63 Digital Identity Guidelines",
    "u": "https://pages.nist.gov/800-63-3/"
   },
   {
    "t": "OpenID Connect",
    "u": "https://openid.net/connect/"
   },
   {
    "t": "RFC 6749 - The OAuth 2.0 Authorization Framework",
    "u": "https://www.rfc-editor.org/rfc/rfc6749"
   }
  ]
 },
 {
  "id": "data-classification",
  "title": "Data Classification",
  "cat": "Security Architecture",
  "level": "Foundation",
  "tags": [
   "classification",
   "confidentiality",
   "information assurance",
   "handling"
  ],
  "summary": "Classification labels data by the impact of compromise, so that protection is proportionate. It must be applied at creation and carried through systems, integrations and analytics.",
  "minutes": 7,
  "body": "<p>Classification answers: <em>what would be the impact if this data were disclosed, altered or unavailable?</em> The answer drives hosting, access, encryption, sharing and retention controls. In Qatar, government entities follow the National Information Assurance (NIA) policy, whose domains include Data Labeling [DL] and Data Retention &amp; Archival [DR], and the classification scheme issued by the competent national authority. The levels below are illustrative; use the national scheme in force.</p>\n<h4>Illustrative scheme</h4>\n<table class=\"tbl\"><thead><tr><th>Level</th><th>Description</th><th>Tax examples</th></tr></thead><tbody>\n<tr><td>Public</td><td>Approved for public release</td><td>Published guidance, forms, public service standards</td></tr>\n<tr><td>Internal</td><td>For internal use; low impact if disclosed</td><td>Internal procedures, non-sensitive project documents</td></tr>\n<tr><td>Confidential</td><td>Significant harm to individuals or the organisation if disclosed</td><td>Taxpayer identity, returns, payments, audit findings</td></tr>\n<tr><td>Restricted / Secret (highest)</td><td>Severe harm; strict need-to-know</td><td>Investigation intelligence, certain treaty exchange data, cryptographic keys</td></tr>\n</tbody></table>\n<h4>Classification practice</h4>\n<ul>\n<li>Classify at <strong>data entity and attribute level</strong> in the data catalogue, not only at system level.</li>\n<li>A dataset or system inherits the <strong>highest</strong> classification of the data it holds (high-water mark); aggregation can raise classification.</li>\n<li>Consider integrity and availability as well as confidentiality.</li>\n<li>Owners classify; custodians implement controls; security verifies.</li>\n<li>Review classification when purpose, aggregation or retention changes.</li>\n</ul>\n<h4>Labels in architecture</h4>\n<ol>\n<li>Data catalogue entries carry classification.</li>\n<li>Application records carry highest classification handled.</li>\n<li>Interfaces carry classification of their payload.</li>\n<li>Infrastructure and hosting zones declare the maximum classification permitted.</li>\n<li>Correspondence rule: no component may process data above its zone&rsquo;s permitted level.</li>\n</ol>\n<h4>Classification in GEA artefacts</h4>\n<ul>\n<li>The IRM unstructured data description template carries a <strong>Confidentiality</strong> attribute; the Exchange Package template carries a security <strong>Classification</strong>.</li>\n<li>Data Classification is one of the nine Smart Qatar data management domains.</li>\n<li>Recommended security operations controls apply according to asset value calculated under the asset classification standard.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Classifying everything at the highest level &ldquo;to be safe&rdquo;. Over-classification blocks legitimate sharing and analytics, and controls become unaffordable, so people bypass them.</div>\n<div class=\"callout gta\"><b>At GTA</b> A data classification project is in progress. Align its levels with the national scheme and record them in the IRM-aligned Information Assets Catalogue. Analytics outputs need classification too: aggregated revenue statistics may be publishable under the Open Data Policy, while small-cell aggregates can still identify taxpayers; apply disclosure-control rules before release.</div>",
  "related": [
   "tpl-classification-controls",
   "gea-security-management",
   "data-governance-stewardship",
   "data-sharing-apis"
  ],
  "refs": [
   {
    "t": "National Cyber Security Agency (Qatar)",
    "u": "https://www.ncsa.gov.qa"
   },
   {
    "t": "ISO/IEC 27001 Information security management",
    "u": "https://www.iso.org/standard/27001"
   }
  ]
 },
 {
  "id": "threat-modelling-stride",
  "title": "Threat Modelling with STRIDE",
  "cat": "Security Architecture",
  "level": "Practitioner",
  "tags": [
   "threat modelling",
   "stride",
   "data flow diagram",
   "risk"
  ],
  "summary": "Threat modelling systematically identifies what can go wrong in a design. STRIDE provides six threat categories to apply to each element and trust boundary of a data-flow diagram.",
  "minutes": 8,
  "body": "<p>Threat modelling answers four questions: <em>What are we working on? What can go wrong? What are we going to do about it? Did we do a good enough job?</em> It is most valuable at design time, when changes are cheap.</p>\n<h4>STRIDE</h4>\n<table class=\"tbl\"><thead><tr><th>Threat</th><th>Property violated</th><th>Tax example</th><th>Typical mitigations</th></tr></thead><tbody>\n<tr><td><strong>S</strong>poofing</td><td>Authentication</td><td>Attacker impersonates a taxpayer to redirect a refund</td><td>Strong authentication via national identity, MFA, step-up for bank detail changes</td></tr>\n<tr><td><strong>T</strong>ampering</td><td>Integrity</td><td>Modification of return data in transit or in a batch file</td><td>TLS, message signing, checksums, database integrity controls</td></tr>\n<tr><td><strong>R</strong>epudiation</td><td>Non-repudiation</td><td>Taxpayer denies submitting a return; officer denies approving a refund</td><td>Tamper-evident audit logs, signed submissions, timestamps</td></tr>\n<tr><td><strong>I</strong>nformation disclosure</td><td>Confidentiality</td><td>Exposure of taxpayer data via an API returning excessive fields</td><td>Data minimisation, object-level authorisation, encryption, masking</td></tr>\n<tr><td><strong>D</strong>enial of service</td><td>Availability</td><td>Portal overwhelmed near a filing deadline</td><td>Rate limiting, autoscaling, WAF/DDoS protection, queues</td></tr>\n<tr><td><strong>E</strong>levation of privilege</td><td>Authorisation</td><td>Representative gains access to taxpayers they do not represent</td><td>Server-side authorisation checks on every object, least privilege</td></tr>\n</tbody></table>\n<h4>Process</h4>\n<ol>\n<li>Draw a data-flow diagram: external entities, processes, data stores, data flows, and <strong>trust boundaries</strong>.</li>\n<li>For each element and each flow crossing a boundary, apply STRIDE categories.</li>\n<li>Record threats with likelihood and impact; link to the classification of the data involved.</li>\n<li>Decide: mitigate, eliminate, transfer or accept (with owner and approval).</li>\n<li>Turn mitigations into backlog items and test cases.</li>\n<li>Revisit when the design changes significantly.</li>\n</ol>\n<h4>Linking threats to NIA</h4>\n<p>Record the NIA domain each mitigation implements, so threat models feed the agency&rsquo;s NIA compliance evidence: spoofing &rarr; Access Control [AM]; tampering &rarr; Cryptographic Security [CY], Software Security [SS]; repudiation &rarr; Logging, Auditing &amp; Security Monitoring [SM]; information disclosure &rarr; Data Labeling [DL], Information Exchange [IE]; denial of service &rarr; Network Security [NS], Gateway Security [GS], Business Continuity [BC]; elevation of privilege &rarr; Access Control [AM], System Usage Security [SU].</p>\n<h4>Complementary techniques</h4>\n<ul>\n<li>Attack trees for high-value targets (e.g. refund fraud).</li>\n<li>Abuse cases alongside use cases.</li>\n<li>OWASP Top 10 and API Security Top 10 as checklists for web and API designs.</li>\n<li>LINDDUN for privacy threat modelling.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Refund and bank-account change journeys deserve a dedicated threat model with fraud specialists present: they combine financial value, identity risk and insider risk.</div>",
  "related": [
   "security-by-design",
   "gea-security-management",
   "data-classification",
   "iam-federation"
  ],
  "refs": [
   {
    "t": "OWASP Threat Modeling",
    "u": "https://owasp.org/www-community/Threat_Modeling"
   },
   {
    "t": "Microsoft Threat Modeling Tool - STRIDE threats",
    "u": "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats"
   },
   {
    "t": "OWASP Top Ten",
    "u": "https://owasp.org/www-project-top-ten/"
   }
  ]
 },
 {
  "id": "tpl-architecture-principle",
  "title": "Template: Architecture Principle (with Worked GTA Example)",
  "cat": "Templates & Checklists",
  "level": "Foundation",
  "tags": [
   "template",
   "principles",
   "governance",
   "example"
  ],
  "summary": "A ready-to-use principle template following the TOGAF Name / Statement / Rationale / Implications structure, plus a fully worked example and a quality checklist.",
  "minutes": 6,
  "body": "<h4>Template</h4>\n<pre class=\"code\">ID:            AP-&lt;domain&gt;-&lt;nn&gt;   (e.g. AP-DAT-03)\nName:          &lt;short, memorable, product-neutral&gt;\nDomain:        Business | Data | Application | Technology | Security\nStatement:     &lt;one or two sentences; a rule that closes off options&gt;\nRationale:     &lt;business benefits; link to strategic objective or value;\n                relationship to other principles&gt;\nImplications:  &lt;what must be done differently; costs; who is affected;\n                how compliance will be checked&gt;\nTraceability:  &lt;strategic objective(s), values, policies, GEA references&gt;\nExceptions:    &lt;how deviations are handled - via dispensation process&gt;\nOwner:         &lt;role accountable for interpreting the principle&gt;\nStatus:        Draft | Approved | Retired\nApproved by / date:\nReview date:</pre>\n<h4>Worked example</h4>\n<dl class=\"defs\">\n<dt>ID / Name</dt><dd>AP-DAT-03 &mdash; <strong>Once-Only Data Collection</strong></dd>\n<dt>Statement</dt><dd>GTA collects a given item of taxpayer data once, from its authoritative source, and reuses it across services. New services must not ask taxpayers for data that GTA already holds or can lawfully obtain from another government source.</dd>\n<dt>Rationale</dt><dd>Reduces taxpayer burden and errors, directly supporting the strategic objective <em>Enhance Taxpayer Services and Satisfaction</em> and the value <em>Customer-Centricity</em>. Improves data consistency, which supports <em>Strengthen Compliance and Enforcement</em> (risk models rely on consistent data) and <em>Promote Transparency and Trust</em>. Reinforces the principle &ldquo;Data is an Asset&rdquo; (AP-DAT-01).</dd>\n<dt>Implications</dt><dd>\n<ul>\n<li>Every data entity must have an identified authoritative source recorded in the data catalogue.</li>\n<li>Forms and portals pre-fill known data; taxpayers confirm or correct rather than re-enter.</li>\n<li>Corrections flow back to the authoritative source through a defined process, not into local copies.</li>\n<li>Integration with external authoritative sources uses GDX where the source agency is available on it, under a data-sharing agreement; this needs funding in the roadmap.</li>\n<li>Solution Architecture Documents must list each taxpayer-provided data item and justify why it cannot be sourced.</li>\n<li>Compliance is checked at TRB design review using the data sourcing table.</li>\n</ul></dd>\n<dt>Traceability</dt><dd>GEA principles: <em>Customer centricity</em> and <em>Share information by default</em>; GEA IRM goal that &ldquo;citizens need not submit the same information twice&rdquo;. Strategic objectives: Enhance Taxpayer Services and Satisfaction; Increase Operational Efficiency and Innovation. Values: Customer-Centricity, Efficiency, Data Leadership.</dd>\n<dt>Exceptions</dt><dd>Where the legal basis requires a fresh declaration by the taxpayer (e.g. a signed return), the data is collected as a declaration but pre-filled where lawful.</dd>\n<dt>Owner</dt><dd>Lead Data Architect, with the Taxpayer Service data owner.</dd>\n</dl>\n<h4>Deriving GTA principles from GEA</h4>\n<p>Start each GTA principle from one of the seven GEA principles (Customer centricity; Promote reuse; Share information by default; Enable co-creation through a collaborative environment; Trust and confidence; Interoperable; Design for future) and make it specific enough to decide between real options. Examples: <em>Promote reuse</em> &rarr; &ldquo;WoG shared services first&rdquo;; <em>Interoperable</em> &rarr; &ldquo;No new point-to-point integration to Dhareeba&rdquo;; <em>Trust and confidence</em> &rarr; &ldquo;Classification before hosting&rdquo;.</p>\n<h4>Quality checklist</h4>\n<ul>\n<li>Could a reasonable person disagree with the statement? (If not, it is a platitude.)</li>\n<li>Does it help choose between two real design options?</li>\n<li>Is the rationale in business language and traceable to strategy?</li>\n<li>Are implications concrete enough to be checked at a review?</li>\n<li>Does it conflict with another principle, and if so is precedence stated?</li>\n</ul>",
  "related": [
   "architecture-principles",
   "gea-principles",
   "gta-strategy-to-solution",
   "mdm-reference-data"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "tpl-adr",
  "title": "Template: Architecture Decision Record (ADR)",
  "cat": "Templates & Checklists",
  "level": "Foundation",
  "tags": [
   "adr",
   "template",
   "decisions",
   "rationale",
   "markdown"
  ],
  "summary": "A Markdown ADR template, based on the widely used Nygard format with additions for governance, plus a worked example. Store ADRs with the code and harvest them into the repository.",
  "minutes": 6,
  "body": "<p>An ADR captures one significant architecture decision, its context and consequences. ADRs are immutable once accepted: to change a decision, write a new ADR that supersedes the old one. This creates a trustworthy decision history, as recommended by ISO/IEC/IEEE 42010 (decisions and rationale are AD elements).</p>\n<h4>What counts as &ldquo;significant&rdquo;?</h4>\n<ul>\n<li>Hard or costly to reverse (data store, integration style, hosting, package selection).</li>\n<li>Affects quality attributes (security, availability, performance).</li>\n<li>Deviates from a standard or sets a precedent.</li>\n<li>Affects other teams or systems.</li>\n</ul>\n<h4>Template (Markdown)</h4>\n<pre class=\"code\"># ADR-&lt;nnnn&gt;: &lt;Decision title in imperative form&gt;\n- Status: Proposed | Accepted | Rejected | Deprecated | Superseded by ADR-&lt;nnnn&gt;\n- Date: YYYY-MM-DD\n- Deciders: &lt;names / roles&gt;\n- Consulted: &lt;security, data, operations, ...&gt;\n- Related: &lt;principles, standards, TRB decision ID, other ADRs&gt;\n## Context\n&lt;The forces at play: requirements, constraints, quality attributes,\nassumptions. Neutral language. Why is a decision needed now?&gt;\n## Decision drivers\n- &lt;driver 1, e.g. RPO &lt;= 15 minutes&gt;\n- &lt;driver 2&gt;\n## Options considered\n1. &lt;Option A&gt;\n2. &lt;Option B&gt;\n3. &lt;Option C&gt;\n## Decision\n&lt;The chosen option, stated clearly: \"We will ...\"&gt;\n## Rationale\n&lt;Why this option best satisfies the drivers; trade-offs accepted.&gt;\n## Consequences\n- Positive: &lt;...&gt;\n- Negative / risks: &lt;...&gt;\n- Follow-up actions: &lt;owner, date&gt;\n## Compliance\n&lt;Standards met; any dispensation required (ID)&gt;</pre>\n<h4>Worked example (abridged)</h4>\n<pre class=\"code\"># ADR-0042: Publish tax domain events using the transactional outbox pattern\n- Status: Accepted\n- Date: 2026-03-18\n- Deciders: Returns product architect, Integration lead\n- Consulted: Security architect, Platform team\n- Related: AP-APP-02 (Loose coupling), Integration standard INT-04\n## Context\nRisk scoring, notifications and analytics need to react when a return is\nsubmitted. Today they poll the returns database nightly, causing delays\nand load. Publishing directly to the broker after the DB commit can lose\nevents if the service fails between the two steps.\n## Decision drivers\n- No lost or phantom events (events only for committed returns)\n- Consumers notified within 1 minute\n- No direct consumer access to the returns database\n## Options considered\n1. Dual write (DB commit, then publish)\n2. Transactional outbox with relay to the event broker\n3. Change data capture on the returns tables\n## Decision\nWe will write a ReturnSubmitted event to an outbox table in the same\ntransaction as the return, and a relay will publish it to the broker\nwith at-least-once delivery.\n## Rationale\nOption 2 guarantees consistency without exposing table structures (CDC\ncouples consumers to the schema). Consumers already must be idempotent.\n## Consequences\n- Positive: near-real-time consumers; polling jobs retired.\n- Negative: relay component to operate; duplicate events possible.\n- Follow-up: event schema registered in catalogue (Integration lead, Apr).\n## Compliance\nMeets INT-04. No dispensation required.</pre>\n<div class=\"callout gta\"><b>At GTA</b> Keep ADRs in each product&rsquo;s source repository (e.g. a /docs/adr folder) and link accepted ADRs from the application record in the EA repository; TRB decisions reference ADR numbers.</div>",
  "related": [
   "iso-42010",
   "tailoring-togaf-agile",
   "chk-arb-submission",
   "microservices-ddd"
  ],
  "refs": [
   {
    "t": "Architectural Decision Records (adr.github.io)",
    "u": "https://adr.github.io"
   },
   {
    "t": "Michael Nygard - Documenting Architecture Decisions",
    "u": "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
   }
  ]
 },
 {
  "id": "chk-arb-submission",
  "title": "Checklist: TRB Submission (Architecture Review Pack)",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "checklist",
   "arb",
   "review",
   "submission"
  ],
  "summary": "What a complete submission to GTA's Technical Review Board (TRB) must contain, including GEA alignment evidence. Incomplete submissions are returned, not scheduled.",
  "minutes": 5,
  "body": "<p>Use this checklist before requesting a Tier 1 or Tier 2 review. Mark each item <strong>Y</strong> (provided), <strong>N/A</strong> (with reason) or <strong>Gap</strong> (with plan).</p>\n<h4>A. Context and value</h4>\n<ul>\n<li>Initiative name, sponsor, business owner, delivery lead, solution architect.</li>\n<li>Problem statement and objectives; strategic objective(s) and KPI(s) supported.</li>\n<li>Capabilities affected (from the capability map) and value stream stages improved.</li>\n<li>Scope in/out; key assumptions and constraints (legal, timeline, budget).</li>\n<li>Requested review tier and decision sought.</li>\n</ul>\n<h4>B. Architecture</h4>\n<ul>\n<li>System context diagram (C4 level 1) showing users, external systems and partners.</li>\n<li>Container diagram (C4 level 2) or equivalent logical architecture.</li>\n<li>Options considered with evaluation, and recommended option.</li>\n<li>Reuse of shared services (identity, notification, payments, documents, integration) &mdash; or justification for not reusing.</li>\n<li>Alignment with reference architecture layers and rules.</li>\n<li>List of significant ADRs.</li>\n</ul>\n<h4>C. Data</h4>\n<ul>\n<li>Data entities created/read/updated; authoritative source for each.</li>\n<li>Classification (highest level and per interface).</li>\n<li>Data owner approval for new uses or sharing.</li>\n<li>Retention, archiving and disposal approach.</li>\n<li>Data migration approach and reconciliation (if applicable).</li>\n</ul>\n<h4>D. Integration</h4>\n<ul>\n<li>Interface list with pattern (API, event, file), direction, owner, volumes.</li>\n<li>OpenAPI / AsyncAPI contracts (draft acceptable at design review).</li>\n<li>Integration design checklist completed.</li>\n</ul>\n<h4>E. Security</h4>\n<ul>\n<li>Authentication and authorisation model; identity populations.</li>\n<li>Trust boundaries and threat model summary with key mitigations.</li>\n<li>Encryption in transit and at rest; key management.</li>\n<li>Logging and monitoring integration with security operations.</li>\n</ul>\n<h4>F. Technology and operations</h4>\n<ul>\n<li>Hosting decision (cloud/hosting checklist), environments, deployment diagram.</li>\n<li>Technology components and their lifecycle status in the standards catalogue.</li>\n<li>NFRs with measurable targets; DR tier, RPO/RTO.</li>\n<li>Observability: SLIs/SLOs, dashboards, alerting, support model.</li>\n</ul>\n<h4>G. Delivery and governance</h4>\n<ul>\n<li>Transition plan: what is retired and when.</li>\n<li>Cost: capex/opex, licensing, run cost estimate.</li>\n<li>Risks and requested dispensations with compensating controls.</li>\n<li>New technical debt introduced and its register entries.</li>\n</ul>\n<h4>H. GEA alignment (required at every GEA checkpoint)</h4>\n<ul>\n<li>Checkpoint being requested: Discovery, Alpha, Beta or Live; Design Authority members named.</li>\n<li>Services classified to BRM functional areas (e.g. 14.1 Taxes) and KPIs linked to BRM measurement areas.</li>\n<li>WoG shared services leveraged (NAS, payment platform, SMS gateway, GDX, e-correspondence) or justification for not using them.</li>\n<li>Cross-agency information assets leveraged; information assets classified to the IRM taxonomy; exchanges via GDX.</li>\n<li>Applicable mandatory GEA standards per usage area, and compliance position.</li>\n<li>GEA exceptions requested, with impact level (low / medium / high).</li>\n<li>For procured solutions: the GEA tender statement included in the RFP.</li>\n</ul>\n<div class=\"callout warn\"><b>Pitfall</b> Submitting a vendor&rsquo;s product brochure as the architecture. The TRB needs the design as it will be implemented at GTA: integrations, data, identity and operations.</div>",
  "related": [
   "arb-operating-model",
   "chk-gea-compliance",
   "tpl-solution-architecture-document",
   "chk-integration-design"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "tpl-solution-architecture-document",
  "title": "Template: Solution Architecture Document (SAD) Outline",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "template",
   "solution architecture",
   "sad",
   "documentation"
  ],
  "summary": "A practical SAD outline structured by viewpoints, sized to be useful: a 15-30 page document for most projects, with mandatory and optional sections marked.",
  "minutes": 6,
  "body": "<p>The SAD is the main design deliverable reviewed by the TRB. Mark sections <strong>[M]</strong> mandatory or <strong>[O]</strong> optional depending on tier. Prefer diagrams and tables over prose; link rather than copy from the EA repository.</p>\n<pre class=\"code\">0. Document control [M]\n   Version, status, authors, reviewers, approval, change history\n1. Executive summary [M]\n   Problem, solution in one paragraph, key decisions, risks, cost, asks\n2. Business context [M]\n   2.1 Objectives and strategic alignment (objective, KPI)\n   2.2 Capabilities and value stream stages affected\n   2.3 Stakeholders and concerns (stakeholder/viewpoint table)\n   2.4 Scope, assumptions, constraints\n   2.5 Key business requirements / use cases\n3. Architecture overview [M]\n   3.1 System context (C4 L1)\n   3.2 Options considered and evaluation\n   3.3 Recommended solution and rationale\n   3.4 Alignment with reference architecture and principles\n   3.5 GEA alignment: BRM/IRM/ARM/TRM classification, WoG shared\n       services reused, mandatory standards, GEA exceptions\n4. Business architecture [O for small changes]\n   Process changes (BPMN references), roles, organisational impact\n5. Data architecture [M]\n   5.1 Conceptual / logical data model extract\n   5.2 Data sourcing table (entity, authoritative source, owner)\n   5.3 Classification and handling\n   5.4 Data lifecycle: retention, archive, disposal\n   5.5 Migration and reconciliation [O]\n   5.6 Reporting and analytics feeds\n6. Application and integration architecture [M]\n   6.1 Container view (C4 L2); component view for key parts [O]\n   6.2 Interface catalogue (pattern, contract, owner, volume, SLA)\n   6.3 Shared services reused\n   6.4 Error handling, idempotency, retries\n7. Security architecture [M]\n   7.1 Identity populations, authentication, authorisation model\n   7.2 Trust boundaries and threat model summary\n   7.3 Cryptography and key management\n   7.4 Logging, monitoring, audit trail\n   7.5 Privacy considerations\n8. Technology architecture [M]\n   8.1 Hosting decision and deployment view\n   8.2 Environments (dev/test/stage/prod), test data approach\n   8.3 Technology components and lifecycle status\n   8.4 Network and connectivity\n9. Quality attributes [M]\n   NFR table with measurable targets; DR tier, RPO, RTO; capacity\n10. Operations and support [M]\n    SLOs, observability, runbooks, support model, backups\n11. Transition and migration [M]\n    Phasing, cutover, coexistence, decommissioning of legacy\n12. Risks, issues, dependencies, dispensations [M]\n13. Architecture decisions [M]\n    List of ADRs with status and links\nAppendices: glossary, references, detailed diagrams</pre>\n<h4>Writing guidance</h4>\n<ul>\n<li>Every diagram has a title, legend, viewpoint and date.</li>\n<li>Name components as they appear in the EA repository.</li>\n<li>State targets as numbers (&ldquo;p95 &lt; 2 s at 500 req/s&rdquo;), not adjectives (&ldquo;fast&rdquo;).</li>\n<li>Keep the SAD current until handover to operations; then archive and update the repository.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> For taxpayer-facing solutions, section 7 should always describe how users authenticated by the National Authentication System (NAS), a WoG shared service, are mapped to taxpayer entities and delegations. Section 3.5 supplies the evidence the Design Authority presents at GEA checkpoints.</div>",
  "related": [
   "chk-arb-submission",
   "tpl-nfr-catalogue",
   "notations-compared",
   "iso-42010"
  ],
  "refs": [
   {
    "t": "The C4 model for visualising software architecture",
    "u": "https://c4model.com"
   },
   {
    "t": "ISO/IEC/IEEE 42010 information site",
    "u": "http://www.iso-architecture.org/42010/"
   }
  ]
 },
 {
  "id": "tpl-nfr-catalogue",
  "title": "Template: NFR / Quality Attribute Catalogue",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "nfr",
   "quality attributes",
   "iso 25010",
   "template",
   "requirements"
  ],
  "summary": "A catalogue of non-functional requirements organised by ISO/IEC 25010 quality characteristics, with measurable default targets per criticality tier that projects can adopt or tailor.",
  "minutes": 8,
  "body": "<p>Non-functional requirements (NFRs) are where architectures succeed or fail. Each NFR must be <strong>measurable</strong>, <strong>testable</strong> and linked to a business reason. ISO/IEC 25010 provides the quality model; the targets below are illustrative defaults to be confirmed with business owners.</p>\n<h4>NFR record format</h4>\n<pre class=\"code\">ID | Quality characteristic | Requirement (measurable) | Rationale\nMeasure / test method | Target (Tier 0/1/2/3) | Priority (Must/Should)\nOwner | Verification stage (design / test / operations)</pre>\n<h4>Catalogue with default targets</h4>\n<table class=\"tbl\"><thead><tr><th>ID</th><th>Characteristic</th><th>Requirement</th><th>Tier 1 default</th><th>How verified</th></tr></thead><tbody>\n<tr><td>NFR-PER-01</td><td>Performance efficiency</td><td>Interactive page response time (server side)</td><td>p95 &lt; 2 s; p99 &lt; 4 s at peak load</td><td>Load test at 1.5&times; forecast peak</td></tr>\n<tr><td>NFR-PER-02</td><td>Performance efficiency</td><td>API latency for read operations</td><td>p95 &lt; 500 ms at gateway</td><td>Load test; production SLI</td></tr>\n<tr><td>NFR-CAP-01</td><td>Capacity</td><td>Concurrent users / throughput at filing deadline</td><td>Forecast peak &times; 1.5 without degradation</td><td>Peak load test; capacity model</td></tr>\n<tr><td>NFR-AVL-01</td><td>Reliability &ndash; availability</td><td>Service availability (excluding agreed maintenance)</td><td>99.9% monthly; 99.95% during filing peaks</td><td>SLO monitoring</td></tr>\n<tr><td>NFR-REC-01</td><td>Reliability &ndash; recoverability</td><td>RPO / RTO</td><td>RPO &lt; 15 min; RTO &lt; 4 h</td><td>DR test at least annually</td></tr>\n<tr><td>NFR-SEC-01</td><td>Security &ndash; authenticity</td><td>Taxpayer authentication</td><td>Via national authentication service; step-up for sensitive changes</td><td>Design review; penetration test</td></tr>\n<tr><td>NFR-SEC-02</td><td>Security &ndash; confidentiality</td><td>Encryption</td><td>TLS 1.2+ (1.3 preferred) in transit; encryption at rest with managed keys</td><td>Configuration scan</td></tr>\n<tr><td>NFR-SEC-03</td><td>Security &ndash; accountability</td><td>Audit trail for create/update/approve actions on tax data</td><td>100% of such actions logged with user, time, before/after; tamper-evident; retained per policy</td><td>Test cases; log review</td></tr>\n<tr><td>NFR-SEC-04</td><td>Security</td><td>Vulnerability remediation</td><td>Critical &le; 7 days, High &le; 30 days (or per policy)</td><td>Vulnerability management reports</td></tr>\n<tr><td>NFR-USA-01</td><td>Usability / accessibility</td><td>Accessibility conformance</td><td>WCAG 2.1 AA (or newer as mandated); full Arabic RTL support</td><td>Accessibility audit</td></tr>\n<tr><td>NFR-MNT-01</td><td>Maintainability</td><td>Automated test coverage on business rules</td><td>&ge; 80% for calculation modules; all tax rules covered by tests</td><td>CI reports</td></tr>\n<tr><td>NFR-MNT-02</td><td>Maintainability</td><td>Deployment</td><td>Fully automated pipeline; rollback &lt; 15 min</td><td>Pipeline evidence</td></tr>\n<tr><td>NFR-COM-01</td><td>Compatibility &ndash; interoperability</td><td>External interfaces</td><td>Documented in OpenAPI/AsyncAPI; versioned per API standard</td><td>Contract lint in CI</td></tr>\n<tr><td>NFR-OBS-01</td><td>Operability</td><td>Telemetry</td><td>Structured logs, metrics and traces with correlation IDs; dashboards and alerts before go-live</td><td>Operational readiness review</td></tr>\n<tr><td>NFR-DAT-01</td><td>Data retention</td><td>Retention and disposal</td><td>Per records retention schedule; automated disposal or archive</td><td>Design review; audit</td></tr>\n</tbody></table>\n<div class=\"callout warn\"><b>Pitfall</b> Copying &ldquo;99.999% availability&rdquo; into every requirement. Each extra nine costs significantly; let the BIA and tier decide.</div>\n<div class=\"callout gta\"><b>At GTA</b> Tax rule changes arrive with legislation and policy updates. Maintainability NFRs on rule configuration and test automation are as important as performance targets.</div>",
  "related": [
   "resilience-dr-tiers",
   "tpl-solution-architecture-document",
   "platform-engineering-observability",
   "security-by-design"
  ],
  "refs": [
   {
    "t": "ISO/IEC 25010 quality model (ISO 25000 portal)",
    "u": "https://iso25000.com/index.php/en/iso-25000-standards/iso-25010"
   },
   {
    "t": "W3C Web Content Accessibility Guidelines",
    "u": "https://www.w3.org/WAI/standards-guidelines/wcag/"
   }
  ]
 },
 {
  "id": "chk-integration-design",
  "title": "Checklist: Integration Design",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "checklist",
   "integration",
   "api",
   "events",
   "security"
  ],
  "summary": "A design checklist for every new or changed interface: pattern choice, contract, security, reliability, data and operations.",
  "minutes": 6,
  "body": "<p>Complete one checklist per interface. Attach to the SAD; the integration lead reviews before TRB.</p>\n<h4>1. Purpose and pattern</h4>\n<ul>\n<li>Business purpose, triggering event and consuming process are stated.</li>\n<li>Pattern selected and justified: synchronous API, asynchronous message, event, file. Shared database access is not used between separately owned systems.</li>\n<li>Existing interface or event reused where possible (checked in the interface catalogue).</li>\n<li>Provider and consumer owners named; interface owner accountable for the contract.</li>\n</ul>\n<h4>2. Contract</h4>\n<ul>\n<li>OpenAPI (APIs) or AsyncAPI (events) contract drafted and linted against the API style guide.</li>\n<li>Canonical or domain definitions used for shared concepts; reference data codes from authoritative lists.</li>\n<li>Versioning and deprecation approach stated; backward compatibility rules understood by consumers.</li>\n<li>Error model (Problem Details) and status codes defined; business errors distinguished from technical errors.</li>\n</ul>\n<h4>3. Security</h4>\n<ul>\n<li>Payload classification identified; interface classification = highest field classification.</li>\n<li>Authentication: OAuth 2.0 (client credentials / token exchange) and/or mTLS; no shared static passwords.</li>\n<li>Authorisation at object level (e.g. caller may access this taxpayer&rsquo;s data) enforced in the provider.</li>\n<li>Data minimisation: only fields needed by the consumer are returned.</li>\n<li>Encryption in transit; additional payload encryption or signing for high-classification or external exchanges.</li>\n<li>Exposure through the API gateway for external and cross-zone calls.</li>\n<li>Threat model covers this flow (STRIDE on the trust boundary crossing).</li>\n</ul>\n<h4>4. Reliability</h4>\n<ul>\n<li>Timeouts, retries with exponential backoff and jitter, circuit breakers configured.</li>\n<li>Idempotency: idempotency keys for commands; consumers tolerate duplicate events.</li>\n<li>Ordering requirements stated (and partition keys chosen accordingly).</li>\n<li>Dead-letter handling and reprocessing procedure defined.</li>\n<li>Transactional consistency approach: outbox, saga or compensation, as needed.</li>\n<li>Behaviour when the counterpart is unavailable (queue, degrade, fail) is defined.</li>\n</ul>\n<h4>5. Data and volumes</h4>\n<ul>\n<li>Volumes, peak rates, payload sizes and growth estimated (including filing peaks).</li>\n<li>Latency/freshness requirement stated.</li>\n<li>Reconciliation for financial or bulk flows (counts, totals, acknowledgements).</li>\n<li>For external exchanges: legal basis, data-sharing agreement and data owner approval referenced.</li>\n</ul>\n<h4>6. Operations</h4>\n<ul>\n<li>Correlation ID and trace context propagated end to end.</li>\n<li>Metrics: rate, errors, latency; alerts on SLO breach and DLQ growth.</li>\n<li>Audit logging of access to classified data.</li>\n<li>Interface registered in the catalogue with owner, consumers, contract link and SLA.</li>\n<li>Test approach: contract tests, consumer-driven tests, non-production test data (masked).</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Interfaces with ministries go through GDX where the counterpart is on it; banks and treaty partners through the gateway or managed file transfer; every one with an exchange register entry following the IRM Exchange Package template.</div>",
  "related": [
   "integration-patterns",
   "api-design-standards",
   "data-sharing-apis",
   "threat-modelling-stride"
  ],
  "refs": [
   {
    "t": "Enterprise Integration Patterns",
    "u": "https://www.enterpriseintegrationpatterns.com"
   },
   {
    "t": "OWASP API Security Project",
    "u": "https://owasp.org/www-project-api-security/"
   }
  ]
 },
 {
  "id": "tpl-classification-controls",
  "title": "Template: Data Classification to Control Mapping",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "classification",
   "controls",
   "template",
   "security",
   "data handling"
  ],
  "summary": "A matrix mapping each classification level to minimum controls across storage, access, transfer, hosting, logging, testing and disposal. Tailor to the national scheme in force.",
  "minutes": 6,
  "body": "<p>This matrix turns classification from a label into engineering requirements. Levels are illustrative; align names and minimum controls with the national classification scheme, the NIA policy (e.g. Data Labeling [DL], Cryptographic Security [CY], Media Security [MS]) and GTA security policy.</p>\n<table class=\"tbl\"><thead><tr><th>Control area</th><th>Public</th><th>Internal</th><th>Confidential</th><th>Restricted (highest)</th></tr></thead><tbody>\n<tr><td>Access model</td><td>Open read; controlled publish</td><td>Authenticated workforce</td><td>RBAC/ABAC need-to-know; owner-approved roles; quarterly recertification</td><td>Named individuals; owner approval per access; monthly recertification</td></tr>\n<tr><td>Authentication</td><td>None for read</td><td>SSO</td><td>SSO + MFA</td><td>Phishing-resistant MFA; privileged access workstation for admins</td></tr>\n<tr><td>Encryption at rest</td><td>Optional</td><td>Platform default</td><td>Required; managed keys; key rotation</td><td>Required; customer-controlled keys (HSM); field-level encryption for sensitive fields</td></tr>\n<tr><td>Encryption in transit</td><td>TLS</td><td>TLS</td><td>TLS 1.2+; mTLS for service-to-service across zones</td><td>mTLS; payload encryption/signing for external transfer</td></tr>\n<tr><td>Hosting</td><td>Any approved</td><td>Approved hosting</td><td>Approved cloud or on-premises zones whose location and controls meet the Cloud Security Policy and the national scheme for this level; decision recorded</td><td>Dedicated, restricted zones only; location explicitly approved by the data owner and security</td></tr>\n<tr><td>External sharing</td><td>Free</td><td>With approval</td><td>Data-sharing agreement; owner approval; minimised fields; exchange register</td><td>Legal basis and senior approval; secure channel; per-exchange audit</td></tr>\n<tr><td>Logging and monitoring</td><td>Standard</td><td>Standard</td><td>Access logging of reads and writes; SIEM integration</td><td>Full access logging; real-time alerting on anomalies; tamper-evident storage</td></tr>\n<tr><td>Non-production use</td><td>Allowed</td><td>Allowed</td><td>Masked or synthetic data only</td><td>Synthetic only</td></tr>\n<tr><td>Analytics use</td><td>Allowed</td><td>Allowed</td><td>Governed zone; pseudonymised where possible; disclosure control on outputs</td><td>Case-by-case approval; isolated environment</td></tr>\n<tr><td>End-user devices</td><td>Any</td><td>Managed devices</td><td>Managed devices; DLP; no local storage unless encrypted</td><td>Restricted devices; no download/print without approval</td></tr>\n<tr><td>Retention and disposal</td><td>Per schedule</td><td>Per schedule</td><td>Per schedule; secure deletion; disposal certificates for media</td><td>As Confidential plus verified destruction</td></tr>\n<tr><td>Backup</td><td>Standard</td><td>Standard</td><td>Encrypted; access-controlled; immutable copy</td><td>Encrypted with separate keys; restricted restore rights</td></tr>\n</tbody></table>\n<h4>How to use it</h4>\n<ol>\n<li>Identify the highest classification of data the solution stores, processes or transfers.</li>\n<li>Apply the column as minimum controls; list them in SAD section 7.</li>\n<li>Where a control cannot be met, raise a dispensation with compensating controls.</li>\n<li>Re-assess when new data or aggregation is added.</li>\n</ol>\n<div class=\"callout gta\"><b>At GTA</b> Most core tax data is at least Confidential. The &ldquo;non-production use&rdquo; row is the most frequently broken in practice: copying production taxpayer data into test environments should require explicit approval and masking.</div>",
  "related": [
   "data-classification",
   "chk-cloud-hosting",
   "zero-trust",
   "data-governance-stewardship"
  ],
  "refs": [
   {
    "t": "National Cyber Security Agency (Qatar)",
    "u": "https://www.ncsa.gov.qa"
   },
   {
    "t": "ISO/IEC 27001 Information security management",
    "u": "https://www.iso.org/standard/27001"
   }
  ]
 },
 {
  "id": "chk-cloud-hosting",
  "title": "Checklist: Cloud and Hosting Decision",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "checklist",
   "cloud",
   "hosting",
   "sovereignty",
   "decision"
  ],
  "summary": "A structured checklist for deciding where a workload should run: policy, data, technical fit, operations, cost and exit. Record the outcome as an ADR.",
  "minutes": 6,
  "body": "<h4>1. Policy and legal gates (must pass)</h4>\n<ul>\n<li>Highest data classification determined (per classification matrix).</li>\n<li>Cloud Security Policy applied (all agencies using or planning cloud), including its cloud service provider questionnaire; policy version recorded.</li>\n<li>Data location: storage, processing, backups, logs and support access in locations permitted by policy and law for this classification. Note that the GEA TRM itself does not mandate in-country hosting; the requirement, if any, must come from a cited policy or law.</li>\n<li>Applicable GEA TRM cloud controls identified (Required / Recommended), including the cloud responsibility matrix and independent provider audit.</li>\n<li>Contractual terms reviewed: jurisdiction, data access requests, audit rights, breach notification.</li>\n<li>Provider certifications relevant to the classification are verified.</li>\n</ul>\n<h4>2. Workload characteristics</h4>\n<table class=\"tbl\"><thead><tr><th>Factor</th><th>Favours cloud (PaaS/SaaS)</th><th>Favours on-premises / private</th></tr></thead><tbody>\n<tr><td>Demand pattern</td><td>Variable, seasonal peaks (filing deadlines)</td><td>Flat, predictable</td></tr>\n<tr><td>Integration</td><td>Mostly API-based, cloud-native partners</td><td>Tight, low-latency coupling with on-premises systems</td></tr>\n<tr><td>Technology</td><td>Modern, containerised, managed-service friendly</td><td>Legacy OS or hardware dependencies; licensing restrictions</td></tr>\n<tr><td>Data gravity</td><td>Data already in cloud analytics platform</td><td>Large datasets on-premises with heavy access</td></tr>\n<tr><td>Speed</td><td>Need rapid provisioning and experimentation</td><td>Stable, long-lived workload</td></tr>\n</tbody></table>\n<h4>3. Service model</h4>\n<ul>\n<li>Is there a suitable SaaS that meets requirements and policy? (Least to operate.)</li>\n<li>Otherwise, can PaaS/managed services be used for databases, messaging, containers?</li>\n<li>IaaS only where needed; justify why higher-level services are unsuitable.</li>\n</ul>\n<h4>4. Security and operations readiness</h4>\n<ul>\n<li>Landing zone available with identity integration, network segmentation and guardrail policies.</li>\n<li>Logging feeds security monitoring; observability tooling covers the environment.</li>\n<li>Key management approach meets classification (customer-managed keys where required).</li>\n<li>Backup and DR design meets the tier, including cross-region or cross-site options in permitted locations.</li>\n<li>Operations team skills and support model in place.</li>\n</ul>\n<h4>5. Cost</h4>\n<ul>\n<li>Total cost of ownership over 5 years: compute, storage, egress, licences, support, staff.</li>\n<li>Peak vs average sizing; reserved capacity options.</li>\n<li>FinOps: tagging, budgets, alerts, cost ownership.</li>\n</ul>\n<h4>6. Exit and portability</h4>\n<ul>\n<li>Data export in open formats tested.</li>\n<li>Infrastructure as code; proprietary services listed with alternatives.</li>\n<li>Exit plan with indicative effort and timeline.</li>\n</ul>\n<h4>Outcome</h4>\n<pre class=\"code\">Workload:        &lt;name&gt;\nClassification:  &lt;level&gt;\nDecision:        SaaS | PaaS | IaaS | Private cloud | On-premises\nLocation/zone:   &lt;region / data centre / zone&gt;\nPolicy refs:     &lt;policy and version&gt;\nKey risks:       &lt;...&gt;\nADR:             ADR-&lt;nnnn&gt;\nApproved by:     &lt;TRB decision ID&gt;</pre>",
  "related": [
   "gea-trm",
   "hybrid-sovereign-cloud",
   "gta-hosting-baseline",
   "tpl-classification-controls"
  ],
  "refs": [
   {
    "t": "NIST SP 800-145: The NIST Definition of Cloud Computing",
    "u": "https://csrc.nist.gov/pubs/sp/800/145/final"
   }
  ]
 },
 {
  "id": "tpl-tech-debt-register",
  "title": "Template: Technical Debt Register",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "technical debt",
   "register",
   "template",
   "risk",
   "prioritisation"
  ],
  "summary": "Fields, scoring and process for a technical debt register that makes architectural debt visible, costed and prioritised alongside features.",
  "minutes": 6,
  "body": "<p>Technical debt is the implied cost of future rework caused by choosing an expedient solution now. Some debt is deliberate and sensible; unrecorded debt is what hurts. A register makes it visible to product owners and the TRB.</p>\n<h4>Register fields</h4>\n<table class=\"tbl\"><thead><tr><th>Field</th><th>Description / allowed values</th></tr></thead><tbody>\n<tr><td>Debt ID</td><td>TD-&lt;system&gt;-&lt;nnn&gt;</td></tr>\n<tr><td>Title</td><td>Short description</td></tr>\n<tr><td>System / component</td><td>As named in the EA repository</td></tr>\n<tr><td>Type</td><td>Architecture, code, technology (obsolescence), data, security, test, documentation, infrastructure</td></tr>\n<tr><td>Origin</td><td>Deliberate (with ADR/waiver ref) or inadvertent (discovered)</td></tr>\n<tr><td>Description and impact</td><td>What is wrong and what it causes: incidents, slower change, risk, cost</td></tr>\n<tr><td>Interest</td><td>Ongoing cost of not fixing: effort per month, incident rate, risk exposure</td></tr>\n<tr><td>Principal</td><td>Estimated effort to remediate (T-shirt or person-days)</td></tr>\n<tr><td>Risk rating</td><td>Likelihood &times; impact (1&ndash;5 each)</td></tr>\n<tr><td>Due-by trigger</td><td>Date or event (vendor end-of-support, waiver expiry, next major release)</td></tr>\n<tr><td>Owner</td><td>Product owner accountable for prioritisation</td></tr>\n<tr><td>Remediation plan</td><td>Approach, backlog item references</td></tr>\n<tr><td>Status</td><td>Open, planned, in progress, resolved, accepted (with rationale)</td></tr>\n<tr><td>Links</td><td>Waiver ID, ADR, risk register ID, incidents</td></tr>\n</tbody></table>\n<h4>Prioritisation score (example)</h4>\n<pre class=\"code\">Priority = (Risk rating + Interest score) x Strategic weight / Principal score\nRisk rating:      Likelihood (1-5) x Impact (1-5)          -&gt; 1..25\nInterest score:   1 (negligible) .. 5 (major monthly cost)\nStrategic weight: 1.0 normal; 1.5 if capability is high\n                  importance on the heat map\nPrincipal score:  1 (days) .. 5 (many months)</pre>\n<h4>Process</h4>\n<ol>\n<li>Record debt when it is incurred (ADR or waiver) or discovered (review, incident, scan).</li>\n<li>Review monthly per product; quarterly at portfolio level.</li>\n<li>Reserve delivery capacity (commonly 15&ndash;25%) for debt and enablers.</li>\n<li>Escalate items whose due-by trigger falls within two quarters without a plan.</li>\n<li>Report totals by type and system on the portfolio dashboard.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Treating all old code as debt. Debt is only worth tracking if it has interest: it slows change, causes incidents or raises risk.</div>\n<div class=\"callout gta\"><b>At GTA</b> Technology lifecycle debt (unsupported versions) should be generated automatically from the standards catalogue and CMDB, so the register is complete without relying on teams to self-report.</div>",
  "related": [
   "architecture-contracts-waivers",
   "technology-reference-model",
   "tpl-time-rubric",
   "application-portfolio-management"
  ],
  "refs": [
   {
    "t": "Technical Debt (martinfowler.com)",
    "u": "https://martinfowler.com/bliki/TechnicalDebt.html"
   }
  ]
 },
 {
  "id": "tpl-time-rubric",
  "title": "Template: Application Lifecycle (TIME) Rubric",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "time model",
   "application portfolio",
   "rubric",
   "rationalisation",
   "template"
  ],
  "summary": "A scoring rubric for business fit and technical fit that places each application in Tolerate, Invest, Migrate or Eliminate, with default actions for each quadrant.",
  "minutes": 7,
  "body": "<p>The TIME model classifies applications on two axes. Score each criterion 1 (poor) to 5 (excellent); average per axis with the weights shown. A score of 3.0 or above is &ldquo;high&rdquo;.</p>\n<h4>Business fit (scored by business owner)</h4>\n<table class=\"tbl\"><thead><tr><th>Criterion</th><th>Weight</th><th>1 = </th><th>5 = </th></tr></thead><tbody>\n<tr><td>Functional fit</td><td>30%</td><td>Major workarounds, manual steps</td><td>Fully supports processes</td></tr>\n<tr><td>Strategic alignment</td><td>25%</td><td>Supports no strategic objective</td><td>Critical for a strategic capability</td></tr>\n<tr><td>Capability importance</td><td>20%</td><td>Low importance on heat map</td><td>High importance</td></tr>\n<tr><td>User satisfaction</td><td>15%</td><td>Frequent complaints</td><td>Well regarded</td></tr>\n<tr><td>Business change agility</td><td>10%</td><td>Changes take many months</td><td>Changes in weeks</td></tr>\n</tbody></table>\n<h4>Technical fit (scored by IT/architecture)</h4>\n<table class=\"tbl\"><thead><tr><th>Criterion</th><th>Weight</th><th>1 = </th><th>5 = </th></tr></thead><tbody>\n<tr><td>Technology lifecycle</td><td>25%</td><td>Out of vendor support</td><td>Current, on standards catalogue</td></tr>\n<tr><td>Security posture</td><td>20%</td><td>Known unremediated high risks</td><td>Meets all controls for its classification</td></tr>\n<tr><td>Architecture quality</td><td>20%</td><td>Monolithic, undocumented, point-to-point integrations</td><td>Modular, documented, standard APIs</td></tr>\n<tr><td>Reliability and operability</td><td>15%</td><td>Frequent incidents; no monitoring</td><td>Meets SLOs; observable</td></tr>\n<tr><td>Skills and supportability</td><td>10%</td><td>Single person or vendor dependency</td><td>Broad skills available</td></tr>\n<tr><td>Cost efficiency</td><td>10%</td><td>High run cost relative to value</td><td>Proportionate</td></tr>\n</tbody></table>\n<h4>Quadrants and default actions</h4>\n<div class=\"grid2\">\n<div class=\"mini\"><h5>Invest (high business, high technical)</h5><p>Strategic platforms. Fund enhancements; make them the consolidation target for overlapping applications; protect architecture quality.</p></div>\n<div class=\"mini\"><h5>Migrate (high business, low technical)</h5><p>Valuable but technically weak. Plan re-platforming, refactoring or replacement; contain new changes; apply strangler patterns.</p></div>\n<div class=\"mini\"><h5>Tolerate (low business, high technical)</h5><p>Technically sound but limited value. Minimise investment; keep running; review whether functionality can be consolidated.</p></div>\n<div class=\"mini\"><h5>Eliminate (low business, low technical)</h5><p>Retire. Move users and data to strategic platforms; archive records; decommission infrastructure and contracts.</p></div>\n</div>\n<h4>Worked example (illustrative)</h4>\n<table class=\"tbl\"><thead><tr><th>Application</th><th>Business fit</th><th>Technical fit</th><th>TIME</th><th>Action</th></tr></thead><tbody>\n<tr><td>Core tax administration system</td><td>4.2</td><td>3.6</td><td>Invest</td><td>Extend with refund automation; expose system APIs</td></tr>\n<tr><td>Objections tracking tool (in-house, legacy runtime)</td><td>3.4</td><td>1.8</td><td>Migrate</td><td>Move to unified case management in transition T2</td></tr>\n<tr><td>Internal document templating utility</td><td>2.1</td><td>3.8</td><td>Tolerate</td><td>No new features; review at contract renewal</td></tr>\n<tr><td>Audit spreadsheets with macros</td><td>2.4</td><td>1.2</td><td>Eliminate</td><td>Replace with case management; archive files</td></tr>\n</tbody></table>\n<div class=\"callout note\"><b>Note</b> Record the scorers, date and evidence. Rescore annually and at major events (contract renewal, end-of-support notice) so the portfolio view stays defensible.</div>",
  "related": [
   "application-portfolio-management",
   "legacy-modernization-7rs",
   "capability-mapping",
   "tpl-tech-debt-register"
  ],
  "refs": [
   {
    "t": "TOGAF Standard, 10th Edition (online)",
    "u": "https://pubs.opengroup.org/togaf-standard/"
   }
  ]
 },
 {
  "id": "chk-gea-compliance",
  "title": "Checklist: GEA Compliance for GTA Projects (Discovery, Alpha, Beta, Live)",
  "cat": "Templates & Checklists",
  "level": "Practitioner",
  "tags": [
   "checklist",
   "gea",
   "compliance",
   "design authority",
   "checkpoints"
  ],
  "summary": "What a GTA project team and its Design Authority must produce at each GEA checkpoint, mapped to the GEA obligation and self-assessment statement it satisfies, plus the agency-level items the EA Office owns.",
  "minutes": 9,
  "body": "<p>GEA requires each new solution to have a <strong>Design Authority (DA)</strong> that takes part in <strong>Technical Review Board (TRB)</strong> checkpoint reviews at <strong>Discovery, Alpha, Beta and Live</strong>, demonstrating alignment to GEA, shared services leveraged, cross-agency information assets leveraged and compliance with standards (GEA Governance Model). GEA names the stages but does not define them; the descriptions below follow the common use of these service-delivery phases. Mark each item <strong>Y</strong>, <strong>N/A</strong> (with reason) or <strong>Exception</strong> (with TRB reference).</p>\n<h4>Before Discovery: set-up</h4>\n<ul>\n<li>DA named: project manager, lead architect (may be the vendor&rsquo;s), nominated team members and the agency enterprise architect.</li>\n<li>If procurement is involved: the GEA tender statement (below) is in the RFP, and procurement approval obtained where the value threshold applies.</li>\n<li>Investment request states the strategic goal, BRM measurement area and measurable KPIs.</li>\n</ul>\n<h4>Checkpoint 1: Discovery (understand the problem)</h4>\n<table class=\"tbl\"><thead><tr><th>Produce</th><th>GEA basis</th></tr></thead><tbody>\n<tr><td>Service(s) affected, classified to BRM functional areas (e.g. 14.1 Taxes) with current e-service maturity level</td><td>BRM services taxonomy; BRM leveraged &ldquo;prior to, and during, the Discovery phase&rdquo;</td></tr>\n<tr><td>User research summary: consumer types (G2C/G2B/G2G/G2E), channels, pain points</td><td>Digital Services Standard 1; Customer centricity principle</td></tr>\n<tr><td>Goal and KPI link, including the four minimum service KPIs (user satisfaction, digital take-up, completion rate, cost per transaction)</td><td>BRM performance taxonomy; Digital Services Standard 11</td></tr>\n<tr><td>Reuse scan: WoG shared services (NAS, payment platform, SMS gateway, GDX, e-correspondence, contact centre) and existing GTA platforms considered</td><td>Resolution 18/2010; ARM and TRM reuse; BRM self-assessment statement 7 (weight 20)</td></tr>\n<tr><td>Information needed and its authoritative source (GDX catalogue, other agencies, GTA assets)</td><td>IRM; IRM project statement &ldquo;reviewed the GEA information assets catalogue&rdquo;</td></tr>\n</tbody></table>\n<h4>Checkpoint 2: Alpha (prototype options, choose an architecture)</h4>\n<table class=\"tbl\"><thead><tr><th>Produce</th><th>GEA basis</th></tr></thead><tbody>\n<tr><td>Options analysis showing the ARM reference architecture layer of each component</td><td>ARM project statement (weight 30 within ARM)</td></tr>\n<tr><td>Interface list with usage area (external / across / internal) and applicable mandatory standards</td><td>IRM, ARM, TRM standards</td></tr>\n<tr><td>Exchange design: GDX for inter-agency exchange; intra-agency exchange via the GTA integration capability; Exchange Package drafts</td><td>IRM information exchange reference architecture (weight 15)</td></tr>\n<tr><td>Data classification and NIA-based security requirements; threat model summary</td><td>Security Management; Trust and confidence principle</td></tr>\n<tr><td>Hosting option and infrastructure reuse check (WoG and GTA infrastructure assets catalogues); cloud controls applicable</td><td>TRM project statements 3&ndash;4 (weights 25 and 15)</td></tr>\n<tr><td>Prototype tested with users; accessibility approach (WCAG AA for external services)</td><td>Digital Services Standards 9&ndash;10; BRM usability standards</td></tr>\n</tbody></table>\n<h4>Checkpoint 3: Beta (build and run with real users)</h4>\n<table class=\"tbl\"><thead><tr><th>Produce</th><th>GEA basis</th></tr></thead><tbody>\n<tr><td>Solution Architecture Document with GEA alignment section and recorded exceptions</td><td>Governance Model DA obligations</td></tr>\n<tr><td>Evidence of mandatory standards compliance (e.g. Smart Qatar Data Standards, QeAF for authentication, cloud controls, BYOD where relevant)</td><td>Self-assessment project statements</td></tr>\n<tr><td>Change, release and test records under service management; test cases and results in the central repository</td><td>Service Management must-haves</td></tr>\n<tr><td>SLA drafted; continuity and DR approach for the service tier</td><td>Service Management SLM and ITSCM; TRM BCRS</td></tr>\n<tr><td>Performance measurement in place for the KPIs agreed at Discovery</td><td>Digital Services Standard 11</td></tr>\n</tbody></table>\n<h4>Checkpoint 4: Live (operate and hand over)</h4>\n<table class=\"tbl\"><thead><tr><th>Produce</th><th>GEA basis</th></tr></thead><tbody>\n<tr><td>Catalogue updates in Archi: service (with maturity), information assets, application, infrastructure assets, and the matrices linking them</td><td>Agency catalogues published to the ministry</td></tr>\n<tr><td>Service in the IT service catalogue with SLA, owner, OLAs and knowledge articles</td><td>Service Management</td></tr>\n<tr><td>Legacy components retired or scheduled, with exceptions closed or re-approved</td><td>Exception process</td></tr>\n<tr><td>Benefits tracking against KPIs (reuse, savings)</td><td>General EA practices statements 5&ndash;6</td></tr>\n</tbody></table>\n<h4>Exceptions</h4>\n<p>Raise every deviation from a GEA model, standard or policy from the DA to the TRB with justification, impact rating and remediation plan. Low impact: TRB decides; medium: TRB requests approval from the WoG ARB; high: ICT Governance Board (QDG Steering Committee).</p>\n<h4>Agency-level items (EA Office, not project teams)</h4>\n<ul>\n<li>Executive sponsor and enterprise architect nominated; TRB established; GEA adoption plan.</li>\n<li>Catalogues and matrices aligned to PRM/BRM/IRM/ARM/TRM published to the ministry periodically.</li>\n<li>Self-assessment completed periodically or on request; deviations reported.</li>\n<li>EA tooling based on ArchiMate 3.0 (Archi encouraged if no tool exists).</li>\n<li>ICT acquisition strategy containing EA compliance measures.</li>\n</ul>\n<h4>GEA tender statement (verbatim, Governance Model p. 31)</h4>\n<pre class=\"code\">\"Vendors shall ensure that the proposed solution for the tender\nrequirements comply with the reference architecture and standards\nprescribed as part of the Qatar Government Enterprise Architecture\n(GEA) reference models and standards as applicable. They may use the\nGEA self-assessment template to assess and report their compliance\nto the relevant authorities\".</pre>\n<div class=\"callout gta\"><b>At GTA</b> Until the TRB is formally chartered, run these checkpoints through GTA&rsquo;s interim architecture review and record outcomes in the decision log, so the evidence is ready for the first GEA self-assessment.</div>",
  "related": [
   "gea-governance",
   "chk-arb-submission",
   "tpl-solution-architecture-document",
   "gea-standards-compliance"
  ],
  "refs": [
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   },
   {
    "t": "Archi - open source ArchiMate modelling tool",
    "u": "https://www.archimatetool.com/"
   }
  ]
 },
 {
  "id": "qatar-gea",
  "title": "Qatar GEA: Overview, Legal Mandate and Structure",
  "cat": "Qatar GEA",
  "level": "Foundation",
  "tags": [
   "qatar",
   "gea",
   "mcit",
   "legal mandate",
   "reference models"
  ],
  "summary": "The Qatari Government Enterprise Architecture (GEA) is the national EA framework every government agency, including GTA, must apply: seven dimensions, four reference models, common standards and a governance model, mandated by Council of Ministers' Resolution No. (18) of 2010.",
  "minutes": 9,
  "diagram": "gea-framework",
  "body": "<p>The <strong>Qatari Government Enterprise Architecture (GEA)</strong> is the framework that &ldquo;would be used by all the government agencies in Qatar&rdquo; (GEA Overview). It was developed by the Ministry of Transport and Communications (MoTC) under the Qatar Digital Government programme, is based on the <strong>US Federal Enterprise Architecture Framework (US-FEAF)</strong>, and updates and replaces the government architecture and standards issued in <strong>2007</strong>, in line with the 2020 digital government strategy (QDG 2020). The ministry responsible for digital government today is the <strong>Ministry of Communications and Information Technology (MCIT)</strong>; where the documents say &ldquo;MoTC&rdquo;, read the current MCIT function.</p>\n<div class=\"callout note\"><b>Note</b> The GEA documents carry no printed version table or date (file metadata indicates 2018). In this hub they are cited as &ldquo;GEA documents (MoTC, c. 2018)&rdquo;. The Governance Model is marked as a draft in its text layer. Always confirm the edition in force with MCIT before quoting a requirement in a contract.</div>\n<h4>Legal mandate</h4>\n<table class=\"tbl\"><thead><tr><th>Instrument</th><th>What it establishes</th></tr></thead><tbody>\n<tr><td><strong>Council of Ministers&rsquo; Resolution No. (18) of 2010</strong> on the implementation of e-government policies</td><td>Requires government agencies to implement the <em>Government Reference Architecture and Standards</em> policy (Overview) and to <strong>reuse shared services and infrastructure developed by MoTC</strong>, &ldquo;including but not limited to government reference architecture and standards, authentication platform, payment platform, data centre, government network, contact centre, PKI&rdquo; (Governance Model).</td></tr>\n<tr><td><strong>Emiri Decree No. (4) of 2016, Article 18</strong></td><td>Sets the ministry&rsquo;s mandate to supervise, regulate and develop the ICT sector, raise the efficiency of information and technological infrastructure, and implement and supervise e-government programmes (Overview).</td></tr>\n<tr><td>Laws of the State of Qatar</td><td>Take precedence: if GEA conflicts with a law, the conflicting term is omitted and the rest stands (Overview).</td></tr>\n</tbody></table>\n<h4>What GEA is for</h4>\n<ul>\n<li><strong>Common language</strong> for agencies delivering cross-agency services.</li>\n<li><strong>Collaboration</strong>: identifying reusable and shareable services and applications.</li>\n<li><strong>Investment review</strong>: an objective basis for reviewing government IT investment.</li>\n<li><strong>Transformation</strong>: a repository of standards, principles and templates that speeds delivery of e-services.</li>\n</ul>\n<h4>Structure: two sections, seven dimensions</h4>\n<p>GEA is organised into a <strong>Whole of Government (WoG)</strong> section (taxonomies, shared services, WoG KPIs maintained centrally) and an <strong>Agency</strong> section (the catalogues and matrices each agency produces). It has seven dimensions, each documented separately:</p>\n<table class=\"tbl\"><thead><tr><th>Dimension (document)</th><th>Type</th><th>What it gives an agency</th></tr></thead><tbody>\n<tr><td>1 Business Reference Model (BRM)</td><td>Reference model</td><td>Business architecture framework, performance taxonomy, consumer and channel types, 16-domain services taxonomy</td></tr>\n<tr><td>2 Information Reference Model (IRM)</td><td>Reference model</td><td>Information taxonomy, data description and exchange formats, GDX exchange architecture</td></tr>\n<tr><td>3 Application Reference Model (ARM)</td><td>Reference model</td><td>Application reference architecture, application taxonomy, microservices guidance</td></tr>\n<tr><td>4 Infrastructure (Technical) Reference Model (TRM)</td><td>Reference model</td><td>Infrastructure reference architecture, 5-domain taxonomy, network and cloud standards and controls</td></tr>\n<tr><td>5 Security Management</td><td>Cross-cutting</td><td>Registry of national security policies (NIA, cloud, BYOD) and frameworks; security operations controls</td></tr>\n<tr><td>6 Service Management</td><td>Cross-cutting</td><td>ITIL v3 / COBIT 5 based IT service management framework</td></tr>\n<tr><td>7 Governance Model</td><td>Cross-cutting</td><td>Governance bodies, enabling policies, self-assessment, maturity model, tooling, tender clause</td></tr>\n</tbody></table>\n<p>Each of the four reference models has three elements: an <strong>Architecture</strong> (conceptual components and relationships), <strong>Standards</strong> (each rated mandatory, recommended or optional) and a <strong>Taxonomy</strong> (common categories for classifying assets). Entities &ldquo;shall ensure compliance&rdquo; with all three for the four horizontal dimensions and adopt the policies and processes of the three cross-cutting ones (Overview).</p>\n<h4>How agencies must apply GEA (Overview)</h4>\n<ol>\n<li><strong>Entity EA or IT strategy</strong> refers to and complies with GEA.</li>\n<li><strong>Annual IT planning</strong> ensures each new initiative aligns with GEA and reuses government-wide information, application and infrastructure components.</li>\n<li><strong>Taxonomies</strong> are maintained as provided in GEA (an open-standards tool, Archi, is recommended).</li>\n<li><strong>Self-assessment</strong> of GEA compliance annually or on MCIT request, reporting deviations.</li>\n<li><strong>Every ICT tender</strong> includes the GEA compliance statement.</li>\n<li><strong>Every project</strong>: the project manager or solution architect (or the vendor&rsquo;s) ensures the design is at all times GEA-compliant.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Treating GEA as a one-off mapping exercise. The catalogues and matrices must be kept current and published to the ministry periodically; stale tags make national reporting and reuse analysis unreliable.</div>\n<div class=\"callout gta\"><b>At GTA</b> GTA is an &ldquo;agency&rdquo; in GEA terms. Its services classify under BRM domain <strong>14 Revenue Management &rarr; 14.1 Taxes</strong>, its tax information under IRM <strong>1.02.02.03 Tax</strong>, and it already consumes WoG shared services such as GDX, the National Authentication System and the Government Network. The 2025 baseline found no EA Office yet (one is planned) and EA management at the lowest maturity level; this programme supports establishing the GEA roles described in the Governance articles.</div>",
  "related": [
   "gea-principles",
   "gea-governance",
   "chk-gea-compliance",
   "gta-baseline-overview"
  ],
  "refs": [
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   },
   {
    "t": "Hukoomi - Qatar Government Portal",
    "u": "https://hukoomi.gov.qa"
   }
  ]
 },
 {
  "id": "gea-principles",
  "title": "The Seven GEA Principles and What They Mean for GTA Engineers",
  "cat": "Qatar GEA",
  "level": "Foundation",
  "tags": [
   "gea",
   "principles",
   "design review",
   "reuse",
   "interoperability"
  ],
  "summary": "GEA defines seven guiding principles for all government architecture. Each translates into concrete design rules and review questions for GTA solutions.",
  "minutes": 8,
  "diagram": "ea-domains",
  "body": "<p>The GEA Overview states seven guiding principles used to create the reference models and to steer agency architecture. Because GTA must comply with GEA, these are the <strong>top of GTA&rsquo;s principle hierarchy</strong>: GTA-specific architecture principles should refine them, never contradict them.</p>\n<h4>The principles, as stated</h4>\n<table class=\"tbl\"><thead><tr><th>#</th><th>Principle (GEA wording)</th><th>What it means for a GTA engineer</th><th>Review question</th></tr></thead><tbody>\n<tr><td>1</td><td><strong>Customer centricity</strong>: customer insights must inform service selection, design and delivery; customers should be shielded from the internal complexities of government.</td><td>Design from taxpayer journeys and evidence (usage data, complaints), not from internal org charts. Never expose Dhareeba/Tabadol boundaries or internal codes to taxpayers.</td><td>Which user research or data shaped this design? Does the taxpayer need to know which system or department handles a step?</td></tr>\n<tr><td>2</td><td><strong>Promote reuse</strong>: remove fragmentation and duplication; consolidate and reuse shared capabilities.</td><td>Check WoG shared services (payment platform, NAS, SMS gateway, GDX, Mawared, e-correspondence) and existing GTA platforms before building or buying.</td><td>Which shared service was considered and why was it rejected? Does this add another standalone SharePoint app?</td></tr>\n<tr><td>3</td><td><strong>Share information by default</strong>: information must be shared by default rather than by exception.</td><td>Design data as reusable, catalogued information assets with a steward; expose them through governed APIs or GDX, subject to classification and legal basis.</td><td>Is the information asset in the catalogue with an owner, taxonomy code and exchange package?</td></tr>\n<tr><td>4</td><td><strong>Enable co-creation through a collaborative environment</strong>: digital services co-created on a shared technology platform with multiple agencies, third parties and vendors.</td><td>Publish documented, versioned interfaces so other agencies and vendors can build on GTA services; prefer the shared next-gen platform services where available.</td><td>Could another agency or a tax software vendor integrate without bespoke work?</td></tr>\n<tr><td>5</td><td><strong>Trust and confidence</strong>: build public trust in government&rsquo;s ability to maintain privacy and security of information.</td><td>Classification, NIA controls, least privilege and auditable decisions are design inputs, not go-live checks.</td><td>Is there a classification, a threat model and an audit trail for every flow of taxpayer data?</td></tr>\n<tr><td>6</td><td><strong>Interoperable</strong>: design services for interoperability using applicable standards so systems work together through a common data exchange platform.</td><td>Use GEA standards and route cross-agency exchange through GDX; avoid new point-to-point links.</td><td>Which GEA standards apply in each usage area, and does the exchange use GDX?</td></tr>\n<tr><td>7</td><td><strong>Design for future</strong>: prepare government services for disruptive technologies and emerging trends.</td><td>Keep core systems replaceable behind stable contracts; isolate vendor-specific features; plan for analytics, e-invoicing and new OECD reporting schemas.</td><td>What would it cost to replace this component in five years?</td></tr>\n</tbody></table>\n<h4>Other principle sets inside GEA</h4>\n<ul>\n<li><strong>BRM design principles</strong> (from the UK Digital Transformation Agency design thinking guidance): start with user needs; do less; design with data; do the hard work to make it simple; this is for everyone; understand context; build digital services, not websites; be consistent, not uniform.</li>\n<li><strong>TRM infrastructure principles</strong>: flexible and reconfigurable, agile (software-defined) provisioning, automated scaling, manageable; robust connectivity and sufficient resilience at the lowest cost; high utilisation; simplified management through tools.</li>\n<li><strong>ARM microservices principles</strong>: loose coupling and high cohesion, domain-driven design (bounded contexts), prefer choreography for multi-service interactions, fail fast.</li>\n<li><strong>Service Management guiding principles</strong>: integrated processes, scalable, improved quality at reduced cost, customer-centric (customer rather than IT need).</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> The GEA principles are deliberately broad. A useful GTA principle (TOGAF format: name, statement, rationale, implications) should close off options, for example &ldquo;No new point-to-point integration to Dhareeba&rdquo; refines <em>Promote reuse</em> and <em>Interoperable</em>.</div>\n<div class=\"callout gta\"><b>At GTA</b> The 2025 baseline shows where the principles bite: about 25 separate SharePoint applications (Promote reuse), point-to-point internal integrations and a missing Dhareeba&ndash;Tabadol link (Interoperable), and pre-2020 data split between TAS and Dhareeba (Share information by default). Use these as worked examples when explaining the principles to project teams.</div>",
  "related": [
   "architecture-principles",
   "tpl-architecture-principle",
   "qatar-gea",
   "gea-brm"
  ],
  "refs": [
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gea-metamodel-archi",
  "title": "GEA Metamodel and Agency Artefacts in Archi",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "metamodel",
   "archimate",
   "archi",
   "catalogues"
  ],
  "summary": "How the GEA metamodel links goals, KPIs, services, information, applications and infrastructure, and exactly which ArchiMate elements and relationships an agency uses to build its GEA catalogues and matrices in Archi.",
  "minutes": 10,
  "diagram": "gea-metamodel",
  "body": "<p>The GEA metamodel describes the <strong>entity types</strong> each reference model covers, grouped into <strong>layers</strong> (business, information, application, infrastructure), and the <strong>relationships</strong> between them (for example, &ldquo;application enables service&rdquo;). It also shows how agency-level entities relate to the WoG taxonomies (Overview).</p>\n<h4>The chain the metamodel encodes</h4>\n<ul>\n<li><strong>BRM</strong>: goals and measurement areas (performance taxonomy) and business services (services taxonomy); KPIs track progress towards goals; delivery channels aggregate services and are accessed by customers.</li>\n<li><strong>IRM</strong>: information entities (assets), classified by the information taxonomy, support business services.</li>\n<li><strong>ARM</strong>: application components, classified by the application taxonomy, enable services and act as data stores for information assets.</li>\n<li><strong>TRM</strong>: infrastructure assets host applications and store information entities.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> Taxonomy depth differs by model: the BRM services taxonomy has two levels (16 domains &rarr; 82 functional areas); the IRM taxonomy has domains, subjects and coded nodes up to four levels deep (e.g. 1.02.02.03); the ARM has domain &rarr; area &rarr; category; the TRM has domain &rarr; area only. Simplified diagrams may show a uniform three-level hierarchy.</div>\n<h4>Agency artefacts and how to model them</h4>\n<p>GEA ships its taxonomies and WoG catalogues as an ArchiMate 3.0 model (<code>Qatar GEA.archimate</code>). Agencies duplicate the taxonomy views into a <em>Catalogue</em> folder and link their own elements to the taxonomy nodes.</p>\n<table class=\"tbl\"><thead><tr><th>Agency artefact</th><th>ArchiMate element</th><th>Link to taxonomy</th><th>Key relationships</th></tr></thead><tbody>\n<tr><td>Strategic goals catalogue</td><td>Goal (Motivation)</td><td>associated to &ldquo;2 Agency strategic goals&rdquo;</td><td>Goal realized by KPI</td></tr>\n<tr><td>KPI catalogue</td><td>Outcome (Motivation)</td><td>associated to a measurement area (e.g. &ldquo;5 Operations efficiency&rdquo;)</td><td>Business service realizes goal and KPI</td></tr>\n<tr><td>Services catalogue</td><td>Business Service; properties <code>Agency</code>, <code>Maturity</code> (1&ndash;4)</td><td>associated to a BRM functional area</td><td>Service uses / is composed of other services</td></tr>\n<tr><td>Customer profiles</td><td>Business Actor</td><td>associated to G2C / G2B / G2G / G2E</td><td>Channel serves consumer; service serves consumer</td></tr>\n<tr><td>Delivery channel catalogue</td><td>Business Interface</td><td>associated to a channel type</td><td>Channel assigned to service</td></tr>\n<tr><td>Information assets catalogue</td><td>Business Object; properties Data Schema Id/name/value, Digital Data Source type, Language, Stewardship</td><td>associated to an IRM node</td><td>Service accesses asset</td></tr>\n<tr><td>Application catalogue</td><td>Application Service; property <code>Agency</code></td><td>associated to an ARM category</td><td>Service realized by application; asset associated to application</td></tr>\n<tr><td>Infrastructure assets catalogue</td><td>Technology Service; property <code>Agency</code></td><td>associated to a TRM area</td><td>Application served by infrastructure asset</td></tr>\n</tbody></table>\n<h4>Matrices GEA expects (published to the ministry)</h4>\n<ol>\n<li>Goals &ndash; KPIs &ndash; business services.</li>\n<li>Customer &ndash; channel &ndash; service (and channel &ndash; service).</li>\n<li>Business service &ndash; information asset.</li>\n<li>Business service &ndash; information asset &ndash; application.</li>\n<li>Application &ndash; infrastructure.</li>\n</ol>\n<h4>Worked example (GTA, identifiers illustrative)</h4>\n<pre class=\"code\">Goal      GTA.G1  Enhance taxpayer services        -assoc-&gt; 2 Agency strategic goals\nKPI       GTA.K3  Share of excise returns filed online -assoc-&gt; 6 Products and Services\nService   GTA.S12 File excise tax return  [Maturity 3] -assoc-&gt; 14.1 Taxes\n          GTA.S12 realizes GTA.G1, GTA.K3\nConsumer  Excise-registered business              -assoc-&gt; G2B\nChannel   Dhareeba portal                         -assoc-&gt; Web\nAsset     GTA.I7  Excise tax return               -assoc-&gt; 1.02.02.03 Tax\n          GTA.S12 accesses GTA.I7\nApp       GTA.A1  Dhareeba (SAP TRM)              -assoc-&gt; 1.3 Specialist LoB Apps\n          GTA.S12 realized by GTA.A1 ; GTA.I7 assoc GTA.A1\nInfra     GTA.T2  Azure West Europe production    -assoc-&gt; 1.4 IaaS\n          GTA.A1 served by GTA.T2</pre>\n<h4>Practical tips from the GEA appendices</h4>\n<ul>\n<li>Use <strong>Delete from View</strong>, never <em>Delete from Model</em>, when tidying catalogue views: deleting from the model removes the WoG taxonomy element.</li>\n<li>Use <strong>Duplicate</strong> to create new elements so custom properties are kept.</li>\n<li>Prefix identifiers consistently (agency code, artefact type, number) so matrices stay readable.</li>\n<li>Artefacts built in Archi can be imported into any ArchiMate 3.0 compliant tool via the Open Group exchange format; Archi itself has limited support for collaborative modelling across teams.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> The baseline report found essential business, technical and data architecture blueprints absent. Building these GEA catalogues in Archi is the fastest route to a usable repository: the taxonomy is given, and the artefacts double as GEA self-assessment evidence.</div>",
  "related": [
   "archimate-core-elements",
   "repository-governance",
   "gea-governance",
   "qatar-gea"
  ],
  "refs": [
   {
    "t": "Archi - open source ArchiMate modelling tool",
    "u": "https://www.archimatetool.com/"
   },
   {
    "t": "ArchiMate 3 specification (The Open Group)",
    "u": "https://pubs.opengroup.org/architecture/archimate3-doc/"
   }
  ]
 },
 {
  "id": "gea-standards-compliance",
  "title": "GEA Standards: Compliance Levels, Usage Areas and the Mandatory Set",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "standards",
   "compliance",
   "mandatory",
   "lifecycle"
  ],
  "summary": "Every GEA standard is rated mandatory, recommended or optional for three usage areas and tagged emerging, mature or declining. This article explains the scheme and lists the standards a GTA design must respect.",
  "minutes": 9,
  "body": "<p>BRM, IRM, ARM and TRM share one compliance scheme. Reading it correctly avoids two mistakes: ignoring a mandatory standard, and treating a recommended one as optional without justification.</p>\n<h4>The scheme</h4>\n<div class=\"grid2\">\n<div class=\"mini\"><h5>Usage areas</h5><p><strong>External to Government</strong>: services consumed outside government (taxpayers, banks, foreign authorities). <strong>Across Government</strong>: consumed by other agencies. <strong>Internal to agencies</strong>: used only inside GTA.</p></div>\n<div class=\"mini\"><h5>Levels of compliance</h5><p><strong>Mandatory</strong>: must always be followed; non-compliance is not acceptable. <strong>Recommended</strong>: should be followed; non-compliance must be reviewed and justified. <strong>Optional</strong>: generally preferred; non-compliance is acceptable.</p></div>\n</div>\n<p><strong>IT industry lifecycle status</strong>: <em>emerging</em> (defined by an industry body, little vendor adoption), <em>mature</em> (preferred and supported by large vendors), <em>declining</em> (being replaced).</p>\n<h4>Mandatory in all three usage areas</h4>\n<table class=\"tbl\"><thead><tr><th>Model</th><th>Standards</th></tr></thead><tbody>\n<tr><td>IRM</td><td>SOAP; Structured Query Language (ANSI SQL)</td></tr>\n<tr><td>ARM</td><td>LDAP (querying and modifying directory services)</td></tr>\n<tr><td>TRM</td><td>SNMP; TCP; IPv4; ICMP; ARP; DHCP; DNS; Virtual LAN (802.1Q); TLS (for VPN); WPA/WPA2</td></tr>\n</tbody></table>\n<h4>Mandatory for external and/or cross-government services (selected)</h4>\n<table class=\"tbl\"><thead><tr><th>Standard</th><th>External</th><th>Across</th><th>Internal</th><th>Lifecycle</th></tr></thead><tbody>\n<tr><td>WCAG Level A and Level AA (BRM)</td><td>M</td><td>R</td><td>R</td><td>mature</td></tr>\n<tr><td>UML (BRM)</td><td>M</td><td>M</td><td>O</td><td>emerging (as printed)</td></tr>\n<tr><td>BPMN (BRM)</td><td>R</td><td>R</td><td>O</td><td>emerging (as printed)</td></tr>\n<tr><td>UDDI, WS-ReliableMessaging, JSON, XML, XSLT, WSDL (IRM)</td><td>M</td><td>M</td><td>R</td><td>mature</td></tr>\n<tr><td>XML Schema (XSD) (IRM)</td><td>M</td><td>R</td><td>R</td><td>mature</td></tr>\n<tr><td>Dublin Core metadata (IRM)</td><td>M</td><td>M</td><td>R</td><td>emerging</td></tr>\n<tr><td>WS-SecurityPolicy (IRM)</td><td>M</td><td>M</td><td>R</td><td>emerging</td></tr>\n<tr><td>WS-Policy (IRM)</td><td>R</td><td>M</td><td>R</td><td>mature</td></tr>\n<tr><td>CSS (ARM)</td><td>M</td><td>R</td><td>R</td><td>mature</td></tr>\n<tr><td>HTML, XHTML (ARM)</td><td>M</td><td>R</td><td>O</td><td>mature</td></tr>\n<tr><td>JSR 286 portlets, WSRP (ARM)</td><td>M</td><td>M</td><td>O</td><td>mature</td></tr>\n<tr><td>Unicode for Arabic characters (ARM)</td><td>M</td><td>M</td><td>R</td><td>mature</td></tr>\n<tr><td>VoiceXML (ARM)</td><td>M</td><td>M</td><td>R</td><td>mature</td></tr>\n<tr><td>WS-BPEL (ARM)</td><td>M</td><td>M</td><td>R</td><td>emerging</td></tr>\n</tbody></table>\n<p>Recommended (not mandatory) examples: all OGC geospatial standards (R/R/O); XQuery, WS-Addressing, WSDM, WS-I Basic Security Profile (R/R/R); IPv6 (R, emerging); SFTP, MPLS, 802.1X (R); x86 (R).</p>\n<h4>Other rating schemes inside GEA</h4>\n<ul>\n<li><strong>TRM cloud controls</strong>: <em>Required</em> (must be implemented on a timeline set by the agency&rsquo;s IT governance) or <em>Recommended</em>.</li>\n<li><strong>Security operations controls</strong>: <em>Mandatory (should have)</em> or <em>Recommended (can have)</em>, the latter depending on asset value.</li>\n<li><strong>Service desk tool requirements</strong>: Mandatory, Recommended or Nice to have.</li>\n<li><strong>BRM Digital Services Standards</strong> (13 standards): agencies are &ldquo;required&rdquo; to follow them for next-generation services.</li>\n</ul>\n<h4>Applying the scheme at GTA</h4>\n<ol>\n<li>Classify each interface or user-facing component by usage area: Dhareeba taxpayer services are <em>external</em>; the GDX exchange with MoI is <em>across government</em>; an HR workflow is <em>internal</em>.</li>\n<li>List the applicable mandatory standards in the Solution Architecture Document and the RFP.</li>\n<li>Where a design departs from a mandatory or recommended standard, record the justification and raise an exception through the Technical Review Board.</li>\n<li>Record GEA ratings alongside GTA&rsquo;s own lifecycle status in the technology standards catalogue.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Assuming GEA covers modern API practice. The IRM lists SOAP-era web-service standards and JSON, but no REST/OpenAPI, OAuth 2.0 or OpenID Connect standard. GTA can adopt these where GEA is silent (the GDX gateway provides a REST/SOAP bridge), but the compliance position for the SOAP and WS-* entries should be stated explicitly, not ignored.</div>\n<div class=\"callout gta\"><b>At GTA</b> Dhareeba&rsquo;s public pages fall under the external usage area, so WCAG 2 Level AA is mandatory (Qatar&rsquo;s e-Accessibility Policy sets AA as the minimum), together with Unicode for Arabic and the Government Website and e-Services Framework guidelines.</div>",
  "related": [
   "technology-reference-model",
   "api-design-standards",
   "gea-irm",
   "chk-gea-compliance"
  ],
  "refs": [
   {
    "t": "W3C Web Content Accessibility Guidelines (WCAG)",
    "u": "https://www.w3.org/WAI/standards-guidelines/wcag/"
   },
   {
    "t": "Dublin Core Metadata Element Set",
    "u": "https://www.dublincore.org/specifications/dublin-core/dces/"
   }
  ]
 },
 {
  "id": "gea-brm",
  "title": "GEA Business Reference Model (BRM)",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "brm",
   "performance taxonomy",
   "service taxonomy",
   "digital services"
  ],
  "summary": "The BRM gives a strategy-driven business architecture framework, a performance taxonomy with eight measurement areas, consumer and channel types, a 16-domain services taxonomy (tax sits in 14.1), e-service maturity levels and 13 digital service standards.",
  "minutes": 12,
  "diagram": "gea-brm-framework",
  "body": "<p>The BRM is GEA document 1. It covers external G2C/G2B services, internal G2E processes and G2G services, and prescribes how new business services are &ldquo;modelled, defined, developed, monitored and continuously improved throughout service lifecycle&rdquo;.</p>\n<h4>Business Architecture Framework (four tiers)</h4>\n<table class=\"tbl\"><thead><tr><th>Tier</th><th>Contents</th></tr></thead><tbody>\n<tr><td><strong>Strategy</strong></td><td>Qatar National Vision 2030; Qatar Government strategies (incl. QDG 2020); sector / agency strategies; customer wants and needs; emerging technology trends</td></tr>\n<tr><td><strong>Service Design</strong></td><td>Design thinking (Empathize, Define, Ideate, Prototype, Test); process modelling and simulation (to-be processes documented at least to <strong>Level 3, activity level</strong>; organisation- and technology-agnostic); capability modelling and gap analysis; information requirements (via the IRM)</td></tr>\n<tr><td><strong>Service Transformation</strong></td><td>Transformation roadmap; implementation projects governed by the agency <strong>Technical Review Board</strong>; GEA reference architectures and standards</td></tr>\n<tr><td><strong>Service Operations</strong></td><td>Customer feedback (4 steps); business process monitoring (4 steps); continuous improvement (microservices and DevOps)</td></tr>\n</tbody></table>\n<h4>Performance taxonomy</h4>\n<p>Two layers: <strong>Goals</strong> (1 WoG strategic goals; 2 Agency strategic goals) and <strong>Measurement areas</strong>, each with recommended KPI groups. One or more measurement areas may track an investment.</p>\n<table class=\"tbl\"><thead><tr><th>Measurement area</th><th>KPI groups</th></tr></thead><tbody>\n<tr><td>1 Compliance, Governance &amp; Legal</td><td>Regulatory compliance; Risk; Governance; Legal</td></tr>\n<tr><td>2 Customer relationship</td><td>Customer satisfaction; Customer e-participation; Customer usage</td></tr>\n<tr><td>3 Financial processes</td><td>Cost of services/products; Cost savings/avoidance</td></tr>\n<tr><td>4 ICT</td><td>Information quality; Technology QoS; Response time</td></tr>\n<tr><td>5 Operations efficiency</td><td>Return on investment; <strong>Revenue collection</strong> (e.g. revenue collected relative to cost of collection); Resource utilisation; Asset utilisation; Productivity</td></tr>\n<tr><td>6 Products and Services</td><td>Service coverage; Service responsiveness; Service QoS</td></tr>\n<tr><td>7 Security and Privacy</td><td>Information security (incl. NIA compliance); Facility security; Personnel security; Privacy</td></tr>\n<tr><td>8 Project management</td><td>Schedule; Finance (budget adherence); Quality</td></tr>\n</tbody></table>\n<p>The BRM figure numbers Project management 7 and Security and privacy 8; the table reverses them. Use names, not numbers, in GTA artefacts.</p>\n<h4>Consumers and channels</h4>\n<ul>\n<li><strong>Consumer types</strong>: G2C (citizen, resident or visitor), G2B (business), G2G (another government entity, in Qatar or foreign), G2E (government employee).</li>\n<li><strong>Ten channel types</strong>: Contact Center (telephone), Web, Mobile App, Email, SMS, Kiosk, Chatbots, Mail, Face to face, 3rd party mediated. Agencies are <strong>required</strong> to adopt and reuse WoG channels (e.g. Qatar Government Contact Center, Hukoomi, kiosks).</li>\n</ul>\n<h4>Services taxonomy: 16 domains, 82 functional areas</h4>\n<p>Domains: 1 Business; 2 Employment &amp; Workforce; 3 Education &amp; Training; 4 Health; 5 Visa &amp; Official Documents; 6 Transportation; 7 Disabilities &amp; Elderly; 8 Charity &amp; Religious Services; 9 Tourism, Sports &amp; Recreation; 10 Culture, Arts &amp; Media; 11 Community; 12 Housing; 13 Environment, Animals &amp; Agriculture; <strong>14 Revenue Management</strong>; 15 Legislation &amp; Courts; 16 Government Support. Only the ten 16.x areas are WoG focus areas (candidates for shared services); the rest are agency focus areas.</p>\n<table class=\"tbl\"><thead><tr><th>Code</th><th>Functional area</th><th>BRM description (abridged)</th></tr></thead><tbody>\n<tr><td>14</td><td>Revenue Management</td><td>All financial services and transactions with the government, including collections and disbursements (also labelled &ldquo;Financial Transactions&rdquo; in one figure)</td></tr>\n<tr><td><strong>14.1</strong></td><td><strong>Taxes</strong></td><td>Controlling taxes paid by businesses and individuals: income tax, sales tax, property taxes, municipal tax, levies and customs duties</td></tr>\n<tr><td>14.2</td><td>Fees</td><td>Service fees received by government</td></tr>\n<tr><td>14.3</td><td>Fines</td><td>Traffic violations and minor offences</td></tr>\n<tr><td>14.4</td><td>Sales of Goods &amp; Services</td><td>Revenue from goods and services sold by government</td></tr>\n<tr><td>1.2</td><td>Business Support</td><td>Registrations, permits, licensing, credit support, <strong>tax services</strong>, transfer of ownership and land</td></tr>\n<tr><td>16.7</td><td>Finance (WoG)</td><td>Payables, receivables, budgeting, &hellip; taxation and treasury; mapped to the WoG e-Payment Platform</td></tr>\n</tbody></table>\n<h4>e-Service maturity (property on every catalogued service)</h4>\n<ol>\n<li><strong>Informative</strong>: static information, printable forms.</li>\n<li><strong>Interactive</strong>: online forms and status checks, but a physical visit is still needed.</li>\n<li><strong>Transactional</strong>: completed end to end online.</li>\n<li><strong>Integrated</strong>: linked across agencies, proactive (e.g. &ldquo;click to renew&rdquo;).</li>\n</ol>\n<h4>Digital Services Standards (Appendix 4, required)</h4>\n<p>1 Understand user needs; 2 Multidisciplinary team; 3 Agile and user-centred process; 4 Understand tools and systems; 5 Make it secure; 6 Consistent and responsive design; 7 Open standards and common platforms; 8 Make source code open; 9 Make it accessible; 10 Test the service end to end; 11 Measure performance; 12 Don&rsquo;t forget the non-digital experience; 13 Encourage everyone to use the digital service. Standard 11 sets four minimum KPIs per service: <strong>User satisfaction, Digital take-up, Completion rate, Cost per transaction</strong>.</p>\n<h4>Using the BRM for investments</h4>\n<p>Goal = <em>why</em>, measurement area = <em>how it is measured</em>, services taxonomy = <em>what</em>. The Governance Model requires every new IT investment to demonstrate this alignment with measurable KPIs.</p>\n<div class=\"callout gta\"><b>At GTA</b> Classify GTA taxpayer services (registration, returns, payments, refunds, objections, excise, withholding and corporate income tax) under <strong>14.1 Taxes</strong>; business-facing registration journeys may also be cross-referenced to 1.2 Business Support. Map channels from the baseline: Dhareeba portal &rarr; Web, mobile apps &rarr; Mobile App, Gov. Call Center &rarr; Contact Center, SMS gateway &rarr; SMS, tax agents &rarr; 3rd party mediated. Social media is not a GEA channel type; record it but note the gap. Excise is not named in 14.1&rsquo;s list; classifying it there as a levy is an interpretation to confirm with MCIT.</div>",
  "related": [
   "gta-strategy-to-solution",
   "business-services-process",
   "gea-metamodel-archi",
   "capability-mapping"
  ],
  "refs": [
   {
    "t": "W3C Web Content Accessibility Guidelines (WCAG)",
    "u": "https://www.w3.org/WAI/standards-guidelines/wcag/"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gea-irm",
  "title": "GEA Information Reference Model (IRM) and the GDX Exchange Architecture",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "irm",
   "gdx",
   "information taxonomy",
   "data exchange"
  ],
  "summary": "The IRM defines how government information is described, classified and exchanged: three standardization areas, a 3-domain / 8-subject taxonomy (tax is 1.02.02.03), the GDX inter-agency exchange architecture, a minimum intra-agency set, description templates and data policies.",
  "minutes": 12,
  "diagram": "gea-gdx",
  "body": "<p>The IRM (GEA document 2) defines information as &ldquo;an authoritative collection of Digital Data Resources that is managed by an agency, categorized for discovery, and governed by a <strong>data steward</strong>&rdquo;. Its goals include identifying authoritative sources and owners, standardising how assets and exchanges are described, and removing duplicate data gathering &ldquo;so that citizens need not submit the same information twice&rdquo;.</p>\n<h4>Three standardization areas</h4>\n<dl class=\"defs\">\n<dt>Data Context (taxonomy)</dt><dd>Categorises information so it can be discovered and compared.</dd>\n<dt>Data Description (data assets)</dt><dd>Logical data models for structured data; Dublin Core-aligned metadata for semi-structured and unstructured data.</dd>\n<dt>Data Sharing (query and exchange)</dt><dd><em>Access</em> = ad-hoc requests; <em>exchange</em> = fixed, recurring exchanges described as Exchange Packages. Enabled by the other two areas.</dd>\n</dl>\n<h4>Information taxonomy: 3 domains, 8 subjects</h4>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Subjects</th><th>Nodes relevant to GTA</th></tr></thead><tbody>\n<tr><td>1 Governance</td><td>1.01 Plans; 1.02 Controls</td><td>1.02.02 Financial &rarr; 1.02.02.01 Income, 1.02.02.02 Fee, <strong>1.02.02.03 Tax</strong>, 1.02.02.05 Zakat, 1.02.02.06 Penalty; 1.02.03 Law; 1.02.05 Measures (KPIs); 1.02.06 Arrangement &rarr; .02 Request, .04 Agreement (incl. agreements with other countries)</td></tr>\n<tr><td>2 Entities</td><td>2.01 Parties; 2.02 Locations; 2.03 Items</td><td>2.01.01.01 Individual; 2.01.01.02 Organizations; 2.01.01.03 Country; 2.01.02 Parties Relation (e.g. representatives); 2.03.02 Goods (e.g. excise goods); 2.03.03 Regulatory (licences, permits, certificates)</td></tr>\n<tr><td>3 Activities</td><td>3.01 Events; 3.02 Cases; 3.03 Services</td><td>3.01.03 Business (starting a business, conducting audits); 3.02 Cases (long-running interactions such as disputes)</td></tr>\n</tbody></table>\n<h4>GDX information exchange architecture (inter-agency)</h4>\n<p>Under Resolution 18/2010, providing and consuming agencies &ldquo;should leverage the GDX platform for their data exchange purposes&rdquo;. The architecture combines API-centric consumption governance with an SOA-centric technology framework:</p>\n<table class=\"tbl\"><thead><tr><th>Band</th><th>Components</th><th>Status in GEA</th></tr></thead><tbody>\n<tr><td>Service consumption governance</td><td>Developer portal, subscription management, API catalogue, service analytics</td><td>Future WoG</td></tr>\n<tr><td>Service gateway</td><td>Schema validation, XML firewall, security AAA, service-level management, REST/SOAP bridge</td><td>Existing WoG</td></tr>\n<tr><td>Service mediation</td><td>Content transformation, protocol switching, routing, publish/subscribe, quality of service, service composition, asynchronous communication</td><td>Existing WoG</td></tr>\n<tr><td>Service registry</td><td>Repository, registry, policy management, service virtualisation</td><td>Existing WoG</td></tr>\n<tr><td>Management and monitoring</td><td>System monitoring, service monitoring, auditing/logging, data dictionary</td><td>Existing WoG</td></tr>\n<tr><td>Agency systems</td><td>Authoritative systems of record; legacy systems</td><td>Agency-owned</td></tr>\n</tbody></table>\n<h4>Intra-agency minimum set</h4>\n<p>For exchanges inside an agency, GEA specifies a <strong>minimum</strong> of 17 components: developer portal, subscription management, API catalogue; schema validation, XML firewall, security AAA, REST/SOAP bridge; content transformation, protocol switching, routing, publish/subscribe; repository, registry; system monitoring, auditing/logging; plus systems of record and legacy systems.</p>\n<h4>Description templates</h4>\n<ul>\n<li><strong>Structured data</strong>: data domain (identifier, name, description), data schema, entity, data type, attribute, relationship (origin, destination), <strong>stewardship (owner)</strong>, language, digital data source type.</li>\n<li><strong>Unstructured data</strong>: file name, identifier, date, creator, format, description, source, publisher, privileges, <strong>confidentiality</strong>, size, extension.</li>\n<li><strong>Exchange Package</strong>: identifier, name, description, <strong>classification</strong>, frequency; supplier and consumer (code, name, steward contact); payload definition (business need); query point (supported query languages).</li>\n</ul>\n<h4>Policies agencies must comply with</h4>\n<ul>\n<li><strong>Data Management Policy</strong>: data governance, data administration, data protection and data sharing, subject to privacy, copyright, legal and security considerations.</li>\n<li><strong>Open Data Policy</strong>: publish government data online unless restricted by law, policy, regulation or contract.</li>\n<li><strong>Smart Qatar Data Standards</strong>: controls across nine domains (Governance plus Data Classification, Data Structure, Data Architecture, Data Integration, Metadata Management, Master Data Management, Data Security, Data Quality) over the lifecycle Creation &rarr; Storage &rarr; Movement &rarr; Usage &rarr; Retirement.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> The IRM&rsquo;s GDX catalogue (c. 2018) lists ten assets, e.g. Commercial Registration and Commercial Permit (2.03.03 Regulatory, stewarded by the then Ministry of Economy and Commerce) and Address (2.02 Locations, MoI). MCIT maintains the current list.</div>\n<div class=\"callout gta\"><b>At GTA</b> Dhareeba already exchanges with MoI through GDX, while other external integrations are point-to-point APIs. Each recurring GTA exchange (banks, MoCI, GAC, QFC, OECD/IRS via Tabadol) should have an Exchange Package description and an entry in GTA&rsquo;s Information Assets Catalogue, classified under the IRM taxonomy with a named steward.</div>",
  "related": [
   "data-sharing-apis",
   "gta-integration-baseline",
   "gea-standards-compliance",
   "data-governance-stewardship"
  ],
  "refs": [
   {
    "t": "Dublin Core Metadata Element Set",
    "u": "https://www.dublincore.org/specifications/dublin-core/dces/"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gea-arm",
  "title": "GEA Application Reference Model (ARM)",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "arm",
   "shared services",
   "application taxonomy",
   "microservices"
  ],
  "summary": "The ARM defines a layered application reference architecture (engagement, services, technology building blocks, systems of record), the WoG shared platforms agencies should reuse, a 2-domain / 10-area application taxonomy and microservices design guidance.",
  "minutes": 11,
  "diagram": "gea-arm",
  "body": "<p>The ARM (GEA document 3) defines an application as software components &ldquo;resting on Infrastructure that, when aggregated and managed, may be used to create, use, share, and store data and information to enable support of a business service&rdquo;. It serves two purposes: guidance for building next-generation services, and a taxonomy for application portfolio management.</p>\n<h4>Application reference architecture</h4>\n<table class=\"tbl\"><thead><tr><th>Layer</th><th>Components</th><th>Who provides</th></tr></thead><tbody>\n<tr><td>Systems of engagement</td><td>Mobile One, gov.qa portal, agency websites, mobile and kiosk apps, analytical dashboards</td><td>WoG aggregates; agencies build their own</td></tr>\n<tr><td>Services</td><td>Process services (end-to-end journeys, choreography, orchestration); business APIs; analytics APIs</td><td>Mainly agencies</td></tr>\n<tr><td>Service enablement platform services</td><td>Microservices platform, mobile foundation, PaaS runtimes, orchestration/BPM, event hub, rules engine, headless web content management, DevOps, analytical tools, blockchain runtimes, AI services, <strong>CRM platform</strong> (existing)</td><td>WoG PaaS, dedicated or multi-tenant</td></tr>\n<tr><td>Integration and data</td><td><strong>Application integration via GDX</strong> (ESB and registry existing; API management); data integration (ETL/batch, data quality); data stores (national data lake, data warehouse, master data repository)</td><td>WoG</td></tr>\n<tr><td>Shared applications and services</td><td>Existing: <strong>Payment gateway, SMS gateway, geo-spatial engine, document management, National Authentication, Certificate Authority (MoI), HR, Finance, e-correspondence</strong>. Others: case management, open data platform, social sentiment analysis, directory services, strategy and portfolio management, procurement</td><td>WoG; business applications consumed as SaaS</td></tr>\n<tr><td>Systems of records</td><td>Legacy systems, COTS solutions, legacy data stores within agency boundaries</td><td>Agency</td></tr>\n</tbody></table>\n<h4>Application taxonomy: 2 domains, 10 areas</h4>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Areas (WoG-focus categories in brackets)</th></tr></thead><tbody>\n<tr><td>1 Business Applications</td><td>1.1 Corporate Applications [1.1.1 ERP, 1.1.3 BI &amp; Analytics, 1.1.5 Unified communications &amp; collaboration, 1.1.6 Enterprise Content Management]; 1.2 Common Business Applications [1.2.1 Service Mgmt, 1.2.2 Marketing, 1.2.3 CRM, 1.2.4 Partner Relationship Mgmt, 1.2.6 Grants Mgmt]; 1.3 Specialist Line of Business Applications (no categories)</td></tr>\n<tr><td>2 Infrastructure Applications &amp; Platforms</td><td>2.1 Data Management; 2.2 Security Services; 2.3 Integration Services [2.3.2 Data Exchange and Interchange]; 2.4 Network Services [2.4.2 Electronic mail]; 2.5 ICT Services and Tools [Cloud Services]; 2.6 End User Computing [2.6.1 End User Device Mgmt]; 2.7 Platforms [all five: mobile foundation, blockchain, IoT, big data, microservices]</td></tr>\n</tbody></table>\n<p>The ARM table and figure swap the numbers of 2.5.4 and 2.5.5 (ICT Management Tools / Cloud Services); 2.3.4 Gateway appears only in the table. Name the category as well as the code.</p>\n<h4>Development guidance</h4>\n<ul>\n<li>Agencies are recommended to follow an <strong>SOA approach</strong> and to evaluate each application for a microservices approach against business considerations (DevOps investment, skills, strategic importance and longevity, demand spikes, size and complexity).</li>\n<li>Principles: <strong>loose coupling</strong>, <strong>high cohesion</strong>, domain-driven design (bounded contexts); agencies should &ldquo;strongly prefer&rdquo; a choreographed (event-based) system for multi-service interactions. The ARM also states that &ldquo;using an asynchronous protocol should be the exception rather than the rule&rdquo;; read the two together as: events for cross-service business facts, synchronous calls kept few and coarse-grained.</li>\n<li>Patterns: single-page application, backend for frontend, business and adapter microservices, strangler (transform, coexist, eliminate), API gateway, service discovery and description, circuit breaker, bulkhead.</li>\n<li>Refactoring: separate databases before separating services; keep transactions inside one service or use compensation and eventual consistency.</li>\n<li>APIs: strong, versioned contracts; avoid chatty interfaces. Security: JWT with OAuth/OIDC, two-way TLS, rotated API keys, identity propagation.</li>\n</ul>\n<h4>Standards highlights</h4>\n<p>LDAP is mandatory in all usage areas; HTML, XHTML and CSS are mandatory for external services; WS-BPEL is mandatory for external and cross-government processes; Unicode is mandatory for Arabic text externally and across government. Web portals must follow the Government Website and e-Services Framework.</p>\n<div class=\"callout gta\"><b>At GTA</b> Dhareeba (SAP TRM) is a 1.3 Specialist Line of Business application; tax support case management maps to 1.2.3 CRM (the ARM&rsquo;s own example maps a case management system there); IBM API Connect is a 2.5.2 ICT Component (&ldquo;service / API management&rdquo;). Before procuring GRC, PMO or case management tools that the baseline found missing, check the ARM WoG shared applications first. The full proposed mapping is in the GTA application landscape article.</div>",
  "related": [
   "application-portfolio-management",
   "microservices-ddd",
   "gta-application-landscape",
   "integration-patterns"
  ],
  "refs": [
   {
    "t": "Circuit Breaker (martinfowler.com)",
    "u": "https://martinfowler.com/bliki/CircuitBreaker.html"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gea-trm",
  "title": "GEA Infrastructure Reference Model (TRM) and Cloud Controls",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "trm",
   "infrastructure",
   "cloud controls",
   "framework agreement"
  ],
  "summary": "The TRM defines the shared infrastructure reference architecture, a 5-domain / 33-area infrastructure taxonomy, network standards, and Required/Recommended cloud infrastructure controls. It does not itself mandate in-country hosting.",
  "minutes": 11,
  "diagram": "gea-trm",
  "body": "<p>The TRM (GEA document 4) is &ldquo;a taxonomy based reference model for categorizing IT infrastructure and the facilities and network that host the IT infrastructure&rdquo;. Infrastructure covers insourced, outsourced and cloud capabilities, facilities, platforms, networks and end-user devices.</p>\n<h4>Principles</h4>\n<p>Infrastructure must be flexible and reconfigurable, support agile software-defined provisioning and automated scaling, and be easily manageable; it must deliver robust connectivity and sufficient availability and resilience to meet business need at the lowest possible cost, with high utilisation and simplified, tool-supported management.</p>\n<h4>Infrastructure reference architecture</h4>\n<table class=\"tbl\"><thead><tr><th>Band</th><th>Existing WoG services</th><th>Potential / future WoG services</th></tr></thead><tbody>\n<tr><td>Consumers: applications, PaaS services</td><td colspan=\"2\">Agency infrastructure teams use IaaS; developers use PaaS</td></tr>\n<tr><td>Cloud &ndash; PaaS foundation</td><td>&ndash;</td><td>Cloud controller, service broker, containers, container orchestrator</td></tr>\n<tr><td>Cloud &ndash; IaaS</td><td>Software-defined compute and storage</td><td>Software-defined networking, backup as a service, disaster recovery as a service</td></tr>\n<tr><td>Facilities</td><td>Government Data Center; Government Contact Center</td><td>&ndash;</td></tr>\n<tr><td>Connectivity</td><td>Government Network</td><td>IoT edge networks and edge routers</td></tr>\n<tr><td>Cross-cutting</td><td colspan=\"2\"><strong>Government ICT Framework Agreement</strong>: common licences (such as Microsoft and Oracle) at lower cost and faster procurement</td></tr>\n</tbody></table>\n<h4>Infrastructure taxonomy: 5 domains, 33 areas</h4>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Areas (WoG focus in bold)</th></tr></thead><tbody>\n<tr><td>1 Hybrid IT Infrastructure</td><td>1.1 Virtualized infrastructure; 1.2 SD-Compute; 1.3 SD-Storage; <strong>1.4 IaaS; 1.5 PaaS; 1.6 SaaS</strong>; 1.7 Containers; 1.8 Edge computing; 1.9 Traditional compute; 1.10 Traditional storage; 1.11 Operating system; 1.12 Specialized hardware; 1.13 Security hardware</td></tr>\n<tr><td>2 Connectivity</td><td>2.1 Network virtualization; 2.2 Network functions virtualization; 2.3 Software defined networking; 2.4 Traditional networking; 2.5 Edge networking; 2.6 Communications hardware</td></tr>\n<tr><td>3 Facilities</td><td><strong>3.1 Data center</strong>; 3.2 Stranded capacity; 3.3 Operations center (NOC/SOC); <strong>3.4 Call center</strong>; 3.5 Office; 3.6 Field facility</td></tr>\n<tr><td>4 Emerging Technologies</td><td><strong>4.1 Internet of Things; 4.2 Blockchain specialized hardware</strong>; 4.3 Drones; 4.4 Augmented reality</td></tr>\n<tr><td>5 End-User Equipment</td><td>5.1 Bring your own device; 5.2 Desktop equipment; 5.3 User peripheral; 5.4 Mobility equipment</td></tr>\n</tbody></table>\n<h4>Cloud infrastructure controls (Appendix 2)</h4>\n<p>Controls are <strong>Required</strong> (all must eventually be implemented, on a timeline set by the agency&rsquo;s IT governance organisation) or <strong>Recommended</strong>. Control areas and notable items:</p>\n<table class=\"tbl\"><thead><tr><th>Area</th><th>Notable controls</th></tr></thead><tbody>\n<tr><td>Governance and actors</td><td>Policies so all cloud actors know their responsibilities, with a responsibility matrix (Gov.1.1, Required); register services in the service catalogue; monitor SLAs; retire obsolete services; identify consumer, provider, auditor, broker and carrier; name a third-party cloud auditor (CA.2.2, Required)</td></tr>\n<tr><td>Orchestration</td><td>OpenStack-compatible portal and orchestration (Recommended)</td></tr>\n<tr><td>Interoperability / portability</td><td>OCCI, OVF and CDMI compliance (Required for IaaS platforms); open APIs; containers and orchestration (Recommended) &mdash; to avoid lock-in</td></tr>\n<tr><td>Cloud management (OSS/BSS)</td><td>Common cloud management platform, metering, billing, policy enforcement for hybrid cloud (Recommended)</td></tr>\n<tr><td>Service models</td><td>IaaS, PaaS, SaaS capabilities and contracts (Required); periodic cloud DC health checks (Recommended)</td></tr>\n<tr><td>Business continuity and resiliency</td><td>Secured, monitored, tested DC utilities with automated failover; asset inventory at all sites and locations; DR and workload-aware load balancing across cloud DCs; IT governance and service management based on ITIL v3 and COBIT 5 (all Required)</td></tr>\n<tr><td>Security (based on CSA Cloud Controls Matrix)</td><td>Multi-tenancy segmentation; outsourcing controls; independent audits at least annually; BC and resilience management; government cloud DC security (incl. authorisation before relocating hardware, software or data offsite); infrastructure and virtualisation hardening, prod/non-prod separation, 2FA for hypervisor access; secure standard protocols for data import/export</td></tr>\n</tbody></table>\n<p>BYOD controls (Appendix 3) are Recommended: MDM self-enrolment with acceptance of the government BYOD agreement, over-the-air configuration, usage tracking, persona-based policies.</p>\n<h4>Data location: what the TRM does and does not say</h4>\n<p>The TRM contains <strong>no explicit in-country hosting or data-residency requirement</strong>. Its closest controls require authorisation before data is relocated offsite, an inventory of assets at all locations, network diagrams that identify &ldquo;data flows that may have legal compliance impacts&rdquo;, and tenant segmentation that meets legal and regulatory obligations. Location decisions therefore rest on the Cloud Security Policy, NIA controls, data classification and applicable law, and must be documented per workload.</p>\n<div class=\"callout gta\"><b>At GTA</b> In TRM terms, GTA&rsquo;s Azure West Europe (primary) and North Europe (DR) subscriptions are 1.4 IaaS / 1.5 PaaS assets, the Meeza data centre is a 3.1 Data center (a commercial facility, not the WoG Government Data Center), and WAN connectivity uses the WoG Government Network. Building the Infrastructure Assets Catalogue and the application&ndash;infrastructure matrix is a direct GEA obligation and the basis for the Qatar Central decision.</div>",
  "related": [
   "cloud-models",
   "hybrid-sovereign-cloud",
   "gta-hosting-baseline",
   "technology-reference-model"
  ],
  "refs": [
   {
    "t": "NIST SP 800-145: The NIST Definition of Cloud Computing",
    "u": "https://csrc.nist.gov/pubs/sp/800/145/final"
   },
   {
    "t": "Cloud Security Alliance - Cloud Controls Matrix",
    "u": "https://cloudsecurityalliance.org/research/cloud-controls-matrix"
   }
  ]
 },
 {
  "id": "gea-security-management",
  "title": "GEA Security Management: NIA Policy, Cloud, BYOD and National Frameworks",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "nia",
   "security policy",
   "byod",
   "cloud security"
  ],
  "summary": "GEA Security Management is a registry of mandated national security policies and frameworks: the NIA policy and its 26 domains, the Cloud Security Policy, the BYOD policy, QeAF, ISRMF and others, plus security operations controls.",
  "minutes": 10,
  "diagram": "gea-nia",
  "body": "<p>GEA document 5 &ldquo;serves as a central registry with references to existing set of security related policies and standards prescribed for government agencies in Qatar&rdquo;. Security and privacy architecture must be applied consistently across agencies, while governance may differ by agency. It treats information security as &ldquo;not only a technical issue, but also a business and governance challenge that involves risk management, reporting, and accountability&rdquo;.</p>\n<h4>Framework layers</h4>\n<p>National Information Assurance (NIA) Policy &rarr; agency security policy &rarr; detailed policy statements (e.g. cloud, BYOD) &rarr; implementation standards &rarr; security implementation (systems, people, processes) &rarr; measurable results, with continuous risk assessment, measurement and treatment feeding back into every layer.</p>\n<h4>Mandated policies</h4>\n<table class=\"tbl\"><thead><tr><th>Policy</th><th>Scope and key points</th></tr></thead><tbody>\n<tr><td><strong>NIA Policy</strong> (Q-CERT, MoTC; v2.0 referenced)</td><td>Foundation for a full Information Security Management System; applies to all agencies and their information assets; <strong>outsourced or subcontracted activities must also comply</strong></td></tr>\n<tr><td><strong>Cloud Security Policy</strong></td><td>Applies to all agencies that use or plan to use cloud; captures cloud security policies and controls and includes a questionnaire to evaluate cloud service provider offerings. The Security document cites the 2017 v1.2 edition; the Governance Model cites a 2014 edition</td></tr>\n<tr><td><strong>BYOD Policy</strong> (v1.0)</td><td>Any device that stores, processes or transmits information on the controlled network. Government and semi-government entities: <strong>MANDATORY</strong>; critical sector: RECOMMENDED; other organisations: OPTIONAL</td></tr>\n</tbody></table>\n<h4>The 26 NIA domains (with codes)</h4>\n<p>Access Control Security [AM]; Audit &amp; Certification [AC]; Business Continuity Management [BC]; Change Management [CM]; Communications Security [CS]; Cryptographic Security [CY]; Data Labeling [DL]; Data Retention &amp; Archival [DR]; Documentation [DC]; Gateway Security [GS]; Governance Structure [IG]; Incident Management [IM]; Information Exchange [IE]; Logging, Auditing &amp; Security Monitoring [SM]; Media Security [MS]; Network Security [NS]; Personnel Security [PS]; Physical Security [PH]; Portable Device &amp; Working Off-Site Security [OS]; Product Security [PR]; Risk Management [RM]; Security Awareness [SA]; Software Security [SS]; System Usage Security [SU]; Third Party Security Management [TM]; Virtualization [VL]. Note the traps: Access Control is <strong>AM</strong>, Governance Structure is <strong>IG</strong>.</p>\n<h4>Frameworks and standards</h4>\n<ul>\n<li><strong>Qatar e-Authentication Framework (QeAF)</strong>: risk-based assurance in assertions of identity, role, delegation and value over web, telephone (IVR) and fax channels; each entity should use it to assess its existing e-authentication means.</li>\n<li><strong>Information Security Risk Management Framework and procedures (ISRMF/ISRMP)</strong>: systematic identification, prioritisation and management of security risks for NIA compliance; aligns with enterprise risk management.</li>\n<li><strong>National ICS Security Standard</strong>: baseline controls for critical industrial control systems.</li>\n<li><strong>Information security framework for school networks</strong>.</li>\n<li><strong>Smart Qatar Information Security Standard (SQISS)</strong>: minimum security for Smart Qatar services, including third-party components.</li>\n</ul>\n<h4>Security operations controls (Appendix 1)</h4>\n<ul>\n<li><strong>OM 1</strong>: documented procedures, reviewed at least annually, roles defined, staff and supplier personnel trained, no segregation-of-duties conflicts.</li>\n<li><strong>OM 2</strong>: all changes through change management with a Request for Change; a change board including the CISO is recommended.</li>\n<li><strong>OM 3</strong>: separated development, test and production; no movement between them without an approved RFC; developers do not typically access production; data moves between environments only with the information owner&rsquo;s approval.</li>\n<li><strong>OM 4</strong>: continuous monitoring; protected monitoring data; prioritised, costed recommendations to the information security governance committee.</li>\n<li><strong>DCS 1</strong>: data centre controls; for outsourced hosting, contractual controls and the agency&rsquo;s <strong>right of audit</strong> (mandatory).</li>\n<li>Roles: MoTC&rsquo;s published NIA RASCI table (R, A, <strong>S = Supportive</strong>, C, I) mapped to the agency structure.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> GEA references Q-CERT/MoTC editions. National information assurance policy and standards are now maintained by the National Cyber Security Agency (NCSA); confirm the edition in force before citing it in a design or contract.</div>\n<div class=\"callout gta\"><b>At GTA</b> GTA is ISO/IEC 27001 certified with a dedicated cybersecurity team. The baseline report uses a five-layer security reference architecture: shared security services, users, devices, applications and data, and network. Mapping each layer to NIA domains (e.g. users to AM, PS, SA; applications and data to SS, CY, DL, IE; network to NS, GS, CS) links GTA&rsquo;s security architecture to the GEA self-assessment, which weights security at 15 of 100 points.</div>",
  "related": [
   "security-by-design",
   "data-classification",
   "iam-federation",
   "threat-modelling-stride"
  ],
  "refs": [
   {
    "t": "National Cyber Security Agency (Qatar)",
    "u": "https://www.ncsa.gov.qa"
   },
   {
    "t": "ISO/IEC 27001 Information security management",
    "u": "https://www.iso.org/standard/27001"
   }
  ]
 },
 {
  "id": "gea-service-management",
  "title": "GEA Service Management: ITIL v3, COBIT 5 and Agency Must-Haves",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "itil",
   "cobit",
   "service desk",
   "itsm"
  ],
  "summary": "GEA's service management framework is based on ITIL v3 aligned with COBIT 5. It groups 26 processes plus the service desk, sets a staged rollout order, makes QGCC the level-1 desk for the public, and lists what every agency must have.",
  "minutes": 10,
  "diagram": "gea-itsm",
  "body": "<p>GEA document 6 sets out &ldquo;guidelines and standard functions that support the effective and efficient delivery of IT services within Government agencies&rdquo;. It selects <strong>ITIL v3, aligned with COBIT 5</strong>, after comparing frameworks, and tells agencies to <strong>avoid proprietary service management frameworks or toolsets</strong>. ITIL is used to manage IT services across their lifecycle; COBIT to govern enterprise IT.</p>\n<h4>Guiding principles</h4>\n<p>Integrated, maintainable, consistent processes; scalable to any size of organisation; improved quality at reduced cost; customer-centric (based on customer rather than IT need).</p>\n<h4>Process groups</h4>\n<table class=\"tbl\"><thead><tr><th>Group</th><th>Processes</th></tr></thead><tbody>\n<tr><td>Lifecycle governance: Continual Service Improvement</td><td>Service measurement; service reporting; service improvement</td></tr>\n<tr><td>Lifecycle governance: Service Strategy</td><td>Demand management; strategy generation; service portfolio management</td></tr>\n<tr><td>Operational: Service Design</td><td>Service catalogue; service level; capacity; availability; service continuity; information security; supplier management</td></tr>\n<tr><td>Operational: Service Transition</td><td>Transition planning and support; change; service asset and configuration; release and deployment; validation and testing; evaluation; knowledge management</td></tr>\n<tr><td>Operational: Service Operation</td><td>Event; incident; request fulfilment; problem; access; operation management. Function: <strong>service desk</strong></td></tr>\n</tbody></table>\n<h4>Agency must-haves (&ldquo;must&rdquo; / &ldquo;shall&rdquo; in the source)</h4>\n<ul>\n<li>An agency <strong>CMDB / configuration management system</strong> as the single source of record.</li>\n<li>A <strong>service portfolio management framework</strong> holding all business services and their KPIs, reviewed <strong>quarterly</strong>.</li>\n<li><strong>SLAs</strong> determined, negotiated, documented and agreed for new or changed services, and reviewed throughout the lifecycle (Appendix 5 template).</li>\n<li>All project change requests under change management, approved at the right level.</li>\n<li>Test cases and results recorded in a centralised database; a QA/QC team testing every iteration (recommended).</li>\n<li>Services and SLAs documented in a <strong>Service Knowledge Management System</strong>.</li>\n<li>Compliance with the information assurance policies in the Security Management document; access management by least privilege per the NIA policy.</li>\n<li>Use of ITIL to review, define and improve ITSM processes (MoTC and agencies).</li>\n</ul>\n<h4>Staged rollout order (recommended)</h4>\n<ol>\n<li>Service support before service delivery; avoid a big bang.</li>\n<li>First: <strong>incident management</strong> with a structured service desk, then <strong>configuration</strong> and <strong>change</strong> management.</li>\n<li>Next wave: <strong>problem</strong> and <strong>release</strong> management.</li>\n<li>Then <strong>service level management</strong> with financial management in parallel.</li>\n<li>Last: <strong>capacity, continuity and availability</strong> management.</li>\n</ol>\n<h4>Service desk</h4>\n<p>MoTC&rsquo;s <strong>Qatar Government Contact Center (QGCC)</strong> is the shared <strong>level-1</strong> desk and single point of contact for the public; levels 2 and 3 are agency teams or vendors. Every service desk needs at minimum <strong>ACD, CTI, a CMDB and a knowledge database</strong>. Mandatory tool requirements include incident, problem (with known-error database), change, knowledge base and CMDB/CI tracking; line-manager and technical approval of changes; SLA-clock notifications; a user web portal; custom SLA levels per service or customer.</p>\n<h4>SLA chain</h4>\n<p>Customer &larr; SLA &rarr; IT organisation &larr; <strong>OLA</strong> &rarr; internal suppliers &larr; underpinning contract &rarr; external suppliers. Without OLAs and underpinning contracts, SLA targets cannot be guaranteed.</p>\n<div class=\"callout gta\"><b>At GTA</b> The baseline shows a sound start: Summit ITSM hosts the IT service catalogue; incident, request and problem management are well documented; change, configuration and release processes are documented. Next steps align with GEA: define OLAs behind existing SLAs, separate business-facing and technical catalogues using BRM service catalogues, add owners and escalation paths, and then document capacity, availability, event and access management, which GEA itself places later in the rollout.</div>",
  "related": [
   "gta-it-governance-baseline",
   "resilience-dr-tiers",
   "platform-engineering-observability",
   "gea-governance"
  ],
  "refs": [
   {
    "t": "COBIT (ISACA)",
    "u": "https://www.isaca.org/resources/cobit"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gea-governance",
  "title": "GEA Governance: Bodies, Checkpoints, Exceptions, Self-Assessment and Maturity",
  "cat": "Qatar GEA",
  "level": "Practitioner",
  "tags": [
   "gea",
   "governance",
   "technical review board",
   "design authority",
   "self-assessment"
  ],
  "summary": "GEA governance runs upstream (doing the right things) and downstream (doing things right) through four bodies with tiered exception rights, Discovery/Alpha/Beta/Live checkpoints, a weighted self-assessment, a 0-5 maturity model, ArchiMate tooling and a mandatory tender clause.",
  "minutes": 12,
  "body": "<p>The GEA Governance Model (document 7) covers both <strong>upstream</strong> EA governance &mdash; &ldquo;Doing the right things&rdquo;: is the government funding the most important programmes? &mdash; and <strong>downstream</strong> solution governance &mdash; &ldquo;Doing things right&rdquo;: do programmes deliver solutions that meet business needs and fit the environment? Design Authorities and service checkpoints are the enforcement mechanism.</p>\n<h4>Governance bodies and exception rights</h4>\n<table class=\"tbl\"><thead><tr><th>Body</th><th>Level</th><th>Members</th><th>Focus</th><th>Exceptions</th></tr></thead><tbody>\n<tr><td>ICT Governance Board (QDG Steering Committee)</td><td>WoG</td><td>Ministry and key government entities</td><td>Strategic ICT direction and priorities</td><td><strong>High</strong> impact</td></tr>\n<tr><td>Architecture Review Board (ARB)</td><td>WoG</td><td>WoG architecture sponsor, WoG enterprise architect, invited members</td><td>GEA current and relevant; maintains and publishes GEA via the Office of the Chief Architect; escalation point for appeals and disputes</td><td><strong>Medium</strong> impact</td></tr>\n<tr><td>Technical Review Board (TRB)</td><td>Agency</td><td>Agency architecture sponsor, agency enterprise architect, invited members (project, integration, security)</td><td>Compliance of agency EA and solution architectures with GEA; reports compliance to the ARB</td><td><strong>Low</strong> impact</td></tr>\n<tr><td>Design Authority (DA)</td><td>Project</td><td>Project management, lead architect, nominated team members (incl. the agency enterprise architect)</td><td>Solutions that comply with the architecture</td><td>Raises exceptions to the TRB</td></tr>\n</tbody></table>\n<p>GEA does not define what makes an exception high, medium or low impact; GTA must set its own criteria. The word &ldquo;waiver&rdquo; is not used.</p>\n<h4>Roles</h4>\n<ul>\n<li><strong>Agency architecture sponsor</strong>: typically the CIO or a senior executive.</li>\n<li><strong>Agency enterprise architect</strong>: produces and manages agency models; assesses and reports compliance; creates the GEA adoption plan.</li>\n<li><strong>Agency project management</strong>: ensures project-level compliance and upstream communication.</li>\n<li><strong>Project lead architect</strong> (may be the vendor&rsquo;s): designs a solution &ldquo;at all times compliant&rdquo; and reports unavoidable exceptions.</li>\n</ul>\n<h4>Downstream process</h4>\n<ol>\n<li>Each new solution gets a <strong>Design Authority</strong>.</li>\n<li>The DA attends <strong>TRB checkpoint reviews at Discovery, Alpha, Beta and Live</strong>, demonstrating alignment to GEA, shared services leveraged, cross-agency information assets leveraged, and compliance with standards.</li>\n<li>Exceptions go DA &rarr; TRB (low); TRB requests ARB approval with justification (medium); high impact to the ICT Governance Board.</li>\n<li>The IT Procurement Review Committee may ask the ARB&rsquo;s opinion; projects above 500K (currency not stated) need its approval.</li>\n</ol>\n<h4>Enabling policies for agencies</h4>\n<ul>\n<li>Nominate an executive sponsor and an enterprise architect; create a GEA adoption plan; establish a TRB.</li>\n<li>Assess and report GEA compliance periodically or on request; <strong>publish catalogues and matrices aligned to PRM, BRM, IRM, ARM and TRM</strong> to the ministry periodically.</li>\n<li>Plan EA tooling based on <strong>ArchiMate 3.0</strong>; agencies without such a tool are encouraged to use <strong>Archi</strong>.</li>\n<li>Demonstrate GEA alignment, with measurable KPIs, for every new IT investment.</li>\n<li>Comply with Data Management, Open Data, Website and e-Services Framework, Resolution 18/2010 shared services, NIA, Cloud Security and BYOD policies.</li>\n</ul>\n<h4>Self-assessment (Appendix 1)</h4>\n<p>Columns: Fully Compliant, Partially Compliant, Not Compliant, N/A, comments (required for anything other than fully compliant), weight, score. Agency-level statements take 1 or 0; project-level statements take the <em>number of projects</em> in each category; N/A is allowed only for project-level statements.</p>\n<table class=\"tbl\"><thead><tr><th>Section</th><th>Weight</th><th>Section</th><th>Weight</th></tr></thead><tbody>\n<tr><td>BRM</td><td>20</td><td>Security</td><td>15</td></tr>\n<tr><td>IRM</td><td>15</td><td>Service Management</td><td>5</td></tr>\n<tr><td>ARM</td><td>15</td><td>General EA practices</td><td>20</td></tr>\n<tr><td>TRM</td><td>10</td><td>Total</td><td>100</td></tr>\n</tbody></table>\n<p>Score bands: above 85 Excellent (maturity 4); 60&ndash;85 Good (3); 45&ndash;60 Satisfactory (2); below 45 Needs improvement (0 or 1). The source gives no scoring formula and leaves the boundary values unassigned.</p>\n<h4>EA Maturity Model (Appendix 2)</h4>\n<p>Based on the US Department of Commerce ACMM: <strong>0 None, 1 Initial, 2 Under Development, 3 Defined, 4 Managed, 5 Optimized</strong>, assessed on seven characteristics: EA framework; development method; business requirements process; stakeholder participation; enterprise continuum, tools and repository; governance; benefits realisation. Level 3 requires, among others, an operational architecture board and started compliance reviews.</p>\n<h4>Tender statement (Appendix 4, to include in every ICT tender)</h4>\n<pre class=\"code\">\"Vendors shall ensure that the proposed solution for the tender\nrequirements comply with the reference architecture and standards\nprescribed as part of the Qatar Government Enterprise Architecture\n(GEA) reference models and standards as applicable. They may use the\nGEA self-assessment template to assess and report their compliance\nto the relevant authorities\".</pre>\n<div class=\"callout gta\"><b>At GTA</b> Throughout this hub, GTA&rsquo;s own architecture board is called the <strong>Technical Review Board (TRB)</strong>, as in GEA; &ldquo;ARB&rdquo; refers only to the WoG Architecture Review Board. The baseline shows an IT Steering Committee and a CAB in place but no EA Office yet: nominating the sponsor and enterprise architect, chartering the TRB and appointing Design Authorities are the first GEA obligations to meet.</div>",
  "related": [
   "arb-operating-model",
   "chk-gea-compliance",
   "ea-value-maturity",
   "gta-it-governance-baseline"
  ],
  "refs": [
   {
    "t": "Archi - open source ArchiMate modelling tool",
    "u": "https://www.archimatetool.com/"
   },
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gta-baseline-overview",
  "title": "The GTA Baseline: Reading the Current State Report (April 2025)",
  "cat": "GTA Baseline",
  "level": "Foundation",
  "tags": [
   "gta",
   "baseline",
   "current state",
   "oecd",
   "digital strategy"
  ],
  "summary": "How GTA's April 2025 Current State Understanding Report was produced, how it is structured, what it concluded, and how to use it as the baseline architecture for EA and GEA work.",
  "minutes": 9,
  "diagram": "transition-roadmap",
  "body": "<p>The <strong>Current State Understanding Report &ndash; Digital Strategy</strong> (April 2025), prepared with PwC, is deliverable D1 of GTA&rsquo;s Digital Strategy engagement. In TOGAF terms it is GTA&rsquo;s first documented <strong>baseline architecture</strong> across business, data, application and technology. This category summarises it for IT staff.</p>\n<h4>Engagement and deliverables</h4>\n<table class=\"tbl\"><thead><tr><th>Phase</th><th>Purpose</th><th>Deliverable</th></tr></thead><tbody>\n<tr><td>0 Mobilize</td><td>Plan the engagement</td><td>&ndash;</td></tr>\n<tr><td>1 Diagnosis</td><td>Current state and benchmarking</td><td>D1 Current State Understanding Report</td></tr>\n<tr><td>2 Design</td><td>Target state, implementation roadmap, quick wins</td><td>D2 Target State Design Report; D3 Implementation Roadmap Report</td></tr>\n<tr><td>3 Drafting RFPs</td><td>Scope and procure selected initiatives</td><td>D4 RFP Document Packages</td></tr>\n</tbody></table>\n<p>Inputs included national strategies, the OECD Tax Administration 3.0 framework, GTA documents, more than 15 meetings with more than 30 stakeholders and more than 20 documents.</p>\n<h4>Assessment framework</h4>\n<p><strong>Business challenges and expectations</strong> &rarr; <strong>Strategy and operating model</strong> (strategic direction, capabilities and processes, organisation/sourcing/delivery model, governance, service catalogue, ongoing and planned projects) &rarr; <strong>Technology landscape</strong> (applications, integration, data, infrastructure, security).</p>\n<h4>National and international references</h4>\n<ul>\n<li>National guidelines considered: Qatar Digital Agenda 2030; Third National Development Strategy; Qatar Digital Inclusion Index; Qatar&rsquo;s Cybersecurity Framework; Qatar Government Excellence Award; National Digital Authentication and Trust Services Strategy; also the Open Data Policy, QNV 2030, National Information Assurance Standard, Data Management Policy and e-Participation Policy.</li>\n<li>OECD Tax Administration 3.0 building blocks: <strong>1 Digital identity; 2 Taxpayer touchpoints; 3 Data management and standards; 4 Tax rule management and application; 5 New skill sets; 6 Governance frameworks</strong>. Each has an EA counterpart: identity architecture (NAS), channel architecture, IRM-aligned data management, rules and core tax platform, EA and data skills, and GEA-aligned governance.</li>\n</ul>\n<h4>Cross-cutting business themes</h4>\n<ol>\n<li><strong>Data quality and reporting</strong>: inconsistencies, limited executive dashboards and self-service BI, manual Excel reporting.</li>\n<li><strong>Automation</strong>: manual processes; missing applications such as GRC, enterprise service management, project management and case management.</li>\n<li><strong>Application functionality</strong>: Dhareeba and Tabadol need enhancements, including UI/UX.</li>\n<li><strong>Integrations</strong>: fragmented systems; Dhareeba and Tabadol not integrated; some external integrations missing or unstable.</li>\n</ol>\n<p>Forward-looking items named in the report include Dhareeba 2.0, a planned e-invoicing solution, and support in Tabadol for the OECD Pillar Two Global Information Return (GIR) schema by 2027.</p>\n<h4>Transformation journey</h4>\n<table class=\"tbl\"><thead><tr><th>Stage</th><th>Focus</th></tr></thead><tbody>\n<tr><td>1 Develop digital foundation</td><td>Target digital/IT strategy; business&ndash;IT alignment; target operating model; <strong>target digital architecture</strong></td></tr>\n<tr><td>2 Strengthen core digital capabilities</td><td>Process improvement and automation; integrated service delivery; governance frameworks and KPIs; data as an asset</td></tr>\n<tr><td>3 Innovate and lead</td><td>Ideation and digital innovation; emerging technology use cases; advanced analytics and BI; thought leadership</td></tr>\n</tbody></table>\n<h4>How to use the baseline</h4>\n<ul>\n<li>Treat it as a <strong>dated snapshot</strong> (April 2025): confirm facts with system owners before reusing them in a design, and record the date in the repository.</li>\n<li>Load its application, integration, data and hosting inventories into the EA repository as the first GEA catalogues (ARM, IRM, TRM).</li>\n<li>Use its findings as gap analysis input, phrased as capability gaps against GEA and good practice, not as judgements on teams.</li>\n<li>Cite page numbers so readers can check the source.</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> The report&rsquo;s security chapter is summarised in this hub only at the level of its five security layers. Detailed security findings are not published here.</div>\n<div class=\"callout gta\"><b>At GTA</b> Stage 1 of the journey (&ldquo;target digital architecture&rdquo;) is exactly what GEA expects an agency EA to produce. Reading the baseline through the GEA reference models turns the report&rsquo;s findings into the agency catalogues, matrices and self-assessment evidence GEA requires.</div>",
  "related": [
   "gta-gea-readiness",
   "gta-application-landscape",
   "gta-it-governance-baseline",
   "qatar-gea"
  ],
  "refs": [
   {
    "t": "OECD Forum on Tax Administration",
    "u": "https://www.oecd.org/tax/forum-on-tax-administration/"
   },
   {
    "t": "General Tax Authority",
    "u": "https://www.gta.gov.qa"
   }
  ]
 },
 {
  "id": "gta-application-landscape",
  "title": "GTA Application Landscape and the GEA ARM Taxonomy",
  "cat": "GTA Baseline",
  "level": "Practitioner",
  "tags": [
   "gta",
   "applications",
   "dhareeba",
   "arm taxonomy",
   "portfolio"
  ],
  "summary": "GTA's baseline users, channels, core and support applications, the SharePoint application estate and mandated government applications, with a proposed classification against the GEA ARM taxonomy and what good looks like.",
  "minutes": 10,
  "diagram": "building-blocks",
  "body": "<h4>Users and channels</h4>\n<p><strong>Users</strong>: GTA employees; taxpayers; tax agents and inspectors; vendors and suppliers; government ministries; call-centre agents; licensing authorities. <strong>Channels</strong>: Dhareeba portal (SAP TRM); GTA mobile apps (Hayaatna / Dhareeba); intranet (SharePoint); email (MS Exchange); SMS gateway; social media; call centre (Government Call Center).</p>\n<h4>Applications with proposed ARM classification</h4>\n<table class=\"tbl\"><thead><tr><th>Application</th><th>Role in the baseline</th><th>Proposed ARM category</th></tr></thead><tbody>\n<tr><td><strong>Dhareeba</strong> (SAP TRM)</td><td>Core tax and revenue management for taxpayers, employees and tax agents; integrates with SharePoint, banks, MOI, MOCI, GAC, MCIT, QFC</td><td>1.3 Specialist Line of Business</td></tr>\n<tr><td><strong>Tax Support Management</strong></td><td>Case management of Dhareeba tickets: external users (HPSM, MCIT) and internal users (Microsoft Dynamics)</td><td>1.2.3 Customer Relationship Management</td></tr>\n<tr><td><strong>Tabadol</strong> (NewGen)</td><td>Primary system for data exchange with foreign and external parties (FATCA, CRS)</td><td>2.3.2 Data Exchange and Interchange</td></tr>\n<tr><td><strong>Payment Gateway</strong> (XPI)</td><td>Integrated with Dhareeba</td><td>2.3 Integration Services (confirm against the WoG payment gateway)</td></tr>\n<tr><td>TAS</td><td>Legacy core tax system before Dhareeba</td><td>1.3 Specialist Line of Business (retirement candidate)</td></tr>\n<tr><td>Summit</td><td>IT service management</td><td>2.5 ICT Services and Tools &ndash; ICT Management Tools</td></tr>\n<tr><td>WorkForce; Microsoft Dynamics (procurement); fixed asset management</td><td>Attendance; procurement; assets</td><td>1.1.1 Enterprise Resource Plan</td></tr>\n<tr><td>SharePoint + OpenText + SAP Content Server</td><td>Enterprise content management</td><td>1.1.6 Enterprise Content Management</td></tr>\n<tr><td>ASIS</td><td>Access and visitor management</td><td>2.2 Security Services (physical access; confirm)</td></tr>\n<tr><td>Active Directory</td><td>Directory</td><td>2.2.1 Identification and authentication</td></tr>\n<tr><td>IBM API Connect</td><td>API management</td><td>2.5.2 ICT Components (&ldquo;service / API management&rdquo;)</td></tr>\n<tr><td>MS Exchange</td><td>Email</td><td>2.4.2 Electronic mail</td></tr>\n<tr><td>About 25 in-house SharePoint applications</td><td>HR and administrative processes (leave, evaluations, transfers, official missions, training programmes, employee files, archiving and others)</td><td>Mostly 1.1 Corporate Applications</td></tr>\n</tbody></table>\n<p>Classifications are proposals for the EA Office to confirm; record the agreed category on each Application Service in the GEA application catalogue.</p>\n<h4>Mandated government applications</h4>\n<p>GTA is mandated to use <strong>Mawared</strong> (HR), <strong>Tawasul</strong> (communications) and <strong>Maliya</strong> (finance). These are WoG shared services in GEA terms (HRMS, e-correspondence, finance) and must be reflected in GTA&rsquo;s shared service / application matrix.</p>\n<h4>Findings</h4>\n<ul>\n<li>All internal application integrations are point-to-point.</li>\n<li>Dhareeba&ndash;Tabadol integration is missing.</li>\n<li>GRC and PMO solutions are missing; case management for legal cases and MAP is not available.</li>\n<li>Many fragmented SharePoint solutions.</li>\n<li>Pre-2020 historical taxpayer data is split between TAS and Dhareeba and hard to access.</li>\n</ul>\n<h4>What good looks like (GEA ARM and TOGAF)</h4>\n<ol>\n<li><strong>Application catalogue</strong> in Archi, each application linked to its ARM category, its business services (realized by) and information assets; published to the ministry as GEA requires.</li>\n<li><strong>Portfolio assessment</strong> (TIME) for each application, starting with the SharePoint estate: tolerate, consolidate onto a shared workflow platform, or eliminate where Mawared or another mandated service already covers the process.</li>\n<li><strong>Reuse before buy</strong>: for GRC, portfolio management and case management, check the ARM WoG shared applications (strategy and portfolio management, case management, CRM platform) before tendering.</li>\n<li><strong>Historical data plan</strong>: decide where pre-2020 TAS data lives and how it stays searchable for audits and appeals before TAS is retired.</li>\n<li><strong>Dhareeba 2.0</strong> scoped against the GEA ARM reference architecture: business APIs exposed through managed integration, not new point-to-point links.</li>\n</ol>\n<div class=\"callout gta\"><b>At GTA</b> The building-blocks diagram contrasts what is needed (ABBs) with how the baseline delivers it today (SBBs): Dhareeba for core tax, NAS for taxpayer authentication, GDX for cross-government exchange, Tabadol for international exchange, API Connect for API management and Synapse plus SAP BW for the warehouse.</div>",
  "related": [
   "gea-arm",
   "application-portfolio-management",
   "tpl-time-rubric",
   "gta-integration-baseline"
  ],
  "refs": [
   {
    "t": "General Tax Authority",
    "u": "https://www.gta.gov.qa"
   }
  ]
 },
 {
  "id": "gta-integration-baseline",
  "title": "GTA Integration Landscape: From Point-to-Point to GEA-Aligned Exchange",
  "cat": "GTA Baseline",
  "level": "Practitioner",
  "tags": [
   "gta",
   "integration",
   "gdx",
   "tabadol",
   "point-to-point"
  ],
  "summary": "The baseline integration landscape (no internal middleware, GDX for MoI, point-to-point external APIs, file transfer for treaty exchange) compared with what the GEA IRM and ARM prescribe, with a practical target direction.",
  "minutes": 9,
  "diagram": "gta-integration",
  "body": "<h4>Baseline</h4>\n<ul>\n<li><strong>No middleware or integration platform internally</strong>; internal integrations are point-to-point.</li>\n<li><strong>GDX</strong> (MCIT&rsquo;s Government Data eXchange) connects Dhareeba with MoI.</li>\n<li>Other external integrations are point-to-point APIs. Entities include MoF, MCIT, MoI, MoCI, GAC, QFC, FATCA/CRS counterparts (OECD and IRS), banks, MoJ and MoL.</li>\n<li>External government systems used: Sharek (citizen engagement), Maliya&ndash;GFMI (financial), NAS (National Authentication System), Tasdeeq (document security), Mawared (HR), Emdad (supply), Tawasul (communications).</li>\n<li>Tabadol exchanges with international jurisdictions via file transfer.</li>\n<li>No integration strategy; limited EA documentation; an EA office has been discussed to maintain integration blueprints.</li>\n<li>The Dhareeba&ndash;Tabadol integration is missing, while Tabadol must support the OECD Pillar Two GIR schema by 2027.</li>\n</ul>\n<h4>What GEA prescribes</h4>\n<table class=\"tbl\"><thead><tr><th>Topic</th><th>GEA reference</th><th>Implication for GTA</th></tr></thead><tbody>\n<tr><td>Inter-agency exchange</td><td>IRM: agencies &ldquo;should leverage the GDX platform&rdquo; (Resolution 18/2010)</td><td>Move point-to-point government links (MoCI, GAC, MoF and others) onto GDX where the counterpart is available on it</td></tr>\n<tr><td>Intra-agency exchange</td><td>IRM minimum set: developer portal, subscription management, API catalogue, gateway (schema validation, XML firewall, AAA, REST/SOAP bridge), mediation (transformation, protocol switching, routing, publish/subscribe), registry, monitoring and logging</td><td>Define GTA&rsquo;s internal integration capability against this list; API Connect may already cover part of it</td></tr>\n<tr><td>Application integration</td><td>ARM: GDX-provided ESB, registry and API management; event hub for choreography</td><td>Expose Dhareeba and Tabadol capabilities as managed business APIs and events</td></tr>\n<tr><td>Description of exchanges</td><td>IRM Exchange Package; Information Assets Catalogue</td><td>One exchange package per recurring exchange, with classification, frequency and stewards</td></tr>\n<tr><td>Standards</td><td>IRM: JSON, XML, XSD, WSDL, XSLT, Dublin Core mandatory externally; SOAP and ANSI SQL in all usage areas</td><td>State the standards position for each interface in the SAD</td></tr>\n<tr><td>Compliance</td><td>Self-assessment IRM statements 1 and 4 (15 points each)</td><td>&ldquo;Is the agency&rsquo;s information exchange architecture aligned with GEA?&rdquo; needs a documented blueprint</td></tr>\n</tbody></table>\n<h4>Target direction</h4>\n<ol>\n<li><strong>Integration strategy and blueprint</strong> (a key consideration in the report): principles, patterns, platform ABBs, ownership and interface catalogue.</li>\n<li><strong>Internal integration platform</strong> sized to the IRM minimum set; no new point-to-point integrations to Dhareeba without a time-boxed exception.</li>\n<li><strong>Dhareeba&ndash;Tabadol integration</strong> as the first flagship use case, because GIR support by 2027 sets a hard date.</li>\n<li><strong>GDX first</strong> for government partners; managed file transfer with integrity checks and acknowledgements for treaty exchanges.</li>\n<li><strong>Interface catalogue and exchange register</strong> populated from the baseline list above.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Buying an integration platform before agreeing the integration strategy. Without ownership, standards and a catalogue, a platform simply hosts the same point-to-point links.</div>\n<div class=\"callout gta\"><b>At GTA</b> The GDX link with MoI already proves the GEA pattern at GTA. Documenting it as a reference implementation (exchange package, security, monitoring, support model) gives project teams a concrete template for the next government integrations.</div>",
  "related": [
   "gea-irm",
   "integration-patterns",
   "data-sharing-apis",
   "chk-integration-design"
  ],
  "refs": [
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "gta-data-reporting-baseline",
  "title": "GTA Data and Reporting Landscape vs GEA IRM and Smart Qatar Data Management",
  "cat": "GTA Baseline",
  "level": "Practitioner",
  "tags": [
   "gta",
   "data management",
   "reporting",
   "smart qatar",
   "data warehouse"
  ],
  "summary": "GTA's baseline data pipeline (SAP BW, Azure Synapse, SAP Data Services, SAP Analytics Cloud, Power BI) and data management findings, mapped to the Smart Qatar Data Management Framework and GEA IRM obligations.",
  "minutes": 9,
  "diagram": "gta-data-flow",
  "body": "<h4>Baseline pipeline</h4>\n<table class=\"tbl\"><thead><tr><th>Stage</th><th>Baseline components</th></tr></thead><tbody>\n<tr><td>Sources</td><td>SAP TRM (Dhareeba), Microsoft Dynamics, Tabadol, Summit, SharePoint, external government entities, banks and financial institutions, tax laws</td></tr>\n<tr><td>Integration</td><td>ETL: Azure Synapse (non-SAP) and SAP Data Services (SAP); data quality: SAP Data Services</td></tr>\n<tr><td>Processing and analytics</td><td>Data warehouse: SAP BW for SAP data, Azure Synapse Analytics for non-SAP workloads; SAP Analytics Cloud (SAP data only)</td></tr>\n<tr><td>Visualisation</td><td>Power BI; productivity suite (Excel)</td></tr>\n<tr><td>End users</td><td>Leadership dashboards; departmental reports</td></tr>\n</tbody></table>\n<h4>Findings</h4>\n<ul>\n<li>No formal data strategy and no data maturity assessment; data governance, classification, metadata, quality and stewardship capabilities are missing; a data management framework aligned with national direction is under development.</li>\n<li>A data classification project is in progress; executive reporting is limited and manual reporting prevalent.</li>\n<li>Historical data before 2020 sits in TAS and is hard to access.</li>\n</ul>\n<h4>Mapping to the Smart Qatar Data Management Framework (GEA IRM)</h4>\n<table class=\"tbl\"><thead><tr><th>Domain</th><th>Baseline position</th><th>First step</th></tr></thead><tbody>\n<tr><td>Governance</td><td>Capability missing; framework under development</td><td>Data governance council, named owners and stewards per tax data domain</td></tr>\n<tr><td>Data Classification</td><td>Project in progress</td><td>Align levels with the national scheme; classify catalogue entries at entity level</td></tr>\n<tr><td>Data Structure / Data Architecture</td><td>Not evidenced as documented</td><td>Conceptual model for taxpayer, return, assessment, payment; IRM structured description template</td></tr>\n<tr><td>Data Integration</td><td>Two ETL toolsets (SAP and non-SAP)</td><td>Ingestion standards per source; lineage from source to KPI</td></tr>\n<tr><td>Metadata Management</td><td>Capability missing</td><td>Information Assets Catalogue with IRM taxonomy codes and stewards</td></tr>\n<tr><td>Master Data Management</td><td>Not evidenced</td><td>Taxpayer golden record across Dhareeba, TAS history, NAS identities and registry data</td></tr>\n<tr><td>Data Security</td><td>ISO 27001 ISMS in place</td><td>Classification-driven access and masking in analytics zones</td></tr>\n<tr><td>Data Quality</td><td>SAP Data Services for SAP data; capability gaps elsewhere</td><td>Quality rules and scores for critical data elements behind executive KPIs</td></tr>\n</tbody></table>\n<h4>GEA IRM obligations that this work satisfies</h4>\n<ul>\n<li>Information Assets Catalogue aligned to the IRM taxonomy (tax information under 1.02.02.03 Tax) and the business service &ndash; information asset matrix.</li>\n<li>Policy conformance: Data Management Policy (governance, administration, protection, sharing) and Open Data Policy (publish non-restricted aggregates, such as revenue statistics, where policy allows).</li>\n<li>Mandatory Smart Qatar Data Standards compliance for projects (self-assessment IRM statement 5).</li>\n</ul>\n<h4>Fit with the ARM analytics view</h4>\n<p>The ARM&rsquo;s analytics development view uses ETL/batch, data quality, data warehouse, analytical tools, analytics APIs and analytical dashboards. GTA already has a component in each slot; the gap is governance, a shared semantic layer for KPI definitions, and automation of executive reporting, not more tools.</p>\n<div class=\"callout gta\"><b>At GTA</b> The report&rsquo;s key considerations call for a data management strategy, a data quality plan and automated reporting. Anchoring them to the Smart Qatar domains and the IRM catalogue means the same work produces GEA compliance evidence.</div>",
  "related": [
   "data-governance-stewardship",
   "analytics-lakehouse",
   "gea-irm",
   "data-quality"
  ],
  "refs": [
   {
    "t": "DAMA International - DMBOK",
    "u": "https://www.dama.org/cpages/body-of-knowledge"
   }
  ]
 },
 {
  "id": "gta-hosting-baseline",
  "title": "GTA Hosting and Infrastructure Baseline vs GEA TRM and Cloud Policy",
  "cat": "GTA Baseline",
  "level": "Practitioner",
  "tags": [
   "gta",
   "hosting",
   "azure",
   "disaster recovery",
   "trm"
  ],
  "summary": "GTA runs core production in Azure West Europe with DR in Azure North Europe, plus the Meeza data centre in Qatar and the Government Network. This article maps the baseline to the GEA TRM, cloud controls and DR expectations.",
  "minutes": 9,
  "diagram": "gta-hosting",
  "body": "<h4>Sites</h4>\n<table class=\"tbl\"><thead><tr><th>Site</th><th>Role</th><th>TRM classification</th></tr></thead><tbody>\n<tr><td>GTA building</td><td>Users, LAN and Wi-Fi, IP telephony, Internet and Government Network WAN</td><td>3.5 Office; 2.4 Traditional networking</td></tr>\n<tr><td><strong>Meeza data centre</strong> (Qatar, on-premises)</td><td>IT and security tooling, virtualisation, backup appliance</td><td>3.1 Data center; 1.1 Virtualized infrastructure</td></tr>\n<tr><td><strong>Azure West Europe &ndash; primary</strong></td><td>Core production: SAP S/4HANA, BW/4HANA, SAP Portal/Fiori, Dhareeba non-SAP applications; production, development, QA, pre-production and sandbox</td><td>1.4 IaaS / 1.5 PaaS</td></tr>\n<tr><td><strong>Azure North Europe &ndash; DR</strong></td><td>Dhareeba DR resources, directory, monitoring</td><td>1.4 IaaS</td></tr>\n<tr><td>MCIT Government Network</td><td>WAN connectivity, with ExpressRoute to Azure</td><td>WoG shared service (Government Network)</td></tr>\n</tbody></table>\n<h4>Findings</h4>\n<ul>\n<li>No formal multi-cloud strategy.</li>\n<li>Azure Europe versus <strong>Qatar Central</strong>: differences in available services could cause rework in any migration; the option is under review.</li>\n<li>No formal IT disaster recovery and business continuity strategy; Dhareeba DR testing and documentation are insufficient.</li>\n<li>DR failover depends on external entities, for example authentication via MCIT.</li>\n<li>Infrastructure licence renewals and a Meeza hardware refresh fall in 2025.</li>\n</ul>\n<h4>What GEA expects</h4>\n<table class=\"tbl\"><thead><tr><th>Expectation</th><th>Source</th><th>Baseline relevance</th></tr></thead><tbody>\n<tr><td>Infrastructure Assets Catalogue and application&ndash;infrastructure matrix</td><td>TRM; self-assessment TRM statements 1&ndash;2</td><td>Start from the site table above</td></tr>\n<tr><td>Comply with the Cloud Security Policy</td><td>Security Management; Governance Model</td><td>Applies because GTA uses cloud; use its CSP questionnaire for each provider and region</td></tr>\n<tr><td>Cloud responsibility matrix (who manages what)</td><td>TRM control CCRAG-Gov.1.1 (Required)</td><td>Needed for each Azure service model in use and for Meeza</td></tr>\n<tr><td>Independent audit of the provider at least annually; right of audit for outsourced hosting</td><td>TRM CCRAS-Aud.3.3; Security DCS 1.1</td><td>Contract and evidence management</td></tr>\n<tr><td>Inventory of business-critical assets at all sites and locations; authorisation before relocating data offsite</td><td>TRM CCRABCRS-DCAAS-1.2; CCRAS-GCDC.5.4</td><td>Directly relevant to any Qatar Central migration</td></tr>\n<tr><td>Network diagrams identifying data flows with legal compliance impacts</td><td>TRM CCRAS-IV.6.10</td><td>Document flows between Qatar, Azure regions and partners</td></tr>\n<tr><td>IT service continuity plan meeting business continuity targets</td><td>Service Management (ITSCM); TRM BCRS controls</td><td>Addresses the DR strategy gap</td></tr>\n<tr><td>Reuse the Government ICT Framework Agreement for common licences</td><td>TRM</td><td>Check before the 2025 licence renewals</td></tr>\n</tbody></table>\n<div class=\"callout note\"><b>Note</b> The GEA TRM does <strong>not</strong> mandate in-country hosting. Whether a workload stays in Azure Europe, moves to Qatar Central or runs at Meeza is a decision under the Cloud Security Policy, NIA controls, data classification and applicable law, recorded per workload as an ADR. This hub does not assert a residency requirement that the sources do not state.</div>\n<h4>Decision factors for the Qatar Central review</h4>\n<ul>\n<li>Service parity for SAP and data workloads, and the rework the report warns about.</li>\n<li>DR pairing: where the DR site would be, and how failover is tested.</li>\n<li>Dependencies on WoG services (authentication, Government Network) during failover.</li>\n<li>Policy position for each data classification, documented with the policy version.</li>\n<li>Timing relative to licence renewals, Dhareeba 2.0 and the Meeza refresh.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> The report recommends a multi-cloud strategy with cloud governance and an IT DR and BC strategy covering BIA, risk assessment, DR plans and regular testing. The DR tiers article and the cloud hosting checklist are the practical tools for both.</div>",
  "related": [
   "gea-trm",
   "hybrid-sovereign-cloud",
   "resilience-dr-tiers",
   "chk-cloud-hosting"
  ],
  "refs": [
   {
    "t": "NIST SP 800-145: The NIST Definition of Cloud Computing",
    "u": "https://csrc.nist.gov/pubs/sp/800/145/final"
   }
  ]
 },
 {
  "id": "gta-it-governance-baseline",
  "title": "GTA IT Governance and Capability Baseline: Towards an EA Office, TRB and Design Authorities",
  "cat": "GTA Baseline",
  "level": "Practitioner",
  "tags": [
   "gta",
   "it governance",
   "capability model",
   "ea office",
   "service catalogue"
  ],
  "summary": "The baseline status of GTA's IT strategy, governance bodies, IT capability model (including Enterprise Architecture Management), service catalogue and project portfolio, mapped to GEA governance and service management.",
  "minutes": 10,
  "diagram": "gta-it-governance",
  "body": "<h4>Strategic direction</h4>\n<p>The business strategy is being refreshed; a draft IT strategy (vision, mission, goals) exists but is not formalised, and IT KPIs are not yet cascaded. GEA requires an agency EA or IT strategy that complies with GEA and investments that demonstrate alignment with measurable KPIs.</p>\n<h4>Governance bodies</h4>\n<table class=\"tbl\"><thead><tr><th>Body</th><th>Baseline status</th><th>GEA counterpart</th></tr></thead><tbody>\n<tr><td>IT Steering Committee</td><td>In place; led by the Head of IT; meets ad hoc</td><td>Agency strategic forum; sponsor for the EA programme</td></tr>\n<tr><td>PMO</td><td>Informal; monthly project meetings</td><td>Agency project management; investment alignment</td></tr>\n<tr><td><strong>Enterprise Architecture Office</strong></td><td><strong>Not yet established; planned initiative</strong></td><td>Agency enterprise architect; <strong>Technical Review Board</strong>; Design Authorities</td></tr>\n<tr><td>Change Advisory Board</td><td>In place; membership varies by change</td><td>Service Management change management; Security OM 2 change board</td></tr>\n<tr><td>Information Security Committee</td><td>Not in place</td><td>Security OM 4.3 recommendations go to an &ldquo;information security governance committee&rdquo;</td></tr>\n<tr><td>Vendor Management Board</td><td>Not in place</td><td>Service Management supplier management</td></tr>\n</tbody></table>\n<p>The report distinguishes strategic bodies (&ldquo;are we doing the right things?&rdquo;) from operational bodies (&ldquo;are we doing things the right way?&rdquo;, &ldquo;are we getting value?&rdquo;), which mirrors GEA&rsquo;s upstream and downstream governance.</p>\n<h4>IT capability model</h4>\n<p>Level 1: Manage Business and Customer Relationships; Plan; Build; Transition; Operate; Manage; Transform; Manage Supplier and Vendor Relationships. Level 2 includes Strategy and Business Alignment, Portfolio Management and Planning, <strong>Enterprise Architecture Management</strong> (level 3: Enterprise Architecture Plan and Governance; Technical Architecture Development), Program Control and Assurance, Project Management, Service Design and Assembly, Service Transition, Service Management, Service Operations, Data Management, Digital Innovation and Delivery, Cybersecurity, Workforce Management, Quality and Continuous Improvement, Financial Management, Sourcing and Procurement, and Vendor Relationship Management. Maturity scale: Basic, Managed, Mature, Leading.</p>\n<div class=\"callout note\"><b>Note</b> Enterprise Architecture Management was assessed at the lowest level: &ldquo;Essential enterprise architecture artifacts, such as business, technical, and data architecture blueprints are absent&rdquo;, and there are no enterprise or domain architect roles. This is a starting point, not a criticism: most agencies begin GEA adoption here.</div>\n<h4>Service management and portfolio</h4>\n<ul>\n<li>Transition processes (configuration and asset, change, release and deployment) are documented in the ITSM tool; request fulfilment, incident and problem management are well documented; capacity, availability, event and access management are not yet documented.</li>\n<li>The IT service catalogue is on Summit with SLAs, but no OLAs; business-facing and technical catalogues are not separated; descriptions, owners and escalation paths are incomplete.</li>\n<li>38 IT projects planned or ongoing in 2025 (20 applications, 8 infrastructure, 4 IT services, 4 security and compliance office); 20 in execution, 16 planned, 2 on hold; no annual portfolio planning and no PMO tool.</li>\n</ul>\n<h4>Mapping to GEA governance: a practical sequence</h4>\n<ol>\n<li>Nominate the <strong>agency architecture sponsor</strong> and an <strong>enterprise architect</strong> (GEA policy 5.1).</li>\n<li>Charter the <strong>Technical Review Board</strong>: membership, decision rights, low-impact exception criteria, link to the CAB and the IT Steering Committee.</li>\n<li>Appoint a <strong>Design Authority</strong> for each of the 38 projects above a threshold, starting with those in execution, and introduce Discovery/Alpha/Beta/Live checkpoints.</li>\n<li>Build the first GEA catalogues in Archi from the baseline inventories, and run a first self-assessment as a baseline score.</li>\n<li>Insert the GEA tender statement in every ICT RFP, including the D4 RFP packages.</li>\n<li>Close service management gaps in GEA&rsquo;s recommended order (OLAs and catalogue structure; then capacity, continuity, availability).</li>\n</ol>\n<div class=\"callout gta\"><b>At GTA</b> The report&rsquo;s key considerations include building EA management capability and developing governance committee charters. This awareness programme is part of standing up the EA Office; the TRB and Design Authority model in the GEA Governance article is the recommended operating shape.</div>",
  "related": [
   "gea-governance",
   "arb-operating-model",
   "gea-service-management",
   "ea-governance-model"
  ],
  "refs": [
   {
    "t": "COBIT (ISACA)",
    "u": "https://www.isaca.org/resources/cobit"
   }
  ]
 },
 {
  "id": "gta-gea-readiness",
  "title": "GTA Against the GEA Self-Assessment: Baseline Readiness",
  "cat": "GTA Baseline",
  "level": "Advanced",
  "tags": [
   "gta",
   "gea",
   "self-assessment",
   "readiness",
   "gap analysis"
  ],
  "summary": "An indicative reading of the 2025 baseline against each section of the GEA compliance self-assessment, to prepare GTA's first formal assessment and prioritise EA Office work.",
  "minutes": 9,
  "diagram": "gap-analysis",
  "body": "<p>GEA requires agencies to self-assess compliance periodically or when the ministry asks. GTA has not yet published a formal GEA self-assessment. The table below reads the April 2025 baseline against each section so that the EA Office knows where evidence already exists and where it must be created. It is an <strong>indicative readiness view, not a score</strong>.</p>\n<table class=\"tbl\"><thead><tr><th>Section (weight)</th><th>Evidence in the baseline</th><th>Main gaps to close</th></tr></thead><tbody>\n<tr><td>BRM (20)</td><td>Channel list and user groups; department mandates; strategy refresh under way</td><td>Services catalogue classified to 14.1 Taxes with maturity levels; customer profiles; customer&ndash;channel&ndash;service matrix; KPIs aligned to measurement areas</td></tr>\n<tr><td>IRM (15)</td><td>GDX used with MoI; data classification project in progress</td><td>Information Assets Catalogue with IRM codes and stewards; service&ndash;information matrix; documented exchange architecture; Data Management and Open Data policy conformance</td></tr>\n<tr><td>ARM (15)</td><td>Application inventory</td><td>Application catalogue mapped to ARM categories; service&ndash;information&ndash;application matrix; projects following the ARM reference architecture</td></tr>\n<tr><td>TRM (10)</td><td>Site and hosting inventory</td><td>Infrastructure Assets Catalogue; application&ndash;infrastructure matrix; cloud controls and BYOD standards evidence</td></tr>\n<tr><td>Security (15)</td><td>ISO 27001 certification and cybersecurity team</td><td>Explicit mapping of GTA security policy to NIA, Cloud Security and BYOD policies; project-level evidence for QeAF and ISRMF</td></tr>\n<tr><td>Service Management (5)</td><td>Summit ITSM, SLAs, documented incident/request/problem/change processes</td><td>OLAs; catalogue structure; remaining processes</td></tr>\n<tr><td>General EA practices (20)</td><td>EA Office planned</td><td>Acquisition strategy with EA compliance measures; EA tooling; operational TRB with compliance reviews; benefits tracking</td></tr>\n</tbody></table>\n<h4>Maturity reading</h4>\n<p>On the report&rsquo;s own four-point scale, EA management is at the lowest level. In GEA EAMM terms this corresponds broadly to <strong>level 0&ndash;1</strong> (no or informal EA process; reference models not yet in use). That is an inference for planning, not an official rating. Reaching <strong>level 2 (Under Development)</strong> needs a documented basic process with clear roles, baseline and target architectures identified and standards defined; <strong>level 3 (Defined)</strong> adds gap analysis and migration plan, published documents, an operational architecture board and started compliance reviews.</p>\n<h4>Priorities that move several sections at once</h4>\n<ol>\n<li><strong>Catalogues in Archi</strong> (BRM, IRM, ARM, TRM): the four reference-model sections carry 60 of the 100 points, and most of their statements concern catalogues, matrices or projects following the reference models.</li>\n<li><strong>TRB plus Design Authorities</strong>: turns project-level statements from &ldquo;not evidenced&rdquo; into countable results.</li>\n<li><strong>Tender statement and acquisition strategy</strong>: cheap to implement and directly scored under General EA practices.</li>\n<li><strong>Integration blueprint</strong>: addresses the two highest-weighted IRM statements.</li>\n</ol>\n<div class=\"callout warn\"><b>Pitfall</b> Optimising for the score. The self-assessment is a means to reuse, interoperability and better investment decisions; catalogues that nobody uses would raise the score without changing outcomes.</div>\n<div class=\"callout gta\"><b>At GTA</b> Run the first official self-assessment soon after the TRB is chartered and record it as the baseline. Repeating it annually shows progress in the terms MCIT uses.</div>",
  "related": [
   "chk-gea-compliance",
   "gea-governance",
   "gap-analysis",
   "ea-value-maturity"
  ],
  "refs": [
   {
    "t": "Ministry of Communications and Information Technology (MCIT)",
    "u": "https://www.mcit.gov.qa/"
   }
  ]
 },
 {
  "id": "c4-overview",
  "title": "The C4 Model: Maps of Your Software at Four Zoom Levels",
  "cat": "Optional Reading: C4 Model",
  "level": "Foundation",
  "optional": true,
  "tags": [
   "c4",
   "software architecture",
   "diagrams",
   "abstractions"
  ],
  "summary": "C4 is a lightweight, developer-friendly way to diagram software architecture: a small set of abstractions (people, software systems, containers, components, code) drawn at four zoom levels. This article explains the idea and why it complements ArchiMate and TOGAF at GTA.",
  "minutes": 9,
  "diagram": "c4-zoom",
  "body": "<p>The <strong>C4 model</strong> was created by Simon Brown to fix a familiar problem: architecture diagrams that are boxes and lines with no agreed meaning. Is that box a server, a database, a team or a microservice? Is that arrow a call, a data flow or a dependency? C4 does not answer this with a heavyweight notation. Instead it gives teams a <strong>shared set of abstractions</strong> and a small number of diagram types that zoom from the big picture into detail, much like an online map zooms from country to street.</p>\n<h4>Four ideas</h4>\n<ol>\n<li><strong>A hierarchy of abstractions</strong> &mdash; software systems contain containers, containers contain components, components are implemented by code.</li>\n<li><strong>A hierarchy of diagrams</strong> &mdash; system context, container, component and code, one for each zoom level.</li>\n<li><strong>Supporting diagrams</strong> &mdash; system landscape, dynamic and deployment, for the questions the four static views cannot answer.</li>\n<li><strong>Notation and tooling independence</strong> &mdash; any shapes and any tool may be used, as long as each diagram explains its own notation with a key.</li>\n</ol>\n<h4>The abstractions</h4>\n<table class=\"tbl\"><thead><tr><th>Abstraction</th><th>Meaning in C4</th><th>GTA example</th></tr></thead><tbody>\n<tr><td><strong>Person</strong></td><td>A human user of the software: an actor, role or persona.</td><td>Taxpayer, tax agent, GTA tax officer</td></tr>\n<tr><td><strong>Software system</strong></td><td>The highest level: something that delivers value to its users, typically owned by one team, with a boundary you can draw.</td><td>Dhareeba, Tabadol, the national authentication service</td></tr>\n<tr><td><strong>Container</strong></td><td>An application or a data store &mdash; something that must be <em>running</em> for the system to work and that is separately deployable. Containers usually run in their own process, so communication between them crosses a process or network boundary.</td><td>A taxpayer web app, a REST API, a relational database, a message topic</td></tr>\n<tr><td><strong>Component</strong></td><td>A grouping of related functionality behind a well-defined interface, running <em>inside</em> a container. Components are not separately deployable.</td><td>An eligibility-rules module, a Dhareeba adapter inside an API</td></tr>\n<tr><td><strong>Code</strong></td><td>Classes, interfaces, functions, tables that implement a component.</td><td>Objection, ObjectionRepository</td></tr>\n</tbody></table>\n<div class=\"callout note\"><b>Not Docker</b> A C4 &ldquo;container&rdquo; predates and is unrelated to Docker containers. A C4 container may be <em>deployed</em> in a Docker container, a virtual machine, a SaaS tenant or a mobile phone &mdash; that mapping belongs on a deployment diagram.</div>\n<h4>Which diagrams to draw</h4>\n<ul>\n<li><strong>System context</strong> and <strong>container</strong> diagrams are useful for almost every system; Simon Brown recommends teams start with these two.</li>\n<li><strong>Component</strong> diagrams only where a container is complex enough to need explaining; they change often and are best generated or kept close to the code.</li>\n<li><strong>Code</strong> diagrams rarely by hand; most IDEs and modelling tools can generate them on demand.</li>\n</ul>\n<h4>How C4 fits with what GTA already uses</h4>\n<table class=\"tbl\"><thead><tr><th>Need</th><th>Best fit</th></tr></thead><tbody>\n<tr><td>Enterprise-wide views across business, information, application and technology; GEA catalogues and matrices</td><td>ArchiMate (GEA models are published in ArchiMate)</td></tr>\n<tr><td>Method for developing and governing architecture</td><td>TOGAF ADM, tailored with GEA checkpoints</td></tr>\n<tr><td>Explaining the structure of one software system to developers, testers, operations and reviewers</td><td><strong>C4</strong></td></tr>\n<tr><td>Detailed behaviour or data models</td><td>UML sequence/state diagrams, ER diagrams</td></tr>\n</tbody></table>\n<div class=\"callout gta\"><b>At GTA</b> C4 is optional reading and is not required by the GEA. It is a practical choice for the <em>solution</em> section of a Solution Architecture Document or a TRB submission: a context and a container diagram answer most reviewer questions about scope, integrations and technology quickly.</div>",
  "related": [
   "notations-compared",
   "archimate-core-elements",
   "tpl-solution-architecture-document"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   },
   {
    "t": "The C4 Model — Simon Brown, O'Reilly",
    "u": "https://www.oreilly.com/library/view/the-c4-model/9798341660113/"
   }
  ]
 },
 {
  "id": "c4-system-context",
  "title": "C4 Level 1: The System Context Diagram",
  "cat": "Optional Reading: C4 Model",
  "level": "Foundation",
  "optional": true,
  "tags": [
   "c4",
   "system context",
   "scope",
   "stakeholders"
  ],
  "summary": "The system context diagram shows one software system as a box in the middle, surrounded by the people who use it and the systems it depends on. It is the diagram every stakeholder should be able to read — a worked GTA example is included.",
  "minutes": 7,
  "diagram": "c4-context-gta",
  "body": "<p>A system context diagram is the starting point for documenting any software system. It deliberately hides technology and internals and answers three questions: <strong>what is the system, who uses it, and what does it depend on?</strong> Because it has no technical detail, it works for business owners, project sponsors, auditors and new team members alike.</p>\n<h4>What goes on it</h4>\n<table class=\"tbl\"><thead><tr><th>Element</th><th>Show</th><th>Avoid</th></tr></thead><tbody>\n<tr><td>Software system in scope</td><td>One box, clearly highlighted, with a one-line description</td><td>Internal containers, servers or databases</td></tr>\n<tr><td>People</td><td>Roles or personas that use the system directly</td><td>Named individuals; org-chart detail</td></tr>\n<tr><td>External software systems</td><td>Systems the system calls or is called by, including shared government services</td><td>Protocol-level detail; every minor utility</td></tr>\n<tr><td>Relationships</td><td>Labelled with intent (&ldquo;Collects payments via&rdquo;), optionally a technology hint</td><td>Unlabelled arrows; one-word labels like &ldquo;Uses&rdquo;</td></tr>\n</tbody></table>\n<h4>Worked example: Dhareeba</h4>\n<p>The figure shows an <em>illustrative</em> context diagram for Dhareeba, GTA's core tax system. Users &mdash; taxpayers, tax agents and GTA officers &mdash; sit at the top. External systems sit around it: the national authentication service for sign-in, a payment gateway, the Ministry of Interior through the Government Data Exchange (GDX), an email and SMS gateway, and Tabadol for international exchange. The Dhareeba&ndash;Tabadol link is drawn in gold and labelled &ldquo;planned&rdquo; because the baseline found that integration missing: context diagrams are a good place to make such gaps visible.</p>\n<h4>How to build one in 30 minutes</h4>\n<ol>\n<li>Write the system's name and a one-sentence purpose.</li>\n<li>List every type of user. Merge roles that interact in the same way.</li>\n<li>List every system it exchanges data with &mdash; check the integration inventory, the API gateway catalogue and the GDX registrations, not just memory.</li>\n<li>Draw relationships and label each with what flows or why.</li>\n<li>Add a title (&ldquo;System Context diagram for &hellip;&rdquo;) and a key.</li>\n<li>Show it to someone outside the team; if they cannot explain the system back to you, simplify.</li>\n</ol>\n<h4>Common mistakes</h4>\n<ul>\n<li>Putting the database or the API gateway on the context diagram &mdash; those are containers or infrastructure.</li>\n<li>Drawing the whole enterprise &mdash; that is a <em>system landscape</em> diagram.</li>\n<li>Arrows pointing both ways with no labels, so readers cannot tell who initiates the interaction.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> A system context diagram maps naturally to the GEA application catalogue (the system), the BRM consumer types (people) and the shared service and interface matrices (external systems). Keep the names identical to the catalogue so diagrams and catalogues can be cross-checked.</div>",
  "related": [
   "c4-overview",
   "c4-container",
   "gta-application-landscape"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   }
  ]
 },
 {
  "id": "c4-container",
  "title": "C4 Level 2: The Container Diagram",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "container diagram",
   "technology choices",
   "solution design"
  ],
  "summary": "The container diagram zooms into one software system and shows its applications and data stores, the technology of each and how they communicate. It is the most useful diagram for solution reviews.",
  "minutes": 9,
  "diagram": "c4-container-gta",
  "body": "<p>The container diagram opens the box. It shows the <strong>high-level shape of the architecture</strong>: which applications and data stores make up the system, how responsibilities are split between them, which technologies they use and how they talk to each other and to external systems. For architects, developers, security reviewers and operations staff this is usually the single most valuable diagram.</p>\n<h4>What counts as a container</h4>\n<table class=\"tbl\"><thead><tr><th>Kind</th><th>Examples</th></tr></thead><tbody>\n<tr><td>Server-side web application or API</td><td>REST API, web front end served by a web server, backend for frontend</td></tr>\n<tr><td>Client-side application</td><td>Single-page app running in the browser, mobile app, desktop app</td></tr>\n<tr><td>Data store</td><td>Relational database schema, document store, object/blob storage bucket, search index, cache</td></tr>\n<tr><td>Background process</td><td>Batch job, scheduled task, message consumer, worker service</td></tr>\n<tr><td>Messaging</td><td>An individual queue or topic (see the messaging article) &mdash; not the whole broker</td></tr>\n<tr><td>Serverless</td><td>A function or set of functions deployed as a unit</td></tr>\n</tbody></table>\n<p>Things that are <strong>not</strong> containers: libraries, JAR files, packages, namespaces and folders (these organise code); and servers, clusters, Kubernetes pods or Azure regions (these are deployment nodes).</p>\n<h4>Worked example: Tax Objections service</h4>\n<p>The figure shows an <em>illustrative</em> new GTA system for handling tax objections. Inside the dashed system boundary there are six containers: a taxpayer web app and an officer workbench, an Objections API holding the business rules, a relational database, an <code>objection-events</code> topic and a notification worker. Outside the boundary are the national authentication service, Dhareeba (read through the API gateway) and the email and SMS gateway. Every container shows its technology, and every arrow says what it does and how.</p>\n<h4>Review questions this diagram answers</h4>\n<ul>\n<li>Where does taxpayer data live, and which containers can write it? (security, data classification)</li>\n<li>Which containers face the Internet and which stay internal? (attack surface)</li>\n<li>Is integration point-to-point or through the API gateway, GDX or events? (GEA ARM integration layer)</li>\n<li>Which technologies are introduced, and are they on GTA's standards list? (TRB technology review)</li>\n<li>What fails if one container is down? (resilience tier, NFRs)</li>\n</ul>\n<h4>Good practice</h4>\n<ul>\n<li>One container diagram per software system; split a crowded one by showing a subset of containers per diagram rather than mixing levels.</li>\n<li>Name containers by responsibility (&ldquo;Objections API&rdquo;) and put the product in the technology field (&ldquo;REST API&rdquo;, &ldquo;PostgreSQL&rdquo;).</li>\n<li>Show external systems at the same level of detail as on the context diagram &mdash; as single boxes.</li>\n<li>Leave hosting out. Regions, clusters and nodes belong on the deployment diagram.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> A container diagram is effectively the application&ndash;component view the TRB needs at the Alpha checkpoint: it shows which shared services are reused (NAS, GDX, API gateway), which new technology is introduced and where data is stored. Attach it to the Solution Architecture Document and reference it in the ADRs that justify each technology choice.</div>",
  "related": [
   "c4-system-context",
   "c4-component-code",
   "chk-arb-submission",
   "integration-patterns"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   }
  ]
 },
 {
  "id": "c4-component-code",
  "title": "C4 Levels 3 and 4: Component and Code Diagrams",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "component diagram",
   "code",
   "modularity"
  ],
  "summary": "Component diagrams zoom into a single container to show its major building blocks; code diagrams go one level further. Both are optional and most useful when generated or kept close to the code.",
  "minutes": 8,
  "diagram": "c4-component-gta",
  "body": "<p>A <strong>component</strong> in C4 is a grouping of related functionality encapsulated behind a well-defined interface. In Java or C# it is typically a set of classes behind an interface; in other languages it may be a module or a set of functions. All components of a container run in the <strong>same process</strong>; they are not deployed independently &mdash; the container is the deployable unit.</p>\n<h4>When a component diagram is worth it</h4>\n<table class=\"tbl\"><thead><tr><th>Draw one when&hellip;</th><th>Skip it when&hellip;</th></tr></thead><tbody>\n<tr><td>The container holds important business rules (e.g. tax calculation, eligibility)</td><td>The container is a thin front end or simple CRUD service</td></tr>\n<tr><td>Several teams or vendors work inside one container</td><td>One small team owns it and the code structure is obvious</td></tr>\n<tr><td>You need to show where an anti-corruption layer or adapter isolates a legacy system</td><td>The diagram would duplicate the package structure without adding insight</td></tr>\n<tr><td>A security review needs to see where authorisation and auditing happen</td><td>It would be out of date within a sprint</td></tr>\n</tbody></table>\n<h4>Worked example: inside the Objections API</h4>\n<p>The illustrative figure decomposes the Objections API into six components: a controller that validates requests, a case service holding the workflow, an eligibility-rules component for deadlines and grounds, a <strong>Dhareeba adapter</strong> acting as an anti-corruption layer so SAP TRM data structures do not leak into the case model, a repository and an event publisher. The database, the topic and Dhareeba appear outside the boundary, exactly as they did on the container diagram.</p>\n<h4>Grouping code into components</h4>\n<ul>\n<li>Group by <strong>responsibility</strong>, not by technical layer only &mdash; &ldquo;Eligibility rules&rdquo; tells a reader more than &ldquo;Services&rdquo;.</li>\n<li>Agree a mapping rule (for example, one component per top-level package or per interface) so diagrams can be generated or checked automatically.</li>\n<li>Remember that C4 shows runtime units and how functionality is split across them, not build artefacts such as JARs, DLLs or folders.</li>\n</ul>\n<h4>Level 4: code</h4>\n<p>Code diagrams (UML class diagrams, entity&ndash;relationship diagrams) show how a component is implemented. They change with every refactoring, so draw them by hand only for a small, important part of the design &mdash; for example the core tax calculation model &mdash; and otherwise generate them from source when needed.</p>\n<div class=\"callout warn\"><b>Pitfall</b> Calling every microservice a &ldquo;component&rdquo;. If it is deployed on its own, it is a container (or a software system in its own right) &mdash; see the microservices article.</div>",
  "related": [
   "c4-container",
   "microservices-ddd",
   "legacy-modernization-7rs"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   }
  ]
 },
 {
  "id": "c4-supplementary",
  "title": "C4 Supplementary Diagrams: System Landscape and Dynamic",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "system landscape",
   "dynamic diagram",
   "runtime behaviour"
  ],
  "summary": "The four static levels describe structure. Two supplementary diagrams fill the gaps: the system landscape shows many systems across the organisation, and the dynamic diagram shows how elements collaborate at runtime for one use case.",
  "minutes": 7,
  "diagram": "c4-dynamic-gta",
  "body": "<p>The static diagrams answer &ldquo;what is there and how is it connected&rdquo;. They do not show the whole estate, nor the order in which things happen. C4 adds three supporting diagrams for that; this article covers two of them, and the next covers deployment.</p>\n<h4>System landscape diagram</h4>\n<p>A system landscape diagram is a system context diagram <strong>without a single system in scope</strong>: it shows all the people and software systems of an organisation, or of one business area, and how they relate. It is the C4 answer to &ldquo;what does our estate look like?&rdquo;.</p>\n<ul>\n<li>Use it to orient newcomers and to frame individual context diagrams.</li>\n<li>Keep it at software-system level only &mdash; no containers.</li>\n<li>Group systems with dashed boundaries by owner or domain (for example GTA systems, mandated government applications, external partners).</li>\n</ul>\n<div class=\"callout note\"><b>Note</b> At enterprise level GTA already has the GEA application catalogue and the baseline landscape in ArchiMate-style form. A C4 landscape is a lighter, developer-facing rendering of the same facts and should be generated from, or checked against, the catalogue rather than maintained separately.</div>\n<h4>Dynamic diagram</h4>\n<p>A dynamic diagram shows how elements from the static model <strong>collaborate at runtime for a specific feature, story or use case</strong>. Interactions are numbered to show order. It can be drawn as a collaboration-style diagram (elements laid out freely, numbered arrows) or as a sequence diagram; both are valid.</p>\n<h4>Worked example: submitting an objection</h4>\n<table class=\"tbl\"><thead><tr><th>#</th><th>From &rarr; to</th><th>Interaction</th></tr></thead><tbody>\n<tr><td>1</td><td>Taxpayer &rarr; Taxpayer web app</td><td>Fills in and submits the objection form</td></tr>\n<tr><td>2</td><td>Web app &rarr; Objections API</td><td>POST /objections with the case data</td></tr>\n<tr><td>3</td><td>Objections API &rarr; Dhareeba</td><td>Checks the assessment exists and the objection deadline has not passed</td></tr>\n<tr><td>4</td><td>Objections API &rarr; Objections database</td><td>Stores the new case and audit record</td></tr>\n<tr><td>5</td><td>Objections API &rarr; objection-events topic</td><td>Publishes ObjectionSubmitted</td></tr>\n<tr><td>6</td><td>Notification worker &rarr; topic</td><td>Consumes the event</td></tr>\n<tr><td>7</td><td>Notification worker &rarr; Email &amp; SMS gateway</td><td>Sends the acknowledgement to the taxpayer</td></tr>\n</tbody></table>\n<h4>When to use dynamic diagrams</h4>\n<ul>\n<li>For a handful of <strong>critical or unusual flows</strong> &mdash; payments, refunds, cross-agency exchanges, failure and retry paths.</li>\n<li>To explain asynchronous behaviour, where the static container diagram hides timing.</li>\n<li>Not for every user story: a few well-chosen flows are more useful than dozens of stale ones.</li>\n</ul>",
  "related": [
   "c4-overview",
   "c4-deployment",
   "gta-application-landscape"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   }
  ]
 },
 {
  "id": "c4-deployment",
  "title": "C4 Deployment Diagrams: Mapping Containers to Infrastructure",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "deployment diagram",
   "cloud",
   "infrastructure"
  ],
  "summary": "A deployment diagram shows how container instances are mapped onto deployment nodes — devices, regions, clusters, platform services — for one environment. It is where hosting, resilience and network zones become visible.",
  "minutes": 8,
  "diagram": "c4-deployment-gta",
  "body": "<p>Container diagrams intentionally say nothing about where things run. The <strong>deployment diagram</strong> adds that: it shows <strong>container instances</strong> (and, when useful, software system instances) running on <strong>deployment nodes</strong>. Nodes can nest &mdash; a database service inside a cloud region, a pod inside a cluster inside a region &mdash; and each diagram describes <strong>one environment</strong>, such as production or pre-production.</p>\n<h4>Vocabulary</h4>\n<dl>\n<dt>Deployment node</dt><dd>Something that hosts software: a physical or virtual server, a device such as a phone or browser, a container runtime, a cloud region or availability zone, a managed platform service.</dd>\n<dt>Container instance</dt><dd>A running copy of a container from the container diagram. The same container can appear several times (for example in two regions).</dd>\n<dt>Infrastructure node</dt><dd>Supporting infrastructure that is not one of your containers: load balancers, firewalls, DNS, API gateways. Include only what helps the reader.</dd>\n</dl>\n<h4>Worked example: Tax Objections service in production</h4>\n<p>The illustrative figure follows GTA's baseline hosting pattern &mdash; a primary Azure region with a disaster-recovery region &mdash; without claiming anything about a real deployment. The taxpayer web app runs in the taxpayer's browser; the officer workbench runs on workstations in the GTA building reaching the cloud over the Government Network. In the primary region, the API and notification worker run on a managed container platform; the database and topic run on managed services; Dhareeba is shown as a software system instance in the SAP landscape. The database replicates asynchronously to the DR region.</p>\n<h4>What reviewers look for</h4>\n<table class=\"tbl\"><thead><tr><th>Concern</th><th>What the diagram should make visible</th></tr></thead><tbody>\n<tr><td>Resilience</td><td>Which instances are duplicated, what replicates to the DR region and how (sync/async) &mdash; compare with the service's resilience tier (RPO/RTO)</td></tr>\n<tr><td>Security zones</td><td>Internet-facing versus internal nodes; traffic through the Government Network; where the API gateway sits</td></tr>\n<tr><td>Data location</td><td>Which region holds which data store &mdash; input to the Cloud Security Policy assessment and data classification decisions</td></tr>\n<tr><td>Shared services</td><td>Use of WoG infrastructure (Government Network, Government Data Center) as required by the GEA TRM</td></tr>\n<tr><td>Operations</td><td>Managed versus self-run components, which affects support model and licences</td></tr>\n</tbody></table>\n<h4>Tips</h4>\n<ul>\n<li>Draw one diagram per environment; note differences between environments in text rather than mixing them.</li>\n<li>Use product names on nodes (&ldquo;Azure Database for &hellip;&rdquo;) only when the choice is decided; otherwise use the capability (&ldquo;Managed database&rdquo;).</li>\n<li>Keep network detail such as IP ranges and firewall rules out of awareness-level diagrams; it belongs in restricted design documents.</li>\n</ul>",
  "related": [
   "c4-container",
   "resilience-dr-tiers",
   "gta-hosting-baseline",
   "chk-cloud-hosting"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   }
  ]
 },
 {
  "id": "c4-microservices-messaging",
  "title": "Modelling Microservices and Message-Driven Systems in C4",
  "cat": "Optional Reading: C4 Model",
  "level": "Advanced",
  "optional": true,
  "tags": [
   "c4",
   "microservices",
   "event-driven",
   "queues and topics"
  ],
  "summary": "Two questions trip up most teams: is a microservice a container, a component or a system, and how should a message broker be drawn? The C4 guidance gives clear answers based on ownership and on treating queues and topics as data stores.",
  "minutes": 9,
  "body": "<h4>Microservices: let ownership decide</h4>\n<p>A microservice is usually more than one C4 element: typically an API container plus its own data store, sometimes a worker as well. How to draw them depends on <strong>who owns them</strong>.</p>\n<table class=\"tbl\"><thead><tr><th>Situation</th><th>Model each microservice as</th><th>Diagram consequence</th></tr></thead><tbody>\n<tr><td>One team owns the whole set of services, which together form one product</td><td>A <strong>group of containers</strong> (API + data store) inside one software system; optionally draw a dashed group around each service</td><td>One container diagram shows all services and their data stores</td></tr>\n<tr><td>Different teams own different services, each with its own roadmap</td><td>A <strong>software system</strong> per service (or per team-owned group)</td><td>Each service gets its own context and container diagrams; a landscape shows how they relate</td></tr>\n</tbody></table>\n<p>Never model a separately deployed service as a component: components live inside one process.</p>\n<h4>Message brokers: draw the queues and topics, not the bus</h4>\n<p>A frequent mistake is to draw the broker as one container in the middle with every service pointing at it. The result is a &ldquo;hub and spoke&rdquo; picture that hides who actually depends on whom. The C4 guidance treats each <strong>queue or topic as a data store</strong> &mdash; producers add messages, consumers take them &mdash; and therefore as a container in its own right.</p>\n<table class=\"tbl\"><thead><tr><th>Approach</th><th>Verdict</th><th>Notes</th></tr></thead><tbody>\n<tr><td>Message bus/broker drawn as one container</td><td>Avoid</td><td>Hides coupling between producers and consumers</td></tr>\n<tr><td>Each queue/topic drawn as a container</td><td>Recommended</td><td>Shows exactly which services share which channel; independent of how brokers are deployed</td></tr>\n<tr><td>Direct arrow from producer to consumer labelled &ldquo;via <em>topic</em>&rdquo;</td><td>Acceptable</td><td>Visually simpler; the channel is less prominent</td></tr>\n</tbody></table>\n<p>Modelling topics as containers also separates the logical design from the deployment: in development all topics may share one broker instance, while in production they may be spread across clusters. That mapping is shown on the deployment diagram.</p>\n<h4>Who owns the topic?</h4>\n<p>When services are separate software systems, decide which system owns each topic &mdash; usually the producer for events (&ldquo;ObjectionSubmitted&rdquo; belongs to the objections system) and the consumer for command queues. Draw the topic inside the owner's boundary and let other systems point to it.</p>\n<h4>Example in the hub</h4>\n<p>The Tax Objections container diagram shows <code>objection-events</code> as a topic container: the API publishes <em>ObjectionSubmitted</em> and the notification worker consumes it. Adding a new consumer &mdash; for example an analytics feed &mdash; adds one arrow and makes the new dependency visible to reviewers.</p>\n<div class=\"callout gta\"><b>At GTA</b> The baseline relies on point-to-point integration. As event-driven integration is introduced, drawing topics explicitly helps the TRB see which agencies or systems depend on which events &mdash; the same information the GEA ARM integration layer and the service&ndash;interface matrices are meant to capture.</div>",
  "related": [
   "microservices-ddd",
   "integration-patterns",
   "c4-container"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   },
   {
    "t": "The C4 Model — Simon Brown, O'Reilly",
    "u": "https://www.oreilly.com/library/view/the-c4-model/9798341660113/"
   }
  ]
 },
 {
  "id": "c4-notation-checklist",
  "title": "Checklist: C4 Notation and Diagram Review",
  "cat": "Optional Reading: C4 Model",
  "level": "Foundation",
  "optional": true,
  "tags": [
   "c4",
   "notation",
   "checklist",
   "diagram review"
  ],
  "summary": "C4 does not prescribe shapes or colours, but every diagram must explain itself. Use this checklist — based on Simon Brown's review checklist — before sharing any architecture diagram, C4 or not.",
  "minutes": 5,
  "body": "<p>C4 is notation-independent: you may use any shapes, colours and tools. The price of that freedom is that <strong>each diagram must stand on its own</strong>, readable without the author in the room. The checklist below adapts Simon Brown's software architecture diagram review checklist for GTA use. It applies equally to ArchiMate, UML or whiteboard photos.</p>\n<h4>General</h4>\n<table class=\"tbl\"><thead><tr><th>Check</th><th>Y / N</th></tr></thead><tbody>\n<tr><td>The diagram has a <strong>title</strong> stating its type and scope (e.g. &ldquo;Container diagram for the Tax Objections service&rdquo;)</td><td></td></tr>\n<tr><td>The reader can tell what <strong>type</strong> of diagram it is and what is in <strong>scope</strong></td><td></td></tr>\n<tr><td>There is a <strong>key / legend</strong> explaining shapes, colours, borders, line styles and arrowheads</td><td></td></tr>\n<tr><td>Acronyms and codenames (NAS, GDX, TRM&hellip;) are understood by the audience or explained</td><td></td></tr>\n<tr><td>It shows a version or date and an owner</td><td></td></tr>\n</tbody></table>\n<h4>Elements</h4>\n<table class=\"tbl\"><thead><tr><th>Check</th><th>Y / N</th></tr></thead><tbody>\n<tr><td>Every element has a <strong>name</strong></td><td></td></tr>\n<tr><td>The <strong>type</strong> of every element is clear (person, software system, container, component)</td><td></td></tr>\n<tr><td>Every element has a short description of its responsibility</td><td></td></tr>\n<tr><td>Where relevant, the <strong>technology</strong> of each container or component is stated</td><td></td></tr>\n<tr><td>All elements on one diagram are at the <strong>same level of abstraction</strong></td><td></td></tr>\n</tbody></table>\n<h4>Relationships</h4>\n<table class=\"tbl\"><thead><tr><th>Check</th><th>Y / N</th></tr></thead><tbody>\n<tr><td>Every line has a <strong>label</strong> describing its intent &mdash; not just &ldquo;uses&rdquo;</td><td></td></tr>\n<tr><td>The label matches the <strong>direction</strong> of the arrow (dependency or data flow &mdash; be consistent)</td><td></td></tr>\n<tr><td>Where relevant, the technology or protocol is stated (HTTPS, SQL, GDX, file transfer)</td><td></td></tr>\n<tr><td>Colour and line style carry no meaning that is missing from the key, and the diagram still works in black and white</td><td></td></tr>\n</tbody></table>\n<h4>Labelling relationships well</h4>\n<ul>\n<li>Weak: &ldquo;Uses&rdquo;. Better: &ldquo;Reads assessment and deadline from&rdquo;.</li>\n<li>Weak: two-headed arrow. Better: one arrow per significant direction, or one arrow from the initiator.</li>\n<li>Weak: &ldquo;API&rdquo;. Better: &ldquo;Calls [JSON/HTTPS via API gateway]&rdquo;.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> Add this checklist to the TRB submission pack: diagrams that fail the general section are returned before review, saving board time.</div>",
  "related": [
   "c4-overview",
   "chk-arb-submission",
   "archimate-viewpoints-conventions"
  ],
  "refs": [
   {
    "t": "C4 model — software architecture diagram review checklist",
    "u": "https://c4model.com/diagrams/checklist"
   },
   {
    "t": "C4 model — notation",
    "u": "https://c4model.com/diagrams/notation"
   }
  ]
 },
 {
  "id": "c4-diagrams-as-code",
  "title": "C4 as Code: Structurizr DSL, PlantUML and Mermaid",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "diagrams as code",
   "structurizr",
   "plantuml"
  ],
  "summary": "Keeping C4 diagrams as text in the repository makes them reviewable, versioned and consistent across levels. This article compares the main options and gives a complete Structurizr DSL example for the Tax Objections service.",
  "minutes": 10,
  "body": "<p>Drawing tools make it easy to create a diagram and hard to keep a <strong>set</strong> of diagrams consistent. When the same container appears on the context, container and deployment diagrams, renaming it should not mean editing three pictures. <strong>Diagrams as code</strong> solves this: you describe the model once in text, store it next to the source code, review changes in pull requests and render the views automatically.</p>\n<h4>Options</h4>\n<table class=\"tbl\"><thead><tr><th>Option</th><th>Approach</th><th>Strengths</th><th>Watch out for</th></tr></thead><tbody>\n<tr><td><strong>Structurizr DSL</strong></td><td>Model-based: define elements and relationships once, then define views over them</td><td>One model, many consistent views; supports all C4 diagram types; created by Simon Brown</td><td>Another DSL to learn; layout control is limited (auto-layout or manual)</td></tr>\n<tr><td><strong>C4-PlantUML</strong></td><td>PlantUML macros for C4 shapes; each diagram is a separate file</td><td>Widely known; works wherever PlantUML renders</td><td>Diagram-based, not model-based &mdash; names can drift between files</td></tr>\n<tr><td><strong>Mermaid C4</strong></td><td>C4 diagram syntax inside Mermaid, which renders in many wikis and Git platforms</td><td>Zero install where Mermaid is supported</td><td>C4 support is limited compared with dedicated tools; also diagram-based</td></tr>\n<tr><td>Modelling tools (e.g. Archi with a C4 viewpoint, other commercial tools)</td><td>Model in a repository with a GUI</td><td>Fits enterprise repositories</td><td>Harder to keep next to code; licence and access</td></tr>\n</tbody></table>\n<h4>Example: Structurizr DSL</h4>\n<pre class=\"code\">workspace \"Tax Objections\" \"Illustrative GTA example\" {\n  model {\n    taxpayer = person \"Taxpayer\"\n    officer  = person \"Objections officer\"\n    nas      = softwareSystem \"National Authentication (NAS)\" \"WoG shared service\" \"External\"\n    dhareeba = softwareSystem \"Dhareeba\" \"SAP TRM core tax system\" \"External\"\n    notify   = softwareSystem \"Email &amp; SMS gateway\" \"\" \"External\"\n    objections = softwareSystem \"Tax Objections service\" {\n      web    = container \"Taxpayer web app\" \"Submit and track objections\" \"Single-page app\"\n      bench  = container \"Officer workbench\" \"Review and decide objections\" \"Web app\"\n      api    = container \"Objections API\" \"Rules, cases, integration\" \"REST API\" {\n        ctrl    = component \"Objections controller\" \"\" \"REST controller\"\n        cases   = component \"Case service\" \"\" \"Domain service\"\n        rules   = component \"Eligibility rules\" \"\" \"Rules\"\n        adapter = component \"Dhareeba adapter\" \"\" \"Anti-corruption layer\"\n      }\n      db     = container \"Objections database\" \"Cases and audit trail\" \"Relational DB\" \"Database\"\n      events = container \"objection-events\" \"ObjectionSubmitted events\" \"Topic\" \"Queue\"\n      worker = container \"Notification worker\" \"Sends acknowledgements\" \"Background service\"\n    }\n    taxpayer -&gt; web \"Submits objections using\" \"HTTPS\"\n    officer  -&gt; bench \"Reviews objections using\" \"HTTPS\"\n    web      -&gt; nas \"Signs users in via\"\n    web      -&gt; ctrl \"Calls\" \"JSON/HTTPS\"\n    bench    -&gt; ctrl \"Calls\" \"JSON/HTTPS\"\n    ctrl     -&gt; cases \"Uses\"\n    cases    -&gt; rules \"Checks eligibility with\"\n    cases    -&gt; adapter \"Gets assessment data via\"\n    adapter  -&gt; dhareeba \"Reads assessment and deadline from\" \"API gateway\"\n    api      -&gt; db \"Reads and writes\" \"SQL\"\n    api      -&gt; events \"Publishes ObjectionSubmitted to\"\n    worker   -&gt; events \"Consumes\"\n    worker   -&gt; notify \"Sends notifications via\"\n  }\n  views {\n    systemContext objections \"Context\"   { include * autolayout lr }\n    container     objections \"Containers\" { include * autolayout lr }\n    component     api        \"Components\" { include * autolayout lr }\n    styles {\n      element \"Person\"   { shape Person }\n      element \"Database\" { shape Cylinder }\n      element \"Queue\"    { shape Pipe }\n      element \"External\" { background #8C93A0 color #ffffff }\n    }\n  }\n}</pre>\n<p>Relationships are defined once against the components; the container view automatically rolls them up to the API container, which is what keeps the levels consistent.</p>\n<h4>Working practices</h4>\n<ul>\n<li>Store the workspace file in the system's repository under <code>docs/architecture/</code>; review diagram changes with the code that causes them.</li>\n<li>Render images in the pipeline and publish them to the Solution Architecture Document or wiki, so readers never need the tool.</li>\n<li>Use the same element names as the GEA application catalogue; consider a simple script that flags names not in the catalogue.</li>\n<li>Record significant changes as ADRs and link them from the diagram descriptions.</li>\n</ul>",
  "related": [
   "c4-notation-checklist",
   "tpl-adr",
   "repository-governance"
  ],
  "refs": [
   {
    "t": "Structurizr DSL documentation",
    "u": "https://docs.structurizr.com/dsl"
   },
   {
    "t": "C4-PlantUML",
    "u": "https://github.com/plantuml-stdlib/C4-PlantUML"
   },
   {
    "t": "C4 model — tooling",
    "u": "https://c4model.com/tooling"
   }
  ]
 },
 {
  "id": "c4-archimate-gea",
  "title": "Using C4 Alongside ArchiMate, TOGAF and the GEA at GTA",
  "cat": "Optional Reading: C4 Model",
  "level": "Practitioner",
  "optional": true,
  "tags": [
   "c4",
   "archimate",
   "gea",
   "solution architecture"
  ],
  "summary": "C4 and ArchiMate answer different questions for different readers. This article maps C4 concepts to ArchiMate and GEA artefacts and shows where C4 diagrams fit in GTA's architecture deliverables and TRB checkpoints.",
  "minutes": 8,
  "diagram": "c4-levels",
  "body": "<p>GTA's enterprise architecture follows the Qatar GEA, which publishes its reference models in ArchiMate and expects agencies to maintain catalogues and matrices. C4 does not replace any of that. It is a <strong>solution-level communication technique</strong> that helps delivery teams describe one system clearly &mdash; and it can be traced back to the enterprise model if names are kept consistent.</p>\n<h4>Concept mapping (approximate)</h4>\n<table class=\"tbl\"><thead><tr><th>C4</th><th>ArchiMate (closest)</th><th>GEA artefact</th></tr></thead><tbody>\n<tr><td>Person</td><td>Business actor / business role</td><td>BRM consumer types (G2C, G2B, G2G, G2E); user groups</td></tr>\n<tr><td>Software system</td><td>Application component (coarse-grained)</td><td>Application catalogue entry, ARM category</td></tr>\n<tr><td>Container</td><td>Application component (fine-grained); data object or artifact for stores</td><td>Application&ndash;information matrix; information assets catalogue for stores</td></tr>\n<tr><td>Component</td><td>Application component / application function inside a component</td><td>Usually below catalogue level</td></tr>\n<tr><td>Relationship</td><td>Serving, flow, access, triggering</td><td>Interface and integration matrices; GDX registrations</td></tr>\n<tr><td>Deployment node</td><td>Node, device, system software, technology service</td><td>Infrastructure assets catalogue; application&ndash;infrastructure matrix</td></tr>\n</tbody></table>\n<div class=\"callout note\"><b>Note</b> The mapping is approximate: C4 has deliberately few element types and no formal metamodel, while ArchiMate is a full modelling language. Use the table to keep names and boundaries aligned, not to convert diagrams mechanically.</div>\n<h4>Where C4 fits in GTA deliverables</h4>\n<table class=\"tbl\"><thead><tr><th>Deliverable / checkpoint</th><th>Suggested C4 content</th></tr></thead><tbody>\n<tr><td>Architecture Vision (TOGAF Phase A) / Discovery</td><td>A system context diagram for the proposed solution: users, affected systems, shared services to be reused</td></tr>\n<tr><td>Solution Architecture Document &mdash; logical view</td><td>Container diagram; component diagram for complex containers</td></tr>\n<tr><td>TRB review at Alpha and Beta</td><td>Container and deployment diagrams with technology and hosting choices, linked to ADRs and the GEA standards check</td></tr>\n<tr><td>Security and data reviews</td><td>Container diagram annotated with data classification; deployment diagram showing zones and regions; threat model built on the same elements</td></tr>\n<tr><td>Live / as-built handover</td><td>Updated diagrams and catalogue entries so the EA repository reflects reality</td></tr>\n</tbody></table>\n<h4>Choosing the notation</h4>\n<ul>\n<li>Talking to business owners, the TRB or MCIT about how systems support services across the enterprise? <strong>ArchiMate</strong>, aligned with GEA views.</li>\n<li>Explaining one system's structure to developers, vendors, testers and operations? <strong>C4</strong>.</li>\n<li>Specifying detailed behaviour or data? <strong>UML</strong> sequence diagrams, state machines, ER models.</li>\n</ul>\n<div class=\"callout gta\"><b>At GTA</b> A pragmatic rule: the EA team maintains the ArchiMate enterprise views and GEA catalogues; delivery teams provide C4 context, container and deployment diagrams for each solution, using catalogue names. The TRB checks that the two agree at each checkpoint.</div>",
  "related": [
   "c4-overview",
   "notations-compared",
   "gea-metamodel-archi",
   "tpl-solution-architecture-document"
  ],
  "refs": [
   {
    "t": "The C4 model — official site (Simon Brown)",
    "u": "https://c4model.com/"
   },
   {
    "t": "ArchiMate — The Open Group",
    "u": "https://www.opengroup.org/archimate-forum/archimate-overview"
   }
  ]
 }
];
