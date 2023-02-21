import PixabayApiService from './js/PixabayApiService';
import LoadMoreBtn from './js/LoadMoreBtn';

import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const galleryBox = document.querySelector('.gallery');

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '#loadMore', isHidden: true });

let totalImage = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImages);

function onSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  pixabayApiService.searchQuery = value;
  pixabayApiService.resetPage();

  clearImagesFromGallery();
  loadMoreBtn.show();
  totalImage = 0;

  if (value === '') {
    Notify.info('Enter request');
    loadMoreBtn.hide();
    return;
  }

  fetchImages()
    .catch(onError)
    .finally(() => form.reset());
}

async function fetchImages() {
  loadMoreBtn.disable();

  try {
    const data = await pixabayApiService.getImages();
    const { hits, totalHits } = data;

    totalImage += hits.length;

    if (!hits.length) {
      loadMoreBtn.hide();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (totalImage === hits.length) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    if (totalImage === totalHits) {
      loadMoreBtn.hide();
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    const markup = hits.reduce(
      (markup, hits) => createMarkup(hits) + markup,
      ''
    );

    appendImagesToGallery(markup);

    new SimpleLightbox('.gallery a', {
      captionDelay: 250,
      close: true,
    }).refresh();

    loadMoreBtn.enable();
  } catch (error) {
    console.error(error);
  }
}

function appendImagesToGallery(markup) {
  galleryBox.insertAdjacentHTML('beforeend', markup);
}

function clearImagesFromGallery() {
  galleryBox.innerHTML = '';
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
  `;
}

function onError(error) {
  console.error(error);
  loadMoreBtn.hide();
  appendImagesToGallery('<p>Images not found</>');
}
