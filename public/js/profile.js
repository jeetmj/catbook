async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);

  const profileId = window.location.search.substring(1);
  const profileUser = await get('/api/user', 'id', profileId);

  renderUserData(profileUser);
}

function renderUserData(user) {
	// rendering name
	const nameContainer = document.getElementById('name-container');
	const nameHeader = document.createElement('h1');
	nameHeader.innerHTML = user.name;
	nameContainer.appendChild(nameHeader);

	// rendering profile image
	const profileImage = document.getElementById('profile-image');
	profileImage.style = 'background-image:url(https://i.pinimg.com/736x/98/e0/7d/98e07decc7c1ca58236995de3567e46a--cat-shirts-kitties-cutest.jpg)';

	// rendering latest post
	const latestPostCard = document.getElementById('latest-post-card');

  	const creatorSpan = document.createElement('a');
  	creatorSpan.className = 'story-creator card-title';
  	creatorSpan.innerHTML = user.name;
  	creatorSpan.setAttribute('href', '/u/profile?'+user._id);
  	latestPostCard.appendChild(creatorSpan);

	const latestPost = document.createElement('p');
	latestPost.className = 'story-content card-text';
  	latestPost.innerHTML = user.last_post;
  	latestPostCard.appendChild(latestPost);
}

main();

// things to add: cat pictures (choice), last post, favorite cat fact (text input), save button
