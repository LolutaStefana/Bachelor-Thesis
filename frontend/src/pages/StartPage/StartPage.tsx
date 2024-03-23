import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './startpage.css';

const StartPage: React.FC = () => {
    const faqs = [
        {
            question: 'What is PeacePlan?',
            answer: 'PeacePlan is a platform designed to help individuals on their journey of self-improvement. We offer various resources and tools to support personal growth and well-being.',
        },
        {
            question: 'How can I get started with PeacePlan?',
            answer: 'To get started with PeacePlan, simply click on the "Get Started" button above or navigate to the login page. ',
        },
        {
            question: 'Who are the therapists available on PeacePlan?',
            answer: 'Our therapists are licensed professionals with expertise in various areas, including psychology, counseling, and therapy. They are dedicated to helping individuals improve their mental health and well-being.',
        },
        {
            question: 'Can I schedule appointments with therapists?',
            answer: 'Yes, PeacePlan allows you to schedule appointments with therapists directly through the platform. You can choose from a variety of available therapists and book sessions at your convenience.',
        },
    ];
    const navigate = useNavigate();
    const [showFAQ, setShowFAQ] = useState(false);
    const [expanded, setExpanded] = useState<boolean[]>(new Array(faqs.length).fill(false));

    useEffect(() => {
        const handleScroll = () => {
            if (!showFAQ && window.scrollY > window.innerHeight / 2) {
                setShowFAQ(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showFAQ]);

    const handleExpand = (panel: number) => () => {
        const newExpanded = [...expanded];
        newExpanded[panel] = !expanded[panel];
        setExpanded(newExpanded);
    };



    return (
        <div>
            <div className="start-page">
                <div className="content">
                    <h1>Welcome to PeacePlan</h1>
                    <p>Your journey to self-improvement starts here.</p>
                    <button onClick={() => navigate('/login')} className="start-button">
                        Get Started
                    </button>
                </div>
                <div className="footer-transition"></div>
            </div>
            <div className={`faq-section ${showFAQ ? 'show' : ''}`}>
                <Typography variant="h4" gutterBottom className="content-faq-title">
                    Frequently asked questions
                </Typography>
                {faqs.map((faq, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded[index]}
                        onChange={handleExpand(index)}
                        style={{backgroundColor: 'rgb(234,229,244,0.5)', marginBottom: '10px' }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${index}a-content`}
                            id={`${index}a-header`}
                            style={{ backgroundColor: 'rgb(168,184,243,0.5)' }}
                        >
                            <Typography className="content-faq-content">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography style={{ color: 'rgb(85, 89, 101)' }}>{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}

            </div>
        </div>
    );
};

export default StartPage;
