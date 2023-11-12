import { DeleteBtn, EditBtn } from "../../components/buttons/Buttons";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

const NewsItem = ({ news }) => {
  const { isLoggedIn, isAdmin } = useContext(UserContext);
  return (
    <div className='news-card-cont'>
      <div className='news-item'>
        <h3>{news.title}</h3>
        <p>{news.description}</p>

        {isLoggedIn && isAdmin && window.location.pathname === "/admin" ? (
          <div className="news-logged-in">
            <DeleteBtn data={news.id} type='news' />
            <Link to={`/news/edit/${news.id}`}>
              <EditBtn data={"Redigera nyhet"}></EditBtn>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewsItem;
