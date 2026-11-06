/* TOGAF Standard, 10th Edition - data module for the GTA Enterprise Architecture Awareness Hub.
   GTA examples are grounded in (1) the Qatar Government Enterprise Architecture (GEA) framework documents
   (Overview, BRM, IRM, ARM, Infrastructure (Technical) Reference Model, Security Management, Service Management,
   Governance Model; issued by MoTC, today MCIT; no printed date, PDF metadata 2018) and (2) GTA's April 2025
   Current State Understanding Report (D1 of the GTA Digital Strategy engagement, prepared with PwC).
   Anything marked "illustrative" is not taken from those sources and does not describe an actual GTA decision. */
window.TOGAF = {

  /* ------------------------------------------------------------------ */
  /* ADM PHASES                                                          */
  /* ------------------------------------------------------------------ */
  phases: [
    {
      id: "prelim",
      code: "P",
      name: "Preliminary",
      tagline: "Prepare the organization: establish the Architecture Capability and tailor the framework.",
      objectives: [
        "Determine the Architecture Capability desired by the organization: review the organizational context for conducting Enterprise Architecture, identify and scope the elements of the enterprise affected, and identify the established frameworks, methods and processes that intersect with the Architecture Capability",
        "Establish a Capability Maturity target for the Architecture Capability",
        "Establish the Architecture Capability: define and establish the Organizational Model for Enterprise Architecture",
        "Define and establish the detailed process and resources for architecture governance",
        "Select and implement tools that support the Architecture Capability",
        "Define the Architecture Principles"
      ],
      inputs: [
        "The TOGAF Library and other architecture frameworks or reference models. At GTA: the Qatar Government Enterprise Architecture (GEA) framework - Overview, Business Reference Model (BRM), Information Reference Model (IRM), Application Reference Model (ARM), Infrastructure (Technical) Reference Model (TRM), Security Management, Service Management and Governance Model (issued by MoTC, today MCIT)",
        "Governance and legal frameworks, including architecture governance strategy. At GTA: Council of Ministers' Resolution No. (18) of 2010 on the implementation of e-government policies (reuse of government shared services and infrastructure), the GEA Governance Model and its enabling policies (e.g., Data Management, Open Data, National Information Assurance, Cloud security, BYOD)",
        "Board strategies, business plans, business strategy and IT strategy. At GTA: the refreshed GTA business strategy and the draft IT strategy (vision, mission and goals not yet formalised, no cascaded IT KPIs at the time of the April 2025 report)",
        "Business principles, business goals and business drivers, including national direction (e.g., Qatar Digital Agenda 2030, Third National Development Strategy)",
        "Current state evidence. At GTA: the Current State Understanding Report (April 2025, deliverable D1 of the GTA Digital Strategy engagement) - IT capability maturity, governance bodies, applications, integration, data and infrastructure baseline",
        "Major frameworks operating in the business (e.g., portfolio/project management, IT service management, information security management, quality)",
        "Architecture capability and partnership/contract agreements",
        "Existing organizational model for Enterprise Architecture, architecture method and content (if any). At GTA: none yet - no EA Office (an EA Office initiative is planned), no enterprise or domain architect roles, essential architecture blueprints absent",
        "Existing Architecture Principles and Architecture Repository (if any). At GTA: the seven GEA principles and the GEA reference models published in ArchiMate 3.0 format",
        "Budget requirements and sponsorship for the Architecture Capability"
      ],
      steps: [
        "Scope the enterprise organizations impacted",
        "Confirm governance and support frameworks",
        "Define and establish the Enterprise Architecture team and organization",
        "Identify and establish Architecture Principles",
        "Tailor the TOGAF framework and, if any, other selected architecture framework(s)",
        "Develop strategy and implementation plans for tools and techniques"
      ],
      outputs: [
        "Organizational Model for Enterprise Architecture (scope, maturity assessment, gaps, roles and responsibilities, budget, governance and support strategy). At GTA: the planned EA Office, an executive sponsor and an agency enterprise architect as required by the GEA Governance Model",
        "Tailored Architecture Framework (tailored method, content, terminology, processes, configured and deployed tools). At GTA: the TOGAF ADM as method, GEA taxonomies and artefacts as content, GEA checkpoints and exception levels as governance, ArchiMate 3.0-based tooling",
        "GEA adoption plan for the GEA reference models and standards (required of every agency by the GEA Governance Model, section 5.1)",
        "Technical Review Board (TRB) charter - GTA's agency-level architecture board - and terms of reference for project Design Authorities",
        "Initial Architecture Repository, populated with framework content (at GTA: the GEA reference models, taxonomies and WoG shared-services catalogues)",
        "Architecture Principles (and restatement of, or reference to, business principles, goals and drivers). At GTA: the seven GEA principles plus complementary TOGAF principles",
        "Request for Architecture Work (optional at this stage)",
        "Architecture Governance Framework",
        "Initial Capability Assessment (maturity baseline). At GTA: a first GEA compliance self-assessment and EA Maturity Model level"
      ],
      artifacts: [
        "Principles catalog",
        "Stakeholder catalog / initial stakeholder list",
        "Architecture Repository structure and metamodel configuration (mapped to the GEA metamodel layers and taxonomies)",
        "Organization map (who is affected by and participates in EA)",
        "Architecture governance process model and RACI (sponsor, enterprise architect, TRB, Design Authorities)",
        "GEA compliance self-assessment baseline (GEA Governance Model, Appendix 1 template)"
      ],
      techniques: [
        "Architecture Principles development (Name, Statement, Rationale, Implications)",
        "Stakeholder management",
        "Architecture maturity models / capability assessment",
        "Architecture Skills Framework",
        "Tailoring the ADM (iteration, levels, integration with other frameworks such as a national government EA framework)",
        "Risk management (identifying architecture capability risks)"
      ],
      gtaExample: "<p><strong>Starting point.</strong> The April 2025 Current State Understanding Report found that <em>essential enterprise architecture artifacts, such as business, technical and data architecture blueprints, are absent</em>, that GTA has no enterprise or domain architect roles, and that there is no Enterprise Architecture Office yet, although an EA Office initiative is planned. Enterprise Architecture Management was assessed at the lowest level of the IT capability model. For GTA, the Preliminary phase is therefore where the Architecture Capability is <em>established</em>, not merely tuned.</p>" +
        "<p><strong>Mandated context.</strong> GTA does not choose its framework in isolation. The Qatar Government Enterprise Architecture (GEA) applies to all government agencies, and entities shall refer to and comply with it when designing their enterprise architecture or IT strategy. GTA therefore uses TOGAF as its <em>method</em> and adopts GEA as its <em>content and governance context</em>:</p>" +
        "<ul><li><strong>Reference models and taxonomies:</strong> the BRM, IRM, ARM and Infrastructure (Technical) Reference Model classify GTA's services, information assets, applications and infrastructure, so GTA catalogues speak the common government language.</li>" +
        "<li><strong>Principles:</strong> the seven GEA principles (Customer centricity; Promote reuse; Share Information by default; Enable co-creation through a collaborative environment; Trust and confidence; Interoperable; Design for future) become GTA's top-level architecture principles, complemented by a few TOGAF principles (see the Principles section).</li>" +
        "<li><strong>Governance roles:</strong> the GEA Governance Model requires each agency to nominate an <em>executive sponsor</em> (e.g., the CIO or a senior executive) and an <em>agency enterprise architect</em>, to establish a <em>Technical Review Board</em> focused on GEA compliance, and to set up a <em>Design Authority</em> for each new solution.</li>" +
        "<li><strong>Tooling:</strong> agencies shall plan EA tooling based on ArchiMate 3.0; the GEA models themselves are built in Archi, which agencies without an ArchiMate 3.0 tool are encouraged to use.</li>" +
        "<li><strong>Legal basis:</strong> Council of Ministers' Resolution No. (18) of 2010 requires entities to reuse shared services and infrastructure such as the authentication platform, payment platform, data centre, government network, contact centre and PKI.</li></ul>" +
        "<div class=\"callout gta\"><b>At GTA</b> The Preliminary phase produces concrete outputs: a GEA adoption plan, a TRB charter, the tailored framework (TOGAF method plus GEA taxonomies, artefacts and checkpoints), the EA Office as the home of the capability, and a first GEA self-assessment as the maturity baseline. Planning &amp; Quality, whose mandate covers the strategic roadmap, KPIs, PMO oversight and change-request impact assessment, is a natural partner in governance. Where the EA Office sits and who holds each role is illustrative until GTA decides.</div>",
      pitfalls: [
        "Copying the full TOGAF framework without tailoring, producing heavy process nobody follows",
        "Treating TOGAF and GEA as competing frameworks: at GTA, GEA is the mandated content and governance context, and TOGAF is the method for applying it",
        "Defining principles that are platitudes with no implications, so they cannot be used in compliance reviews",
        "Establishing a review board (at GTA, the TRB) without a clear mandate, decision rights or link to the investment, procurement and portfolio processes",
        "Treating Preliminary as a one-off; the capability needs revisiting as the organization matures"
      ],
      keyPoints: [
        "Preliminary prepares the organization: it defines the 'where, what, why, who and how we do architecture'",
        "Architecture Principles are defined in Preliminary and confirmed/elaborated in Phase A",
        "Key outputs: Organizational Model for EA, Tailored Architecture Framework, Architecture Principles, initial Architecture Repository",
        "The Request for Architecture Work can be an output of Preliminary and is the trigger for Phase A",
        "For a Qatari government agency, tailoring means mapping TOGAF onto the mandated GEA framework, its reference models and its governance roles"
      ]
    },

    {
      id: "A",
      code: "A",
      name: "Architecture Vision",
      tagline: "Set scope, engage stakeholders, create the vision and secure approval to proceed.",
      objectives: [
        "Develop a high-level aspirational vision of the capabilities and business value to be delivered as a result of the proposed Enterprise Architecture",
        "Obtain approval for a Statement of Architecture Work that defines a program of works to develop and deploy the architecture outlined in the Architecture Vision"
      ],
      inputs: [
        "Request for Architecture Work",
        "Business principles, business goals and business drivers",
        "Organizational Model for Enterprise Architecture",
        "Tailored Architecture Framework (method, content, configured tools)",
        "Populated Architecture Repository (existing architecture documentation, reference models, standards)",
        "Architecture Principles",
        "Capability Assessment",
        "Enterprise strategy and portfolio context"
      ],
      steps: [
        "Establish the architecture project",
        "Identify stakeholders, concerns and business requirements",
        "Confirm and elaborate business goals, business drivers and constraints",
        "Evaluate capabilities",
        "Assess readiness for business transformation",
        "Define scope",
        "Confirm and elaborate Architecture Principles, including business principles",
        "Develop Architecture Vision",
        "Define the Target Architecture value propositions and KPIs",
        "Identify the business transformation risks and mitigation activities",
        "Develop Statement of Architecture Work; secure approval"
      ],
      outputs: [
        "Approved Statement of Architecture Work (scope, plan, roles, acceptance criteria)",
        "Refined statements of business principles, goals and drivers",
        "Architecture Principles (confirmed)",
        "Capability Assessment",
        "Tailored Architecture Framework (refined for the engagement)",
        "Architecture Vision (problem description, objectives, summary views, value propositions, KPIs)",
        "Draft Architecture Definition Document (baseline/target at a high level for Business, Data, Application, Technology)",
        "Communications Plan",
        "Additional content populating the Architecture Repository"
      ],
      artifacts: [
        "Stakeholder Map matrix",
        "Value Chain diagram",
        "Solution Concept diagram",
        "Business Model diagram",
        "Business Capability map",
        "Value Stream map",
        "Driver/Goal/Objective catalog (initial)",
        "Requirements catalog (initial)"
      ],
      techniques: [
        "Stakeholder management (power/interest grid, concerns, communications)",
        "Business scenarios (to discover and document business requirements)",
        "Business Transformation Readiness Assessment",
        "Capability-based planning",
        "Risk management (initial and residual risk)",
        "Architecture Principles (confirmation and elaboration)"
      ],
      gtaExample: "<p><strong>Request for Architecture Work (illustrative wording).</strong> GTA leadership asks for a target architecture for <em>connected tax data and services</em>: Dhareeba, Tabadol, analytics and partner-agency exchanges should work as one landscape, and the planned <em>Dhareeba 2.0</em> should offer more pre-filled, end-to-end services. The baseline comes from the Current State Understanding Report (D1). The Digital Strategy's <em>Target State Design Report</em> (D2) and <em>Implementation Roadmap Report</em> (D3) are the authoritative strategic target and roadmap; this ADM cycle details them, maps them to GEA and governs their delivery.</p>" +
        "<p><strong>Stakeholders</strong> come from the report's department list and stakeholder groups: Taxpayer Services, Income Tax, Consumption Tax, Tax Revenues, Tax Treaties &amp; International Cooperation, Tax Policies, Legal Affairs, Planning &amp; Quality and IT; externally, taxpayers and tax agents, ministries and licensing authorities, banks, MCIT (owner of GDX and the National Authentication System) and international bodies. The <strong>business scenario</strong> builds on the report's four cross-cutting pain-point themes: data quality and manual reporting, manual processes, application functionality (Dhareeba and Tabadol enhancements, including UI/UX), and fragmented integrations. Examples include Dhareeba and Tabadol not being integrated, and pre-2020 taxpayer data in the legacy TAS system being hard to access.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> Vision KPIs are expressed in GEA BRM measurement areas so they can later be reported in GEA catalogues. Examples: <em>Revenue collection</em> (Operations efficiency), <em>Customer satisfaction</em> and <em>Customer usage</em> (Customer relationship), <em>Information quality</em> (ICT), <em>Service responsiveness</em> (Products and Services). Illustrative indicators include the share of returns submitted pre-filled and the share of management reports produced automatically. The GEA Governance Model requires every new IT investment to demonstrate alignment with the GEA reference models and to identify measurable KPIs. The Statement of Architecture Work is approved by the sponsor and reviewed by GTA's Technical Review Board before Phase B starts.</div>",
      pitfalls: [
        "Starting Phase B without an approved Statement of Architecture Work, leading to scope creep",
        "Writing a technology-centric vision (\"new portal\") instead of a business-outcome vision",
        "Missing key stakeholders (e.g., Legal Affairs, Tax Policies, MCIT or external data providers) who later block the target",
        "Skipping the readiness assessment and underestimating the organizational change required"
      ],
      keyPoints: [
        "Phase A is triggered by the Request for Architecture Work",
        "Its two objectives: a high-level Architecture Vision and an approved Statement of Architecture Work",
        "Business scenarios and the Business Transformation Readiness Assessment are signature techniques of Phase A",
        "Phase A produces a draft Architecture Definition Document and the Communications Plan"
      ]
    },

    {
      id: "B",
      code: "B",
      name: "Business Architecture",
      tagline: "Describe how the enterprise must operate to achieve its goals and respond to its drivers.",
      objectives: [
        "Develop the Target Business Architecture that describes how the enterprise needs to operate to achieve the business goals, respond to the strategic drivers set out in the Architecture Vision, and address the Request for Architecture Work and stakeholder concerns",
        "Identify candidate Architecture Roadmap components based upon gaps between the Baseline and Target Business Architectures"
      ],
      inputs: [
        "Request for Architecture Work",
        "Business principles, business goals and business drivers",
        "Capability Assessment",
        "Communications Plan",
        "Organizational Model for Enterprise Architecture and Tailored Architecture Framework",
        "Approved Statement of Architecture Work",
        "Architecture Principles, including business principles",
        "Enterprise Continuum and Architecture Repository (reference models, existing business architecture)",
        "Architecture Vision and draft Architecture Definition Document",
        "Draft Architecture Requirements Specification"
      ],
      steps: [
        "Select reference models, viewpoints and tools",
        "Develop Baseline Business Architecture Description",
        "Develop Target Business Architecture Description",
        "Perform gap analysis",
        "Define candidate roadmap components",
        "Resolve impacts across the Architecture Landscape",
        "Conduct formal stakeholder review",
        "Finalize the Business Architecture",
        "Create the Architecture Definition Document"
      ],
      outputs: [
        "Refined and updated versions of the Phase A deliverables (Statement of Architecture Work, principles, Architecture Vision)",
        "Draft Architecture Definition Document: Baseline and Target Business Architecture, business views addressing stakeholder concerns",
        "Draft Architecture Requirements Specification: gap analysis results, technical requirements, updated business requirements",
        "Business Architecture components of an Architecture Roadmap"
      ],
      artifacts: [
        "Organization/Actor catalog",
        "Driver/Goal/Objective catalog",
        "Role catalog",
        "Business Service/Function catalog",
        "Location catalog",
        "Process/Event/Control/Product catalog",
        "Contract/Measure catalog",
        "Business Capabilities catalog",
        "Value Stream catalog / Value Stream Stages catalog",
        "Business Interaction matrix",
        "Actor/Role matrix",
        "Value Stream/Capability matrix",
        "Strategy/Capability matrix",
        "Capability/Organization matrix",
        "Business Footprint diagram",
        "Business Service/Information diagram",
        "Functional Decomposition diagram",
        "Product Lifecycle diagram",
        "Goal/Objective/Service diagram",
        "Business Use-Case diagram",
        "Organization Decomposition diagram",
        "Process Flow diagram",
        "Event diagram",
        "Business Capability map",
        "Value Stream map",
        "Organization map"
      ],
      techniques: [
        "Business capability modelling and capability-based planning",
        "Value stream mapping",
        "Business scenarios",
        "Gap analysis",
        "Stakeholder management (viewpoints and views)",
        "Information mapping and organization mapping",
        "Process modelling"
      ],
      gtaExample: "<p><strong>Reference model selected: GEA BRM.</strong> GTA's tax services classify under BRM domain <em>14 Revenue Management</em>, functional area <em>14.1 Taxes</em> (\"controlling the taxes paid by businesses and individuals\", including income tax and levies). BRM area <em>1.2 Business Support</em> also lists \"tax services\" among the support activities for businesses. GTA records its own services under these functional areas in an agency <strong>services catalogue</strong>. Each service carries a GEA <em>e-service maturity</em> value: Informative, Interactive, Transactional or Integrated.</p>" +
        "<ul><li><strong>Customer profiles</strong> by GEA consumer type: G2B (companies and tax agents), G2C (individual taxpayers), G2G (ministries, licensing authorities and foreign tax administrations) and G2E (GTA employees).</li>" +
        "<li><strong>Channel catalogue</strong> from the baseline: the Dhareeba portal (Web), GTA mobile apps (Mobile App), the Gov. Call Center (Contact Center), email, SMS gateway and social media. The BRM requires agencies to adopt and reuse WoG delivery channels, such as the Qatar Government Contact Center.</li>" +
        "<li><strong>Matrices:</strong> a Delivery Channel/Service matrix and a Customer/Delivery Channel/Service matrix, which are the GEA equivalents of TOGAF's Business Interaction and Actor/Role views.</li>" +
        "<li><strong>KPIs</strong> mapped to BRM measurement areas, e.g., <em>Revenue collection</em> under Operations efficiency, and <em>Regulatory compliance</em> under Compliance, Governance &amp; Legal.</li></ul>" +
        "<p>Alongside the GEA catalogues, the architect builds a TOGAF <strong>Business Capability map</strong> from the department mandates in the report (illustrative Level 1: Registration, Returns &amp; Declarations, Assessment, Payment &amp; Collection, Refunds, Disputes &amp; Appeals, Inspection &amp; Evasion Investigation, Exchange of Information, Tax Policy Research, Taxpayer Support, Revenue Reporting &amp; Analytics). A <strong>value stream</strong> <em>Declare Tax Liability</em> (Prepare &gt; Submit &gt; Validate &gt; Assess &gt; Notify) is cross-mapped to capabilities and owning units, e.g., Income Tax for corporate income tax assessment and Tax Revenues for collection.</p>" +
        "<p><strong>Gap analysis</strong> confirms gaps named in the report: no case management for legal cases and MAP disputes, and limited executive dashboards and self-service reporting. It adds an illustrative target gap: moving key services from <em>Transactional</em> to <em>Integrated</em> maturity by pre-filling them with partner-agency data. These become candidate roadmap components.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> Capabilities are stable (the <em>what</em>), while units, processes and systems change (the <em>how</em>). The GEA services, channel and customer catalogues are not extra paperwork. GTA must publish them to the ministry periodically, and they score in the BRM section (weight 20) of the GEA self-assessment.</div>",
      pitfalls: [
        "Confusing capabilities with processes or with organization units",
        "Modelling the baseline in exhaustive detail while leaving the target vague",
        "Producing diagrams that answer no stakeholder concern (views without viewpoints)",
        "Ignoring legal and policy constraints (tax law, data protection) when designing the target"
      ],
      keyPoints: [
        "Phases B, C and D share the same generic nine-step pattern, from 'select reference models, viewpoints and tools' to 'create the Architecture Definition Document'",
        "Business Architecture is usually developed first because it demonstrates business value and provides requirements for the other domains",
        "Gap analysis outputs feed candidate Architecture Roadmap components",
        "Business capabilities, value streams and organization maps are core Business Architecture techniques in TOGAF 10",
        "At GTA, the GEA BRM is the reference model selected in step 1 (taxonomy, consumer types, channel types, measurement areas)"
      ]
    },

    {
      id: "C",
      code: "C",
      name: "Information Systems Architectures",
      tagline: "Define the Data and Application Architectures that enable the Business Architecture.",
      objectives: [
        "Develop the Target Information Systems Architecture (Data and Application), describing how the enterprise's Information Systems Architecture will enable the Business Architecture and the Architecture Vision, in a way that addresses the Request for Architecture Work and stakeholder concerns",
        "Identify candidate Architecture Roadmap components based upon gaps between the Baseline and Target Information Systems (Data and Application) Architectures"
      ],
      inputs: [
        "Request for Architecture Work and approved Statement of Architecture Work",
        "Capability Assessment and Communications Plan",
        "Organizational Model for EA and Tailored Architecture Framework",
        "Data principles and application principles (if existing)",
        "Architecture Repository: reference models (e.g., data models, application reference models), existing data and application architecture",
        "Architecture Vision",
        "Draft Architecture Definition Document (Baseline and Target Business Architecture)",
        "Draft Architecture Requirements Specification (business requirements, gap analysis results)",
        "Business Architecture components of an Architecture Roadmap"
      ],
      steps: [
        "Select reference models, viewpoints and tools (for both Data and Application Architecture)",
        "Develop Baseline Data Architecture Description and Baseline Application Architecture Description",
        "Develop Target Data Architecture Description and Target Application Architecture Description",
        "Perform gap analysis (data and application)",
        "Define candidate roadmap components (data and application)",
        "Resolve impacts across the Architecture Landscape",
        "Conduct formal stakeholder review",
        "Finalize the Data Architecture and the Application Architecture",
        "Create the Architecture Definition Document (Data and Application sections)"
      ],
      outputs: [
        "Refined and updated versions of the Phase A and B deliverables",
        "Draft Architecture Definition Document: Baseline and Target Data Architecture and Baseline and Target Application Architecture, with views addressing stakeholder concerns",
        "Draft Architecture Requirements Specification: gap analysis results, data and application interoperability requirements, relevant technical requirements, constraints on the Technology Architecture, updated business requirements",
        "Information Systems (Data and Application) components of an Architecture Roadmap"
      ],
      artifacts: [
        "Data Entity/Data Component catalog",
        "Data Entity/Business Function matrix",
        "Application/Data matrix",
        "Conceptual Data diagram",
        "Logical Data diagram",
        "Data Dissemination diagram",
        "Data Security diagram",
        "Data Migration diagram",
        "Data Lifecycle diagram",
        "Application Portfolio catalog",
        "Interface catalog",
        "Application/Organization matrix",
        "Role/Application matrix",
        "Application/Function matrix",
        "Application Interaction matrix",
        "Application Communication diagram",
        "Application and User Location diagram",
        "Application Use-Case diagram",
        "Enterprise Manageability diagram",
        "Process/Application Realization diagram",
        "Software Engineering diagram",
        "Application Migration diagram",
        "Software Distribution diagram"
      ],
      techniques: [
        "Gap analysis",
        "Interoperability requirements (information and application interoperability)",
        "Data modelling (conceptual, logical, physical) and data lifecycle management",
        "Master data and data governance practices",
        "Application portfolio rationalisation",
        "Architecture alternatives and trade-offs",
        "Stakeholder management (viewpoints and views)"
      ],
      gtaExample: "<p><strong>Data Architecture, using the GEA IRM.</strong> GTA builds an <em>Information Assets Catalogue</em> classified against the IRM taxonomy, with a named steward for each asset. Illustrative assignments: tax returns, assessments and tax accounts under <em>1.02.02.03 Tax</em>; penalties under <em>1.02.02.06 Penalty</em>; tax treaties and exchange agreements under <em>1.02.06.04 Agreement</em>; taxpayers under <em>2.01.01.02 Organizations</em> and <em>2.01.01.01 Individual</em>; disputes and MAP cases under <em>3.02 Cases</em>. A Business Service/Information matrix links each GTA service to the assets it uses, which plays the role of TOGAF's Data Entity/Business Function matrix.</p>" +
        "<p><strong>Data baseline (from the report):</strong> SAP BW is the warehouse for SAP data and Azure Synapse for non-SAP workloads, with Power BI for visualisation. There is no formal data strategy, a data classification project is in progress, and manual reporting is still common. Historical taxpayer data is split between the legacy <strong>TAS</strong> system and Dhareeba, so a TOGAF <em>Data Migration diagram</em> is needed for pre-2020 data. The OECD Pillar Two Global Information Return (GIR) schema has to be supported in Tabadol by 2027.</p>" +
        "<p><strong>Application Architecture, using the GEA ARM.</strong> The baseline <em>Application Catalogue</em> is classified against the ARM taxonomy. The applications are taken from the report; their category assignments are illustrative.</p>" +
        "<ul><li><strong>Dhareeba</strong> (SAP TRM): GTA's core tax and revenue management system, used by taxpayers, employees and tax agents. ARM category: 1.3 Specialist Line of Business Applications.</li>" +
        "<li><strong>Tabadol</strong> (NewGen): exchange of information with foreign and external parties (FATCA and CRS). ARM category: 1.3.</li>" +
        "<li><strong>Tax Support Management</strong>: case management for Dhareeba tickets. ARM category: 1.2.3 Customer Relationship Management.</li>" +
        "<li><strong>Enterprise content management and analytics</strong>: ARM categories 1.1.6 and 1.1.3.</li>" +
        "<li><strong>Mandated government applications</strong>: Mawared (HR), Maliya (finance) and Tawasul (communications).</li></ul>" +
        "<p>A <em>Shared Service/Application matrix</em> records which WoG shared services GTA applications use: <strong>National Authentication</strong> for login, the <strong>payment gateway</strong> integrated with Dhareeba, and <strong>GDX</strong>, which already connects Dhareeba with MoI. A <em>Business Service/Information Asset/Application matrix</em> completes the traceability.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> The integration gap is the headline finding. All internal application integrations are point-to-point, there is no internal middleware or integration platform, Dhareeba and Tabadol are not integrated, and most external integrations are point-to-point APIs, with Tabadol exchanging files with international jurisdictions. The target, which D2 details, follows GEA: inter-agency exchange via <strong>GDX</strong> wherever the partner is connected, and an internal integration platform that covers at least the GEA <em>intra-agency information exchange architecture</em> (developer portal and API catalogue, service gateway, mediation, registry, monitoring and logging).</div>",
      pitfalls: [
        "Designing applications before agreeing on data ownership and data definitions",
        "Treating Phase C as a product selection exercise rather than defining logical components first",
        "Ignoring data migration and data quality effort, which often dominate the transition cost",
        "Leaving interfaces undocumented, so the integration landscape becomes point-to-point spaghetti"
      ],
      keyPoints: [
        "Phase C is named Information Systems Architectures and covers both Data Architecture and Application Architecture",
        "Data and Application Architecture may be developed in either order or in parallel",
        "Phase C outputs include constraints on the Technology Architecture that feed Phase D",
        "Logical components (vendor-neutral) come before physical components (product-specific)",
        "At GTA, the GEA IRM (information taxonomy, GDX exchange architecture) and ARM (application taxonomy, shared services) are the reference models for Phase C"
      ]
    },

    {
      id: "D",
      code: "D",
      name: "Technology Architecture",
      tagline: "Define the technology platforms and services that host and connect data and applications.",
      objectives: [
        "Develop the Target Technology Architecture that enables the logical and physical application and data components and the Architecture Vision, addressing the Request for Architecture Work and stakeholder concerns",
        "Identify candidate Architecture Roadmap components based upon gaps between the Baseline and Target Technology Architectures"
      ],
      inputs: [
        "Request for Architecture Work and approved Statement of Architecture Work",
        "Capability Assessment and Communications Plan",
        "Organizational Model for EA and Tailored Architecture Framework",
        "Technology principles (if existing)",
        "Architecture Repository: technology reference models, Standards Information Base, existing technology architecture",
        "Architecture Vision",
        "Draft Architecture Definition Document (Baseline and Target Business, Data and Application Architectures)",
        "Draft Architecture Requirements Specification (including constraints on the Technology Architecture)",
        "Business, Data and Application components of an Architecture Roadmap"
      ],
      steps: [
        "Select reference models, viewpoints and tools",
        "Develop Baseline Technology Architecture Description",
        "Develop Target Technology Architecture Description",
        "Perform gap analysis",
        "Define candidate roadmap components",
        "Resolve impacts across the Architecture Landscape",
        "Conduct formal stakeholder review",
        "Finalize the Technology Architecture",
        "Create the Architecture Definition Document"
      ],
      outputs: [
        "Refined and updated versions of the Phase A, B and C deliverables",
        "Draft Architecture Definition Document: Baseline and Target Technology Architecture, views addressing stakeholder concerns",
        "Draft Architecture Requirements Specification: gap analysis results, requirements output from Phases B and C, updated technology requirements",
        "Technology components of an Architecture Roadmap"
      ],
      artifacts: [
        "Technology Standards catalog",
        "Technology Portfolio catalog",
        "Application/Technology matrix",
        "Environments and Locations diagram",
        "Platform Decomposition diagram",
        "Processing diagram",
        "Networked Computing/Hardware diagram",
        "Network and Communications diagram"
      ],
      techniques: [
        "Gap analysis",
        "Interoperability requirements (technical interoperability)",
        "Architecture alternatives and trade-offs (e.g., hosting options, build vs buy)",
        "Use of technology reference models and the Standards Information Base",
        "Risk management (security, availability, obsolescence)",
        "Capacity and non-functional requirements analysis"
      ],
      gtaExample: "<p><strong>Reference model selected: the GEA Infrastructure (Technical) Reference Model.</strong> GTA builds an <em>Infrastructure Assets Catalogue</em> classified by the GEA infrastructure taxonomy (e.g., 1 Hybrid IT Infrastructure: IaaS, PaaS, SaaS; 2 Connectivity; 3 Facilities: Data Center; 5 End-User Equipment). It also builds an <em>Application/Infrastructure matrix</em>, which corresponds to TOGAF's Application/Technology matrix. The baseline from the report:</p>" +
        "<ul><li><strong>Azure West Europe, primary:</strong> core production (SAP S/4HANA, BW/4HANA, SAP Portal/Fiori, Dhareeba non-SAP applications) and the prod, dev, QA, pre-prod and sandbox environments.</li>" +
        "<li><strong>Azure North Europe, DR:</strong> Dhareeba DR resources, directory and monitoring.</li>" +
        "<li><strong>Meeza data centre (Qatar, on-premises):</strong> IT and security tooling, virtualisation and backup.</li>" +
        "<li><strong>Connectivity:</strong> the GTA building connects through the MCIT <em>Government Network</em> WAN, with private connectivity to Azure.</li></ul>" +
        "<p><strong>Gaps</strong> named in the report:</p>" +
        "<ul><li>There is no formal multi-cloud strategy.</li>" +
        "<li>Service differences between the European Azure regions and Azure <em>Qatar Central</em>, which is under consideration, may cause migration rework.</li>" +
        "<li>There is no formal IT disaster recovery and business continuity strategy, and Dhareeba DR testing and documentation are insufficient.</li>" +
        "<li>DR failover depends on external entities (e.g., authentication via MCIT).</li>" +
        "<li>Infrastructure licence renewals and the Meeza hardware refresh fall in 2025.</li></ul>" +
        "<p><strong>GEA constraints for the target:</strong> the <em>Government Data Center</em> and <em>Government Network</em> are existing WoG shared services that must be considered before agency-specific options, as Resolution 18/2010 requires. Cloud choices are assessed with the GEA <em>Cloud security policy</em> questionnaire for cloud service providers and the TRM cloud infrastructure standards and controls. End-user devices follow the <em>BYOD policy</em>, which is mandatory for government entities.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> GEA standards are categorised as mandatory, recommended or optional. GTA records the applicable ones in its Standards Information Base so that every project and vendor works from the same reference set. Security is designed across five generic layers: shared security services, users, devices, applications and data, and network. The hosting, multi-cloud and DR target decisions belong to D2/D3 and are not prejudged here.</div>",
      pitfalls: [
        "Choosing products first and retro-fitting the architecture around them",
        "Under-designing for peak periods such as filing deadlines",
        "Ignoring operational and support requirements (monitoring, patching, skills)",
        "Not recording standards in the SIB, so each project reinvents its own"
      ],
      keyPoints: [
        "Phase D follows the same generic step pattern as Phases B and C",
        "Phase D enables the logical and physical application and data components defined in Phase C",
        "Typical Phase D artifacts include the Technology Standards catalog and Technology Portfolio catalog",
        "Technology standards selected should be recorded in the Standards Information Base",
        "Do not confuse TOGAF's Technical Reference Model (a foundation architecture) with the GEA TRM (a taxonomy for classifying government infrastructure assets)"
      ]
    },

    {
      id: "E",
      code: "E",
      name: "Opportunities & Solutions",
      tagline: "Consolidate gaps into work packages and Transition Architectures; produce the first roadmap.",
      objectives: [
        "Generate the initial complete version of the Architecture Roadmap, based upon the gap analysis and candidate Architecture Roadmap components from Phases B, C and D",
        "Determine whether an incremental approach is required, and if so identify Transition Architectures that will deliver continuous business value",
        "Define the overall Solution Building Blocks to finalize the Target Architecture based on the Architecture Building Blocks"
      ],
      inputs: [
        "Product information and candidate solutions",
        "Request for Architecture Work and Statement of Architecture Work",
        "Capability Assessment and Communications Plan",
        "Planning methodologies and governance models/frameworks (PPM, budgeting, procurement)",
        "Architecture Repository (re-usable building blocks, standards)",
        "Draft Architecture Definition Document (Business, Data, Application, Technology)",
        "Draft Architecture Requirements Specification (gap analysis results, architectural and interoperability requirements)",
        "Change Requests for existing programs and projects",
        "Candidate Architecture Roadmap components from Phases B, C and D"
      ],
      steps: [
        "Determine/confirm key corporate change attributes",
        "Determine business constraints for implementation",
        "Review and consolidate gap analysis results from Phases B to D",
        "Review consolidated requirements across related business functions",
        "Consolidate and reconcile interoperability requirements",
        "Refine and validate dependencies",
        "Confirm readiness and risk for business transformation",
        "Formulate Implementation and Migration Strategy",
        "Identify and group major work packages",
        "Identify Transition Architectures",
        "Create the Architecture Roadmap and Implementation and Migration Plan"
      ],
      outputs: [
        "Refined and updated version of the Architecture Vision, Architecture Definition Document and Architecture Requirements Specification",
        "Architecture Roadmap (work package portfolio, Transition Architectures, implementation recommendations)",
        "Draft Implementation and Migration Plan (initial)",
        "Capability Assessment (refined)",
        "Transition Architecture definitions",
        "Implementation and Migration Strategy",
        "Consolidated Gaps, Solutions and Dependencies matrix"
      ],
      artifacts: [
        "Project Context diagram",
        "Benefits diagram",
        "Consolidated Gaps, Solutions and Dependencies matrix",
        "Implementation Factor Assessment and Deduction matrix",
        "Transition Architecture State Evolution table",
        "Architecture Definition Increments table",
        "Requirements catalog (updated)"
      ],
      techniques: [
        "Gap analysis (consolidation)",
        "Interoperability requirements (reconciliation)",
        "Business Transformation Readiness Assessment",
        "Risk management",
        "Migration planning techniques (Implementation Factor Assessment and Deduction matrix, Consolidated Gaps/Solutions/Dependencies matrix, Architecture Definition Increments table, Transition Architecture State Evolution table)",
        "Capability-based planning",
        "Architecture alternatives and trade-offs"
      ],
      gtaExample: "<p>The architect consolidates gaps from B, C and D into a Consolidated Gaps, Solutions and Dependencies matrix. GTA does not invent its roadmap here. The real target and roadmap sources are the Digital Strategy's <strong>Target State Design Report (D2)</strong> and <strong>Implementation Roadmap Report (D3)</strong>, and Phase E reconciles the architecture gaps with them. The key considerations already recorded in D1 give the main work-package themes:</p>" +
        "<ul><li>Integration platform, with an integration strategy and blueprint</li>" +
        "<li>Data management strategy, data quality plan and automated reporting</li>" +
        "<li>Dhareeba 2.0 enhancements and rationalisation of the many SharePoint applications</li>" +
        "<li>GRC and PMO/project management tooling</li>" +
        "<li>IT disaster recovery and business continuity (business impact analysis, risk assessment, DR plans, regular testing), multi-cloud strategy and cloud governance</li>" +
        "<li>The EA capability itself (EA Office, governance committee charters)</li></ul>" +
        "<p>Because GTA cannot absorb a 'big bang' change during filing seasons, three <strong>Transition Architectures</strong> are sketched (illustrative, to be aligned with D3):</p>" +
        "<ul><li><strong>TA1 - Foundations:</strong> integration platform, data governance and classification, IT DR and business continuity.</li>" +
        "<li><strong>TA2 - Connected data:</strong> Dhareeba-Tabadol integration, partner exchanges moved onto GDX where available, migration or access path for legacy TAS data.</li>" +
        "<li><strong>TA3 - Dhareeba 2.0 services:</strong> pre-filled, <em>Integrated</em>-maturity e-services and automated executive reporting.</li></ul>" +
        "<div class=\"callout gta\"><b>At GTA</b> Before an Architecture Building Block becomes a Solution Building Block, it is checked against GEA: does a WoG shared service already provide it (GDX, National Authentication, payment gateway, Government Data Center, Government Network)? Each Transition Architecture must still deliver standalone value. For example, TA1 alone reduces point-to-point integrations and DR risk, even if TA3 is delayed.</div>",
      pitfalls: [
        "Defining Transition Architectures that deliver no business value on their own",
        "Overlooking dependencies on external entities (data-sharing agreements, national platforms)",
        "Ignoring business constraints such as filing calendars, budget cycles and procurement lead times",
        "Selecting solutions (SBBs) before the ABBs and requirements are stable"
      ],
      keyPoints: [
        "Phase E is the first phase directly concerned with implementation: it creates the initial complete Architecture Roadmap",
        "Phase E decides whether an incremental approach with Transition Architectures is needed",
        "Work packages are identified and grouped in Phase E",
        "Phase E defines the overall Solution Building Blocks based on the Architecture Building Blocks"
      ]
    },

    {
      id: "F",
      code: "F",
      name: "Migration Planning",
      tagline: "Finalize the roadmap and a costed, prioritized Implementation and Migration Plan.",
      objectives: [
        "Finalize the Architecture Roadmap and the supporting Implementation and Migration Plan",
        "Ensure that the Implementation and Migration Plan is coordinated with the enterprise's approach to managing and implementing change in the enterprise's overall change portfolio",
        "Ensure that the business value and cost of work packages and Transition Architectures is understood by key stakeholders"
      ],
      inputs: [
        "Request for Architecture Work and Statement of Architecture Work",
        "Capability Assessment and Communications Plan",
        "Organizational Model for EA and governance models/frameworks (PPM, budgeting, operations management)",
        "Architecture Vision",
        "Architecture Definition Document and Architecture Requirements Specification",
        "Architecture Roadmap (from Phase E)",
        "Draft Implementation and Migration Plan",
        "Transition Architectures",
        "Change Requests for existing programs and projects"
      ],
      steps: [
        "Confirm management framework interactions for the Implementation and Migration Plan",
        "Assign a business value to each work package",
        "Estimate resource requirements, project timings and availability/delivery vehicle",
        "Prioritize the migration projects through the conduct of a cost/benefit assessment and risk validation",
        "Confirm Architecture Roadmap and update Architecture Definition Document",
        "Complete the Implementation and Migration Plan",
        "Complete the architecture development cycle and document lessons learned"
      ],
      outputs: [
        "Final Implementation and Migration Plan",
        "Finalized Architecture Definition Document (including fully detailed Transition Architectures)",
        "Finalized Architecture Requirements Specification",
        "Finalized Architecture Roadmap",
        "Re-usable Architecture Building Blocks",
        "Requests for Architecture Work for a new ADM cycle (if any)",
        "Implementation Governance Model",
        "Change Requests for the Architecture Capability arising from lessons learned"
      ],
      artifacts: [
        "Project Context diagram",
        "Benefits diagram",
        "Business Value assessment matrix (value vs risk)",
        "Implementation Factor Assessment and Deduction matrix (updated)",
        "Architecture Roadmap timeline view"
      ],
      techniques: [
        "Migration planning techniques",
        "Business value assessment (value index vs risk index)",
        "Capability-based planning",
        "Risk management (risk validation)",
        "Cost/benefit analysis",
        "Business Transformation Readiness Assessment (confirmation)"
      ],
      gtaExample: "<p>The Implementation and Migration Plan has to fit GTA's real portfolio. In 2025 the report counted 38 planned or ongoing IT projects, with no annual portfolio planning, an informal PMO (monthly project meetings) and no PMO tool. Phase F therefore also defines the portfolio interface. Planning &amp; Quality, whose mandate includes PMO oversight, RFP review and change-request impact assessment, receives the architecture's work packages and dependencies. D3 (Implementation Roadmap) remains the master sequence.</p>" +
        "<p>Each work package is scored on business value and on risk (technical complexity, dependency on partner entities and MCIT, change impact on staff). Business value is expressed as BRM-aligned KPIs, because the GEA Governance Model requires investment requests to demonstrate alignment with the GEA reference models and to state measurable KPIs. Projects above 500K need the IT procurement committee's approval (GEA Governance Model, Figure 2; the currency is not stated). Foundations (TA1) go first because TA2 and TA3 depend on them, and go-lives are scheduled outside filing peaks.</p>" +
        "<p>The <strong>Implementation Governance Model</strong> uses GEA's structure. Each project gets a <em>Design Authority</em> (project management, lead architect and the agency enterprise architect), the Design Authority attends GTA's <em>Technical Review Board</em> checkpoints, and exceptions follow the GEA escalation path.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> Lessons learned from this cycle (illustrative: 'start GDX onboarding with partner agencies and MCIT earlier') are fed back as Change Requests to the Architecture Capability, closing the loop with the Preliminary phase.</div>",
      pitfalls: [
        "Producing a roadmap that is disconnected from the actual budget and portfolio process",
        "Prioritizing by technical convenience rather than business value and risk",
        "Underestimating resources and skills, especially for data migration and testing",
        "Skipping the lessons-learned step at the end of the cycle"
      ],
      keyPoints: [
        "Phase F finalizes the Architecture Roadmap and the Implementation and Migration Plan",
        "Phase F coordinates with the enterprise's portfolio, project and budgeting frameworks",
        "Each work package is assigned a business value; projects are prioritized by cost/benefit and risk",
        "The Implementation Governance Model is an output of Phase F"
      ]
    },

    {
      id: "G",
      code: "G",
      name: "Implementation Governance",
      tagline: "Ensure implementation projects conform to the Target Architecture.",
      objectives: [
        "Ensure conformance with the Target Architecture by implementation projects",
        "Perform appropriate Architecture Governance functions for the solution and any implementation-driven architecture Change Requests"
      ],
      inputs: [
        "Request for Architecture Work and Statement of Architecture Work",
        "Capability Assessment and Organizational Model for EA",
        "Tailored Architecture Framework",
        "Architecture Vision, Architecture Definition Document and Architecture Requirements Specification",
        "Architecture Roadmap and Transition Architectures",
        "Implementation Governance Model",
        "Architecture Contract (draft)",
        "Request for Architecture Work identified in Phases E and F",
        "Implementation and Migration Plan"
      ],
      steps: [
        "Confirm scope and priorities for deployment with development management",
        "Identify deployment resources and skills",
        "Guide development of solutions deployment",
        "Perform Enterprise Architecture compliance reviews",
        "Implement business and IT operations",
        "Perform post-implementation review and close the implementation"
      ],
      outputs: [
        "Architecture Contract (signed)",
        "Compliance Assessments",
        "Change Requests",
        "Architecture-compliant solutions deployed (implemented system, populated Architecture Repository, recommendations and dispensations, updated SLAs, implementation-specific documentation)"
      ],
      artifacts: [
        "Architecture Contract",
        "Compliance Assessment (with compliance checklists)",
        "Dispensation records in the Governance Log",
        "Updated Solutions Landscape entries",
        "Post-implementation review report"
      ],
      techniques: [
        "Architecture compliance reviews (checklists, levels of conformance)",
        "Architecture Contracts",
        "Dispensation management",
        "Risk management",
        "Stakeholder management and communications"
      ],
      gtaExample: "<p><strong>GEA's compliance mechanism.</strong> GEA uses <em>Design Authorities</em> and the next-gen service delivery method checkpoints to enforce compliance with the enterprise architecture. Every new solution has a Design Authority (project management, the lead architect, and the agency enterprise architect as a member). The Design Authority takes part in the checkpoint reviews that GTA's <strong>Technical Review Board</strong> conducts at <strong>Discovery, Alpha, Beta and Live</strong>. At each checkpoint it demonstrates alignment to GEA, the shared services leveraged, the cross-agency information assets leveraged and compliance with standards. In TOGAF terms, these checkpoints are GTA's <em>compliance reviews</em>, and the Design Authority's commitments form the <em>Architecture Contract</em>.</p>" +
        "<p><strong>Vendors.</strong> Every GTA ICT tender, including the Digital Strategy's D4 RFP packages, carries the GEA tender clause verbatim: <em>\"Vendors shall ensure that the proposed solution for the tender requirements comply with the reference architecture and standards prescribed as part of the Qatar Government Enterprise Architecture (GEA) reference models and standards as applicable. They may use the GEA self-assessment template to assess and report their compliance to the relevant authorities\"</em>. The vendor's lead or solution architect can fill the project lead architect role, which makes the Architecture Contract enforceable through the commercial contract.</p>" +
        "<p><strong>Example (illustrative).</strong> At the Beta checkpoint for the integration platform, the review finds a new point-to-point file interface to a partner ministry that is already connected to GDX. The design is rated <em>Non-conformant</em> against the Interoperable principle and the IRM information exchange architecture. The team either redesigns to use GDX, or the Design Authority raises an exception to the TRB. A time-bound, low-impact exception is decided by the TRB itself and recorded in the Governance Log; in TOGAF terms this is a dispensation.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> Project-level statements of the GEA self-assessment (e.g., \"Is the project leveraging applicable shared services provided at WoG level?\") make good checkpoint checklists. Planning &amp; Quality can use the results as evidence for its process quality assurance and RFP review mandate.</div>",
      pitfalls: [
        "Treating compliance reviews as a late, one-time gate instead of continuous checkpoints",
        "Architecture Contracts that are not referenced in procurement or vendor contracts",
        "Granting dispensations without expiry dates or follow-up",
        "Architects disengaging after design, leaving delivery teams to interpret the architecture alone"
      ],
      keyPoints: [
        "Phase G ensures implementation projects conform to the Target Architecture",
        "The Architecture Contract is the key governance instrument between architecture and implementation",
        "Compliance reviews assess conformance using defined levels (Irrelevant to Fully Conformant, or Non-conformant)",
        "A dispensation is a time-bound, governed exception to architecture compliance",
        "In GEA terms, Design Authorities and the TRB checkpoints (Discovery, Alpha, Beta, Live) are the compliance mechanism, and the tender clause extends it to vendors"
      ]
    },

    {
      id: "H",
      code: "H",
      name: "Architecture Change Management",
      tagline: "Keep the architecture relevant; manage change to the architecture and the capability.",
      objectives: [
        "Ensure that the architecture lifecycle is maintained",
        "Ensure that the Architecture Governance Framework is executed",
        "Ensure that the enterprise Architecture Capability meets current requirements"
      ],
      inputs: [
        "Request for Architecture Work and Statement of Architecture Work",
        "Organizational Model for EA and Tailored Architecture Framework",
        "Architecture Vision, Architecture Definition Document, Architecture Requirements Specification",
        "Architecture Roadmap and Transition Architectures",
        "Implementation Governance Model",
        "Architecture Contract (signed)",
        "Compliance Assessments",
        "Implementation and Migration Plan",
        "Change Requests due to technology changes, business changes or lessons learned"
      ],
      steps: [
        "Establish value realization process",
        "Deploy monitoring tools",
        "Manage risks",
        "Provide analysis for architecture change management",
        "Develop change requirements to meet performance targets",
        "Manage governance process",
        "Activate the process to implement change"
      ],
      outputs: [
        "Architecture updates (for maintenance changes)",
        "Changes to the architecture framework and principles",
        "New Request for Architecture Work, to initiate another ADM cycle",
        "Statement of Architecture Work (updated if necessary)",
        "Architecture Contract (updated if necessary)",
        "Compliance Assessments (updated if necessary)"
      ],
      artifacts: [
        "Change Request register",
        "Requirements Impact Assessment",
        "Value realization / KPI dashboard",
        "Governance Log entries (decisions, dispensations and exceptions, Architecture Board minutes - at GTA, TRB minutes)"
      ],
      techniques: [
        "Change classification: simplification change (normally handled by change management), incremental change (may be handled by change management or partial re-architecting), re-architecting change (requires a new ADM cycle)",
        "Risk management",
        "Value realization and performance measurement",
        "Stakeholder management",
        "Architecture maturity assessment (capability improvement)"
      ],
      gtaExample: "<p>After each transition goes live, value realization tracks the Phase A KPIs in their BRM measurement areas (e.g., Revenue collection, Customer satisfaction, Information quality). Change drivers are then classified the TOGAF way (the classifications below are illustrative):</p>" +
        "<ul><li>A new validation rule in Dhareeba requested by a tax department: a <em>simplification change</em>, handled through normal change management and the Change Advisory Board.</li>" +
        "<li>Supporting the OECD Pillar Two Global Information Return (GIR) schema in Tabadol by 2027: an <em>incremental change</em>, handled by partially re-running Phases B to D for the exchange-of-information scope.</li>" +
        "<li>The planned e-invoicing solution, or a decision to move workloads to Azure Qatar Central: a <em>re-architecting change</em> that triggers a new Request for Architecture Work and a new ADM cycle.</li></ul>" +
        "<p><strong>Exceptions follow GEA decision rights.</strong> A low-impact exception is authorised by GTA's <em>Technical Review Board</em>, a medium-impact one by the WoG <em>Architecture Review Board</em>, which is also the appeal point for compliance disputes, and a high-impact one by the <em>ICT Governance Board</em> (QDG Steering Committee). GEA does not define what makes an exception low, medium or high impact, so GTA's TRB charter has to set the criteria.</p>" +
        "<div class=\"callout gta\"><b>At GTA</b> Phase H is also where GTA keeps its GEA obligations current. It publishes its EA catalogues and matrices, aligned to the GEA taxonomies (PRM, BRM, IRM, ARM, TRM), to the ministry (MCIT, named MoTC in the GEA documents) on a periodic basis. It repeats the GEA self-assessment annually or on the ministry's request, and reports deviations. Changes to GEA itself, which the WoG ARB maintains and publishes, are change drivers in their own right.</div>",
      pitfalls: [
        "Letting the architecture go stale after delivery, so the repository no longer reflects reality",
        "Running a full ADM cycle for every minor change (or, conversely, none for major ones)",
        "Not measuring whether the promised value was realized",
        "Ignoring improvements to the Architecture Capability itself"
      ],
      keyPoints: [
        "Phase H ensures the architecture lifecycle is maintained and the governance framework executed",
        "Three change classes: simplification, incremental, re-architecting",
        "A re-architecting change results in a new Request for Architecture Work and a new ADM cycle",
        "Phase H also ensures the Architecture Capability meets current requirements"
      ]
    },

    {
      id: "RM",
      code: "RM",
      name: "Requirements Management",
      tagline: "The central, continuous process that manages architecture requirements across all phases.",
      objectives: [
        "Ensure that the Requirements Management process is sustained and operates for all relevant ADM phases",
        "Manage architecture requirements identified during any execution of the ADM cycle or a phase",
        "Ensure that relevant architecture requirements are available for use by each phase as the phase is executed"
      ],
      inputs: [
        "A populated Architecture Repository",
        "Organizational Model for EA and Tailored Architecture Framework",
        "Statement of Architecture Work",
        "Architecture Vision",
        "Architecture requirements, populating an Architecture Requirements Specification",
        "Requirements Impact Assessment",
        "Change Requests from Phase H and from implementation"
      ],
      steps: [
        "Identify/document requirements (in the ADM phase)",
        "Baseline requirements: determine priorities, confirm stakeholder buy-in, record in the Architecture Requirements Repository",
        "Monitor baseline requirements",
        "Identify changed requirements; remove, add or modify, and re-assess priorities",
        "Identify changed requirements and record priorities; identify and resolve conflicts; generate Requirements Impact Statements",
        "Assess impact of changed requirements on current and previous ADM phases",
        "Implement requirements arising from Phase H",
        "Update the Architecture Requirements Repository with information relating to the changes, including stakeholder views affected",
        "Implement change in the current phase",
        "Assess and revise gap analysis for past phases"
      ],
      outputs: [
        "Changed requirements",
        "Requirements Impact Assessment",
        "Updated Architecture Requirements Specification",
        "Updated Architecture Requirements Repository"
      ],
      artifacts: [
        "Requirements catalog",
        "Architecture Requirements Specification",
        "Requirements Impact Assessment",
        "Traceability matrix (driver/goal to requirement to building block)"
      ],
      techniques: [
        "Business scenarios (to identify requirements)",
        "Requirements prioritization and conflict resolution",
        "Impact assessment",
        "Traceability management",
        "Stakeholder management"
      ],
      gtaExample: "<p>Requirements from every phase are recorded in a single Architecture Requirements Repository. Each one has a unique ID, source, owner, priority, a trace to the driver or goal it serves, and a <strong>link to the GEA artefact</strong> it relates to: a BRM goal, KPI or measurement area, an IRM information asset code, an ARM or TRM category, or a GEA policy or standard. Examples (illustrative IDs):</p>" +
        "<ul><li><code>REQ-BUS-014</code> Pre-filled return data must show its source to the taxpayer (source: Taxpayer Services; GEA link: Customer centricity principle, BRM measurement area Customer relationship).</li>" +
        "<li><code>REQ-INT-031</code> Exchanges with partner agencies connected to GDX use GDX rather than point-to-point interfaces (source: GEA IRM, Resolution 18/2010; constraint).</li>" +
        "<li><code>REQ-SEC-007</code> Taxpayer authentication uses the National Authentication shared service (source: Resolution 18/2010, Qatar e-authentication framework; constraint).</li>" +
        "<li><code>REQ-DAT-022</code> Every new information asset is catalogued against the IRM taxonomy (e.g., 1.02.02.03 Tax), with a named steward and a classification (source: GEA Data Management Policy).</li></ul>" +
        "<div class=\"callout gta\"><b>At GTA</b> GEA self-assessment statements and GEA mandatory standards are themselves requirements. When GEA, a national policy or tax law changes, a Requirements Impact Assessment shows which catalogues, interfaces, Architecture Contracts and Transition Architectures are affected, before anyone changes code.</div>",
      pitfalls: [
        "Keeping requirements in scattered documents with no single repository or traceability",
        "Treating Requirements Management as a phase done once, rather than a continuous process",
        "Accepting changed requirements without impact assessment on earlier phases",
        "Mixing architecture requirements with detailed solution requirements without distinction"
      ],
      keyPoints: [
        "Requirements Management sits at the centre of the ADM and is continuous, not a sequential phase",
        "The ADM is requirements-driven; Requirements Management does not itself dispose of, address or prioritize requirements - that is done within the relevant ADM phases",
        "Requirements are stored in the Architecture Requirements Repository",
        "Changes are assessed through a Requirements Impact Assessment"
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* DOCUMENTATION STRUCTURE                                             */
  /* ------------------------------------------------------------------ */
  structure: {
    fundamental: [
      { t: "Introduction and Core Concepts", d: "Introduces the TOGAF Standard, Enterprise Architecture and its value, the structure of the documentation set, core concepts (ADM, Architecture Content, Enterprise Continuum, Architecture Repository, Architecture Capability), and definitions of key terms." },
      { t: "Architecture Development Method", d: "Describes the ADM: the Preliminary phase, Phases A to H and Requirements Management, with the objectives, approach, inputs, steps and outputs of each phase." },
      { t: "ADM Techniques", d: "Techniques used when applying the ADM: Architecture Principles, stakeholder management, architecture patterns, business scenarios, gap analysis, migration planning techniques, interoperability requirements, Business Transformation Readiness Assessment, risk management, capability-based planning, architecture alternatives and trade-offs." },
      { t: "Applying the ADM", d: "Guidance on adapting the ADM to context: iteration, applying the ADM at different levels of the enterprise (Strategic, Segment, Capability), architecture landscape partitioning, security and other domains, and integration with other frameworks and delivery approaches." },
      { t: "Architecture Content", d: "The Content Framework and Enterprise Metamodel: entities and relationships, catalogs, matrices and diagrams, Architecture Building Blocks and Solution Building Blocks, and typical deliverables." },
      { t: "Enterprise Architecture Capability and Governance", d: "How to establish and operate an Architecture Capability: Enterprise Continuum, Architecture Repository, Architecture Board, Architecture Compliance, Architecture Contracts, and Architecture Governance." }
    ],
    seriesGuides: [
      { t: "Business Architecture: Business Capabilities", d: "How to identify, model and use business capabilities and capability maps to support planning and analysis." },
      { t: "Business Architecture: Value Streams", d: "How to define value streams and value stream stages and cross-map them to business capabilities." },
      { t: "Business Architecture: Business Models", d: "Using business models (e.g., canvas-style models) to connect strategy to architecture." },
      { t: "Information Architecture: Customer Master Data Management", d: "Applying the TOGAF approach to master data management, with customer data as the reference domain." },
      { t: "Enabling Enterprise Agility", d: "How to use the TOGAF Standard to support agile enterprises and agile delivery at different levels." },
      { t: "Using the TOGAF Standard in the Digital Enterprise", d: "Positioning Enterprise Architecture practice to support digital transformation and digital operating models." },
      { t: "Integrating Risk and Security within a TOGAF Enterprise Architecture", d: "Embedding security architecture and risk management across ADM phases and the Content Framework." },
      { t: "A Practitioners' Approach to Developing Enterprise Architecture Following the TOGAF ADM", d: "Practical, step-by-step guidance and worked approaches for practitioners applying the ADM." },
      { t: "Architecture Project Management", d: "Managing architecture development work as a project, including planning and control of ADM engagements." },
      { t: "Government Reference Model", d: "A reference model describing the functions and services typical of government, useful for public-sector capability mapping." },
      { t: "Leader's Guide to Establishing and Evolving an EA Capability", d: "Guidance for leaders on setting up, positioning and maturing an Enterprise Architecture function." },
      { t: "Microservices Architecture", d: "Considerations for describing and governing microservices-based architectures using the TOGAF Standard." },
      { t: "Applying the TOGAF ADM using Agile Sprints", d: "How to run ADM work in time-boxed sprints with backlogs and incremental architecture deliverables." },
      { t: "Digital Technology Adoption: A Guide to Readiness Assessment and Roadmap Development", d: "Assessing readiness for adopting digital technologies and building adoption roadmaps." }
    ],
    library: "<p>The TOGAF Standard, 10th Edition separates the stable <strong>Fundamental Content</strong> (six documents) from the <strong>TOGAF Series Guides</strong>, which give practical, context-specific guidance and evolve faster. Both sit within the wider <strong>TOGAF Library</strong> maintained by The Open Group, which also holds white papers, case studies, reference models (such as the Technical Reference Model and the Integrated Information Infrastructure Reference Model, now published as Series Guides) and other resources. This modular structure lets organizations adopt the core method and pick only the guidance relevant to them.</p>"
  },

  /* ------------------------------------------------------------------ */
  /* ENTERPRISE CONTINUUM                                                */
  /* ------------------------------------------------------------------ */
  continuum: {
    architecture: [
      { t: "Foundation Architectures", d: "The most generic architectures: building blocks and services applicable to any IT environment. The TOGAF Technical Reference Model (TRM) is an example of a foundation architecture." },
      { t: "Common Systems Architectures", d: "Architectures for specific, widely relevant problem areas common across many domains, such as security, management, network or information infrastructure. The Integrated Information Infrastructure Reference Model (III-RM) is an example." },
      { t: "Industry Architectures", d: "Architectures specific to a vertical industry or sector, capturing shared data models, processes and patterns (e.g., government reference models, banking or telecom industry models)." },
      { t: "Organization-Specific Architectures", d: "Architectures describing and guiding a particular enterprise, derived by specializing industry, common and foundation architectures to its own requirements." }
    ],
    solutions: [
      { t: "Foundation Solutions", d: "Highly generic concepts, tools, products and services: programming languages, operating systems, foundational structures and widely used generic products." },
      { t: "Common Systems Solutions", d: "Implementations of common systems architectures, such as security, network, management or identity solutions usable across industries." },
      { t: "Industry Solutions", d: "Implementations of industry architectures: packaged, re-usable solutions for a specific sector (e.g., packaged tax administration or revenue management solutions)." },
      { t: "Organization-Specific Solutions", d: "Implementations of the organization-specific architecture: the actual solutions deployed in the enterprise to deliver its business requirements." }
    ],
    note: "<p>The <strong>Enterprise Continuum</strong> is a view of the Architecture Repository that classifies architecture and solution assets from <em>generic</em> (left) to <em>specific</em> (right). Moving left to right is <strong>specialization</strong> (adapting generic assets to specific needs); moving right to left is <strong>generalization</strong> (harvesting proven specific assets into re-usable ones). The <strong>Architecture Continuum</strong> guides and constrains the <strong>Solutions Continuum</strong>: each level of architecture is realized by the corresponding level of solution.</p>" +
      "<p>The continuum also supports communication: it gives architects a common vocabulary for where an asset comes from and how re-usable it is.</p>" +
      "<div class=\"callout gta\"><b>At GTA</b> The GEA framework has a Whole of Government (WoG) section and an Agency section, and the two map onto the continuum:" +
      "<ul><li><strong>Industry (government) level:</strong> the WoG reference models. These are the BRM business services and performance taxonomies, the IRM information taxonomy and information exchange architecture, the ARM application taxonomy and reference architecture, the Infrastructure (Technical) Reference Model, and the GEA standards and security and service management frameworks.</li>" +
      "<li><strong>Organization-specific level:</strong> GTA's agency artefacts specialize the WoG models. Examples are the services, channel and customer catalogues under BRM domain 14 Revenue Management, the Information Assets Catalogue (e.g., 1.02.02.03 Tax), and the application and infrastructure catalogues and matrices.</li>" +
      "<li><strong>Solutions Continuum:</strong> WoG shared services that GTA reuses rather than rebuilds are common systems or industry (government) solutions. Examples are GDX, National Authentication, the Government Data Center, the Government Network and the payment gateway. Dhareeba, Tabadol and GTA's own platforms are organization-specific solutions.</li></ul>" +
      "<p>Generalization works too: a proven GTA asset, such as a GDX exchange package for tax data, can be offered back to the WoG level. Do not confuse TOGAF's foundation-level Technical Reference Model with the GEA <em>Infrastructure (Technical) Reference Model</em>, which is a government infrastructure taxonomy.</p></div>"
  },

  /* ------------------------------------------------------------------ */
  /* ARCHITECTURE REPOSITORY                                             */
  /* ------------------------------------------------------------------ */
  repository: [
    { t: "Architecture Metamodel", d: "Describes the organizationally tailored application of an architecture framework, including a method for architecture development and a metamodel for architecture content." },
    { t: "Architecture Capability", d: "Defines the parameters, structures and processes that support governance of the Architecture Repository (e.g., Architecture Board terms of reference - at GTA, the TRB charter - skills, roles)." },
    { t: "Architecture Landscape", d: "The architectural representation of assets in use, or planned, by the enterprise at particular points in time, at Strategic, Segment and Capability levels." },
    { t: "Standards Information Base (SIB)", d: "Captures the standards with which new architectures must comply: legal and regulatory obligations, industry standards, selected products and services, and shared services. At GTA this includes the GEA standards (each categorised as mandatory, recommended or optional) and the WoG shared services that Resolution 18/2010 requires agencies to reuse." },
    { t: "Reference Library", d: "Provides guidelines, templates, patterns and other forms of reference material that can be leveraged to accelerate the creation of new architectures. At GTA: the GEA reference models, taxonomies and reference architectures, published by the ministry in ArchiMate 3.0 (Archi) format." },
    { t: "Governance Log", d: "Provides a record of governance activity across the enterprise: decisions, compliance assessments, capability assessments, dispensations, Change Requests, calendars and project portfolio information." },
    { t: "Architecture Requirements Repository", d: "Provides a view of all authorized architecture requirements which have been agreed with the Architecture Board." },
    { t: "Solutions Landscape", d: "Presents an architectural representation of the Solution Building Blocks supporting the Architecture Landscape which have been planned or deployed by the enterprise." },
    { t: "Note: Enterprise Repository", d: "The Architecture Repository is one part of the wider Enterprise Repository, which also holds operational and design repositories such as requirements management tools, solution design repositories (e.g., models and code) and operational CMDBs. Links between them provide traceability from architecture to deployed reality." }
  ],

  /* ------------------------------------------------------------------ */
  /* CONTENT FRAMEWORK / ENTERPRISE METAMODEL                            */
  /* ------------------------------------------------------------------ */
  metamodel: {
    groups: [
      { t: "Motivation", items: ["Driver", "Goal", "Objective", "Measure", "Principle", "Constraint", "Assumption", "Requirement"] },
      { t: "Business", items: ["Actor", "Role", "Organization Unit", "Business Service", "Function", "Process", "Event", "Control", "Product", "Contract", "Location", "Value Stream", "Business Capability", "Course of Action", "Business Information"] },
      { t: "Data", items: ["Data Entity", "Logical Data Component", "Physical Data Component"] },
      { t: "Application", items: ["Application Service", "Logical Application Component", "Physical Application Component"] },
      { t: "Technology", items: ["Technology Service", "Logical Technology Component", "Physical Technology Component"] },
      { t: "Architecture Realization", items: ["Work Package", "Capability", "Requirement", "Constraint", "Assumption", "Gap", "Principle", "Architecture Building Block", "Solution Building Block", "Plateau / Transition Architecture"] }
    ],
    relations: [
      ["Driver", "creates", "Goal"],
      ["Goal", "is realized through", "Objective"],
      ["Objective", "is tracked against", "Measure"],
      ["Organization Unit", "contains", "Actor"],
      ["Actor", "performs", "Role"],
      ["Actor", "consumes", "Business Service"],
      ["Organization Unit", "owns and governs", "Function"],
      ["Function", "is realized by", "Process"],
      ["Business Service", "is realized by", "Process"],
      ["Business Service", "meets", "Objective"],
      ["Business Service", "is governed and measured by", "Contract"],
      ["Value Stream", "is enabled by", "Business Capability"],
      ["Logical Data Component", "encapsulates", "Data Entity"],
      ["Physical Data Component", "realizes", "Logical Data Component"],
      ["Logical Application Component", "implements", "Application Service"],
      ["Physical Application Component", "realizes", "Logical Application Component"],
      ["Physical Application Component", "is realized by", "Physical Technology Component"],
      ["Work Package", "delivers", "Capability"]
    ]
  },

  /* ------------------------------------------------------------------ */
  /* ARCHITECTURE PRINCIPLES (TOGAF template): the seven GEA principles  */
  /* (verbatim names/statements, GEA Overview s.2.1) + 4 TOGAF principles */
  /* ------------------------------------------------------------------ */
  principles: [
    {
      name: "Customer centricity",
      statement: "Customer insights must inform service selection, design and delivery. Customers should be shielded from the internal complexities of Government.",
      rationale: "GEA principle (GEA Overview, section 2.1). GTA serves businesses, individuals, tax agents, other government entities and foreign administrations (G2B, G2C, G2G) through Dhareeba, mobile apps and the Gov. Call Center. A taxpayer should not need to know which GTA department or system holds their data.",
      implications: [
        "GTA maintains GEA customer profiles, a channel catalogue and a Customer/Delivery Channel/Service matrix, and uses them when designing services",
        "Service designs start from the taxpayer journey; internal splits (e.g., Dhareeba, Tabadol, legacy TAS data) are hidden behind the service",
        "WoG delivery channels (e.g., the Qatar Government Contact Center) are reused, as the BRM requires",
        "Each service has KPIs in the BRM Customer relationship measurement area (e.g., customer satisfaction, customer usage)"
      ]
    },
    {
      name: "Promote reuse",
      statement: "Remove fragmentation, duplication and promote consolidation and reuse of shared capabilities.",
      rationale: "GEA principle (GEA Overview, section 2.1). Council of Ministers' Resolution No. (18) of 2010 also requires entities to reuse government shared services and infrastructure. The GTA baseline shows fragmentation, for example many separate in-house SharePoint applications and point-to-point integrations.",
      implications: [
        "Every new request is checked first against WoG shared services (e.g., National Authentication, payment gateway, GDX, Government Data Center, Government Network) and GTA's own catalogues, then buy, then build",
        "Mandated government applications (e.g., Mawared, Maliya, Tawasul) are used instead of local equivalents",
        "Rationalising overlapping in-house applications is a standing roadmap theme",
        "TRB checkpoints ask the GEA question 'Is the project leveraging applicable shared services provided at WoG level?'"
      ]
    },
    {
      name: "Share Information by default",
      statement: "Information must be shared by default rather than by exception.",
      rationale: "GEA principle (GEA Overview, section 2.1). Shared, authoritative information avoids asking taxpayers for the same data twice and enables pre-filled, integrated services. For a tax authority, 'by default' always operates within taxpayer confidentiality and the law: the GEA Data Management Policy applies subject to privacy, legal and security considerations, and the Open Data Policy excludes data restricted by law.",
      implications: [
        "Information assets are catalogued against the IRM taxonomy with a named steward, so others can discover them",
        "Inter-agency exchanges use GDX; internal exchanges use managed APIs, not file copies or local replicas",
        "Every exchange has a documented legal basis and data classification; taxpayer-level data is shared only where the law allows",
        "Aggregated, non-identifying data is assessed as an open data candidate"
      ]
    },
    {
      name: "Enable co-creation through a collaborative environment",
      statement: "Next generation of digital services delivery should facilitate co-creation of digital services on a shared technology platform including multiple agencies, 3rd party service providers and vendors.",
      rationale: "GEA principle (GEA Overview, section 2.1). Many of GTA's services depend on other entities, such as ministries, licensing authorities, banks and international bodies, and on vendors who build and run its systems.",
      implications: [
        "GTA's APIs are published with documentation in an API catalogue or developer portal, following the GEA information exchange architecture",
        "Vendors are bound by the GEA tender compliance statement and take part in Design Authorities",
        "Cross-agency journeys are designed with the partner agencies and MCIT, not by GTA alone",
        "Shared platforms are preferred over agency-only platforms where they exist"
      ]
    },
    {
      name: "Trust and confidence",
      statement: "Build public trust and confidence in government's ability to maintain the privacy and security of information.",
      rationale: "GEA principle (GEA Overview, section 2.1). GTA holds confidential taxpayer information, and taxpayers' trust in that protection underpins voluntary compliance. GTA is ISO 27001 certified, and security must be designed into the architecture, not added afterwards.",
      implications: [
        "Solutions conform to the National Information Assurance (NIA) policy, the GEA Cloud security policy and the BYOD policy",
        "Data classification and access control are mandatory design inputs for every solution handling taxpayer data",
        "Security is addressed across all five reference layers (shared security services, users, devices, applications and data, network) in Phases B to D",
        "Security architects take part in TRB checkpoint reviews"
      ]
    },
    {
      name: "Interoperable",
      statement: "Design services for interoperability using applicable standards so that systems can work together to deliver more integrated services through a common data exchange platform.",
      rationale: "GEA principle (GEA Overview, section 2.1). GTA's baseline integrations are point-to-point, Dhareeba and Tabadol are not integrated, and there is no internal integration platform. That limits integrated, pre-filled services and raises change cost.",
      implications: [
        "New integrations go through the integration platform or GDX; no new point-to-point interfaces to core systems without a recorded exception",
        "Interfaces follow GEA information exchange standards and are recorded in the interface catalogue",
        "Interoperability requirements are captured explicitly in Phases C and D and checked at Alpha and Beta",
        "The GEA common data exchange platform (GDX) is the default for exchanges with other agencies"
      ]
    },
    {
      name: "Design for future",
      statement: "Prepare Government services for disruptive technologies and emerging trends.",
      rationale: "GEA principle (GEA Overview, section 2.1). GTA faces known future change, including Dhareeba 2.0, a planned e-invoicing solution, the OECD Pillar Two GIR schema and a possible move of cloud workloads to an in-country region. Rigid designs would turn each of these into a costly re-build.",
      implications: [
        "Architectures are modular and service-based so components can change independently",
        "Phase H routinely scans for regulatory and technology change and classifies its architectural impact",
        "Emerging technology use cases are assessed against GEA standards and their lifecycle status before adoption",
        "Roadmaps keep an architecture runway (integration, data and platform enablers) ahead of business demand"
      ]
    },
    {
      name: "Data is an Asset with a Data Owner",
      statement: "Data is an asset that has value to GTA and is managed accordingly; every critical data entity has a named owner (data trustee) accountable for its quality.",
      rationale: "TOGAF standard principles 'Data is an Asset' and 'Data Trustee', complementing the GEA principles. The report found no formal data strategy and missing data governance, quality and stewardship capabilities, with manual reporting still common. Accurate data underpins assessment, compliance, revenue reporting and exchange of information.",
      implications: [
        "A data management strategy and data quality plan are part of the roadmap",
        "Each information asset in the IRM-aligned catalogue has a business steward; data quality issues are treated as business issues",
        "Data is captured once, at source, by its owning function",
        "Investment in data governance and master data is planned and funded"
      ]
    },
    {
      name: "Compliance with Law",
      statement: "GTA information management and IT processes comply with all relevant laws, policies and regulations, including tax legislation and mandated government policies.",
      rationale: "TOGAF standard principle, complementing the GEA principles. GTA is a regulator entrusted with confidential taxpayer information. The GEA documents themselves state that where they conflict with the laws of Qatar, the laws take precedence.",
      implications: [
        "Legal Affairs and Tax Policies are consulted early on changes affecting data, filing, assessment or information exchange",
        "Mandated GEA enabling policies (e.g., Data Management, Open Data, NIA, Cloud security, BYOD) are recorded in the SIB and checked in reviews",
        "Changes in law trigger an impact assessment in Phase H and may trigger a new ADM cycle",
        "Exceptions to policy require a recorded decision at the right GEA level (TRB, WoG ARB or ICT Governance Board)"
      ]
    },
    {
      name: "Technology Independence",
      statement: "Applications are independent of specific technology choices and therefore can operate on a variety of technology platforms.",
      rationale: "TOGAF standard principle, complementing the GEA principles. GTA runs on a mix of public cloud regions and an on-premises data centre, has no formal multi-cloud strategy, and faces service differences between cloud regions. Independence keeps future hosting and sourcing options open.",
      implications: [
        "Logical (vendor-neutral) architecture is defined before products are selected",
        "Standards-based interfaces and portable technologies are favoured; proprietary extensions need TRB approval",
        "Hosting decisions consider exit, portability and region-availability constraints",
        "A multi-cloud strategy and cloud governance are developed as part of the target state"
      ]
    },
    {
      name: "Business Continuity",
      statement: "GTA operations are maintained in spite of system interruptions.",
      rationale: "TOGAF standard principle, complementing the GEA principles. The report found no formal IT disaster recovery and business continuity strategy, insufficient Dhareeba DR testing and documentation, and DR failover dependencies on external entities. Tax services and filing deadlines cannot depend on untested recovery.",
      implications: [
        "An IT DR and business continuity strategy (business impact analysis, risk assessment, DR plans, regular testing) is part of the roadmap",
        "Every critical service has recovery objectives, and DR is tested and documented",
        "Dependencies on external services (e.g., national authentication) are recorded and included in DR tests",
        "Designs account for peak load around filing deadlines"
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  /* KEY DELIVERABLES                                                    */
  /* ------------------------------------------------------------------ */
  deliverables: [
    { t: "Organizational Model for Enterprise Architecture", phase: "Preliminary", d: "Defines scope of the Architecture Capability, maturity assessment, roles and responsibilities, budget, and governance/support strategy." },
    { t: "Architecture Principles", phase: "Preliminary / A", d: "General rules and guidelines, intended to be enduring and seldom amended, that inform and support the way an organization sets about fulfilling its mission." },
    { t: "Request for Architecture Work", phase: "Preliminary / F / H", d: "A document sent from the sponsoring organization to the architecture organization to trigger the start of an architecture development cycle." },
    { t: "Statement of Architecture Work", phase: "A", d: "Defines the scope and approach used to complete an architecture project; it is typically the document against which successful execution is measured and may form the basis of a contractual agreement." },
    { t: "Capability Assessment", phase: "A / E", d: "Assesses the baseline and target capability levels of the enterprise, IT and the Architecture Capability itself, including business transformation readiness." },
    { t: "Architecture Vision", phase: "A", d: "A succinct description of the Target Architecture that describes its business value and the changes to the enterprise that will result from its successful deployment; it serves as an aspirational vision and a boundary for detailed development." },
    { t: "Architecture Definition Document", phase: "A-F (developed in B, C, D)", d: "The deliverable container for the core architectural artifacts: baseline, target and Transition Architectures for business, data, application and technology domains." },
    { t: "Architecture Requirements Specification", phase: "B-F", d: "Provides a set of quantitative statements that outline what an implementation project must do to comply with the architecture: success measures, requirements, constraints, assumptions, gap results." },
    { t: "Architecture Roadmap", phase: "B-F (finalized in F)", d: "Lists individual work packages that will realize the Target Architecture and lays them out on a timeline to show progression from the Baseline to the Target Architecture." },
    { t: "Transition Architecture", phase: "E / F", d: "A formal description of one state of the architecture at an architecturally significant point in time, showing the enterprise at incremental states between baseline and target." },
    { t: "Implementation and Migration Plan", phase: "E / F", d: "A schedule for implementation of the solution described by the Architecture Roadmap, including timing, cost, resources, benefits and milestones." },
    { t: "Implementation Governance Model", phase: "F", d: "Ensures that a project transitioning into implementation also smoothly transitions into appropriate architecture governance: organization structure, governance processes and roles." },
    { t: "Architecture Contract", phase: "G", d: "Joint agreement between development partners and sponsors on the deliverables, quality and fitness-for-purpose of an architecture; used to govern implementation." },
    { t: "Compliance Assessment", phase: "G", d: "Periodic review of implementation projects against the architecture to confirm conformance and identify issues and dispensations." },
    { t: "Change Request", phase: "G / H", d: "A request to change the architecture or its implementation, raised when the original architecture cannot be implemented as defined or when new needs arise." },
    { t: "Requirements Impact Assessment", phase: "Requirements Management / H", d: "Assesses the current architecture requirements and specification to identify changes that should be made and their implications." },
    { t: "Architecture Building Blocks", phase: "A-F", d: "Architecture documentation and models from the Architecture Repository that define required capabilities and guide solution development." },
    { t: "Solution Building Blocks", phase: "E-G", d: "Components of the solution (products, services, custom components) that implement the required capabilities defined by ABBs." },
    { t: "GEA Adoption Plan (GEA-specific)", phase: "Preliminary", d: "Required of every agency by the GEA Governance Model: the agency enterprise architect's plan for adopting the GEA reference models and standards. In TOGAF terms, part of the Tailored Architecture Framework and the Organizational Model for EA." },
    { t: "Technical Review Board Charter (GEA-specific)", phase: "Preliminary", d: "Terms of reference for the agency-level Technical Review Board that GEA requires each agency to establish. It covers membership (architecture sponsor, agency enterprise architect, invited members such as project, integration and security representatives), GEA compliance focus, low-impact exception rights, and the criteria for escalating to the WoG ARB. At GTA it is the charter of the internal architecture board." },
    { t: "GEA Compliance Self-Assessment (GEA-specific)", phase: "Preliminary / H (annually or on request)", d: "The GEA Governance Model Appendix 1 questionnaire, with agency-level and project-level statements in seven weighted sections (BRM 20, IRM 15, ARM 15, TRM 10, Security 15, Service Management 5, General EA practices 20). The total score maps to a grade and an EA maturity level. In TOGAF terms, a Capability Assessment and a Compliance Assessment combined." },
    { t: "GEA Catalogues and Matrices (GEA-specific)", phase: "B-D, published in H", d: "Agency EA artefacts aligned to the GEA taxonomies and published to the ministry (MCIT, MoTC in the GEA text) periodically. Examples: services, channel and customer catalogues and their matrices (BRM), Information Assets Catalogue and service/information matrix (IRM), Application Catalogue and service/information/application matrix (ARM), and Infrastructure Assets Catalogue and application/infrastructure matrix (TRM)." },
    { t: "Design Authority Checkpoint Evidence (GEA-specific)", phase: "G", d: "Evidence presented by a project's Design Authority at the TRB checkpoints (Discovery, Alpha, Beta, Live): alignment to GEA, shared services leveraged, cross-agency information assets leveraged and compliance with standards. In TOGAF terms, the input to Compliance Assessments under an Architecture Contract." },
    { t: "GEA Tender Compliance Statement (GEA-specific)", phase: "F / G", d: "The standard clause that every agency ICT tender must include, requiring vendors to comply with the GEA reference architectures and standards and allowing them to report compliance using the GEA self-assessment template. It ties the vendor to the architecture before an Architecture Contract is signed." }
  ],

  /* ------------------------------------------------------------------ */
  /* COMPLIANCE LEVELS                                                   */
  /* ------------------------------------------------------------------ */
  compliance: [
    { t: "Irrelevant", d: "The implementation has no features in common with the architecture specification, so the specification is irrelevant to it." },
    { t: "Consistent", d: "The implementation has some features in common with the architecture specification and those common features are implemented in accordance with it; however, some specified features are not implemented, and the implementation has other features not covered by the specification." },
    { t: "Compliant", d: "Some features in the architecture specification are not implemented, but all features that are implemented are covered by the specification and are in accordance with it." },
    { t: "Conformant", d: "All the features in the architecture specification are implemented in accordance with the specification, but some additional features are implemented that are not covered by it." },
    { t: "Fully Conformant", d: "There is full correspondence between the architecture specification and the implementation: all specified features are implemented in accordance with the specification, and there are no features outside it." },
    { t: "Non-conformant", d: "Any of the above in which some features in the architecture specification are implemented not in accordance with the specification." }
  ],

  /* ------------------------------------------------------------------ */
  /* EA CAPABILITY AND GOVERNANCE                                        */
  /* ------------------------------------------------------------------ */
  capabilityFramework:
    "<p>An <strong>Architecture Capability</strong> is the organization, processes, skills, roles and tools needed to develop and govern Enterprise Architecture. TOGAF treats it as a business capability in its own right, established in the Preliminary phase and improved through Phase H.</p>" +
    "<p><strong>Architecture Board (ARB).</strong> A cross-organizational body responsible for overseeing the implementation of the architecture strategy. TOGAF recommends a small permanent membership (ideally four or five, and no more than ten), drawn from senior business and IT stakeholders, with rotating members for specific topics. Its responsibilities include:</p>" +
    "<ul><li>Providing consistency between sub-architectures and enforcing Architecture Compliance</li>" +
    "<li>Establishing targets for re-use of components and flexibility of the architecture</li>" +
    "<li>Validating and approving architecture deliverables and the Statement of Architecture Work</li>" +
    "<li>Granting dispensations and resolving escalated issues</li>" +
    "<li>Ensuring the architecture remains aligned with business strategy and improving the maturity of the practice</li></ul>" +
    "<p><strong>Architecture Governance Framework.</strong> TOGAF describes governance through three key concepts: <em>process</em> (policy management and take-on, compliance, dispensation, monitoring and reporting, business control, environment management), <em>content</em> (compliance assessments, SLAs/OLAs, standards, regulatory requirements held in the repository) and <em>context</em> (the organizational and legal setting, decision rights and links to corporate governance). Governance is supported by the <strong>Governance Log</strong> in the Architecture Repository.</p>" +
    "<p><strong>Architecture Contracts</strong> are joint agreements between development partners and sponsors on deliverables, quality and fitness-for-purpose. <strong>Architecture Compliance reviews</strong> check projects against the architecture at defined checkpoints using checklists and the six compliance levels.</p>" +
    "<p>The <strong>Architecture Skills Framework</strong> defines roles (e.g., Architecture Sponsor, Architecture Board member, EA Manager, Business, Data, Application and Technology Architects, Program/Project Architect), skill categories (generic, business skills and methods, EA skills, program/project management, IT general knowledge, technical IT, legal environment) and four proficiency levels: Background, Awareness, Knowledge and Expert. <strong>Maturity models</strong> such as the Architecture Capability Maturity Model (ACMM) or CMMI-style models measure and plan improvement.</p>" +
    "<p><strong>How TOGAF governance maps onto GEA.</strong> The GEA Governance Model splits governance into <em>upstream</em> (\"doing the right things\") and <em>downstream</em> (\"doing things right\"). It defines four tiers of bodies, each with its own focus and exception rights:</p>" +
    "<ul><li><strong>ICT Governance Board (Qatar Digital Government Steering Committee)</strong>, at WoG level with a strategic focus. It sets strategic ICT direction and priorities and authorises <em>high-impact</em> exceptions. In TOGAF terms it is corporate/IT governance above the Architecture Board.</li>" +
    "<li><strong>Architecture Review Board, WoG level</strong>, with an architecture focus. Its members are the WoG Architecture Sponsor, the WoG Enterprise Architect and invited members. It keeps overall responsibility for GEA through the Office of the Chief Architect, maintains and publishes GEA, authorises <em>medium-impact</em> exceptions, and is the escalation point for appeals and disputes about compliance. It is a government-wide Architecture Board.</li>" +
    "<li><strong>Technical Review Board, agency level</strong>, with a compliance focus. Its members are the agency architecture sponsor, the agency enterprise architect and invited members (e.g., project, integration and security representatives). It assesses and authorises solution compliance with GEA, authorises <em>low-impact</em> exceptions, uses the self-assessment templates, and reports compliance to the WoG ARB. It is the agency's TOGAF Architecture Board.</li>" +
    "<li><strong>Design Authorities, project level</strong>, with a solution focus. Members are project management, the lead architect and other nominated team members. They derive solutions that comply with the architecture and attend TRB checkpoints. They correspond to TOGAF's project architecture role and Architecture Contract counterpart in Phase G.</li></ul>" +
    "<p>In addition, projects above 500K need the IT procurement committee's approval (the currency is not stated in the source), and that committee may ask the ARB for an opinion on architecture exceptions.</p>" +
    "<p><strong>GEA EA Maturity Model (EAMM).</strong> The EAMM is based on the US Department of Commerce ACMM, the same model TOGAF cites as an example. It has six levels: 0 None, 1 Initial, 2 Under Development, 3 Defined, 4 Managed and 5 Optimized. It assesses seven characteristics: EA framework defined; EA development method defined; business requirements process; stakeholder participation; Enterprise Continuum, tools and repository; governance; and benefits realization.</p>" +
    "<p><strong>GEA compliance self-assessment.</strong> Agencies complete the Appendix 1 template annually or on the ministry's request. Agency-level statements are scored 1 or 0. Project-level statements count the projects that are Fully Compliant, Partially Compliant, Not Compliant or N/A. The section weights are BRM 20, IRM 15, ARM 15, TRM 10, Security 15, Service Management 5 and General EA practices 20. The total score gives a grade: above 85 is Excellent (EA maturity 4), above 60 and below 85 is Good (3), above 45 and below 60 is Satisfactory (2), and below 45 is Needs improvement (0 or 1). No score band maps to level 5.</p>" +
    "<p><strong>GTA baseline governance (April 2025 report).</strong></p>" +
    "<ul><li>An IT Steering Committee is in place, led by the Head of IT, and meets ad hoc.</li>" +
    "<li>The PMO is informal, with monthly project meetings and no PMO tool.</li>" +
    "<li>A Change Advisory Board is in place, with membership varying by change.</li>" +
    "<li>There is <em>no Enterprise Architecture Office yet</em>, although an EA Office initiative is planned.</li>" +
    "<li>There is no Information Security Committee and no Vendor Management Board.</li>" +
    "<li>Governance committee charters are named as a key consideration.</li></ul>" +
    "<p>In GEA terms, GTA has the operational bodies but not yet the architecture tier: no TRB and no Design Authorities.</p>" +
    "<div class=\"callout gta\"><b>At GTA</b> GTA's internal \"ARB\" is GTA's <strong>GEA Technical Review Board</strong>, not a second, parallel board. Its charter, membership and cadence below are illustrative until GTA decides. It is chaired by GTA's EA executive sponsor. Its permanent members are the agency enterprise architect (hosted in the planned EA Office), Planning &amp; Quality and a senior tax-business representative. Invited members cover security, integration and the project concerned. The TRB:" +
    "<ul><li>reviews Statements of Architecture Work</li>" +
    "<li>agrees Architecture Contracts with each project's Design Authority</li>" +
    "<li>runs the Discovery, Alpha, Beta and Live checkpoints</li>" +
    "<li>decides low-impact exceptions and escalates medium and high ones to the WoG ARB or the ICT Governance Board</li>" +
    "<li>keeps the Governance Log</li>" +
    "<li>owns the annual GEA self-assessment and the periodic publication of GTA catalogues and matrices to the ministry</li></ul>" +
    "It complements the IT Steering Committee (direction and priorities) and the CAB (operational change).</div>",

  /* ------------------------------------------------------------------ */
  /* AGILE                                                               */
  /* ------------------------------------------------------------------ */
  agile:
    "<p>The ADM is not a waterfall. TOGAF 10 explicitly supports <strong>iteration</strong>: within a phase, across phases, and across complete cycles. The ADM can be organized into four <strong>iteration cycles</strong>:</p>" +
    "<ul><li><strong>Architecture Context iterations</strong> (Preliminary and Phase A): establish the approach, principles, scope and vision.</li>" +
    "<li><strong>Architecture Definition iterations</strong> (Phases B, C and D): develop the architecture content, often cycling through the domains several times.</li>" +
    "<li><strong>Transition Planning iterations</strong> (Phases E and F): build and refine the roadmap and migration plan.</li>" +
    "<li><strong>Architecture Governance iterations</strong> (Phases G and H): govern implementation and manage change.</li></ul>" +
    "<p>Architecture is also developed at different <strong>levels</strong>: Strategic Architecture sets long-term direction, Segment Architecture details a portfolio or business area, and Capability Architecture describes the change needed to deliver a specific capability increment. Agile teams mostly consume and contribute to Capability Architectures, while Strategic and Segment Architectures provide guardrails.</p>" +
    "<p>The Series Guides <em>Enabling Enterprise Agility</em> and <em>Applying the TOGAF ADM using Agile Sprints</em> show how ADM work can be planned as a backlog and delivered in time-boxed sprints, producing 'just enough' architecture for the next increment. A useful concept from agile practice is the <strong>architecture runway</strong>: the existing architecture, enablers and infrastructure needed so that upcoming features can be delivered without excessive redesign. Architects keep the runway slightly ahead of delivery demand.</p>" +
    "<p><strong>GEA's next-gen service delivery method.</strong> GEA's downstream governance relies on a next-gen Service Delivery Method (also called the Service Creation Method). The project's Design Authority takes part in the agency Technical Review Board's checkpoint reviews at four stages: <strong>Discovery, Alpha, Beta and Live</strong>. At each checkpoint it shows alignment to GEA, the shared services and cross-agency information assets it leverages, and compliance with standards. The BRM is used before and during Discovery to align a new service with strategic goals. GEA does not prescribe how these stages map onto the ADM. A practical mapping (GTA tailoring, illustrative) is:</p>" +
    "<ul><li><strong>Discovery</strong> ~ an Architecture Context iteration: confirm the need, BRM alignment, scope, stakeholders and reuse candidates (Phase A thinking at Capability level).</li>" +
    "<li><strong>Alpha</strong> ~ an Architecture Definition iteration: prototype the target across business, data, application and technology (B to D). Check WoG shared services, IRM information assets and GDX exchanges.</li>" +
    "<li><strong>Beta</strong> ~ Transition Planning and Implementation Governance: the solution is built against the Architecture Contract, standards compliance is verified, and remaining gaps become exceptions or work packages (E to G).</li>" +
    "<li><strong>Live</strong> ~ an Architecture Governance iteration: go-live review, KPIs in BRM measurement areas, catalogue updates and Change Requests (G to H).</li></ul>" +
    "<div class=\"callout gta\"><b>At GTA</b> (illustrative) delivery squads working on Dhareeba features should:" +
    "<ul><li>take the relevant Capability Architecture, GEA and GTA principles and SIB standards (including GEA mandatory standards) as their guardrails</li>" +
    "<li>include an architect or architecture champion in backlog refinement for architecturally significant stories (new information assets, new external interfaces, security changes)</li>" +
    "<li>bring their Design Authority to the TRB checkpoints at Discovery, Alpha, Beta and Live, so sprint work is grouped into a few governance gates rather than reviewed story by story</li>" +
    "<li>raise architecture decisions as lightweight records logged in the Governance Log</li>" +
    "<li>feed discoveries back to EA as Change Requests so the target, roadmap and GEA catalogues stay current</li></ul>" +
    "EA in turn commits to fast turnaround on reviews so that governance does not become a bottleneck.</div>",

  /* ------------------------------------------------------------------ */
  /* ARCHITECTURE LEVELS                                                 */
  /* ------------------------------------------------------------------ */
  levels: [
    { t: "Strategic Architecture", d: "An organizing framework for operational and change activity and an executive-level, long-term view for direction setting across the whole enterprise. At GTA: the enterprise capability map, the GEA-aligned enterprise catalogues, the Digital Strategy target state (D2) and roadmap (D3), and the principles, linked to the refreshed GTA strategy.", horizon: "Long term: typically 3-5 years" },
    { t: "Segment Architecture", d: "An organizing framework for a portfolio or program of change, focused on a business area or segment. At GTA: e.g., the 'Taxpayer Compliance' segment covering filing, assessment, risk and audit.", horizon: "Medium term: typically 1-2 years" },
    { t: "Capability Architecture", d: "An organizing framework for change projects and capability increments, detailed enough to guide delivery. At GTA: e.g., the architecture for 'pre-filled corporate income tax returns' delivered by a project or set of squads.", horizon: "Short term: typically up to 1 year / per release or increment" }
  ],

  /* ------------------------------------------------------------------ */
  /* GLOSSARY                                                            */
  /* ------------------------------------------------------------------ */
  glossary: [
    { t: "Architecture Development Method (ADM)", d: "The core TOGAF method: an iterative, tailorable process for developing and managing Enterprise Architecture." },
    { t: "Architecture Building Block (ABB)", d: "A constituent of the architecture model that describes a single aspect of the overall model and defines required capability; it is product-agnostic." },
    { t: "Solution Building Block (SBB)", d: "A candidate solution component (product, service or custom component) that conforms to the specification of an ABB." },
    { t: "Building Block", d: "A potentially re-usable component of enterprise capability that can be combined with other building blocks to deliver architectures and solutions." },
    { t: "Architecture Landscape", d: "The architectural representation of assets in use, or planned, by the enterprise at particular points in time." },
    { t: "Baseline Architecture", d: "The existing defined system architecture before entering a cycle of architecture review and redesign." },
    { t: "Target Architecture", d: "The description of a future state of the architecture being developed for an organization." },
    { t: "Transition Architecture", d: "A formal description of one state of the architecture at an architecturally significant point in time between baseline and target." },
    { t: "Gap", d: "A statement of difference between two states, used in gap analysis; gaps may be eliminated, new, or retained components." },
    { t: "Gap Analysis", d: "A technique that compares baseline and target architectures to identify what must be added, removed or changed." },
    { t: "Stakeholder", d: "An individual, team, organization or class thereof having an interest in a system." },
    { t: "Concern", d: "An interest in a system relevant to one or more of its stakeholders." },
    { t: "Viewpoint", d: "A specification of the conventions for a particular kind of architecture view; it defines the perspective from which a view is taken." },
    { t: "View", d: "A representation of a system from the perspective of a related set of concerns, conforming to a viewpoint." },
    { t: "Architecture Principle", d: "A qualitative statement of intent that should be met by the architecture, with a statement, rationale and implications." },
    { t: "Architecture Vision", d: "A succinct, high-level description of the Target Architecture and its business value, produced in Phase A." },
    { t: "Request for Architecture Work", d: "A document from the sponsoring organization that triggers the start of an architecture development cycle." },
    { t: "Statement of Architecture Work", d: "A document defining the scope and approach of an architecture project, approved at the end of Phase A." },
    { t: "Architecture Definition Document", d: "The deliverable container for core architectural artifacts across business, data, application and technology domains." },
    { t: "Architecture Requirements Specification", d: "Quantitative statements of what an implementation project must do to comply with the architecture." },
    { t: "Architecture Roadmap", d: "Work packages laid out on a timeline to move from baseline to target via Transition Architectures." },
    { t: "Implementation and Migration Plan", d: "The schedule, resources, costs and milestones for realizing the Architecture Roadmap." },
    { t: "Work Package", d: "A set of actions identified to achieve one or more objectives for the business; it can be a part of a project, a complete project, or a program." },
    { t: "Capability", d: "An ability that an organization, person or system possesses, typically expressed in general and high-level terms." },
    { t: "Capability Increment", d: "A discrete portion of a capability architecture that delivers specific value; a set of increments delivers the capability over time." },
    { t: "Plateau", d: "A relatively stable state of the architecture that exists for a limited period of time; Transition Architectures describe plateaus." },
    { t: "Business Scenario", d: "A technique describing a business problem, its environment, actors and desired outcomes, used to derive architecture requirements." },
    { t: "Enterprise Continuum", d: "A view of the Architecture Repository that classifies assets from generic (foundation) to specific (organization-specific)." },
    { t: "Architecture Repository", d: "The store of architecture-related content: metamodel, capability, landscape, SIB, reference library, governance log, requirements and solutions landscape." },
    { t: "Standards Information Base (SIB)", d: "The part of the Architecture Repository holding the standards with which new architectures must comply." },
    { t: "Governance Log", d: "The record of governance activity: decisions, compliance assessments, dispensations and Change Requests." },
    { t: "Architecture Board", d: "A cross-organizational body that oversees implementation of the architecture strategy and governs compliance." },
    { t: "Architecture Contract", d: "A joint agreement between development partners and sponsors on deliverables, quality and fitness-for-purpose of an architecture." },
    { t: "Compliance Review", d: "A scrutiny of a project's compliance with the architecture at defined checkpoints, resulting in a Compliance Assessment." },
    { t: "Dispensation", d: "A time-bound, governed exception granted when a project cannot fully comply with the architecture." },
    { t: "Architecture Capability", d: "The ability of an organization to perform architecture work: organization, processes, skills, roles and tools." },
    { t: "Metamodel", d: "A model that describes how and with what the architecture will be described in a structured way: entities and their relationships." },
    { t: "Interoperability", d: "The ability to share information and services between systems, organizations or domains." },
    { t: "Architecture Domain", d: "The architectural area being considered: in TOGAF, Business, Data, Application and Technology. (ArchiMate 4, released April 2026, likewise refers to 'domains' rather than 'layers' and adds a Common Domain.)" },
    { t: "GEA (Qatar Government Enterprise Architecture)", d: "Qatar's national EA framework for all government agencies, issued by MoTC (today MCIT) and based on US-FEAF practices. It has a Whole of Government and an Agency section and seven dimensions: four reference models (business, information, application, infrastructure) and three cross-cutting dimensions (governance, security management, service management). For GTA it is the mandated context in which TOGAF is applied." },
    { t: "WoG (Whole of Government)", d: "GEA term for the government-wide level, as opposed to the individual agency level. WoG artefacts include the reference taxonomies, reference architectures, standards and shared-services catalogues." },
    { t: "BRM (GEA Business Reference Model)", d: "GEA reference model linking strategic goals, KPIs (performance taxonomy and measurement areas), service consumers (G2C, G2B, G2G, G2E), delivery channels and business services. GTA's tax services sit under domain 14 Revenue Management, functional area 14.1 Taxes." },
    { t: "IRM (GEA Information Reference Model)", d: "GEA reference model for describing, classifying and sharing information assets across agencies (Governance, Entities and Activities domains, e.g., 1.02.02.03 Tax). It includes the GDX-based information exchange architecture." },
    { t: "ARM (GEA Application Reference Model)", d: "GEA reference model with an application taxonomy (Business Applications; Infrastructure Applications and Platforms) and an application reference architecture built on shared platform services." },
    { t: "TRM (GEA Infrastructure (Technical) Reference Model)", d: "GEA taxonomy and reference architecture for infrastructure assets: Hybrid IT Infrastructure, Connectivity, Facilities, Emerging Technologies and End-User Equipment. Not to be confused with TOGAF's Technical Reference Model, which is a foundation architecture." },
    { t: "Technical Review Board (TRB)", d: "GEA agency-level governance body with a compliance focus. It assesses and authorises the compliance of solutions with GEA, authorises low-impact exceptions, runs the checkpoint reviews and reports compliance to the WoG ARB. At GTA it plays the role of TOGAF's Architecture Board." },
    { t: "Design Authority (DA)", d: "GEA project-level body (project management, lead architect and other nominated members, including the agency enterprise architect) that derives solutions compliant with the architecture, presents evidence at TRB checkpoints and raises exceptions to the TRB." },
    { t: "WoG Architecture Review Board (GEA)", d: "Government-wide architecture board led by the ministry. It is responsible for GEA through the Office of the Chief Architect, maintains and publishes GEA, authorises medium-impact exceptions and handles appeals and disputes on compliance." },
    { t: "ICT Governance Board (QDG Steering Committee)", d: "GEA's top, strategic governance body. It sets whole-of-government ICT direction and priorities and authorises high-impact exceptions." },
    { t: "GEA Compliance Self-Assessment", d: "The GEA Governance Model Appendix 1 questionnaire that agencies complete annually or on the ministry's request. It has weighted sections for BRM, IRM, ARM, TRM, Security, Service Management and General EA practices, and the total score maps to an EA maturity level." },
    { t: "EAMM (GEA EA Maturity Model)", d: "GEA's six-level EA maturity model (0 None to 5 Optimized), assessed on seven characteristics. It is based on the US Department of Commerce ACMM." },
    { t: "Discovery, Alpha, Beta, Live", d: "The stages of GEA's next-gen Service Delivery (Service Creation) Method at which Design Authorities take part in TRB checkpoint reviews." },
    { t: "GDX (Government Data eXchange)", d: "The ministry's WoG platform for inter-agency information exchange. GEA expects agencies providing and consuming information services to use it. At GTA it already connects Dhareeba with MoI." },
    { t: "Council of Ministers' Resolution No. (18) of 2010", d: "Resolution on the implementation of e-government policies. It requires government entities to reuse shared services and infrastructure such as the authentication platform, payment platform, data centre, government network, contact centre and PKI." }
  ]
};
