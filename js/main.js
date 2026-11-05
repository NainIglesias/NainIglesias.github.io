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

renderProjects();
