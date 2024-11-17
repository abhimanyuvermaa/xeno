import { useState, useEffect } from 'react';
import { 
  Button, 
  Typography,
  Dialog,
  Box,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignList from '../components/Campaigns/CampaignList';
import CreateCampaignForm from '../components/Campaigns/CreateCampaignForm';
import { campaignAPI } from '../utils/api';

function Campaigns() {
  const [openDialog, setOpenDialog] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignCreated = () => {
    setOpenDialog(false);
    fetchCampaigns();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Marketing Campaigns</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Campaign
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <CampaignList 
        campaigns={campaigns}
        loading={loading}
        onRefresh={fetchCampaigns}
      />

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateCampaignForm 
          onSuccess={handleCampaignCreated}
          onCancel={() => setOpenDialog(false)}
        />
      </Dialog>
    </Box>
  );
}

export default Campaigns;