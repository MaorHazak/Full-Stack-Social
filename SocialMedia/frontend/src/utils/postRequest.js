const postRequest = async (url, body) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to send POST request: ${error.message}`);
    }
  };
  const getRequest = async (url) => {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to send GET request: ${error.message}`);
    }
  };
  
  export { postRequest, getRequest };
  