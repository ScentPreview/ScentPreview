fetch("http://localhost:3000/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyerName: "Test", email: "test@test.com", perfumeSize: "10ml", imageProof: "data:image/png;base64,iVBORw0KGgo" })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
