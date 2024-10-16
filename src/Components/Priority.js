import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Priority.css'; // Assuming the CSS for styling
import inprogress from '../icons/in-progress.svg';
import Todo from '../icons/To-do.svg';
import Backlog from '../icons/Backlog.svg';
import one from '../icons/No-priority.svg';
import two from '../icons/Img - Low Priority.svg';
import three from '../icons/Img - Medium Priority.svg';
import four from '../icons/Img - High Priority.svg';
import five from '../icons/SVG - Urgent Priority colour.svg';

export default function Priority() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const priorityIcons = {
    "No Priority": one,
    "Low": two,
    "Medium": three,
    "High": four,
    "Urgent": five
  };
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
  // Group tickets by priority
  const groupedTicketsByPriority = {
    "No Priority": [],
    Urgent: [],
    High: [],
    Medium: [],
    Low: []
  };

  tickets.forEach(ticket => {
    if (ticket.priority === 0) {
      groupedTicketsByPriority["No Priority"].push(ticket);
    } else if (ticket.priority === 4) {
      groupedTicketsByPriority["Urgent"].push(ticket);
    } else if (ticket.priority === 3) {
      groupedTicketsByPriority["High"].push(ticket);
    } else if (ticket.priority === 2) {
      groupedTicketsByPriority["Medium"].push(ticket);
    } else if (ticket.priority === 1) {
      groupedTicketsByPriority["Low"].push(ticket);
    }
  });
  const [userColors, setUserColors] = useState({});

useEffect(() => {
  const colors = {};
  users.forEach(user => {
    colors[user.id] = getColorForUser(user.id);
  });
  setUserColors(colors);
}, [users]);




  return (
    <div className="priority-columns-container">
      {Object.keys(groupedTicketsByPriority).map(priority => (
        <div className="priority-column" key={priority}>
          <div className="priority-header">
          <img src={priorityIcons[priority]} alt={priority} className="priority-icon" />
          <h3>{priority} <span className="ticket-count">{groupedTicketsByPriority[priority].length}</span></h3>
          <div className="header-actions">
              <span className="add-ticket">+</span>
              <span className="more-options">...</span> {/* Use three vertical dots */}
            </div>
        </div>
          <div className="tickets-list">
            {groupedTicketsByPriority[priority].map(ticket => (
              <div className="card-container" key={ticket.id}>
             <div className="card-header">
      <span className="card-id">{ticket.id}</span>
      <div 
  className="priority-initials"
  style={{ backgroundColor: userColors[ticket.userId] || '#ccc' }}
>
  {getUserInitials(ticket.userId)}
</div>
    </div>
                <div className="card-title-container">
                  {ticket.status === "In progress" && <img src={inprogress} alt="In Progress" className="display-icon" />}
                  {ticket.status === "Backlog" && <img src={Backlog} alt="Backlog" className="display-icon" />}
                  {ticket.status === "Todo" && <img src={Todo} alt="Todo" className="display-icon" />}
                  <h2 className="card-title">{ticket.title}</h2>
                </div>
                <div className="card-footer">
                  <div className="card-tag">
                    
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

