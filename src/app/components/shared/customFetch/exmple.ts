import axios from "axios"

export const fetchDataFromApi = async (url: string) => {
  return axios
  .get(url, {
    withCredentials: true,
  })
  .then(({ data }) => {
    console.log (data)

    return (data);
  })
  .catch(() => console.log("err"));

};


  