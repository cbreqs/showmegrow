const admin = require("firebase-admin");

console.log("1. Starting script for FINAL batch (5 items)...");

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            projectId: "showmegrowinfo"
        });
    }
    console.log("2. Firebase initialized.");
} catch (error) {
    console.error("!!! Error initializing Firebase:", error);
    process.exit(1);
}

const db = admin.firestore();

// The 5 NEW unique products from your last set of files
const data = [
  {
    "name": "Strawnana Cobbler",
    "brand": "Good Day Farm",
    "product": "Infused Pre-Roll",
    "thc": "32.51%",
    "terpenes": "Not Listed",
    "type": "Hybrid",
    "description": "Infused Preroll 1.0g Mixed Berry. Fruity and creamy profile."
  },
  {
    "name": "Kush Mintz",
    "brand": "ROVE",
    "product": "Vape Cartridge (0.5g)",
    "thc": "85.14%",
    "terpenes": "Linalool, alpha-Humulene, beta-Pinene, beta-Caryophyllene, Limonene",
    "type": "Hybrid",
    "description": "Premier Series Distillate. Minty, refreshing, and relaxing."
  },
  {
    "name": "Key Lime Lucinda Williams",
    "brand": "Good Day Farm",
    "product": "Infused Pre-Roll",
    "thc": "32.15%",
    "terpenes": "Not Listed",
    "type": "Sativa",
    "description": "Infused Preroll 1.0g Key Lime. Tart and energetic."
  },
  {
    "name": "Tire Fire",
    "brand": "Good Day Farm",
    "product": "Pre-Roll (Flower)",
    "thc": "20.03%",
    "terpenes": "Not Listed",
    "type": "Indica",
    "description": "Bulk Preroll 1.0g. Heavy diesel aroma with relaxing effects."
  },
  {
    "name": "Cranberry Grape",
    "brand": "Good Day Farm",
    "product": "Edible (Gummies)",
    "thc": "0.43%",
    "terpenes": "Not Listed",
    "type": "Hybrid",
    "description": "Bulk 2.0 Gummies | Big AF | 100mg. Sweet and tart fruit flavor."
  }
];

async function uploadData() {
    console.log(`3. Preparing to upload ${data.length} new items...`);
    
    try {
        const batch = db.batch();
        
        data.forEach((doc) => {
            const docRef = db.collection("strains").doc();
            batch.set(docRef, doc);
        });

        console.log(`4. Sending batch to Firestore...`);
        await batch.commit();
        console.log("5. SUCCESS! All files are now in your database.");
    } catch (error) {
        console.error("\n!!! UPLOAD FAILED !!!");
        console.error("Error details:", error.message);
    }
}

uploadData();