import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

// Function to list a product (POST request)
export const listProduct = async (formData) => {
    const {user} = useContext(AuthContext)
    if (!formData) {
        return;
    }

    try {
        // Set loading state to true if needed (for example, in your component)
        setLoading(true);

        const response = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:MhI4A9Qg/marketplace_product", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                created_at:Date.now(),
                product_name: formData.name,
                product_type: formData.type,
                price: formData.price,
                quantity: formData.quantity,
                description: formData.description,
                status: "available", // You can set the status to available by default or based on your logic
                user_id: user._id, 
                image_url: formData.image_url, // Image URL if available
            }),
        });

        const data = await response.json();
                console.log(formData)
        console.log(user._id)
        console.log(data)
        // Check if the response is okay
        if (response.ok) {
            // You can handle a successful API call here, maybe show a success message
            return data; // Return data if needed for further use
        } else {
            // Handle errors if response is not OK
            Alert.alert("Error", data?.message || "Something went wrong. Please try again.");
        }
    } catch (error) {
        // Handle any errors that occur during the API call
        Alert.alert("Error", "An error occurred. Please try again later.");
        console.error("Error listing product:", error);
    } finally {
        // Reset loading state if needed
        setLoading(false);
    }
};
