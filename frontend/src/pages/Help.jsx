import React from 'react'
import { useNavigate } from 'react-router-dom'
import HamburgerMenu from '../components/Hamburger.jsx'
import Footer from '../components/Footer.jsx'
import { HELP } from '../constants/help.zh.js'

const Help = () => {
  const navigate = useNavigate()


  return (
    <div style={styles.container}>
      {/* Hamburger Menu */}
      <HamburgerMenu />
      
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.backButton} onClick={() => navigate('/')}>
          {HELP.backToHome}
        </div>
        <h1 style={styles.pageTitle}>{HELP.pageTitle}</h1>
        <div style={styles.pageSubtitle}>
          {HELP.pageSubtitle}
        </div>
      </div>

      {/* Directory Listings */}
      <div style={styles.directoryContainer}>
        <div style={styles.directoryCard}>
          <div style={styles.linkIcon}>🔗</div>
          <div>
            <a 
              href="https://www.aacap.org/AACAP/Families_Youth/CAP_Finder/AACAP/Families_and_Youth/Resources/CAP_Finder.aspx?hkey=61c4e311-beb7-4a25-ae4f-1ec61baf348c" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.directoryLink}
            >
              {HELP.directories.aacap.title}
            </a>
            <p style={styles.directoryDescription}>{HELP.directories.aacap.description}</p>
            <p style={styles.disclaimer}>{HELP.directories.aacap.disclaimer}</p>
          </div>
        </div>
        
        <div style={styles.directoryCard}>
          <div style={styles.linkIcon}>🔗</div>
          <div>
            <a 
              href="https://www.psychologytoday.com/us/therapists" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.directoryLink}
            >
              {HELP.directories.psychologyToday.title}
            </a>
            <p style={styles.directoryDescription}>{HELP.directories.psychologyToday.description}</p>
            <p style={styles.disclaimer}>{HELP.directories.psychologyToday.disclaimer}</p>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div style={styles.supportSection}>
        <h2 style={styles.supportTitle}>{HELP.recommendedBooks.title}</h2>
        
        <div style={styles.supportContainer}>
          {HELP.recommendedBooks.books.map((book, index) => (
            <div key={index} style={styles.supportCard}>
              <div style={styles.supportIcon}>📖</div>
              <div>
                <a 
                  href={index === 0 ? "https://how-to-talk.com/" : index === 1 ? "https://www.paulaxtell.com/store/10-powerful-things-to-say-to-your-kids/" : "https://www.thedisengagedteen.com/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.directoryLink}
                >
                  {book.title}
                </a>
                <p style={styles.supportDescription}>
                  {book.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Support & Education */}
      <div style={styles.supportSection}>
        <h2 style={styles.supportTitle}>{HELP.moreSupport.title}</h2>
        
        <div style={styles.supportContainer}>
          {HELP.moreSupport.resources.map((resource, index) => {
            const urls = [
              "https://www.aacap.org/AACAP/Families_and_Youth/Resource_Centers/Home.aspx",
              "https://www.stopbullying.gov/get-help-now",
              "https://ucawaves.org/"
            ]
            const icons = ['📚', '🚫', '🌊']
            return (
              <div key={index} style={styles.supportCard}>
                <div style={styles.supportIcon}>{icons[index] || '📖'}</div>
                <div>
                  <a 
                    href={urls[index]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.directoryLink}
                  >
                    {resource.title}
                  </a>
                  <p style={styles.supportDescription}>
                    {resource.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning Box */}
        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            {HELP.moreSupport.warning}
          </p>
        </div>
      </div>

      {/* Sources & Real-World Stats */}
      <div style={styles.sourcesSection}>
        <h2 style={styles.sourcesTitle}>
          <span style={styles.chartIcon}>📊</span>
          {HELP.sources.title}
        </h2>
        <p style={styles.sourcesIntro}>
          {HELP.sources.intro}
        </p>
        
        <div style={styles.statsList}>
          {HELP.sources.stats.map((stat, index) => {
            const urls = [
              "https://www.taaf.org/youthmentalhealth",
              "https://www.qualtrics.com/news/only-half-of-high-school-students-feel-a-sense-of-belonging-at-their-school-qualtrics-research-shows/",
              "https://www.snexplores.org/article/teens-feels-lonely-school-cell-phones-internet",
              "https://www.stopbullying.gov/resources/facts#fast-facts",
              "https://www.stopbullying.gov/resources/teens",
              "https://www.wsj.com/lifestyle/careers/college-degree-jobs-unused-440b2abd"
            ]
            return (
              <div key={index} style={styles.statItem}>
                <span style={styles.statText}>{stat.text} </span>
                <a 
                  href={urls[index]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.statLink}
                >
                  {stat.link}
                </a>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

// Premium styling
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3B 50%, #2A2F4B 100%)',
    position: 'relative',
    overflowY: 'auto',
    padding: '20px'
  },
  
  headerSection: {
    marginTop: '60px',
    marginBottom: '40px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '800px'
  },
  
  backButton: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  
  pageTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '15px',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
  },
  
  pageSubtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6'
  },
  
  directoryContainer: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px'
  },
  
  directoryCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px'
  },
  
  linkIcon: {
    fontSize: '24px',
    flexShrink: 0,
    marginTop: '2px'
  },
  
  directoryLink: {
    color: '#4ECDC4',
    textDecoration: 'underline',
    fontSize: '20px',
    fontWeight: '600',
    display: 'block',
    marginBottom: '10px',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#2D7D7A'
    }
  },
  
  directoryDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '5px'
  },
  
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    lineHeight: '1.4'
  },
  
  supportSection: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '40px'
  },
  
  supportTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '25px',
    textAlign: 'center'
  },
  
  supportContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px'
  },
  
  supportCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px'
  },
  
  supportIcon: {
    fontSize: '24px',
    flexShrink: 0,
    marginTop: '2px'
  },
  
  supportDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    lineHeight: '1.6'
  },
  
  warningBox: {
    background: 'rgba(255, 165, 0, 0.15)',
    border: '2px solid rgba(255, 165, 0, 0.4)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center'
  },
  
  warningText: {
    color: '#FFD700',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: 0,
    fontWeight: '600'
  },
  
  sourcesSection: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '40px'
  },
  
  sourcesTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '15px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  
  chartIcon: {
    fontSize: '28px'
  },
  
  sourcesIntro: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    lineHeight: '1.6',
    textAlign: 'center',
    marginBottom: '25px',
    fontStyle: 'italic'
  },
  
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  statItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  
  statText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    lineHeight: '1.4'
  },
  
  statLink: {
    color: '#4ECDC4',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#2D7D7A',
      textDecoration: 'none'
    }
  }
}

export default Help
