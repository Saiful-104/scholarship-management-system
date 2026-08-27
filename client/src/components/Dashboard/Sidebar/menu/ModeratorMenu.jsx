import { MdOutlineManageAccounts, MdOutlineRateReview } from 'react-icons/md'
import MenuItem from './MenuItem'
import { 
  FaHeart 
} from 'react-icons/fa'

const ModeratorMenu = () => {
  return (
    <div className="space-y-1.5 px-3 py-2">
        <MenuItem
        icon={FaHeart}
        label="My Wishlist"
        address="wishlist"
      />
      <MenuItem
        icon={MdOutlineManageAccounts}
        label="Manage Applications"
        address="moderator-applications"
      />

      <MenuItem
        icon={MdOutlineRateReview}
        label="All Reviews"
        address="all-reviews"
      />
    </div>
  )
}

export default ModeratorMenu