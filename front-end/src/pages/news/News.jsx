import { useEffect, useState } from "react";
import NewsList from "./NewsList";

import "./News.css";

const News = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/news`);
        let data = await response.json();
        setData(data);
      } catch {
        console.log("Något gick fel");
      }
    };

    fetchNews();
  }, []);

  return (
    <section className='news-holder' id='news'>
      <div id="news-anchor"></div>
      <NewsList news={data} />
    </section>
  );
};

export default News;
