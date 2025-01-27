import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {createSocketConnection} from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
    const {targetUserId} = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector(store => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        const chat = await axios.get(BASE_URL+ "/chat/" +targetUserId, {
            withCredentials: true
        });
        console.log(chat.data.messages);
        const chatMessages = chat?.data?.messages.map((msg) => {
            return { firstName: msg?.senderId?.firstName, text: msg?.text}
        })
        setMessages(chatMessages);
    }

    useEffect(() => {
        fetchChatMessages();
    }, [])

    useEffect(() => {
        if(!userId) {return;}
        const socket = createSocketConnection();
        socket.emit("joinChat", {userId, targetUserId});

        socket.on("messageReceived", ({firstName, text}) => {
            console.log(firstName, text);
            setMessages((messages) => [...messages, {firstName, text}])
        })

        return () => {
            socket.disconnect();
        }
    }, [userId, targetUserId])

    const sendMessage = () => {
        const socket = createSocketConnection();
        socket.emit("sendMessage", {firstName : user?.firstName, userId, targetUserId, text: newMessage})
        setNewMessage("");
    }

    return (
        <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
            <h1 className="p-5 border-b border-gray-600">Chat</h1>
            <div className="flex-1 overflow-scroll p-5">
                {messages?.map((msg, index) => {
                    return (
                        <div key={index} className={"chat "+ (user.firstName === msg.firstName ? "chat-end" : "chat-start")}>
                            <div className="chat-header">
                               {msg?.firstName}
                                {/* <time className="text-xs opacity-50">2 hours ago</time> */}
                            </div>
                            <div className="chat-bubble">{msg?.text}</div>
                            {msg.length > 0 && <div className="chat-footer opacity-50">Seen</div>}
                        </div>
                    )
                })}
            </div>
            <div className="p-5 border-t border-gray-600 flex items-center gap-2">
                <input value={newMessage} className="flex-1 border border-gray-500 text-white rounded p-2" onChange={(e) => setNewMessage(e.target.value)}></input>
                <button className="btn btn-secondary" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default Chat;