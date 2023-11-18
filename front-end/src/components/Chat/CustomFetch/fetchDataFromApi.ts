import axios from "axios";
import Cookies from "js-cookie";

export const fetchDataFromApi = async (url: string) => {
  const jwtToken = Cookies.get("access_token");
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {});
};
