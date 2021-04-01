import e from 'express';
import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

function Messages() {
    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);

    const onTextChange = e => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        socket.on('message', ({ name, message }) => {
            setChat([...chat, { name, message }])
        })
    })

    const onMessageSubmit = e => {
        e.preventDefault();
        const { name, message } = state
        socket.emit('message', { name, message });
        setState({ message: '', name })
    }






    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                <h3>{name}: <span>{message}</span></h3>
            </div>
        ))
    }


    return (
        <div className="card">
            <form onSubmit={onMessageSubmit}>
                <h1>Messanger</h1>
                <div className="name-field">
                    <TextField name="name" onChange={e => onTextChange(e)} value={state.name} />
                </div>
                <div>
                    <TextField name="message" onChange={e => onTextChange(e)} value={state.message} />
                </div>
                <button>Send Message</button>
            </form>
            <div className="render-chat">
                <h1>Chat log</h1>
                {renderChat()}
            </div>
        </div>
    )

}

export default Messages