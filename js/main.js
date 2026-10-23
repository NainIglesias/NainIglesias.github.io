function renderProjects() {
  const list = document.getElementById("projects-list");

  projects.forEach(function (project) {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const stack = document.createElement("p");
    stack.className = "project-stack";
    stack.textContent = project.stack.join(" · ");

    const link = document.createElement("a");
    link.href = project.github;
    link.textContent = "Ver en GitHub";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.append(title, description, stack, link);
    list.appendChild(card);
  });
}

function renderYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

renderProjects();
renderYear();
