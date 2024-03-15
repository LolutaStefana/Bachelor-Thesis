import React, { useEffect, useState } from 'react';
const HomePage = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (response.ok) {
                    const content = await response.json();
                    console.log('Fetched name:', content.name);
                    setName(content.name);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='home-container'>
            {name ? `Hi ${name}` : 'You are not logged in'}
        </div>
    );
};

export default HomePage;
