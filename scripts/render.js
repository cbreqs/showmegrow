<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
console.log("Show Me Grow – JS Loaded");

//Connect to Supabase
const SUPABASE_URL = 'https://czfygwfzagqqarumtbsk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Znlnd2Z6YWdxcWFydW10YnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4ODI5NDIsImV4cCI6MjA2MTQ1ODk0Mn0.c8srfN2tgFoYz1-mAPepd_FgHtWjkAI1oQgth1oXzlQ';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//Load and display a random Spotlight Strain
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
      ${randomStrain.description || ''}
    `;
  }
}
loadSpotlightStrain();
</script>
