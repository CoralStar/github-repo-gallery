const overview = document.querySelector(".overview");
const username = "CoralStar";
const repoList = document.querySelector(".repo-list");
const classRepo = document.querySelector(".repos");
const dataRepo = document.querySelector(".repo-data");

const repoBackButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");


const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  showUserInfo(data);
};
gitUserInfo();
//nothing??

const showUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
  <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
  `;
  overview.append(div);
  grabRepos();
};

const grabRepos = async function () {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  showRepos(repoData);
};


const showRepos = function (repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
  const repoItem = document.createElement("li");
  repoItem.classList.add("repo");
  repoItem.innerHTML = `<h3>${repo.name}</h3>`;
  repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    getRepoName(repoName);
  }
});

const getRepoName = async function (repoName) {
  const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await fetchInfo.json();
  console.log(repoInfo);
  
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  
  const languages = [];
  for (const language in languageData) {
    languages.push(language);

  }
  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
  dataRepo.innerHTML = "";
  dataRepo.classList.remove("hide");
  classRepo.classList.add("hide");
  repoBackButton.classList.remove("hide");
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
   `;
  dataRepo.append(div);
};



repoBackButton.addEventListener("click", function () {
  classRepo.classList.remove("hide");
  repoData.classList.add("hide");
  repoBackButton.classList.add("hide");
});

filterInput.addEventListener("input", function (e) {
  const inputText = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const inputLowercase = inputText.toLowerCase();
  
  for (const repo of repos) {
    const repoLowercase = repo.innerText.toLowerCase();
    if (repoLowercase.includes(inputLowercase)) {
        repo.classList.remove("hide");
        } else {
        repo.classList.add("hide");
    }
  }
});
