import {elements} from './base';
import { create, all } from 'mathjs';

const config = {
  number: 'Fraction'
}
const math = create(all, config);

const  formatCount = count => {
  if(count){
    // count = 2.5 --> 2 1/2
    // count = 0.5 --> 1/2

    // split with turn number into a string, parseInt will turn that string back into a number
    const [int, dec] = count.toString().split('.').map(element => parseInt(element, 10));

    if(!dec) return count;

    if(int === 0){
      // 0.5
      return `${math.format(math.fraction(count), { fraction: 'ratio' })}`
    } else {
      // 2.5
      return `${int} ${math.format(math.fraction(count - int), { fraction: 'ratio' })}` // 2 1/2
    }
  }
  return '?';
}

const createIngredient = ingredient => {
  return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
  `;
}

export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
}


export const renderRecipe = (recipe, isLiked) => {
  const markup = `
    <figure class="recipe__fig">
        <img src='${recipe.img}' alt='${recipe.title}' class="recipe__img">
        <h1 class="recipe__title">
            <span>'${recipe.title}'</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
            </svg>
        </button>
    </div>


    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
           ${recipe.ingredients.map(element => createIngredient(element)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href='${recipe.url}' target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
  `;

   elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

export const updateServingsIngredients = recipe => {
  // update servings
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
  // update ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  // console.log(countElements.length);
  countElements.forEach((element, i) => {
    // console.log(recipe.ingredients[i]);
    element.textContent = formatCount(recipe.ingredients[i].count);
  });
}
