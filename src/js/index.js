// Global app controller
// import num from './test';
//
// const x = 23;
// console.log(`I imported ${num} and var ${x}`);
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

// Gloabal state app
// - Search object
// - Current recipe obj
// - Shopping list obj
// - Linked Recipes
const state = {}

// Search controller
const controlSearch = async() => {
  // 1) Get query from view
  const query = searchView.getInput();
  // TESTING
  // const query = 'pizza';

  if(query){
    // 2) New search obj and add to state
    state.search = new Search(query);

    // 3) perpare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.displayResults);

    try{
      // 4) Search for recipes
      await state.search.getResults();
      clearLoader();

      // 5) Render results on ui
      searchView.renderResults(state.search.result); // result from getResults method
      // console.log(state.search.result);
    } catch(error) {
      alert('Processing search results.');
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  controlSearch();
});

// TESTING
// window.addEventListener('load', (event) => {
//   event.preventDefault();
//   controlSearch();
// });

elements.displayResultsPages.addEventListener('click', event => {
  const btn = event.target.closest('.btn-inline');
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

// Recipe controller
const controlRecipe = async () => {
  // Get ID from the url
  const id = window.location.hash.replace('#', '');

  if(id) {
    // Perpare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected item
    if(state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);
    // TESTING
    // window.r = state.recipe;

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch(error) {
      console.log(error);
      alert('Processing Recipe');
    }
  }
}

const controlList = () => {
  // Create a list if there is not one yet
  if(!state.list) state.list = new List();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(element => {
    // console.log("Count: " + event.count);
    const item = state.list.addItem(element.count, element.unit, element.ingredient);
    listView.renderItem(item);
  });
}

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked recipe
  if(!state.likes.isLiked(currentID)){
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to UI
    likesView.renderLike(newLike);
    // console.log(state.likes);
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like to UI
    likesView.deleteLike(currentID);
    // console.log(state.likes);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
// Handling recipe button clicks
elements.recipe.addEventListener('click', event => {
  // if use click on the btn or childern of the button
  if(event.target.matches('.btn-decrease, .btn-decrease *')){
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(event.target.matches('.btn-increase, .btn-increase *')){
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if(event.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});

// delete items from shopping list
elements.shopping.addEventListener('click', event => {
  // this is why in the html we called it data-itemid=${item.id} --> data = dataset
  const id = event.target.closest('.shopping__item').dataset.itemid;

  if(event.target.matches('.shopping__delete, .shopping__delete *')){
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if(event.target.matches('.shopping__count--value')) {
    const val = parseFloat(event.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  //Restore Likes
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  // Render existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// TESTING
// can type into console to display its info
// window.state = state;
// window.l = new List();
