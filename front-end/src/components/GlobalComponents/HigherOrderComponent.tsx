"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "./Loading";
import '../../styles/HigherOrderComponent.css'

const withAuth = (WrappedComponent: any) => {
  const WithAuth = (props: any) => {
    const Router = useRouter();
    const [loadingToken, setLoadingToken] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const JwtToken = Cookies.get("access_token");

    useEffect(() => {
      if (!JwtToken) {
        Router.replace("/");
      } else {
        setTimeout(() => setLoadingToken(false), 1000);
      }
    }, [JwtToken, Router]);

    useEffect(() => {
      async function getUserData() {
        try {
          await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/user`, {
            headers: {
              Authorization: `Bearer ${JwtToken}`,
            },
          });
          setTimeout(() => setLoadingData(false), 2000);
        } catch (error) {
          Router.replace("/");
          console.clear();
        }
      }
      getUserData();
    }, [JwtToken, Router]);

    if (loadingToken || loadingData) {
      return <Loading />;
    }
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

function getDisplayName(WrappedComponent: any) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
