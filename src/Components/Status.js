import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Status.css'; // Assuming the CSS for styling
import inprogress from '../icons/in-progress.svg';
import Todo from '../icons/To-do.svg';
import Backlog from '../icons/Backlog.svg';
import Done from '../icons/Done.svg';  // You'll need to add this icon
import Cancelled from '../icons/Cancelled.svg';  // You'll need to add this icon
import one from '../icons/No-priority.svg';
import two from '../icons/Img - Low Priority.svg';
import three from '../icons/Img - Medium Priority.svg';
import four from '../icons/Img - High Priority.svg';
import five from '../icons/SVG - Urgent Priority grey.svg';

export default function Status() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const distinctColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#DFBF9A', '#88D498', '#5C80BC', '#E6AF2E', '#BF98A0',
    '#8EA604', '#F18F01', '#006E90', '#ADCAD6', '#9B4F0F',
    '#C2EABD', '#5FAD56', '#F2C14E', '#F78154', '#4D9078'
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
 
  const getUserInitials = (userId) => {
    const user = users.find(user => user.id === userId);
    if (!user) return '??';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  const getColorForUser = (userId) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return distinctColors[index % distinctColors.length];
  };
  // Group tickets by status
  const groupedTickets = {
    Backlog: [],
    Todo: [],
    "In progress": [],
    Done: [],
    Cancelled: []
  };

  tickets.forEach(ticket => {
    if (groupedTickets[ticket.status]) {
      groupedTickets[ticket.status].push(ticket);
    }
  });
  const statusIcons = {
    Backlog: Backlog,
    "In progress": inprogress,
    Todo: Todo,
    Done: Done,
    Cancelled: Cancelled
  };
  const [userColors, setUserColors] = useState({});

useEffect(() => {
  const colors = {};
  users.forEach(user => {
    colors[user.id] = getColorForUser(user.id);
  });
  setUserColors(colors);
}, [users]);



  return (
    <div className="Status-columns-container">
      {Object.keys(groupedTickets).map(status => (
        <div className="Status-column" key={status}>
          <div className="Status-header">
          <img src={statusIcons[status]} alt={status} className="status-icon" />
            <h3>{status} <span className="ticket-count">{groupedTickets[status].length}</span></h3>
            <div className="header-actions">
              <span className="add-ticket">+</span>
              <span className="more-options">...</span> {/* Use three vertical dots */}
            </div>
          </div>
          <div className="tickets-list">
            {groupedTickets[status].map(ticket => (
              <div className="card-container" key={ticket.id}>
               <div className="card-header">
      <span className="card-id">{ticket.id}</span>
     
<div 
  className="Status-initials"
  style={{ backgroundColor: userColors[ticket.userId] || '#ccc' }}
>
  {getUserInitials(ticket.userId)}
</div>
    </div>
                <div className="card-title-container">
                  
                  <h2 className="card-title">{ticket.title}</h2>
                </div>
                <div className="card-footer">
                  <div className="card-tag">
                    <span className="icon">
                      {ticket.priority === 0 && <img src={one} alt="No Priority" className="display-icon" />}
                      {ticket.priority === 1 && <img src={two} alt="Low Priority" className="display-icon" />}
                      {ticket.priority === 2 && <img src={three} alt="Medium Priority" className="display-icon" />}
                      {ticket.priority === 3 && <img src={four} alt="High Priority" className="display-icon" />}
                      {ticket.priority === 4 && <img src={five} alt="Urgent Priority" className="display-icon" />}
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

