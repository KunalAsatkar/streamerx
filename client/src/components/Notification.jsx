import { useState } from 'react'
import axios from 'axios';

const Notification = () => {
    const [notifyEmail, setNotifyEmail] = useState([]);
    const [subject, setSubject] = useState('');
    const [msg, setMsg] = useState('');

    const handleAddEmail = () => {
        setNotifyEmail([...notifyEmail, '']); // Add an empty EnvVar object
        console.log(notifyEmail)
    };

    const handleEmailChange = (index, e) => {
        const updatedEmail = [...notifyEmail];
        updatedEmail[index] = [...updatedEmail[index]]; // Clone old string
        if (e.target.name === 'email') updatedEmail[index] = e.target.value.trim();
        setNotifyEmail(updatedEmail);
    };

    const handleMsgSubChange = (e) => {
        if (e.target.name === 'subject') setSubject(e.target.value);
        if (e.target.name === 'msg') setMsg(e.target.value);
    }

    const handleSubmitEmails = async () => {
        try {
            const resp = await axios.post("http://localhost:8000/notify", { senderEmail: window.localStorage.getItem('email'), emails: notifyEmail, msg: msg, subject: subject });
            // console.log(resp);
            if (resp.status === 200) {
                // toast logic
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="send-notification-container">
            <h2>Add emails</h2>
            {notifyEmail.map((varString, index) => (
                <div key={index} className="notify-email-input">
                    <div className="sn1">
                        <label htmlFor="email">Email</label>
                        <input
                            className='input'
                            type="text"
                            name='email'
                            placeholder={`email`}
                            value={varString.name}
                            onChange={(e) => handleEmailChange(index, e)}
                        />
                    </div>
                </div>
            ))}
            <div className="notify-email-input">
                <div className="sn1">
                    <label htmlFor="email">Subject</label>
                    <input
                        className='input'
                        type="text"
                        name='subject'
                        placeholder={`email`}
                        onChange={(e) => handleMsgSubChange(e)}
                    />
                </div>
                <div className="sn1">
                    <label htmlFor="email">Message</label>
                    <input
                        className='input'
                        type="text"
                        name='msg'
                        placeholder={`email`}
                        onChange={(e) => handleMsgSubChange(e)}
                    />
                </div>
            </div>
            <button className='button button-primary' onClick={handleAddEmail}>
                + Add Email
            </button>
            <button
                onClick={handleSubmitEmails}
                disabled={!notifyEmail}
                className='button'
                type='submit'
            >
                {notifyEmail ? "Notify" : "Add Emails..."}
            </button>

        </div>
    )
}

export default Notification;