import { Card, CardContent, CardMedia, Chip, Stack, Typography, Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { ResourceCard as ResourceCardType } from "../../types/resources";
import { useI18n } from "../../i18n";
import { absoluteMediaUrl } from "../../utils/media";
import { formatHumanDate } from "../../utils/dates";

interface Props {
  resource: ResourceCardType;
}

export default function ResourceCard({ resource }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useI18n();
  const isCompact = location.pathname === "/";

  const cover = absoluteMediaUrl(resource.avatarUrl);
  const locale = language === "ro" ? "ro-RO" : "en-US";
  const publishedAt = formatHumanDate(resource.publishedAt, locale);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        display: "flex",
        flexDirection: cover ? "row" : "column",
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(91,92,255,0.08), rgba(255,126,92,0.08))",
        border: "1px solid rgba(91,92,255,0.12)",
      }}
    >
      {cover && (
        <Box sx={{ width: { xs: 140, sm: 220 }, flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={cover}
            alt={resource.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              minHeight: { xs: 120, sm: 160 },
            }}
          />
        </Box>
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: isCompact ? 0.75 : 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={isCompact ? 0.5 : 1}>
          {resource.category?.group && (
            <Chip label={resource.category.group} size="small" color="secondary" />
          )}
          <Chip label={resource.category?.label} size="small" />
        </Stack>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", sm: "1.1rem" }, lineHeight: 1.2 }}
        >
          {resource.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={
            isCompact
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 1,
                }
              : undefined
          }
        >
          {resource.summary}
        </Typography>
        {resource.tags?.length ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={isCompact ? 0.5 : 1}>
            {resource.tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} variant="outlined" />
            ))}
          </Stack>
        ) : null}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={isCompact ? 0.5 : 1}
          sx={{ fontSize: { xs: "0.72rem", sm: "0.78rem" } }}
        >
          {t("resources.publishedBy")}: {resource.authorName}
          {publishedAt ? ` ${t("resources.publishedOn")} ${publishedAt}` : ""}
        </Typography>
        <Button
          size="small"
          sx={{ mt: "auto", alignSelf: "flex-start", px: 1.5, minHeight: 30 }}
          onClick={() =>
            navigate(`/resources/${resource.slug}`, {
              state: { from: `${location.pathname}${location.search}` },
            })
          }
        >
          {t("resources.viewDetails")}
        </Button>
      </CardContent>
    </Card>
  );
}
