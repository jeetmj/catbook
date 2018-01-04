async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);

  const profileId = window.location.search.substring(1);
  const profileUser = await get('/api/user', 'id', profileId);

  renderUserData(profileUser);
}

function renderUserData(user) {
	const profileContainer = document.getElementById('name-container');

	const nameHeader = document.createElement('h1');
	nameHeader.innerHTML = user.name;
	profileContainer.appendChild(nameHeader);

	const profileImage = document.getElementById('profile-image');
	profileImage.style = 'background-image:url(https://i.pinimg.com/736x/98/e0/7d/98e07decc7c1ca58236995de3567e46a--cat-shirts-kitties-cutest.jpg)';
}

main();