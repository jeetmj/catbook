function storyDOMObject(storyJSON, user) {
  const storyDiv = document.createElement('div');
  storyDiv.setAttribute('id', storyJSON.id);
  storyDiv.className = 'story';

  const creatorSpan = document.createElement('span');
  creatorSpan.className = 'story-creator';
  creatorSpan.innerHTML = storyJSON.creator_name + ": ";
  storyDiv.appendChild(creatorSpan);

  const contentSpan = document.createElement('span');
  contentSpan.className = 'story-content';
  contentSpan.innerHTML = storyJSON.content;
  storyDiv.appendChild(contentSpan);

  const commentsDiv = document.createElement('div');
  commentsDiv.className = 'story-comments';

  if (user._id)
    commentsDiv.appendChild(newCommentDOMObject(storyJSON.id));

  storyDiv.appendChild(commentsDiv);

  return storyDiv;
}

function commentDOMObject(commentJSON) {
    commentDiv = document.createElement('div');
    // commentDiv.setAttribute('id', commentJSON._id);
    commentDiv.className = 'comment';

    commentCreatorSpan = document.createElement('span');
    commentCreatorSpan.className = 'comment-creator';
    commentCreatorSpan.innerHTML = commentJSON.creator_name + ": ";
    commentDiv.appendChild(commentCreatorSpan);

    commentContentSpan = document.createElement('span');
    commentContentSpan.className = 'comment-content';
    commentContentSpan.innerHTML = commentJSON.content;
    commentDiv.appendChild(commentContentSpan);

    return commentDiv;
}

function newCommentDOMObject(parent) {
  const newCommentDiv = document.createElement('div');
  newCommentDiv.className = 'comment';

  const newCommentContent = document.createElement('input');
  newCommentContent.setAttribute('type', 'text');
  newCommentContent.setAttribute('name', 'content');
  newCommentContent.setAttribute('placeholder', 'New Comment');
  newCommentDiv.appendChild(newCommentContent);

  const newCommentParent = document.createElement('input');
  newCommentParent.setAttribute('type', 'hidden');
  newCommentParent.setAttribute('name', 'parent');
  newCommentParent.setAttribute('value', parent);
  newCommentDiv.appendChild(newCommentParent);

  const newCommentSubmit = document.createElement('button');
  newCommentSubmit.innerHTML = 'Submit';
  newCommentSubmit.addEventListener('click', submitCommentHandler);
  newCommentDiv.appendChild(newCommentSubmit);

  return newCommentDiv;
}

function submitCommentHandler() {
  const newCommentDiv = this.parentElement;
  const storyDiv = newCommentDiv.parentElement.parentElement;
  const data = {
    content: newCommentDiv.children[0].value,
    parent: storyDiv.id
  };
  post('/api/comment', data);
  newCommentDiv.children[0].value = '';
}

function newStoryDOMObject() {
  const newStoryDiv = document.createElement('div');
  newStoryDiv.className = 'story';

  const newStoryContent = document.createElement('input');
  newStoryContent.setAttribute('type', 'text');
  newStoryContent.setAttribute('placeholder', 'New Story');
  newStoryDiv.appendChild(newStoryContent);

  const newStorySubmit = document.createElement('button');
  newStorySubmit.innerHTML = 'Submit';
  newStorySubmit.addEventListener('click', submitStoryHandler);
  newStoryDiv.appendChild(newStorySubmit);

  return newStoryDiv;
}

function submitStoryHandler() {
  const newStoryDiv = this.parentElement;
  const data = {
    content: newStoryDiv.children[0].value,
  };
  post('/api/story', data);
  newStoryDiv.children[0].value = '';
}

async function renderStories(user) {
  try {
    const storiesDiv = document.getElementById('stories');

    if (user._id)
      storiesDiv.appendChild(newStoryDOMObject()); //todo change name

    const storiesArr = await get('/api/stories', '', '');
    for (let story of storiesArr) { //redo this for loop
      storiesDiv.appendChild(storyDOMObject(story, user));
      const comments = await(get('/api/comment', 'parent', story.id));
      for (let comment of comments) {
        const storyDiv = document.getElementById(comment.parent); //todo refactor name
        storyDiv.children[2].appendChild(commentDOMObject(comment));
      }
    }

  } catch(err) {
    console.log(err);
  }
}
