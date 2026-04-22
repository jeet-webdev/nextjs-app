
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RestaurantRecord } from "@/features/restaurants/types";
import { PhoneCallIcon } from "lucide-react";
import Image from 'next/image';

interface ResponsiveAppBarProps {
  restaurant: RestaurantRecord;
}
const pages = ['All Menu', 'Top Dishes', 'Drinks'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar({ restaurant }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
const params = useParams();
  const slug = params.slug as string;


 
  

 

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
 

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  

  return (
  
        <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: '#0f172a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 50
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
           {restaurant.logo ? (
             <Image 
              src={restaurant.logo} 
              alt={`${restaurant.name} logo`}
             
              width={40}
              height={40}
              className="h-10 w-auto mr-4 rounded" />
             ): (
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            )}
          


    
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 400,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {restaurant.name}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              // anchorOrigin={{
              //   vertical: 'bottom',
              //   horizontal: 'start',
              // }}
              keepMounted
              // transformOrigin={{
              //   vertical: 'top',
              //   // horizontal: 'start',
              // }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            
              fontWeight: 400,
            
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {restaurant.name}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
         
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar