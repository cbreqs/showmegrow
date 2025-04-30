<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://czfygwfzagqqarumtbsk.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Znlnd2Z6YWdxcWFydW10YnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4ODI5NDIsImV4cCI6MjA2MTQ1ODk0Mn0.c8srfN2tgFoYz1-mAPepd_FgHtWjkAI1oQgth1oXzlQ'; // Paste full real key here
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
  document.addEventListener('DOMContentLoaded', async () => {
    console.log("Show Me Grow – JS Loaded");

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

  // Mode Toggle
  const toggleButton = document.getElementById('mode-toggle');
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  });

  // Mailing List Toggle
  const mailingListButton = document.querySelector('a[href="#signup"]');
  const signupForm = document.getElementById('signup');
  mailingListButton.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.toggle('active');
  });

  // Load and Display Spotlight Strain
  async function loadSpotlightStrain() {
    const { data, error } = await client
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

  // Attach Refresh Button
  const refreshButton = document.getElementById('refresh-spotlight');
  if (refreshButton) {
    refreshButton.addEventListener('click', loadSpotlightStrain);
  }

  // Load initial Spotlight strain on page load
  loadSpotlightStrain();
});
