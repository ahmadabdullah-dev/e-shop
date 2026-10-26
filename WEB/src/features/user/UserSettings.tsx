import { useState } from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";

import UpdateEmail from "./Email/UpdateEmail";
import UpdateUser from "./UpdateUser";
import UpdateUserName from "./UpdateUserName";

const sections = [
  { label: "Profile", content: <UpdateUser /> },
  { label: "Username", content: <UpdateUserName /> },
  { label: "Email", content: <UpdateEmail /> },
];

export default function UserSettings() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="sm">
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            {sections.map(({ label }) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="sm">{sections[tab].content}</Container>
    </Box>
  );
}
