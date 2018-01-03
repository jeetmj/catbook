function newNavbarItem(text, url) {
  item = document.createElement('div');

  itemLink = document.createElement('a');
  itemLink.className = 'navbar-item';
  itemLink.innerHTML = text;
  itemLink.href= url;

  item.appendChild(itemLink);

  return item
}

async function renderNavbar(user) {
  try {
    const navbarDiv = document.getElementById('navbar');


    navbarDiv.appendChild(newNavbarItem('Home', '/'));
    // NOTE: this check is a lowkey hack
    if (user._id) {
      navbarDiv.appendChild(newNavbarItem('Profile', '/u/'+user.fbid+'/profile'));
      navbarDiv.appendChild(newNavbarItem('Logout', '/logout'));
    } else {
      navbarDiv.appendChild(newNavbarItem('Login', '/auth/facebook'));
    }
  } catch(err) {
    console.log(err);
  }
}

