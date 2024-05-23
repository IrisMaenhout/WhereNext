import React, { useState, useEffect } from 'react';
import styles from './contentContainer.module.css';

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
};

// Find the closest snap point based on the drag direction
const getNextSnapPoint = (value, snapPoints, direction) => {
    if (direction === 'right') {
        for (let i = 0; i < snapPoints.length; i++) {
            if (snapPoints[i] > value) {
                return snapPoints[i];
            }
        }
        return snapPoints[snapPoints.length - 1]; // Return the last point if no higher point found
    } else {
        for (let i = snapPoints.length - 1; i >= 0; i--) {
            if (snapPoints[i] < value) {
                return snapPoints[i];
            }
        }
        return snapPoints[0]; // Return the first point if no lower point found
    }
};

function Content({ children }) {
    const [isDragging, setIsDragging] = useState(false);
    const [initialX, setInitialX] = useState(null);
    const [contentWidth, setContentWidth] = useState(40); // Initial width in vw
    const [snapPoints, setSnapPoints] = useState([]);

    useEffect(() => {
        // Update snap points based on viewport width
        const maxViewportWidth = document.documentElement.clientWidth;
        setSnapPoints([0, 40, 80]); // Snap points in vw (0%, 50%, 80% of viewport width)
    }, []);

    const startDragging = (e) => {
        setIsDragging(true);
        setInitialX(e.clientX);
        e.preventDefault(); // This prevents text selection during drag
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        const containerLeft = document.querySelector(`.${styles.contentContainer}`).getBoundingClientRect().left;
        const newWidth = (e.clientX - containerLeft) / document.documentElement.clientWidth * 100;
        setContentWidth(newWidth);
    };

    // Wrap your onDrag with the throttle function
    const throttledOnDrag = throttle(onDrag, 50); // Reduce the delay to 50 ms

    const stopDragging = (e) => {
        if (isDragging) {
            setIsDragging(false);
            const direction = e.clientX > initialX ? 'right' : 'left';
            const snappedWidth = getNextSnapPoint(contentWidth, snapPoints, direction);
            setContentWidth(snappedWidth);
        }
    };

    return (
        <div className={styles.mainContent} onMouseMove={throttledOnDrag} onMouseUp={stopDragging} onMouseLeave={stopDragging} style={{ width: `${contentWidth}vw` }}>
            <div className={styles.contentContainer}>
                <div className={styles.dragBarContainer}>
                    <div className={styles.dragBar} onMouseDown={startDragging}></div>
                </div>


                {
                    contentWidth !== 0 &&
                    <div className={styles.content}>
                        {children}
                    </div>

                }
                
            </div>
        </div>
    );
}

export default Content;
