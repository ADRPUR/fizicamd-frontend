import { Stack, Typography } from "@mui/material";
import { useI18n } from "../i18n";
import PageLayout from "../components/PageLayout";
import NavigationSidebar from "../components/NavigationSidebar";
import ResponsiveSidebar from "../components/ResponsiveSidebar";

export default function TeacherStudioPage() {
  const { t } = useI18n();

  return (
    <PageLayout>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          {t("layout.studio")}
        </Typography>
        <ResponsiveSidebar triggerLabel={t("teacher.sidebarToggle")}>
          <NavigationSidebar editable />
        </ResponsiveSidebar>
      </Stack>
    </PageLayout>
  );
}
