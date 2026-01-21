export const CONDITION_CATEGORIES = [
  {
    name: "Blood and Lymph",
    description:
      "Conditions affecting the blood, blood-forming organs, and lymphatic system.",
    children: [
      {
        name: "Anaemia and Red Blood Cell Disorders",
        description: "Iron deficiency, sickle cell, and thalassaemia.",
      },
      {
        name: "Clotting and Bleeding Disorders",
        description: "Haemophilia, DVT, and Von Willebrand disease.",
      },
      {
        name: "Lymphatic System Disorders",
        description: "Lymphoedema and lymphadenitis.",
      },
      {
        name: "Haematological Cancers",
        description: "Leukaemias, lymphomas, and myeloma.",
      },
    ],
  },
  {
    name: "Brain, Nerves and Spinal Cord",
    description:
      "Neurological conditions affecting the central and peripheral nervous systems.",
    children: [
      {
        name: "Cerebrovascular Conditions",
        description: "Strokes, TIAs, and subarachnoid haemorrhages.",
      },
      {
        name: "Neurological Degeneration",
        description: "Dementia, Parkinson's, and Alzheimer's.",
      },
      {
        name: "Nerve and Seizure Disorders",
        description: "Epilepsy, Multiple Sclerosis, and Migraines.",
      },
      {
        name: "Spinal Cord Disorders",
        description: "Slipped discs, sciatica, and spinal stenosis.",
      },
    ],
  },
  {
    name: "Cardiovascular Disease",
    description: "Conditions related to the heart and blood vessels.",
    children: [
      {
        name: "Coronary Heart Disease",
        description: "Angina, heart attacks, and heart failure.",
      },
      {
        name: "Rhythm and Valve Disorders",
        description: "Arrhythmias (AFib) and heart valve disease.",
      },
      {
        name: "Vascular Conditions",
        description: "Hypertension, high cholesterol, and atherosclerosis.",
      },
    ],
  },
  {
    name: "Ears, Nose and Throat",
    description:
      "Otolaryngological conditions affecting hearing, balance, and the upper respiratory tract.",
    children: [
      {
        name: "Ear and Balance",
        description: "Tinnitus, vertigo, and ear infections.",
      },
      {
        name: "Nose and Sinus",
        description: "Sinusitis, nasal polyps, and allergic rhinitis.",
      },
      {
        name: "Throat and Voice",
        description: "Tonsillitis, laryngitis, and swallowing disorders.",
      },
    ],
  },
  {
    name: "Immune System",
    description:
      "Disorders where the body's defense system is compromised or overactive.",
    children: [
      {
        name: "Allergies and Hypersensitivity",
        description: "Anaphylaxis, food allergies, and hay fever.",
      },
      {
        name: "Autoimmune Diseases",
        description: "Lupus, Rheumatoid Arthritis, and Type 1 Diabetes.",
      },
      {
        name: "Immunodeficiency",
        description: "HIV, AIDS, and primary immunodeficiency.",
      },
    ],
  },
  {
    name: "Infections and Poisoning",
    description:
      "Communicable diseases and harmful exposure to toxic substances.",
    children: [
      {
        name: "Viral Infections",
        description: "Flu, COVID-19, chickenpox, and hepatitis.",
      },
      {
        name: "Bacterial and Fungal Infections",
        description: "Sepsis, tuberculosis, and candidiasis.",
      },
      {
        name: "Toxicology and Poisoning",
        description: "Food poisoning and chemical exposure.",
      },
    ],
  },
  {
    name: "Kidneys, Bladder and Prostate",
    description: "Urological and nephrological conditions.",
    children: [
      {
        name: "Renal Disorders",
        description: "Chronic kidney disease and kidney stones.",
      },
      {
        name: "Urinary Tract Conditions",
        description: "Cystitis, UTIs, and incontinence.",
      },
      {
        name: "Male Reproductive Health",
        description: "Prostate enlargement and prostatitis.",
      },
    ],
  },
  {
    name: "Lungs and Airways",
    description: "Respiratory conditions affecting breathing.",
    children: [
      { name: "Obstructive Lung Diseases", description: "Asthma and COPD." },
      {
        name: "Respiratory Infections",
        description: "Pneumonia, bronchitis, and pleurisy.",
      },
      {
        name: "Interstitial and Vascular Lung Disease",
        description: "Pulmonary fibrosis and pulmonary embolism.",
      },
    ],
  },
  {
    name: "Mental Health",
    description: "Conditions affecting mood, thinking, and behavior.",
    children: [
      {
        name: "Mood Disorders",
        description: "Depression and Bipolar Disorder.",
      },
      {
        name: "Anxiety and Trauma",
        description: "Panic attacks, PTSD, and OCD.",
      },
      {
        name: "Eating and Sleep Disorders",
        description: "Anorexia, bulimia, and insomnia.",
      },
      {
        name: "Psychotic Disorders",
        description: "Schizophrenia and related conditions.",
      },
    ],
  },
  {
    name: "Sexual and Reproductive",
    description:
      "Conditions related to sexual health and the reproductive system.",
    children: [
      { name: "Sexual Health", description: "STIs and contraception advice." },
      {
        name: "Female Reproductive Health",
        description: "Endometriosis, PCOS, and menopause.",
      },
      {
        name: "Sexual Dysfunction",
        description: "Erectile dysfunction and loss of libido.",
      },
    ],
  },
  {
    name: "Skin, Hair and Nails",
    description: "Dermatological conditions.",
    children: [
      {
        name: "Inflammatory Skin Conditions",
        description: "Eczema, psoriasis, and acne.",
      },
      {
        name: "Infectious Skin Conditions",
        description: "Warts, fungal infections, and cellulitis.",
      },
      {
        name: "Hair and Nail Disorders",
        description: "Alopecia and ingrown toenails.",
      },
    ],
  },
  {
    name: "Stomach, Liver and Gastrointestinal",
    description: "Conditions affecting the digestive system.",
    children: [
      {
        name: "Upper GI Disorders",
        description: "Acid reflux, gastritis, and peptic ulcers.",
      },
      {
        name: "Lower GI and Bowel Disorders",
        description: "IBS, IBD (Crohn's/Colitis), and coeliac disease.",
      },
      {
        name: "Hepatobiliary Conditions",
        description: "Hepatitis, liver cirrhosis, and gallstones.",
      },
    ],
  },
];

export const BODY_PARTS = [
  {
    name: "Head and Neck",
    meshId: "reg_head_neck",
    children: [
      { name: "Skull and Face", meshId: "part_skull_face" },
      { name: "Eyes and Vision", meshId: "organ_eyes" },
      { name: "Ears and Hearing", meshId: "organ_ears" },
      { name: "Mouth and Jaw", meshId: "organ_mouth_jaw" },
      { name: "Nose and Sinuses", meshId: "organ_nose_sinus" },
      { name: "Throat and Pharynx", meshId: "organ_pharynx_larynx" },
      { name: "Thyroid and Parathyroid", meshId: "organ_thyroid_complex" },
    ],
  },
  {
    name: "Musculoskeletal System",
    meshId: "sys_musculo",
    children: [
      {
        name: "Upper Extremities",
        meshId: "reg_upper_limb",
        children: [
          { name: "Shoulder and Clavicle", meshId: "joint_shoulder" },
          { name: "Upper Arm (Humerus)", meshId: "part_arm" },
          { name: "Elbow Joint", meshId: "joint_elbow" },
          { name: "Forearm and Wrist", meshId: "part_forearm_wrist" },
          { name: "Hand and Fingers", meshId: "organ_hand" },
        ],
      },
      {
        name: "Lower Extremities",
        meshId: "reg_lower_limb",
        children: [
          { name: "Hip and Pelvic Girdle", meshId: "joint_hip" },
          { name: "Thigh (Femur)", meshId: "part_thigh" },
          { name: "Knee Joint", meshId: "joint_knee" },
          { name: "Lower Leg and Ankle", meshId: "part_leg_ankle" },
          { name: "Foot and Toes", meshId: "organ_foot" },
        ],
      },
      {
        name: "Spine and Axial Skeleton",
        meshId: "reg_spine_axial",
        children: [
          { name: "Cervical Spine (Neck)", meshId: "part_cervical" },
          { name: "Thoracic Spine (Mid-back)", meshId: "part_thoracic" },
          { name: "Lumbar Spine (Lower-back)", meshId: "part_lumbar" },
          { name: "Sacrum and Pelvis", meshId: "part_sacrum_pelvis" },
        ],
      },
    ],
  },
  {
    name: "Cardiovascular and Circulatory",
    meshId: "sys_cardiovascular",
    children: [
      {
        name: "Heart",
        meshId: "organ_heart",
        children: [
          { name: "Myocardium (Muscle)", meshId: "structure_heart_muscle" },
          { name: "Valves and Chambers", meshId: "structure_heart_valves" },
          { name: "Coronary Arteries", meshId: "vessel_coronary" },
        ],
      },
      { name: "Systemic Arteries", meshId: "vessel_arteries" },
      { name: "Systemic Veins", meshId: "vessel_veins" },
    ],
  },
  {
    name: "Digestive and Metabolic",
    meshId: "sys_digestive",
    children: [
      { name: "Esophagus and Upper GI", meshId: "organ_upper_gi" },
      { name: "Stomach", meshId: "organ_stomach" },
      { name: "Liver and Biliary Tract", meshId: "organ_liver_gallbladder" },
      { name: "Pancreas", meshId: "organ_pancreas" },
      { name: "Small and Large Intestine", meshId: "organ_intestines" },
      { name: "Rectum and Anus", meshId: "organ_rectum_anus" },
    ],
  },
  {
    name: "Respiratory System",
    meshId: "sys_respiratory",
    children: [
      { name: "Upper Airways (Nose/Throat)", meshId: "reg_upper_resp" },
      { name: "Trachea and Bronchi", meshId: "organ_trachea_bronchi" },
      { name: "Lungs and Pleura", meshId: "organ_lungs_pleura" },
    ],
  },
  {
    name: "Immune and Lymphatic",
    meshId: "sys_immune_lymph",
    children: [
      { name: "Lymph Nodes and Vessels", meshId: "structure_lymph" },
      { name: "Spleen", meshId: "organ_spleen" },
      { name: "Bone Marrow", meshId: "organ_bone_marrow" },
    ],
  },
];
