import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const useGetSchoolInfo = (url, dependency) => {
  const [data, setData] = useState([]);

  //this hook will fetch school data
  useEffect(() => {
    if (dependency) {
      async function fetchData() {
        try {
          const res = await axios.get(url, {
            headers: {
              Authorization: Cookies.get("tempToken"),
            },
          });
          console.log("test");
          setData(res.data.detail);
        } catch (err) {
          console.error("Failed to fetch departments:", err);
        }
      }
      fetchData();
    } else {
      return;
    }
  }, [dependency]);

  return [data];
};

export default useGetSchoolInfo;
