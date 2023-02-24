import { getCheckAndRender } from './handlers';

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};
const callback = function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      getCheckAndRender();
    }
  });
};
const observer = new IntersectionObserver(callback, options);

export { observer };
