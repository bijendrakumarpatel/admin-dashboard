import React from "react";
import "./StatCard.css";

export default function StatCard({ label, value, hint, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        {trend && (
          <span
            className={
              "stat-card__trend " +
              (trend > 0 ? "stat-card__trend--up" : "stat-card__trend--down")
            }
          >
            {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      {hint && <div className="stat-card__hint">{hint}</div>}
    </div>
  );
}
