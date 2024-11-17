import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Alert,
  Box
} from '@mui/material';
import { segmentAPI } from '../../utils/api';

// Mock data for testing (remove this when real API is ready)
const mockSegments = [
  {
    _id: '1',
    name: 'High Value Customers',
    conditions: [
      { field: 'totalSpending', operator: 'gt', value: '1000' }
    ],
    customerCount: 50
  },
  {
    _id: '2',
    name: 'Recent Visitors',
    conditions: [
      { field: 'lastVisit', operator: 'gt', value: '30' }
    ],
    customerCount: 120
  }
];

function SegmentList({ refresh }) {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSegments();
  }, [refresh]);

  const loadSegments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Comment out the API call and use mock data for now
      // const response = await segmentAPI.getAll();
      // setSegments(response?.data || []);
      
      // Simulate API call with mock data
      setTimeout(() => {
        setSegments(mockSegments);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading segments:', error);
      setError('Failed to load segments. Please try again later.');
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomers = async (segmentId) => {
    try {
      // Simulate API call
      console.log(`Viewing customers for segment: ${segmentId}`);
      // const response = await segmentAPI.getCustomers(segmentId);
      // console.log(response.data);
    } catch (error) {
      console.error('Error loading segment customers:', error);
      alert('Failed to load customers for this segment');
    }
  };

  const getOperatorLabel = (operator) => {
    switch (operator) {
      case 'gt': return 'greater than';
      case 'lt': return 'less than';
      case 'eq': return 'equals';
      default: return operator;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!segments || segments.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No segments found. Create your first segment to get started.
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Conditions</TableCell>
            <TableCell>Customer Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment._id}>
              <TableCell>{segment.name}</TableCell>
              <TableCell>
                {Array.isArray(segment.conditions) && segment.conditions.map((condition, index) => (
                  <Chip
                    key={index}
                    label={`${condition.field} ${getOperatorLabel(condition.operator)} ${condition.value}`}
                    sx={{ 
                      margin: '2px',
                      backgroundColor: '#e3f2fd',
                      '& .MuiChip-label': {
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                ))}
              </TableCell>
              <TableCell>{segment.customerCount || 0}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => viewCustomers(segment._id)}
                  sx={{
                    textTransform: 'none',
                    minWidth: '120px'
                  }}
                >
                  View Customers
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SegmentList;