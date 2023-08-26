import React, {useState, useEffect, useRef} from 'react';
import './Plot.scss'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { motion } from 'framer-motion'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, annotationPlugin, Title, Tooltip, Legend);


const RenderLegend = ({data}) => {
    return (
        <ul className='legend-container'>
            {data.datasets.map((dataset, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', color:"#eee",marginRight: '20px' }}>
                    <span 
                        style={{
                            display: 'inline-block',
                            backgroundColor: dataset.borderColor,
                            width: '20px',
                            height: '20px',
                            borderRadius:'4px',
                            marginRight: '10px'
                        }}
                    ></span>
                    {dataset.label}
                </li>
            ))}
        </ul>
    )
}
export default function Plot({echoData, stockData, inputData}) {
    const minValue = Math.min( Math.min(...echoData), Math.min(...stockData))
    const maxValue = Math.max(Math.max(...stockData), Math.max(...echoData))

    const options = {
        responsive: true,    
        scales: {
            x: {
                type:'linear',
                offset:true,
                grid: { 
                    display:false,
                },
                beginAtZero: true,
                ticks: {
                    align:'center',
                    autoSkip: true,
                    stepSize: Math.ceil(stockData.length / 8),
                }
            },
            y: {
                offset:true,
                grid: { 
                    color:'#262626',
                },
                type:'linear',
                suggestedMin: minValue,
                suggestedMax: maxValue,
            },
        },
        layout: {
            padding: {
                left:36,
                right:36,
            }
        },
        plugins: {
            annotation: {
                annotations: [
                    {
                      id:'mid',
                      type: 'line',
                      mode:'vertical',
                      scaleID:'x',
                      value:99,
                      borderColor: '#4e4e4e',
                      borderWidth: 1,
                      borderDash: [5, 5],
                      borderDashOffset:5,
                      yMin: minValue, // starting y-value for the line
                      yMax: maxValue,  // ending y-value for the line
                      label: {
                        backgroundColor: "red",
                        content: "Test Label",
                        enabled: true
                      }
    
                    }
                ]
            },
          legend: {
            position: 'top',
            display:false
          },
          title: {
            display: true,
            padding: {
                top:10,
                bottom:12,
            },
            text: `Model Comparison - ${inputData.symbol.toUpperCase()} / ${inputData.startDate} / ${inputData.endDate}`,
          },
         
        },
      };
  

    const data = {
        labels: [''].concat(Array.from({ length: stockData.length }, (_, i) => i)),
        updateMode:"resize",
        datasets: [
        {
            label: `Free Running ESN`,
            cubicInterpolationMode: 'default',
            tension: 0.5,
            data: Array.from({ length: 100 }, () => null).concat(echoData),
            borderColor: '#45abd4',
            backgroundColor: '#45abd4',
            pointStyle:false,
            borderCapStyle:"round"
        },
        {
          label: `Target System`,
          data: stockData,
          cubicInterpolationMode: 'default',
          tension: 0.5,
          borderColor: '#345e85',
          pointStyle:false,
          backgroundColor: '#345e85',
          borderCapStyle:"round"
        },
        ],
    };
  return (
    <motion.div
        className={`plot-container`}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit= {{ opacity:0 }}
        transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
    }}>
        {<RenderLegend data={data}/>}
        <Line data={data} options={options} />
    </motion.div>
  )
}
