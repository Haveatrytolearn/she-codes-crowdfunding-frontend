async function putUpdateProfile(userId, profileData) {
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_API_URL}/users/${userId}/`;

  console.log("Updating profile at:", url);
  console.log("Token format: Token", token.substring(0, 20) + "...");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const fallbackError = "Error updating profile";

    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

    const errorMessage = data?.detail ?? data?.non_field_errors?.[0] ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default putUpdateProfile;
