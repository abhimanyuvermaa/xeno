import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Button 
} from '@mui/material';
import { customerAPI, campaignAPI, segmentAPI } from '../utils/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    campaigns: 0,
    segments: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, campaigns, segments] = await Promise.all([
        customerAPI.getAll(),
        campaignAPI.getAll(),
        segmentAPI.getAll()
      ]);

      setStats({
        customers: customers.data.length,
        campaigns: campaigns.data.length,
        segments: segments.data.length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h3">{stats.customers}</Typography>
              <Button 
                component={Link} 
                to="/customers" 
                variant="text" 
                color="primary"
              >
                View Customers
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Campaigns</Typography>
              <Typography variant="h3">{stats.campaigns}</Typography>
              <Button 
                component={Link} 
                to="/campaigns" 
                variant="text" 
                color="primary"
              >
                View Campaigns
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Customer Segments</Typography>
              <Typography variant="h3">{stats.segments}</Typography>
              <Button 
                component={Link} 
                to="/segments" 
                variant="text" 
                color="primary"
              >
                View Segments
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/customers"
                  >
                    Add Customer
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/campaigns"
                  >
                    Create Campaign
                  </Button>
                </Grid>
                <Grid item>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/segments"
                  >
                    Create Segment
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;