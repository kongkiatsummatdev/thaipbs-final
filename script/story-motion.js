/* Motion and data exploration for the second half of the story. */
(() => {
  const start = document.getElementById('food-futures');
  if (!start) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const sections = [];
  for (let section = start; section && section.tagName !== 'FOOTER'; section = section.nextElementSibling) {
    if (section.tagName !== 'SECTION') continue;
    section.classList.add('story-section');
    sections.push(section);
  }

  const chapterMeta = [
    ['รสชาติของวันพรุ่งนี้', 'future'],
    ['โปรตีนบทใหม่', 'protein'],
    ['อ่านการเติบโต', 'data'],
    ['คำตอบจากครัวไทย', 'answer'],
    ['ค้นหารสชาติของคุณ', 'personality'],
    ['รสชาติที่เป็นคุณ', 'personality'],
    ['จานที่อยู่ในใจ', 'favourite']
  ];

  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('th', { granularity: 'word' })
    : null;

  function splitHeading(heading) {
    if (!heading) return;
    const source = heading.textContent.trim();
    if (heading.dataset.storySource === source) return;
    heading.dataset.storySource = source;
    heading.classList.add('story-heading');
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    let wordIndex = 0;
    textNodes.forEach(node => {
      const parts = segmenter
        ? Array.from(segmenter.segment(node.nodeValue), part => part.segment)
        : node.nodeValue.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      parts.forEach(part => {
        if (!part.trim()) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'story-word';
        word.style.setProperty('--word-index', wordIndex++);
        word.textContent = part;
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });
  }

  function prepareSection(section, index) {
    const meta = chapterMeta[index] || ['เรื่องราวอาหารไทย', 'future'];
    section.dataset.storyTheme = meta[1];
    if (!section.querySelector(':scope > .chapter-marker')) {
      const marker = document.createElement('div');
      marker.className = 'chapter-marker';
      marker.innerHTML = `<strong>${meta[0]}</strong><i aria-hidden="true"></i>`;
      section.prepend(marker);
    }
    splitHeading(section.querySelector('.section-title, .foodtype-title'));

    const revealItems = section.querySelectorAll(
      ':scope > .content-container > *, :scope > .container > *, :scope > .section-title, ' +
      ':scope > .favfood-select, .future-list > .future-item, .features-grid > .feature-card, ' +
      '.foodtype-grid > .foodtype-card, .favfood-select > .menu-card'
    );
    let itemIndex = 0;
    revealItems.forEach(item => {
      if (item.classList.contains('chapter-marker')) return;
      item.classList.add('story-reveal-item');
      item.style.setProperty('--reveal-index', itemIndex++);
    });
  }
  sections.forEach(prepareSection);

  const itemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('story-item-visible');
      itemObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.story-section .story-reveal-item').forEach(item => itemObserver.observe(item));

  let paused = reducedMotion.matches;
  function setMotionPause(value) {
    paused = value;
    document.documentElement.classList.toggle('story-motion-paused', value);
    scheduleFrame();
  }
  reducedMotion.addEventListener('change', event => setMotionPause(event.matches));

  // Keep the chapter accents within the article, without a navigation bar.
  const trends = Array.from(start.querySelectorAll('.future-item'));
  trends.forEach((trend, index) => {
    trend.id = `food-trend-${index + 1}`;
  });

  const imageFrames = Array.from(start.querySelectorAll('.future-img, .image-box'));
  imageFrames.forEach(frame => frame.classList.add('story-image-frame'));
  const movingItems = Array.from(document.querySelectorAll(
    '.story-section .feature-card, .story-section .foodtype-card, .story-section .menu-card'
  ));
  movingItems.forEach((card, index) => {
    card.classList.add('story-drift-card');
    card.style.setProperty('--drift-delay', `${-(index % 4) * 1.7}s`);
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--look-x', `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
      card.style.setProperty('--look-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--look-x', '0px');
      card.style.setProperty('--look-y', '0px');
    });
  });

  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('story-in-view', entry.isIntersecting);
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    scheduleFrame();
  }, { threshold: 0 });
  sections.forEach(section => observer.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('story-page-open');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });
  sections.forEach(section => revealObserver.observe(section));

  let frameRequest = null;
  function scheduleFrame() {
    if (frameRequest !== null) return;
    frameRequest = requestAnimationFrame(updateScene);
  }
  function updateScene() {
    frameRequest = null;
    if (!visibleSections.size) return;
    const height = window.innerHeight;
    visibleSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (height - rect.top) / Math.max(height, rect.height)));
      section.style.setProperty('--section-progress', progress);
      section.style.setProperty('--section-shift', paused ? '0px' : `${(progress - 0.5) * 90}px`);
    });
    let activeChapter = 0;
    trends.forEach((trend, index) => {
      const rect = trend.getBoundingClientRect();
      if (rect.top < height * 0.48) activeChapter = index;
      const progress = Math.max(0, Math.min(1, (height * 0.65 - rect.top) / Math.max(1, rect.height)));
      trend.style.setProperty('--chapter-progress', progress);
    });
    trends.forEach((trend, index) => {
      const active = index === activeChapter;
      trend.classList.toggle('is-current-chapter', active);
    });
    imageFrames.forEach(frame => {
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > height) return;
      const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / height));
      frame.style.setProperty('--image-travel', paused ? '0px' : `${progress * 38}px`);
    });
  }
  window.addEventListener('scroll', scheduleFrame, { passive: true });
  window.addEventListener('resize', scheduleFrame, { passive: true });

  // Explore the existing dataset; no generated statistics or simulated values.
  const chartCanvas = document.getElementById('exportChart');
  if (chartCanvas && typeof exportYears !== 'undefined' && typeof exportValues !== 'undefined') {
    const explorer = document.createElement('div');
    explorer.className = 'export-explorer';
    explorer.innerHTML = `
      <div class="export-explorer-heading"><span>สำรวจเส้นทางส่งออก</span><span>ลากเพื่อเลือกปี</span></div>
      <div class="export-reading" aria-live="polite" aria-atomic="true">
        <span class="export-year"></span><strong class="export-value"></strong><span class="export-direction"></span>
      </div>
      <div class="export-controls">
        <button type="button" class="export-prev" aria-label="ปีก่อนหน้า">←</button>
        <div class="export-range-wrap"><label for="exportYearRange">ปีที่ต้องการสำรวจ</label>
          <input id="exportYearRange" type="range" min="0" max="${exportYears.length - 1}" step="1" value="${exportYears.length - 1}">
          <div class="export-range-ends"><span>${exportYears[0]}</span><span>${exportYears.at(-1)}</span></div>
        </div>
        <button type="button" class="export-next" aria-label="ปีถัดไป">→</button>
      </div>`;
    chartCanvas.before(explorer);
    const slider = explorer.querySelector('input');
    const previous = explorer.querySelector('.export-prev');
    const next = explorer.querySelector('.export-next');
    function selectYear(index, highlight = true) {
      const value = exportValues[index];
      slider.value = index;
      slider.setAttribute('aria-valuetext', `${exportYears[index]}, ${value > 0 ? '+' : ''}${value.toFixed(2)} เปอร์เซ็นต์`);
      explorer.querySelector('.export-year').textContent = exportYears[index];
      explorer.querySelector('.export-value').textContent = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
      explorer.querySelector('.export-direction').textContent = `${value < 0 ? 'หดตัว' : value > 0 ? 'เติบโต' : 'ไม่เปลี่ยนแปลง'}เทียบกับปีก่อนหน้า`;
      explorer.classList.toggle('is-negative', value < 0);
      previous.disabled = index === 0;
      next.disabled = index === exportYears.length - 1;
      if (!highlight || typeof exportChart === 'undefined' || !exportChart) return;
      // The user can reach the controls before the existing scroll reveal fires.
      exportChart.stop();
      chartAnimated = true;
      exportChart.data.datasets[0].data = exportValues.slice();
      exportChart.setActiveElements([{ datasetIndex: 0, index }]);
      exportChart.data.datasets[0].pointRadius = exportValues.map((_, i) => i === index ? 9 : 4);
      exportChart.update('none');
    }
    slider.addEventListener('input', () => selectYear(Number(slider.value)));
    previous.addEventListener('click', () => selectYear(Math.max(0, Number(slider.value) - 1)));
    next.addEventListener('click', () => selectYear(Math.min(exportYears.length - 1, Number(slider.value) + 1)));
    chartCanvas.addEventListener('click', event => {
      if (typeof exportChart === 'undefined' || !exportChart) return;
      const points = exportChart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, false);
      if (points.length) selectYear(points[0].index);
    });
    selectYear(exportYears.length - 1, false);
  }

  // Recalculate scroll scenes after the existing food selectors change height.
  const detailVisibility = new WeakMap();
  const detailObserver = new MutationObserver(records => {
    const detailSection = document.getElementById('foodTypeDetail');
    const detailChanged = records.some(record => {
      if (record.target !== detailSection) return false;
      const hidden = detailSection.classList.contains('hidden');
      const changed = detailVisibility.get(detailSection) !== hidden;
      detailVisibility.set(detailSection, hidden);
      return changed;
    });
    if (detailSection && detailChanged && !detailSection.classList.contains('hidden')) {
      splitHeading(detailSection.querySelector('.foodtype-title'));
      detailSection.classList.remove('story-page-open');
      requestAnimationFrame(() => requestAnimationFrame(() => detailSection.classList.add('story-page-open')));
    }
    scheduleFrame();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  ['foodTypeSelect', 'foodTypeDetail', 'favFoodSelect', 'favFoodDetail'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      detailVisibility.set(element, element.classList.contains('hidden'));
      detailObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
    }
  });
  setMotionPause(paused);
  window.addEventListener('load', () => {
    scheduleFrame();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
})();
