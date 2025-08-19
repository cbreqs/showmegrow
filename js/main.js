// js/main.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// -------- Spotlight ----------
const elName = document.getElementById("spotlight-name");
const elSummary = document.getElementById("spotlight-summary");
const elImage = document.getElementById("spotlight-image");
const elTags = document.getElementById("spotlight-tags");
const elLucid = document.getElementById("spotlight-lucid");
const btnRandom = document.getElementById("randomize");

async function loadProducts() {
  const bust = `?t=${Date.now()}`;
  const fetchJson = async (p) => {
    const r = await fetch(p + bust, { cache: "no-store" });
    if (!r.ok) throw new Error(p);
    return r.json();
  };
  try { return [await fetchJson("./data/blue-razz.json")]; }
  catch { try { const d = await fetchJson("./assets/products.json"); return d.products || []; }
  catch { return []; } }
}

const pick = (arr) => arr.length ? arr[Math.floor(Math.random()*arr.length)] : null;

function renderSpotlight(item) {
  if (!item) return;
  elName.textContent = item.name || "Spotlight Strain";
  elSummary.textContent = item.summary || "";
  elImage.src = item.image || "assets/images/placeholder.jpg";
  elImage.alt = item.name ? `Photo of ${item.name}` : "Spotlight strain";
  elLucid.href = item.lucid_url || "#";
  elTags.innerHTML = "";
  (item.tags || []).slice(0,8).forEach(t=>{
    const span=document.createElement("span");
    span.className="tag";
    span.textContent=t;
    elTags.appendChild(span);
  });
}

async function initSpotlight() {
  const items = await loadProducts();
  if (items.length) renderSpotlight(items[0]);
  if (btnRandom) btnRandom.addEventListener("click", ()=>renderSpotlight(pick(items)));
}

// -------- Newsletter ----------
async function initNewsletter() {
  const form = document.getElementById("subscribe-form");
  const status = document.getElementById("subscribe-status");
  if (!form) return;
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const email = (document.getElementById("email").value||"").trim();
    if (!email) return;
    status.textContent = "Submitting...";
    try {
      await addDoc(collection(db, "signups"), {
        email, created_at: serverTimestamp(), source: "showmegrow.info"
      });
      status.textContent = "Thanks! You are on the list.";
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "Error saving. Try again later.";
    }
  });
}

// -------- Background video ping-pong ----------
(() => {
  const SPEED = 0.6, FPS = 30;
  const v = document.getElementById("bgVideo");
  if (!v) return;
  v.addEventListener("loadedmetadata", ()=>{ v.playbackRate = SPEED; v.loop = false; });
  v.addEventListener("ended", async ()=>{
    const step = 1/FPS;
    function backOnce() {
      return new Promise((res)=>{
        function onSeeked(){
          if (v.currentTime <= step){ v.removeEventListener("seeked", onSeeked); v.currentTime = 0; res(); }
          else v.currentTime = Math.max(0, v.currentTime - step);
        }
        v.pause(); v.addEventListener("seeked", onSeeked);
        v.currentTime = Math.max(0, v.currentTime - step);
      });
    }
    await backOnce(); v.playbackRate = SPEED; v.play();
  });
})();

// -------- Init when DOM ready ----------
document.addEventListener("DOMContentLoaded", ()=>{
  initSpotlight();
  initNewsletter();
});
