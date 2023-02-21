import axios from 'axios';

const END_POINT = 'https://pixabay.com/api/';
const key = '33671323-2cce06c3be5a372be22004315';

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});

export default class PixabayApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getImages() {
    const URL = `${END_POINT}?key=${key}&q=${this.searchQuery}&${searchParams}&per_page=40&page=${this.page}`;

    const response = await axios.get(URL);
    console.log(response.data);
    this.nextPage();
    return response.data;
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
