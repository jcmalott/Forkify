export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {id, title, author, img};
    this.likes.push(like);
    // persist data
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(element => element.id === id);
    this.likes.splice(index, 1);
    // persist data
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex(element => element.id === id) !== -1
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  persistData() {
    // likes array into JSON
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    // turn JSON back into an array
    const storage = JSON.parse(localStorage.getItem('likes'));

    if(storage) this.likes = storage;
  }
}
