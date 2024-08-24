"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Change this line

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the login page when the app loads
        router.push('/login');
    }, [router]);

    return null; // Render nothing while redirecting
};

export default Home;
