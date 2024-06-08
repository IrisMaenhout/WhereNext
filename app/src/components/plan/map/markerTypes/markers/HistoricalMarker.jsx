import React from 'react';

function HistoricalMarker({color, strokeColor}) {
    return (
        <svg width="59" height="59" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_710_850)">
        <path d="M12,0A10.011,10.011,0,0,0,2,10c0,5.282,8.4,12.533,9.354,13.343l.646.546.646-.546C13.6,22.533,22,15.282,22,10A10.011,10.011,0,0,0,12,0Zm0,15a5,5,0,1,1,5-5A5.006,5.006,0,0,1,12,15Z" fill={color} stroke={strokeColor} strokeWidth="1"/>
        <circle cx="12" cy="10" r="6" fill={color}/>
        <rect x="6" y="5" width="12" height="10" fill="url(#pattern0_710_850)"/>
      </g>
      <defs>
        <pattern id="pattern0_710_850" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use href="#image0_710_850" transform="scale(0.0078125)"/>
        </pattern>
        <clipPath id="clip0_710_850">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
        <image id="image0_710_850" width="128" height="128" href="data:image/png;base64,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"/>
        </defs>
        </svg>
    );
}

export default HistoricalMarker;
