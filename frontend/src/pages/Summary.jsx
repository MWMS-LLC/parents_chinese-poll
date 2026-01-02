import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCategories } from '../services/apiService'
import HamburgerMenu from '../components/HamburgerMenu'
import Footer from '../components/Footer.jsx'

const Summary = () => {
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const { categoryId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const loadCategoryName = async () => {
      try {
        const categories = await fetchCategories()
        const category = categories.find(cat => cat.id === parseInt(categoryId))
        if (category) {
          setCategoryName(category.category_name.replace(/_/g, ' '))
        }
      } catch (err) {
        console.error('Error loading category:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCategoryName()
  }, [categoryId])

  const getSummaryContent = () => {
    const summaries = {
      'Hopes': {
        validation: "You've shared the dreams and aspirations you hold for your child's future. Every hope you've expressed reflects the love and intention you bring to parenting. Your vision for their success matters deeply.",
        advice: "Keep nurturing those hopes while staying open to who they're becoming. The best support balances your dreams with their emerging path. Trust that your guidance, combined with their own discoveries, will help them flourish.",
        future: "Five years from now, you'll see how the foundation you're building today—your encouragement, your expectations, your belief in them—shapes their confidence and choices. The hopes you plant now become the roots they'll grow from."
      },
      'Home Life': {
        validation: "You've reflected on the daily rhythms that shape your family—dinner conversations, chores, allowances, and the small moments that add up. Every household has its own unique flow, and yours is built on the choices you make together.",
        advice: "Keep creating space for connection in the everyday. Small conversations today build deeper trust tomorrow. The routines you establish now teach responsibility, respect, and collaboration.",
        future: "Five years from now, the skills your child is building—negotiating, contributing, communicating needs—will serve them in college, relationships, and their own future home. The foundation you're laying together shapes how they'll navigate independence."
      },
      'Communication': {
        validation: "You've explored how you and your child talk, listen, and understand each other—through conversations, conflicts, support, and trust. Every exchange, whether smooth or challenging, is part of building your connection.",
        advice: "Keep listening with curiosity, even when it's hard. Model the kind of open, honest communication you hope they'll carry into their own relationships. Safe spaces for tough talks now create lifelong patterns of trust.",
        future: "Five years from now, the communication habits you're building today will shape how your child navigates friendships, love, work, and family. The openness you practice now becomes their blueprint for healthy relationships."
      },
      'Mental Health': {
        validation: "You've shared thoughts about emotional well-being—yours and your child's. Acknowledging mental health takes courage, and every step you take to understand and support emotional needs matters deeply.",
        advice: "Keep the conversation open. Normalize talking about feelings, stress, and support. Model self-care and show that seeking help is strength, not weakness. Your awareness and empathy create a foundation of safety.",
        future: "Five years from now, the emotional resilience you're nurturing today will help your child face challenges with confidence and compassion. The tools you give them now—awareness, expression, support—become lifelong strengths."
      },
      'Love': {
        validation: "You've explored your child's early romantic feelings—a tender, complex part of growing up. Your thoughtfulness about this stage shows the care you bring to supporting their emotional journey.",
        advice: "Keep creating space for open conversations about feelings, boundaries, and respect. Your guidance now helps them understand healthy relationships. Balance trust with gentle wisdom, and let them learn with your support nearby.",
        future: "Five years from now, the foundation you're building—teaching respect, empathy, and self-worth—will shape how your child approaches love and relationships. The conversations you have now become their inner voice later."
      },
      'Friends': {
        validation: "You've reflected on your child's friendships—the bonds that shape so much of their world. Every question you've considered shows how deeply you care about their social connections and belonging.",
        advice: "Keep encouraging healthy friendships while giving them space to navigate their own social world. Teach them about loyalty, boundaries, and choosing friends who lift them up. Your support helps them build confidence in who they are.",
        future: "Five years from now, the friendship skills they're learning—loyalty, conflict resolution, standing up for themselves—will serve them in college, work, and life. The foundation you help build now shapes how they connect with others forever."
      },
      'Online Life': {
        validation: "You've navigated questions about screens, internet use, and digital boundaries—one of parenting's newest challenges. Your thoughtfulness about this space shows your commitment to keeping your child safe while preparing them for a connected world.",
        advice: "Keep the conversation open about what they see and do online. Set boundaries with empathy, explaining the 'why' behind rules. Model healthy tech habits yourself. Balance protection with teaching them to navigate digital spaces wisely.",
        future: "Five years from now, the digital literacy and self-regulation you're teaching now will help them use technology as a tool, not a trap. The boundaries and conversations you establish today become their internal compass online."
      },
      'Parenting': {
        validation: "You've shared your feelings and experiences as a parent—the hopes, challenges, learning curves, and moments of doubt. Every reflection you've offered shows the depth of care and self-awareness you bring to this journey.",
        advice: "Keep being honest with yourself about what's hard and what brings you joy. Parenting is a learning process, and asking for support is strength. Trust your instincts, stay curious, and give yourself grace as you grow alongside your child.",
        future: "Five years from now, you'll look back on this time and see how much you've grown. The self-awareness, resilience, and love you're cultivating now will carry you through every stage. You're building not just their future, but your own evolution too."
      }
    }

    return summaries[categoryName] || {
      validation: "You've completed this category and shared your thoughts. Every response reflects your unique perspective and experience.",
      advice: "Keep engaging with these important topics. Your awareness and thoughtfulness matter.",
      future: "Five years from now, the reflection you're doing today will shape how you approach these areas of life. Every conversation and choice builds the foundation for tomorrow."
    }
  }

  const handleShare = () => {
    const shareText = `I just shared my thoughts on ${categoryName} at My World My Say!\n\nSee what parents are saying: https://parents-chinese.myworldmysay.com`
    
    navigator.clipboard.writeText(shareText).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      alert('Failed to copy link. Please try again.')
    })
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading summary...</div>
        <div style={styles.loadingSpinner}></div>
      </div>
    )
  }

  const summary = getSummaryContent()

  return (
    <div style={styles.container}>
      <HamburgerMenu />

      <div style={styles.contentWrapper}>
        <div style={styles.headerSection}>
          <div style={styles.sparkleIcon}>✨</div>
          <h1 style={styles.pageTitle}>Your {categoryName} Summary</h1>
          <p style={styles.subtitle}>A reflection on your responses</p>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Validation</h3>
            <p style={styles.sectionText}>{summary.validation}</p>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Advice</h3>
            <p style={styles.sectionText}>{summary.advice}</p>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Five Years Later</h3>
            <p style={styles.sectionText}>{summary.future}</p>
          </div>
        </div>

        {/* Music Suggestion */}
        <div style={styles.musicNote}>
          <span style={styles.musicNoteIcon}>🎵</span>
          <span style={styles.musicNoteText}>
            Soundtrack for this moment: 
            <button 
              style={styles.musicLink}
              onClick={() => navigate('/soundtrack?playlist=5 Years Later')}
            >
              5 Years Later
            </button>
          </span>
        </div>

        <div style={styles.futureNote}>
          <span style={styles.futureNoteIcon}>✨</span>
          <span style={styles.futureNoteText}>✨ More detailed personalized summaries coming soon!</span>
        </div>

        <div style={styles.buttonsContainer}>
          <button
            style={styles.shareButton}
            onClick={handleShare}
          >
            {copySuccess ? '✓ Copied!' : '📋 Share Link'}
          </button>

          <button
            style={styles.backButton}
            onClick={() => navigate('/')}
          >
            ← Back to Categories
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

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

  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0A0F2B 0%, #1A1F3B 100%)',
    gap: '20px'
  },

  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    fontWeight: '500'
  },

  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #FFD700',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  contentWrapper: {
    width: '100%',
    maxWidth: '800px',
    marginTop: '40px',
    marginBottom: '40px'
  },

  headerSection: {
    textAlign: 'center',
    marginBottom: '40px'
  },

  sparkleIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'sparkle 2s ease-in-out infinite'
  },

  pageTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
  },

  subtitle: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic'
  },

  summaryCard: {
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%)',
    borderRadius: '20px',
    padding: '40px',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    marginBottom: '30px'
  },

  section: {
    marginBottom: '30px'
  },

  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: '15px',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
  },

  sectionText: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'rgba(255, 255, 255, 0.9)',
    whiteSpace: 'pre-line'
  },

  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
    marginBottom: '30px'
  },

  musicNote: {
    textAlign: 'center',
    padding: '15px',
    background: 'rgba(78, 205, 196, 0.1)',
    borderRadius: '15px',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    marginBottom: '20px'
  },

  musicNoteIcon: {
    fontSize: '20px',
    marginRight: '10px'
  },

  musicNoteText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500'
  },

  musicLink: {
    background: 'none',
    border: 'none',
    color: '#4ECDC4',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '5px',
    padding: '0',
    transition: 'all 0.2s ease'
  },

  futureNote: {
    textAlign: 'center',
    padding: '15px',
    background: 'rgba(255, 215, 0, 0.1)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    marginBottom: '30px'
  },

  futureNoteIcon: {
    fontSize: '20px',
    marginRight: '10px'
  },

  futureNoteText: {
    fontSize: '16px',
    color: '#FFD700',
    fontWeight: '600',
    fontStyle: 'italic'
  },

  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center'
  },

  shareButton: {
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0A0F2B',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
    minWidth: '250px'
  },

  backButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '250px'
  }
}

export default Summary

