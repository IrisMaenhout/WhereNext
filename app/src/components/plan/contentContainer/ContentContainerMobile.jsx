import { Sheet, SheetRef } from 'react-modal-sheet';
import { useState, useRef, Children } from 'react';
import styles from "./contentContainerMobile.module.css";
import zIndex from '@mui/material/styles/zIndex';

export default function Content({children}) {
  const [isOpen, setOpen] = useState(true);
  const ref = useRef();
  const snapTo = (i) => ref.current?.snapTo(i);
  

  return (
    <div className={styles.mobileContent}>

        {
            !isOpen &&
            <div className={styles.fakeContentContainer} onMouseDown={() => setOpen(true)} onTouchMove={() => setOpen(true)} onTouchMoveCapture={() => setOpen(true)}>
                <div className={styles.dragBarContainer}>
                        <div className={styles.dragBar}></div>
                </div>
            </div>
        }
      

      {/* Opens to 400 since initial index is 1 */}
      <Sheet
        ref={ref}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[600, 400, 0]}
        initialSnap={1}
        onSnap={(snapIndex) =>
          console.log('> Current snap point index:', snapIndex)
        }
        style={{zIndex: 20}}
      >
        <Sheet.Container style={{boxShadow: "4px 4px 15px 0px rgba(161, 165, 166, 0.5)", borderRadius: '1rem'}}>
            <Sheet.Header />
          <Sheet.Content>
            
            <Sheet.Scroller draggableAt="both">
            <div className={styles.mainContent}>
            {children}
            </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
}