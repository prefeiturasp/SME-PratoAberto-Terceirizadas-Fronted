import React, { useState } from "react";
import { arrayOf, string, number, func } from "prop-types";
import "./style.scss";

const Tab = ({ index, activeIndex, setActiveIndex, title }) => {
  const active = index === activeIndex;
  return (
    <div    
      onClick={() => setActiveIndex(index)}
      className={`tab col-6 ${active ? "active" : "inactive"}`}
    >
      {title}
    </div>
  );
};
Tab.propTypes = {
  index: number,
  activeIndex: number,
  setActiveIndex: func,
  title: string
};

const Tabs = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabs">
      <div className="row">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            index={index}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            title={tab}
          />
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: arrayOf(string)
};

export default Tabs;
