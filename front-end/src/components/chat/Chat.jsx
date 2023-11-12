/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./Chat.module.css";
import chatIcon from "../../assets/icons/chat-round-svgrepo-com.svg";
import closeIcon from "../../assets/icons/close-svgrepo-com.svg";
import sendIcon from "../../assets/icons/send-svgrepo-com.svg";
import { useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "../../contexts/userContext";

export function Chat() {
  const { getToken, isLoggedIn } = useContext(UserContext);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatOpenDelayed, setChatOpenDelayed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [brokersOnline, setBrokersOnline] = useState(0);
  const [myIcon, setMyIcon] = useState("");
  const [isLoggedInOnStart, setIsLoggedInOnStart] = useState(null);

  //
  // Cleanup the connection when the component is unmounted
  //
  useEffect(() => {
    return () => {
      // console.warn("Unmounting");
      if (connection !== null) {
        cleanUpConnection();
      }
    };
  }, []);


  //
  // When the component is mounted, start the connection if the username is set.
  // And stop the connection when the component is unmounted.
  //
  useEffect(() => {
    if (!connection) {
      document.querySelector(`.${styles.input} input`)?.setAttribute("disabled", "disabled");
    }
    if (myIcon === "") {
      const iconArray = ["🐖", "🐄", "🐑", "🐓", "🐇", "🐿", "🐢", "🐠", "🦆", "🦉", "🦋", "🐞", "🐌", "🦀", "🦑", "🐍", "🦖", "🦈", "🐬", "🦐", "🐉", "🦀", "🦜", "🦢", "🦩", "🦚", "🐧", "🐝", "🪲", "🦥", "🦨"];
      const randomIcon = iconArray[Math.floor(Math.random() * iconArray.length)];
      setMyIcon(randomIcon);
      setIsLoggedInOnStart(isLoggedIn);
    }

    // The user logs in with an already open connection
    if (connection && isLoggedIn && isLoggedInOnStart !== isLoggedIn) {
      cleanUpConnection();
      setIsLoggedInOnStart(isLoggedIn);
      userIsLoggedIn();
    }

    // The user logs in with a closed connection
    if (isLoggedIn && !connection) {
      userIsLoggedIn();
    }
  }, [isLoggedIn, connection]);


  //
  // Mark all messages as read when the chat is opened
  //
  useEffect(() => {
    const messagesCopy = [...messages];
    if (messagesCopy.length > 0) {
      messagesCopy.forEach((message) => {
        message.read = true;
      });
      setMessages(messagesCopy);
    }
  }, [chatOpen]);


  //
  // When the chat is opened, remove the disabled attribute from the input
  // This is used to prevent disabled input if the user is already connected
  //
  useEffect(() => {
    if (chatOpenDelayed && username !== "") {
      document.querySelector(`.${styles.input} input`)?.removeAttribute("disabled");
    }
  }, [chatOpenDelayed]);



  function userIsLoggedIn() {
    const token = getToken();
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decoded = atob(base64);
    const tokenData = JSON.parse(decoded);

    setUsername(tokenData['unique_name']);
    setUserId(tokenData['nameid']);
    setIsLoggedInOnStart(isLoggedIn);
    setMessages([]);
    startConnection();
    openChat();
  }

  function startConnection() {
    const token = getToken();
    let newConnection;
    if (token.length > 0) {
      // Logged in
      newConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.None)
        .withUrl(`${process.env.REACT_APP_API_URL_SIGNAL}/hub/chat`, { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();
    } else {
      // Guest
      newConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.None)
        .withUrl(`${process.env.REACT_APP_API_URL_SIGNAL}/hub/chat`)
        .withAutomaticReconnect()
        .build();
    }

    newConnection.on("messageReceived", (incUserId, incUsername, message, isBroker) => {
      const chatIsOpen = !!document.querySelector(`.${styles.bubble}`);
      const msg = {
        timestamp: new Date().toLocaleTimeString(),
        userId: incUserId,
        username: incUsername,
        message,
        isBroker,
        read: incUserId.toString() === "0" || chatIsOpen
      }
      setMessages(messages => [...messages, msg]);
    });

    newConnection.on("brokersOnline", (number) => {
      setBrokersOnline(number);
    });

    // Start the connection
    if (newConnection.state === signalR.HubConnectionState.Disconnected) {
      newConnection.start()
        .then(() => console.log("SignalR Connected"))
        .catch((err) => console.log("SignalR Connection Error: ", err));
    }

    // Remove disabled attribute from input
    document.querySelector(`.${styles.input} input`)?.removeAttribute("disabled");

    // Set the connection to the state
    setConnection(newConnection);
  }

  function cleanUpConnection() {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      connection.stop();
    }
    setConnection(null);
    setUsername("");
    setUserId("");
    setMessages([]);
    setMessage("");
    setBrokersOnline(0);

  }

  function sendMessage() {
    if (message.trim().length === 0) return;

    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      connection.invoke("OnMessageReceived", userId.toString(), username, message);
      setMessage("");
    } else {
      console.log("SignalR connection is not in the 'Connected' state");
    }
  }

  function handleKeyDownSendMsg(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
  function handleKeyDownSetName(event) {
    if (event.key === "Enter") {
      setGuestUsernameAndId();
    }
  }

  function openChat() {
    if (chatOpen) return;
    setChatOpen(true);
    setTimeout(() => {
      setChatOpenDelayed(true);
    }, 350);
  }
  function closeChat() {
    if (!chatOpen) return;
    setChatOpen(false);
    setTimeout(() => {
      setChatOpenDelayed(false);
    }, 250);
  }

  function setGuestUsernameAndId() {
    const usernameInput = document.getElementById("chat-username-input");
    const username = usernameInput.value.trim();
    if (username.length < 3) {
      return;
    }
    setUsername(myIcon + " " + username);
    // generate a random number between 100.0000 and 999.999
    const userId = Math.floor(Math.random() * 899999) + 100000;
    setUserId(userId);

    startConnection();
  }

  return (
    <div className={`${styles.chat} ${chatOpen ? styles["chat-open"] : ""}`} onClick={openChat}>
      {messages.filter((message) => !message.read).length > 0 && (
        <div className={styles.chatUnreadMessages}>
          <p>{messages.filter((message) => !message.read).length}</p>
        </div>
      )}
      {!chatOpenDelayed && (
        <img src={chatIcon} alt="chat" width="38" height="38" title="Chat" />
      )}
      {chatOpenDelayed && (
        <>
          <div className={styles.header}>
            <div >Chatt</div>
            {username !== "" && chatOpen && (
              <div>🏘️👩‍💼 {brokersOnline}</div>
            )}
            <div className={styles.btnClose} onClick={closeChat}>
              <img src={closeIcon} alt="close" width="22" height="22" />
            </div>
          </div>

          <div className={`${styles.chatbox} ${username === "" ? styles.chatboxNotStarted : ""}`}>
            {username === "" && chatOpen && (
              <div>
                <h3>👋 Välj ett namn och hoppa in i gruppchatten med våra mäklare! 🏠</h3>
                <input id="chat-username-input" minLength={3} type="text" placeholder="Namn" onKeyDown={handleKeyDownSetName} />
                <p>Namnet måste vara minst 3 tecken långt</p>
                <button onClick={setGuestUsernameAndId} >Spara och Anslut</button>
              </div>
            )}
            {username !== "" && chatOpen && (
              messages.slice().reverse().map((message, index) => (
                <li className={`
                  ${styles.bubble} 
                  ${message.userId === userId.toString() ? styles.bubbleMyMessage : ""} 
                  ${message.isBroker && message.userId !== userId.toString() ? styles.bubbleBroker : ""}`
                } key={index}>
                  <b>{message.isBroker ? "🏡" : ""}{message.userId === "0" ? "🤖" : ""} {message.username}</b>
                  <p>{message.message} </p>
                  <span>{message.timestamp.slice(0, 5)}</span>
                </li>
              ))
            )}
          </div>


          <div className={styles.input}>
            <input disabled type="text" maxLength={200} placeholder="Skriv här" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDownSendMsg} />
            {username !== "" && (
              <img src={sendIcon} alt="send" width={27} height={27} onClick={sendMessage} />
            )}
          </div>
        </>
      )
      }
    </div >
  );
};

