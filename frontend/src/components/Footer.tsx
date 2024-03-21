import React from 'react';
import lotusSvg from '../lotus.svg';

const Footer: React.FC = () => {
    return (
        <footer 
        style={{ backgroundImage: 'linear-gradient(to top, rgb(104,128,215, 0.6), rgba(86, 90, 101, 0))', marginTop: '200px', padding: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container p-2">
                <div className="row">
                    <div style={{ textAlign: 'center' }}>
                        <h5 className="mb-3" style={{ color: 'rgb(95,120,203)' }}>PeacePlan</h5>
                        <div>
                            <img src={lotusSvg} alt="Lotus" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <p style={{ color: '#5D5F65' }}>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
                            molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
                            voluptatem veniam, est atque cumque eum delectus sint!
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-center p-2" style={{ color: '#5D5F65' }}>
                ©2024 PeacePlan
            </div>
        </footer>
    );
}

export default Footer;
