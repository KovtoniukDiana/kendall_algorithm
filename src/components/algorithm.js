import MeanArr from "./mean_arr";
import SumArr from "./sum_arr";

export default function KendallAlgorithm({M, weightExperts = null, weightSigns = null}) {


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
    const T = MeanArr(Q);

    //S сума кваадатів відхилень
    let S = 0;
    let devArr = [];
    
    for(let j=0; j<m; j++) {
        let dev = Q[j] - T;
        devArr.push(dev);
        S += (dev * dev) * wS[j]
    }

    const base = (1/12) * h * h * (m*m*m-m)
    let Tt = 0;
    for(let i=0; i<h; i++) {
        Tt += tieTermForRow(R[i])
    }

    //F коефіцєінт впевненості 
    const F = S/(base - h*Tt);

    const W = Q.map((q) => (q / SumArr(Q)).toFixed(3)); // Нормовані вагові коеф



    return <div className='w-full flex flex-col gap-3 items-center pb-[50px]'>

            <div className='flex flex-col gap-2 text-[15px] font-medium bg-blue-100 w-fit rounded-md p-5 self-start'>
                <p className='text-[20px] font-semibold'>Результати:</p>
                <div className='text-[20px] font-semibold'>F: {F.toFixed(5)}</div>
                <div>T: {T}</div>
                <div>S: {S}</div>
                <div>Tt: {Tt}</div>
            </div>


            <div className='bg-blue-200 flex gap-1 border-[17px] border-blue-200 w-fit' >

                <div className="flex flex-col gap-1">
                    <div className='flex flex-row gap-1 mb-[10px]'> 
                        <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>m/h</div>
                        
                        {R.map((_, index) => (
                            <div key={index+1} className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400'>
                                h{index + 1} 
                            </div>
                        ))}
                    </div>
                
                    {R[0].map((_, colIndex) => (
                        <div className='flex flex-row gap-1 w-fit' key={colIndex}>
                            <div className='text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mr-[10px]'>
                                m{colIndex + 1}
                            </div>

                            {R.map((row, rowIndex) => (
                                <div
                                    className='flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md'
                                    key={rowIndex}>
                                    {row[colIndex]}
                                </div>
                            ))}
                        </div>
                    ))}

                </div>

                <div className="flex flex-col gap-1">
                    <div className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mb-[10px]'>
                        Qj
                    </div>

                    {Q.map((value) => (
                        <div className='flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md h-[33px]' key={value} >
                            {value}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <div className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mb-[10px]'>
                        Qj-T
                    </div>

                    {devArr.map((value) => (
                        <div className='flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md h-[33px]' key={value} >
                            {value}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <div className=' text-center p-1 w-20 bg-pink-100 rounded-md border border-pink-400 mb-[10px]'>
                        Wj
                    </div>

                    {W.map((value) => (
                        <div className='flex items-center justify-center w-20 border border-pink-400 text-center bg-pink-200 rounded-md h-[33px]' key={value} >
                            {value}
                        </div>
                    ))}
                </div>

            </div>

            <div>{JSON.stringify({R}, null, 2)}</div>
        </div>;
}

