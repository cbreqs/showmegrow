const fs = require('fs');
const path = require('path');
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. ROBUST PDF IMPORT ---
let pdfParse;
try {
    pdfParse = require('pdf-parse');
    // Fix for different Node versions
    if (typeof pdfParse !== 'function' && pdfParse.default) {
        pdfParse = pdfParse.default;
    }
    console.log("✅ PDF Library loaded successfully. Type:", typeof pdfParse);
} catch (e) {
    console.error("❌ CRITICAL ERROR: Could not load 'pdf-parse' library.");
    console.error("Run this command to fix: npm install pdf-parse");
    process.exit(1);
}

// --- CONFIGURATION ---
const API_KEY = "YOUR_GEMINI_API_KEY"; // <--- MAKE SURE YOUR KEY IS HERE
const WATCH_FOLDER = "./new_coas";
const PROCESSED_FOLDER = "./processed_coas";
const PROJECT_ID = "showmegrowinfo";

// --- INITIALIZATION ---
if (!fs.existsSync(WATCH_FOLDER)) fs.mkdirSync(WATCH_FOLDER);
if (!fs.existsSync(PROCESSED_FOLDER)) fs.mkdirSync(PROCESSED_FOLDER);

try {
    if (!admin.apps.length) {
        admin.initializeApp({ projectId: PROJECT_ID });
    }
} catch (e) {
    console.error("Firebase Init Error:", e.message);
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log(`👀 Watching for PDFs in ${WATCH_FOLDER}...`);

// --- MAIN WATCHER LOOP ---
fs.watch(WATCH_FOLDER, async (eventType, filename) => {
    if (eventType === 'rename' && filename && filename.endsWith('.pdf')) {
        const filePath = path.join(WATCH_FOLDER, filename);
        
        // Wait 1 second to ensure file is fully moved/written
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (fs.existsSync(filePath)) {
            console.log(`\n📄 New file detected: ${filename}`);
            await processPdf(filePath, filename);
        }
    }
});

async function processPdf(filePath, filename) {
    try {
        // Step 1: Read PDF Text
        const dataBuffer = fs.readFileSync(filePath);
        
        // This is the line that was failing before
        const pdfData = await pdfParse(dataBuffer);
        const rawText = pdfData.text;
        
        console.log("   - Text extracted successfully. Analyzing with AI...");

        // Step 2: Ask AI to extract structured data
        const prompt = `
            Analyze the following text from a Cannabis Certificate of Analysis (COA).
            Extract the following fields into a clean JSON object:
            - name (Strain Name)
            - brand (Brand Name)
            - product (Product Type)
            - thc (Total THC percentage, formatted like "85.14%")
            - terpenes (List the top 3-5 terpenes found, comma separated. If none, write "Not Listed")
            - type (Sativa, Indica, or Hybrid. Infer from strain name if not explicit)
            - description (A short 1-sentence description based on the product type and strain)

            Return ONLY the JSON object. No markdown formatting.
            
            COA TEXT:
            ${rawText.substring(0, 15000)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const extractedData = JSON.parse(text);
        console.log(`   - Data extracted for: ${extractedData.name}`);

        // Step 3: Upload to Firestore
        await db.collection("strains").add(extractedData);
        console.log("   - Uploaded to Firestore! ✅");

        // Step 4: Move file to processed folder
        const newPath = path.join(PROCESSED_FOLDER, filename);
        fs.renameSync(filePath, newPath);
        console.log("   - File moved to 'processed_coas'");

    } catch (error) {
        console.error("   !!! Error processing file:", error.message);
    }
}