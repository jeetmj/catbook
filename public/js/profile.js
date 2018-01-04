async function main() {
  const user = await get('/api/whoami', '', '');
  await renderNavbar(user);
}

main();