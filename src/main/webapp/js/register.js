
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    document.querySelectorAll('.input-box select').forEach(select => {
        select.addEventListener('change',  function (){
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            firstName: form.querySelector('input[name="firstName"]').value.trim(),
            lastName: form.querySelector('input[name="lastName"]').value.trim(),
            email: form.querySelector('input[name="email"]').value.trim(),
            phone: form.querySelector('input[name="phone"]').value.trim(),
            age: Number(form.querySelector('input[name="age"]').value),
            weight: Number(form.querySelector('input[name="weight"]').value),
            height: Number(form.querySelector('input[name="height"]').value),
            goalWeight: Number(form.querySelector('input[name="goalWeight"]').value),
            activityLevel: form.querySelector('select[name="activityLevel"]').value,
            password: form.querySelector('input[name="password"]').value
        };

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok && result.message === "User registered successfully") {
                alert("✅ Account created successfully!");
                form.reset();
            } else {
                alert("⚠️ " + (result.message || "Registration failed."));
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("❌ Server connection error. Please try again later.");
        }
    });
});
