import { del, div } from 'framer-motion/m';
import React from 'react'



export default function KendallAlgorithm({M, weightExperts = null, weightSigns = null}) {

    const sumArr = (arr) => {
        let sum =0;
        for(let i=0; i<arr.length; i++) {
            sum += arr[i];
        }  
        return sum;  
    }

    const meanArr = (arr) => {
        if(arr.length > 0 ) {
            return sumArr(arr) / arr.length;
        }else return console.error("Array length is zero");
    }

    const rankRow = (values) => {
        const items = new Array(values.length);

        for (let i=0; i<values.length; i++) items[i] = { i, v: values[i]} //i - index, v - value

        items.sort((a,b) => a.v - b.v); //сортуємо за зростанням

        const ranks = new Array(values.length); //масив рангів

        let pos =1;//позиція у ранжуванні

        for (let index = 0; index < items.length;) {
            let j = index; // Початок групи з однаковими значеннями
            let k = j; // Кінець групи

            while (k+1< items.length && Math.abs(items[k].v - items[k+1].v) < 1e-12) {
                k++;
            }

            const groupSize = k - j + 1;
            const avgRank = Math.round((pos + (pos + groupSize -1)) / 2); //середній ранг для групи

            for(let t = j; t<=k; t++) {
                ranks[items[t].i] = avgRank;
            }

            pos += groupSize;
            index = k + 1;
        }
        return ranks
    }

    const rankAvgCell = (value, row) => {
        let less = 0;
        let equal = 0;
        for(let i = 0; i<row.length; i++) {
            if(!Number.isFinite(row[i])) continue;
            if(row[i] < value) {
                less++;
            }else if(row[i] === value) equal++;
        }

        return 1 + less + (equal - 1) / 2;
    }

    const rankRowAvg = (row) => {
        let out = Array(row.length);
        for(let j = 0; j<row.length; j++) {
            let v = row[j];
            out[j] = Number.isFinite(v) ? rankAvgCell(v, row) : null;
        }

        return out;
    }

    const rankMatrix = (M) => {
        const h = M.length;
        const R = new Array(h);

        for(let i=0; i<h; i++) {
            R[i] = rankRowAvg(M[i]);
        }
        return R;
    }

    const tieTermForRow = (rankRow) => {
        const eps = 1e-9;
        const vals = rankRow.filter(v => v != null).slice().sort((a, b) => a - b);
        let sumZ = 0;
        for (let i =0; i<vals.length;) {
            let j =i, k= j;
            while(k+1 < vals.length && Math.abs(vals[k] - vals[k+1]) < eps) k++; 
            const z = k - j + 1;
            if(z>1) {
                sumZ += (z*z*z - z);
            }
            i = k + 1;
        }
        return (1/12) * sumZ;
    }

    const h =M.length; //к-ть експертів
    const m = M[0] ? M[0].length : 0; //к-ть оцінок(пошкоджень)   

    if( h<2 || m<2 ) return {F:1, Q: [], T: 0, S: 0, R: [], W: []};

    const R = rankMatrix(M); //матриця рангів h*m


    const wE = weightExperts ? weightExperts.slice() : new Array(h).fill(1);
    const wS = weightSigns ? weightSigns.slice() : new Array(m).fill(1);

    //QJ сума рангів  об'єкта j, які йому надал всі експерти, треба помножини ранг на коефіцієнт вливу експерта
    let Q = new Array(m).fill(0);

    for(let j=0; j<m; j++) {
        
        let qj = 0;
        for( let i=0; i<h; i++) {
            qj += wE[i] * R[i][j];
        }

        Q[j] = qj;
    }

    //T - середнє значення Qj
    const T = meanArr(Q);

    //S сума кваадатів відхилень
    let S = 0;
    
    for(let j=0; j<m; j++) {
        let dev = Q[j] - T;
        S += (dev * dev) * wS[j]
    }

    const base = (1/12) * h * h * (m*m*m-m)
    let Tt = 0;
    for(let i=0; i<h; i++) {
        Tt += tieTermForRow(R[i])
    }

    //F коефіцєінт впевненості 
    const F = S/(base - h*Tt);

    const W = Q.map((q) => (q / sumArr(Q)).toFixed(3)); // Нормовані вагові коеф


    return <div className='w-full flex flex-col gap-3'>

            <div className='flex flex-col gap-2 text-[15px] font-medium bg-blue-100 w-fit rounded-md p-5'>
                <p className='text-[20px] font-semibold'>Результати:</p>
                <div className='text-[20px] font-semibold'>F: {F.toFixed(5)}</div>
                <div>T: {T}</div>
                <div>S: {S}</div>
                <div>Tt: {Tt}</div>
            </div>


            <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 ' >

                <div className='flex flex-row gap-1 mb-[10px]'> 
                    <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>m/h</div>
                    
                    {R[0].map((el, index) => (
                        <div key={el} className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
                            h{index + 1} 
                        </div>
                    ))}
                </div>
            
                {R.map((row, rowIndex)=>(
    
                <div className='flex flex-row gap-1'  key={rowIndex}>
                    <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>
                        m{rowIndex + 1}
                    </div>
    
                    {
                        row.map((value, colIndex)=>(
    
                            <div className='flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md' key={colIndex} >
                                {value}
                            </div>
                        ))
                    }
                </div>
            ))}</div>

            <div>{JSON.stringify({Q}, null, 2)}</div>
            <div>{JSON.stringify({R}, null, 2)}</div>
            <div>{JSON.stringify({W}, null, 2)}</div>
        </div>;
}

