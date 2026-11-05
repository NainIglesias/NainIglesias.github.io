function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function createRepoInfo(project) {
  if (!project.github) {
    return createElement("span", "repo-private", "🔒 Repositorio privado");
  }

  const link = createElement("a", "repo-link", "→ ver en GitHub");
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
  return new Promise(function (resolve) {
    setTimeout(resolve, skipIntro ? 0 : milliseconds);
  });
}

async function typeStep(step) {
  const typed = step.querySelector(".typed");
  const command = typed.textContent;
  typed.textContent = "";
  step.classList.add("is-shown");

  for (const letter of command) {
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

renderProjects();
document.addEventListener("keydown", stopIntro, { once: true });
document.addEventListener("pointerdown", stopIntro, { once: true });
playIntro();
