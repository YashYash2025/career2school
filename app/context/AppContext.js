'use client'
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state for the application
const initialState = {
  // User management
  user: {
    isLoggedIn: false,
    userData: null,
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true
    }
  },
  
  // Assessment management
  assessments: {
    current: null,
    history: [],
    progress: 0,
    results: null
  },
  
  // Career data
  careers: {
    recommended: [],
    favorites: [],
    explored: []
  },
  
  // UI state
  ui: {
    loading: false,
    errors: [],
    notifications: [],
    modals: {
      login: false,
      assessment: false,
      results: false
    }
  },
  
  // Performance monitoring
  performance: {
    pageLoadTimes: {},
    userInteractions: [],
    errors: []
  }
}

// Action types
export const ACTION_TYPES = {
  // User actions
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  
  // Assessment actions
  START_ASSESSMENT: 'START_ASSESSMENT',
  UPDATE_ASSESSMENT_PROGRESS: 'UPDATE_ASSESSMENT_PROGRESS',
  COMPLETE_ASSESSMENT: 'COMPLETE_ASSESSMENT',
  SAVE_ASSESSMENT_RESULTS: 'SAVE_ASSESSMENT_RESULTS',
  
  // Career actions
  SET_RECOMMENDED_CAREERS: 'SET_RECOMMENDED_CAREERS',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  MARK_CAREER_EXPLORED: 'MARK_CAREER_EXPLORED',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  ADD_ERROR: 'ADD_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  
  // Performance actions
  LOG_PAGE_LOAD_TIME: 'LOG_PAGE_LOAD_TIME',
  LOG_USER_INTERACTION: 'LOG_USER_INTERACTION',
  LOG_ERROR: 'LOG_ERROR'
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          userData: action.payload
        }
      }
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: {
          ...initialState.user,
          preferences: state.user.preferences
        },
        assessments: initialState.assessments,
        careers: initialState.careers
      }
    
    case ACTION_TYPES.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload
          }
        }
      }
    
    case ACTION_TYPES.START_ASSESSMENT:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          current: action.payload,
          progress: 0
        }
      }
    
    case ACTION_TYPES.UPDATE_ASSESSMENT_PROGRESS:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          progress: action.payload
        }
      }
    
    case ACTION_TYPES.COMPLETE_ASSESSMENT:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          current: null,
          progress: 100,
          history: [...state.assessments.history, action.payload]
        }
      }
    
    case ACTION_TYPES.SAVE_ASSESSMENT_RESULTS:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          results: action.payload
        }
      }
    
    case ACTION_TYPES.SET_RECOMMENDED_CAREERS:
      return {
        ...state,
        careers: {
          ...state.careers,
          recommended: action.payload
        }
      }
    
    case ACTION_TYPES.ADD_TO_FAVORITES:
      return {
        ...state,
        careers: {
          ...state.careers,
          favorites: [...state.careers.favorites, action.payload]
        }
      }
    
    case ACTION_TYPES.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        careers: {
          ...state.careers,
          favorites: state.careers.favorites.filter(id => id !== action.payload)
        }
      }
    
    case ACTION_TYPES.MARK_CAREER_EXPLORED:
      return {
        ...state,
        careers: {
          ...state.careers,
          explored: [...state.careers.explored, action.payload]
        }
      }
    
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload
        }
      }
    
    case ACTION_TYPES.ADD_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          errors: [...state.ui.errors, action.payload]
        }
      }
    
    case ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        ui: {
          ...state.ui,
          errors: []
        }
      }
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, {
            id: Date.now(),
            ...action.payload
          }]
        }
      }
    
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      }
    
    case ACTION_TYPES.TOGGLE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.modal]: action.payload.isOpen
          }
        }
      }
    
    case ACTION_TYPES.LOG_PAGE_LOAD_TIME:
      return {
        ...state,
        performance: {
          ...state.performance,
          pageLoadTimes: {
            ...state.performance.pageLoadTimes,
            [action.payload.page]: action.payload.time
          }
        }
      }
    
    case ACTION_TYPES.LOG_USER_INTERACTION:
      return {
        ...state,
        performance: {
          ...state.performance,
          userInteractions: [
            ...state.performance.userInteractions.slice(-49), // Keep last 50 interactions
            action.payload
          ]
        }
      }
    
    case ACTION_TYPES.LOG_ERROR:
      return {
        ...state,
        performance: {
          ...state.performance,
          errors: [
            ...state.performance.errors.slice(-19), // Keep last 20 errors
            action.payload
          ]
        }
      }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  // Load saved state from localStorage
  useEffect(() => {
    console.log('🔄 AppProvider: Loading state from localStorage...')
    try {
      const savedUserData = localStorage.getItem('userData')
      const savedToken = localStorage.getItem('userToken')
      const savedPreferences = localStorage.getItem('userPreferences')
      
      console.log('📦 Found in localStorage:', {
        hasUserData: !!savedUserData,
        hasToken: !!savedToken,
        userData: savedUserData ? JSON.parse(savedUserData) : null
      })
      
      if (savedUserData && savedToken) {
        const userData = JSON.parse(savedUserData)
        console.log('✅ Dispatching LOGIN_SUCCESS with:', userData)
        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: userData
        })
      } else {
        console.log('⚠️ No user data found in localStorage')
      }
      
      if (savedPreferences) {
        dispatch({
          type: ACTION_TYPES.UPDATE_USER_PREFERENCES,
          payload: JSON.parse(savedPreferences)
        })
      }
    } catch (error) {
      console.error('❌ Error loading saved state:', error)
    }
  }, [])
  
  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(state.user.preferences))
  }, [state.user.preferences])
  
  // Action creators
  const actions = {
    // User actions
    login: (userData) => {
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('userToken', userData.token)
      dispatch({ type: ACTION_TYPES.LOGIN_SUCCESS, payload: userData })
    },
    
    logout: () => {
      localStorage.removeItem('userData')
      localStorage.removeItem('userToken')
      dispatch({ type: ACTION_TYPES.LOGOUT })
    },
    
    updatePreferences: (preferences) => {
      dispatch({ type: ACTION_TYPES.UPDATE_USER_PREFERENCES, payload: preferences })
    },
    
    // Assessment actions
    startAssessment: (assessmentData) => {
      dispatch({ type: ACTION_TYPES.START_ASSESSMENT, payload: assessmentData })
    },
    
    updateProgress: (progress) => {
      dispatch({ type: ACTION_TYPES.UPDATE_ASSESSMENT_PROGRESS, payload: progress })
    },
    
    completeAssessment: (assessmentData) => {
      dispatch({ type: ACTION_TYPES.COMPLETE_ASSESSMENT, payload: assessmentData })
    },
    
    saveResults: (results) => {
      dispatch({ type: ACTION_TYPES.SAVE_ASSESSMENT_RESULTS, payload: results })
    },
    
    // Career actions
    setRecommendedCareers: (careers) => {
      dispatch({ type: ACTION_TYPES.SET_RECOMMENDED_CAREERS, payload: careers })
    },
    
    addToFavorites: (careerId) => {
      dispatch({ type: ACTION_TYPES.ADD_TO_FAVORITES, payload: careerId })
    },
    
    removeFromFavorites: (careerId) => {
      dispatch({ type: ACTION_TYPES.REMOVE_FROM_FAVORITES, payload: careerId })
    },
    
    markCareerExplored: (careerId) => {
      dispatch({ type: ACTION_TYPES.MARK_CAREER_EXPLORED, payload: careerId })
    },
    
    // UI actions
    setLoading: (loading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading })
    },
    
    addError: (error) => {
      dispatch({ type: ACTION_TYPES.ADD_ERROR, payload: error })
    },
    
    clearErrors: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERRORS })
    },
    
    addNotification: (notification) => {
      dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification })
    },
    
    removeNotification: (id) => {
      dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id })
    },
    
    toggleModal: (modal, isOpen) => {
      dispatch({ type: ACTION_TYPES.TOGGLE_MODAL, payload: { modal, isOpen } })
    },
    
    // Performance actions
    logPageLoadTime: (page, time) => {
      dispatch({ type: ACTION_TYPES.LOG_PAGE_LOAD_TIME, payload: { page, time } })
    },
    
    logUserInteraction: (interaction) => {
      dispatch({ type: ACTION_TYPES.LOG_USER_INTERACTION, payload: {
        ...interaction,
        timestamp: Date.now()
      } })
    },
    
    logError: (error) => {
      dispatch({ type: ACTION_TYPES.LOG_ERROR, payload: {
        ...error,
        timestamp: Date.now()
      } })
    }
  }
  
  const value = {
    state,
    actions
  }
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

// Selectors for easier state access
export const selectors = {
  isLoggedIn: (state) => state.user.isLoggedIn,
  getUserData: (state) => state.user.userData,
  getLanguage: (state) => state.user.preferences.language,
  getTheme: (state) => state.user.preferences.theme,
  isLoading: (state) => state.ui.loading,
  getErrors: (state) => state.ui.errors,
  getNotifications: (state) => state.ui.notifications,
  getCurrentAssessment: (state) => state.assessments.current,
  getAssessmentProgress: (state) => state.assessments.progress,
  getRecommendedCareers: (state) => state.careers.recommended,
  getFavoriteCareers: (state) => state.careers.favorites,
  getModalState: (state, modal) => state.ui.modals[modal]
}

export default AppContext