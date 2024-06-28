
import { useEffect } from "react";
import axios from "axios";
const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
          .get("https://z-image-cdn.com/token-zl", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            localStorage.setItem("token-zl", response.data);
          })
          .catch((error) => { });
  }, []);

  return <></>;
};
export default Dashboard;
