import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css'; // Assuming the CSS for styling
import inprogress from '../icons/in-progress.svg';
import Todo from '../icons/To-do.svg';
import Backlog from '../icons/Backlog.svg';
import one from '../icons/No-priority.svg';
import two from '../icons/Img - Low Priority.svg';
import three from '../icons/Img - Medium Priority.svg';
import four from '../icons/Img - High Priority.svg';
import five from '../icons/SVG - Urgent Priority grey.svg';
export default function User() {
  const [ticketsByUser, setTicketsByUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        const tickets = response.data.tickets;
        const users = response.data.users;

        // Group tickets by user
        const groupedData = users.reduce((acc, user) => {
          acc[user.id] = {
            name: user.name,
            available: user.available,
            tickets: tickets.filter(ticket => ticket.userId === user.id),
          };
          return acc;
        }, {});

        setTicketsByUser(groupedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  const distinctColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#DFBF9A', '#88D498', '#5C80BC', '#E6AF2E', '#BF98A0',
    '#8EA604', '#F18F01', '#006E90', '#ADCAD6', '#9B4F0F',
    '#C2EABD', '#5FAD56', '#F2C14E', '#F78154', '#4D9078'
  ];
  const getUserInitials = (name) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  const getColorForUser = (userId) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return distinctColors[index % distinctColors.length];
  };
  const [userColors, setUserColors] = useState({});

useEffect(() => {
  const colors = {};
  Object.keys(ticketsByUser).forEach(userId => {
    colors[userId] = getColorForUser(userId);
  });
  setUserColors(colors);
}, [ticketsByUser]);



  return (
    <div className="user-columns-container">
      {Object.entries(ticketsByUser).map(([userId, userData]) => (
        <div className="user-column" key={userId}>
          <div className="user-header">
          <div className="user-info">
          <div 
  className="user-initials"
  style={{ backgroundColor: userColors[userId] || '#ccc' }}
>
  {getUserInitials(userData.name)}
</div>
      <h4>{userData.name} <span className="ticket-count">{userData.tickets.length}</span></h4>
    </div>
            <div className="header-actions">
              <span className="add-ticket">+</span>
              <span className="more-options">...</span> {/* Use three vertical dots */}
            </div>
          </div>
          <div className="tickets-list">
            {userData.tickets.map(ticket => (
              <div className="card-container" key={ticket.id}>
                <div className="card-header">
                  <span className="card-id">{ticket.id}</span>
                  
                </div>
                <div className="card-title-container">
                {ticket.status === "In progress" && <img src={inprogress} alt="Display Icon" className="display-icon" />} {/* Use the hourglass icon for 'In progress' */}
    {ticket.status === "Backlog" && <img src={Backlog} alt="Display Icon" className="display-icon" />} {/* Use the memo icon for 'Backlog' */}
    {ticket.status === "Todo" && <img src={Todo} alt="Display Icon" className="display-icon" />} {/* Use the check icon for 'Todo' */}
                  <h2 className="card-title">{ticket.title}</h2>
                </div>
                <div className="card-footer">
                <div className="card-tag">
  <span className="icon">
    {ticket.priority === 0 && <img src={one} alt="Display Icon" className="display-icon" />} {/* Use the hourglass icon for 'In progress' */}
    {ticket.priority === 1 && <img src={two} alt="Display Icon" className="display-icon" />} {/* Use the memo icon for 'Backlog' */}
    {ticket.priority === 2 && <img src={three} alt="Display Icon" className="display-icon" />} {/* Use the check icon for 'Todo' */}
    {ticket.priority === 3 && <img src={four} alt="Display Icon" className="display-icon" />} {/* Use the hourglass icon for 'In progress' */}
    {ticket.priority ===4 && <img src={five} alt="Display Icon" className="display-icon" />} {/* Use the hourglass icon for 'In progress' */}
   
  </span>
  <span className="status-dot"></span>
  {ticket.tag.join(', ')}
</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
