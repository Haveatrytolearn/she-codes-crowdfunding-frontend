import { useState } from "react";
import createFundraiser from "../api/post-fundraiser";

export default function useCreateFundraiser() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal: Number(formData.goal),
        image: formData.image.trim(),
        is_open: true,
      };

      if (!payload.title || !payload.description || !payload.goal || !payload.image) {
        throw new Error("Please complete all fields.");
      }

      const createdFundraiser = await createFundraiser(payload);
      
      setSuccessMessage("Fundraiser created successfully.");
      setFormData({
        title: "",
        description: "",
        goal: "",
        image: "",
      });

      return createdFundraiser;
    } catch (error) {
      console.error("Create fundraiser error:", error);
      setErrorMessage(error.message || "Failed to create fundraiser.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      goal: "",
      image: "",
    });
    setErrorMessage("");
    setSuccessMessage("");
  }

  return {
    formData,
    isSubmitting,
    successMessage,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
