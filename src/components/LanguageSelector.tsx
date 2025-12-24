import { MenuItem, TextField, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import { useI18n } from "../i18n";

export default function LanguageSelector() {
  const { language, setLanguage, languages, t } = useI18n();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <ToggleButtonGroup
        size="small"
        exclusive
        value={language}
        onChange={(_, value) => {
          if (value) {
            setLanguage(value as typeof language);
          }
        }}
        sx={{
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: 999,
          boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
          "& .MuiToggleButton-root": {
            border: "none",
            px: 1.2,
            fontWeight: 700,
          },
        }}
      >
        {languages.map((lang) => (
          <ToggleButton key={lang.code} value={lang.code}>
            {lang.code.toUpperCase()}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  return (
    <TextField
      select
      size="small"
      variant="outlined"
      value={language}
      onChange={(e) => setLanguage(e.target.value as typeof language)}
      label={t("common.languageSelector")}
      sx={{ minWidth: 150 }}
    >
      {languages.map((lang) => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
