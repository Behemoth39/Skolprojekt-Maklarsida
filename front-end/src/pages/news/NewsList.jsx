import NewsItem from "./NewsItem";
import { Fragment } from "react";

const NewsList = ({ news }) => {
  return (
    <>
      {news.map((news) => (
        <div data-news-id={news.id} key={news.id}>
          <NewsItem news={news} />
        </div>
      ))}
    </>
  );
};

export default NewsList;
