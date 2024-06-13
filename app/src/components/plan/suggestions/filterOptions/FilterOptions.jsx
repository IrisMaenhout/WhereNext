import React from 'react';
import styles from './filterOptions.module.css';
import PrimaryBtn from '../../../global/btns/primary/btn/PrimaryBtn';
import FilterCategories from '../filterCategories/FilterCategories';

const FilterOptions = ({ page, filterCategories, handleChangeFilterInputs, onSave }) => {
  const groupedOptionsAccomodations = [{
    label: 'Accomodations',
    options: filterCategories.accomodations,
  }];

  const groupedOptionsThingsToDo = [{
    label: 'Things to do',
    options: filterCategories.thingsToDo,
  },
  {
    label: 'Sport',
    options: filterCategories.sport,
  }];

  const groupedOptionsFoodAndDrinks = [{
    label: 'Drinks',
    options: filterCategories.foodAndDrinks.drinks,
  },
  {
    label: 'Asian restaurants',
    options: filterCategories.foodAndDrinks.restaurants.asian,
  },
  {
    label: 'American restaurants',
    options: filterCategories.foodAndDrinks.restaurants.american,
  },
  {
    label: 'European restaurants',
    options: filterCategories.foodAndDrinks.restaurants.european,
  },
  {
    label: 'Middle-eastern restaurants',
    options: filterCategories.foodAndDrinks.restaurants['middle-eastern'],
  },
  {
    label: 'Other restaurants',
    options: filterCategories.foodAndDrinks.restaurants.others,
  }
  ];

  return (
    <div className={`${styles.filterContainer}`}>
      <div className={styles.flexContainer}>
        <h3>Filter on categories</h3>
        <PrimaryBtn onClick={onSave}>
          Save
        </PrimaryBtn>
      </div>

      {
        page === "accomodations" ?
          <>
            <label>Accomodations</label>
            <FilterCategories
              groupedOptions={groupedOptionsAccomodations}
              defaultSelected={[
                filterCategories.accomodations[0],
                filterCategories.accomodations[1],
                filterCategories.accomodations[3],
                filterCategories.accomodations[5],
                filterCategories.accomodations[6],
                filterCategories.accomodations[7]
              ]}
              handleChange={(selectedValues) => handleChangeFilterInputs('accomodations', selectedValues)}
            />
          </>
          :
          <>
            <label>Things to do</label>
            <FilterCategories
              groupedOptions={groupedOptionsThingsToDo}
              defaultSelected={[
                filterCategories.thingsToDo[1],
                filterCategories.thingsToDo[7],
                filterCategories.thingsToDo[9],
                filterCategories.thingsToDo[12],
                filterCategories.sport[0]
              ]}
              handleChange={(selectedValues) => handleChangeFilterInputs('thingsToDo', selectedValues)}
            />
            <label>Restaurants</label>
            <FilterCategories
              groupedOptions={groupedOptionsFoodAndDrinks}
              defaultSelected={[]}
              handleChange={(selectedValues) => handleChangeFilterInputs('foodAndDrinks', selectedValues)}
            />
          </>
      }
    </div>
  );
};

export default FilterOptions;
