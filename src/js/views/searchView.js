import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.displayResultsList.innerHTML = '';
  elements.displayResultsPages.innerHTML = '';
}

export const highlightSelected = id => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  // remove if another one was active before this selection
  resultsArr.forEach(element => {
    element.classList.remove('results__link--active');
  });
  // selects attribute with id that was passed
  // when added the recipe has no id attribute so this is the only way
  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if(title.length > limit){
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(' ')} ...`;
  }
  return title;
}

const renderRecipe = recipe => {
  const markup = `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src=${recipe.image_url} alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
   `;

   elements.displayResultsList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => {
  const html = `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
  `;

  return html;
}

const renderButtons = (page, numResults, resultsPerPage) => {
  const pages = Math.ceil(numResults / resultsPerPage);

  let button;
  if(page === 1 && pages > 1) {
    // only button for next page
    button = createButton(page, 'next');
  } else if(page < pages) {
    // both buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if(page === pages && pages > 1) {
    // only button for pervious page
    button = createButton(page, 'prev');
  }

  elements.displayResultsPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resultsPerPage;
  const end = page *resultsPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render page buttons
  renderButtons(page, recipes.length, resultsPerPage);
};
