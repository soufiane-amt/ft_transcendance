import axios from "axios"

export const fetchDataFromApi = async (url: string) => {
  return axios
  .get(url, {
    withCredentials: true,
  })

};


  