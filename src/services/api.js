import { toast } from 'react-toastify';

const getAuthToken = () => localStorage.getItem('token');

const fetchWithToken = async (url, options = {}) => {
  const token = getAuthToken();

  console.log('Token fetched from storage by api:', token);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['x-auth-token'] = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        toast.error('Token not verified successfully');
      }
      throw new Error(errorData.message || 'An error occurred');
    }

    return response; // Return the JSON data
  } catch (error) {
    // Handle other errors (network issues, etc.)
    console.error('Error during fetch:', error);
    toast.error('An error occurred while fetching data');
    throw error; // Rethrow to handle in calling function
  }
};

export default fetchWithToken;
