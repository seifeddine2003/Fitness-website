// ../js/index.js

document.querySelector("button").addEventListener("click", async () => {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Login successful!");
        console.log(data);
    } else {
        alert("Login failed: " + data.message);
    }
});
