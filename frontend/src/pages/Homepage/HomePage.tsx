import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as needed
import CircularProgress from '@mui/material/CircularProgress'; // For the loading indicator

const HomePage = () => {
    const { name, loading } = useAuth();

    if (loading) {
        return (
            <div className='loading-container'>
                <CircularProgress style={{alignContent:'center'}} /> 
            </div>
        );
    }
    let content;

    if (name === '') {
        // The user is not logged in
        content = (
            <div className='home-message'>
                <h2>You are not logged in</h2>
                <p>Please <a href="/login">login</a> to access your homepage.</p>
            </div>
        );
    } else {
        // The user is logged in
        content = (
            <div className='home-welcome'>
                <h2>Hi {name}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed laoreet libero. Curabitur orci turpis, euismod quis efficitur vel, tempor vel nunc. Quisque cursus quis metus id venenatis. Fusce eros dui, finibus ut lorem at, ultrices blandit sapien. Suspendisse id tortor consequat, finibus lorem id, malesuada dui. Cras convallis ex a magna bibendum dapibus. Ut vel arcu sit amet augue feugiat luctus. Phasellus in velit ac nulla pretium placerat. Phasellus et sodales leo. Integer pulvinar mauris vel purus semper viverra. Fusce luctus eget ligula fringilla consectetur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut euismod, velit et molestie ullamcorper, nulla dolor lobortis nisl, ullamcorper posuere libero est sit amet nunc. Donec varius scelerisque tellus sed fermentum. Proin elementum id nulla quis facilisis.

Vestibulum nibh urna, tincidunt in massa iaculis, ornare hendrerit mauris. Etiam at blandit risus, ac tincidunt eros. Cras egestas nisl eget velit euismod aliquet. Aliquam erat volutpat. Vivamus volutpat sapien in ipsum tempus efficitur. In vitae ligula hendrerit, ultricies odio sed, pulvinar ipsum. Sed congue efficitur tempor. In fringilla pharetra malesuada.

Nam vel euismod ante. Duis maximus arcu gravida, malesuada nunc non, rutrum purus. Vivamus dapibus diam nisi, a rhoncus sapien condimentum in. Sed cursus cursus consectetur. Nullam varius velit vitae dolor rutrum maximus. Sed id est nec nunc aliquam ultrices. Quisque consequat arcu vitae nulla interdum, et sodales lorem elementum. Nulla lobortis purus ut elit vulputate, eget porttitor velit commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur aliquet gravida neque non porttitor. Aliquam congue velit cursus, pellentesque erat vel, tristique risus. Nunc tincidunt eros cursus lacinia porttitor. Quisque ut dignissim lectus, eget aliquet arcu. Mauris risus sapien, lobortis at turpis ac, rutrum iaculis ante. Pellentesque euismod accumsan tincidunt. Integer vestibulum, nibh at luctus feugiat, ipsum nibh egestas sapien, id imperdiet nisl metus in velit.</p>
            </div>
        );
    }

    return (
        <div className='home-container'>
            {content}
        </div>
    );
};

export default HomePage;
