import React from 'react'

export const Withdraw = () => {
  return (
   <div className=' flex flex-col justify-around'>
    <form>
        <input type="number" name="amount" placeholder='CampaignId' className='border border-black rounded-full' />
        <button type="submit" className='border rounded-full bg-blue-400'>search</button>
    </form>
   </div>
  )
}
