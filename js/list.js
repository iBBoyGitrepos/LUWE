document.addEventListener('DOMContentLoaded', () => {
  const lineContainer = document.querySelector('.line-inner');
  const scrollStep = 0.5;
  const intervalTime = 20;
  let isPaused = false;

  function infiniteScroll() {
    if (!isPaused) {
      lineContainer.scrollLeft += scrollStep;

      const firstItem = lineContainer.children[0];
      const firstItemWidth = firstItem.offsetWidth + 30; 

      if (lineContainer.scrollLeft >= firstItemWidth) {
        lineContainer.appendChild(firstItem);
        lineContainer.scrollLeft -= firstItemWidth;
      }
    }
  }

  setInterval(infiniteScroll, intervalTime);

  // Pause on hover / focus
  lineContainer.addEventListener('mouseenter', () => isPaused = true);
  lineContainer.addEventListener('mouseleave', () => isPaused = false);
  lineContainer.addEventListener('focus', () => isPaused = true);
  lineContainer.addEventListener('blur', () => isPaused = false);

  // Drag to scroll manually
  let isDown = false;
  let startX;
  let scrollLeft;

  lineContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - lineContainer.offsetLeft;
    scrollLeft = lineContainer.scrollLeft;
    e.preventDefault();
  });

  lineContainer.addEventListener('mouseleave', () => isDown = false);
  lineContainer.addEventListener('mouseup', () => isDown = false);

  lineContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - lineContainer.offsetLeft;
    const walk = (x - startX) * 1;
    lineContainer.scrollLeft = scrollLeft - walk;
  });
});
