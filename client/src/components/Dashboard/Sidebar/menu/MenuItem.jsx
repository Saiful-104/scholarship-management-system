/* eslint-disable no-unused-vars */
import { NavLink } from 'react-router'

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
     className={({ isActive }) =>
        `group relative flex items-center gap-3.5 px-4 py-3 my-1.5 rounded-xl text-gray-700 
         transition-all duration-250 ease-out
         hover:bg-indigo-50/80 hover:text-indigo-700 hover:shadow-sm
         active:scale-[0.98]
         ${isActive 
           ? 'bg-indigo-100/70 text-indigo-800 font-medium shadow-sm' 
           : 'text-gray-600'
         }`
      }
    >
      <Icon className='w-5 h-5' />

      <span className='mx-4 font-medium'>{label}</span>
    </NavLink>
  )
}

export default MenuItem