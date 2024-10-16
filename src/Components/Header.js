import React, { useState } from 'react';
import './Header.css';
import Display from '../icons/Display.svg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = ({ setGrouping, setOrdering }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [grouping, setGroupingState] = useState('User'); // Default grouping
  const [ordering, setOrderingState] = useState('None'); // Default ordering
  const mynavigate = useNavigate(); // Initialize the navigate function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGroupingChange = (newGrouping) => {
    setGroupingState(newGrouping);
    setIsMenuOpen(false); // Close dropdown after selection

    // Navigate to a specific page based on the selected grouping
    if (newGrouping === "Status") {
      mynavigate('/status'); // Ensure '/status' matches your route
    } else if (newGrouping === "User") {
      mynavigate('/'); // Ensure this matches your route for user page
    }
  };
  const handleOrderingChange = (newOrdering) => {
    setOrderingState(newOrdering);
    setIsMenuOpen(false); // Close dropdown after selection
    // Here, you might want to navigate if there's a separate page for ordering
    if (newOrdering === 'Priority') {
      mynavigate('/priority'); // Ensure this route is defined in your Router
    }
  };

  return (
    <div className="header">
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleMenu}>
          <img src={Display} alt="Display Icon" className="display-icon" />
          Display <i className="arrow-down"></i>
        </button>

        {isMenuOpen && (
          <div className="dropdown-content">
            <div className="dropdown-group">
              <label>Grouping</label>
              <select
                value={grouping}
                onChange={(e) => handleGroupingChange(e.target.value)}
              >
                <option value="User" >
                <Link to="/">User</Link>
              </option>
              <option value="Status" >
                <Link to="/status">Status</Link>
              </option>
              </select>
            </div>

            <div className="dropdown-group">
              <label>Ordering</label>
              <select
                value={ordering}
                onChange={(e) => handleOrderingChange(e.target.value)}
              >
                  <option value="None"><Link to="/">None</Link></option>
                <option value="Priority"><Link to="/priority">Priority</Link></option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
