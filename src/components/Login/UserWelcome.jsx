import { Box, Grid, Typography, Skeleton, Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Íconos disponibles
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import StarRateIcon from '@mui/icons-material/StarRate';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups'; 

const iconMap = {
  TrendingUpIcon: TrendingUpIcon,
  SmartToyOutlinedIcon: SmartToyOutlinedIcon,
  SportsEsportsIcon: SportsEsportsIcon,
  SportsSoccerIcon: SportsSoccerIcon,
  EmojiEventsIcon: EmojiEventsIcon,
  SportsBasketballIcon: SportsBasketballIcon,
  StarRateIcon: StarRateIcon,
  WorkspacePremiumIcon: WorkspacePremiumIcon,
  NotificationsActiveIcon: NotificationsActiveIcon, 
  DashboardIcon: DashboardIcon, 
  GroupsIcon: GroupsIcon,
};

const WelcomeSection = ({
  user,
  loading,
  subtitle = 'To your tournaments!',
  description = 'Here you can manage your tournaments and consult your information.',
  iconName = 'SmartToyOutlinedIcon' // default
}) => {
  const userName = user?.userName?.toUpperCase() || 'INVITADO';
  const SelectedIcon = iconMap[iconName] || SmartToyOutlinedIcon;

  return (
    <Box
      sx={(theme) => ({
        mb: 6,
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -16,
          left: 0,
          width: '100%',
          height: 1,
          background: `linear-gradient(to right, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`
        }
      })}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Box
            sx={(theme) => ({
              p: 3,
              borderRadius: 4,
              background:
                theme.palette.mode === 'light'
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
              boxShadow: theme.shadows[2]
            })}
          >
            <Typography
              variant="h4"
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontWeight: 800,
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(to right, hsl(210, 100%, 70%), hsl(143, 88.70%, 51.40%), gold)'
                    : 'linear-gradient(to right, hsl(219, 77%, 40%), hsl(143, 88.70%, 35.40%), goldenrod)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 0.5
              })}
            >
              {loading ? (
                <Skeleton variant="rounded" width={'70%'} height={48} />
              ) : (
                <>
                  Welcome back{' '}
                  <Box
                    component="span"
                    sx={(theme) => ({
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(to right, orange, gold, white)'
                        : 'linear-gradient(to right, dimgray, darkorange)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 900
                    })}
                  >
                    {userName}
                  </Box>

                  <DashboardIcon
                    sx={(theme) => ({
                      fontSize: '2rem',
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(to right, orange, gold, gray)'
                        : 'linear-gradient(to right, darkorange, goldenrod, dimgray)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    })}
                  />
                </>
              )}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                ml: 4,
                fontWeight: 700,
                background: 'linear-gradient(to right,rgb(238, 89, 52), #feb47b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {loading ? <Skeleton variant="rounded" width={'40%'} sx={{ my: 2 }} /> : subtitle}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={(theme) => ({
                mt: 3,
                fontWeight: 500,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(to right, rgb(17, 235, 82), rgb(27, 233, 181))'
                  : 'linear-gradient(to right, rgb(5, 116, 60), rgb(12, 10, 12))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'background 0.3s ease-in-out'
              })}
            >
              {loading ? (
                <Skeleton variant="rounded" width="60%" />
              ) : (
                description
              )}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '100%',
              alignItems: 'center'
            }}
          >
            <Avatar
              sx={(theme) => ({
                width: 120,
                height: 120,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.light, 0.9)
                    : alpha(theme.palette.primary.dark, 0.9),
                border: `2px solid ${alpha(theme.palette.secondary.dark, 0.3)}`
              })}
            >
              <SelectedIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeSection;
