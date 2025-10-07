document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
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
            alert("Login failed: " + (data.message || "Unknown error"));
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
});
