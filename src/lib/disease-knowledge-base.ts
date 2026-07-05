// ============================================================
// AgriScan AI — Comprehensive Disease Knowledge Base
// Covers: Tomato, Corn, Potato, Rice, Wheat, Soybean, Cotton
// ============================================================

export interface DiseaseEntry {
  /** Unique key like "tomato_early_blight" */
  key: string;
  crop: string;
  disease: string;
  isHealthy: boolean;
  pathogen: string;
  type: "Fungal" | "Bacterial" | "Viral" | "Nematode" | "Healthy";
  symptoms: string[];
  affectedParts: string[];
  favorableConditions: string[];
  /** Severity weight used to bias detection: 1 = mild, 4 = devastating */
  baseSeverityWeight: number;
  /** Typical yield loss range [min%, max%] */
  yieldLossRange: [number, number];
  treatment: {
    pesticide: string;
    organicAlternative: string;
    steps: string[];
    prevention: string[];
    fertilizer: string;
  };
  /** Visual cues that map to field data selections */
  visualCues: {
    leafColors: string[];
    spotTypes: string[];
    leafTextures: string[];
    leafEdges: string[];
  };
}

// ─── TOMATO ───────────────────────────────────────────────
const tomatoDiseases: DiseaseEntry[] = [
  {
    key: "tomato_healthy",
    crop: "Tomato",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Uniform green leaves", "Normal growth pattern"],
    affectedParts: [],
    favorableConditions: ["Balanced nutrition", "Proper irrigation", "Good airflow"],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring", "Maintain current care routine", "Scout weekly for early signs"],
      prevention: ["Crop rotation", "Balanced fertilization", "Proper spacing", "Clean cultivation tools"],
      fertilizer: "Standard NPK as per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "tomato_early_blight",
    crop: "Tomato",
    disease: "Early Blight",
    isHealthy: false,
    pathogen: "Alternaria solani",
    type: "Fungal",
    symptoms: [
      "Dark brown concentric rings on lower leaves (target-spot pattern)",
      "Yellowing around lesions",
      "Leaves wither and drop prematurely",
      "Stem cankers near soil line",
    ],
    affectedParts: ["Leaves", "Stems", "Fruit"],
    favorableConditions: ["Warm humid weather (24-29°C)", "Heavy dew or rain", "Poor air circulation", "Nutrient-stressed plants"],
    baseSeverityWeight: 2,
    yieldLossRange: [20, 50],
    treatment: {
      pesticide: "Chlorothalonil 75% WP (2g/L) or Mancozeb 75% WP (2.5g/L)",
      organicAlternative: "Copper-based fungicide (Bordeaux mixture) or Bacillus subtilis bio-fungicide",
      steps: [
        "Remove and destroy infected lower leaves immediately",
        "Spray Chlorothalonil or Mancozeb at 7-10 day intervals",
        "Mulch around plants to prevent soil splash",
        "Improve air circulation by pruning suckers",
      ],
      prevention: [
        "Use resistant varieties (e.g., Mountain Merit, Defiant)",
        "Practice 3-year crop rotation away from Solanaceae",
        "Stake or cage plants for airflow",
        "Water at the base, avoid wetting foliage",
      ],
      fertilizer: "Balanced NPK (10-10-10) + Calcium to prevent fruit disorders",
    },
    visualCues: { leafColors: ["Brown", "Yellow", "Mixed"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
  {
    key: "tomato_late_blight",
    crop: "Tomato",
    disease: "Late Blight",
    isHealthy: false,
    pathogen: "Phytophthora infestans",
    type: "Fungal",
    symptoms: [
      "Water-soaked dark lesions on leaves",
      "White fuzzy mold on underside of leaves in humid conditions",
      "Rapid browning and collapse of foliage",
      "Firm brown rot on fruits",
    ],
    affectedParts: ["Leaves", "Stems", "Fruit"],
    favorableConditions: ["Cool wet weather (10-25°C)", "High humidity (>90%)", "Prolonged leaf wetness", "Dense planting"],
    baseSeverityWeight: 4,
    yieldLossRange: [40, 100],
    treatment: {
      pesticide: "Metalaxyl-M + Mancozeb (Ridomil Gold MZ) at 2.5g/L",
      organicAlternative: "Copper hydroxide spray + Neem oil foliar application",
      steps: [
        "Remove and destroy all infected plant parts IMMEDIATELY",
        "Spray Ridomil Gold MZ or copper fungicide within 24 hours",
        "Repeat application every 5-7 days during wet weather",
        "Consider removing entire plant if >50% infected",
      ],
      prevention: [
        "Plant resistant varieties (e.g., Iron Lady, Mountain Magic)",
        "Ensure excellent air circulation",
        "Avoid overhead irrigation",
        "Destroy all crop debris at season end",
      ],
      fertilizer: "Phosphorus-rich fertilizer (10-20-10) to strengthen roots",
    },
    visualCues: { leafColors: ["Brown", "Mixed"], spotTypes: ["Black Spots", "Brown Spots"], leafTextures: ["Curled"], leafEdges: ["Damaged", "Burnt"] },
  },
  {
    key: "tomato_leaf_mold",
    crop: "Tomato",
    disease: "Leaf Mold",
    isHealthy: false,
    pathogen: "Passalora fulva (Cladosporium fulvum)",
    type: "Fungal",
    symptoms: [
      "Pale green to yellow spots on upper leaf surface",
      "Olive-green to brown velvety mold on leaf underside",
      "Leaves curl and wither",
      "Reduced fruit set",
    ],
    affectedParts: ["Leaves"],
    favorableConditions: ["High humidity (>85%)", "Poor ventilation (greenhouses)", "Moderate temperatures (22-24°C)"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 30],
    treatment: {
      pesticide: "Chlorothalonil 75% WP or Azoxystrobin (Amistar) at 1mL/L",
      organicAlternative: "Potassium bicarbonate spray + improved ventilation",
      steps: [
        "Increase ventilation and reduce humidity",
        "Remove severely affected leaves",
        "Spray Chlorothalonil at 10-14 day intervals",
        "Reduce plant density if in greenhouse",
      ],
      prevention: [
        "Use resistant varieties (Cf gene varieties)",
        "Ensure adequate plant spacing",
        "Ventilate greenhouses properly",
        "Avoid leaf wetting during irrigation",
      ],
      fertilizer: "Balanced NPK + Potassium for disease resistance",
    },
    visualCues: { leafColors: ["Yellow", "Mixed"], spotTypes: ["White Powder"], leafTextures: ["Curled"], leafEdges: ["Normal", "Damaged"] },
  },
  {
    key: "tomato_septoria_leaf_spot",
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    isHealthy: false,
    pathogen: "Septoria lycopersici",
    type: "Fungal",
    symptoms: [
      "Small circular spots with dark borders and gray centers",
      "Tiny black dots (pycnidia) in spot centers",
      "Starts on lower leaves, moves upward",
      "Severe defoliation",
    ],
    affectedParts: ["Leaves", "Stems"],
    favorableConditions: ["Warm humid conditions (20-25°C)", "Frequent rain", "Overhead watering", "Crowded planting"],
    baseSeverityWeight: 2,
    yieldLossRange: [15, 50],
    treatment: {
      pesticide: "Mancozeb 75% WP (2.5g/L) or Chlorothalonil",
      organicAlternative: "Copper fungicide + Neem oil spray",
      steps: [
        "Remove infected leaves from lower canopy",
        "Spray Mancozeb at first sign of disease",
        "Repeat every 7-10 days during wet weather",
        "Mulch heavily to prevent soil splash onto leaves",
      ],
      prevention: [
        "Use drip irrigation instead of overhead",
        "Rotate crops — avoid Solanaceae for 2-3 years",
        "Stake and prune for airflow",
        "Remove plant debris after harvest",
      ],
      fertilizer: "Nitrogen (Urea) 50 kg/ha + Potash (MOP) 40 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Yellow"], spotTypes: ["Black Spots", "Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
];

// ─── CORN / MAIZE ─────────────────────────────────────────
const cornDiseases: DiseaseEntry[] = [
  {
    key: "corn_healthy",
    crop: "Corn",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Uniform green leaves", "Strong stalk"],
    affectedParts: [],
    favorableConditions: ["Balanced nutrition", "Adequate moisture"],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue monitoring", "Maintain fertilizer schedule", "Scout for pests weekly"],
      prevention: ["Crop rotation", "Balanced NPK", "Proper plant density"],
      fertilizer: "Standard NPK as per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "corn_common_rust",
    crop: "Corn",
    disease: "Common Rust",
    isHealthy: false,
    pathogen: "Puccinia sorghi",
    type: "Fungal",
    symptoms: [
      "Small elongated reddish-brown pustules on both leaf surfaces",
      "Pustules rupture to release powdery rust-colored spores",
      "Chlorosis around pustules",
      "Premature leaf senescence in severe cases",
    ],
    affectedParts: ["Leaves", "Leaf sheaths"],
    favorableConditions: ["Cool to moderate temperatures (16-23°C)", "High humidity", "Heavy dew", "Susceptible hybrids"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 40],
    treatment: {
      pesticide: "Propiconazole (Tilt 25 EC) at 1mL/L or Azoxystrobin + Propiconazole",
      organicAlternative: "Sulfur-based fungicide + Neem oil spray",
      steps: [
        "Apply foliar fungicide at first sign of pustules",
        "Focus spray on lower canopy where infection starts",
        "Reapply at 14-day intervals if conditions persist",
        "Monitor surrounding fields for spore sources",
      ],
      prevention: [
        "Plant rust-resistant hybrids (Rp genes)",
        "Avoid late planting that extends exposure",
        "Maintain balanced nutrition — avoid excess nitrogen",
        "Scout regularly from V8 through tasseling",
      ],
      fertilizer: "Potassium Chloride (MOP) 80 kg/ha for plant defense",
    },
    visualCues: { leafColors: ["Brown", "Mixed"], spotTypes: ["Brown Spots"], leafTextures: ["Normal", "Dry"], leafEdges: ["Normal", "Damaged"] },
  },
  {
    key: "corn_northern_leaf_blight",
    crop: "Corn",
    disease: "Northern Leaf Blight",
    isHealthy: false,
    pathogen: "Exserohilum turcicum",
    type: "Fungal",
    symptoms: [
      "Long elliptical gray-green to tan lesions (1-6 inches)",
      "Lesions expand and merge, killing large leaf areas",
      "Starts on lower leaves and progresses upward",
      "Olive-green to black spore production on lesion surface",
    ],
    affectedParts: ["Leaves"],
    favorableConditions: ["Moderate temperatures (18-27°C)", "Heavy dew/fog", "Min. 6 hours leaf wetness", "Continuous corn cropping"],
    baseSeverityWeight: 3,
    yieldLossRange: [15, 50],
    treatment: {
      pesticide: "Azoxystrobin (Amistar) at 1mL/L or Pyraclostrobin + Metconazole",
      organicAlternative: "Trichoderma-based bio-fungicide + Copper spray",
      steps: [
        "Apply fungicide between VT (tasseling) and R2 (blister)",
        "Ensure good spray coverage on lower and middle leaves",
        "Repeat if conditions remain favorable",
        "Remove heavily infected crop debris after harvest",
      ],
      prevention: [
        "Select resistant hybrids (Ht genes)",
        "Rotate away from corn for 1-2 years",
        "Tillage to bury infected residue",
        "Avoid excessive plant populations",
      ],
      fertilizer: "Balanced NPK (120:60:40 kg/ha) + Zinc Sulphate 25 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Yellow", "Mixed"], spotTypes: ["Brown Spots", "Black Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged", "Burnt"] },
  },
  {
    key: "corn_gray_leaf_spot",
    crop: "Corn",
    disease: "Gray Leaf Spot",
    isHealthy: false,
    pathogen: "Cercospora zeae-maydis",
    type: "Fungal",
    symptoms: [
      "Rectangular gray to tan lesions between leaf veins",
      "Lesions appear 'blocky' — bounded by veins",
      "Lower leaves affected first",
      "Severe blighting in late season",
    ],
    affectedParts: ["Leaves"],
    favorableConditions: ["Warm humid weather (25-30°C)", "Prolonged leaf wetness", "No-till fields with corn residue", "Continuous corn"],
    baseSeverityWeight: 3,
    yieldLossRange: [20, 50],
    treatment: {
      pesticide: "Pyraclostrobin (Headline) or Trifloxystrobin + Prothioconazole",
      organicAlternative: "Bacillus-based biofungicide + improved airflow",
      steps: [
        "Scout from V10 onward and apply fungicide at VT-R1",
        "Target ear-leaf and leaves above for spray coverage",
        "Avoid continuous corn in same field",
        "Destroy or bury corn residue thoroughly",
      ],
      prevention: [
        "Plant tolerant hybrids",
        "Rotate with soybeans or other non-host crops",
        "Conventional tillage to bury infected residue",
        "Reduce plant population for better airflow",
      ],
      fertilizer: "NPK (100:50:50 kg/ha) + foliar Potassium spray",
    },
    visualCues: { leafColors: ["Brown", "Yellow"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
];

// ─── POTATO ───────────────────────────────────────────────
const potatoDiseases: DiseaseEntry[] = [
  {
    key: "potato_healthy",
    crop: "Potato",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Dark green foliage", "Normal tuber development"],
    affectedParts: [],
    favorableConditions: ["Well-drained soil", "Cool moderate temps"],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring", "Maintain hilling schedule", "Scout for pest presence"],
      prevention: ["Use certified seed potatoes", "Practice crop rotation", "Maintain soil drainage"],
      fertilizer: "Standard NPK based on soil analysis",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "potato_early_blight",
    crop: "Potato",
    disease: "Early Blight",
    isHealthy: false,
    pathogen: "Alternaria solani",
    type: "Fungal",
    symptoms: [
      "Dark brown concentric-ring spots (target board pattern) on older leaves",
      "Yellow halo around lesions",
      "Premature leaf drop starting from lower canopy",
      "Dark sunken lesions on tubers",
    ],
    affectedParts: ["Leaves", "Tubers"],
    favorableConditions: ["Warm days/cool nights (20-30°C day)", "Alternating wet/dry periods", "Nutrient-deficient plants", "Mature foliage"],
    baseSeverityWeight: 2,
    yieldLossRange: [15, 40],
    treatment: {
      pesticide: "Mancozeb 75% WP (2.5g/L) + Chlorothalonil rotation",
      organicAlternative: "Copper fungicide + Bacillus subtilis bio-agent",
      steps: [
        "Begin fungicide sprays at first appearance of lesions",
        "Apply Mancozeb every 7-10 days",
        "Alternate with Chlorothalonil to prevent resistance",
        "Remove severely infected plants",
      ],
      prevention: [
        "Use certified disease-free seed potatoes",
        "Rotate with non-Solanaceae crops for 3 years",
        "Avoid overhead irrigation",
        "Adequate spacing for air circulation",
      ],
      fertilizer: "Balanced NPK (150:100:120 kg/ha) — ensure adequate Nitrogen",
    },
    visualCues: { leafColors: ["Brown", "Yellow", "Mixed"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
  {
    key: "potato_late_blight",
    crop: "Potato",
    disease: "Late Blight",
    isHealthy: false,
    pathogen: "Phytophthora infestans",
    type: "Fungal",
    symptoms: [
      "Water-soaked pale green lesions expanding rapidly",
      "White cottony mold on underside during humid mornings",
      "Dark brown/black necrosis spreading across leaves",
      "Reddish-brown granular rot in tubers",
    ],
    affectedParts: ["Leaves", "Stems", "Tubers"],
    favorableConditions: ["Cool moist weather (10-20°C)", "Relative humidity >90%", "Persistent rain or fog", "Close planting"],
    baseSeverityWeight: 4,
    yieldLossRange: [50, 100],
    treatment: {
      pesticide: "Metalaxyl-M + Mancozeb (Ridomil Gold MZ) at 2.5g/L",
      organicAlternative: "Copper hydroxide 77% WP + Neem cake application",
      steps: [
        "Apply Ridomil Gold MZ IMMEDIATELY upon first symptoms",
        "Spray every 5-7 days during favorable disease conditions",
        "Kill vine foliage 2 weeks before harvest to prevent tuber infection",
        "Destroy ALL infected plant material — do not compost",
      ],
      prevention: [
        "Use certified, blight-resistant varieties (e.g., Sarpo Mira)",
        "Plant on well-drained fields with good air movement",
        "Avoid fields near previously infected plots",
        "Hill potatoes to protect tubers from spore wash",
      ],
      fertilizer: "Phosphorus-rich (DAP 100 kg/ha) + Potassium (MOP 80 kg/ha)",
    },
    visualCues: { leafColors: ["Brown", "Mixed"], spotTypes: ["Black Spots", "Brown Spots"], leafTextures: ["Curled"], leafEdges: ["Damaged", "Burnt"] },
  },
  {
    key: "potato_black_scurf",
    crop: "Potato",
    disease: "Black Scurf",
    isHealthy: false,
    pathogen: "Rhizoctonia solani",
    type: "Fungal",
    symptoms: [
      "Black hard masses (sclerotia) on tuber surface",
      "Stem canker causing reddish-brown lesions at soil line",
      "Delayed and uneven emergence",
      "Aerial tubers and rolled purple-tinged leaves",
    ],
    affectedParts: ["Tubers", "Stems", "Stolons"],
    favorableConditions: ["Cold wet soils at planting", "Heavy clay soils", "Deep planting", "Short rotations"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 30],
    treatment: {
      pesticide: "Pencycuron (Monceren) seed tuber treatment at 1.25g/kg",
      organicAlternative: "Trichoderma viride seed treatment + organic matter amendment",
      steps: [
        "Treat seed tubers with Pencycuron before planting",
        "Plant at optimal depth (10-12 cm) in warm soil (>8°C)",
        "Harvest promptly when mature — do not leave in soil",
        "Avoid replanting infected seed",
      ],
      prevention: [
        "Use certified, clean seed potatoes",
        "Rotate with cereals for 3+ years",
        "Improve soil drainage",
        "Avoid deep planting in cold soils",
      ],
      fertilizer: "Farmyard Manure (FYM) 10 tons/ha + NPK (100:80:100 kg/ha)",
    },
    visualCues: { leafColors: ["Mixed", "Yellow"], spotTypes: ["Black Spots"], leafTextures: ["Curled"], leafEdges: ["Normal"] },
  },
];

// ─── RICE ─────────────────────────────────────────────────
const riceDiseases: DiseaseEntry[] = [
  {
    key: "rice_healthy",
    crop: "Rice",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Uniform green canopy", "Normal tiller development"],
    affectedParts: [],
    favorableConditions: ["Balanced nutrition", "Proper water management"],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring", "Maintain irrigation schedule", "Apply scheduled fertilizer", "Scout weekly"],
      prevention: ["Balanced fertilization", "Proper water management", "Crop rotation", "Use certified seeds"],
      fertilizer: "Standard NPK as per soil test recommendations",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "rice_blast",
    crop: "Rice",
    disease: "Rice Blast",
    isHealthy: false,
    pathogen: "Magnaporthe oryzae",
    type: "Fungal",
    symptoms: [
      "Diamond-shaped lesions with gray center and dark border on leaves",
      "Neck rot causing panicle breakage",
      "Node blast causing blackening of nodes",
      "Whitehead (empty panicles) in severe cases",
    ],
    affectedParts: ["Leaves", "Neck", "Nodes", "Panicles"],
    favorableConditions: ["High humidity (>90%)", "Temperature 25-28°C", "Excessive nitrogen fertilization", "Prolonged leaf wetness"],
    baseSeverityWeight: 3,
    yieldLossRange: [20, 70],
    treatment: {
      pesticide: "Tricyclazole 75% WP at 0.6g/L or Isoprothiolane 40% EC",
      organicAlternative: "Pseudomonas fluorescens foliar spray + Silicon amendment",
      steps: [
        "Spray Tricyclazole at first sight of lesions",
        "Drain standing water from field temporarily",
        "Remove and burn infected plant debris",
        "Apply Potassium fertilizer to boost resistance",
      ],
      prevention: [
        "Use resistant varieties (e.g., IR64, CO-51)",
        "Avoid excessive nitrogen (split applications)",
        "Maintain proper water management",
        "Practice crop rotation with non-host crops",
      ],
      fertilizer: "Potassium Chloride (MOP) — 60 kg/ha + Silicon 50 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Mixed"], spotTypes: ["Black Spots", "Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
  {
    key: "rice_brown_spot",
    crop: "Rice",
    disease: "Brown Spot",
    isHealthy: false,
    pathogen: "Bipolaris oryzae",
    type: "Fungal",
    symptoms: [
      "Oval brown spots with gray center on leaves",
      "Dark brown spots on glumes reducing grain quality",
      "Seedling blight in severe cases",
      "General yellowing of nutrient-deficient leaves",
    ],
    affectedParts: ["Leaves", "Glumes", "Seedlings"],
    favorableConditions: ["Nutrient-deficient soils (especially K and Zn)", "High humidity", "Temperature 25-30°C", "Water stress"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 30],
    treatment: {
      pesticide: "Mancozeb 75% WP at 2.5g/L",
      organicAlternative: "Trichoderma viride seed treatment + Pseudomonas spray",
      steps: [
        "Spray Mancozeb at early infection stage",
        "Ensure balanced nutrition with K and Zn supplements",
        "Maintain consistent irrigation",
        "Apply foliar Zinc Sulphate if deficiency observed",
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Treat seeds with fungicide before sowing",
        "Maintain balanced soil fertility (especially micronutrients)",
        "Avoid planting in poorly drained fields",
      ],
      fertilizer: "Zinc Sulphate 25 kg/ha + DAP 100 kg/ha + MOP 60 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Yellow", "Mixed"], spotTypes: ["Brown Spots"], leafTextures: ["Normal", "Dry"], leafEdges: ["Normal", "Damaged"] },
  },
  {
    key: "rice_bacterial_leaf_blight",
    crop: "Rice",
    disease: "Bacterial Leaf Blight",
    isHealthy: false,
    pathogen: "Xanthomonas oryzae pv. oryzae",
    type: "Bacterial",
    symptoms: [
      "Water-soaked yellow lesions starting from leaf tips",
      "Lesions turn white/gray and dry out",
      "Wilting of seedlings (kresek phase)",
      "Milky/yellow bacterial ooze on leaves in humid conditions",
    ],
    affectedParts: ["Leaves"],
    favorableConditions: ["Warm temperature (25-34°C)", "High humidity and frequent rain", "Strong winds spreading bacteria", "Excess nitrogen"],
    baseSeverityWeight: 3,
    yieldLossRange: [25, 70],
    treatment: {
      pesticide: "Copper Oxychloride 50% WP at 3g/L",
      organicAlternative: "Streptomycin Sulphate 500ppm + Neem oil spray",
      steps: [
        "Spray Copper Oxychloride immediately",
        "Drain excess water from field",
        "Remove severely infected plants",
        "Apply Streptomycin Sulphate as foliar spray",
      ],
      prevention: [
        "Use BLB-resistant varieties",
        "Avoid clipping seedling tips during transplanting",
        "Do not apply excessive nitrogen",
        "Ensure proper plant spacing",
      ],
      fertilizer: "Balanced NPK — 120:60:60 kg/ha",
    },
    visualCues: { leafColors: ["Yellow", "Brown"], spotTypes: ["Brown Spots", "None"], leafTextures: ["Dry", "Curled"], leafEdges: ["Burnt", "Damaged"] },
  },
  {
    key: "rice_tungro",
    crop: "Rice",
    disease: "Tungro",
    isHealthy: false,
    pathogen: "Rice Tungro Bacilliform Virus (RTBV) + Rice Tungro Spherical Virus (RTSV)",
    type: "Viral",
    symptoms: [
      "Yellow to orange leaf discoloration from tip to base",
      "Stunted plant growth and reduced tillering",
      "Rusty brown or dark brown spots on leaves",
      "Delayed and incomplete panicle emergence",
    ],
    affectedParts: ["Whole plant"],
    favorableConditions: ["Presence of green leafhopper vectors", "Late planting", "Asynchronous planting dates", "Continuous rice cropping"],
    baseSeverityWeight: 3,
    yieldLossRange: [30, 70],
    treatment: {
      pesticide: "Carbofuran 3G (for leafhopper vector control)",
      organicAlternative: "Yellow sticky traps + Neem-based insecticide for vector control",
      steps: [
        "Apply Carbofuran granules in root zone to control leafhoppers",
        "Spray Imidacloprid 17.8% SL at 0.5mL/L for vector management",
        "Remove and destroy infected plants immediately",
        "Replant with resistant varieties if severe",
      ],
      prevention: [
        "Use tungro-resistant varieties",
        "Synchronize planting dates with neighboring farms",
        "Control green leafhopper with light traps",
        "Avoid late-season planting",
      ],
      fertilizer: "Urea 80 kg/ha (split application) + MOP 40 kg/ha",
    },
    visualCues: { leafColors: ["Yellow", "Brown", "Mixed"], spotTypes: ["Brown Spots", "None"], leafTextures: ["Normal", "Curled"], leafEdges: ["Normal"] },
  },
];

// ─── WHEAT ────────────────────────────────────────────────
const wheatDiseases: DiseaseEntry[] = [
  {
    key: "wheat_healthy",
    crop: "Wheat",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Uniform green canopy", "Normal head development"],
    affectedParts: [],
    favorableConditions: ["Balanced nutrition"],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue monitoring", "Maintain fertilizer schedule"],
      prevention: ["Crop rotation", "Balanced NPK", "Certified seeds"],
      fertilizer: "Standard NPK as per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "wheat_stripe_rust",
    crop: "Wheat",
    disease: "Stripe Rust (Yellow Rust)",
    isHealthy: false,
    pathogen: "Puccinia striiformis",
    type: "Fungal",
    symptoms: [
      "Yellow-orange pustules arranged in stripes along leaf veins",
      "Leaves turn yellow and dry prematurely",
      "Shriveled grain with reduced test weight",
      "Severe cases cause complete leaf necrosis",
    ],
    affectedParts: ["Leaves", "Heads", "Awns"],
    favorableConditions: ["Cool temperatures (10-15°C)", "Dew or light rain", "Susceptible varieties", "Dense canopy"],
    baseSeverityWeight: 3,
    yieldLossRange: [20, 70],
    treatment: {
      pesticide: "Propiconazole (Tilt 25 EC) at 1mL/L or Tebuconazole 25% EC",
      organicAlternative: "Sulfur dust + Trichoderma-based bio-agent",
      steps: [
        "Apply Propiconazole at first appearance of pustules",
        "Ensure thorough canopy coverage",
        "Repeat after 14-21 days if rust persists",
        "Harvest promptly to minimize grain losses",
      ],
      prevention: [
        "Plant resistant varieties (Yr gene varieties)",
        "Avoid early sowing in rust-prone areas",
        "Balanced nitrogen application",
        "Monitor for rust from tillering onward",
      ],
      fertilizer: "Balanced NPK (120:60:40 kg/ha) + foliar micronutrients",
    },
    visualCues: { leafColors: ["Yellow", "Mixed"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
  {
    key: "wheat_leaf_rust",
    crop: "Wheat",
    disease: "Leaf Rust (Brown Rust)",
    isHealthy: false,
    pathogen: "Puccinia triticina",
    type: "Fungal",
    symptoms: [
      "Circular to oval orange-brown pustules scattered randomly on leaves",
      "Pustules mainly on upper leaf surface",
      "Yellow halos around pustules",
      "Premature leaf senescence",
    ],
    affectedParts: ["Leaves", "Leaf sheaths"],
    favorableConditions: ["Moderate temperatures (15-22°C)", "Dew and intermittent rain", "Dense plant stands", "Susceptible cultivars"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 40],
    treatment: {
      pesticide: "Tebuconazole 25% EC at 1mL/L or Propiconazole",
      organicAlternative: "Neem oil spray + Potassium bicarbonate",
      steps: [
        "Scout from jointing (Feekes 6) through flowering",
        "Apply fungicide when rust covers 5% of flag leaf area",
        "Focus on flag leaf and leaf below flag leaf",
        "Late applications protect grain fill",
      ],
      prevention: [
        "Plant resistant/tolerant varieties (Lr genes)",
        "Timely sowing — avoid late planting",
        "Balanced nutrition — avoid excess N",
        "Eliminate volunteer wheat that harbors inoculum",
      ],
      fertilizer: "NPK (100:60:40 kg/ha) + Zinc foliar spray",
    },
    visualCues: { leafColors: ["Brown", "Yellow"], spotTypes: ["Brown Spots"], leafTextures: ["Normal", "Dry"], leafEdges: ["Normal", "Damaged"] },
  },
  {
    key: "wheat_powdery_mildew",
    crop: "Wheat",
    disease: "Powdery Mildew",
    isHealthy: false,
    pathogen: "Blumeria graminis f. sp. tritici",
    type: "Fungal",
    symptoms: [
      "White to gray powdery fungal growth on leaf surfaces",
      "Yellowing beneath mildew colonies",
      "Reduced photosynthesis and stunted growth",
      "Black cleistothecia (fruiting bodies) appear late season",
    ],
    affectedParts: ["Leaves", "Stems", "Heads"],
    favorableConditions: ["Moderate temperatures (15-22°C)", "High humidity but dry leaf surface", "Shaded lower canopy", "Excessive nitrogen"],
    baseSeverityWeight: 2,
    yieldLossRange: [10, 35],
    treatment: {
      pesticide: "Triadimefon 25% WP at 1g/L or Sulfur 80% WP (3g/L)",
      organicAlternative: "Potassium bicarbonate spray + milk spray (10%)",
      steps: [
        "Apply fungicide at first sign of white powdery growth",
        "Ensure lower canopy gets spray coverage",
        "Repeat at 14-day intervals during favorable weather",
        "Reduce nitrogen side-dressing if mildew is active",
      ],
      prevention: [
        "Use mildew-resistant varieties (Pm genes)",
        "Avoid excessive nitrogen fertilization",
        "Optimize plant spacing for airflow",
        "Remove volunteer wheat and grass hosts",
      ],
      fertilizer: "Reduce Nitrogen to 80 kg/ha + increase Potash to 60 kg/ha",
    },
    visualCues: { leafColors: ["Yellow", "Mixed"], spotTypes: ["White Powder"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
];

// ─── SOYBEAN ──────────────────────────────────────────────
const soybeanDiseases: DiseaseEntry[] = [
  {
    key: "soybean_healthy",
    crop: "Soybean",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Dark green trifoliate leaves"],
    affectedParts: [],
    favorableConditions: [],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring"],
      prevention: ["Crop rotation", "Inoculate seeds with Rhizobium"],
      fertilizer: "Standard P and K per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "soybean_rust",
    crop: "Soybean",
    disease: "Asian Soybean Rust",
    isHealthy: false,
    pathogen: "Phakopsora pachyrhizi",
    type: "Fungal",
    symptoms: [
      "Small tan to dark brown lesions on lower leaves",
      "Lesions have 1-2 raised pustules (uredinia) on undersides",
      "Rapid defoliation and premature maturity",
      "Reduced pod fill",
    ],
    affectedParts: ["Leaves", "Pods", "Stems"],
    favorableConditions: ["Warm humid conditions (18-28°C)", "6+ hours leaf wetness", "Prolonged rain or heavy dew"],
    baseSeverityWeight: 3,
    yieldLossRange: [25, 80],
    treatment: {
      pesticide: "Trifloxystrobin + Prothioconazole (Stratego YLD) or Azoxystrobin + Cyproconazole",
      organicAlternative: "Neem-based fungicide + early harvest",
      steps: [
        "Apply fungicide at R1-R3 (flowering to early pod) stage",
        "Scout lower canopy — rust starts on lower leaves",
        "Reapply at 14-21 day intervals if conditions persist",
        "Harvest as early as possible if infection is severe",
      ],
      prevention: [
        "Plant early-maturing varieties",
        "Avoid late planting",
        "Monitor sentinel plots and USDA rust tracker",
        "Scout from R1 onward in known affected regions",
      ],
      fertilizer: "DAP 100 kg/ha + MOP 60 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Yellow"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
];

// ─── COTTON ───────────────────────────────────────────────
const cottonDiseases: DiseaseEntry[] = [
  {
    key: "cotton_healthy",
    crop: "Cotton",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Normal boll development"],
    affectedParts: [],
    favorableConditions: [],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring", "Maintain pest scouting schedule"],
      prevention: ["Crop rotation", "Clean seed", "Balanced NPK"],
      fertilizer: "Standard NPK per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "cotton_bacterial_blight",
    crop: "Cotton",
    disease: "Bacterial Blight (Angular Leaf Spot)",
    isHealthy: false,
    pathogen: "Xanthomonas citri pv. malvacearum",
    type: "Bacterial",
    symptoms: [
      "Angular water-soaked spots on leaves bounded by veins",
      "Spots turn brown and may merge",
      "Black arm lesions on stems and petioles",
      "Boll rot with internal lint staining",
    ],
    affectedParts: ["Leaves", "Stems", "Bolls"],
    favorableConditions: ["Warm wet weather (25-35°C)", "Wind-driven rain", "Hail damage creating entry points", "Seed-borne inoculum"],
    baseSeverityWeight: 3,
    yieldLossRange: [15, 50],
    treatment: {
      pesticide: "Copper Oxychloride 50% WP at 3g/L + Streptocycline 500ppm",
      organicAlternative: "Copper hydroxide spray + Pseudomonas fluorescens",
      steps: [
        "Spray Copper Oxychloride at first sign of angular lesions",
        "Add Streptocycline for severe outbreaks",
        "Avoid working in fields when foliage is wet",
        "Remove and destroy severely infected plants",
      ],
      prevention: [
        "Use acid-delinted, treated seeds",
        "Plant resistant varieties",
        "Rotate with non-host crops for 2-3 years",
        "Destroy crop residue after harvest",
      ],
      fertilizer: "Balanced NPK (80:40:40 kg/ha) + Zinc 5 kg/ha",
    },
    visualCues: { leafColors: ["Brown", "Yellow"], spotTypes: ["Brown Spots", "Black Spots"], leafTextures: ["Dry"], leafEdges: ["Damaged"] },
  },
  {
    key: "cotton_fusarium_wilt",
    crop: "Cotton",
    disease: "Fusarium Wilt",
    isHealthy: false,
    pathogen: "Fusarium oxysporum f. sp. vasinfectum",
    type: "Fungal",
    symptoms: [
      "Yellowing and wilting of leaves, often one-sided",
      "Vascular discoloration (dark brown streaks in stem cross-section)",
      "Stunted growth and premature defoliation",
      "Plant death in severe cases",
    ],
    affectedParts: ["Vascular system", "Leaves", "Stems"],
    favorableConditions: ["Sandy acidic soils", "Root-knot nematode co-infection", "Warm soil temperatures (23-33°C)", "Continuous cotton cropping"],
    baseSeverityWeight: 3,
    yieldLossRange: [20, 60],
    treatment: {
      pesticide: "Carbendazim 50% WP seed treatment (2g/kg seed) + Trichoderma soil application",
      organicAlternative: "Trichoderma viride (4g/kg seed) + Pseudomonas fluorescens soil drench",
      steps: [
        "Treat seeds with Carbendazim before planting",
        "Apply Trichoderma at 2.5 kg/ha in soil",
        "Remove and destroy wilted plants immediately",
        "Improve soil pH with lime if acidic",
      ],
      prevention: [
        "Use wilt-resistant varieties",
        "Rotate with cereals for 4-5 years",
        "Manage root-knot nematodes",
        "Raise soil pH above 6.0 with lime",
      ],
      fertilizer: "FYM 10 tons/ha + NPK (60:30:30 kg/ha) + lime 2 tons/ha",
    },
    visualCues: { leafColors: ["Yellow", "Brown", "Mixed"], spotTypes: ["None", "Brown Spots"], leafTextures: ["Curled", "Dry"], leafEdges: ["Damaged"] },
  },
];

// ─── SUGARCANE ─────────────────────────────────────────────
const sugarcaneDiseases: DiseaseEntry[] = [
  {
    key: "sugarcane_healthy",
    crop: "Sugarcane",
    disease: "Healthy",
    isHealthy: true,
    pathogen: "None",
    type: "Healthy",
    symptoms: ["No visible symptoms", "Normal cane growth"],
    affectedParts: [],
    favorableConditions: [],
    baseSeverityWeight: 0,
    yieldLossRange: [0, 0],
    treatment: {
      pesticide: "None required",
      organicAlternative: "None required",
      steps: ["Continue regular monitoring"],
      prevention: ["Use healthy setts", "Crop rotation"],
      fertilizer: "Standard NPK per soil test",
    },
    visualCues: { leafColors: ["Healthy Green"], spotTypes: ["None"], leafTextures: ["Normal"], leafEdges: ["Normal"] },
  },
  {
    key: "sugarcane_red_rot",
    crop: "Sugarcane",
    disease: "Red Rot",
    isHealthy: false,
    pathogen: "Colletotrichum falcatum",
    type: "Fungal",
    symptoms: [
      "Reddening of internal cane tissue with white patches",
      "Drying of top leaves (crown wilting)",
      "Hollow canes with sour alcoholic smell",
      "Yellowing and drying of leaves from 3rd-4th month",
    ],
    affectedParts: ["Stalks", "Leaves"],
    favorableConditions: ["High humidity and waterlogging", "Temperature 28-32°C", "Ratooning", "Susceptible varieties"],
    baseSeverityWeight: 3,
    yieldLossRange: [25, 70],
    treatment: {
      pesticide: "Carbendazim 50% WP sett treatment (0.1%) + Thiophanate-methyl",
      organicAlternative: "Trichoderma viride sett treatment + bio-agents",
      steps: [
        "Treat setts with Carbendazim (0.1%) for 15 minutes before planting",
        "Remove and burn infected canes immediately",
        "Improve drainage to prevent waterlogging",
        "Apply Trichoderma to soil around root zone",
      ],
      prevention: [
        "Use resistant varieties and healthy setts",
        "Hot water treatment of setts (52°C for 30 min)",
        "Avoid ratooning in infected fields",
        "Rotate with rice or pulses for 1 year",
      ],
      fertilizer: "NPK (250:100:120 kg/ha) + Zinc 25 kg/ha",
    },
    visualCues: { leafColors: ["Yellow", "Brown"], spotTypes: ["Brown Spots"], leafTextures: ["Dry"], leafEdges: ["Burnt", "Damaged"] },
  },
];

// ─── COMBINED DATABASE ────────────────────────────────────
export const diseaseKnowledgeBase: DiseaseEntry[] = [
  ...tomatoDiseases,
  ...cornDiseases,
  ...potatoDiseases,
  ...riceDiseases,
  ...wheatDiseases,
  ...soybeanDiseases,
  ...cottonDiseases,
  ...sugarcaneDiseases,
];

// ─── LOOKUP HELPERS ───────────────────────────────────────
export function getDiseasesForCrop(crop: string): DiseaseEntry[] {
  return diseaseKnowledgeBase.filter(
    (d) => d.crop.toLowerCase() === crop.toLowerCase()
  );
}

export function getDiseaseByKey(key: string): DiseaseEntry | undefined {
  return diseaseKnowledgeBase.find((d) => d.key === key);
}

export function getAllCrops(): string[] {
  return [...new Set(diseaseKnowledgeBase.map((d) => d.crop))];
}

export function getAllDiseaseKeys(): string[] {
  return diseaseKnowledgeBase.map((d) => d.key);
}

/** Weather risk factors based on disease conditions */
export interface WeatherRiskFactor {
  factor: string;
  risk: "Low" | "Medium" | "High";
  description: string;
}

export function getWeatherRiskFactors(disease: DiseaseEntry): WeatherRiskFactor[] {
  const factors: WeatherRiskFactor[] = [];

  for (const condition of disease.favorableConditions) {
    const lower = condition.toLowerCase();
    if (lower.includes("humid") || lower.includes("moisture") || lower.includes("wet")) {
      factors.push({ factor: "Humidity", risk: "High", description: condition });
    } else if (lower.includes("temp") || lower.includes("warm") || lower.includes("cool")) {
      factors.push({ factor: "Temperature", risk: "Medium", description: condition });
    } else if (lower.includes("rain") || lower.includes("dew") || lower.includes("fog")) {
      factors.push({ factor: "Rainfall/Dew", risk: "High", description: condition });
    } else if (lower.includes("wind")) {
      factors.push({ factor: "Wind", risk: "Medium", description: condition });
    } else {
      factors.push({ factor: "Agronomic", risk: "Medium", description: condition });
    }
  }
  return factors;
}
