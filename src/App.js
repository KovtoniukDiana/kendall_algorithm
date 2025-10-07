import React, {useState, useMemo} from 'react'
import "./index.css";
import KendallAlgorithm from './components/algorithm';
import MeanArr from './components/mean_arr';


export default function App() {

    const [matrix, setMatrix] = useState([
        [0.41, 0.31, 0.1, 0.16],
        [0.67, 0.33, 0.05, 0.17],
        [0.15, 0.21, 0.13, 0.21],
        [0.44, 0.23, 0.13, 0.66],
        [0.33 ,0.4, 0.05, 0.21]
    ]);
    const [isChecked, setIsChecked] = useState([]);

    const activeMatrix = useMemo(
        () => matrix.filter((_, i) => !isChecked.includes(i)),
        [matrix, isChecked]
    );

    const handleChange = (rowIndex, colIndex, newValue) => {
        setMatrix(prev => {
            const updatedMatrix = prev.map((row, r) =>
                row.map((oldValue, c) => {
                    if (r === rowIndex && c === colIndex) {
                        const num = parseFloat(newValue);

                        if (isNaN(num)) return 0;
                        if (num < 0 || num > 1) {
                            alert("Значення має бути в діапазоні [0,1]");
                            return oldValue;
                        }
                        return num;
                    }
                    return oldValue;
                })
            );
            return updatedMatrix;
        });
    };

    const addExpert = () => {
        setMatrix(prev =>  [...prev, new Array(prev[0].length).fill(0)] )
    }

    const addDamage = () => {
        setMatrix(prev => 
            prev.map(row => [...row, 0])
        )
    }

    const colAvg = (M) => {
        return M[0].map((_, col) => {
            const colVal = M.map(row => row[col]);
            const sum = colVal.reduce((acc, val) => acc + val, 0);
            return sum / colVal.length;
        })
    }

    const deltas = (M) => {
        let colAverage = colAvg(M);

        return M[0].map((_, col) => {
            const colVal = M.map(row => row[col]);
            return colVal.map(v => Math.abs((v - colAverage[col]).toFixed(3)));
        })
    }

    let delta = deltas(activeMatrix);

    const deltasAvg = (delta) => {
    return delta[0].map((_, colIndex) => {
        const column = delta.map(row => row[colIndex]);
        return MeanArr(column);
    })};
    let deltaAvg = deltasAvg(delta)

    const competFind = (delta) => {
        const sorted =  [...new Set(delta)].sort((a,b) => (a-b))

        return delta.map(value => sorted.indexOf(value) + 1);
    }
    let components = competFind(deltaAvg);

    const handleToggle = (index) => {
        setIsChecked((prev) => 
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        )
    }

  return (
    <div className='flex flex-col items-center mt-[50px] w-5/6 gap-4'>
        <p className='self-start font-semibold'>Алогоритм узгодження експертів</p>

        <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 ' >

            <div className='flex'>
                <div>
                    <div className='flex flex-row gap-1 mb-[10px]'> 
                        <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>h/m</div>
                        
                        {matrix[0].map((el, index) => (
                            <div key={el} className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
                                m{index + 1} 
                            </div>
                        ))}

                        <div onClick={addDamage} className='w-[30px] h-[30px] flex justify-center align-middle rounded-full bg-indigo-400 ml-[10px]'>+</div>
                    </div>
            
                    <div className='flex gap-1 flex-col'>
                        {matrix.map((row, rowIndex)=> {
                            const disabled = isChecked.includes(rowIndex)

                            return (<div className='flex flex-row gap-1'  key={rowIndex}>
                                <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>
                                    h{rowIndex + 1}
                                </div>

                                {
                                    row.map((value, colIndex)=>(

                                        <input className= {`w-20 border border-pink-400 text-center rounded-m  ${disabled ? 'bg-gray-300 text-gray-50' : 'bg-pink-200' }` }
                                        key={colIndex} type='number' placeholder='m' value={value} onChange={e => handleChange(rowIndex, colIndex, e.target.value)} />
                                    ))
                                }

                                <input type='checkbox' checked={disabled} onChange={() => handleToggle(rowIndex)}/>
                            </div>)
                        })}
                    </div>
                </div>

                <div className='flex gap-1 flex-col ml-[20px]'>
                    <div className='flex flex-row gap-1 mb-[10px]'> 
                        
                        {matrix[0].map((del, index) => (
                            <div key={del} className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
                                delta{index + 1} 
                            </div>
                        ))}
                    </div>

                    {delta[0].map((_, colIndex) => (
                        <div key={colIndex} className='flex gap-1' >
                            {delta.map((row, rowIndex) => (
                            <div className='h-[33px] flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md'
                                key={rowIndex}>
                                    {row[colIndex]}
                            </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className='w-fit flex gap-1 flex-col ml-1'>
                    <div className='mb-[10px] text-center p-1 w-20 bg-pink-300 rounded-md border border-pink-400'>deltaAVG</div>

                    {deltaAvg.map((davg) => (
                        <div className='h-[33px] flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-300 rounded-md'
                            key={davg}>
                                {davg}
                        </div>
                    ))}
                </div>

                <div className='w-fit flex gap-1 flex-col ml-1'>
                    <div className='mb-[10px] text-center p-1 w-9 bg-pink-300 rounded-md border border-pink-400'>№</div>

                    {components.map((comp) => (
                        <div className='h-[33px] flex items-center justify-center w-9 border border-pink-400 text-center bg-pink-300 rounded-md'
                            key={comp}>
                                {comp}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='flex'>
                <div onClick={addExpert} className='w-[30px] h-[30px] flex justify-center align-middle rounded-full bg-indigo-400 mt-[10px] '>+</div>
                {matrix.map(el => (
                    <input key={el} type='checkbox' />
                ))}
            </div>

            
            </div>

        <p className='self-start font-extralight'>Кожен рядок - один експерт, кожен стовбчик - одне пошкодження</p>

        <KendallAlgorithm M={activeMatrix} />

    </div>
  )
}
