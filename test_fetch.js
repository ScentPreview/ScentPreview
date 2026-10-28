const fetch = require('node-fetch');
async function test() {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: "Zayden@233008" })
  });
  const data = await res.json();
  console.log(data);
}
test();
