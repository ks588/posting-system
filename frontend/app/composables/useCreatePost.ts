export const useCreatePost = () => {
  const createPost = async (title: string, description: string, imageFile: File) => {
    try {
      // Get user from session storage
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) throw new Error('User not logged in');

      const user = JSON.parse(sessionUser);
      const userId = user.UserId; // extract UserId

      // Get auth token
      const token = sessionStorage.getItem('authtoken');

      // Create FormData
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', imageFile); // append file

      // Send POST request
      const res = await fetch('http://localhost:3000/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create post');
      const data = await res.json();

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  return { createPost };
};
