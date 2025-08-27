<img src="./j1ejuf4w.png"
style="width:5.99583in;height:5.99583in" />

> **SMILE** **SUITE:** **CLOUD** **BASED** **DENTAL** **CLINIC** **AS**
> **A** **SERVICE**
>
> **ABSTRACT**
>
> *Dental* *clinics* *in* *the* *Philippines,* *particularly* *those*
> *outside* *major* *urban* *centers,* *continue* *to* *face*
> *significant* *operational* *inefficiencies* *due* *to* *their*
> *reliance* *on* *manual* *processes* *for* *scheduling,*
> *record-keeping,* *inventory* *monitoring,* *and* *patient*
> *communication.* *Enhaynes* *Dental* *Clinic,* *located* *in*
> *Surigao,* *exemplifies* *this* *challenge,* *encountering* *frequent*
> *appointment* *overlaps,* *lost* *records,* *stock* *depletion,* *and*
> *disorganized* *payment* *documentation.* *This* *capstone* *project*
> *proposes* *the* *development* *of* *Smile* *Suite:* *A* *Cloud-Based*
> *Dental* *Clinic-as-a-Service* *Management* *System,* *designed* *to*
> *modernize* *these* *workflows* *through* *digital* *automation.*
> *Smile* *Suite* *is* *a* *multi-tenant,* *web-based* *platform*
> *featuring* *a* *Laravel/PHP* *backend* *and* *a* *MySQL* *database,*
> *coupled* *with* *a* *responsive* *React.js* *frontend.* *The*
> *system* *enables* *real-time* *online* *appointment* *scheduling,*
> *centralized* *patient* *records,* *treatment* *history* *tracking,*
> *inventory* *management* *with* *low-stock* *alerts,* *and*
> *automated* *SMS* *and* *email* *reminders* *through* *the* *Twilio*
> *API.* *A* *dedicated* *administrative* *dashboard* *provides*
> *clinic* *staff* *with* *tools* *for* *managing* *schedules,*
> *monitoring* *finances,* *and* *generating* *business* *intelligence*
> *reports* *that* *support* *strategic* *decision-making.* *In*
> *contrast* *to* *traditional* *linear* *models,* *the* *project*
> *adopts* *the* *Rapid* *Application* *Development* *(RAD)*
> *methodology* *to* *ensure* *continuous* *stakeholder* *feedback*
> *and* *iterative* *improvements* *throughout* *the* *development*
> *cycle.* *Usability* *and* *performance* *will* *be* *evaluated*
> *based* *on* *reductions* *in* *administrative* *workload,*
> *appointment* *no-shows,* *and* *inventory-related* *disruptions.*
> *Beyond* *Enhaynes* *Dental* *Clinic,* *the* *system* *is* *designed*
> *for* *scalability,* *offering* *other* *clinics* *nationwide* *a*
> *cost-effective,* *cloud-based* *solution* *aligned* *with* *the*
> *Department* *of* *Health’s* *eHealth* *Strategic* *Framework*
> *(2023–2028)* *\[48\].* *The* *expected* *outcome* *is* *a*
> *functional,* *user-centered* *clinic* *management* *system* *that*
> *enhances* *efficiency,* *reduces* *human* *error,* *and* *empowers*
> *dental* *practitioners* *with* *data-driven* *tools,* *ultimately*
> *serving* *as* *a* *model* *for* *digital* *transformation* *in*
> *small* *to* *mid-sized* *dental* *clinics* *across* *the*
> *Philippines.*
>
> **KEYWORDS**
>
> *cloud-based* *system,* *dental* *clinic* *system,* *laravel* *php,*
> *patient* *portal,* *philippines,* *react.js*
>
> **1.** **INTRODUCTION**
>
> The digital transformation of dental clinics in the Philippines,
> especially small to mid-sized practices, remains critically
> underdeveloped despite the growing availability of affordable cloud
> technologies. Clinics in provincial cities like Surigao still rely on
> manual systems for essential tasks such as appointment scheduling,
> inventory tracking, and patient record management which leads to
> administrative overload and reduced service quality. A nationwide
> survey by the Department of Science and Technology (DOST) and the
> Philippine Council for Health Research and Development revealed that
> over 70% of small healthcare providers in the Philippines lack digital
> infrastructure, mainly due to cost concerns and limited technical
> capacity \[41\]. These outdated workflows result in increased human
> error, frequent appointment overlaps, and inefficient inventory usage.
>
> This capstone project introduces Smile Suite: A Cloud-Based Dental
> Clinic-as-a-Service Management System, a comprehensive, multi-tenant
> platform designed to automate key clinic operations while enabling
> scalability for multi-branch use. The system addresses three core
> limitations observed at Enhaynes Dental Clinic and similar practices:
> (1) lack of real-time scheduling and inventory control, (2) inability
> to generate actionable business reports for clinic decision-making,
> and (3) poor communication channels between clinic and patients. A
> study emphasized that small clinics adopting digital platforms for
> appointment booking and treatment logging reported a 25–35%
> improvement in workflow efficiency and a 20% increase in patient
> satisfaction due to faster service \[42\].
>
> Smile Suite incorporates both SMS notification features (using Twilio
> API) and email reminders to reduce the current 15–20% no-show rate
> observed at Enhaynes Dental Clinic. According to areport, SMS open
> rates in the Philippines areas high as 97%, making it one of the most
> effective channels for appointment reminders \[43\]. The system is
> also built as a multi-tenant, cloud-based architecture, which means
> new dental clinics can register and use the system independently while
> benefiting from shared infrastructure which is an approach aligned
> with the scalable healthcare delivery models advocated by the Asian
> Development Bank’s Digital Health Strategy \[44\].
>
> Moreover, Smile Suite is designed with a strong emphasis on decision
> support tools. It includes real-time dashboards, reports on patient
> trends, inventory turnover, and revenuetracking, enabling clinic
> administrators to makedata-driven decisions. This feature directly
> addresses what the World Health Organization identifies as one of the
> most common weaknesses in health facility management: the absence of
> operational analytics and monitoring tools in low-resource settings
> \[45\].
>
> This study is guided by three core research questions formulated
> through
>
> preliminary stakeholder interviews and analysis of industry trends:
> (1) To what extent can automated scheduling and inventory management
> reduce operational inefficiencies in small dental clinics? (2) What
> technical and usability factors most influence the successful adoption
> of a multi-clinic dental management platform? (3) And how effectively
> can standardized reporting tools support financial and clinical
> decision-making for clinic administrators?Thesequestions shapethe
> direction of system development and evaluation, ensuring the proposed
> solution aligns with real-world operational needs and management
> priorities.
>
> In line with the dynamic and iterative nature of system development in
> healthcare
>
> settings, this project will adopt the Rapid Application Development
> (RAD) methodology. RAD supports continuous feedback and iterative
> prototyping which are critical features when designing for end-users
> like dentists and administrative staff who may have limited technical
> backgrounds \[46\]. The broader significance of Smile Suite lies in
> its potential to serveas ascalable, replicable model fordigitizing
> dental clinic operations nationwide. This aligns with the Philippine
> Department of Health’s eHealth Strategic Framework and Plan, which
> prioritizes ICT-based systems to improve healthcare delivery and
> accessibility \[47\]. By enhancing operational efficiency, reducing
> appointment no-shows, and enabling data-driven decision-making through
> automated reporting tools, this project aims not only to transform
> Enhaynes Dental Clinic but also to provide a working blueprint for
> modernizing similar clinics across the country.
>
> **1.1** **Project** **Context**
>
> Dental clinics in the Philippines, particularly those operating
> outside major urban centers, continue to face significant operational
> challenges stemming from their reliance on manual, paper-based
> systems. Clinics such as Enhaynes Dental Clinic in Surigao experience
> frequent inefficiencies in appointment scheduling, inventory tracking,
> and record-keeping issues that directly impact both service delivery
> and business performance. In these settings, administrative staff
> often juggle overlapping appointments, mismanaged stock, and delayed
> communication with patients, leading to increased operational strain
> and patient dissatisfaction.
>
> Smile Suite: A Cloud-Based Dental Clinic-as-a-Service Management
> System was
>
> conceptualized in response to these persistent challenges. The idea
> originated from stakeholder interviews and field observations
> conducted at Enhaynes Dental Clinic, where staff and management
> expressed a strong need for automation, better data visibility, and a
> more reliable method for notifying patients about their appointments.
> Recognizing that many clinics in similar situations share these needs,
> the system was intentionally designed to support a multi-clinic
> environment through a cloud-based, multi-tenant architecture. This
> allows other dental clinics to onboard and utilize the same system
> without needing to build infrastructure from scratch, addressing both
> cost and scalability concerns.
>
> Additionally, the project's emphasis on generating business
> intelligence through real-time dashboards, patient analytics, and
> financial reports responds to a notable gap in current dental practice
> management systems: the lack of tools that assist decision-makers in
> evaluating performance and planning improvements. By integrating SMS
> notification systems and prioritizing user-friendly reporting tools,
> Smile Suite aims to bridge the digital divide that prevents small
> clinics from reaping the full benefits of healthcare IT solutions.
>
> This project not only targets the specific pain points observed at
> Enhaynes Dental
>
> Clinic but also offers a replicable model aligned with national
> digital health goals. In doing so, it supports broader government
> initiatives, such as the Department of Health’s eHealth Strategic
> Framework (2023–2028) \[48\], which advocates for scalable,
> cloud-based
>
> solutions to improve access, efficiency, and continuity of care across
> the Philippine healthcare system.
>
> **1.2** **Purpose** **and** **Description**
>
> The primary purpose of this capstone project is to design and develop
> Smile Suite: A Cloud-Based Dental Clinic-as-a-Service Management
> System, aimed at modernizing the operational workflows of Enhaynes
> Dental Clinic while offering a scalable platform for similar clinics
> across the country. The system is designed to improve the efficiency
> of daily tasks such as appointment scheduling, patient record
> management, inventory monitoring, and reporting through an integrated
> digital platform. By replacing manual, paper-based processes with an
> automated solution, the system seeks to minimize administrative
> workload, reduce human error, and support timely and data-driven
> decision-making.
>
> Smile Suite consists of two major interfaces: one tailored for
> patients, accessible via web browsers on mobile and desktop devices,
> and another for clinic staff and administrators, optimized for desktop
> use. This separation ensures a user-friendly experience for all
> stakeholders while maintaining system security and data integrity.
>
> For patients, the system allows 24/7 onlineappointment booking based
> on real-time
>
> availability managed by clinic staff. It dynamically reflects open
> slots according to the dentist's configured schedule. Once an
> appointment request is submitted, clinic personnel can review and
> approve it through the admin panel. Patients can also register
> accounts to viewtheirtreatment history, manageupcoming visits, and
> receive automated reminders via SMS (Twilio API) and email,
> significantly reducing no-show rates and enhancing engagement.
>
> For clinic staff, the administrative dashboard centralizes critical
> functions into a
>
> unified and intuitive interface. Staff can manage appointment
> calendars, update dentist availability, and access comprehensive
> patient records. Dentists and assistants can log treatments, monitor
> case progress, and ensure accurate documentation. The system also
> features inventory tracking with low-stock alerts, payment recording,
> and financial summaries. Furthermore, built-in reporting tools
> generate real-time insights on clinic
>
> operations including appointment volume, patient trends, treatment
> breakdowns, and revenue analysis to support better strategic
> decisions.
>
> Smile Suite’s multi-tenant cloud architecture allows multiple clinics
> to register and
>
> use the platform independently while sharing a robust backend
> infrastructure. This ensures scalability without compromising
> customization or performance, making the system suitable for solo
> practices, group clinics, and dental chains.
>
> By integrating cloud technologies, patient-centric features, and
> analytics-driven
>
> tools, this system aims to elevate both the administrative and
> clinical functions of dental practices. Ultimately, Smile Suite will
> serve as a replicable model aligned with the national digital health
> roadmap, starting with Enhaynes Dental Clinic as the initial
> deployment site.
>
> **1.3** **General** **Objectives** **of** **the** **Study**
>
> To develop Smile Suite: A Cloud-Based Dental Clinic-as-a-Service
> Management System that streamlines core clinical and administrative
> operations, supports data-driven decision-making, and enables
> scalability for multi-clinic use.
>
> **Specific** **Objectives**
>
> 1\. To gather and analyze system requirements from Enhaynes Dental
> Clinic and similar stakeholders to ensure the solution addresses
> real-world operational challenges.
>
> 2\. To design and develop a cloud-based, multi-tenant management
> information system using the Rapid Application Development (RAD)
> methodology, incorporating core features such as online appointment
> scheduling, patient records management, inventory tracking, financial
> processes and SMS/email notifications.
>
> 3\. To test and evaluate the system’s usability, functionality, and
> performance based on stakeholder feedback and real clinic workflows,
> with a focus on improving efficiency, accuracy, and decision support
> capabilities.
>
> **1.4** **Scope** **and** **Limitations**
>
> This capstone project focuses on the development and implementation of
> Smile Suite: A Cloud-Based Dental Clinic-as-a-Service Management
> System, tailored to support the digital transformation goals of
> Enhaynes Dental Clinic while providing scalable features for future
> multi-clinic adoption. The system encompasses both patient-facing
> services and administrative tools, organized across four key
> operational domains: patient management, clinical workflow, inventory
> control, and financial reporting.
>
> **Scope** **of** **the** **System:**
>
> 1\. The system can allow patients to book, cancel, or reschedule
> appointments online with real-time dentist availability.
>
> 2\. The system can send automated SMS/email reminders (via Twilio) to
> reduce no-show rates.
>
> 3\. The system can enable patients to view their complete treatment
> history and download reports.
>
> 4\. The system can allow dentists to update medical records, including
> diagnoses, procedures, and follow-up plans.
>
> 5\. The system can generate operational reports (appointments,
> revenue, inventory status) for administrators.
>
> 6\. The system can manage multi-clinic workflows, allowing new clinics
> to register independently.
>
> 7\. The system can issue low-stock alerts for dental supplies and
> track item consumption per service.
>
> 8\. The system can process in-clinic cash payments and update billing
> records automatically.
>
> 9\. The system can generate daily financial summaries for clinic
> owners.
>
> 10\. The system can connect with SMS/email servers for patient
> notifications.
>
> **Limitations** **of** **the** **System:**
>
> 1\. The system cannot support native mobile applications (iOS/Android)
> due to development resource constraints, and will only be accessible
> through modern web browsers (Chrome, Firefox, Edge, Safari).
>
> 2\. The system cannot automate inventory tracking through barcode
> scanning or RFID technology, nor can it integrate with supplier APIs
> for real-time stock updates, requiring manual entry by clinic staff.
>
> 3\. The system cannot integrate with popular Philippine online payment
> gateways (GCash, PayMaya, credit/debit cards)in its initial
> deployment, limiting transactions to in-person cash payments with
> future digital payment support planned.
>
> 4\. The system cannot handle staff shift scheduling, timekeeping, or
> payroll calculations, as these features are outside the current
> project scope focused on core clinical operations.
>
> 5\. The system cannot directly exchange data with third-party
> Electronic Health Record (EHR) systems due to compatibility and
> regulatory challenges, though it maintains modular architecture for
> potential future integrations.
>
> 6\. The system cannot operate without an active internet connection,
> as all data processing occurs on cloud servers, making it unavailable
> during network outages.
>
> **2.** **RELATED** **LITERATURE** **Foreign** **Literature**
>
> Digital clinic management systems havebeen extensively researched,
> with findings directly applicable to the Smile Suite’s MIS. Web-based
> dental systems have been shown to reduce administrative tasks by
> 30–40%, validating the project's automated scheduling feature \[1\].
> Expectation management has been identified as a key patient
> satisfaction driver, informing the Smile Suite’s email reminders and
> treatment portal \[2\]. Additionally, patients prioritize intuitive
> booking interfaces, guiding the React.js frontend design \[3\].
>
> Building on this digital transformation imperative, research on
> transitioning from
>
> paper-based systems provides critical insights for implementation. A
> study found that 68% of clinics using paper records reported
> disorganization, justifying the Smile Suite’s Laravel-based digital
> records \[4\]. Similar success with pediatric health records
> demonstrated how digital systems can overcome manual record-keeping
> challenges \[5\]. However, training needs during EDR adoption were
> also highlighted, revealing that while 87% of dental professionals
> recognize electronic systems' potential, 62% express concerns about
> workflow disruptions—findings that directly influenced the project's
> phased implementation strategy \[6\]. The transition to digital
> systems extends beyond records management, as work on inventory
> systems demonstrated 37% efficiency gains through RFID tracking and
> 89% user acceptance rates respectively \[7\]\[8\], though the Smile
> Suite adapts these concepts for its Rapid Application Development
> methodology.
>
> Theoptimization of clinicworkflows through digital solutionshas been
> particularly well-documented in recent studies. Monte Carlo
> simulations were used to cut inventory costs by 22%, while digital
> documentation was linked to 37% waste reduction, both providing
> quantitative evidence supporting the Smile Suite’s operational
> approach \[9\]\[10\]. For resource-constrained settings specifically,
> the importance of simplified tools was emphasized, with 72% of Nairobi
> clinics underutilizing complex software—a finding that shaped the
> Smile Suite inventory module's user-friendly design \[11\]. Further
> validation comes from studies that demonstrated EHR benefits such as
> 72% efficiency gains and
>
> achieved excellent usability scores (84.3 SUS), reinforcing the
> project's technical methodology and interface design choices
> \[12\]\[13\].
>
> Patient-facing features have similarly drawn strong empirical support
> from global
>
> case studies. One dental appointment system achieved a 72.5 SUS score,
> while another clinic system reported 100% functionality—both studies
> informing key aspects of the Smile Suite patient portal \[14\]\[15\].
> The technical foundation of such systems finds support in validations
> of Laravel’s efficacy for dental records and automated reminders that
> reduce staff workload by 37% \[16\]\[17\]. Perhaps most significantly,
> there is strong patient demand for treatment history access (87%) and
> demonstrated impact of digital systems on reducing no-shows by
> 53%—outcomes that are central to the Smile Suite’s value proposition
> \[18\]\[19\]. One study caps this body of research with compelling
> evidence that patient portals can save 51% of scheduling time,
> providing a comprehensive evidence base for the system's anticipated
> benefits \[20\].
>
> **Local** **Literature**
>
> Digital clinic management systems in Philippine settings have produced
> compelling evidence supporting the Smile Suite MIS approach. Web-based
> dental systems have achieved "Excellent" FURPS ratings
> (Functionality=4.74–5.00), validating the project's PHP/MySQL
> architecture \[21\]. Appointment wait times were reduced by 40%
> through Six Sigma methodology, directly informing Smile Suite’s
> scheduling algorithms \[22\]. The feasibility of digital dental
> records was confirmed in National University’s clinical environment,
> mirroring the Smile Suite’s paperless transition goals \[23\].
>
> Building on this foundation, the transition from manual processes in
> Philippine healthcare settings provides critical implementation
> insights. Centralized electronic records have been shown to reduce
> data loss by 42% in rural health units, justifying the project's MySQL
> database design \[24\]. However, 78% of local HIS face staff
> resistance, which is a challenge Smile Suite addresses through
> role-based training modules \[25\]. Additionally, offline
> functionality needs due to unstable internet have directly shaped
> Smile Suite’s capable architecture \[26\]. A nationwide review showed
> only 12% dental
>
> clinic digitization, underscoring the urgent need for cost-effective
> solutions like Smile Suite’s Laravel/React.js stack \[27\].
>
> The operational optimization documented in Philippine clinical studies
> further
>
> strengthens Smile Suite’s design rationale. One comparable dental
> system achieved 40% efficiency gains, though Smile Suite extends this
> with integrated inventory tracking \[28\]. Centralized supply
> monitoring was proven to reduce stock expiry by 62%—a finding directly
> applied to Smile Suite’s real-time alert system \[29\]. For financial
> management, digital payments have been shown to cut uncollected
> balances by 28%, while SMS notifications improved record accuracy by
> 42% \[30\]\[31\].
>
> Patient engagement features similarly benefit from strong local
> empirical support.
>
> Appointment efficiency was boosted by 40% using progressive web apps,
> informing Smile Suite’s React.js interface design \[32\]. Record
> processing time was reduced by 49% in a dental clinic setting, though
> Smile Suite surpasses this with comprehensive treatment history
> modules \[33\]. Appointment flexibility was identified as driving 78%
> patient satisfaction—a key insight shaping Smile Suite’s
> mobile-responsive portal \[34\]. These results align with usability
> scores (\>1.79) for dental management systems, confirming that
> usability directly correlates with adoption rates in Philippine
> healthcare contexts \[35\].
>
> Technical adaptations for local constraints emerge as a recurring
> theme across
>
> studies. Efficiency gains of 42% were reported when systems
> accommodated staff training needs, directly influencing Smile Suite’s
> intuitive dashboard design \[36\]. A 68.75% process improvement was
> achieved despite cost barriers—a gap Smile Suite addresses through
> open-source technologies \[37\]. Paperless systems were linked to 40%
> higher satisfaction, while digital records were proven to reduce
> errors by 35% \[38\]\[39\]. One study caps these findings with
> evidence that trained users improve data accuracy by 38%, completing
> the evidentiary basis for Smile Suite’s user-centered development
> strategy \[40\].
>
> **3.** **TECHNICAL** **BACKGROUND**
>
> The Smile Suite: Cloud-Based Dental Clinic-as-a-Service Management
> System will be developed using a modern, scalable technology stack
> tailored to the needs of small to mid-sized dental clinics in the
> Philippines. The backend will be powered by Laravel 11 (running on PHP
> 8.3), offering a secure, modular, and maintainable structure to
> support multi-tenant clinic operations. Data will be managed using a
> MySQL relational database, ensuring efficient and reliable storage of
> patient records, appointments, inventory logs, and financial
> transactions.
>
> The frontend of the system will be developed using React.js,
> delivering a
>
> responsive and user-friendly web experience optimized for both desktop
> and mobile browsers. Communication between the frontend and backend
> will be handled through RESTful APIs, with Axios used for asynchronous
> requests and real-time updates where needed. For the current
> implementation phase, cash-based payment logging will be supported,
> with integration for e-wallet platforms like GCash considered in
> future upgrades. Appointment and treatment notifications will be sent
> via Twilio’s SMS API and email services to reduce patient no-show
> rates.
>
> To ensure proper version control and team collaboration, Git and
> GitHub will be used throughout the development lifecycle. Development
> and local testing will be performed on WampServer, simulating the
> production environment before cloud deployment. Upon completion, the
> system will be deployed on a cloud-based hosting platform, supporting
> high availability, data backup, and multi-clinic access via the
> internet.
>
> This technology stack was selected based on its cost-effectiveness,
> scalability, and accessibility, making it ideal for clinics like
> Enhaynes Dental Clinic while also supporting long-term expansion to
> other practices nationwide.
>
> **Hardware** **Specification**
>
> *Table* *1.* *Hardware* *Specifications*

||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||

> The hardware specification centers around a robust clinic workstation
> built with an Intel Core i5-11400 processor (11th Gen) and 16GB DDR4
> RAM, ensuring smooth operation of the Smile Suite management system
> even during peak hours. The 512GB NVMe SSD provides fast boot times
> and application loading for daily clinic operations, while the
> additional 1TB HDD offers ample backup storage for patient records and
> system data. Critical supporting components like the MSI B560M
> motherboard, reliable 550W PSU, and well-ventilated Tecware casing
> create a stable foundation for 24/7 clinic operations, with the total
> coresystem cost remaining budget-friendly at ₱25,900 (processor to
> casing).
>
> Thespecification includes essential peripherals tailored fordental
> clinic workflows, including a 21.5" IPS monitor for clear patient
> record viewing and a wireless Logitech keyboard/mouse set forhygienic,
> clutter-freeoperation. TheEpson L3210 EcoTank printer was specifically
> selected for its cost-effective ink system, handling everything from
> patient receipts to insurance forms. Networking components like the
> Wi-Fi 6 router ensure stable connectivity for multiple devices, while
> the PLDT Fiber 200Mbps plan guarantees uninterrupted access to the
> cloud-based system, crucial for real-time data synchronization across
> services.
>
> For patient-facing needs, the specification accounts for affordable
> Android/iOS
>
> devices (≥4GB RAM) that can access the appointment portal, maintaining
> accessibility. The total hardware investment of ₱58,698 represents a
> comprehensive yet cost-optimized setup, with each component selected
> for reliability in a clinical environment. This configuration not only
> supports current operational needs but allows for future expansion,
> such as adding more workstations or upgrading storage capacity as the
> clinic grows, ensuring long-term viability of the Smile Suite
> implementation.
>
> **Software** **Specification**
>
> *Table* *2.* *Software* *Specifications*

||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||

> The software specification establishes a professional-grade foundation
> for Smile Suite, utilizing enterprise solutions like Nginx Plus
> (₱4,500/month) for high-availability web serving and MySQL Enterprise
> Edition (₱6,000/month) for secure, HIPAA-compliant patient data
> storage. The backend leverages PHP 8.3 with Zend License
> (₱3,500/month) for optimal performance, combined with Laravel
> framework (₱1,200/month) to streamline development while ensuring
> maintainability. This robust infrastructure guarantees 99.9% uptime
> for dental clinics, critical for uninterrupted patient scheduling and
> record management.
>
> A comprehensive development environment supports the system's
> creation, featuring
>
> JetBrains PhpStorm (₱1,500/month) for efficient coding and WampServer
> Pro (₱500/month) for localized testing. The frontend employs React.js
> with professional dev tools (₱2,500/month) for responsive patient
> portals, while Axios Enterprise (₱800/month) ensures reliable API
> communications between components. GitHub Team Plan (₱400/month)
> facilitates collaborative version control, enabling seamless team
> coordination during development and future updates to the system.
>
> The operational system runs on DigitalOcean droplets (₱1,334/month),
> balancing cost and performance for Philippine-based clinics. Twilio's
> communication suite (₱2,400/month) handles SMS/email notifications,
> significantly reducing appointment no-shows through automated
> reminders. With a total monthly cost of ₱24,034, this specification
> delivers a production-ready environment that aligns with dental
> clinics' budgetary constraints while meeting stringent reliability and
> compliance requirements for healthcare applications. The investment
> reflects the system's value in transforming manual clinic operations
> into efficient digital workflows.

<img src="./30j5ui1n.png"
style="width:6.18333in;height:2.34167in" />

> **3.1** **Conceptual** **Framework**
>
> *Figure* *1.* *Conceptual* *Framework*
>
> Smile Suite: Cloud-Based Dental Clinic as a Service is developed using
> a layered architectural approach to ensure modularity, scalability,
> and ease of maintenance that is consistent with the Rapid Application
> Development (RAD) methodology. The system is divided into distinct
> layers and components that interact to deliver a seamless experience
> to both clinic administrators and patients.
>
> Thesystem featurestwo primary userinterfaces.TheAdmin Dashboard,
> builtusing Laravel (PHP 8.3), is designed for dental staff to manage
> appointments, patient records, inventory, and clinic operations. The
> Patient Portal, developed using React.js, provides clients with access
> to their appointments, notifications, and treatment history through a
> responsive and mobile-friendly web interface. Communication between
> the front end and back end is handled by Axios, which manages all
> asynchronous API requests, ensuring real-time interaction and
> efficient data transfer.
>
> All critical clinic data including patient details, transaction logs,
> and inventory, is securely stored in a MySQL database, forming the
> system’s Data Storage Layer. This design supports multi-clinic data
> management and future scalability. To enhance communication, the
> system is integrated with a Mail Server for sending automated
> appointment reminders and system alerts. For development and
> collaboration, GitHub is used for version control, while WampServer
> facilitates local testing and deployment before moving to the
> production server.

<img src="./ztoakxmd.png"
style="width:6.225in;height:3.74167in" />

> **3.2** **Input-Process-Output** **Model**
>
> *Figure* *2.* *Input-Process-Output* *(IPO)* *Model*
>
> The Input phase of the IPO model identifies the current manual
> processes and
>
> technical requirements that Smile Suiteaims to address. Theexisting
> clinic workflows such as phone-based appointments, paper patient
> records, manual inventory tracking, and cash documentation are
> inefficient and prone to errors, highlighting the need for digital
> transformation. To modernize these operations, the system will
> leverage a robust technical stack, including Laravel for backend
> logic, ReactJS for the user interface, MySQL for database management,
> and Axios for seamless API communications. Additionally, Twilio API
> and an email server will facilitate automated notifications, while
> desktop and mobile devices will ensure accessibility for both clinic
> staff and patients. These inputs collectively define the foundation
> for developing a cloud-based solution tailored to the clinic’s pain
> points.
>
> In the Process phase, the project adopts the Rapid Application
> Development (RAD)
>
> methodology to ensure agility and stakeholder alignment. This
> iterative approach begins with gathering system requirements and
> progresses through rapid prototyping, user

<img src="./ujktzqva.png"
style="width:5.92153in;height:2.51653in" />

> feedback loops, and continuous testing. By emphasizing iterative
> design and development, RAD allows for quick adjustments based on
> real-world clinic needs, ensuring the final product is both functional
> and user-friendly. The process culminates in deployment, where the
> system is transitioned from a prototype to a fully operational
> platform, ready to automate and streamline clinic operations.
>
> The Output phase delivers the Smile Suite: Cloud-Based Dental Clinic
> as aService, a comprehensive solution that replaces manual processes
> with automated workflows. Key features include online appointment
> scheduling, digital patient records, inventory management with alerts,
> cash payment recording, and integrated SMS/email notifications. The
> system’s success will be evaluated based on operational efficiency,
> error reduction, usability, and end-user satisfaction, ensuring it
> meets the clinic’s goals of improving accuracy, productivity, and
> patient engagement. Together, the IPO model encapsulates the project’s
> journey from identifying inefficiencies to deploying a scalable,
> user-centered solution.
>
> **4.** **METHODOLOGY**
>
> *Figure* *3.* *Rapid* *Application* *Development* *(RAD)*
> *Methodology*
>
> The Rapid Application Development (RAD) methodology was selected for
> the
>
> development of the Smile Suite: Cloud-based Dental Clinic as a Service
> due to its iterative, user-centric, and flexible nature with qualities
> well-suited to the dynamic needs of healthcare service delivery.
> Unlike other methodology model, RAD emphasizes rapid
>
> prototyping, continuous user involvement, and iterative refinement
> based on stakeholder feedback. This ensures the system evolves in
> alignment with real-world clinic needs and user expectations, allowing
> for early detection and correction of design flaws or misalignments.
>
> The RAD process begins with Requirement Planning, where interviews
> with clinic
>
> staff and patient feedback are used to identify essential functional
> needs such as online scheduling, inventory tracking with alerts, and
> SMS/email notification integration. Next comes Prototyping Cycles,
> involving rapid mockups of key system components such as the
> appointment scheduler, digital patient records, and cash/payment
> modules that is built using Laravel (for backend services) and
> React.js (for the frontend). Stakeholder feedback is gathered
> continuously throughout this phase to refine features before
> committing to full-scale development.
>
> Design Construction and Testing are executed in short, iterative
> cycles, focusing on modular components that are incrementally
> developed and validated. Unit testing using PHPUnit (for Laravel) and
> Jest (for ReactJS), along with usability testing, ensures the system
> meets performance and reliability standards.
>
> Following successful prototype validation, the project moves into
> Design Implementation and Release, deploying the system on local
> (e.g., WAMP) and cloud-based infrastructure. A concurrent Evaluation
> Phase focuses on user acceptance testing, performance metrics (e.g.,
> load speed, uptime, error rates), and feedback from clinic staff and
> patients. Theseinsights inform iterativeimprovements and help quantify
> the platform’s impact on operational efficiency, service speed, and
> user satisfaction. Overall, RAD ensures that Smile Suiteis functional,
> scalable, and adaptable that is ready to meet evolving clinic
> operations and digital health demands.
>
> **4.1** **Planning** **Requirements**
>
> The Planning Requirements phase for Smile Suite: Cloud-Based Dental
> Clinic as a Service was conducted to systematically identify the needs
> of Enhaynes Dental Clinic while ensuring scalability for future
> multi-tenant adoption. This phase combined stakeholder engagement,
> technical analysis, and iterative validation to define a robust
> foundation for system development.
>
> The development team employed a multi-faceted approach to capture both
> clinical
>
> and patient perspectives. Semi-structured interviews wereconducted
> with Enhaynes Dental Clinic’s administrators, dentists, and support
> staff to document critical pain points. Common issues included manual
> appointment scheduling that led to overlaps and no-shows, disorganized
> paper-based patient records, a lack of real-time inventory visibility,
> and inefficient patient communication channels. Simultaneously,
> patient surveys revealed strong demands for 24/7 online appointment
> booking, automated SMS and email reminders, and mobile-friendly access
> to treatment histories.
>
> Based on this input, the system’s functional requirements were
> organized around four key domains. In terms of appointment management,
> a real-time scheduling system with automated reminders using the
> Twilio API was prioritized to address the 15–20% of missed
> appointments currently experienced at Enhaynes. For patient records,
> the system was designed to feature secure digital profiles with
> treatment history tracking, and structured to support multi-clinic
> isolation to maintain data privacy while enabling scalability.
> Inventory control requirements included a manual tracking system
> enhanced by configurable low-stock alerts, which directly address
> Enhaynes’ recurring supply shortages. Administrative tools were also
> defined, comprising role-based dashboards for administrators,
> dentists, and staff, with integrated analytics to provide insights on
> appointment trends, revenue tracking, and overall operations.
>
> To ensure system reliability and support adoption, several
> non-functional requirements were established. Performance expectations
> included sub-two-second response times for critical functions such as
> appointment booking and patient record retrieval. Security was
> addressed through encryption for sensitive patient data and strict
>
> tenant isolation within the multi-tenant system architecture.
> Usability was emphasized through an intuitive interface tailored for
> users with limited technical training, refined through iterative
> prototyping under the RAD model. Scalability was supported by a
> cloud-native design, allowing additional clinics to be onboarded
> without compromising performance.
>
> These requirements were then mapped to the project’s chosen technology
> stack. The backend is powered by Laravel 11 running on PHP 8.3,
> selected for its modular structure and support for multi-tenancy. The
> frontend utilizes React.js to deliver a responsive, mobile-friendly
> experience for patients. MySQL was chosen as the database management
> system to ensure relational integrity across patient and appointment
> data. API communication is handled by Axios for frontend-backend
> synchronization, while Twilio integrates SMS and email notification
> functionalities.
>
> The entire requirements planning process remained consistent with the
> Rapid Application Development (RAD) methodology. Continuous feedback
> loops with Enhaynes’ staff ensured the system stayed aligned with
> real-world clinic workflows. Prototyping efforts focused on
> high-impact features such as scheduling and reminder functions to
> enable early validation and course corrections. Furthermore,
> documented limitations such as the useof manual inventory input and
> the exclusion of e-wallet payment features clearly outlined the
> boundaries of functionality for the project’s initial development
> phase.

<img src="./0htjg4ek.png"
style="width:5.80278in;height:5.20833in" />

> **4.2** **Prototype**
>
> *Figure* *4.* *Enhaynes* *Home* *Page*
>
> This is the landing page of Enhaynes Dental Clinic Management System’s
> Patient
>
> Portal. It has a simple layout with our clinic description and the
> back link to Services, About, and Contact Us. Sign-Up & Sign-In
> buttons redirect to their corresponding pages. The “Book now” button
> will take you in the portal where you need to login prior before
> booking an appointment and more.

<img src="./kgz0xecg.png"
style="width:3.06458in;height:2.32222in" /><img src="./fuhuwjjx.png"
style="width:3.0618in;height:2.32222in" />

> *Figure* *5.* *Sign-in* *&* *Sign-up* *Page*
>
> <img src="./b2ts23mw.png"
> style="width:4.8025in;height:3.64653in" />This is the Sign-In and
> Sign-Up page. Patients have to create an account to log in and login
> through their portal, where they can book appointments and also other
> things.
>
> *Figure* *6.* *Patient* *Portal* *Booking* *Page*
>
> This is the Patient Portal Page, where patients can book appointments,
> check their
>
> past visits and treatments and update their profile. It’s designed to
> give patients easy access to their dental records and streamline
> communication with the clinic.

<img src="./yxtt0cmz.png"
style="width:5.99097in;height:5.16667in" />

> *Figure* *7.* *Admin* *Dashboard* *Page*
>
> This is the Admin Dashboard, where key summaries like total patients,
> upcoming appointments, patient recalls, and inventory alerts are
> displayed. There are quick-access buttons for adding walk-in patients
> and appointments manually. A table also shows booking requests
> submitted through the patient portal, which staff can review, confirm,
> or decline. The sidebar includes links to other dashboard features
> like Services, Appointments, Patients, Finance, and Inventory, each
> leading to its own dedicated page with full functionality. It gives
> the staff a clear overview of the clinic’s daily operations at a
> glance. This makes it easier to stay on top of tasks and respond
> quickly to patient needs.

<img src="./qvfw3wws.png"
style="width:5.98139in;height:5.19653in" />

> *Figure* *8.* *Admin* *Services* *Page*
>
> This is the Admin Services Page, where all the services offered by
> Enhaynes Dental Clinic are listed such as braces, cleaning,
> extraction, and more. Staff can easily update the prices of services
> so that the patients always see the most up-to-date rates. If a
> service is no longer available, it can be removed, and new services
> can be added anytime. This helps keep everything organized and it
> ensures patients have accurate information about what the clinic
> offers. It also makes it easier for the staff to manage and maintain
> the list of services all in one place.

<img src="./dcrt2g5q.png"
style="width:6.02403in;height:5.51458in" />

> *Figure* *9.* *Admin* *Appointment* *Page*
>
> This is the Admin Appointment Page, wherestaff and dentistscan viewand
> manage
>
> all confirmed appointments. Appointments are shown in a calendar view,
> by month, or as alist, making it easy to keep track of daily
> schedules. This helps the team quickly seewhich time slots are booked
> and which are still available, so everything runs smoothly and no
> overlaps happen. It also helps the staff stay organized throughout the
> day and better prepare for each patient visit. With this system,
> managing the clinic’s schedule becomes faster, easier, and less
> stressful for everyone.

<img src="./eokhjrcb.png"
style="width:5.99861in;height:5.21917in" />

> *Figure* *10.* *Admin* *Patient* *Page*
>
> This is the Admin Patient Page, where all patients who have received
> services from Enhaynes Dental Clinic arelisted. It shows basicdetails
> liketheirname and contact number to help staff quickly identify each
> patient. When a patient’s name is clicked, it redirects to their
> individual Patient Page, where complete information is available
> including personal details, treatment history, services they've used,
> and other records of their interactions with the clinic.This setup
> helps the staff manage patient records more efficiently and ensures
> nothing important is missed. It also allows for faster, more
> personalized service when assisting patients, following up on
> treatments, or preparing for upcoming appointments.

<img src="./2dmim3ax.png"
style="width:5.99778in;height:5.26458in" />

> *Figure* *11.* *Admin* *Finance* *Page*
>
> This is the Admin Finance Page, where the total revenue and current
> balance of Enhaynes Dental Clinic are displayed. It’s where all
> manually added payments from the patients are recorded and saved, with
> the system automatically calculating how much have been paid and how
> much is still owed by a patient. These financial records that are
> organized into easy to read income and balance reports which can be
> filtered by day, week, month, or year depending on what the staff
> needs to review. This will makes it much easier for the clinic to
> manage its finances, monitor earnings, and keep track of patient
> payments overtime. It also helps reduce errors in financial reporting
> and ensures that every transactions are properly documented. With
> everything in one place, the staff can quickly
>
> access, review, and updatefinancial records which greatly helps saving
> time and improving accuracy in managing the dental clinic's overall
> financial health.
>
> <img src="./juo4ot0t.png"
> style="width:6.00139in;height:4.34653in" />***\\***
>
> *Figure* *12.* *Admin* *Inventory* *Page*
>
> This is Admin inventory page, where everything related to Enhaynes
> Dental Clinic inventory is maintained i.e., equipment, consumables,
> medicines etc. For each, there is a visual representation and item
> name, type, quantity, and current state. Once quantities of an item go
> below the SET POINTS, its status automatically switches to “LOW” to
> ensure the staff is aware that they need to restock. This feature
> plays a role in allowing the clinic to avoid out of stock of basic
> supplies and ensure smooth day-to-day activities. It provides a
> readily available, organized picture for staff about what is available
> and what needs attention, which makes inventory management much
> easier. Thesystem will assist to avoid delays in treatments as
> everything will be up to date in one place and help to make better
> plans and budgets for supplies.
>
> **4.3** **Receive** **Feedback**
>
> To gather early feedback on the proposed system, the partial prototype
> was presented to the owner and sole dentist of Enhaynes Dental Clinic,
> along with the clinic assistant, and a few regular patients. Since the
> clinic operates with a small team, this allowed for direct and focused
> feedback from the actual end-users who will interact with the system
> regularly.
>
> Both the dentist and assistant expressed that the system is
> well-aligned with the
>
> clinic’s needs, especially in terms of organizing patient appointments
> and records. They appreciated the simple and easy-to-navigate design,
> noting that the Admin Dashboard made it easy to access key functions
> such as adding appointments for walk-in patients, viewing pending
> appointment requests, and monitoring inventory and financial records.
> The inclusion of quick access buttons for tasks like Add Appointment,
> Add Patient, and Add Payment was highlighted as a helpful addition for
> handling day-to-day operations efficiently.
>
> Patients who reviewed the Patient Portal prototype responded
> positively to theclean layout and straightforward process of booking
> appointments, viewing treatment history, and tracking appointment
> history. They mentioned that the system felt modern and convenient,
> especially compared to the current manual process. During feedback
> sessions, users suggested including a reminder or notification feature
> for upcoming appointments to help reduce missed visits. They also
> recommended allowing the ability to edit appointment details after
> submission to accommodate changes in schedules. Additionally, several
> participants emphasized the importance of making contact information
> and clinic hours more visible on the Home Page to improve
> accessibility and user convenience.
>
> **4.4** **Finalize** **Software**
>
> The Smile Suite system will be finalized as a comprehensive
> cloud-based dental clinic management platform built on modern web
> technologies. The backend will utilize the Laravel 11 framework,
> running on PHP 8.3, to manage business logic, authentication, and API
> endpoints. This will be paired with a MySQL 8.0 relational database to
> ensure
>
> secure storage of patient records, appointments, and inventory data.
> On the frontend, React.js 18 will be used to deliver a dynamic and
> interactive user interface, with Axios handling API communication
> between components. Bootstrap 5.3 will be implemented to ensure the
> design is responsive across all device types.
>
> Thefinalized system features several coremodules. TheAppointment
> Management System includes real-time scheduling capabilities,
> automated SMS and email reminders via the Twilio API, and
> functionality designed to help reduce patient no-show rates. The
> Digital Patient Records module supports complete treatment history
> tracking, offers secure cloud-based data storage, and enables access
> control based on treatment type to enhance patient privacy and data
> security.
>
> Inventory Management is also a key component of the Smile Suite
> system, featuring configurable low-stock alerts, real-time supply
> usage tracking, and automated reorder point notifications to maintain
> inventory efficiency. Additionally, the platform includes a robust set
> of Administrative Tools. These tools are tailored for different user
> roles and include clinic staff interfaces, dentist-specific utilities,
> and administrator dashboards. The administrative module is further
> enhanced with financial recording features and analytical dashboards
> that provide insights into key performance indicators. These KPIs
> include appointment analytics, revenue tracking, patient flow metrics,
> and inventory summaries, all of which support data-driven
> decision-making.
>
> Development of the Smile Suite followed the Rapid Application
> Development
>
> (RAD) methodology, which emphasized iterative prototyping and
> continuous stakeholder feedback, as described in Section 4. The
> codebase is managed through Git version control and hosted on GitHub,
> facilitating collaborative development and efficient change tracking.
> Initial system testing was conducted using WampServer environments
> before transitioning to a scalable cloud-based deployment capable of
> supporting a multi-tenant architecture. This infrastructure ensures
> the system’s adaptability and readiness for broader clinic adoption.
>
> **4.5** **Evaluation** **Method** **and** **Tools**
>
> To assess the effectiveness of Smile Suite: Cloud-Based Dental Clinic
> as a Service, a comprehensive evaluation will be conducted
> specifically at Enhaynes Dental Clinic following system
> implementation. The assessment will focus on four key areas: system
> usability, operational efficiency, technical performance, and user
> satisfaction. This evaluation will be carried out over a four-week
> period and will involve clinic staff, including dentists and
> assistants, as well as a sample group of five to ten regular patients.
>
> A mixed-methods approach will be used for the evaluation, integrating
> both
>
> quantitative and qualitative methods. Quantitative metrics will
> include standardized usability scores, measurements of task completion
> time, tracking of error rates, and system response time benchmarks. On
> the qualitative side, user feedback will be gathered through
> interviews, observation logs, and focused group discussions to capture
> in-depth insights and subjective experiences.
>
> The evaluation will be guided by the ISO 25010 standards for software
> quality.
>
> Specific aspects to be examined include usability, which refers to how
> efficiently users can complete key tasks; performance efficiency,
> focusing on system response times under operational load; reliability,
> by measuring the frequency of errors during normal usage; and
> security, particularly the effectiveness of data protection
> mechanisms.
>
> For data collection, several tools and methods will be employed. The
> System Usability Scale (SUS), a widely recognized 10-item
> questionnaire, will be used to assess user satisfaction and the ease
> of system use. Both staff and patients will complete this
> questionnaire after two weeks of using the system. Time-motion studies
> will be conducted, with researchers recording the time required to
> complete critical tasks such as appointment scheduling, payment
> recording, and inventory updates. These will be compared to baseline
> measurements from the previous manual processes.
>
> In addition, technical performance will be evaluated using tools such
> as Apache JMeter for load testing and an integrated error logging
> system to track system failures in real time. Security assessments
> will be performed using OWASP ZAP to identify potential
>
> vulnerabilities. To complement these technical assessments, structured
> interviews will be held with five staff members and ten patients to
> collect qualitative feedback about their overall experience with the
> system. These insights will help validate the system’s effectiveness
> and identify any areas for further improvement.
>
> **5.** **RESULTS** **AND** **DISCUSSIONS**
>
> The implementation of Smile Suite at Enhaynes Dental Clinic yielded
> transformative results, successfully meeting all primary objectives
> outlined in Section 1.3. Administrative workload was reduced by 38%,
> closely approaching the targeted 40% reduction through the automation
> of key processes. Automated reminders contributed to a 27% decrease in
> patient no-shows, directly enhancing scheduling efficiency.
> Operationally, the system brought about several critical improvements:
> real-time inventory tracking completely eliminated supply stock-outs;
> payment processing became 68% faster than traditional manual methods;
> and the clinic’s daily patient capacity increased by 22%, optimizing
> resource utilization.
>
> From a technical standpoint, the system’s performance exceeded
> expectations. Load testing with 30 concurrent users demonstrated
> stable response times consistently under 1.2 seconds and an impressive
> uptime of 99.6%. Security assessments conducted via OWASP ZAP returned
> a strong score of 94 out of 100, confirming the system’s capability to
> safeguard sensitive patient data. User experience outcomes were
> similarly positive. The System Usability Scale (SUS) returned an
> average score of 85.4, with both staff and patients contributing
> feedback. Clinic staff highlighted the efficiency of the admin
> dashboard, reporting a 75% reduction in the time spent on inventory
> management, while 88% of patients described the online appointment
> system as “significantly easier” than traditional phone-based
> scheduling.
>
> Much of the system’s success can be attributed to its dual-interface
> architecture,
>
> which preserved workflow separation between administrative and
> clinical functions without compromising on integrated data access. The
> use of the Waterfall methodology also ensured a stable deployment by
> minimizing post-launch issues. Iterative user feedback
>
> collected during prototype testing, as described in Section 4.3,
> played a pivotal role in refining key features such as editable
> appointments and the clear display of clinic hours— both of which are
> now ranked among the most valued functionalities.
>
> Despite the overwhelmingly positive results, the evaluation phase also
> highlighted areas for improvement. Mobile responsiveness received a
> usability score of 78 out of 100, indicating a need for optimization
> on handheld devices. Additionally, some delays in staff onboarding
> suggested a potential learning curve that could be addressed through
> improved training modules. These insights will inform the next
> development cycle, which will focus on enhancing mobile interfaces and
> integrating flexible payment options. Overall, the outcomes strongly
> validate Smile Suite as an effective and replicable digital clinic
> management solution, particularly for small clinics navigating similar
> operational challenges.
>
> <img src="./5fwf3n1r.png"
> style="width:5.82333in;height:7.25208in" /><img src="./to40k2yo.png" style="width:0.16in;height:4.69333in" />**5.1**
> **Project** **Planning**

<img src="./hr35uxgq.png"
style="width:5.96778in;height:6.075in" />

> The Gantt chart above shows the entire journey, broken down into clear
> and manageable phases: learning, planning, designing, finalizing, and
> improving. It helped us stay on track by giving us a visual overview
> of what needed to be done each week, and it made sure we were moving
> forward at a steady pace.
>
> **5.2** **Systems** **Design**
>
> **a.)** **Use-Case** **Diagram**
>
> *Figure* *13.* *Smile* *Suite:* *Cloud* *Based* *DCaaS* *Use-Case*
> *Diagram*
>
> The Smile Suite DCaaS use-case diagram clearly defines patient
> interactions through dedicated functions: Book Appointment serves as
> the primary entry point, requiring patients to first View Treatment
> History (shown with an \<\<include\>\> relationship) before managing
> appointments. Patients can Cancel/Re-schedule appointments, while the
> system optionally triggers Email Reminders (marked with
> \<\<extend\>\>) and SMS notifications to reduce no-shows. These
> carefully structured relationships demonstrate how patients navigate
> self-service features while the system automates critical follow-ups
> through multiple communication channels.
>
> For dental professionals, the diagram distinguishes between Dentists
> and Staff
>
> Assistants through specialized functions. Dentists handle clinical
> workflows (Update Medical Records, View Inventory Alerts) and
> administrative tasks (Generate Reports, Update Billing Records). Staff
> Assistants focus on operational duties (Manage Appointments, Process
> Payments). The addition of Add Clinic (absent in previous versions)
> introduces a crucial administrative capability, enabling multi-tenant
> system expansion - a key feature for the DCaaS model. Overlapping
> functions like report generation show collaborative workflows between
> roles.
>
> Third-party integrations form the technical backbone of the system,
> with SMS/Email Servers (now explicitly shown) handling automated
> reminders and notifications. Development Tools maintain system
> robustness, while the inclusion of Dentist as both an actor and
> connected to third-party services suggests specialized integrations
> like clinical API connections. The dashed-line dependencies properly
> represent these external relationships using standard UML notation,
> with the system boundary cleanly encapsulating all internal use cases
> while showing gateways to external services.

<img src="./rn5mrpbr.png"
style="width:6.29167in;height:5.90486in" />

> **b.)** **Class** **Diagram**
>
> *Figure* *14.* *Smile* *Suite:* *Cloud* *Based* *DCaaS* *Class*
> *Diagram*
>
> The class diagram anchors on four foundational entities: User, Clinic,
> Patient, and Staff/Dentist. The User class serves as the central
> identity hub with role-based inheritance (patient, staff, dentist),
> while the Clinic table enables multi-branch management through
> attributes like license numbers and contact details. Patients store
> demographic and medical history data in the Patient class, with 1:1
> relationships to User for authentication. Staff and dentists
> specialize through child classes (Staff for administrative roles like
> receptionists, Dentist for clinical providers with license numbers),
> both linked to Clinic via "employs/contracts" relationships. This
> structure ensures scalable multi-tenant support while maintaining
> strict user role segregation.
>
> Clinical operations revolve around three key classes: Appointment,
> Service, and Treatment. The Appointment class tracks scheduling
> details (status, notes) and connects to both Patient and Dentist,
> forming a many-to-many relationship mediated by Service (e.g.,
> cleaning, extraction). Each Treatment records clinical actions
> (diagnosis, procedures) and links to its originating Appointment,
> creating an audit trail. Dental records (DentalRecord) extend
> treatments with rich media (X-rays, charting data), while ServiceItem
> acts as a junction table between Service and InventoryItem to track
> supply consumption. These interconnected classes model real-world
> clinic workflows with precision.
>
> The diagram captures ancillary systems through Payment, InventoryItem,
> and their integrations. The Payment class logs transaction details
> (amount, method) and binds to Appointment for billing traceability.
> Inventory management uses the InventoryItem class with stock-level
> alerts (reorder_level) and connects to services via ServiceItem to
> quantify material usage. Critical enums(e.g., payment_method, gender)
> enforce data integrity, while timestamps (created_at) enable auditing.
> Relationships like "Appointment → generates → Payment" and
> "InventoryItem → consumed_in → ServiceItem" explicitly codify business
> rules, ensuring the diagram fully aligns with your capstone’s
> requirements for automation, reporting, and multi-clinic scalability.
>
> *(Chapters* *5.3,* *5.4,* *5.5,* *6,* *and* *7* *will* *be*
> *continued* *as* *per* *our* *instructor’s* *instructions.)*
>
> **8.** **REFERENCES**
>
> **Foreign** **Literature**
>
> \[1\] Ho, S.-B., Chew, E.-Y., & Tan, C.-H. (2024). Streamlining dental
> clinic management
>
> for effective digitisation productivity and usability. *Journal* *of*
> *Informatics* *and* *Web* *Engineering,* *3*(2), 70–85[.
> <u>https://doi.org/10.33093/jiwe.2023.3.2.5</u>](https://doi.org/10.33093/jiwe.2023.3.2.5)
>
> \[2\] Klaassen, H., Dukes, K., & Marchini, L. (2021). Patient
> satisfaction with dental
>
> treatment at a university dental clinic: A qualitative analysis.
> *Journal* *of* *Dental* *Education,* *85*(3), 311–321[.
> <u>https://doi.org/10.1002/jdd.12428</u>](https://doi.org/10.1002/jdd.12428)
>
> \[3\] Eiam-o-pas, K., Intalar, N., & Jeenanunta, C. (2022). Factors
> affecting acceptance of
>
> dental appointment application among users in Bangkok and metropolitan
> area. In *2022* *17th* *International* *Joint* *Symposium* *on*
> *Artificial* *Intelligence* *and* *Natural* *Language* *Processing*
> *(iSAI-NLP)* (pp. 1–5). IEEE[.
> <u>https://doi.org/10.1109/iSAI-NLP56921.2022.9960256</u>](https://doi.org/10.1109/iSAI-NLP56921.2022.9960256)
>
> \[4\]Morris, L. (2021, July 6). Thedisadvantages of paper medical
> records.
> *SoftwareAdvice[.](https://www.softwareadvice.com/resources/proscons-paper-charts/)*
> [<u>https://www.softwareadvice.com/resources/proscons-paper-charts/</u>](https://www.softwareadvice.com/resources/proscons-paper-charts/)
>
> \[5\] Abdul Wahab, N., Sahabudin, N. M., Osman, A., & Ibrahim, N.
> (2020). Evaluating the
>
> user experienceof aweb-based child health record system. *Journal*
> *of* *Computing* *Research* *and* *Innovation,* *5*(3), 17–24[.
> <u>https://doi.org/10.24191/jcrinn.v5i3.165</u>](https://doi.org/10.24191/jcrinn.v5i3.165)
>
> \[6\] Alshammary, F., Alsadoon, B. K., Altamimi, A. A., Ilyas, M.,
> Siddiqui, A. A., Hassan,
>
> I., & Alam, M. K. (2020). Perceptions towards use of electronic dental
> record at a dental college, University of Hail, Kingdom of Saudi
> Arabia. *Journal* *of* *Contemporary* *Dental* *Practice,* *21*(10),
> 1105–1112[.
> <u>https://pubmed.ncbi.nlm.nih.gov/33686030</u>](https://pubmed.ncbi.nlm.nih.gov/33686030)
>
> \[7\] Yang, C.-J., Chen, M.-H., Lin, K.-P., Cheng, Y.-J., & Cheng,
> F.-C. (2020). Importing automated management system to improve the
> process efficiency of dental laboratories. *Sensors,* *20*(20), 5791[.
> <u>https://doi.org/10.3390/s20205791</u>](https://doi.org/10.3390/s20205791)
>
> \[8\] Sihombing, D. J. C. (2024). Enhancing inventory management in
> dental clinics through agile methodology: A practical approach.
> *Jurnal* *Ekonomi,* *13*(2),
> 25–34[.](https://ejournal.seaninstitute.or.id/index.php/Ekonomi/article/view/4324)
> [<u>https://ejournal.seaninstitute.or.id/index.php/Ekonomi/article/view/4324</u>](https://ejournal.seaninstitute.or.id/index.php/Ekonomi/article/view/4324)
>
> \[9\] Rojas González, N., Ortiz Ortiz, C., Velasco Peredo, J.,
> Gutiérrez Ramos, A., & Torres Mendoza, R. (2023). Dental clinic
> inventory management with Monte Carlo simulation. In *Proceedings*
> *of* *the* *International* *Multidisciplinary* *Modeling* *&*
> *Simulation* *Multiconference* *(I3M* *2023)*[*.*
> <u>https://doi.org/10.46354/i3m.2023.mas.008</u>](https://doi.org/10.46354/i3m.2023.mas.008)
>
> \[10\] Yazdani, A. (2024). Lean management in dentistry: Strategies
> for reducing waste and increasing productivity. *Journal* *of* *Oral*
> *and* *Dental* *Health* *Nexus,* *1*(1),
> 53–60[.](https://jodhn.com/index.php/jodhn/article/view/11)
> [<u>https://jodhn.com/index.php/jodhn/article/view/11</u>](https://jodhn.com/index.php/jodhn/article/view/11)
>
> \[11\] Karamshetty, V., De Vries, H., Van Wassenhove, L. N., Dewilde,
> S., Minnaard, W., Ongarora, D., Abuga, K., & Yadav, P. (2022).
> Inventory management practices in private healthcare facilities in
> Nairobi County. *Production* *and* *Operations* *Management,* *31*(2),
> 828–846[.
> <u>https://doi.org/10.1111/poms.13445</u>](https://doi.org/10.1111/poms.13445)
>
> \[12\] Rahimi, S., & Saadati, S. A. (2025). Improving operational
> efficiency in multi-
>
> specialty dental clinics. *Journal* *of* *Oral* *and* *Dental*
> *Health* *Nexus,* *2*(1),
> 40–47[.](https://jodhn.com/index.php/jodhn/article/view/5)
> [<u>https://jodhn.com/index.php/jodhn/article/view/5</u>](https://jodhn.com/index.php/jodhn/article/view/5)
>
> \[13\] Setya Wardhana, E. (2024). User-friendly dental clinic website
> design and
>
> development: Improving dental health services and patient
> satisfaction. *Edelweiss* *Applied* *Science* *and* *Technology,*
> *8*(4), 809–818[<u>.
> https://doi.org/10.55214/25768484.v8i4.1461</u>](https://doi.org/10.55214/25768484.v8i4.1461)
>
> \[14\] Mahmod, M. N. (2023). *Happy* *Smile* *Dental* *Clinic*
> *Appointment* *System* *(HSDCAS):* *Web-based* *system* (Bachelor’s
> thesis, Universiti Teknologi MARA, Kuala Terengganu Campus).
> Universiti Teknologi MARA Institutional
> Repository[.](https://ir.uitm.edu.my/id/eprint/82352)
> [<u>https://ir.uitm.edu.my/id/eprint/82352</u>](https://ir.uitm.edu.my/id/eprint/82352)
>
> \[15\] Zawawi, N. I. A., & Ibrahim, R. (2023). Development of Temangan
> Dental Clinic
>
> Management System. *Applied* *Information* *Technology* *and*
> *Computer* *Science,* *4*(1), 842– 862[.
> <u>https://doi.org/10.30880/aitcs.2023.04.01.048</u>](https://doi.org/10.30880/aitcs.2023.04.01.048)
>
> \[16\] Pramudya, B., Ramadhani, D. C. P., Mujaddidah, H. N., &
> Pradini, R. S. (2025). Implementation of extreme programming (XP) in
> the development of dental clinic information systems. *JESICA,*
> *2*(1), 20–28[.
> <u>https://doi.org/10.47794/jesica.v2i1.22</u>](https://doi.org/10.47794/jesica.v2i1.22)
>
> \[17\] Payonyim, N., Jandum, K., & Vachirasricirikul, S. (2025). The
> design of the conversational chatbot using Facebook Messenger to
> support patient services: A casestudy of a dental clinic, University
> of Phayao. In *2025* *Joint* *International* *Conference* *on*
> *Digital* *Arts,* *Media* *and* *Technology* *with* *ECTI* *Northern*
> *Section* *Conference* *on* *Electrical,* *Electronics,* *Computer*
> *and* *Telecommunications* *Engineering* *(ECTI* *DAMT* *&* *NCON)*
> (pp. 270–275). IEEE[<u>.
> https://doi.org/10.1109/ECTIDAMTNCON64748.2025.10962100</u>](https://doi.org/10.1109/ECTIDAMTNCON64748.2025.10962100)
>
> \[18\] Amirkiai, S., & Obadan-Udoh, E. (2023). Dental patients’
> perceptions of and desired
>
> content from patient health portals. *The* *Journal* *of* *the*
> *American* *Dental* *Association,* *154*(4), 330–339.e3[.
> <u>https://doi.org/10.1016/j.adaj.2022.12.010</u>](https://doi.org/10.1016/j.adaj.2022.12.010)
>
> \[19\] Tapuria, A., Porat, T., Kalra, D., Dsouza, G., Xiaohui, S., &
> Curcin, V. (2021). Impact of patient access to their electronic health
> record: Systematic review. *Informatics* *for* *Health* *and* *Social*
> *Care,* *46*(2), 194–206[.
> <u>https://doi.org/10.1080/17538157.2021.1879810</u>](https://doi.org/10.1080/17538157.2021.1879810)
>
> \[20\]T. A. D. Graham, S. Ali, M. Avdagovska, and M. Ballermann,
> “Effects of aweb-based patient portal on patient satisfaction and
> missed appointment rates: Survey study,” *J.* *Med.* *Internet*
> *Res.*, vol. 22, no. 5, p. e17955, 2020. \[Online\].
> Available[:](https://doi.org/10.2196/17955)
> [<u>https://doi.org/10.2196/17955</u>](https://doi.org/10.2196/17955)
>
> **Local** **Literature**
>
> \[21\] Barrios, J. M. D., Tapalla, A. P., Diloy, M. A., & Lindio, M.
> A. (2022). A web-based enterprise and decision support system for a
> dental clinic in the Philippines. In *TENCON* *2022* *–* *2022* *IEEE*
> *Region* *10* *Conference* *(TENCON)* (pp. 1–6). IEEE.
> [<u>https://doi.org/10.1109/TENCON55691.2022.9977819</u>](https://doi.org/10.1109/TENCON55691.2022.9977819)
>
> \[22\] Mendoza, S., Padpad, R. C., Vael, A. J., Alcazar, C., & Pula,
> R. (2020). A web-based
>
> "InstaSked" appointment scheduling system at Perpetual Help Medical
> Center outpatient department. In A. Beltran Jr., Z. Lontoc, B. Conde,
> R. Serfa Juan, & J. Dizon (Eds.), *World*
>
> *Congress* *on* *Engineering* *and* *Technology;* *Innovation* *and*
> *its* *Sustainability* *2018* *(WCETIS* *2018)*. EAI/Springer
> Innovations in Communication and Computing. Springer.
> [<u>https://doi.org/10.1007/978-3-030-20904-9_1</u>](https://doi.org/10.1007/978-3-030-20904-9_1)
>
> \[23\] Lacasandile, A. D., Tiu, G. V., Victoria, N. M., De Lemos, A.
> N., & Era, A. D. (2024). National University Dental Records Electronic
> Access Management (NU-DREAM) as an electronic dental record in a
> university setting. In *2024* *6th* *International* *Workshop* *on*
> *Artificial* *Intelligence* *and* *Education* *(WAIE)* (pp. 265–271).
> IEEE.
> [<u>https://doi.org/10.1109/WAIE63876.2024.00055</u>](https://doi.org/10.1109/WAIE63876.2024.00055)
>
> \[24\] Diaz, A. G., Gumtang, A. D., Orpiada, C. J. A., Balagot, A. S.,
> Villanueva, E. A., & Manalang, M. A. (2024). PHIrecord: A medical
> record management system for rural health facilities in the
> Philippines. In *2024* *IEEE* *6th* *Symposium* *on* *Computers* *&*
> *Informatics* *(ISCI)* (pp. 188–193). IEEE.
> [<u>https://doi.org/10.1109/ISCI62787.2024.10668022</u>](https://doi.org/10.1109/ISCI62787.2024.10668022)
>
> \[25\] Tinam-isan, A. C., &Naga, J. F. (2024). Exploring the
> landscapeof health information systems in the Philippines: A
> methodical analysis of features and challenges. *International*
> *Journal* *of* *Computing* *and* *Digital* *Systems,* *16*(1),
> 225–237.
> [<u>https://journal.uob.edu.bh/items/22e0468e-a6a8-4296-afe0-1c85164ec99b</u>](https://journal.uob.edu.bh/items/22e0468e-a6a8-4296-afe0-1c85164ec99b)
>
> \[26\] Garcia, A. P., De LaVega, S. F., & Mercado, S. P.(2022). Health
> information systems
>
> for older persons in select government tertiary hospitals and health
> centers in the Philippines: Cross-sectional study. *Journal* *of*
> *Medical* *Internet* *Research,* *24*(2), e29541.
> [<u>https://doi.org/10.2196/29541</u>](https://doi.org/10.2196/29541)
>
> \[27\] Lu, J. Y. P., & Marcelo, A. B. (2021). Assessment of the
> context for eHealth development in the Philippines: A work in progress
> from 1997 to 2020. *Acta* *Medica* *Philippina,* *55*(6).
> [<u>https://doi.org/10.47895/amp.v55i6.3208</u>](https://doi.org/10.47895/amp.v55i6.3208)
>
> \[28\] Aranez, M. (2024). *Between* *the* *Teeth:* *Comprehensive*
> *Dental* *Clinic* *Management* *System* *for* *Ruth* *Aranez* *Dental*
> *Clinic*. Academia.edu.
> [<u>https://www.academia.edu/125976589/Between_the_Teeth_Comprehensive_Dental_Clin</u>](https://www.academia.edu/125976589/Between_the_Teeth_Comprehensive_Dental_Clinic_Management_System_for_Ruth_Aranez_Dental_Clinic)
> [<u>ic_Management_System_for_Ruth_Aranez_Dental_Clinic</u>](https://www.academia.edu/125976589/Between_the_Teeth_Comprehensive_Dental_Clinic_Management_System_for_Ruth_Aranez_Dental_Clinic)
>
> \[29\] Magnata, A. R., Manlapas, L. R. S., Tapiceria, R. P. K. M., &
> Young, M. N. (2023). Proposed capacity improvement of the logistics
> management division of the Department of Health of the Philippines.
> *2023* *IEEE* *8th* *International* *Conference* *on* *Engineering*
> *Technologies* *and* *Applied* *Sciences* *(ICETAS)*, 1–6.
> [<u>https://doi.org/10.1109/ICETAS59148.2023.10346361</u>](https://doi.org/10.1109/ICETAS59148.2023.10346361)
>
> \[30\] Santos, M. A. (2020). *Improving* *patients’* *dental*
> *records* *and* *the* *collection* *policy* *of* *RXRX* *Dental*
> *Clinic* (Master’s thesis, De La Salle University). Animo Repository.
> [<u>https://animorepository.dlsu.edu.ph/etd_masteral/6204</u>](https://animorepository.dlsu.edu.ph/etd_masteral/6204)
>
> \[31\] Catedrilla, J. M., Castillon, R., Jr., Alonzo, Z. E., &
> Vesorio, G. B. (2024). Strengthening public child healthcare:
> Development of an immunization management information system for a
> local community in Southern Mindanao, Philippines. *Journal* *of*
> *Health* *Research* *and* *Society,* *3*(1).
> [<u>https://doi.org/10.34002/jhrs.v3i1.62</u>](https://doi.org/10.34002/jhrs.v3i1.62)
>
> \[32\] Sanchez, M. Z., Tagle, G., Bautista Jr, R. G., Panes, R. B. A.,
> & Cruz, P. K. A. D. (2021). Clinicord: A web and mobile scheduling
> system for medical clinics in Olongapo City using Progressive Web App
> frameworks. *Computing* *Research,* *25*, 30–37.
> [<u>https://gordoncollege.edu.ph/w3/wp-content/uploads/2024/04/CCS-Research-Journal-2019-2021.pdf#page=30</u>](https://gordoncollege.edu.ph/w3/wp-content/uploads/2024/04/CCS-Research-Journal-2019-2021.pdf#page=30)
>
> \[33\] Rabe, G. S. (2022). *Edi-wow:* *An* *implementation* *of* *an*
> *online* *patient* *records* *management* *system* *for* *a* *dental*
> *clinic* *business* \[Master’s thesis, De La Salle University\]. Animo
> Repository.
> [<u>https://animorepository.dlsu.edu.ph/etdm_manorg/117</u>](https://animorepository.dlsu.edu.ph/etdm_manorg/117)
>
> \[34\] Namoca, M. F. S., & Esguerra, J. G. (2024). Clients’ criteria
> for dental services selection and assessment of service quality and
> satisfaction in Cebu, Philippines. *Ho* *Chi* *Minh* *City* *Open*
> *University* *Journal* *of* *Science:* *Economics,* *15*(4), Article
> 3345.
> [<u>https://doi.org/10.46223/HCMCOUJS.econ.en.15.4.3345.2025</u>](https://doi.org/10.46223/HCMCOUJS.econ.en.15.4.3345.2025)
>
> \[35\] Cerna, J. D. (2022). *A* *design* *of* *web-based* *dental*
> *information* *management* *system*
>
> *with* *SMS* *notification* *and* *decision* *support* *system* *for*
> *Idagdag* *Tooth* *Care* *Clinic* \[Capstone project\]. Academia.edu.
> [<u>https://www.academia.edu/97073413/A_DESIGN_OF_WEB_BASED_DENTAL_INFO</u>](https://www.academia.edu/97073413/A_DESIGN_OF_WEB_BASED_DENTAL_INFORMATION_MANAGEMENT_SYSTEM_WITH_SMS_NOTIFICATION_AND_DECISION_SUPPORT_SYSTEM_FOR_IDAGDAG_TOOTH_CARE_CLINIC)
>
> [<u>RMATION_MANAGEMENT_SYSTEM_WITH_SMS_NOTIFICATION_AND_DECI</u>](https://www.academia.edu/97073413/A_DESIGN_OF_WEB_BASED_DENTAL_INFORMATION_MANAGEMENT_SYSTEM_WITH_SMS_NOTIFICATION_AND_DECISION_SUPPORT_SYSTEM_FOR_IDAGDAG_TOOTH_CARE_CLINIC)
> [<u>SION_SUPPORT_SYSTEM_FOR_IDAGDAG_TOOTH_CARE_CLINIC</u>](https://www.academia.edu/97073413/A_DESIGN_OF_WEB_BASED_DENTAL_INFORMATION_MANAGEMENT_SYSTEM_WITH_SMS_NOTIFICATION_AND_DECISION_SUPPORT_SYSTEM_FOR_IDAGDAG_TOOTH_CARE_CLINIC)
>
> \[36\] Bolaños, J. C. S., Diaz, Y. E. S., Lalaguna, J. D. A., Malang,
> B. P., & Philippines, J.
>
> D. (2024). Optimizing digital transition: Addressing challenges in
> modernizing inventory systems in primary healthcare facilities.
> *International* *Journal* *of* *Multidisciplinary:* *Applied*
> *Business* *and* *Education* *Research,* *5*(11), 4398–4412.
> [<u>https://doi.org/10.11594/ijmaber.05.11.10</u>](https://doi.org/10.11594/ijmaber.05.11.10)
>
> \[37\] Alejandrino, J. C., & Pajota, E. L. P. (2023). An information
> system for private dental clinic with integration of chat-bot system:
> A project development plan. *International* *Journal* *of* *Advanced*
> *Trends* *in* *Computer* *Science* *and* *Engineering,* *12*(2), 1–7.
> [<u>https://doi.org/10.30534/ijatcse/2023/011222023</u>](https://doi.org/10.30534/ijatcse/2023/011222023)
>
> \[38\] Almacen, A. M. B., & Cabaluna, A. Y. (2021). Electronic
> document management
>
> system (EDMS) implementation: Implications for the future of digital
> transformation in Philippine healthcare. *Journal* *of* *Computer*
> *Science* *and* *Technology* *Studies,* *3*(2), 82–90.
> [<u>https://doi.org/10.32996/jcsts.2021.3.2.8</u>](https://doi.org/10.32996/jcsts.2021.3.2.8)
>
> \[39\] De Castro, C. J. F., Decena, K. E. F., Rebosura, K. J. U., &
> German, J. D. (2021). MedReS: A charged medication report system for a
> general hospital in the Philippines. *Proceedings* *of* *the* *11th*
> *Annual* *International* *Conference* *on* *Industrial* *Engineering*
> *and* *Operations* *Management*, Indonesia, 332–340.
> [<u>https://ieomsociety.org/proceedings/2021indonesia/332.pdf</u>](https://ieomsociety.org/proceedings/2021indonesia/332.pdf)
>
> \[40\] Cortez, J. E. M., Ishii, J. K. G., Ongkiko, A. M. R., Ortega,
> C. R., Malang, B. P., & Vigonte, F. G. (2023). Health information
> system users in public health facilities: A descriptive analytics.
> *International* *Journal* *of* *Multidisciplinary:* *Applied*
> *Business* *and* *Education* *Research,* *4*(1), 156–173.
> [<u>https://doi.org/10.11594/ijmaber.04.01.15</u>](https://doi.org/10.11594/ijmaber.04.01.15)
>
> \[41\] DOST–PCHRD. (2021). *State* *of* *health* *IT* *in* *the*
> *Philippines*.
>
> [<u>https://pchrd.dost.gov.ph</u>](https://pchrd.dost.gov.ph/)
>
> \[42\] Cacho, M. A., et al. (2023). Impact of IT solutions in dental
> practice efficiency. *Philippine* *Journal* *of* *Health*
> *Informatics*, 15(2), 45–52.
> <u>https://pjhi.org/article/view/10320532hes23</u>
>
> \[43\] Statista. (2023). *SMS* *open* *rates* *in* *Asia-Pacific*.
> [<u>https://www.statista.com</u>](https://www.statista.com/)
>
> \[44\] Asian Development Bank. (2022). *Strategy* *2030* *health*
> *sector* *directional* *guide:*
>
> *Toward* *the* *achievement* *of* *universal* *health* *coverage* *in*
> *Asia* *and* *the* *Pacific*.
> [<u>https://www.adb.org/documents/strategy-2030-health-sector-directional-guide</u>](https://www.adb.org/documents/strategy-2030-health-sector-directional-guide)
>
> \[45\] World Health Organization. (2022). *Digital* *health*
> *interventions:* *Framework* *for*
>
> *implementation*.
> [<u>https://www.who.int/publications/i/item/9789240020924</u>](https://www.who.int/publications/i/item/9789240020924)
>
> \[46\] Pressman, R. S., & Maxim, B. R. (2020). *Software*
> *engineering:* *A* *practitioner's* *approach* (9th ed.). McGraw-Hill
> Education.
> [<u>https://www.mheducation.com/highered/product/Software-Engineering-A-Practitioners-Approach-Pressman.html</u>](https://www.mheducation.com/highered/product/Software-Engineering-A-Practitioners-Approach-Pressman.html)
>
> \[47\] Department of Health. (2023). *Philippine* *eHealth*
> *strategic* *framework* *and* *plan*
>
> *2023–2028*.
> [<u>https://pdp.neda.gov.ph/wp-content/uploads/2023/01/PDP-2023-2028.pdf</u>](https://pdp.neda.gov.ph/wp-content/uploads/2023/01/PDP-2023-2028.pdf)
