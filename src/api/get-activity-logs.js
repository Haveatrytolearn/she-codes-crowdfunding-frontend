async function getActivityLogs(search = "") {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in as admin.");
    }

    const baseUrl = `${import.meta.env.VITE_API_URL}/activity-logs/`;
    const params = new URLSearchParams();

    if (search.trim()) {
        params.append("search", search.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error fetching activity logs";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default getActivityLogs;