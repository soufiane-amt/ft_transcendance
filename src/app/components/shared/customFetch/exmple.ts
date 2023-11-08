import axios from "axios"

export const fetchDataFromApi = async (url: string) => {
  return axios
  .get(url, {
    withCredentials: true,
  }).then(response =>{
    console.log(response)
    return response.data
  }).catch(err=>{
    console.log(err)
  })
};


  