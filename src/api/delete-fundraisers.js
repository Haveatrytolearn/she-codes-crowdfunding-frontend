async function deleteFundraiser(fundraiserId) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in as admin.");
    }

    const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error deleting fundraiser";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        throw new Error(data?.detail ?? fallbackError);
    }

    return true;
}

export default deleteFundraiser;