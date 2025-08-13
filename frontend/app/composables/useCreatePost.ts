export const useCreatePost = () => {
  const createPost = async (title: string, description: string) => {
    try {
      // Hardcoded userId and imageUrl for testing
      const userId = 127;
      const imageUrl = "https://example.com/image.jpg";

      // Send POST request to backend
      const res = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization header can be added here later if needed
        },
        body: JSON.stringify({
          userId,
          title,
          description,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");
      const data = await res.json();

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  return { createPost };
};
