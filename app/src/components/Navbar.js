import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, ButtonGroup, Button, Autocomplete } from '@mui/material';
import { useBrand } from '../context/BrandContext';
import { useDate } from '../context/DateContext';
import { styled, alpha } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';


// Styled components

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
  borderBottom: `1px solid #607175`,
}));


const LogoContainer = styled('div')({

  width: '225px',

  display: 'flex',

  justifyContent: 'center',

  alignItems: 'center',

  '& img': {

    height: '36px',

    width: 'auto',

  },

});


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#222628', 0.05),
  '&:hover': {
    backgroundColor: alpha('#222628', 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: '24px',
  width: '300px',
  [theme.breakpoints.up('sm')]: {
    width: '300px',
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#3A3D43',
  zIndex: 1,
}));


const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    color: '#333333',
  },
}));


const DateFilterGroup = styled(ButtonGroup)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  '& .MuiButton-root': {
    textTransform: 'none',
    color: '#666666',
    borderColor: '#e0e0e0',
    '&.active': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
    },
  },
}));


const UserProfile = styled('div')({

  marginLeft: 'auto',

  '& img': {

    height: '40px',

    width: '40px',

    borderRadius: '50%',

    cursor: 'pointer',

  },

});


// Brand options

const brands = [

  { label: 'Adidas', value: 'adidas', logo: '/assets/brands/adidas.png' },

  { label: 'Nike', value: 'nike', logo: '/assets/brands/nike.png' },

  { label: 'Reebok', value: 'reebok', logo: '/assets/brands/reebok.png' },

  { label: 'Puma', value: 'puma', logo: '/assets/brands/puma.png' },

  { label: 'Converse', value: 'converse', logo: '/assets/brands/converse.png' },

];


const Navbar = () => {

  const { dateFilter, setDateFilter } = useDate();
  const { selectedBrand, setSelectedBrand } = useBrand();
  const [searchSelectedBrand, setSearchSelectedBrand] = useState(null);

  const handleFilterClick = (filter) => {
    setDateFilter(filter);
  };

  useEffect(() => {
    const currentBrand = brands.find((brand) => brand.label === selectedBrand);
    setSearchSelectedBrand(currentBrand || brands[0]);
  }, [selectedBrand]);

  return (
    <StyledAppBar position="static">

      <Toolbar>

        <LogoContainer>

          <img src="/assets/logo.png" alt="MAI'STAs Logo" />

        </LogoContainer>

        <Search>

          <SearchIconWrapper>

            <SearchIcon />

          </SearchIconWrapper>
          <StyledAutocomplete
            value={searchSelectedBrand}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedBrand(newValue.label);
                setSearchSelectedBrand(newValue);
              }
            }}
            options={brands}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li key={key} {...otherProps} style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={option.logo}
                    alt={option.label}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} style={{ display: 'flex', alignItems: 'center' }}>
                {searchSelectedBrand && (
                  <img
                    src={searchSelectedBrand.logo}
                    alt={searchSelectedBrand.label}
                    style={{
                      width: 24,
                      height: 24,
                      position: 'absolute',
                      left: 48,
                      zIndex: 1,
                    }}
                  />
                )}
                <input
                  type="text"
                  {...params.inputProps}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    height: '40px',
                    fontSize: '14px',
                    paddingLeft: searchSelectedBrand ? '80px' : '48px',
                  }}
                  placeholder="Search brand..."
                />
              </div>
            )}
          />
        </Search>

        <DateFilterGroup size="small">

          <Button
            className={dateFilter === 'W' ? 'active' : ''}
            onClick={() => handleFilterClick('W')}
          >
            W
          </Button>

          <Button
            className={dateFilter === 'M' ? 'active' : ''}
            onClick={() => handleFilterClick('M')}
          >
            M
          </Button>

          <Button
            className={dateFilter === '3M' ? 'active' : ''}
            onClick={() => handleFilterClick('3M')}
          >
            3M
          </Button>

          <Button
            className={dateFilter === '12M' ? 'active' : ''}
            onClick={() => handleFilterClick('12M')}
          >
            12M
          </Button>

        </DateFilterGroup>

        <UserProfile>

          <img src="/assets/user_profile.png" alt="User Profile" />

        </UserProfile>

      </Toolbar>

    </StyledAppBar>

  );

};


export default Navbar;
