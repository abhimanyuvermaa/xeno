import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { campaignAPI, segmentAPI } from '../../utils/api';

function CreateCampaignForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      segmentId: '',
      message: {
        subject: '',
        body: ''
      },
      scheduledAt: ''
    });
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      loadSegments();
    }, []);

    const loadSegments = async () => {
      try {
        const response = await segmentAPI.getAll();
        setSegments(response.data);
      } catch (error) {
        console.error('Error loading segments:', error);
        setError('Failed to load segments');
      }
    };

    // Updated campaign types to match backend enum
    const campaignTypes = [
      { value: 'email', label: 'Email Campaign' },
      { value: 'sms', label: 'SMS Campaign' },
      { value: 'push', label: 'Push Notification' }
    ];

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'subject' || name === 'body') {
        setFormData(prev => ({
          ...prev,
          message: {
            ...prev.message,
            [name]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        setLoading(true);

        // Validate required fields
        if (!formData.name || !formData.type || !formData.segmentId || !formData.message.body) {
          throw new Error('Please fill in all required fields');
        }

        const dataToSubmit = {
          name: formData.name,
          type: formData.type.toLowerCase(), // Ensure lowercase
          segmentId: formData.segmentId,
          message: {
            subject: formData.message.subject,
            body: formData.message.body
          },
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null
        };

        console.log('Submitting campaign data:', dataToSubmit);
        
        const response = await campaignAPI.create(dataToSubmit);
        console.log('Campaign created successfully:', response);
        
        onSuccess();
      } catch (error) {
        console.error('Error creating campaign:', error);
        setError(error.response?.data?.message || error.message || 'Failed to create campaign');
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <DialogTitle>Create New Campaign</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={3}>
              <TextField
                name="name"
                label="Campaign Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <FormControl fullWidth required>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Campaign Type"
                  onChange={handleChange}
                >
                  {campaignTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Target Segment</InputLabel>
                <Select
                  name="segmentId"
                  value={formData.segmentId}
                  label="Target Segment"
                  onChange={handleChange}
                >
                  {segments.map(segment => (
                    <MenuItem key={segment._id} value={segment._id}>
                      {segment.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.type === 'email' && (
                <TextField
                  name="subject"
                  label="Email Subject"
                  value={formData.message.subject}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              )}

              <TextField
                name="body"
                label="Message Content"
                value={formData.message.body}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
              />

              <TextField
                name="scheduledAt"
                label="Schedule (Optional)"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
          </DialogActions>
        </form>
      </>
    );
}

export default CreateCampaignForm;