"use client";
import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const dashboard = () => {
  const jwtToken = Cookies.get("access_token");
  const [User, setUser] = useState<any>({});

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, [jwtToken]);

  return (
    <div className="flex justify-evenly items-center flex-col">
      <div>
        <h1>"login: {User.login}"</h1>
        <h1>"FisrtName: {User.firstname}"</h1>
        <h1>"LastName: {User.lastname}"</h1>
        <h1>"FullName: {User.fullname}"</h1>
        <h1>"Email: {User.email}"</h1>
        <img src={User.avatar || "/ProfileUser.png"} alt="picture" className=" card-shadow rounded-full w-[160px] h-[160px]"/>
      </div>
    </div>
  );
}

export default withAuth(dashboard);