function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createRepoInfo(project) {
  if (!project.github) {
    return createElement("span", "repo-private", "🔒 Private repository");
  }

  const link = createElement("a", "repo-link", "→ view on GitHub");
  link.href = project.github;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function renderProjects() {
  const list = document.getElementById("projects-list");
  document.getElementById("projects-count").textContent = projects.length;

  projects.forEach(function (project, index) {
    const card = createElement("article", "project-card");
    card.tabIndex = 0;
    card.dataset.index = index;

    const meta = createElement("p", "project-meta", "drwxr-xr-x · " + project.kind);
    const title = createElement("h3", "project-folder", project.folder);
    const description = createElement("p", "project-description", project.description);
    const footer = createElement("p", "project-footer");
    footer.appendChild(createRepoInfo(project));

    card.append(meta, title, description, footer);
    list.appendChild(card);
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let skipIntro = reduceMotion;

function wait(milliseconds) {
  if (skipIntro) return Promise.resolve();
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds);
  });
}

async function typeStep(step) {
  const typed = step.querySelector(".typed");
  const command = typed.textContent;
  typed.textContent = "";
  step.classList.add("is-shown");

  for (const letter of command) {
    if (skipIntro) {
      typed.textContent = command;
      break;
    }
    typed.textContent += letter;
    await wait(22);
  }

  await wait(120);
  step.classList.add("is-done");
  await wait(140);
}

async function playIntro() {
  await wait(500);

  for (const step of document.querySelectorAll(".step")) {
    await typeStep(step);
  }

  for (const card of document.querySelectorAll(".project-card")) {
    card.classList.add("is-shown");
    await wait(110);
  }

  document.getElementById("skip-hint").hidden = true;
}

function stopIntro() {
  skipIntro = true;
}

const modal = document.getElementById("project-modal");
const canHover = window.matchMedia("(hover: hover)").matches;
let activeCard = null;
let closeTimer = null;

function createModalLine(lineNumber, text) {
  const line = createElement("li", "", text);
  line.style.setProperty("--line", lineNumber);
  return line;
}

function fillModal(project) {
  const command = createElement("p", "modal-command", "$ cat " + project.folder + "/stack.json");
  const list = createElement("ul");

  list.appendChild(createModalLine(0, "{"));

  project.stack.forEach(function (tech, index) {
    const line = createModalLine(index + 1, "  ");
    const isLast = index === project.stack.length - 1;
    line.append(
      createElement("span", "modal-key", '"' + tech.name + '"'),
      ": ",
      createElement("span", "modal-value", '"' + tech.use + '"'),
      isLast ? "" : ","
    );
    list.appendChild(line);
  });

  list.appendChild(createModalLine(project.stack.length + 1, "}"));
  modal.replaceChildren(command, list);
}

function placeModal() {
  if (!activeCard) return;

  if (window.innerWidth < 760) {
    modal.classList.add("is-sheet");
    modal.style.left = "";
    return;
  }

  modal.classList.remove("is-sheet");
  const gap = 24;
  const card = activeCard.getBoundingClientRect();
  const width = modal.offsetWidth;

  let left = card.right + gap;
  if (left + width > window.innerWidth - 16) {
    left = card.left - width - gap;
  }
  if (left < 16) {
    left = 16;
  }

  modal.style.left = left + "px";
}

function openModal(card) {
  clearTimeout(closeTimer);
  if (activeCard === card) return;
  if (activeCard) activeCard.classList.remove("is-active");

  activeCard = card;
  card.classList.add("is-active");
  document.body.classList.add("has-focus");

  fillModal(projects[card.dataset.index]);
  modal.hidden = false;
  placeModal();
  modal.classList.remove("is-open");
  void modal.offsetWidth;
  modal.classList.add("is-open");
}

function closeModal() {
  if (!activeCard) return;
  activeCard.classList.remove("is-active");
  document.body.classList.remove("has-focus");
  modal.classList.remove("is-open");
  modal.hidden = true;
  activeCard = null;
}

function closeModalSoon() {
  clearTimeout(closeTimer);
  closeTimer = setTimeout(closeModal, 90);
}

function setupProjectFocus() {
  document.querySelectorAll(".project-card").forEach(function (card) {
    card.setAttribute("aria-describedby", "project-modal");

    if (!canHover) return;

    card.addEventListener("mouseenter", function () {
      openModal(card);
    });
    card.addEventListener("mouseleave", closeModalSoon);
    card.addEventListener("focusin", function () {
      openModal(card);
    });
    card.addEventListener("focusout", function (event) {
      if (!card.contains(event.relatedTarget)) closeModalSoon();
    });
  });

  if (!canHover) {
    document.addEventListener("click", function (event) {
      const card = event.target.closest(".project-card");
      if (card && event.target.closest("a")) return;
      if (card) {
        openModal(card);
      } else {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  window.addEventListener("scroll", placeModal, { passive: true });
  window.addEventListener("resize", placeModal);
}

renderProjects();
setupProjectFocus();
document.addEventListener("keydown", stopIntro, { once: true });
document.addEventListener("pointerdown", stopIntro, { once: true });
playIntro();
