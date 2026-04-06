async function getFundraisers(showDeleted = false, search = "") {
    const token = window.localStorage.getItem("token");

    const baseUrl = `${import.meta.env.VITE_API_URL}/fundraisers/`;
    const params = new URLSearchParams();

    if (showDeleted) {
        params.append("deleted", "true");
    }

    if (search.trim()) {
        params.append("search", search.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Token ${token}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    });

    if (!response.ok) {
        const fallbackError = "Error fetching fundraisers";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return await response.json();
}

export default getFundraisers;