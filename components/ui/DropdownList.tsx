import React from 'react';

interface DropdownListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode; 
  onSelect: (item: T) => void; 
}

const DropdownList = <T,>({ items, renderItem, onSelect }: DropdownListProps<T>) => {
  return (
    <ul className="absolute top-full left-0 bg-white border border-gray-200 rounded shadow-md w-full z-10">
      {items.length === 0 ? (
        <li className="flex items-center p-2 text-gray-500">
          No results found
        </li>
      ) : (
        items.map((item, index) => (
          <li
            key={index}
            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
          >
            {renderItem(item)}
          </li>
        ))
      )}
    </ul>
  );
};

export default DropdownList;