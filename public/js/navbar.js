function newNavbarItem(text, url) {

  itemLink = document.createElement('a');
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}

async function renderNavbar(user) {
  try {
    const navbarDiv = document.getElementById('nav-item-container');


    navbarDiv.appendChild(newNavbarItem('Home ', '/'));
    // NOTE: this check is a lowkey hack
    if (user._id) {
      navbarDiv.appendChild(newNavbarItem('Profile ', '/u/profile?'+user._id));
      navbarDiv.appendChild(newNavbarItem('Logout', '/logout'));
    } else {
      navbarDiv.appendChild(newNavbarItem('Login', '/auth/facebook'));
    }
  } catch(err) {
    console.log(err);
  }
}

