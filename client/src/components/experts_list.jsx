
import React ,{useState, useEffect} from 'react'

export default function ExpertsList({experts, fetchExperts}) {


  const handleDelete = async (id) => {

    try {
      const response = await fetch(`http://localhost:4000/experts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchExperts?.();
      }
      
    } catch (error) {
      console.error('Помилка при видаленні експерта');
    }
  }

  
  return (
    <div className='bg-blue-200 flex flex-col gap-1 border-[17px] border-blue-200 w-full '>
      <p className='text-[20px] font-semibold  mb-[20px]'>Список експертів</p>

      {
        experts.map((exp, num) => (
          <div key={exp.id} className=' flex justify-between items-center mb-[15px] '>
            <div className='w-fit rounded-md p-2 text-lg bg-purple-100'>
              {num + 1}
            </div>

            <div className='w-[23%] rounded-md pt-2 pb-2 pl-4 text-lg bg-purple-100'>
              {exp.name}
            </div>

            <div className='w-[23%] rounded-md pt-2 pb-2 pl-4 text-lg bg-purple-100'> 
              {exp.experience} років
            </div>

            <div className='w-[23%] rounded-md pt-2 pb-2 pl-4 text-lg bg-purple-100'>
              {exp.position}
            </div>

            <div className='w-[9%] rounded-md pt-2 pb-2 pl-4 text-lg bg-purple-100'>
              {exp.competence}
            </div>

            <button onClick={() => handleDelete(exp.id)} className='p-[5px] bg-pink-400 text-lg rounded-md border-[2px] border-rose-500'  >
              Видалити експерта
            </button>

          </div>
        ))
      }

    </div>
  )
}
