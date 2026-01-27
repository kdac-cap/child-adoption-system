import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ title, value, color }) => {
  return (
    <div className={`card text-white bg-${color} h-100 shadow-sm`}>
      <div className="card-body p-2 p-md-3">
        <h6 className="card-title fs-7 fs-md-6 mb-2 mb-md-3">{title}</h6>
        <p className="card-text fs-4 fs-md-3 fw-bold mb-0">{value || 0}</p>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

StatsCard.defaultProps = {
  value: 0,
};

export default StatsCard;
