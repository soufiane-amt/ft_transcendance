"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const withAuth = (WrappedComponent : any) => {
  return (props : any) => {
    const Router = useRouter();
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
      const token = Cookies.get("access_token");
      if (!token) {
        Router.replace("/");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) {
      return <p>Loading...</p>;
    }
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
