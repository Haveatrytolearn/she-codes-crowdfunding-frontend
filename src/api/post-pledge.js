async function postPledge(pledgeData) {
    const token = window.localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL}/pledges/`;

    const response = await fetch(url, {
        method: "POST", // We need to tell the server that we are sending JSON data so we set the Content-Type header to application/json
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(pledgeData),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to create pledge`;

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = 
            data?.detail || 
            data?.non_field_errors?.[0] ||
            Object.values(data)?.flat()?.[0] ||
            fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postPledge;