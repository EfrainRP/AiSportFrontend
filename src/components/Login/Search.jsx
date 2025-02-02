import * as React from 'react';
import {
    Dialog,
    DialogTitle, 
    DialogActions,
    DialogContent,
    DialogContentText,
    Button, 
    Autocomplete,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction, 
    TextField,
    Box, 
    Fab,
    IconButton,
    InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

import SearchIcon from '@mui/icons-material/Search';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';

export default function Search({myOptions, myValue, onChange, isOptionEqualToValue, myLabel='Search', toUrl=null}) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const navigate = useNavigate();

    const handleSearch = ()=>{
        // console.log(myValue);
        // console.log(inputValue);
        const resultInputValue = myOptions.find(item => item.name === inputValue); // busca el elemento por el nombre ESCRITO
        // console.log(resultInputValue);
        if(toUrl){
            if (resultInputValue){ 
                navigate(`/dashboard/${toUrl}/${resultInputValue?.name}/${resultInputValue?.id}`); // Redirigir si es válido
            }else if(myValue){
                navigate(`/dashboard/${toUrl}/${myValue?.name}/${myValue?.id}`);
            }
        }
        return;
    };

    return (
        <SpeedDial
            ariaLabel="Search"
            sx={{ m:2}}
            icon={open? <SavedSearchIcon sx={{fontSize:28}}/>: <SearchIcon sx={{fontSize:28}}/>}
            direction={'right'}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            // onClick={onClick}
        >
        {open &&
                <Autocomplete
                    autoComplete
                    autoSelect
                    selectOnFocus
                    options={myOptions}
                    getOptionLabel={(option)=>option.name} // Muestra el nombre como etiqueta
                    key={(option) => `${option.name}-${option.id}`}
                    isOptionEqualToValue={isOptionEqualToValue || ((option, value) => option.id === value.id)} // Compara por `id`
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    value={myValue || null}
                    onChange={onChange}
                    sx={{ width: 250, p:0, m:0}}
                    renderInput={(params) => 
                        <TextField {...params} label={myLabel} type="search"
                            sx={{ height: 35,
                                "& .MuiOutlinedInput-root": {
                                paddingRight: "0 !important", // Elimina el padding extra
                            },}}
                            onKeyDown={(event) => {
                                console.log(event.key);
                                if (event.key === "Enter" ) {
                                    handleSearch();
                                }}}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    }
                    
                />
            }
        </SpeedDial>
    );
}
