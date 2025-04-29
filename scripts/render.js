<!-- Load Supabase Client Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// Console log just for sanity
console.log("Show Me Grow – JS Loaded");

// Connect to Supabase
const SUPABASE_URL = 'https://czfygwfzagqqarumtbsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // (Use your full real key here)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Set Background based on Time
function setBackground() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  }
}

setBackground();

// Mode Toggle Button
const toggleButton = document.getElementById('mode-toggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});

// Mailing List Signup Button
const mailingListButton = document.querySelector('a[href="#signup"]');
const signupForm = document.getElementById('signup');
mailingListButton.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.classList.toggle('active');
});

// Load and Display Spotlight Strain
async function loadSpotlightStrain() {
  const { data, error } = await supabase
    .from('strains')
    .select('name, type, description');

  if (error) {
    console.error('Error fetching strains:', error);
    return;
  }

  if (data.length > 0) {
    const randomStrain = data[Math.floor(Math.random() * data.length)];
    document.getElementById('strain-name').innerHTML = `
      <strong>${randomStrain.name}</strong><br>
      <em>${randomStrain.type || 'Type Unknown'}</em><br>
      <p>${randomStrain.description || 'No description available.'}</p>
    `;
  }
}

// Load initial Spotlight strain on page load
loadSpotlightStrain();

// Refresh Spotlight Button
const refreshButton = document.getElementById('refresh-spotlight');
refreshButton.addEventListener('click', loadSpotlightStrain);

</script>
