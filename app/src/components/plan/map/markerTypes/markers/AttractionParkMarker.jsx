import React from 'react';

function AttractionParkMarker({color, strokeColor}) {
    return (
        <svg width="59" height="59" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_710_850)">
        <path d="M12,0A10.011,10.011,0,0,0,2,10c0,5.282,8.4,12.533,9.354,13.343l.646.546.646-.546C13.6,22.533,22,15.282,22,10A10.011,10.011,0,0,0,12,0Zm0,15a5,5,0,1,1,5-5A5.006,5.006,0,0,1,12,15Z" fill={color} stroke={strokeColor} stroke-width="1"/>
        <circle cx="12" cy="10" r="6" fill={color}/>
        <rect x="6" y="3" width="12" height="12" fill="url(#pattern0_710_888)"/>
        </g>
        <defs>
        <pattern id="pattern0_710_888" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use href="#image0_710_888" transform="scale(0.0078125)"/>
        </pattern>
        <clipPath id="clip0_710_888">
        <rect width="59" height="59" fill="white"/>
        </clipPath>
        <image id="image0_710_888" width="128" height="128" href="data:image/png;base64,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"/>
        </defs>
        </svg>
    );
}

export default AttractionParkMarker;
