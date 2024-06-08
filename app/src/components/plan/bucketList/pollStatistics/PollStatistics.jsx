import React from 'react';
import styles from './pollStatistics.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, defaults } from "chart.js/auto";

function PollStatistics({numberOfTripMembers, locationApiData}) {

    const interestData = locationApiData.interest;

    function calculateGroupInterest() {
        if (interestData.length === 0) return 0;
    
        const totalScore = interestData.reduce((sum, entry) => sum + entry.rating, 0);
        const averageRating = totalScore / interestData.length;
        const percentage = ((averageRating - 1) / 4) * 100;
    
        return percentage.toFixed(0); // To keep the percentage to two decimal places
    }

    const ratingCounts = [0, 0, 0, 0, 0];
    interestData.forEach(entry => {
        ratingCounts[entry.rating - 1]++;
    });

    const data = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
            label: 'People',
            data: ratingCounts,
            backgroundColor: ['#F25353', '#FF9737', '#FFCE56', '#D3ED6F', '#8FD763'],
            borderRadius: 5,
        }]
    };

    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Interest rating (stars)',
                    padding: { top: 10 },
                    font: {
                        size: 14,
                        family: 'Nunito',
                        // weight: 'bold',
                        // lineHeight: 1.2
                    },
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of members',
                    padding: { bottom: 20},
                    font: {
                        size: 14,
                        family: 'Nunito'
                    },
                },
                beginAtZero: true,
                max: numberOfTripMembers
            }
        },
        plugins: {
            legend: false,
            tooltip: {
                callbacks: {
                    title: function(context) {
                        return `${context[0].label} star${context[0].label > 1 ? 's' : ''} `;
                    },
                    label: function(context) {
                        return `  ${context.raw} member${context.raw > 1 ? 's' : ''} `;
                    }
                }
            }
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        }
    };
    return (
        <>
            <div className={styles.averageGroupInterestPercentage}>
                <p>Average group interest:</p>

                <div>
                    <b className={styles.percentage}>{ calculateGroupInterest() }%</b>
                    <p>({(calculateGroupInterest() / 20).toFixed(1)} stars)</p>
                </div>
            </div>
        
            <div className={styles.groupInterestGraph}>
                {/* <Bar
                        
                /> */}
                <div className={styles.graph}>
                    <Bar data={data} options={options} />
                </div>
                        
            </div>
        </>
    );
}

export default PollStatistics;