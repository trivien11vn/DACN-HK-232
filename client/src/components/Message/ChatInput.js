import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

const ChatInput = ({handleSendMsg}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [msg, setMsg] = useState("")
    // const messagesEndRef = useRef(null)

    const handleEmojiPickerHideShow = () => { 
        setShowEmojiPicker(!showEmojiPicker)
    }
    const handleEmojiClick = (event, emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message)
    }

    const sendChat = (event) => {
        event.preventDefault()
        if(msg.length  > 0){
            handleSendMsg(msg)
            setMsg("")
            // Scroll to bottom after sending message
            // scrollToBottom()
        }
    }

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [msg]);

    return (
        <Container>
            <div className='button-container rounded-b-md'>
                <div className='emoji'>
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
                    {
                        showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
                    }
                </div>
            </div>
            <form className='input-container' onSubmit={(e)=>sendChat(e)}>
                <input type='text' placeholder='Your message here...' value={msg} onChange={(e)=>setMsg(e.target.value)}/>
                <button className='submit'>
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color: #0a66c2;
    padding: 0 2rem;
    @media screen and (min-width: 720px) and (max-width: 1080px){
        padding: 0 1rem;
        gap: 1rem;
    }
    .button-container{
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;
        .emoji{
            position: relative;
            svg{
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }
            .emoji-picker-react{
                position: absolute;
                top: -350px;
                background-color: #000420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9186f3;
                .emoji-scroll-wrapper::-webkit-scrollbar {
                    background-color: #0a66c2;
                    width: 5px;
                    &-thumb {
                        background-color: #9a86f3;
                    }
                }
                .emoji-categories{
                    button{
                        filter: contrast(0)
                    }
                }
                .emoji-search{
                    background-color: transparent;
                    border-color: #9186f3;
                }
                .emoji-group:before{
                    background-color: #0a66c2;

                }
            }
        }
    }
    .input-container{
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        background-color: white;
        input {
            width: 90%;
            background-color: transparent;
            color: #0a66c2;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection{
                background-color: #9186f3;
            }
            &:focus{
                outline: none;
            }
        }
        button{
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border: none;
            @media screen and (min-width: 720px) and (max-width: 1080px){
                padding: 0.3rem 1rem;
                svg{
                    font-size: 1.5rem;
                }
            }
            svg{
                font-size: 2rem;
                color: white;
            }
        }
    }
`
export default ChatInput