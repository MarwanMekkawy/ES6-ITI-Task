const tabs = document.querySelectorAll('.tab');
const loading = document.getElementById('loading');
const container = document.getElementById('recipesContainer');

const endpoints = {
  pizza: 'https://forkify-api.herokuapp.com/api/search?q=pizza',
  salad: 'https://forkify-api.herokuapp.com/api/search?q=salad',
  beef: 'https://forkify-api.herokuapp.com/api/search?q=beef',
  pasta: 'https://forkify-api.herokuapp.com/api/search?q=pasta'
};

function setActiveTab(tab) {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
}

function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function renderRecipes(recipes) {
  container.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${recipe.image_url}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.publisher}</p>
      <a href="${recipe.source_url}" target="_blank">View Recipe</a>
    `;
    container.appendChild(card);
  });
}

async function fetchRecipes(category) {
  showLoading(true);
  try {
    const res = await fetch(endpoints[category]);
    const data = await res.json();
    renderRecipes(data.recipes);
  } catch {
    container.innerHTML = '<p>Failed to load recipes.</p>';
  } finally {
    showLoading(false);
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.getAttribute('data-category');
    setActiveTab(tab);
    fetchRecipes(category);
  });
});
