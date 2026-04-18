import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

type CornerProfileProps = {
  user: { name: string; email?: string } | null;
  isLoggingOut: boolean;
  onLogout: () => void;
  onCreateUser?: () => void;
};

function CornerProfile({ user, isLoggingOut, onLogout, onCreateUser }: CornerProfileProps) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

 
const handleCreateUser = () => {
  handleCloseUserMenu(); 
  if (onCreateUser) {
    onCreateUser();      
  }
};

  const handleLogout = () => {
    handleCloseUserMenu();
    onLogout();
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end', py: 1 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
      
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Name: {user?.name || "User"}
              </Typography>
              {user?.email && (
                <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.secondary">
                  Email: {user.email}
                </Typography>
              )}
            </Box>

            <Divider />

            {/* <MenuItem onClick={handleCloseUserMenu}>
              <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
            </MenuItem>
           */}
  <MenuItem 
    onClick={handleCreateUser}
    sx={{ color: 'success.main' }}
  >
    <Typography sx={{ textAlign: 'center', width: '100%' }}>
      Create User
    </Typography>
  </MenuItem>

            
            <MenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              sx={{ color: 'error.main' }}
            >
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                {isLoggingOut ? "Logging out..." : "Logout"}
                {/* Logout */}
              </Typography>
              
            </MenuItem>
            
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
}

export default CornerProfile;
