import React from 'react';

function LocationMarker({color, strokeColor}) {
    return (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_722_93)">
        <path d="M29.5 0C22.9823 0.00715768 16.7336 2.59948 12.1249 7.2082C7.51614 11.8169 4.92382 18.0656 4.91667 24.5833C4.91667 37.5683 25.5667 55.3936 27.9119 57.3849L29.5 58.7271L31.0881 57.3849C33.4333 55.3936 54.0833 37.5683 54.0833 24.5833C54.0762 18.0656 51.4839 11.8169 46.8751 7.2082C42.2664 2.59948 36.0177 0.00715768 29.5 0ZM29.5 36.875C27.0689 36.875 24.6925 36.1541 22.6711 34.8035C20.6498 33.4529 19.0743 31.5332 18.144 29.2872C17.2137 27.0411 16.9702 24.5697 17.4445 22.1853C17.9188 19.801 19.0895 17.6108 20.8085 15.8918C22.5275 14.1728 24.7177 13.0021 27.102 12.5278C29.4864 12.0536 31.9578 12.297 34.2038 13.2273C36.4498 14.1576 38.3695 15.7331 39.7202 17.7545C41.0708 19.7758 41.7917 22.1523 41.7917 24.5833C41.7878 27.8421 40.4915 30.9663 38.1872 33.2705C35.8829 35.5748 32.7588 36.8711 29.5 36.875Z" fill={color} stroke={strokeColor} stroke-width="1"/>
        <path d="M29.5 31.9583C33.5731 31.9583 36.875 28.6564 36.875 24.5833C36.875 20.5102 33.5731 17.2083 29.5 17.2083C25.4269 17.2083 22.125 20.5102 22.125 24.5833C22.125 28.6564 25.4269 31.9583 29.5 31.9583Z" fill={color}/>
        <circle cx="29" cy="25" r="14" fill={color}/>
        </g>
        <defs>
        <clipPath id="clip0_722_93">
        <rect width="59" height="59" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    );
}

export default LocationMarker;
