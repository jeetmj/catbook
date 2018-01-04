async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);
  await renderStories(user);
    var socket = io();
    socket.on('post', function(msg){
        console.log(msg);
        const storiesDiv = document.getElementById('stories');
        storiesDiv.appendChild(storyDOMObject(msg,user));
    });
    socket.on('comment', function(msg){
      console.log(msg);
      const parentStory = document.getElementById(msg.parent);
      parentStory.children[2].appendChild(commentDOMObject(msg));
    });
}

main();
