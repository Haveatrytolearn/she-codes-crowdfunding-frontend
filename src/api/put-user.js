async function updateUser(userId, payload) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const url = `${import.meta.env.VITE_API_URL}/users/${userId}/`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const fallbackError = "Error updating user";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default updateUser;