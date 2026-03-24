const apiUrl = import.meta.env.VITE_API_URL;

async function createFundraiser(fundraiserData) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${apiUrl}/fundraisers/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(fundraiserData),
    });

    if (!response.ok) {
        let errorMessage = "Failed to create fundraiser";

        try {
            const errorData = await response.json();
            errorMessage =
                errorData.detail ||
                errorData.message ||
                JSON.stringify(errorData) ||
                errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export default createFundraiser;