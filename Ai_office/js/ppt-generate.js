/* V2 PPT Generate — step wizard logic */

(function () {
  "use strict";

  const TOTAL_STEPS = 5;
  let currentStep = 1;

  function goToStep(step) {
    if (step < 1 || step > TOTAL_STEPS) return;

    // Update panels
    document.querySelectorAll(".step-panel").forEach((p) => {
      p.classList.remove("active");
    });
    const nextPanel = document.querySelector(`.step-panel[data-panel="${step}"]`);
    if (nextPanel) nextPanel.classList.add("active");

    // Update step indicator
    document.querySelectorAll(".step").forEach((s) => {
      const n = parseInt(s.dataset.step, 10);
      s.classList.remove("active", "done");
      if (n === step) s.classList.add("active");
      else if (n < step) s.classList.add("done");
    });

    // Update current step label
    const label = document.getElementById("step-current");
    if (label) label.textContent = `第 ${step} 步 / 共 ${TOTAL_STEPS} 步`;

    // Footer buttons
    const prevBtn = document.getElementById("step-prev");
    const nextBtnEl = document.getElementById("step-next");
    if (prevBtn) prevBtn.disabled = step === 1;
    if (nextBtnEl) {
      if (step === TOTAL_STEPS) {
        nextBtnEl.textContent = "完成";
        nextBtnEl.onclick = () => (window.location.href = "editor.html");
      } else {
        nextBtnEl.innerHTML = `下一步 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Init footer buttons
  const prevBtn = document.getElementById("step-prev");
  const nextBtn = document.getElementById("step-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => goToStep(currentStep - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => goToStep(currentStep + 1));
  }

  // Step indicator clickable
  document.querySelectorAll(".step").forEach((s) => {
    s.addEventListener("click", () => {
      const n = parseInt(s.dataset.step, 10);
      goToStep(n);
    });
  });

  // Scene card selection
  document.querySelectorAll(".scene-card[data-scene]").forEach((card) => {
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".scene-card[data-scene]")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      // Auto-advance to next step
      setTimeout(() => goToStep(2), 200);
    });
  });

  // Chip toggle
  document.querySelectorAll(".chip-group").forEach((group) => {
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });
  });

  // Template pick
  document.querySelectorAll(".tpl-pick-card").forEach((card) => {
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".tpl-pick-card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      setTimeout(() => goToStep(5), 200);
    });
  });

  // Init
  const initStep = parseInt(new URLSearchParams(window.location.search).get("step") || "1", 10);
  goToStep(initStep);
})();
