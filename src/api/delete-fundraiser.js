async function deleteFundraiser(fundraiserId) {
    const token = window.localStorage.getItem("token");

    if (!token) {
        throw new Error("You must be logged in to delete a fundraiser.");
    }

    const url = `${import.meta.env.VITE_API_URL}/fundraisers/${fundraiserId}/`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        const fallbackError = "Error trying to delete fundraiser";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return true;
}

export default deleteFundraiser;