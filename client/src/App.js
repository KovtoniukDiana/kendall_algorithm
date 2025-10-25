import React, {useState,useEffect, useMemo} from 'react'
import "./index.css";
import KendallAlgorithm from './components/algorithm';
import MeanArr from './components/mean_arr';
import UpdateCompetence from './components/update_competence';
import ExpertsList from './components/experts_list';
import AddExpert from './components/add_expert';


export default function App() {

    const [experts, setExperts] = useState([]);
    
    const fetchExperts = async () => {
       await fetch('http://localhost:4000/experts')
        .then(res => res.json())
        .then(data => setExperts(data))
    }
    useEffect(() => {
        fetchExperts();
    }, [])


    const [matrix, setMatrix] = useState(() => {
        const saved = localStorage.getItem('matrix');
        return saved ? JSON.parse(saved) : [[0, 0, 0, 0], [0, 0, 0, 0]];
    });

    const [damage, setDamage] = useState(() => {
        const saved = localStorage.getItem('damage');
        return saved ? JSON.parse(saved) : 4;
    });
    
    
    useEffect(() => {
        if (experts.length === 0) return;

        const cols = damage;
        const rows = experts.length;

        setMatrix(prev => {
    
        if (prev.length === 0) {
            return Array.from({ length: rows }, () => new Array(cols).fill(0));
        }

        const newMatrix = Array.from({ length: rows }, (_, i) => {
            if (prev[i]) {
            return [...prev[i], ...Array(cols - prev[i].length).fill(0)].slice(0, cols);
            } else {
            return new Array(cols).fill(0);
            }
        });
        return newMatrix;
        });
  }, [experts]);


    useEffect(() => {
        localStorage.setItem('matrix', JSON.stringify(matrix));
        localStorage.setItem('damage', JSON.stringify(damage));
    }, [matrix]);

    
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

    const addDamage = () => {
        setMatrix(prev => 
            prev.map(row => [...row, 0])
        )

        setDamage(prev => prev + 1);
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
    let deltaAvg = deltasAvg(delta);

    const activeExpertsData = useMemo(
        () => experts.filter((_, i) => !isChecked.includes(i)),
        [experts, isChecked]
    );

    const competFind = (delta, expertsToMap) => {
        const sorted =  [...new Set(delta)].sort((a,b) => (a-b))

        return delta.map((value, index) => {
            
            const exp = expertsToMap[index]; 

            return{
                id: exp?.id,
                value: sorted.indexOf(value) + 1
            }
        })
    }
    let range = [];
    if (activeExpertsData.length && deltaAvg.length) { // Використовуйте відфільтрованих експертів
        range = competFind(deltaAvg, activeExpertsData);
    }

    const handleToggle = (index) => {
        setIsChecked((prev) => 
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        )
    }

  return (
    <div className='flex flex-col items-center mt-[50px] mb-[50px] w-5/6 gap-4'>
        <p className='self-start font-semibold'>Алогоритм узгодження експертів</p>

        <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 ' >

            <div className='flex'>
                <div>
                    <div className='flex flex-row gap-1 mb-[10px]'> 
                        <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>h/m</div>
                        
                        {matrix[0].map((el, index) => (
                            <div key={`header-${index}`} className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
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
                            <div key={index + 1} className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
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

                    {deltaAvg.map((davg, i) => (
                        <div className='h-[33px] flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-300 rounded-md'
                            key={`deltaavg-${i}`}>
                                {davg}
                        </div>
                    ))}
                </div>

                <div className='w-fit flex gap-1 flex-col ml-1'>
                    <div className='mb-[10px] text-center p-1 w-9 bg-pink-300 rounded-md border border-pink-400'>№</div>

                    {range.map((comp) => (
                        <div className='h-[33px] flex items-center justify-center w-9 border border-pink-400 text-center bg-pink-300 rounded-md'
                            key={`comp-${comp.id}`}>
                                {comp.value}
                        </div>
                    ))}
                </div>

                <UpdateCompetence experts={experts} range={range} />
            </div>
            </div>

        <p className='self-start font-extralight'>Кожен рядок - один експерт, кожен стовбчик - одне пошкодження</p>

        <KendallAlgorithm M={activeMatrix} />
        <AddExpert fetchExperts={fetchExperts} />
        <ExpertsList experts={experts} fetchExperts={fetchExperts} />

    </div>
  )
}