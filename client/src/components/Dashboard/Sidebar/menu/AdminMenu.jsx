import { 
  FaUserCog, 
  FaChartLine ,
   FaHeart ,

} from 'react-icons/fa'
import { 
  HiOutlinePlusCircle, 
  HiOutlineCollection 
} from 'react-icons/hi'
import { 
  RiAdminLine 
} from 'react-icons/ri'
import MenuItem from './MenuItem'

const AdminMenu = () => {
  return (
    <div className="space-y-1.5 px-3 py-2">
        <MenuItem
        icon={FaHeart}
        label="My Wishlist"
        address="wishlist"
      />
       
      <MenuItem
        icon={HiOutlinePlusCircle}
        label="Add Scholarship"
        address="add-scholarship"
      />
      
      <MenuItem
        icon={HiOutlineCollection}
        label="Manage Scholarships"
        address="manage-scholarships"
      />
      
      <MenuItem
        icon={FaChartLine}
        label="Analytics"
        address="analytics"
      />
      
      <MenuItem
        icon={RiAdminLine}
        label="Manage Users"
        address="manage-users"
      />
    </div>
  )
}

export default AdminMenu