import React, {useEffect, useMemo} from 'react'

export default function UpdateCompetence({experts, range}) {
    

    const updatedExperts = useMemo(() => {
        return experts.map(exp => {
            const match = range.find(r => r.id === exp.id);
            const value = match?.value;

            let competence = exp.competence;

            if (value === undefined) return { ...exp, active: false }; 

            if (value >= 4) competence = Math.max(0.1, (competence - 0.1).toFixed(2));

                else if (value <= 2) competence = Math.min(1.0, (competence + 0.05).toFixed(2));

            return { ...exp, competence, active: true };
        });
    }, [experts, range]);

    const activeExperts = updatedExperts.filter(exp => exp.active);


  return (
    <div className='w-fit flex gap-1 flex-col ml-1'>
        <div className='mb-[10px] text-center p-1 w-fit bg-pink-300 rounded-md border border-pink-400'>Коеф.ваги</div>

        {activeExperts.map((exp, i) => (
            <div className='h-[33px] flex items-center justify-center w-full border border-pink-400 text-center bg-pink-300 rounded-md'
                key={exp.id}>
                    {exp.competence}
            </div>
        ))}
    </div>
  )
}
