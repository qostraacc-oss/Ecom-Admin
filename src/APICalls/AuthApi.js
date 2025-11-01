import httpClient from "../Constant/API";

export const refreshAccessToken = async () => {
  try {
    await httpClient.post(
      "/accounts/token/refresh/",
      {},
      {
        headers: {
          "X-CSRFToken": httpClient.defaults.headers.common["X-CSRFToken"],
        },
      }
    );
    return true;
  } catch (err) {
    return false;
  }
};