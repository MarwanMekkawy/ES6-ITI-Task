const tabsContainer = document.querySelector('.tabs');
const loading = document.getElementById('loading');
const container = document.getElementById('recipesContainer');
const BASE_URL = 'https://forkify-api.herokuapp.com/api/search?q=';

function setActiveTab(clickedTab) {
  const tabs = tabsContainer.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  clickedTab.classList.add('active');
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
    const res = await fetch(`${BASE_URL}${category}`);
    const data = await res.json();
    if (data.recipes && data.recipes.length > 0) {
      renderRecipes(data.recipes);
    } else {
      container.innerHTML = '<p>No recipes found.</p>';
    }
  } catch (err) {
    container.innerHTML = '<p>Failed to load recipes.</p>';
    console.error(err);
  } finally {
    showLoading(false);
  }
}

tabsContainer.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  const category = tab.getAttribute('data-category');
  setActiveTab(tab);
  fetchRecipes(category);
});

document.querySelector('.tab[data-category="pizza"]').click();
