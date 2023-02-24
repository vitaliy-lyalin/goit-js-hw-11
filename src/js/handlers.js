import { Notify } from 'notiflix';
import { observer } from './intersectionobserver';
import { lightbox } from './lightbox';
import { loadMoreBtn } from './LoadMoreBtn';
import { pixabayApiService } from './PixabayApiService';
import { refs } from './refs';
import { clearImagesFromGallery, renderGalleryMarkup } from './renderFunctions';

export function onFormSubmit(event) {
  event.preventDefault();
  loadMoreBtn.hide();

  const inputValue = event.target.elements.searchQuery.value.trim();
  if (inputValue === '') {
    Notify.info('Enter request');
    return;
  }

  pixabayApiService.searchQuery = inputValue;
  pixabayApiService.resetPage();

  clearImagesFromGallery();

  getCheckAndRender();

  refs.form.reset();
}

export async function onLoadMoreBtnClick() {
  getCheckAndRender();
}

export async function getCheckAndRender() {
  loadMoreBtn.loading();

  try {
    const { hits, totalHits } = await pixabayApiService.getImages();

    if (!hits.length) {
      loadMoreBtn.hide();
      clearImagesFromGallery();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGalleryMarkup(hits);
    loadMoreBtn.show();
    if (refs.galleryBox.children.length === hits.length) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (refs.galleryBox.children.length >= totalHits) {
      loadMoreBtn.hide();
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    lightbox.refresh();
    observer.observe(refs.observeElement);

    loadMoreBtn.endLoading();
  } catch (error) {
    console.error(error);
  }
}
