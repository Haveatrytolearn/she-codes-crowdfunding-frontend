async function postRegister(first_name, last_name, email, password) {
  const url = `${import.meta.env.VITE_API_URL}/users/`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      username: email, // Usually username is same as email
    }),
  });

  if (!response.ok) {
    const fallbackError = "Error trying to register";

    const data = await response.json().catch(() => {
      throw new Error(fallbackError);
    });

    const errorMessage = data?.detail ?? data?.non_field_errors?.[0] ?? fallbackError;
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default postRegister;
