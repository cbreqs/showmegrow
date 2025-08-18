import { firebaseApp, db, isConfigured } from './firebase-config.js';

const elName = document.getElementById('spotlight-name');
const elSummary = document.getElementById('spotlight-summary');
const elImage = document.getElementById('spotlight-image');
const elTags = document.getElementById('spotlight-tags');
const elLucid = document.getElementById('spotlight-lucid');
const btnRandom = document.getElementById('randomize');

async function loadProducts() {
  try {
    // grab all json in /data/ — for now just test with blue-razz.json
    const res = await fetch('data/blue-razz.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('data/blue-razz.json not found');
    const item = await res.json();
    // wrap single object into array so the rest of the code works the same
    return [item];
  } catch (e) {
    console.warn(e);
    return [];
  }
}

function pickDeterministic(items) {
  // Seeded by YYYY-MM-DD to rotate daily
  const today = new Date();
  const seed = parseInt(today.toISOString().slice(0,10).replaceAll('-',''), 10);
  if (items.length === 0) return null;
  let x = seed % items.length;
  return items[x];
}

function pickRandom(items) {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function renderSpotlight(item) {
  if (!item) return;
  elName.textContent = item.name || 'Spotlight Strain';
  elSummary.textContent = item.summary || '';
  elImage.src = item.image || 'assets/images/placeholder.jpg';
  elImage.alt = item.name ? `Photo of ${item.name}` : 'Spotlight strain';
  elLucid.href = item.lucid_url || '#';
  elTags.innerHTML = '';
  (item.tags || []).slice(0, 8).forEach(tag => {
    const s = document.createElement('span');
    s.className = 'tag';
    s.textContent = tag;
    elTags.appendChild(s);
  });
}

async function initSpotlight() {
  const items = await loadProducts();
  renderSpotlight(pickDeterministic(items));
  btnRandom.addEventListener('click', () => {
    renderSpotlight(pickRandom(items));
  });
}

async function initNewsletter() {
  const form = document.getElementById('subscribe-form');
  const status = document.getElementById('subscribe-status');
  if (!form) return;

  if (!isConfigured) {
    status.textContent = 'Admin: Add your Firebase config to js/firebase-config.js to enable the form.';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email').value || '').trim();
    if (!email) return;
    status.textContent = 'Submitting...';

    if (!isConfigured) {
      status.textContent = 'Temporarily disabled. Admin: configure Firebase to enable.';
      return;
    }

    try {
      // Write to Firestore: collection 'newsletter_signups'
      const docRef = await db.collection('newsletter_signups').add({
        email,
        created_at: new Date().toISOString(),
        source: 'showmegrow.info'
      });
      status.textContent = 'Thanks! You are on the list.';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Error saving. Try again later.';
    }
  });
}

initSpotlight();
initNewsletter();

// === Background video: slow + ping‑pong reverse loop ===
(() => {
  const SPEED = 0.1;   // 1.0 = normal; try 0.5–0.8
  const FPS   = 30;    // reverse "scrub" framerate (24–30 is smooth)

  const v = document.getElementById('bgVideo');
  if (!v) return;

  function setup() {
    v.playbackRate = SPEED;
    v.loop = false;              // we handle looping ourselves
  }

  // Scrub the video backwards by stepping currentTime in small chunks.
  function scrubReverse(video, fps = 30) {
    const step = 1 / fps;
    return new Promise(resolve => {
      function onSeeked() {
        if (video.currentTime <= step) {
          video.removeEventListener('seeked', onSeeked);
          video.currentTime = 0; // snap to start
          resolve();
        } else {
          video.currentTime = Math.max(0, video.currentTime - step);
        }
      }
      video.pause();
      video.addEventListener('seeked', onSeeked);
      video.currentTime = Math.max(0, video.currentTime - step);
    });
  }

  v.addEventListener('loadedmetadata', setup);

  // When the forward play hits the end, scrub back to the start, then play forward again.
  v.addEventListener('ended', async () => {
    await scrubReverse(v, FPS);
    v.playbackRate = SPEED;  // ensure speed stays applied
    v.play();
  });
})();
