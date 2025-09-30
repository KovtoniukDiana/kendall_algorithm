import React, {useState, useEffect} from 'react'
import "./index.css";
import KendallAlgorithm from './components/algorithm';
import { input } from 'framer-motion/m';
import { Input } from 'postcss';

export default function App() {

    const [matrix, setMatrix] = useState([
        [0.41, 0.31, 0.1, 0.16],
        [0.67, 0.33, 0.05, 0.17],
        [0.15, 0.21, 0.13, 0.21],
        [0.44, 0.23, 0.13, 0.66],
        [0.33 ,0.4, 0.05, 0.21]
    ]);


    const handleChange = (rowIndex, colIndex, newValue) => {
        
        setMatrix(prev => {
            const updatedMatrix = prev.map((row, r) => (

                row.map((oldValue, c) => {
                    if (r === rowIndex && c === colIndex) {
                    
                        if (newValue < 0 || newValue > 1) {
                            alert("Значення має бути в діапазоні [0,1]");
                            return 0;
                        }
                        return newValue; 
                    }
                    return oldValue;
                })
            ));

            return updatedMatrix;
        })  
        
    }

    
  return (
    <div className='flex flex-col items-center mt-6 w-5/6 gap-4'>
        <p className='self-start font-semibold'>Алогоритм узгодження експертів</p>

        <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 ' >

            <div className='flex flex-row gap-1 mb-[10px]'> 
                <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>h/m</div>
                
                {matrix[0].map((el, index) => (
                    <div key={el} className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
                        m{index + 1} 
                    </div>
                ))}
            </div>
            
            {matrix.map((row, rowIndex)=>(

            <div className='flex flex-row gap-1'  key={rowIndex}>
                <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>
                    h{rowIndex + 1}
                </div>

                {
                    row.map((value, colIndex)=>(

                        <input className='w-20 border border-pink-400 text-center bg-pink-200 rounded-md' 
                        key={colIndex} type='number' placeholder='m' value={value} onChange={e => handleChange(rowIndex, colIndex, e.target.value)} />
                    ))
                }
            </div>
        ))}</div>

        <p className='self-start font-extralight'>Кожен рядок - один експерт, кожен стовбчик - одне пошкодження</p>

        <KendallAlgorithm M={matrix} />
    </div>
  )
}
