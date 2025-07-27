import { useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch } from 'react-redux';
import { setLocation } from '../store/locationSlice'; // Import the setLocation action

const useLocation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const getCurrentLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Dispatch the location to the Redux store
                    dispatch(setLocation({ latitude, longitude }));
                },
                (error) => {
                    console.warn(error.code, error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                }
            );
        };

        getCurrentLocation();

        return () => Geolocation.clearWatch();
    }, [dispatch]);

    // You can return additional logic here if needed, like error handling
};

export default useLocation;
