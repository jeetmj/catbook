function get(endpoint, queryVar, queryVal) {
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest();
    fullPath = endpoint + '?' + queryVar + '=' + queryVal;
    xhr.open('GET', fullPath, true);
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      reject(xhr.statusText);
    }
    xhr.send(null);
  });
}

function newStory(storyJSON, user) {
  storyDiv = document.createElement('div');
  storyDiv.setAttribute('id', storyJSON._id);
  storyDiv.className = 'story';

  ownerSpan = document.createElement('span');
  ownerSpan.className = 'story-owner';
  ownerSpan.innerHTML = storyJSON.owner + ": ";
  storyDiv.appendChild(ownerSpan);

  messageSpan = document.createElement('span');
  messageSpan.className = 'story-message';
  messageSpan.innerHTML = storyJSON.message;
  storyDiv.appendChild(messageSpan);

  commentsDiv = document.createElement('div');
  commentsDiv.className = 'story-comments';
  // TODO: change for loop syntax
  for (let i=0; i < storyJSON.comments.length; ++i) {
    commentDiv = document.createElement('div');
    commentDiv.setAttribute('id', storyJSON.comments[i]._id);
    commentDiv.className = 'comment';

    commentOwnerSpan = document.createElement('span');
    commentOwnerSpan.className = 'comment-owner';
    commentOwnerSpan.innerHTML = storyJSON.comments[i].owner + ": ";
    commentDiv.appendChild(commentOwnerSpan);

    commentMessageSpan = document.createElement('span');
    commentMessageSpan.className = 'comment-message';
    commentMessageSpan.innerHTML = storyJSON.comments[i].message;
    commentDiv.appendChild(commentMessageSpan);

    commentsDiv.appendChild(commentDiv);
  }
  if (user._id) {
    commentForm = document.createElement('form');
    commentForm.setAttribute('method', 'post');
    commentForm.setAttribute('action', '/api/comment');

    commentMessage = document.createElement('input');
    commentMessage.setAttribute('type', 'text');
    commentMessage.setAttribute('name', 'message');
    commentMessage.setAttribute('placeholder', 'New Comment');
    commentForm.appendChild(commentMessage);

    commentOwner = document.createElement('input');
    commentOwner.setAttribute('type', 'hidden');
    commentOwner.setAttribute('name', 'owner');
    commentOwner.setAttribute('value', user._id);
    commentForm.appendChild(commentOwner);

    commentParent = document.createElement('input');
    commentParent.setAttribute('type', 'hidden');
    commentParent.setAttribute('name', 'parent');
    commentParent.setAttribute('value', storyJSON._id);
    commentForm.appendChild(commentParent);

    commentSubmit = document.createElement('input');
    commentSubmit.setAttribute('type', 'submit');
    commentSubmit.innerHTML = 'Send';
    commentForm.appendChild(commentSubmit);

    commentsDiv.appendChild(commentForm);
  }


  storyDiv.appendChild(commentsDiv);

  return storyDiv;
};


async function getStoriesJSON() {
  const storiesArr = await get('/api/stories', '', '');

  // TODO: This is very inefficient. Rendering should happen on the fly not at the very end
  for (let story of storiesArr) {
    story.owner = (await get('/api/user', 'id', story.owner)).name;
    story.comments = await get('/api/comment', 'parent', story._id);
    for (let comment of story.comments) {
      comment.owner = (await get('/api/user', 'id', comment.owner)).name;
    }
  }
  return storiesArr;
}

async function renderStories(user) {
  try {
    storiesDiv = document.getElementById('stories');

    if (user._id) {
      storyForm = document.createElement('form');
      storyForm.setAttribute('method', 'post');
      storyForm.setAttribute('action', '/api/story');

      storyMessage = document.createElement('input');
      storyMessage.setAttribute('type', 'text');
      storyMessage.setAttribute('name', 'message');
      storyMessage.setAttribute('placeholder', 'New Story');
      storyForm.appendChild(storyMessage);

      storyOwner = document.createElement('input');
      storyOwner.setAttribute('type', 'hidden');
      storyOwner.setAttribute('name', 'owner');
      storyOwner.setAttribute('value', user._id);
      storyForm.appendChild(storyOwner);

      storySubmit = document.createElement('input');
      storySubmit.setAttribute('type', 'submit');
      storySubmit.innerHTML = 'Send';
      storyForm.appendChild(storySubmit);

      storiesDiv.appendChild(storyForm);
    }

    const storiesArr = await getStoriesJSON('/api/stories', '', '');
    for (let story of storiesArr) {
      storiesDiv.appendChild(newStory(await story, user));
    }

  } catch(err) {
    console.log(err);
  }
}

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

async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);
  await renderStories(user);
}

main();
