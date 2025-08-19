// js/main.js
import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Spotlight elements
const elName = document.getElementById("spotlight-name");
const elSummary = document.getElementById("spotlight-summary");
const elImage = document.getElementById("spotlight-image");
const elTags = document.getElementById("spotlight-tags");
const elLucid = document.getElementById("spotlight-lucid");
const btnRandom = document.getElementById("randomize");

// Load spotlight products
async function loadProducts() {
  const bust = `?t=${Date.now()}`;
  async function tryLoad(url) {
    const res = await fetch(url + bust, { cache: "no-store" });
    if (!res.ok) throw new Error(url + " not found");
    return res.json();
  }

  try {
    const item = await tryLoad("./data/blue-razz.json");
    return [item];
  } catch (_) {
    try {
      const data = await tryLoad("./assets/products.json");
      return data.products || [];
    } catch (e2) {
      console.warn("Spotlight data not found.", e2);
      return [];
    }
  }
}

function pickDeterministic(items) {
  const today = new Date();
  const seed = parseInt(today.toISOString().slice(0, 10).replaceAll("-", ""), 10);
  if (items.length === 0) return null;
  return items[seed % items.length];
}

function pickRandom(items) {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function renderSpotlight(item) {
  if (!item) return;
  elName.textContent = item.name || "Spotlight Strain";
  elSummary.textContent = item.summary || "";
  elImage.src = item.image || "assets/images/placeholder.jpg";
  elImage.alt = item.name ? `Photo of ${item.name}` : "Spotlight strain";
  elLucid.href = item.lucid_url || "#";
  elTags.innerHTML = "";
  (item.tags || []).slice(0, 8).forEach((tag) => {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = tag;
    elTags.appendChild(s);
  });
}

async function initSpotlight() {
  const items = await loadProducts();
  renderSpotlight(pickDeterministic(items));
  btnRandom.addEventListener("click", () => {
    renderSpotlight(pickRandom(items));
  });
}

// Newsletter signup handler
async function initNewsletter() {
  const form = document.getElementById("subscribe-form");
  const status = document.getElementById("subscribe-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email").value || "").trim();
    if (!email) return;
    status.textContent = "Submitting...";

    try {
      await addDoc(collection(db, "signups"), {
        email,
        created_at: serverTimestamp(),
        source: "showmegrow.info",
      });
      status.textContent = "Thanks! You are on the list.";
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "Error saving. Try again later.";
    }
  });
}

// Background video ping-pong
(() => {
  const SPEED = 0.6;
  const FPS = 30;
  const v = document.getElementById("bgVideo");
  if (!v) return;

  function setup() {
    v.playbackRate = SPEED;
    v.loop = false;
  }

  function scrubReverse(video, fps = 30) {
    const step = 1 / fps;
    return new Promise((resolve) => {
      function onSeeked() {
        if (video.currentTime <= step) {
          video.removeEventListener("seeked", onSeeked);
          video.currentTime = 0;
          resolve();
        } else {
          video.currentTime = Math.max(0, video.currentTime - step);
        }
      }
      video.pause();
      video.addEventListener("seeked", onSeeked);
      video.currentTime = Math.max(0, video.currentTime - step);
    });
  }

  v.addEventListener("loadedmetadata", setup);
  v.addEventListener("ended", async () => {
    await scrubReverse(v, FPS);
    v.playbackRate = SPEED;
    v.play();
  });
})();

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initSpotlight();
  initNewsletter();
});
