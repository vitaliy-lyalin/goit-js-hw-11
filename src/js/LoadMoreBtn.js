export default class LoadMoreBtn {
  constructor({ selector, isHidden }) {
    this.button = document.querySelector(selector);
    if (isHidden) this.hide();
    else this.show();
  }

  // getButton(selector) {
  //   return document.querySelector(selector);
  // }

  hide() {
    this.button.classList.add('hidden');
  }
  show() {
    this.button.classList.remove('hidden');
  }
  loading() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }
  endLoading() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }
}

export const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});
