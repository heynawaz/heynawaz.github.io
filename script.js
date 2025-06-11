// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Fetch GitHub repositories
async function fetchGitHubRepos() {
  try {
    const response = await fetch('https://api.github.com/users/heynawaz/repos?sort=pushed&per_page=6');
    const repos = await response.json();
    return repos.filter(repo => !repo.fork); // Filter out forked repositories
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

// Load projects from GitHub
async function loadProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '<div class="loading-spinner"></div>';

  const repos = await fetchGitHubRepos();

  projectsGrid.innerHTML = '';

  repos.forEach(repo => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
        <div class="project-header">
            <i class="far fa-folder-open"></i>
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                <a href="${repo.html_url}" target="_blank" title="View Source"><i class="fab fa-github"></i></a>
            </div>
        </div>
        <h3 class="project-title">${repo.name}</h3>
        <p class="project-description">${repo.description || 'No description available'}</p>
        <div class="project-meta">
            ${
              repo.language
                ? `<span class="project-language">
                <span class="language-color" data-language="${repo.language}"></span>
                ${repo.language}
            </span>`
                : ''
            }
            ${
              repo.stargazers_count
                ? `<span class="project-stars">
                <i class="fas fa-star"></i> ${repo.stargazers_count}
            </span>`
                : ''
            }
            ${
              repo.forks_count
                ? `<span class="project-forks">
                <i class="fas fa-code-branch"></i> ${repo.forks_count}
            </span>`
                : ''
            }
        </div>
    `;
    projectsGrid.appendChild(projectCard);
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// GitHub profile fetching
async function fetchGitHubProfile() {
  try {
    const response = await fetch('https://api.github.com/users/heynawaz');
    const data = await response.json();

    // Update DOM elements with smooth transitions
    const nameElement = document.getElementById('github-name');
    const bioElement = document.getElementById('github-bio');

    nameElement.style.opacity = '0';
    bioElement.style.opacity = '0';

    setTimeout(() => {
      nameElement.textContent = data.name || data.login;
      bioElement.textContent = data.bio || 'Software Engineer building amazing things';

      nameElement.style.opacity = '1';
      bioElement.style.opacity = '1';

      if (data.location) {
        const locationElement = document.getElementById('github-location');
        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location}`;
      }
    }, 300);

    const profileLink = document.getElementById('github-profile');
    profileLink.href = data.html_url;
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    // Fallback content
    document.getElementById('github-name').textContent = 'Nawaz';
    document.getElementById('github-bio').textContent = 'Senior Software Engineer';
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  fetchGitHubProfile();
});
