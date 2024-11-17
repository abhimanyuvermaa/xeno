import { Link } from 'react-router-dom';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Paper 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SegmentIcon from '@mui/icons-material/Category';
import CampaignIcon from '@mui/icons-material/Campaign';

function Sidebar() {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Segments', icon: <SegmentIcon />, path: '/segments' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns' }
  ];

  return (
    <Paper style={{ width: 240, height: '100%' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default Sidebar;