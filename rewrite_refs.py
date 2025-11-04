from pathlib import Path
path = Path('.document_real/SMILE-SUITE-DCaaS.md')
text = path.read_text(encoding='utf-8')
start = text.index('### Foreign Literature')
new_section = '''### Foreign Literature

[1] Ho, S.-B., Chew, E.-Y., & Tan, C.-H. (2024). Streamlining dental clinic management for effective digitisation productivity and usability. *Journal of Informatics and Web Engineering*, 3(2), 70–85. https://doi.org/10.33093/jiwe.2023.3.2.5

[2] Klaassen, H., Dukes, K., & Marchini, L. (2021). Patient satisfaction with dental treatment at a university dental clinic: A qualitative analysis. *Journal of Dental Education*, 85(3), 311–321. https://doi.org/10.1002/jdd.12428

[3] Eiam-o-pas, K., Intalar, N., & Jeenanunta, C. (2022). Factors affecting acceptance of dental appointment application among users in Bangkok and metropolitan area. In *2022 17th International Joint Symposium on Artificial Intelligence and Natural Language Processing (iSAI-NLP)* (pp. 1–5). IEEE. https://doi.org/10.1109/iSAI-NLP56921.2022.9960256

[4] Morris, L. (2021, July 6). The disadvantages of paper medical records. *Software Advice*. https://www.softwareadvice.com/resources/proscons-paper-charts/

[5] Abdul Wahab, N., Sahabudin, N. M., Osman, A., & Ibrahim, N. (2020). Evaluating the user experience of a web-based child health record system. *Journal of Computing Research and Innovation*, 5(3), 17–24. https://doi.org/10.24191/jcrinn.v5i3.165

[6] Alshammary, F., Alsadoon, B. K., Altamimi, A. A., Ilyas, M., Siddiqui, A. A., Hassan, I., & Alam, M. K. (2020). Perceptions towards use of electronic dental record at a dental college, University of Hail, Kingdom of Saudi Arabia. *Journal of Contemporary Dental Practice*, 21(10), 1105–1112. https://pubmed.ncbi.nlm.nih.gov/33686030

[7] Yang, C.-J., Chen, M.-H., Lin, K.-P., Cheng, Y.-J., & Cheng, F.-C. (2020). Importing automated management system to improve the process efficiency of dental laboratories. *Sensors*, 20(20), 5791. https://doi.org/10.3390/s20205791

[8] Sihombing, D. J. C. (2024). Enhancing inventory management in dental clinics through agile methodology: A practical approach. *Jurnal Ekonomi*, 13(2), 25–34. https://ejournal.seaninstitute.or.id/index.php/Ekonomi/article/view/4324

[9] Rojas González, N., Ortiz Ortiz, C., Velasco Peredo, J., Gutiérrez Ramos, A., & Torres Mendoza, R. (2023). Dental clinic inventory management with Monte Carlo simulation. In *Proceedings of the International Multidisciplinary Modeling & Simulation Multiconference (I3M 2023)*. https://doi.org/10.46354/i3m.2023.mas.008

[10] Yazdani, A. (2024). Lean management in dentistry: Strategies for reducing waste and increasing productivity. *Journal of Oral and Dental Health Nexus*, 1(1), 53–60. https://jodhn.com/index.php/jodhn/article/view/11

[11] Karamshetty, V., De Vries, H., Van Wassenhove, L. N., Dewilde, S., Minnaard, W., Ongarora, D., Abuga, K., & Yadav, P. (2022). Inventory management practices in private healthcare facilities in Nairobi County. *Production and Operations Management*, 31(2), 828–846. https://doi.org/10.1111/poms.13445

[12] Rahimi, S., & Saadati, S. A. (2025). Improving operational efficiency in multispecialty dental clinics. *Journal of Oral and Dental Health Nexus*, 2(1), 40–47. https://jodhn.com/index.php/jodhn/article/view/5

[13] Setya Wardhana, E. (2024). User-friendly dental clinic website design and development: Improving dental health services and patient satisfaction. *Edelweiss Applied Science and Technology*, 8(4), 809–818. https://doi.org/10.55214/25768484.v8i4.1461

[14] Mahmod, M. N. (2023). *Happy Smile Dental Clinic Appointment System (HSDCAS): Web-based system* (Bachelor’s thesis, Universiti Teknologi MARA, Kuala Terengganu Campus). Universiti Teknologi MARA Institutional Repository. https://ir.uitm.edu.my/id/eprint/82352

[15] Zawawi, N. I. A., & Ibrahim, R. (2023). Development of Temangan Dental Clinic Management System. *Applied Information Technology and Computer Science*, 4(1), 842–862. https://doi.org/10.30880/aitcs.2023.04.01.048

[16] Pramudya, B., Ramadhani, D. C. P., Mujaddidah, H. N., & Pradini, R. S. (2025). Implementation of extreme programming (XP) in the development of dental clinic information systems. *JESICA*, 2(1), 20–28. https://doi.org/10.47794/jesica.v2i1.22

[17] Payonyim, N., Jandum, K., & Vachirasricirikul, S. (2025). The design of the conversational chatbot using Facebook Messenger to support patient services: A case study of a dental clinic, University of Phayao. In *2025 Joint International Conference on Digital Arts, Media and Technology with ECTI Northern Section Conference on Electrical, Electronics, Computer and Telecommunications Engineering (ECTI DAMT & NCON)* (pp. 270–275). IEEE. https://doi.org/10.1109/ECTIDAMTNCON64748.2025.10962100

[18] Amirkiai, S., & Obadan-Udoh, E. (2023). Dental patients’ perceptions of and desired content from patient health portals. *The Journal of the American Dental Association*, 154(4), 330–339.e3. https://doi.org/10.1016/j.adaj.2022.12.010

[19] Tapuria, A., Porat, T., Kalra, D., Dsouza, G., Xiaohui, S., & Curcin, V. (2021). Impact of patient access to their electronic health record: Systematic review. *Informatics for Health and Social Care*, 46(2), 194–206. https://doi.org/10.1080/17538157.2021.1879810

[20] Graham, T. A. D., Ali, S., Avdagovska, M., & Ballermann, M. (2020). Effects of a web-based patient portal on patient satisfaction and missed appointment rates: Survey study. *Journal of Medical Internet Research*, 22(5), e17955. https://doi.org/10.2196/17955

### Local Literature

[21] Barrios, J. M. D., Tapalla, A. P., Diloy, M. A., & Lindio, M. A. (2022). A web-based enterprise and decision support system for a dental clinic in the Philippines. In *TENCON 2022 – 2022 IEEE Region 10 Conference (TENCON)* (pp. 1–6). IEEE. https://doi.org/10.1109/TENCON55691.2022.9977819

[22] Mendoza, S., Padpad, R. C., Vael, A. J., Alcazar, C., & Pula, R. (2020). A web-based “InstaSked” appointment scheduling system at Perpetual Help Medical Center outpatient department. In A. Beltran Jr., Z. Lontoc, B. Conde, R. Serfa Juan, & J. Dizon (Eds.), *World Congress on Engineering and Technology; Innovation and Its Sustainability 2018 (WCETIS 2018)*. EAI/Springer Innovations in Communication and Computing. Springer. https://doi.org/10.1007/978-3-030-20904-9_1

[23] Lacasandile, A. D., Tiu, G. V., Victoria, N. M., De Lemos, A. N., & Era, A. D. (2024). National University Dental Records Electronic Access Management (NU-DREAM) as an electronic dental record in a university setting. In *2024 6th International Workshop on Artificial Intelligence and Education (WAIE)* (pp. 265–271). IEEE. https://doi.org/10.1109/WAIE63876.2024.00055

[24] Diaz, A. G., Gumtang, A. D., Orpiada, C. J. A., Balagot, A. S., Villanueva, E. A., & Manalang, M. A. (2024). PHIrecord: A medical record management system for rural health facilities in the Philippines. In *2024 IEEE 6th Symposium on Computers & Informatics (ISCI)* (pp. 188–193). IEEE. https://doi.org/10.1109/ISCI62787.2024.10668022

[25] Tinam-isan, A. C., & Naga, J. F. (2024). Exploring the landscape of health information systems in the Philippines: A methodical analysis of features and challenges. *International Journal of Computing and Digital Systems*, 16(1), 225–237. https://journal.uob.edu.bh/items/22e0468e-a6a8-4296-afe0-1c85164ec99b

[26] Garcia, A. P., De La Vega, S. F., & Mercado, S. P. (2022). Health information systems for older persons in select government tertiary hospitals and health centers in the Philippines: Cross-sectional study. *Journal of Medical Internet Research*, 24(2), e29541. https://doi.org/10.2196/29541

[27] Lu, J. Y. P., & Marcelo, A. B. (2021). Assessment of the context for eHealth development in the Philippines: A work in progress from 1997 to 2020. *Acta Medica Philippina*, 55(6). https://doi.org/10.47895/amp.v55i6.3208

[28] Aranez, M. (2024). *Between the Teeth: Comprehensive Dental Clinic Management System for Ruth Aranez Dental Clinic*. Academia.edu. https://www.academia.edu/125976589/Between_the_Teeth_Comprehensive_Dental_Clinic_Management_System_for_Ruth_Aranez_Dental_Clinic

[29] Magnata, A. R., Manlapas, L. R. S., Tapiceria, R. P. K. M., & Young, M. N. (2023). Proposed capacity improvement of the logistics management division of the Department of Health of the Philippines. In *2023 IEEE 8th International Conference on Engineering Technologies and Applied Sciences (ICETAS)* (pp. 1–6). https://doi.org/10.1109/ICETAS59148.2023.10346361

[30] Santos, M. A. (2020). *Improving patients’ dental records and the collection policy of RXRX Dental Clinic* (Master’s thesis, De La Salle University). Animo Repository. https://animorepository.dlsu.edu.ph/etd_masteral/6204

[31] Catedrilla, J. M., Castillon, R., Jr., Alonzo, Z. E., & Vesorio, G. B. (2024). Strengthening public child healthcare: Development of an immunization management information system for a local community in Southern Mindanao, Philippines. *Journal of Health Research and Society*, 3(1). https://doi.org/10.34002/jhrs.v3i1.62

[32] Sanchez, M. Z., Tagle, G., Bautista Jr, R. G., Panes, R. B. A., & Cruz, P. K. A. D. (2021). Clinicord: A web and mobile scheduling system for medical clinics in Olongapo City using Progressive Web App frameworks. *Computing Research*, 25, 30–37. https://gordoncollege.edu.ph/w3/wp-content/uploads/2024/04/CCS-Research-Journal2019-2021.pdf#page=30

[33] Rabe, G. S. (2022). *Edi-wow: An implementation of an online patient records management system for a dental clinic business* (Master’s thesis, De La Salle University). Animo Repository. https://animorepository.dlsu.edu.ph/etdm_manorg/117

[34] Namoca, M. F. S., & Esguerra, J. G. (2024). Clients’ criteria for dental services selection and assessment of service quality and satisfaction in Cebu, Philippines. *Ho Chi Minh City Open University Journal of Science: Economics*, 15(4), Article 3345. https://doi.org/10.46223/HCMCOUJS.econ.en.15.4.3345.2025

[35] Cerna, J. D. (2022). *A design of web-based dental information management system with SMS notification and decision support system for Idagdag Tooth Care Clinic* [Capstone project]. Academia.edu. https://www.academia.edu/97073413/A_DESIGN_OF_WEB_BASED_DENTAL_INFORMATION_MANAGEMENT_SYSTEM_WITH_SMS_NOTIFICATION_AND_DECISION_SUPPORT_SYSTEM_FOR_IDAGDAG_TOOTH_CARE_CLINIC

[36] Bolaños, J. C. S., Diaz, Y. E. S., Lalaguna, J. D. A., Malang, B. P., & Philippines, J. D. (2024). Optimizing digital transition: Addressing challenges in modernizing inventory systems in primary healthcare facilities. *International Journal of Multidisciplinary: Applied Business and Education Research*, 5(11), 4398–4412. https://doi.org/10.11594/ijmaber.05.11.10

[37] Alejandrino, J. C., & Pajota, E. L. P. (2023). An information system for private dental clinic with integration of chat-bot system: A project development plan. *International Journal of Advanced Trends in Computer Science and Engineering*, 12(2), 1–7. https://doi.org/10.30534/ijatcse/2023/011222023

[38] Almacen, A. M. B., & Cabaluna, A. Y. (2021). Electronic document management system (EDMS) implementation: Implications for the future of digital transformation in Philippine healthcare. *Journal of Computer Science and Technology Studies*, 3(2), 82–90. https://doi.org/10.32996/jcsts.2021.3.2.8

[39] De Castro, C. J. F., Decena, K. E. F., Rebosura, K. J. U., & German, J. D. (2021). MedReS: A charged medication report system for a general hospital in the Philippines. In *Proceedings of the 11th Annual International Conference on Industrial Engineering and Operations Management* (pp. 332–340). https://ieomsociety.org/proceedings/2021indonesia/332.pdf

[40] Cortez, J. E. M., Ishii, J. K. G., Ongkiko, A. M. R., Ortega, C. R., Malang, B. P., & Vigonte, F. G. (2023). Health information system users in public health facilities: A descriptive analytics. *International Journal of Multidisciplinary: Applied Business and Education Research*, 4(1), 156–173. https://doi.org/10.11594/ijmaber.04.01.15

### Supporting References

[41] DOST–PCHRD. (2021). *State of health IT in the Philippines*. https://pchrd.dost.gov.ph

[42] Cacho, M. A., et al. (2023). Impact of IT solutions in dental practice efficiency. *Philippine Journal of Health Informatics*, 15(2), 45–52. https://pjhi.org/article/view/10320532hes23

[43] Statista. (2023). *SMS open rates in Asia-Pacific*. https://www.statista.com

[44] Asian Development Bank. (2022). *Strategy 2030 health sector directional guide: Toward the achievement of universal health coverage in Asia and the Pacific*. https://www.adb.org/documents/strategy-2030-health-sector-directional-guide

[45] World Health Organization. (2022). *Digital health interventions: Framework for implementation*. https://www.who.int/publications/i/item/9789240020924

[46] Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education. https://www.mheducation.com/highered/product/Software-Engineering-A-Practitioners-Approach-Pressman.html

[47] Department of Health. (2023). *Philippine eHealth strategic framework and plan 2023–2028*. https://pdp.neda.gov.ph/wp-content/uploads/2023/01/PDP-2023-2028.pdf
'''
end = len(text)
path.write_text(text[:start] + new_section + '\n', encoding='utf-8')
