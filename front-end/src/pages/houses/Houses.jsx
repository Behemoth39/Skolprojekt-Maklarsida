import { useEffect, useState } from "react";
import HousesList from "./HousesList";

const Houses = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/house`);
        const data = await response.json();

        // remove all items that are  sold
        const filteredData = data.filter(item => item.sold === null)
        setData(filteredData);
      } catch {
        console.log("Något gick fel");
      }
    };

    fetchHouses();
  }, []);

  return (
    <>
      <HousesList houses={data} />
    </>
  );
};

export default Houses;
