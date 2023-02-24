import { loadMoreBtn } from './js/LoadMoreBtn';
import { refs } from './js/refs';
import { onFormSubmit, onLoadMoreBtnClick } from './js/handlers';

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMoreBtnClick);

// function onError(error) {
//   console.error(error);
//   loadMoreBtn.hide();
//   appendImagesToGallery('<p>Images not found</>');
// }
