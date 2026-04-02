async function getUser(userId) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in.");
    }

    const url = `${import.meta.env.VITE_API_URL}/users/${userId}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = `Error fetching user ${userId}`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default getUser;