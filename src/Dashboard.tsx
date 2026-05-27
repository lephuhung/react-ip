
import { useEffect } from "react";
import axios from "./axiosInstance";
const Dashboard = () => {
  useEffect(() => {
    axios
          .get("https://z-image-cdn.com/token-zl")
          .then((response) => {
            localStorage.setItem("token-zl", response.data);
          })
          .catch((error) => { });
  }, []);

  return <></>;
};
export default Dashboard;
