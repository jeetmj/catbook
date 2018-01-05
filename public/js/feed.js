function storyDOMObject(storyJSON, user) {
  const card = document.createElement('div');
  card.setAttribute('id', storyJSON._id);
  card.className = 'story card';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  card.appendChild(cardBody);

  const creatorSpan = document.createElement('a');
  creatorSpan.className = 'story-creator card-title';
  creatorSpan.innerHTML = storyJSON.creator_name;
  creatorSpan.setAttribute('href', '/u/profile?'+storyJSON.creator_id);
  cardBody.appendChild(creatorSpan);

  const contentSpan = document.createElement('p');
  contentSpan.className = 'story-content card-text';
  contentSpan.innerHTML = storyJSON.content;
  cardBody.appendChild(contentSpan);

  const cardFooter = document.createElement('div');
  cardFooter.className = 'card-footer';
  card.appendChild(cardFooter);

  const commentsDiv = document.createElement('div');
  commentsDiv.setAttribute('id', storyJSON._id + '-comments');
  commentsDiv.className = 'story-comments';
  cardFooter.appendChild(commentsDiv);

  if (user._id)
    cardFooter.appendChild(newCommentDOMObject(storyJSON._id));

  return card;
}

function commentDOMObject(commentJSON) {
    commentDiv = document.createElement('div');
    commentDiv.setAttribute('id', commentJSON._id);
    commentDiv.className = 'comment';

    commentCreatorSpan = document.createElement('a');
    commentCreatorSpan.className = 'comment-creator';
    commentCreatorSpan.innerHTML = commentJSON.creator_name;
    commentCreatorSpan.setAttribute('href', '/u/profile?'+commentJSON.creator_id);
    commentDiv.appendChild(commentCreatorSpan);

    commentContentSpan = document.createElement('span');
    commentContentSpan.className = 'comment-content';
    commentContentSpan.innerHTML = ' | ' + commentJSON.content;
    commentDiv.appendChild(commentContentSpan);

    return commentDiv;
}

function newCommentDOMObject(parent) {
  const newCommentDiv = document.createElement('div');
  newCommentDiv.className = 'comment input-group';

  const newCommentContent = document.createElement('input');
  newCommentContent.setAttribute('type', 'text');
  newCommentContent.setAttribute('name', 'content');
  newCommentContent.setAttribute('placeholder', 'New Comment');
  newCommentContent.setAttribute('id', parent + '-comment-input');
  newCommentDiv.appendChild(newCommentContent);

  const newCommentParent = document.createElement('input');
  newCommentParent.setAttribute('type', 'hidden');
  newCommentParent.setAttribute('name', 'parent');
  newCommentParent.setAttribute('value', parent);
  newCommentDiv.appendChild(newCommentParent);

  const newCommentButtonDiv = document.createElement('div');
  newCommentDiv.appendChild(newCommentButtonDiv);

  const newCommentSubmit = document.createElement('button');
  newCommentSubmit.innerHTML = 'Submit';
  newCommentSubmit.setAttribute('story-id', parent);
  newCommentSubmit.addEventListener('click', submitCommentHandler);
  newCommentButtonDiv.appendChild(newCommentSubmit);

  return newCommentDiv;
}

function submitCommentHandler() {
  console.log(this);
  const commentInput = document.getElementById(this.getAttribute('story-id') + '-comment-input');
  console.log(this.getAttribute('story-id'));
  const data = {
    content: commentInput.value,
    parent: this.getAttribute('story-id')
  };
  post('/api/comment', data);
  commentInput.value = '';
}

function newStoryDOMObject() {
  const newStoryDiv = document.createElement('div');

  const newStoryContent = document.createElement('input');
  newStoryContent.setAttribute('type', 'text');
  newStoryContent.setAttribute('placeholder', 'New Story');
  newStoryContent.setAttribute('id', 'story-content-input')
  newStoryDiv.appendChild(newStoryContent);

  const newStoryButtonDiv = document.createElement('div');
  newStoryDiv.appendChild(newStoryButtonDiv);

  const newStorySubmit = document.createElement('button');
  newStorySubmit.innerHTML = 'Submit';
  newStorySubmit.addEventListener('click', submitStoryHandler);
  newStoryButtonDiv.appendChild(newStorySubmit);

  return newStoryDiv;
}

function submitStoryHandler() {
  const newStoryInput = document.getElementById('story-content-input');
  const data = {
    content: newStoryInput.value,
  };
  post('/api/story', data);
  newStoryInput.value = '';
}

async function renderStories(user) {
  try {

    if (user._id)
      document.getElementById('new-story').appendChild(newStoryDOMObject());

    const storiesDiv = document.getElementById('stories');

    const storiesArr = await get('/api/stories', '', '');
    for (let story of storiesArr) { //redo this for loop
      storiesDiv.prepend(storyDOMObject(story, user));
      const comments = await(get('/api/comment', 'parent', story._id));
      for (let comment of comments) {
        const commentDiv = document.getElementById(comment.parent + '-comments');
        commentDiv.appendChild(commentDOMObject(comment));
      }
    }

  } catch(err) {
    console.log(err);
  }
}