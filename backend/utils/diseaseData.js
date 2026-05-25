const diseaseToSpecialty = {
    "Psoriasis": "Dermatologist",
    "Varicose Veins": "General Physician",
    "Typhoid": "Gastroenterologist",
    "Chicken pox": "Dermatologist",
    "Impetigo": "Dermatologist",
    "Dengue": "General Physician",
    "Fungal infection": "Dermatologist",
    "Common Cold": "General Physician",
    "Pneumonia": "Pulmonologist",
    "Dimorphic Hemorrhoids": "Gastroenterologist",
    "Arthritis": "Rheumatologist",
    "Acne": "Dermatologist",
    "Bronchial Asthma": "Pulmonologist",
    "Hypertension": "Cardiologist",
    "Migraine": "Neurologist",
    "Cervical spondylosis": "Neurologist",
    "Jaundice": "Gastroenterologist",
    "Malaria": "General Physician",
    "Urinary tract infection": "Urologist",
    "Allergy": "General Physician",
    "Gastroesophageal reflux disease": "Gastroenterologist",
    "Drug reaction": "Dermatologist",
    "Peptic ulcer disease": "Gastroenterologist",
    "Diabetes": "General Physician",
    "COVID-19": "Pulmonologist",
    "Lung Opacity": "Pulmonologist",
    "Viral Pneumonia": "Pulmonologist"
};

// Simplified symptom data for LLM context
const diseaseSymptomContext = `
1. Psoriasis: Skin rash, joint pain, silver scales.
2. Varicose Veins: Swollen veins, leg pain.
3. Typhoid: Fever, headache, stomach pain.
4. Chicken pox: Itchy rash, blisters, fever.
5. Impetigo: Red sores, yellowish crust.
6. Dengue: High fever, rash, muscle pain.
7. Fungal infection: Redness, itching, scaling skin.
8. Common Cold: Runny nose, sneezing, sore throat.
9. Pneumonia: Cough with phlegm, chest pain, fever.
10. Dimorphic Hemorrhoids: Pain during bowel movements, itching.
11. Arthritis: Joint pain, stiffness, swelling.
12. Acne: Pimples, blackheads, oily skin.
13. Bronchial Asthma: Wheezing, shortness of breath.
14. Hypertension: High blood pressure, headache.
15. Migraine: Severe headache, nausea, light sensitivity.
16. Cervical spondylosis: Neck pain, stiffness, dizziness.
17. Jaundice: Yellow skin/eyes, dark urine, fatigue.
18. Malaria: Chills, fever, sweating, headache.
19. Urinary tract infection: Burning urination, frequent urge.
20. Allergy: Sneezing, itchy eyes, runny nose.
21. Gastroesophageal reflux disease: Heartburn, acid reflux.
22. Drug reaction: Rash, itching after medication.
23. Peptic ulcer disease: Stomach pain, bloating, nausea.
24. Diabetes: Increased thirst, frequent urination, fatigue.
`;

module.exports = { diseaseToSpecialty, diseaseSymptomContext };
