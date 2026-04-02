async function updateFundraiser(fundraiserId, payload) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in to edit a fundraiser.");
    }

    const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const fallbackError = "Error trying to update fundraiser";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default updateFundraiser;