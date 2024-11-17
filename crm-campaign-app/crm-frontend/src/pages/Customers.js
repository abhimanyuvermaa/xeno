import { useState } from 'react';
import { 
  Button, 
  Typography,
  Dialog
} from '@mui/material';
import CustomerList from '../components/Customers/CustomerList';
import AddCustomerForm from '../components/Customers/AddCustomerForm';

function Customers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleCustomerAdded = () => {
    setOpenDialog(false);
    setRefreshList(prev => !prev); // Trigger refresh of customer list
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Typography variant="h4">Customers</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add Customer
        </Button>
      </div>

      <CustomerList refresh={refreshList} />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AddCustomerForm 
          onSuccess={handleCustomerAdded}
          onCancel={() => setOpenDialog(false)}
        />
      </Dialog>
    </div>
  );
}

export default Customers;