import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import "./ButtonsModule.css";


const DeleteBtn = ({ data,type }) => {
  const { getToken } = useContext(UserContext);

  async function DeleteBtnLogic() {


    const id = data;
    const token = getToken();
    try {

      const res = await fetch(`${process.env.REACT_APP_API_URL}/${type}/${id}`, {
        // Unauthorized, hämta rätt token
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            // Lägga till felhantering för om token inte FINNS___
            `Bearer ${token}`,
        },
      });
      if (res.ok) {
        if(type === "house"){
        const house = document.querySelector(`div[data-house-id="${id}"]`);
          house.remove();
        }
        const news = document.querySelector(`div[data-news-id="${id}"]`);
        news.remove();
        return true;
      } else {
        return false;
      }

    } catch (err) {
      console.log("Något gick fel");
      return false;
    }
  }

  return <button className="btn btn-delete" onClick={() => DeleteBtnLogic({ data })}>Radera</button>;
};

const EditBtn = ({data}) => {
  return <button className="btn btn-edit">{data}</button>;
}

const CreateBtn = ({data}) => {
  return <button className="btn btn-create">{data}</button>
}


export { DeleteBtn,EditBtn, CreateBtn};
