export const useCreatePost = () => {
  const createPost = async (title: string, description: string, imageUrl: string) => {
    try {
      // Get user from session storage
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) throw new Error('User not logged in');

      const user = JSON.parse(sessionUser);
      const userId = user.UserId; // extract UserId

      // get auth token
      const token = sessionStorage.getItem('authtoken');

      // Send POST request to backend
      const res = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
