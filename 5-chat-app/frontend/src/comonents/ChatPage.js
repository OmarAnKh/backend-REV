import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:5000");

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [roomTitle, setRoomTitle] = useState("");
    const [message, setMessage] = useState("");
    const [disabledSendLocation, setDisabledSendLocation] = useState(false);
    const [arrayOfMessage, setArrayOfMessage] = useState([]);
    const location = useLocation();
    const { username, room } = location.state || {};
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const autoScroll = () => {
        const { current: messagesEnd } = messagesEndRef;
        if (messagesEnd) {
            const { scrollHeight, clientHeight, scrollTop } = messagesEnd.parentElement;
            const isScrolledNearBottom = scrollHeight - clientHeight - scrollTop < 100;
            if (isScrolledNearBottom) {
                messagesEnd.scrollIntoView({ behavior: "smooth" });
            } else if (scrollTop + clientHeight >= scrollHeight) {
                messagesEnd.scrollIntoView({ behavior: "smooth" });
            }
        }
    };
    



    const getDateStringDifference = (timestamp) => {
        if (!timestamp) {
            return "";
        }
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return "";
        }
        const hour = date.getHours();
        const minute = date.getMinutes();
        const formattedHour = (hour < 10 ? "0" : "") + hour;
        const formattedMinute = (minute < 10 ? "0" : "") + minute;
        const formattedTime = `${formattedHour}:${formattedMinute}`;
        return formattedTime;
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (message === "") {
            return;
        }
        socket.emit("sendMessage", message, (error) => {
            if (error) {
                return console.log(error);
            }
            setMessage("");
        });
    };

    const sendLocation = () => {
        if (!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser.");
        }
        setDisabledSendLocation(true);
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit(
                "getLocation",
                {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                (msg) => {
                    setDisabledSendLocation(false);
                }
            );
        });
    };

    useEffect(() => {
        socket.on("roomData", ({ room, users }) => {
            setRoomTitle(room);
            setUsers(users);
        });
        socket.on("message", (data) => {
            setArrayOfMessage((prevArray) => [...prevArray, data]);
            autoScroll();
        });
        socket.on("locationMessage", (data) => {
            setArrayOfMessage((prevArray) => [...prevArray, data]);
            autoScroll();
        });
        socket.emit("join", { username, room }, (error) => {
            if (error) {
                alert("user name must be unique");
                navigate("/");
            }
        });
        return () => {
            socket.off("message");
            socket.off("locationMessage");
            socket.off("roomData");
        };
    }, []);

    return (
        <div className="chat">
            <div className="chat__sidebar">
                <h2 className="room-title">{roomTitle}</h2>
                <h2 className="list-title">Users</h2>
                <ul className="users">
                    {users.map((user, idx) => (
                        <li key={idx}>
                            <p>{user.username}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat__main">
                <div className="chat__messages">
                    {arrayOfMessage.map((message, idx) => (
                        <p key={idx}>
                            <b>{message?.username}: </b>
                            {message?.URL?.includes(
                                "https://google.com/maps"
                            ) ? (
                                <>
                                    <a href={message.URL}>
                                        Go to location{" "}
                                        <span className="message__meta">
                                            {message?.createdAt &&
                                                getDateStringDifference(
                                                    message?.createdAt
                                                )}
                                        </span>
                                    </a>
                                </>
                            ) : (
                                <>
                                    {message?.text}{" "}
                                    <span className="message__meta">
                                        {message?.createdAt &&
                                            getDateStringDifference(
                                                message?.createdAt
                                            )}
                                    </span>
                                </>
                            )}
                        </p>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="compose">
                    <form id="message-form">
                        <input
                            placeholder="Message"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                        />
                        <button onClick={(event) => sendMessage(event)}>
                            Click
                        </button>
                    </form>
                    <button
                        onClick={sendLocation}
                        disabled={disabledSendLocation}
                    >
                        Send Location
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
