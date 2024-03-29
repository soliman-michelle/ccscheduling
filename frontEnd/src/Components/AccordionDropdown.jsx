import { useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';

const AccordionDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const itemStyle = {
    textDecoration: 'none', // Remove underline
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  };
  const accordionTitleStyle = {
    color: 'white',
    marginRight: '50px',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" style={accordionTitleStyle}>
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleAccordion}
        >
          {title} {isOpen ? (<IoIosArrowDropup style = {{marginLeft: '10px'}} />)
          
          : (<IoIosArrowDropdown style = {{marginLeft: '10px'}} />)}
        </button>
      </h2>
      <div className={`accordion-collapse ${isOpen ? 'show' : 'collapse'}`}>
        <div className="accordion-body">
          {/* Mapping through the items array and rendering each item */}
          {items.map((item, index) => (
            <Link key={index} to={item.link} style={itemStyle}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

AccordionDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AccordionDropdown;