import { useState, useEffect } from "react";
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
  Stack,   
  Typography
} from "@mui/material";
import { campaignAPI } from "../../utils/api";

function CampaignList({ refresh }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, [refresh]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteCampaign = async (campaignId) => {
    try {
      await campaignAPI.execute(campaignId);
      loadCampaigns(); // Refresh the list
    } catch (error) {
      console.error("Error executing campaign:", error);
      alert("Failed to execute campaign");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "primary";
      case "RUNNING":
        return "warning";
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Segment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Schedule</TableCell>
            <TableCell>Statistics</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {campaigns.map((campaign) => (
    <TableRow key={campaign._id}>
      <TableCell>{campaign.name}</TableCell>
      <TableCell>{campaign.type}</TableCell>
      <TableCell>{campaign.segment?.name}</TableCell>
      <TableCell>
        <Chip
          label={campaign.status}
          color={getStatusColor(campaign.status)}
          size="small"
        />
      </TableCell>
      <TableCell>
        {campaign.scheduledAt
          ? new Date(campaign.scheduledAt).toLocaleString()
          : "Immediate"}
      </TableCell>
      <TableCell>
        <Stack spacing={1}>
          <Typography variant="body2">
            Audience: {campaign.audienceSize || 0}
          </Typography>
          <Typography variant="body2">
            Sent: {campaign.stats?.sent || 0}
          </Typography>
          <Typography variant="body2">
            Failed: {campaign.stats?.failed || 0}
          </Typography>
          <Typography variant="body2">
            Success Rate:{" "}
            {campaign.stats?.sent
              ? `${(
                  (campaign.stats.sent /
                    (campaign.stats.sent + campaign.stats.failed)) *
                  100
                ).toFixed(1)}%`
              : "N/A"}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          size="small"
          disabled={campaign.status !== "SCHEDULED"}
          onClick={() => handleExecuteCampaign(campaign._id)}
        >
          Execute
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </TableContainer>
  );
}

export default CampaignList;
