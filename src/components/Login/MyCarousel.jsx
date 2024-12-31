import React from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

import { Box, Typography, Paper, Skeleton } from '@mui/material';
import { useAuth } from '../../services/AuthContext'; // Importa el AuthContext
// import axiosInstance from '../../services/axiosConfig';


const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
    }
};

export default function MyCarousel(props) {
    const { loading } = useAuth(); 

    // const [data, setData] = React.useState(props.items); // Estado para almacenar torneos y equipos

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         await axiosInstance.get(`/myTourn/${user.userId}`)
    //             .then((response) => {
    //                 setTimeout(() => {
    //                     setLoading(false); // Cambia el estado para simular que la carga ha terminado
    //                 }, 1500); // Simula 3 segundos de carga
    //                 setData(response.data); // Establecer los datos en el estado
                    
    //             }).catch((error) => {
    //                 console.error('Error al obtener los datos del dashboard:', error);
    //                 setLoading(false); // Cambiar el estado de carga incluso en caso de error
    //             });
    //     }
    //     if (user) {
    //         fetchData(); // Llamar a la función solo si el usuario está definido
    //     }
    // }, [[user]]);

    console.log(props.item);
    return (
        <Box sx={{width:'100%', height:'auto', mx:2}}>
            {loading? <Skeleton /> :
            <Carousel
                responsive={responsive}
                slidesToSlide={2}
                //autoPlay={true}
                //autoPlaySpeed={8000} //ms
                // infinite={true}
                removeArrowOnDeviceType={["tablet", "mobile"]}
            >
                {props.item.map((item, i) =>
                    <Paper
                        key={i}
                        elevation={3}
                        sx={{
                            width: '95%',
                            padding: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant='h4' component='strong'>{item.name}</Typography>
                        <Typography><strong>Descripción: </strong>{item.descripcion}</Typography>
                        <Typography><strong>Ubicación: </strong>{item.ubicacion}</Typography>
                    </Paper>
                )}
            </Carousel>}
        </Box>
    );
}