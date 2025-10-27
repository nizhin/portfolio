import React from 'react'
import "../styles/Contacts.css"

function Contact() {
  const handleOpenPdf = () => {
    window.open(`${process.env.PUBLIC_URL}/resume.pdf`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:qton680@gmail.com';
  };

  const handleLinkedIn = () => {
    window.open('https://www.linkedin.com/in/quenton-ni/', '_blank');
  };

  return (
    <div className="contacts">
        <p className="title">Contact</p>
        <p className='contacts-intro'>Let's connect! Feel free to reach out for opportunities, collaborations, or just to chat.</p>
        
        <div className="contact-links">
          <button className="contact-item" onClick={handleEmail}>
            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span className="contact-text">qton680@gmail.com</span>
          </button>
          
          <button className="contact-item" onClick={handleLinkedIn}>
            <img className="contact-icon" src={`${process.env.PUBLIC_URL}/In-White-128@2x.png`} alt="LinkedIn" />
            <span className="contact-text">LinkedIn</span>
          </button>
          
          <button className="contact-item" onClick={handleOpenPdf}>
            <svg className="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span className="contact-text">Download Resume</span>
          </button>
        </div>
    </div>
  );
}

export default Contact;
