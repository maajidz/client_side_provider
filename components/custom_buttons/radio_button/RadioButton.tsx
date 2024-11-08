// components/RadioButton.js
import React from 'react';
import styles from './RadioButton.module.css';

const RadioButton = ({ label, name, value, selectedValue, onChange }: {label: React.ReactNode; name: string, value: string, selectedValue:string,  onChange: (value: string) => void}) => {
  return (
    <div
      className={`${styles.container} ${selectedValue === value ? styles.selected : ''}`}
      onClick={() => onChange(value)}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        className={styles.radioButton}
      />
      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default RadioButton;
