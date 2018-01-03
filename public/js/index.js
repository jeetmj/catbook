async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);
  await renderStories(user);
}

main();
