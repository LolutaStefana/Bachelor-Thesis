import React from 'react';
import lotusSvg from '../../lotus.svg';

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
                            In moments of distress, it's crucial to remember that you're not alone. Whether you're facing a crisis or simply need someone to talk to, our <a href="/gethelp" style={{ color: '#515665', fontWeight: 'bold' }}>resources and support</a> page offers immediate assistance and guidance. Don't hesitate to reach out – help is available and accessible. Together, we can navigate through any challenges and find solace in community and support.
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
