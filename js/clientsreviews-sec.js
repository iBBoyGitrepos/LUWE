document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.swap-slider-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.swap-slider-track');
    if (!track) return;

    let cardsPerSlide = 1;
    let currentIndex = 0;
    let isTransitioning = false;
    let originalItems = [];

    const getCardsPerSlide = () => {
      return 4; // Customize based on screen width if needed
    };

    const getCardWidth = () => {
      const firstCard = track.children[0];
      return firstCard ? firstCard.offsetWidth : 0;
    };

    const updateTransform = (withTransition = true) => {
      const cardWidth = getCardWidth();
      const translateX = -(cardWidth * currentIndex);
      track.style.transition = withTransition ? 'transform 0.3s ease' : 'none';
      track.style.transform = `translateX(${translateX}px)`;
    };

    const cloneBufferItems = () => {
      Array.from(track.querySelectorAll('.clone')).forEach(child => child.remove());
      originalItems = Array.from(track.children).filter(child => !child.classList.contains('clone'));

      const prependClones = originalItems.slice(-cardsPerSlide).map(el => {
        const clone = el.cloneNode(true);
        clone.classList.add('clone');
        return clone;
      });

      const appendClones = originalItems.slice(0, cardsPerSlide).map(el => {
        const clone = el.cloneNode(true);
        clone.classList.add('clone');
        return clone;
      });

      prependClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
      appendClones.forEach(clone => track.appendChild(clone));
    };

    const moveTo = (direction) => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex += direction;
      updateTransform(true);

      setTimeout(() => {
        const totalItems = originalItems.length;

        if (currentIndex >= totalItems + cardsPerSlide) {
          currentIndex = cardsPerSlide;
          updateTransform(false);
        } else if (currentIndex < cardsPerSlide) {
          currentIndex = totalItems + cardsPerSlide - 1;
          updateTransform(false);
        }

        isTransitioning = false;
      }, 310);
    };

    // Drag logic
    let startX = 0, currentX = 0, isDragging = false, hasMoved = false;

    const getX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const startDrag = e => {
      isDragging = true;
      hasMoved = false;
      startX = getX(e);
      currentX = startX;
      track.style.transition = 'none';
    };

    const onDrag = e => {
      if (!isDragging) return;
      currentX = getX(e);
      const delta = currentX - startX;
      if (Math.abs(delta) > 5) hasMoved = true;

      const shift = -currentIndex * getCardWidth() + delta;
      track.style.transform = `translateX(${shift}px)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;

      const delta = currentX - startX;
      const threshold = getCardWidth() / 4;

      if (hasMoved) {
        if (delta < -threshold) {
          moveTo(1); // Swiped left
        } else if (delta > threshold) {
          moveTo(-1); // Swiped right
        } else {
          updateTransform(true); // Not enough movement to slide
        }
      } else {
        updateTransform(true); // Just a click, no move
      }
    };

    ['mousedown', 'touchstart'].forEach(evt =>
      track.addEventListener(evt, startDrag, { passive: true })
    );
    ['mousemove', 'touchmove'].forEach(evt =>
      track.addEventListener(evt, onDrag, { passive: false })
    );
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt =>
      track.addEventListener(evt, endDrag)
    );

    const setup = (preserveLeftVisible = false) => {
      let visibleCardIndex = currentIndex;

      if (preserveLeftVisible) {
        const trackRect = track.getBoundingClientRect();
        const children = Array.from(track.children).filter(c => !c.classList.contains('clone'));
        const firstVisible = children.findIndex(card => {
          const cardRect = card.getBoundingClientRect();
          return cardRect.left >= trackRect.left - 1;
        });
        if (firstVisible !== -1) {
          visibleCardIndex = firstVisible + cardsPerSlide;
        }
      }

      cardsPerSlide = getCardsPerSlide();
      cloneBufferItems();

      currentIndex = preserveLeftVisible ? visibleCardIndex : cardsPerSlide;
      updateTransform(false);
    };

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => setup(true), 100); // preserve position
    });

    setup();

    // Hook up navigation buttons
    const prevBtn = document.querySelector('.previos-btn');
    const nextBtn = document.querySelector('.forword-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => moveTo(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => moveTo(1));
    }
  });
});