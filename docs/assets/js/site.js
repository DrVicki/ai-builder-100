(function () {
  const modules = window.AI_BUILDER_MODULES || [];
  const moduleList = document.getElementById('module-list');

  if (moduleList) {
    moduleList.innerHTML = modules.map((module) => `
      <a class="module-card" href="https://aibuilder-7jkvncr3.manus.space" target="_blank" rel="noopener noreferrer" aria-label="Open ${module.title} in the live learning platform">
        <div class="module-number" aria-hidden="true">${module.number}</div>
        <div>
          <span class="module-level">${module.level}</span>
          <h3>${module.title}</h3>
          <p>${module.tagline}</p>
        </div>
        <div class="module-last">
          <span>Final lesson</span>
          <p>${module.finalLesson}</p>
        </div>
        <div class="module-arrow" aria-hidden="true">↗</div>
      </a>
    `).join('');
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
