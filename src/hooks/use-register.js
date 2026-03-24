import { useState } from "react";
import postRegister from "../api/post-register";

export default function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (first_name, last_name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postRegister(first_name, last_name, email, password);
      setIsLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { register, isLoading, error };
}
