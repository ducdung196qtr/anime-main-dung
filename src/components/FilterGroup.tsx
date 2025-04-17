import React from 'react';

interface FilterOptionProps {
  label: string;
  value: string;
  isSelected: boolean;
  onChange: (value: string) => void;
}

const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  value,
  isSelected,
  onChange
}) => {
  return (
    <div 
      className={`px-4 py-2.5 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${                  
        isSelected
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-700 dark:text-gray-200 hover:text-white'
      }`}
      onClick={() => onChange(value)}
    >
      {label}
    </div>
  );
};

interface FilterGroupProps {
  title: string;
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  selectedValue,
  onChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            value={option.value}
            isSelected={selectedValue === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
