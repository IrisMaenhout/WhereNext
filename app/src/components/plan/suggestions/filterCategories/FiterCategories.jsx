import React from 'react';
import Select from 'react-select';
// import {
//     ColourOption,
//     colourOptions,
//     FlavourOption,
//     GroupedOption,
//     groupedOptions,
//   } from './docs/data';
  
  


function FiterCategories({groupedOptions, defaultSelected, handleChange}) {
    // const options = [
    //     { value: 'chocolate', label: 'Chocolate' },
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' }
    //   ]

      const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      };
      const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
      };
      
      const formatGroupLabel = (data) => (
        <div style={groupStyles}>
          <span>{data.label}</span>
          <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
      );
    return (
        <>
            {/* <Select options={options} isMulti={true}/> */}

            <Select
                options={groupedOptions}
                formatGroupLabel={formatGroupLabel}
                isMulti={true}
                defaultValue={defaultSelected}
                onChange={handleChange}
            />
        </>
    );
}

export default FiterCategories;