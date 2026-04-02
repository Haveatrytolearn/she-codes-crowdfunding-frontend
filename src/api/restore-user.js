async function restoreUser(userId) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in as admin.");
    }

    const url = `${import.meta.env.VITE_API_URL}/users/restore/${userId}/`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error restoring user";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default restoreUser;