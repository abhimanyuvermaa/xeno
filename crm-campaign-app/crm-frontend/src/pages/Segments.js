import { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Dialog,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SegmentList from '../components/Segments/SegmentList';
import CreateSegmentForm from '../components/Segments/CreateSegmentForm';
import { segmentAPI } from '../utils/api';

function Segments() {
  const [segments, setSegments] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);  // Start with loading true
  const [error, setError] = useState('');

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await segmentAPI.getAll();
      console.log('API Response:', response); // Debug log
      
      // Ensure we're setting an array
      setSegments(Array.isArray(response.data) ? response.data : []);
      
    } catch (error) {
      console.error('Error fetching segments:', error);
      setError('Failed to load segments');
      setSegments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleCreateSuccess = () => {
    setOpenCreate(false);
    fetchSegments();
  };

  const handleViewCustomers = async (segmentId) => {
    try {
      const response = await segmentAPI.getCustomers(segmentId);
      console.log('Customers:', response.data);
      // Add your logic to display customers
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    }
  };

  const handleDeleteSegment = async (segmentId) => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        await segmentAPI.delete(segmentId);
        fetchSegments();
      } catch (error) {
        console.error('Error deleting segment:', error);
        setError('Failed to delete segment');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customer Segments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
        >
          Create Segment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" m={3}>
          <CircularProgress />
        </Box>
      ) : (
        <SegmentList 
          segments={segments}
          onViewCustomers={handleViewCustomers}
          onDelete={handleDeleteSegment}
        />
      )}

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateSegmentForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setOpenCreate(false)}
        />
      </Dialog>
    </Box>
  );
}

export default Segments;