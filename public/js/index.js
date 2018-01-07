function main() {
  get('/api/whoami', {}, function(user) {
    renderNavbar(user);
    renderStories(user);
  });
}

main();
