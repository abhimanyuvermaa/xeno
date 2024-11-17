import { useState } from 'react';
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { segmentAPI } from '../../utils/api';

function CreateSegmentForm({ onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [conditions, setConditions] = useState([
    { field: '', operator: '', value: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const fields = [
    { value: 'totalSpending', label: 'Total Spending' },
    { value: 'visitCount', label: 'Visit Count' },
    { value: 'lastVisit', label: 'Last Visit' }
  ];

  const operators = [
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'eq', label: 'Equals' }
  ];

  const handleAddCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await segmentAPI.create({
        name,
        conditions: conditions.filter(c => c.field && c.operator && c.value)
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating segment:', error);
      alert('Failed to create segment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Create New Segment</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              label="Segment Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            {conditions.map((condition, index) => (
              <Stack 
                key={index} 
                direction="row" 
                spacing={2} 
                alignItems="center"
              >
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    value={condition.field}
                    label="Field"
                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                    required
                  >
                    {fields.map(field => (
                      <MenuItem key={field.value} value={field.value}>
                        {field.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={condition.operator}
                    label="Operator"
                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                    required
                  >
                    {operators.map(op => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Value"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                  required
                  fullWidth
                />

                <IconButton 
                  onClick={() => handleRemoveCondition(index)}
                  disabled={conditions.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Button 
              type="button" 
              onClick={handleAddCondition}
              variant="outlined"
            >
              Add Condition
            </Button>
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
            {loading ? 'Creating...' : 'Create Segment'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
}

export default CreateSegmentForm;