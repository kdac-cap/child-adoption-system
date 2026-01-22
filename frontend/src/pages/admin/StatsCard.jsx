import React from "react";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className={`card text-white bg-${color} h-100`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text fs-3">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
