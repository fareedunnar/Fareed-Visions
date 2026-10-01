
const d = PORTFOLIO;

const all = [
  ...d.exteriors.map(x => ({...x, category:"Exterior"})),
  ...d.interiors.map(x => ({...x, category:"Interior"})),
  ...d.floorPlans.map(x => ({...x, category:"3D Floor Plan"}))
];

const featured = all.find(x => x.name === d.featuredProject) || all[0];

const heroEl = document.getElementById("hero");
const heroTitleEl = document.getElementById("heroTitle");
const aboutTextEl = document.getElementById("aboutText");
const statsEl = document.getElementById("stats");
const softwareEl = document.getElementById("software");
const phoneEl = document.getElementById("phone");
const emailEl = document.getElementById("email");
const extGridEl = document.getElementById("extGrid");
const intGridEl = document.getElementById("intGrid");
const floorGridEl = document.getElementById("floorGrid");

if (featured && featured.images && featured.images[0]) {
  heroEl.style.backgroundImage = `url("${featured.images[0]}")`;
  heroTitleEl.textContent = featured.name;
}

aboutTextEl.textContent = d.about;
statsEl.innerHTML = `<b>7+ Years Experience</b><br><br><b>${all.length} Projects</b>`;
softwareEl.innerHTML = d.software.map(x => `<span>${x}</span>`).join("");
phoneEl.href = `tel:${d.phone.replace(/\s/g,"")}`;
phoneEl.textContent = d.phone;
emailEl.href = `mailto:${d.email}`;
emailEl.textContent = d.email;

function cards(items, cat) {
  return items.map((p) => `
    <article class="card" data-name="${p.name}" data-cat="${cat}">
      <img src="${p.images[0] || ""}" alt="${p.name}">
      <div class="meta">
        <small>${cat.toUpperCase()}</small>
        <h3>${p.name}</h3>
        <p>${p.images.length} view${p.images.length === 1 ? "" : "s"}</p>
      </div>
    </article>
  `).join("");
}

extGridEl.innerHTML = cards(d.exteriors, "Exterior");
intGridEl.innerHTML = cards(d.interiors, "Interior");
floorGridEl.innerHTML = cards(d.floorPlans, "3D Floor Plan");

const modalEl = document.getElementById("modal");
const modalImgEl = document.getElementById("modalImg");
const captionEl = document.getElementById("caption");
const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentProject = null;
let currentIndex = 0;

function renderModal() {
  if (!currentProject || !currentProject.images.length) return;
  modalImgEl.src = currentProject.images[currentIndex];
  modalImgEl.alt = currentProject.name;
  captionEl.textContent = `${currentProject.name} · ${currentIndex + 1}/${currentProject.images.length}`;
}

function openModal(project) {
  currentProject = project;
  currentIndex = 0;
  renderModal();
  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.body.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const project = all.find(
    x => x.name === card.dataset.name && x.category === card.dataset.cat
  );

  if (project) openModal(project);
});

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeModal();
});

prevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!currentProject) return;
  currentIndex = (currentIndex - 1 + currentProject.images.length) % currentProject.images.length;
  renderModal();
});

nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!currentProject) return;
  currentIndex = (currentIndex + 1) % currentProject.images.length;
  renderModal();
});

modalEl.addEventListener("click", (e) => {
  if (e.target === modalEl) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (!modalEl.classList.contains("open")) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft" && currentProject) {
    currentIndex = (currentIndex - 1 + currentProject.images.length) % currentProject.images.length;
    renderModal();
  }
  if (e.key === "ArrowRight" && currentProject) {
    currentIndex = (currentIndex + 1) % currentProject.images.length;
    renderModal();
  }
});


// Animated page reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
revealEls.forEach(el => revealObserver.observe(el));

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const siblings = [...card.parentElement.children];
      const i = siblings.indexOf(card);
      card.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      card.classList.add("card-visible");
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
document.querySelectorAll(".card").forEach(card => cardObserver.observe(card));

// Subtle hero parallax
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const hero = document.getElementById("hero");
    if (hero && y < window.innerHeight) {
      hero.style.backgroundPosition = `center calc(50% + ${y * 0.12}px)`;
    }
  }, { passive: true });
}
