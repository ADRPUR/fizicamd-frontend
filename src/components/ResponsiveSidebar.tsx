import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, Button, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

type ResponsiveSidebarProps = {
  triggerLabel: string;
  children: React.ReactNode;
  width?: number;
  stickyTop?: number;
};

export default function ResponsiveSidebar({
  triggerLabel,
  children,
  width = 320,
  stickyTop = 24,
}: ResponsiveSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    return (
      <Box sx={{ position: { lg: "sticky" }, top: stickyTop }}>
        {children}
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<MenuIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        {triggerLabel}
      </Button>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width, p: 2 } }}
      >
        {children}
      </Drawer>
    </Box>
  );
}
