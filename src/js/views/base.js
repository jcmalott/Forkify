export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  displayResults: document.querySelector('.results'),
  displayResultsList: document.querySelector('.results__list'),
  displayResultsPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
}

export const elememtStrings = {
  loader: 'loader'
}

export const renderLoader = parent => {
  const loader = `
    <div class="${elememtStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elememtStrings.loader}`);
  if(loader) loader.parentElement.removeChild(loader);
}
