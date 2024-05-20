import React from 'react';
import styles from './sidebar.module.css';
import { Link } from 'react-router-dom';

function Sidebar(props) {
    return (
        <aside className={styles.sidebarNav}>
            <nav>
                <div>
                    <Link to={""}>
                        <i className="fi fi-rr-overview"></i>
                        <p>Overview</p>
                    </Link>

                    <Link to={""}>
                        <i className="fi fi-rs-map"></i>
                        <p>Plan</p>
                    </Link>

                    <Link to={""}>
                        <i className="fi fi-rs-copy-alt"></i>
                        <p>Research</p>
                    </Link>

                    <Link to={""}>
                        <i className="fi fi-rs-ticket-airline"></i>
                        <p>Tickets</p>
                    </Link>

                    <Link to={""}>
                        <i className="fi fi-rr-suitcase-alt"></i>
                        <p>Packing list</p>
                    </Link>

                </div>

            </nav>
        </aside>
    );
}

export default Sidebar;