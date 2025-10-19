import React, {useState} from 'react'

export default function AddExpert() {

    const [name, setName] = useState('');
    const [experience, setExperience] = useState('');
    const [position, setPosition] = useState('');
    const [competence, setCompetence] = useState('');

    const clearForm = (event) => {
        event.preventDefault();
        setName('');
        setExperience('');
        setPosition('');
        setCompetence('');
    }

    const handleAddExpert = async () => {
        try {
            
            const response = await fetch('http://localhost:4000/experts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name,
                    experience: parseFloat(experience),
                    position,
                    competence: parseFloat(competence)
                })
            })
            return response.json();

        } catch (error) {
            console.error('Не вдалося додати експерта');
        }
    }


  return (
    <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 w-full'>
        <p className='text-[20px] font-semibold mb-[20px]'>Додати експерта</p>

        <form onSubmit={clearForm} className=" flex justify-between items-center ">

            <input className='w-[24%] rounded-md pt-2 pb-2 pl-4 text-lg'
             type='text' placeholder="Ім'я експерта" value={name} onChange={(e) => setName(e.target.value)} />

            <input className='w-[24%] rounded-md pt-2 pb-2 pl-4 text-lg'
            type='text' placeholder="Досвід експерта (в роках)" value={experience} onChange={(e) => setExperience(e.target.value)} />

            <input className='w-[24%] rounded-md pt-2 pb-2 pl-4 text-lg'
            type='text' placeholder="Посада експерта" value={position} onChange={(e) => setPosition(e.target.value)} />

            <input className='w-[11%] rounded-md pt-2 pb-2 pl-4 text-lg'
            type='text' placeholder="Компет-ть" value={competence} onChange={(e) => setCompetence(e.target.value)} />

            <button onClick={handleAddExpert} className='p-[5px] bg-purple-400 text-lg rounded-md border-[2px] border-purple-500'  >
                Додати експерта
            </button>

        </form>
    </div>
  )
}
