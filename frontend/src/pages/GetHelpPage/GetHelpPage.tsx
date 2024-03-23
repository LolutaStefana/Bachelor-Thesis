import React,{useEffect} from 'react';
import './gethelppage.css';

const GetHelpPage: React.FC = () => {

    useEffect(() => {
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLAnchorElement;
            const hash = target.hash;
            const element = document.querySelector(hash);
            if (element) {
                const offset = 100; // Adjust this value to fit your layout
                const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                event.preventDefault();
            }
        };

        document.querySelectorAll('.country-list a').forEach(anchor => {
            anchor.addEventListener('click', handleAnchorClick as EventListener);
        });
        return () => {
          document.querySelectorAll('.country-list a').forEach(anchor => {
            anchor.removeEventListener('click', handleAnchorClick as EventListener);
          });
        };
      }, []);
  return (
    <div className="get-help-page">
      <div className="page-header">
        <h1 style={{ marginBottom: '30px'  }}>Get Help Now</h1>
        <p style={{ marginBottom: '30px' }}>If you are in a crisis or any other person may be in danger, the following resources can provide you with immediate help.</p>
      </div>
      <div className='container-wrapper'>
        <div className="country-list-container">
          <div className="country-list">
                        <h3 >Find your country</h3>
                        <ul  >
                        <li><a href="#Romania">Romania</a></li>
                            <li><a href="#US">United States</a></li>
                            <li><a href="#Argentina">Argentina</a></li>
                            <li><a href="#Spain">Spain</a></li>
                            <li><a href="#Australia">Australia</a></li>
                            <li><a href="#China">China</a></li>
                            <li><a href="#Canada">Canada</a></li>
                            <li><a href="#SouthAfrica">South Africa</a></li>
                            <li><a href="#NewZealand">New Zealand</a></li>
                            <li><a href="#India">India</a></li>
                            <li><a href="#Germany">Germany</a></li>
                            <li><a href="#Finland">Finland</a></li>
                           

                        </ul>
                    </div>
                </div>
                <div className="country-info-container">
                    <div className="country-info">
                    <div id="Romania" style={{marginBottom:'30px'}}>
                            <h2>Romania</h2>
                            <ul>
                                <li>Emergency: 112</li>
                                <li>Hotline: 800.801.200 </li>
                                <li>Visit : <a href="https://www.antisuicid.ro/">https://www.antisuicid.ro/</a></li>
                            </ul>
                        </div>
                        <div id="US" style={{marginBottom:'30px'}}>
                            <h2>United States</h2>
                            <ul>
                                <li>Emergency: 911</li>
                                <li>Suicide & Crisis Lifeline: Call or text 988</li>
                                <li>National Domestic Violence Hotline: 1-800-799-7233</li>
                                <li>Crisis Text Line: Text "DESERVE" TO 741-741</li>
                                <li>Lifeline Crisis Chat (Online live messaging): <a href="https://988lifeline.org/chat">https://988lifeline.org/chat</a></li>
                                <li>Self-Harm Hotline: 1-800-DONT CUT (1-800-366-8288)</li>
                                <li>Essential local and community services: 211, <a href="https://www.211.org/">https://www.211.org/</a></li>
                                <li>Planned Parenthood Hotline: 1-800-230-PLAN (7526)</li>
                                <li>American Association of Poison Control Centers: 1-800-222-1222</li>
                                <li>National Council on Alcoholism & Drug Dependency Hope Line: 1-800-622-2255</li>
                                <li>National Crisis Line - Anorexia and Bulimia: 1-800-233-4357</li>
                                <li>LGBT Hotline: 1-888-843-4564</li>
                                <li>TREVOR Crisis Hotline: 1-866-488-7386</li>
                                <li>AIDS Crisis Line: 1-800-221-7044</li>
                                <li>Veterans Crisis Line: <a href="https://www.veteranscrisisline.net">https://www.veteranscrisisline.net</a></li>
                                <li>TransLifeline: <a href="https://www.translifeline.org">https://www.translifeline.org</a> - 877-565-8860</li>
                            </ul>
                        </div>

                        <div id="UK" style={{marginBottom:'30px'}}>
                            <h2>UK & Republic of Ireland</h2>
                            <ul>
                                <li>Emergency: 112 or 999</li>
                                <li>Non-emergency: 111, Option 2</li>
                                <li>24/7 Helpline: 116 123 (UK and ROI)</li>
                                <li>Shout: Text "DESERVE" TO 85258</li>
                                <li>Samaritans.org: <a href="https://www.samaritans.org/how-we-can-help-you/contact-us">https://www.samaritans.org/how-we-can-help-you/contact-us</a></li>
                                <li>YourLifeCounts.org: <a href="https://yourlifecounts.org/find-help/">https://yourlifecounts.org/find-help/</a></li>
                            </ul>
                        </div>
                        <div id="Argentina" style={{marginBottom:'30px'}}>
                            <h2>Argentina</h2>
                            <ul>
                                <li>Emergency: 911</li>
                                <li>Argentina Suicide Hotline: +5402234930430</li>
                            </ul>
                        </div>

                        <div id="Spain" style={{marginBottom:'30px'}}>
                            <h2>Spain</h2>
                            <ul>
                                <li>Emergency: 112</li>
                                <li>Telefono De La Esperanza: 717-003-717  - <a href="http://telefonodelaesperanza.org/llamanos">http://telefonodelaesperanza.org/llamanos</a></li>
                            </ul>
                        </div>

                        <div id="Australia" style={{marginBottom:'30px'}}>
                            <h2>Australia</h2>
                            <ul>
                                <li>Emergency: 000</li>
                                <li>Lifeline Australia: 13 11 14</li>
                                <li>Beyond Blue: <a href="https://www.beyondblue.org.au/get-support/get-immediate-support">https://www.beyondblue.org.au/get-support/get-immediate-support</a></li>
                            </ul>
                        </div>

                        <div id="China" style={{marginBottom:'30px'}}>
                            <h2>China</h2>
                            <ul>
                                <li>Emergency: 110</li>
                                <li>Beijing Suicide Research and Prevention Center: 800-810-1117 (landline) or 010-8295-1332 (mobile and VoIP callers) - <a href="http://www.crisis.org.cn/">http://www.crisis.org.cn/</a></li>
                                <li>Shanghai Mental Health Center: <a href="http://www.smhc.org.cn/">http://www.smhc.org.cn/</a></li>
                                <li>Lifeline Shanghai: <a href="https://www.lifeline-shanghai.com/">https://www.lifeline-shanghai.com/</a></li>
                            </ul>
                        </div>

                        <div id="Canada" style={{marginBottom:'30px'}}>
                            <h2>Canada</h2>
                            <ul>
                                <li>Emergency: 911</li>
                                <li>Crisis Text Line (Powered by Kids Help Phone): Text "DESERVE" TO 686868</li>
                                <li>Crisis Services Canada: <a href="http://www.crisisservicescanada.ca/en/">http://www.crisisservicescanada.ca/en/</a></li>
                                <li>Canadian Association for Suicide Prevention: <a href="https://suicideprevention.ca/need-help/">https://suicideprevention.ca/need-help/</a></li>
                            </ul>
                        </div>

                        <div id="SouthAfrica" style={{marginBottom:'30px'}}>
                            <h2>South Africa</h2>
                            <ul>
                                <li>Emergency: 10 111 for police or 10 177 for an ambulance</li>
                                <li>24hr Helpline: 0800 12 13 14 or SMS 31393 (and we will call you back)</li>
                                <li>Depression and Anxiety Helpline: 0800 70 80 90</li>
                                <li>YourLifeCounts.org: <a href="https://yourlifecounts.org/find-help/">https://yourlifecounts.org/find-help/</a></li>
                            </ul>
                        </div>

                        <div id="NewZealand" style={{marginBottom:'30px'}}>
                            <h2>New Zealand</h2>
                            <ul>
                                <li>Emergency: 111</li>
                                <li>Lifeline 24/7 Helpline: 0800 543 354</li>
                                <li>Suicide Crisis Helpline: 0508 828 865 (0508 TAUTOKO)</li>
                                <li>YourLifeCounts.org: <a href="https://yourlifecounts.org/find-help/">https://yourlifecounts.org/find-help/</a></li>
                            </ul>
                        </div>

                        <div id="India" style={{marginBottom:'30px'}}>
                            <h2>India</h2>
                            <ul>
                                <li>Emergency: 112</li>
                                <li>Sneha India: 91 44 24640050 - <a href="http://www.snehaindia.org">http://www.snehaindia.org</a></li>
                            </ul>
                        </div>

                        <div id="Germany" style={{marginBottom:'30px'}}>
                            <h2>Germany</h2>
                            <ul>
                                <li>Emergency: 112</li>
                                <li>Hotline: 800 111 0111</li>
                                <li>Hotline: 0800 111 0222</li>
                            </ul>
                        </div>

                        <div id="Finland" style={{marginBottom:'30px'}}>
                            <h2>Finland</h2>
                            <ul>
                                <li>Emergency: 112</li>
                                <li>Crisis Line: 010 195 202</li>
                                <li>For more information, visit: <a href="https://www.mieli.fi/fi/mielenterveys">https://www.mieli.fi/fi/mielenterveys</a></li>
                            </ul>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetHelpPage;
