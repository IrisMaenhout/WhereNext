import React from 'react';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
import SecondaryBtn from '../btns/secondary/btn/SecondaryBtn';

function Header(isPlaningPages) {

    const handleClick = () => {
        console.log('Button was clicked!');
    };
    return (
        <header>
            <div className={`${styles.container} ${styles.wraper}`}>
                <div className={styles.left}>
                    {isPlaningPages &&

                        <button className={styles.hamburgerMenuMobile}>
                            <i className="fi fi-rr-menu-burger"></i>
                        </button>
                    }
                    

                    {/* Desktop logo */}
                    <Link to={"/"} className={styles.desktopLogo}>
                        <img src="/logo/long-logo.svg" alt="logo" />
                    </Link>


                    {/* Mobile logo */}
                    <Link to={"/"} className={styles.mobileLogo}>
                        <img src="/logo/mobile-logo.svg" alt="logo" />
                    </Link>


                </div>

                <nav className={styles.right}>

                    {/* Desktop nav links */}
                    <SecondaryBtn style={styles.navElementDesktop}onClick={handleClick}>Invite a friend</SecondaryBtn>

                    <Link to={"../trip-settings"} className={styles.navElementDesktop}>Trip settings</Link>


                     {/* Mobile nav links */}
                    <button className={styles.navElementMobile}>
                        <i className="fi fi-rr-user-add"></i>
                    </button>

                    <Link className={styles.navElementMobile}>
                        <i className="fi fi-rr-settings"></i>
                    </Link>


                    {/* Avatar for both mobile and desktop */}
                    <Link to={"../account"}>
                        <img className={styles.avatar} src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww" alt="avatar" />
                    </Link>
                </nav>
            
            </div>
        </header>
    );
}

export default Header;