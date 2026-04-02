async function getUsers(showDeleted = false) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in as admin.");
    }

    const baseUrl = `${import.meta.env.VITE_API_URL}/users/`;
    const url = showDeleted ? `${baseUrl}?deleted=true` : baseUrl;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error fetching users";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default getUsers;