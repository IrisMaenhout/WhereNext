import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import React, { useContext } from 'react';
import styles from '../itinerary.module.css';
import ItineraryCard from '../itineraryCard/ItineraryCard';
import { LoggedInUserContext } from '../../../../context/LoggedInUserContext';

function DropBox({ dropBoxId, index, itineraryPlaces, children, date, handleDragOver, handleDragEnd }) {
    const { setNodeRef } = useDroppable({ id: dropBoxId});
    // const loggedInUser = useContext(LoggedInUserContext);

    return (
        <SortableContext id={dropBoxId} items={itineraryPlaces.filter(item => item.date === date).map(item => item._id)} strategy={rectSortingStrategy}>
            <div
                ref={setNodeRef}
                className={styles.kanbanContent}
            >
                <p className={styles.dayName}>Day {index + 1}</p>
                {children}
            </div>
        </SortableContext>
    );
}

export default DropBox;
