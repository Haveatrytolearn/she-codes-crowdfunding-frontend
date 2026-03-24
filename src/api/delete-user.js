const apiUrl = import.meta.env.VITE_API_URL;

async function deleteUser(userId) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${apiUrl}/users/${userId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    if (!response.ok) {
        let errorMessage = "Failed to delete account";

        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    return true;
}

export default deleteUser;